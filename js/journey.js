// 台灣進香地圖 — 個人進香之路儲存核心(v1.x,D4:localStorage,無後端)
//
// 資料模型(docs/CONCEPT.md「三、資料模型草案」):
//   一筆紀錄 = 一次參拜(同一廟可多筆):
//   { key, name, deity, lat, lng, visitedAt(ISO 時間), note }
//     key: 精選廟 "t{id}" / 底圖廟 "m{sourceId}" / 匯入無對應 "x{n}"
//
// 匯出:
//   JSON —— 完整備份(含 note),匯入時逐筗合併(同 key+visitedAt 視為同一筆)
//   GPX  —— wpt(每筆參拜,含時間/名稱/備註)+ trk(依時間排序的足跡線)
// 匯入:
//   JSON 解析合併;GPX 解析 wpt 還原紀錄(無法對應廟宇時以名稱+座標立 x-key)
//
// 變更後 dispatch window 'journeyChanged' 事件供圖層/面板更新。

const JOURNEY_STORAGE_KEY = 'pilgrim-map-journey-v1';

function journeyLoad() {
  try {
    const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error('journey storage read failed:', e);
    return [];
  }
}

function journeySave(records) {
  localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(records));
}

function journeyNotify() {
  window.dispatchEvent(new CustomEvent('journeyChanged'));
}

// ---------- 基本 CRUD ----------

function journeyList() {
  return journeyLoad();
}

function journeyAdd(entry) {
  const records = journeyLoad();
  records.push({
    key: entry.key,
    name: entry.name,
    deity: entry.deity || '',
    lat: entry.lat,
    lng: entry.lng,
    visitedAt: entry.visitedAt || new Date().toISOString(),
    note: entry.note || ''
  });
  journeySave(records);
  journeyNotify();
  return records.length;
}

function journeyRemove(key, visitedAt) {
  let records = journeyLoad();
  records = records.filter(r => !(r.key === key && r.visitedAt === visitedAt));
  journeySave(records);
  journeyNotify();
}

function journeyClear() {
  journeySave([]);
  journeyNotify();
}

/** 已參拜的 key 集合(Set) */
function journeyVisitedKeys() {
  return new Set(journeyLoad().map(r => r.key));
}

/** 依時間排序的全部紀錄(足跡線用) */
function journeyOrdered() {
  return journeyLoad().slice().sort((a, b) => a.visitedAt.localeCompare(b.visitedAt));
}

// ---------- 統計 ----------

function journeyStats() {
  const records = journeyLoad();
  const temples = new Set(records.map(r => r.key));
  const byDeity = {};
  const byRegionYear = {};
  let first = null, last = null;
  records.forEach(r => {
    if (r.deity) byDeity[r.deity] = (byDeity[r.deity] || 0) + 1;
    if (first === null || r.visitedAt < first) first = r.visitedAt;
    if (last === null || r.visitedAt > last) last = r.visitedAt;
  });
  return {
    visits: records.length,
    temples: temples.size,
    byDeity,
    first,
    last,
    records
  };
}

// ---------- JSON 匯入匯出 ----------

function journeyExportJSON() {
  const payload = {
    app: 'taiwan-pilgrim-map',
    version: 1,
    exportedAt: new Date().toISOString(),
    records: journeyLoad()
  };
  return JSON.stringify(payload, null, 2);
}

/** 匯入 JSON 文字;回傳 {added, total} */
function journeyImportJSON(text) {
  const data = JSON.parse(text);
  if (!Array.isArray(data.records)) throw new Error('格式錯誤:缺少 records 陣列');
  const records = journeyLoad();
  // 身分判定:key+時間(同源)或 名稱+時間(GPX 往返不攜帶 key)皆視為同一筆
  const seen = new Set();
  records.forEach(r => {
    seen.add(r.key + '|' + r.visitedAt);
    seen.add(r.name + '|' + r.visitedAt);
  });
  let added = 0;
  data.records.forEach(r => {
    if (!r || r.key == null || r.visitedAt == null) return;
    if (seen.has(r.key + '|' + r.visitedAt) || seen.has(r.name + '|' + r.visitedAt)) return;
    seen.add(r.key + '|' + r.visitedAt);
    seen.add(r.name + '|' + r.visitedAt);
    records.push({
      key: r.key, name: r.name || '(未命名)', deity: r.deity || '',
      lat: Number(r.lat), lng: Number(r.lng),
      visitedAt: r.visitedAt, note: r.note || ''
    });
    added++;
  });
  journeySave(records);
  journeyNotify();
  return { added, total: records.length };
}

// ---------- GPX 匯入匯出 ----------

function gpxEscape(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function journeyExportGPX() {
  const ordered = journeyOrdered();
  const wpts = ordered.map(r =>
    `  <wpt lat="${r.lat}" lon="${r.lng}">` +
    `<time>${r.visitedAt}</time>` +
    `<name>${gpxEscape(r.name)}</name>` +
    (r.note ? `<desc>${gpxEscape(r.note)}</desc>` : '') +
    `</wpt>`
  ).join('\n');
  const trkpts = ordered.map(r =>
    `      <trkpt lat="${r.lat}" lon="${r.lng}"><time>${r.visitedAt}</time></trkpt>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Taiwan Pilgrim Map" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>進香足跡</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
${wpts}
  <trk>
    <name>進香路線(依參拜時間排序)</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>
`;
}

/** 匯入 GPX 文字(解析 wpt);回傳 {added, total} */
function journeyImportGPX(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('GPX 解析失敗');
  const records = journeyLoad();
  // GPX 不攜帶內部 key,以身分(name+時間 / 既有 key+時間)去重
  const seen = new Set();
  records.forEach(r => {
    seen.add(r.key + '|' + r.visitedAt);
    seen.add(r.name + '|' + r.visitedAt);
  });
  let added = 0, seq = 0;
  doc.querySelectorAll('wpt').forEach(w => {
    const lat = parseFloat(w.getAttribute('lat'));
    const lon = parseFloat(w.getAttribute('lon'));
    if (Number.isNaN(lat) || Number.isNaN(lon)) return;
    const name = w.querySelector('name') ? w.querySelector('name').textContent : '(未命名)';
    const timeEl = w.querySelector('time');
    const visitedAt = timeEl ? timeEl.textContent.trim() : new Date().toISOString();
    const note = w.querySelector('desc') ? w.querySelector('desc').textContent : '';
    if (seen.has(name + '|' + visitedAt)) return;
    seen.add(name + '|' + visitedAt);
    const key = 'x' + (seq++);
    records.push({ key, name, deity: '', lat, lng: lon, visitedAt, note });
    added++;
  });
  journeySave(records);
  journeyNotify();
  return { added, total: records.length };
}

window.journeyModule = {
  list: journeyList,
  add: journeyAdd,
  remove: journeyRemove,
  clear: journeyClear,
  visitedKeys: journeyVisitedKeys,
  ordered: journeyOrdered,
  stats: journeyStats,
  exportJSON: journeyExportJSON,
  importJSON: journeyImportJSON,
  exportGPX: journeyExportGPX,
  importGPX: journeyImportGPX
};
