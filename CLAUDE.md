# CLAUDE.md — 台灣進香地圖開發指南(給 Claude Code)

本檔供任何電腦上的 Claude Code 接手開發用。跨機器工作時沒有舊對話記憶,
以本檔與 docs/ 文件為準;文件之間有衝突時,以 docs/REQUIREMENTS.md 的決策為準。

## 專案一句話

以「神靈落地點 + 廟宇源流 + 個人進香之路」為核心的台灣廟宇互動地圖。
純靜態前端(HTML/CSS/JS + Leaflet + OSRM),無建置工具、無後端。

## 接手順序(必讀文件)

1. `README.md` — 專案現況與 Roadmap(階段進度以這裡為準)
2. `docs/REQUIREMENTS.md` — 已定案決策 D1–D9 與決策日誌
3. `docs/CONCEPT.md` — 三層地圖結構、資料模型、神明名稱政策(D9)
4. `docs/DATA_SOURCES.md` — 資料來源、匯入管線、資料品質備註

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
- 待辦:澎湖天后宮座標待複核;lineage.js 出處待補具體文獻;
  全量底層 moi-temples.js 尚未接入 UI(v1.0 分層渲染時處理,D8 效能選項屆時一併決定)。
- repo 曾多次改名(現為 `Galen-Chu/TAIWAN-pilgrimage`),本地 remote 已同步,勿改回舊 URL。
