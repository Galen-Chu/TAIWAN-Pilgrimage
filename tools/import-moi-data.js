#!/usr/bin/env node
// 台灣進香地圖 — 內政部 8203 全量資料匯入管線(無外部依賴)
// 用法:node tools/import-moi-data.js
//
// 輸入:data/raw/temple.xml(缺檔時自動自 religion.moi.gov.tw 下載;data/raw/ 已 gitignore)
// 輸出:
//   data/moi-temples.js   全量廟宇底層資料(generated,含授權標示,進版控)
//   data/raw/deity-names-report.tsv  全部主祀神名 + 出現次數 + 歸類結果(不進版控)
//
// 政策(D9):保留原始主祀神名(mainDeityRaw);deitySystems 僅為歸類,
//           未比對名稱以原名自成一組,輸出於報告供 deities.js 擴充。

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RAW_PATH = path.join(ROOT, 'data', 'raw', 'temple.xml');
const OUT_PATH = path.join(ROOT, 'data', 'moi-temples.js');
const REPORT_PATH = path.join(ROOT, 'data', 'raw', 'deity-names-report.tsv');
const SOURCE_URL = 'https://religion.moi.gov.tw/Report/temple.xml';

// ---------- 縣市 → 區域(行政區欄位,臺/台皆有) ----------
const COUNTY_REGION = {
  '台北市': 'North', '新北市': 'North', '基隆市': 'North', '桃園市': 'North', '桃園縣': 'North',
  '新竹市': 'North', '新竹縣': 'North', '宜蘭縣': 'North',
  '苗栗縣': 'Central', '台中市': 'Central', '彰化縣': 'Central', '南投縣': 'Central', '雲林縣': 'Central',
  '嘉義市': 'South', '嘉義縣': 'South', '台南市': 'South', '高雄市': 'South', '屏東縣': 'South',
  '花蓮縣': 'East', '台東縣': 'East',
  '澎湖縣': 'Islands', '金門縣': 'Islands', '連江縣': 'Islands'
};

function decodeXmlEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&'); // &amp; last
}

async function ensureRawFile() {
  if (fs.existsSync(RAW_PATH)) return;
  console.log(`raw 檔不存在,下載中: ${SOURCE_URL}`);
  const res = await fetch(SOURCE_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (pilgrim-map import pipeline)' } });
  if (!res.ok) throw new Error(`下載失敗: HTTP ${res.status}`);
  fs.mkdirSync(path.dirname(RAW_PATH), { recursive: true });
  fs.writeFileSync(RAW_PATH, await res.text(), 'utf8');
  console.log(`已下載 ${fs.statSync(RAW_PATH).size} bytes`);
}

function parseRecords(xml) {
  const records = [];
  const re = /<OpenData_3>([\s\S]*?)<\/OpenData_3>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const field = (name) => {
      const fm = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
      return fm ? decodeXmlEntities(fm[1].trim()) : '';
    };
    records.push({
      sourceId: field('編號'),
      nameZh: field('寺廟名稱'),
      mainDeityRaw: field('主祀神祇'),
      county: field('行政區'),
      addressZh: field('地址'),
      religion: field('教別'),
      phone: field('電話'),
      x: field('WGS84X'),
      y: field('WGS84Y')
    });
  }
  return records;
}

function loadRegistry() {
  const src = fs.readFileSync(path.join(ROOT, 'data', 'deities.js'), 'utf8');
  const fn = new Function(src + '\n;return { deityRegistry };');
  const { deityRegistry } = fn();
  return deityRegistry.map(e => ({ ...e, regex: new RegExp(e.matchPattern) }));
}

function classify(mainDeityRaw, registry) {
  const hits = [];
  for (const e of registry) {
    const m = mainDeityRaw.match(e.regex);
    if (m) hits.push({ canonical: e.canonical, at: m.index });
  }
  hits.sort((a, b) => a.at - b.at);
  return {
    deitySystems: hits.map(h => h.canonical),
    primarySystem: hits.length ? hits[0].canonical : mainDeityRaw || '未記載'
  };
}

(async () => {
  await ensureRawFile();
  const xml = fs.readFileSync(RAW_PATH, 'utf8');
  const registry = loadRegistry();
  const records = parseRecords(xml);
  if (records.length === 0) throw new Error('解析到 0 筆資料,請檢查 XML 結構');

  const out = [];
  const nameStats = new Map(); // mainDeityRaw -> { count, systems }
  let noCoord = 0, noRegion = 0, noName = 0, badCoord = 0, noDeity = 0;

  for (const r of records) {
    let lat = r.y ? parseFloat(r.y) : null;
    let lng = r.x ? parseFloat(r.x) : null;
    if (lat != null && Number.isNaN(lat)) lat = null;
    if (lng != null && Number.isNaN(lng)) lng = null;
    // 源頭座標異常(如 0,0)視同缺座標,不輸出
    if (lat != null && lng != null && (lat < 21 || lat > 26.6 || lng < 118 || lng > 122.1)) {
      badCoord++;
      lat = null;
      lng = null;
    }
    if (lat == null || lng == null) noCoord++;
    const countyNorm = r.county.replace(/^臺/, '台');
    const region = COUNTY_REGION[countyNorm] || null;
    if (!region) noRegion++;
    if (!r.nameZh) noName++;
    if (!r.mainDeityRaw) noDeity++;
    const { deitySystems, primarySystem } = classify(r.mainDeityRaw, registry);

    if (!nameStats.has(r.mainDeityRaw)) {
      nameStats.set(r.mainDeityRaw, { count: 0, systems: deitySystems.join('+') || 'UNMATCHED' });
    }
    nameStats.get(r.mainDeityRaw).count++;

    out.push({
      sourceId: r.sourceId,
      nameZh: r.nameZh,
      mainDeityRaw: r.mainDeityRaw,
      deitySystems: deitySystems.length ? deitySystems : [primarySystem],
      primarySystem,
      addressZh: r.addressZh,
      religion: r.religion,
      region,
      phone: r.phone || null,
      lat,
      lng
    });
  }

  // ---------- 輸出 data/moi-temples.js ----------
  const header = `// !! 此檔由 tools/import-moi-data.js 產生,請勿手動編輯 !!
// 來源:內政部「全國宗教資訊系統資料-寺廟」(data.gov.tw dataset/8203)
//       https://religion.moi.gov.tw/Report/temple.xml
// 授權:政府資料開放授權條款-第1版(散布請標示上開出處)
// 政策:mainDeityRaw 為原始主祀神名(一律保留);deitySystems/primarySystem
//       為依 data/deities.js 之分類,未比對者以原名自成一組(D9 原名保留)
// 產生時間:${new Date().toISOString()} / 筆數:${out.length}
// 重新產生:node tools/import-moi-data.js

const moiTemples = `;

  fs.writeFileSync(OUT_PATH, header + JSON.stringify(out) + ';\n', 'utf8');

  // ---------- 輸出神名報告 ----------
  const reportLines = ['主祀神名稱\t筆數\t歸類系統'];
  [...nameStats.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([name, s]) => reportLines.push(`${name}\t${s.count}\t${s.systems}`));
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, reportLines.join('\n') + '\n', 'utf8');

  // ---------- 統計 ----------
  const matchedRecords = out.filter(r => r.mainDeityRaw && nameStats.get(r.mainDeityRaw).systems !== 'UNMATCHED').length;
  const sixSystems = ['媽祖', '關聖帝君', '玉皇大帝', '觀音菩薩', '地藏菩薩', '阿彌陀佛'];
  console.log(`總筆數: ${out.length}`);
  console.log(`有座標: ${out.length - noCoord} (${((out.length - noCoord) / out.length * 100).toFixed(1)}%),缺座標: ${noCoord}(其中源頭座標異常歸零: ${badCoord})`);
  console.log(`區域未知: ${noRegion},名稱缺: ${noName},主祀神未記載: ${noDeity}(保留為「未記載」)`);
  console.log(`已歸類筆數: ${matchedRecords},未歸類(原名自成一組): ${out.length - matchedRecords}`);
  console.log(`不同主祀神名: ${nameStats.size} 種`);
  console.log('\n六大源流系統筆數:');
  for (const sys of sixSystems) {
    const n = out.filter(r => r.deitySystems.includes(sys)).length;
    console.log(`  ${sys}: ${n}`);
  }
  console.log('\n未比對前 15 大主祀神名:');
  [...nameStats.entries()]
    .filter(([, s]) => s.systems === 'UNMATCHED')
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .forEach(([name, s]) => console.log(`  ${name}: ${s.count}`));
  console.log(`\n輸出: ${path.relative(ROOT, OUT_PATH)} (${(fs.statSync(OUT_PATH).size / 1048576).toFixed(2)} MB)`);
  console.log(`報告: ${path.relative(ROOT, REPORT_PATH)}`);
})().catch(e => { console.error(e); process.exit(1); });
