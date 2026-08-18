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
const RELATIONS = ['分香', '謁祖進香', '割火', '遶境', '承繼'];
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
  const { lineages } = loadGlobal(lineagePath, ['lineages']);
  lineageCount = lineages.length;
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

// ---------- report ----------
console.log(`temples: ${temples.length} 筆`);
if (lineageCount) console.log(`lineages: ${lineageCount} 筆`);
warnings.forEach(w => console.warn(`  [warn] ${w}`));
if (errors.length) {
  errors.forEach(e => console.error(`  [error] ${e}`));
  console.error(`\n驗證失敗:${errors.length} 錯誤、${warnings.length} 警告`);
  process.exit(1);
}
console.log(`\n驗證通過:0 錯誤、${warnings.length} 警告`);
