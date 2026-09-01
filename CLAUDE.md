# CLAUDE.md — 台灣進香地圖開發指南(給 Claude Code)

本檔供任何電腦上的 Claude Code 接手開發用。跨機器工作時沒有舊對話記憶,
以本檔與 docs/ 文件為準;文件之間有衝突時,以 docs/REQUIREMENTS.md 的決策為準。

## 專案一句話

以「神靈落地點 + 廟宇源流 + 個人進香之路」為核心的台灣廟宇互動地圖。
純靜態前端(HTML/CSS/JS + Leaflet + OSRM),無建置工具、無後端。

## 接手順序(必讀文件)

1. `README.md` — 專案現況與 Roadmap(階段進度以這裡為準)
2. `docs/REQUIREMENTS.md` — 已定案決策 D1–D13 與決策日誌
3. `docs/CONCEPT.md` — 三層地圖結構、資料模型、神明名稱政策(D9)
4. `docs/DATA_SOURCES.md` — 資料來源、匯入管線、資料品質備註
5. `docs/ROADMAP.md` — 階段歸檔與擴充評估候選(E1–E6)

## 工作規則

- **語言**:與使用者溝通及專案文件用繁體中文;commit message 用英文。
- **開發流程**:分支開發 → 驗證通過 → **使用者核准後才 merge 回 main 並 push**
  (merge/push 是檢查點,未經明示核准不得 push)。
- **分支與合併**:分支命名 `feat/<階段>-<主題>` 或 `docs/<主題>`;
  合併用 `git merge --no-ff` 保留階段紀錄。

## 資料層規則

- **D9 原名保留**:`mainDeityRaw` 一律保留原始主祀神名(含「未記載」),
  正規化只寫入 `deitySystems`/`primarySystem`,絕不覆寫原名。
  canonical 名只是系統代表名,不是唯一正確稱呼;別名對照表在 `data/deities.js`,
  擴充時應附源流註記。
- **產生檔勿手改**:`data/moi-temples.js` 由 `tools/import-moi-data.js` 產生
  (data/raw/ 缺檔會自動下載內政部 8203 XML)。修改註冊表或來源後重新執行產生。
- **驗證必跑**:任何資料變更後執行 `node tools/validate-data.js`,
  必須 0 錯誤才能 commit。
- **新增策展資料**:廟宇加 `data/temples.js`(精選落地點才提供 nameEn/addressEn);
  源流加 `data/lineage.js`,每筆必填 `status`(確定/存爭議/待查)與 `source`,
  查證不到就誠實標「待補」,不得捏造出處。

## 已知事項

- 寫入中文內容後請掃描 U+FFFD 損壞字元(rg "\x{FFFD}"),發現立即修復;
  驗證器亦內建此檢查。
- 待辦:南鯤鯓分香網絡持續策展(已收 4 組關係,兩輪查證暫無新具名權威出處);
  富美系——鹿港富美宮(無可驗證網頁出處)、新竹富美宮(蕭潘郭三府組成歧異)
  俟有出處再收;范府千歲獨立系統查無可考鏈,待文獻;東港東隆宮溫府千歲源流
  待查;田中參天宮(無座標)待查;協天廟戰後四鸞堂俟有出處再收;新莊地藏庵
  維持無邊結論(厲祀起家)。
- 擴充候選:見 docs/ROADMAP.md(E1–E6:儒釋道系統、泉漳潮原鄉、藏傳、日治遺留、
  原民聖地、其他民俗)。立項前須於 REQUIREMENTS 立決策(D12 起);
  原民聖地類未獲社群同意一律不收。
- UI 驗證工具:headless Chrome via Selenium(腳本 `data/raw/browser-smoke.py` 與
  `data/raw/journey-e2e.py`,gitignored,以 PMS 專案 `.blackvenv` 執行)。
- repo 曾多次改名(現為 `Galen-Chu/TAIWAN-Pilgrimage`),本地 remote 已同步,勿改回舊 URL。
