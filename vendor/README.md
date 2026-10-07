# vendor/ — 第三方函式庫自托管

地圖相依套件直接存放於本 repo,不再透過 unpkg CDN 載入(可用性不受第三方 CDN
影響,載入亦較快)。升級時以同版號檔案覆蓋,並更新本表。

| 目錄 | 套件 | 版本 | 上游 | 授權 |
|------|------|------|------|------|
| `leaflet/` | Leaflet | 1.9.4 | <https://leafletjs.com/> | BSD 2-Clause |
| `leaflet-routing-machine/` | Leaflet Routing Machine | 3.2.12 | <http://www.liedman.net/leaflet-routing-machine/> | Apache-2.0 |
| `leaflet.markercluster/` | Leaflet.markercluster | 1.5.3 | <https://github.com/Leaflet/Leaflet.markercluster> | MIT |

檔案均取自各套件 npm 套件的 `dist/` 目錄(unpkg 同源),未做任何修改。
`leaflet/images/` 為 leaflet.css 參考的圖層控制與標記圖片。

## 更新方式

```bash
curl -sSfL -o vendor/leaflet/leaflet.js "https://unpkg.com/leaflet@<版本>/dist/leaflet.js"
# 其餘檔案類推;更新後務必以瀏覽器實測地圖載入
```
