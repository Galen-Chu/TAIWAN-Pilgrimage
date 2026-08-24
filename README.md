# 台灣進香地圖 | Taiwan Pilgrim Map

> 標記神靈在台灣的落地點，連結廟宇之間的源流，並記錄你自己的進香之路。

本專案原為「台灣香客大樓地圖」，自 2026-08 起轉向新的核心概念：從「住宿定位」走向「信仰地圖」——以台灣廟宇為節點、以神靈源流為連結、以個人進香足跡為縱軸的互動地圖。

*A bilingual (中文/English) interactive map. Formerly the "Taiwan Pilgrim Building Map", pivoting toward a belief-oriented map of temples, deity lineages, and personal pilgrimage journeys.*

## 核心概念

地圖由三層構成，用「連結」串起來：

1. **廟宇節點** — 全台廟宇基本資訊（名稱、主祀神、地址、座標、創建年代等）。
2. **神靈落地點與源流連結** — 標記神靈在台灣「落地生根」的具體位置（開基廟、祖廟、歷史登陸點等），並以源流連結（分香、謁祖進香、遶境）呈現廟宇之間的傳承關係。
3. **個人進香之路** — 記錄自己走過的廟宇，連成屬於自己的進香足跡與統計。

詳細說明見 [docs/CONCEPT.md](docs/CONCEPT.md)。

## 現有功能（香客大樓時期已實作）

- **互動地圖**：Leaflet.js + OpenStreetMap，目前收錄 24 間寺廟種子資料
- **篩選**：依主祀神（媽祖、五府千歲、保生大帝、關聖帝君、呂洞賓、佛教、觀音菩薩、土地公）與區域（北/中/南/東）篩選
- **搜尋**：中英文廟名與地址搜尋
- **雙語介面**：中文/英文切換
- **路線規劃**：OSRM 路線規劃，顯示距離與預估時間
- **響應式設計**：桌機、平板、手機皆可用

## 規劃功能（核心概念轉向後，需求已定案 2026-08-18）

- [x] **分層地圖**：全量立案廟宇為淺色底圖（延遲載入 + 叢集）+ 精選落地點（開基廟、祖廟、歷史登陸點）強調圖層
- [x] **源流連結**：分香/謁祖關係線——媽祖 10 筆＋觀音（安海龍山寺系）3 筆，含外部源頭節點與 evidenceUrl 出處；關聖帝君/玉皇/地藏已收錄落地點節點（源流邊待策展）、阿彌陀佛待宗派脈絡策展
- [x] **進香 check-in**：記錄參拜（時間、備註），精選與底圖廟宇皆可打卡
- [x] **進香足跡**：參拜紀錄依時間連成路線圖層，統計參拜次數/廟數/神明涵蓋，已參拜標記金環
- [x] **資料儲存與備份**：localStorage 保存（重載持久），支援 JSON（完整備份）與 GPX（足跡路線）匯入匯出（無後端）
- [ ] **香客大樓資訊**：舊資料降階為廟宇屬性欄位（`lodging`），作為規劃住宿的參考
- [ ] **語言政策調整**：介面與資料中文為主，英文命名僅用於精選落地點
- [x] **資料擴充**：匯入政府開放資料與策展資料（全量底層 12,422 筆已產生 `data/moi-temples.js`；座標經 2026-08-21 複校與 OSM 校正）

決策詳情見 [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)。

## 技術堆疊

- **前端**：HTML5、CSS3、JavaScript（ES6+）
- **地圖**：Leaflet.js + OpenStreetMap 圖磚
- **路線**：Leaflet Routing Machine + OSRM
- **無建置工具**：純靜態檔案

## 專案結構

```
pilgrim-map/
├── index.html              # 主頁面
├── css/
│   ├── styles.css          # 主要樣式
│   └── responsive.css      # 響應式樣式
├── js/
│   ├── app.js              # 主控制器
│   ├── map.js              # 地圖初始化、標記與圖層控制
│   ├── base-layer.js       # 全量廟宇底圖（延遲載入 + 叢集）
│   ├── lineage-layer.js    # 媽祖源流連結圖層
│   ├── journey.js          # 進香足跡儲存（localStorage + JSON/GPX）
│   └── journey-ui.js       # 打卡表單、足跡圖層與側欄面板
│   ├── filters.js          # 篩選功能
│   ├── search.js           # 搜尋功能
│   ├── routing.js          # 路線規劃
│   └── i18n.js             # 雙語切換
├── data/
│   ├── temples.js          # 精選廟宇節點（策展層，31 筆）
│   ├── lineage.js          # 源流連結資料（媽祖 10 筆＋觀音 3 筆）
│   ├── deities.js          # 神明名稱註冊表（原名保留 + 系統歸類）
│   └── moi-temples.js      # 全量廟宇底層（12,422 筆，generated）
├── docs/
│   ├── CONCEPT.md          # 核心概念說明
│   ├── DATA_SOURCES.md     # 資料來源評估
│   └── REQUIREMENTS.md     # 需求決策清單
├── tools/
│   ├── import-moi-data.js  # 內政部 8203 匯入管線（node tools/import-moi-data.js）
│   └── validate-data.js    # 資料驗證腳本（node tools/validate-data.js）
└── README.md
```

## 本機執行

1. 進入專案目錄
2. 啟動本機伺服器：
   ```bash
   python -m http.server 8080
   ```
3. 瀏覽器開啟 `http://localhost:8080`

## 部署

純靜態網站，可部署至：

- **GitHub Pages**：Push 後在 repo 設定開啟 Pages
- **Netlify**：拖放資料夾即可
- **任何網頁伺服器**

## Roadmap

| 階段 | 內容 | 狀態 |
|------|------|------|
| v0.x | 香客大樓地圖（24 間寺廟、篩選、搜尋、路線） | ✅ 完成 |
| v0.9 | 核心概念轉向、資料模型重構、全量匯入管線、神明名稱註冊表 | ✅ 完成（2026-08-18） |
| v1.0 | 分層地圖 + 落地點標記 + 源流連結圖層 | ✅ 完成（2026-08-21；源流首批＝媽祖，其餘五系統策展中） |
| v1.x | 個人進香之路（check-in、足跡、統計、匯入匯出） | ✅ 完成（2026-08-24，E2E 16/16） |

## 資料來源

候選資料來源（政府開放資料、OSM、Wikidata、宗教百景等）與評估，見 [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)。

## 參與貢獻

- 新增或校正廟宇資料與源流關係
- 協助中英文翻譯
- 回報 bug、建議功能

## Credits

- Map Data: [OpenStreetMap](https://www.openstreetmap.org)
- Routing: [OSRM](http://project-osrm.org/)
- Map Library: [Leaflet.js](https://leafletjs.com/)
- Open Data: [政府資料開放平臺](https://data.gov.tw)

## License

MIT License
