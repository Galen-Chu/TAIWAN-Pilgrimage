// 台灣進香地圖 — 源流連結圖層(v1.0)
//
// 資料:data/lineage.js(媽祖 10 筆+觀音 3 筆+關聖帝君 5 筆+玉皇 3 筆+地藏 1 筆)+ externalNodes(外部源頭座標)
// 呈現:依 relation 畫線(分香實線/謁祖進香虛線/遶境粗點線/承繼紫虛線),
//       狀態以透明度區分(確定 0.85 / 存爭議 0.55 / 待查 0.35),
//       點擊線段顯示完整源流資訊(含出處);外部源頭以金色節點標示。
// 語言(D6):中文為主。

const RELATION_STYLES = {
  "分香": { color: "#C8102E", dashArray: null, weight: 2 },
  "謁祖進香": { color: "#C8102E", dashArray: "8 6", weight: 2 },
  "割火": { color: "#C8102E", dashArray: "2 5", weight: 2 },
  "遶境": { color: "#F39C12", dashArray: "4 6", weight: 3 },
  "承繼": { color: "#7E57C2", dashArray: "8 4 2 4", weight: 2 }
};

const STATUS_OPACITY = {
  "確定": 0.85,
  "存爭議": 0.55,
  "待查": 0.35
};

let lineageLayerGroup = null;

/**
 * 建立源流圖層(線段 + 外部源頭節點)
 * @param {array} temples - 精選廟宇資料(data/temples.js,解析 templeId 用)
 * @returns {object} Leaflet layerGroup
 */
function buildLineageLayer(temples) {
  lineageLayerGroup = L.layerGroup();
  const templeById = {};
  temples.forEach(function(t) { templeById[t.id] = t; });
  const nodeByName = {};
  (externalNodes || []).forEach(function(n) { nodeByName[n.name] = n; });

  lineages.forEach(function(l) {
    const fromTemple = l.fromTempleId != null ? templeById[l.fromTempleId] : null;
    const fromExternal = l.fromExternalName ? nodeByName[l.fromExternalName] : null;
    const to = l.toTempleId != null ? templeById[l.toTempleId] : null;
    if (!to || (!fromTemple && !fromExternal)) {
      console.warn(`Lineage ${l.id}: 端點無法解析,跳過`);
      return;
    }

    const fromLat = fromTemple ? fromTemple.lat : fromExternal.lat;
    const fromLng = fromTemple ? fromTemple.lng : fromExternal.lng;
    const fromName = fromTemple ? fromTemple.nameZh : l.fromExternalName;
    const style = RELATION_STYLES[l.relation] || { color: "#888", weight: 2, dashArray: null };
    const opacity = STATUS_OPACITY[l.status] != null ? STATUS_OPACITY[l.status] : 0.6;

    // 外部源頭節點(金色圓點,只畫一次)
    if (fromExternal && !nodeByName[fromExternal.name]._drawn) {
      const nodeMarker = L.circleMarker([fromExternal.lat, fromExternal.lng], {
        radius: 6,
        color: "#B8860B",
        fillColor: "#FFD54F",
        fillOpacity: 0.95,
        weight: 2
      });
      nodeMarker.bindTooltip(`外部源頭:${fromExternal.name}(近似位置)`);
      nodeMarker.bindPopup(`
        <div class="popup-content">
          <div class="popup-temple-name">外部源頭</div>
          <div class="popup-info">${fromExternal.name}</div>
          <div class="popup-info" style="font-size:11px;color:#666;">座標為近似值,僅供源流連線繪製</div>
        </div>
      `);
      lineageLayerGroup.addLayer(nodeMarker);
      nodeByName[fromExternal.name]._drawn = true;
    }

    const line = L.polyline(
      [[fromLat, fromLng], [to.lat, to.lng]],
      {
        color: style.color,
        weight: style.weight,
        dashArray: style.dashArray,
        opacity: opacity
      }
    );
    line.bindTooltip(`${l.relation}:${fromName} → ${to.nameZh}`);
    line.bindPopup(lineagePopupContent(l, fromName, to.nameZh));
    lineageLayerGroup.addLayer(line);
  });

  return lineageLayerGroup;
}

function lineagePopupContent(l, fromName, toName) {
  const statusBadge =
    l.status === '確定' ? '✅' : (l.status === '存爭議' ? '⚠️' : '❓');
  return `
    <div class="popup-content">
      <div class="popup-temple-name">${l.deity}源流 · ${l.relation}</div>
      <div class="popup-info"><strong>${fromName}</strong> → <strong>${toName}</strong></div>
      ${l.year ? `<div class="popup-info"><strong>年份:</strong> ${l.year}</div>` : ''}
      <div class="popup-info"><strong>狀態:</strong> ${statusBadge} ${l.status}</div>
      ${l.note ? `<div class="popup-info"><strong>說明:</strong> ${l.note}</div>` : ''}
      <div class="popup-info" style="font-size:11px;color:#666;"><strong>出處:</strong> ${l.source}</div>
    </div>
  `;
}

window.lineageLayerModule = {
  build: buildLineageLayer
};
