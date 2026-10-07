// 台灣進香地圖 — 源流連結圖層(v1.0;O2 增補圖例與網絡篩選)
//
// 資料:data/lineage.js(十五個信仰網絡)+ externalNodes(外部源頭座標)
// 呈現:依 relation 畫線(分香實線/謁祖進香虛線/遶境粗點線/承繼紫虛線),
//       狀態以透明度區分(確定 0.85 / 存爭議 0.55 / 待查 0.35),
//       點擊線段顯示完整源流資訊(含出處);外部源頭以金色節點標示。
// O2(2026-10-07):
//   1. 地圖右下角「源流圖例」控制項——關係線樣式(依實際資料筆數)與狀態透明度,
//      可點標題摺疊(行動裝置預設摺疊);
//   2. 側欄「源流網絡」篩選——勾選網絡時源流線以此為準;
//      未勾選時跟隨「依神明篩選」同步(齋教等無對應神明的網絡可用此篩選顯示);
//      外部源頭節點僅在有可見邊引用時繪製。
// 語言(D6):中文為主。

const RELATION_STYLES = {
  "分香": { color: "#C8102E", dashArray: null, weight: 2 },
  "謁祖進香": { color: "#C8102E", dashArray: "8 6", weight: 2 },
  "割火": { color: "#C8102E", dashArray: "2 5", weight: 2 },
  "遶境": { color: "#F39C12", dashArray: "4 6", weight: 3 },
  "承繼": { color: "#7E57C2", dashArray: "8 4 2 4", weight: 2 },
  "法脈": { color: "#00695C", dashArray: "6 3", weight: 2 },
  "輪祀": { color: "#1565C0", dashArray: "2 4", weight: 2 }
};

const STATUS_OPACITY = {
  "確定": 0.85,
  "存爭議": 0.55,
  "待查": 0.35
};

let lineageLayerGroup = null;
let lineageTemplesById = {};
let lineageExternalNodes = [];
let lastVisibleEdges = 0;

/** 目前生效的邊可見性:網絡勾選優先;未勾選時跟隨神明篩選 */
function edgeVisible(l) {
  const checked = document.querySelectorAll('#network-filters input[type="checkbox"]:checked');
  if (checked.length > 0) {
    for (const cb of checked) if (cb.value === l.deity) return true;
    return false;
  }
  const deities = window.filtersModule ? window.filtersModule.getSelectedDeities() : [];
  return deities.length === 0 || deities.includes(l.deity);
}

/** 依目前篩選重繪源流圖層(線段 + 被可見邊引用的外部源頭節點) */
function renderLineageLayer() {
  lineageLayerGroup.clearLayers();
  const nodeByName = {};
  lineageExternalNodes.forEach(function(n) { nodeByName[n.name] = n; });
  const drawnNodes = new Set();
  let visible = 0;

  lineages.forEach(function(l) {
    if (!edgeVisible(l)) return;
    const fromTemple = l.fromTempleId != null ? lineageTemplesById[l.fromTempleId] : null;
    const fromExternal = l.fromExternalName ? nodeByName[l.fromExternalName] : null;
    const to = l.toTempleId != null ? lineageTemplesById[l.toTempleId] : null;
    if (!to || (!fromTemple && !fromExternal)) {
      console.warn(`Lineage ${l.id}: 端點無法解析,跳過`);
      return;
    }

    const fromLat = fromTemple ? fromTemple.lat : fromExternal.lat;
    const fromLng = fromTemple ? fromTemple.lng : fromExternal.lng;
    const fromName = fromTemple ? fromTemple.nameZh : l.fromExternalName;
    const style = RELATION_STYLES[l.relation] || { color: "#888", weight: 2, dashArray: null };
    const opacity = STATUS_OPACITY[l.status] != null ? STATUS_OPACITY[l.status] : 0.6;

    // 外部源頭節點(金色圓點,僅在有其可見邊時繪製,同名只畫一次)
    if (fromExternal && !drawnNodes.has(fromExternal.name)) {
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
      drawnNodes.add(fromExternal.name);
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
    visible++;
  });

  lastVisibleEdges = visible;
  console.log(`Lineage layer rendered: ${visible}/${lineages.length} edges`);
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

/**
 * 建立源流圖層(線段 + 外部源頭節點)與側欄網絡篩選 UI
 * @param {array} temples - 精選廟宇資料(data/temples.js,解析 templeId 用)
 * @returns {object} Leaflet layerGroup
 */
function buildLineageLayer(temples) {
  lineageLayerGroup = L.layerGroup();
  lineageTemplesById = {};
  temples.forEach(function(t) { lineageTemplesById[t.id] = t; });
  lineageExternalNodes = externalNodes || [];

  buildNetworkFilterUI();
  renderLineageLayer();

  return lineageLayerGroup;
}

/** 側欄「源流網絡」篩選 checkbox(依 lineage.deity 統計) */
function buildNetworkFilterUI() {
  const container = document.getElementById('network-filters');
  if (!container) return;
  container.innerHTML = '';

  const counts = {};
  lineages.forEach(l => { counts[l.deity] = (counts[l.deity] || 0) + 1; });
  Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, 'zh-Hant'))
    .forEach(deity => {
      const div = document.createElement('div');
      div.className = 'filter-checkbox';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `filter-network-${deity}`;
      input.value = deity;

      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = `${deity} (${counts[deity]})`;

      div.appendChild(input);
      div.appendChild(label);
      input.addEventListener('change', applyLineageFilter);
      container.appendChild(div);
    });
}

/** 篩選變更時重繪(供 map.js 神明篩選同步與網絡 checkbox 共用) */
function applyLineageFilter() {
  if (!lineageLayerGroup) return;
  renderLineageLayer();
}

/** 取得目前可見邊數(E2E smoke 用) */
function getVisibleEdgeCount() {
  return lastVisibleEdges;
}

// ---------- 源流圖例(O2)----------

/** 圖例線段樣本 SVG(與地圖線段同色/同虛線/同透明度) */
function legendLineSample(style, opacity) {
  return `<svg width="34" height="10" aria-hidden="true"><line x1="1" y1="5" x2="33" y2="5" stroke="${style.color}" stroke-width="${style.weight}"${style.dashArray ? ` stroke-dasharray="${style.dashArray}"` : ''} stroke-opacity="${opacity}"/></svg>`;
}

const LineageLegend = L.Control.extend({
  options: { position: 'bottomright' },
  onAdd: function() {
    const container = L.DomUtil.create('div', 'lineage-legend');
    L.DomEvent.disableClickPropagation(container);

    // 只列目前資料中實際出現的關係(含筆數)
    const relationCounts = {};
    lineages.forEach(l => { relationCounts[l.relation] = (relationCounts[l.relation] || 0) + 1; });
    const relationRows = Object.keys(relationCounts)
      .sort((a, b) => relationCounts[b] - relationCounts[a])
      .map(rel => `
        <div class="legend-row">
          ${legendLineSample(RELATION_STYLES[rel] || { color: '#888', weight: 2 }, 0.85)}
          <span>${rel} <span class="legend-count">(${relationCounts[rel]})</span></span>
        </div>`)
      .join('');

    const statusRows = Object.keys(STATUS_OPACITY)
      .map(s => `
        <div class="legend-row">
          ${legendLineSample({ color: '#555', weight: 2 }, STATUS_OPACITY[s])}
          <span>${s}</span>
        </div>`)
      .join('');

    container.innerHTML = `
      <div class="lineage-legend-header" role="button" tabindex="0" aria-expanded="true">源流圖例</div>
      <div class="lineage-legend-body">
        ${relationRows}
        <div class="legend-sep"></div>
        ${statusRows}
        <div class="legend-row">
          <svg width="34" height="12" aria-hidden="true"><circle cx="17" cy="6" r="5" stroke="#B8860B" stroke-width="2" fill="#FFD54F" fill-opacity="0.95"/></svg>
          <span>外部源頭(座標近似)</span>
        </div>
      </div>
    `;

    const header = container.querySelector('.lineage-legend-header');
    const toggle = () => {
      const collapsed = container.classList.toggle('collapsed');
      header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    };
    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

    // 行動裝置預設摺疊,節省地圖空間
    if (window.innerWidth <= 768) {
      container.classList.add('collapsed');
      header.setAttribute('aria-expanded', 'false');
    }
    return container;
  }
});

window.lineageLayerModule = {
  build: buildLineageLayer,
  applyFilter: applyLineageFilter,
  getVisibleEdgeCount: getVisibleEdgeCount,
  addLegend: function(map) { new LineageLegend().addTo(map); }
};
