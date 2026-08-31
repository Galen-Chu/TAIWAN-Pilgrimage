#!/usr/bin/env node
// 台灣進香地圖 — 資料驗證腳本(無外部依賴)
// 用法:node tools/validate-data.js
// 檢查 data/temples.js(必要)與 data/lineage.js(若存在)的結構完整性與參照完整性

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function loadGlobal(filePath, varNames) {
  const src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('�')) {
    console.error(`[error] ${filePath} 含損壞字元(U+FFFD),請修復後再驗證`);
    process.exit(1);
  }
  const fn = new Function(src + `\n;return {${varNames.join(', ')}};`);
  return fn();
}

const LANDING_TYPES = ['歷史登陸點', '開基廟', '祖廟', '分香子廟'];
const REGIONS = ['North', 'Central', 'South', 'East', 'Islands'];
const RELATIONS = ['分香', '謁祖進香', '割火', '遶境', '承繼', '法脈'];
const STATUSES = ['確定', '存爭議', '待查'];

const errors = [];
const warnings = [];

// ---------- temples ----------
const { temples } = loadGlobal(path.join(dataDir, 'temples.js'), ['temples']);
const ids = new Set();

temples.forEach(t => {
  const loc = `temples[id=${t.id ?? '?'}]`;
  if (t.id == null || ids.has(t.id)) {
    errors.push(`${loc}: id 缺失或重複`);
    return;
  }
  ids.add(t.id);

  for (const f of ['nameZh', 'mainDeity', 'addressZh', 'region']) {
    if (!t[f]) errors.push(`${loc}: 缺少必填欄位 ${f}`);
  }
  if (typeof t.lat !== 'number' || typeof t.lng !== 'number') {
    errors.push(`${loc}: lat/lng 必須是數字`);
  } else {
    if (t.lat < 21 || t.lat > 26.6) errors.push(`${loc}: lat 超出台灣範圍 (${t.lat})`);
    if (t.lng < 118 || t.lng > 122.1) errors.push(`${loc}: lng 超出台灣範圍 (${t.lng})`);
  }
  if (!REGIONS.includes(t.region)) warnings.push(`${loc}: 非預期 region "${t.region}"`);
  if (t.landingType && !LANDING_TYPES.includes(t.landingType)) {
    errors.push(`${loc}: 未知 landingType "${t.landingType}"`);
  }
  if (t.landingType && !t.nameEn) {
    warnings.push(`${loc}: 精選落地點建議提供 nameEn(D6 語言政策)`);
  }
  if (t.foundedYear != null && (t.foundedYear < 1500 || t.foundedYear > 2030)) {
    errors.push(`${loc}: foundedYear 異常 (${t.foundedYear})`);
  }
  if (t.lodging && !t.lodging.nameZh) errors.push(`${loc}: lodging 缺 nameZh`);
});

// ---------- lineage (optional) ----------
const lineagePath = path.join(dataDir, 'lineage.js');
let lineageCount = 0;
if (fs.existsSync(lineagePath)) {
  const { lineages, externalNodes } = loadGlobal(lineagePath, ['lineages', 'externalNodes']);
  lineageCount = lineages.length;
  const externalCoords = new Set((externalNodes || []).map(n => n.name));
  const seenIds = new Set();

  lineages.forEach((l, i) => {
    const loc = `lineages[id=${l.id ?? i}]`;
    if (l.id == null || seenIds.has(l.id)) {
      errors.push(`${loc}: id 缺失或重複`);
      return;
    }
    seenIds.add(l.id);

    // from: exactly one of fromTempleId / fromExternalName
    const hasFromId = l.fromTempleId != null;
    const hasFromExt = Boolean(l.fromExternalName);
    if (hasFromId === hasFromExt) {
      errors.push(`${loc}: fromTempleId 與 fromExternalName 必須恰好擇一`);
      return;
    }
    if (hasFromId && !ids.has(l.fromTempleId)) {
      errors.push(`${loc}: fromTempleId ${l.fromTempleId} 不存在於 temples`);
    }
    if (!Number.isInteger(l.toTempleId) || !ids.has(l.toTempleId)) {
      errors.push(`${loc}: toTempleId ${l.toTempleId} 不存在於 temples`);
      return;
    }
    if (hasFromExt && !externalCoords.has(l.fromExternalName)) {
      warnings.push(`${loc}: 外部源頭 "${l.fromExternalName}" 缺座標(externalNodes),源流線無法繪製`);
    }
    if (l.fromTempleId === l.toTempleId) errors.push(`${loc}: 不可自我連結`);
    if (!RELATIONS.includes(l.relation)) errors.push(`${loc}: 未知 relation "${l.relation}"`);
    if (!STATUSES.includes(l.status)) errors.push(`${loc}: 未知 status "${l.status}"`);
    if (!l.source) warnings.push(`${loc}: 缺少 source 出處`);

    const from = hasFromId ? temples.find(t => t.id === l.fromTempleId) : null;
    const to = temples.find(t => t.id === l.toTempleId);
    if (from && to && from.mainDeity !== to.mainDeity) {
      warnings.push(`${loc}: 兩端 mainDeity 不同(${from.mainDeity} → ${to.mainDeity}),請確認為有意連結`);
    }
  });
}

// ---------- deities registry (optional) ----------
const deitiesPath = path.join(dataDir, 'deities.js');
let registryCount = 0;
if (fs.existsSync(deitiesPath)) {
  const { deityRegistry } = loadGlobal(deitiesPath, ['deityRegistry']);
  registryCount = deityRegistry.length;
  const canonicals = new Set();
  const aliasOwner = new Map();
  deityRegistry.forEach(e => {
    const loc = `deities[${e.canonical ?? '?'}]`;
    if (!e.canonical) { errors.push(`${loc}: 缺 canonical`); return; }
    if (canonicals.has(e.canonical)) errors.push(`${loc}: canonical 重複`);
    canonicals.add(e.canonical);
    if (!e.matchPattern) {
      errors.push(`${loc}: 缺 matchPattern`);
    } else {
      try { new RegExp(e.matchPattern); } catch (err) { errors.push(`${loc}: matchPattern 無效 (${err.message})`); }
    }
    (e.aliases || []).forEach(a => {
      if (aliasOwner.has(a) && aliasOwner.get(a) !== e.canonical) {
        errors.push(`${loc}: 別名 "${a}" 與 "${aliasOwner.get(a)}" 重複`);
      }
      aliasOwner.set(a, e.canonical);
    });
  });
  temples.forEach(t => {
    if (!canonicals.has(t.mainDeity)) {
      warnings.push(`temples[id=${t.id}]: mainDeity "${t.mainDeity}" 不在註冊表(將以原名自成一組)`);
    }
  });
}

// ---------- moi-temples (generated base layer, optional) ----------
const moiPath = path.join(dataDir, 'moi-temples.js');
let moiCount = 0;
if (fs.existsSync(moiPath)) {
  const { moiTemples } = loadGlobal(moiPath, ['moiTemples']);
  moiCount = moiTemples.length;
  let structural = 0, coordRange = 0, badRegion = 0, noCoord = 0;
  moiTemples.forEach(t => {
    // mainDeityRaw 允許空字串(源頭未記載,依 D9 原名保留原則不補寫)
    if (!t.nameZh || !Array.isArray(t.deitySystems) || !t.primarySystem) structural++;
    if (t.lat == null || t.lng == null) noCoord++;
    else if (t.lat < 21 || t.lat > 26.6 || t.lng < 118 || t.lng > 122.1) coordRange++;
    if (t.region != null && !REGIONS.includes(t.region)) badRegion++;
  });
  if (structural) errors.push(`moi-temples: ${structural} 筆結構不完整`);
  if (coordRange) errors.push(`moi-temples: ${coordRange} 筆座標超出台灣範圍`);
  if (badRegion) errors.push(`moi-temples: ${badRegion} 筆 region 非預期值`);
  if (moiCount === 0) errors.push('moi-temples: 0 筆(請重新執行 node tools/import-moi-data.js)');
  if (noCoord) console.log(`moi-temples: ${noCoord} 筆無座標(來源即缺,可接受)`);
}

// ---------- report ----------
console.log(`temples: ${temples.length} 筆`);
if (lineageCount) console.log(`lineages: ${lineageCount} 筆`);
if (registryCount) console.log(`deities registry: ${registryCount} 系統`);
if (moiCount) console.log(`moi-temples: ${moiCount} 筆(全量底層,generated)`);
warnings.forEach(w => console.warn(`  [warn] ${w}`));
if (errors.length) {
  errors.forEach(e => console.error(`  [error] ${e}`));
  console.error(`\n驗證失敗:${errors.length} 錯誤、${warnings.length} 警告`);
  process.exit(1);
}
console.log(`\n驗證通過:0 錯誤、${warnings.length} 警告`);
