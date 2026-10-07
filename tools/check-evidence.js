#!/usr/bin/env node
// 台灣進香地圖 — 源流出處連結健檢(O3)
// 用法:node tools/check-evidence.js [--strict]
//   --strict  有 FAIL 或 WARN 時以非零結束(供 CI/排程用;預設僅報告)
//
// 檢查 data/lineage.js 每筆 evidenceUrl:
//   1. HTTP 可達性(狀態碼、轉址、域名漂移——曾發生 kaitaimazutemple.com 域名易主案例)
//   2. 關鍵字漂移(頁面內容應含終點廟宇名;盡力解碼 UTF-8/Big5/UTF-16LE,
//      解不出或未含時僅回報 WARN,由人工複核——老網站編碼差異是已知情況)
// 需 Node >= 18(全域 fetch)。

const fs = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');
const TIMEOUT_MS = 15000;
const CONCURRENCY = 5;

const dataDir = path.join(__dirname, '..', 'data');

function loadGlobal(filePath, varNames) {
  const src = fs.readFileSync(filePath, 'utf8');
  if (src.includes(String.fromCharCode(0xFFFD))) {
    console.error(`[error] ${filePath} 含損壞字元(U+FFFD),請先修復`);
    process.exit(1);
  }
  const fn = new Function(src + `\n;return {${varNames.join(', ')}};`);
  return fn();
}

const { temples } = loadGlobal(path.join(dataDir, 'temples.js'), ['temples']);
const { lineages } = loadGlobal(path.join(dataDir, 'lineage.js'), ['lineages']);
const templeById = new Map(temples.map(t => [t.id, t]));

// 同一 URL 可能被多筆源流引用:以 URL 為單位檢查一次,回報所有引用筆數
const byUrl = new Map();
lineages.forEach(l => {
  if (!l.evidenceUrl) return;
  if (!byUrl.has(l.evidenceUrl)) byUrl.set(l.evidenceUrl, []);
  const to = templeById.get(l.toTempleId);
  // 關鍵字候選:全名(台南報恩堂)與去地區前綴(報恩堂)——頁面未必帶行政區前綴
  const candidates = to
    ? [to.nameZh, to.nameZh.length >= 4 ? to.nameZh.slice(2) : null].filter(c => c && c.length >= 2)
    : [];
  byUrl.get(l.evidenceUrl).push({
    id: l.id,
    deity: l.deity,
    keyword: to ? to.nameZh : null,
    candidates
  });
});

const DECODERS = ['utf-8', 'big5', 'utf-16le'];

async function checkUrl(url, keywords) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9'
      }
    });

    const result = {
      status: res.status,
      finalUrl: res.url,
      ms: Date.now() - started,
      domainDrift: false,
      keywordHit: null,
      keywordNote: ''
    };
    try {
      const origHost = new URL(url).host;
      const finalHost = new URL(res.url).host;
      result.domainDrift = origHost !== finalHost;
    } catch { /* URL 解析失敗不影響主流程 */ }

    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      let decoded = '';
      let utf8Text = null;
      for (const enc of DECODERS) {
        try {
          const text = new TextDecoder(enc, { fatal: false }).decode(buf);
          if (enc === 'utf-8') utf8Text = text;
          if (keywords.length === 0 || keywords.some(k => text.includes(k))) {
            result.keywordHit = true;
            if (enc !== 'utf-8') result.keywordNote = `(${enc} 解碼)`;
            break;
          }
          decoded = text;
        } catch { /* 換下一種編碼 */ }
      }
      if (result.keywordHit !== true) {
        // 動態渲染頁(政府資料庫常見):靜態抓到的只有 JS 應用外殼,檢字不適用。
        // 以 utf-8 解碼結果判定(decoded 會被 big5/utf-16le 回退解碼覆蓋成亂碼)
        const shell = utf8Text || decoded;
        const spa = shell.length < 2000 ||
          shell.includes('id="app"') || shell.includes('id="root"') ||
          shell.includes('__NUXT__') || shell.includes('ng-app') ||
          shell.includes('/_next/') || shell.includes('__NEXT_DATA__') ||
          ((shell.match(/[一-鿿]/g) || []).length < 50);
        result.keywordHit = false;
        result.keywordNote = decoded ? '' : '(無法解碼頁面)';
        result.dynamicShell = spa;
      }
    }
    return result;
  } catch (err) {
    return { error: String(err && err.cause ? err.cause.code || err.cause : err.message || err), ms: Date.now() - started };
  }
}

function classify(url, refs, r) {
  if (r.error) return { level: 'FAIL', reason: `連線失敗:${r.error}` };
  if (r.status === 403 || r.status === 429) return { level: 'FAIL', reason: `HTTP ${r.status}(常見防爬蟲遮蔽,請以瀏覽器人工複核)` };
  if (r.status >= 400) return { level: 'FAIL', reason: `HTTP ${r.status}` };
  if (r.domainDrift) return { level: 'WARN', reason: `轉址至 ${r.finalUrl}(原域名 ${url} 可能已易主或改址)` };
  if (r.keywordHit === false) {
    if (r.dynamicShell) return { level: 'OK', reason: `HTTP ${r.status} · 動態渲染頁,靜態檢字不適用(連結本身可達)` };
    return { level: 'WARN', reason: `HTTP ${r.status} 但頁面未見關鍵字(${refs.map(x => x.keyword).filter(Boolean).join('/')})${r.keywordNote}——可能改版或編碼差異,請人工複核` };
  }
  return { level: 'OK', reason: `HTTP ${r.status}${r.keywordHit ? ` · 含關鍵字${r.keywordNote}` : ''}` };
}

(async () => {
  const urls = [...byUrl.keys()];
  console.log(`檢查 ${urls.length} 個唯一出處 URL(引用於 ${lineages.filter(l => l.evidenceUrl).length} 筆源流)…\n`);

  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const refs = byUrl.get(url);
      const r = await checkUrl(url, [...new Set(refs.flatMap(x => x.candidates))]);
      results.push({ url, refs, r, verdict: classify(url, refs, r) });
      const level = verdict_emoji(results[results.length - 1].verdict.level);
      process.stdout.write(`[${String(results.length).padStart(2)}/${urls.length}] ${level} ${url}\n`);
    }
  }
  function verdict_emoji(level) { return level === 'OK' ? '✅' : level === 'WARN' ? '⚠️ ' : '❌'; }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));

  results.sort((a, b) => {
    const order = { FAIL: 0, WARN: 1, OK: 2 };
    return order[a.verdict.level] - order[b.verdict.level];
  });

  const counts = { OK: 0, WARN: 0, FAIL: 0 };
  for (const item of results) {
    counts[item.verdict.level]++;
    if (item.verdict.level === 'OK') continue;
    console.log(`\n${verdict_emoji(item.verdict.level)} [${item.verdict.level}] ${item.url}`);
    console.log(`    ${item.verdict.reason}`);
    console.log(`    引用:lineage id ${item.refs.map(x => `${x.id}(${x.deity})`).join(', ')}`);
  }

  console.log(`\n統計:OK ${counts.OK} / WARN ${counts.WARN} / FAIL ${counts.FAIL}(共 ${results.length} URL)`);
  if (STRICT && (counts.WARN || counts.FAIL)) process.exit(1);
})();
