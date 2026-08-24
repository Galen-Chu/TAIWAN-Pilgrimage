// 台灣進香地圖 — 全量廟宇底圖圖層(v1.0)
//
// 資料:data/moi-temples.js(12,422 筆,內政部 8203,generated;授權條款第1版)
// 策略(D8):index.html 不預載 3.6MB 資料檔;使用者首次開啟「全量廟宇」
//           圖層時才動態注入 <script> 載入,以 markercluster 叢集渲染,
//           依 primarySystem 著色;篩選由 mapModule.filterMarkers 統一驅動。
// 語言(D6):底圖資訊以中文為主。

let baseLayer = {
  loaded: false,
  loading: false,
  cluster: null,
  allMarkers: []
};

// 系統代表色(canonical → color;未歸類為灰)
const BASE_SYSTEM_COLORS = {
  "媽祖": "#FF6B6B",
  "關聖帝君": "#E74C3C",
  "玉皇大帝": "#F1C40F",
  "觀音菩薩": "#E91E63",
  "地藏菩薩": "#7E57C2",
  "阿彌陀佛": "#26A69A",
  "五府千歲": "#9B59B6",
  "保生大帝": "#3498DB",
  "呂洞賓": "#F39C12",
  "佛教": "#5E35B1",
  "土地公": "#8D6E63"
};

function baseDotIcon(color, visited) {
  return L.divIcon({
    className: 'base-dot-icon',
    html: `<span class="base-dot${visited ? ' visited' : ''}" style="background-color:${color};"></span>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });
}

/** 依進香足跡刷新底圖標記的「已參拜」樣式 */
function refreshBaseVisited(visitedKeys) {
  baseLayer.visited = visitedKeys;
  baseLayer.allMarkers.forEach(m => {
    const t = m.baseData;
    if (t && t.sourceId != null) {
      m.setIcon(baseDotIcon(BASE_SYSTEM_COLORS[t.primarySystem] || '#9E9E9E',
        visitedKeys.has('m' + t.sourceId)));
    }
  });
}

/**
 * 取得(或建立)底圖叢集群組。回傳空的 cluster,資料於 ensureLoaded 後填充。
 */
function getBaseCluster() {
  if (!baseLayer.cluster) {
    baseLayer.cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: 15,
      chunkedLoading: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="base-cluster-dot"><span>${count}</span></div>`,
          className: 'base-cluster-icon',
          iconSize: L.point(28, 28)
        });
      }
    });
  }
  return baseLayer.cluster;
}

/**
 * 動態載入 data/moi-temples.js 並建立標記(僅執行一次)。
 * @param {function} onReady - 完成後回呼(可選)
 */
function ensureBaseLayerLoaded(onReady) {
  if (baseLayer.loaded) {
    if (onReady) onReady();
    return;
  }
  if (baseLayer.loading) return;
  baseLayer.loading = true;

  const script = document.createElement('script');
  script.src = 'data/moi-temples.js';
  script.onload = function() {
    buildBaseMarkers();
    baseLayer.loaded = true;
    baseLayer.loading = false;
    console.log(`Base layer loaded: ${baseLayer.allMarkers.length} markers`);
    if (onReady) onReady();
  };
  script.onerror = function() {
    baseLayer.loading = false;
    console.error('Failed to load data/moi-temples.js');
  };
  document.head.appendChild(script);
}

function buildBaseMarkers() {
  const cluster = getBaseCluster();
  baseLayer.allMarkers = moiTemples
    .filter(t => t.lat != null && t.lng != null)
    .map(function(t) {
      const color = BASE_SYSTEM_COLORS[t.primarySystem] || '#9E9E9E';
      const marker = L.marker([t.lat, t.lng], {
        icon: baseDotIcon(color, baseLayer.visited && baseLayer.visited.has('m' + t.sourceId)),
        title: t.nameZh
      });
      marker.baseData = t;
      marker.bindTooltip(`${t.nameZh}(${t.mainDeityRaw || '未記載'})`);
      marker.bindPopup(basePopupContent(t));
      return marker;
    });
  cluster.addLayers(baseLayer.allMarkers);
}

function basePopupContent(t) {
  const systems = (t.deitySystems || []).join('、');
  return `
    <div class="popup-content">
      <div class="popup-temple-name">${t.nameZh}</div>
      <div class="popup-info">
        <strong>主祀:</strong> ${t.mainDeityRaw || '未記載'}
        ${systems && systems !== t.mainDeityRaw ? `<br><strong>系統:</strong> ${systems}` : ''}
      </div>
      ${t.addressZh ? `<div class="popup-info"><strong>地址:</strong><br>${t.addressZh}</div>` : ''}
      ${t.phone ? `<div class="popup-info"><strong>電話:</strong> ${t.phone}</div>` : ''}
      <div class="popup-actions">
        <button class="popup-btn popup-btn-details" onclick="journeyCheckIn('m${t.sourceId}', '${String(t.nameZh).replace(/'/g, "\\'")}', '${String(t.mainDeityRaw || '').replace(/'/g, "\\'")}', ${t.lat}, ${t.lng})">
          🙏 參拜打卡
        </button>
      </div>
      <div class="popup-info" style="font-size:11px;color:#666;">
        資料來源:內政部「全國宗教資訊系統資料-寺廟」(政府資料開放授權條款-第1版)
      </div>
    </div>
  `;
}

/**
 * 依神明系統與區域篩選底圖(與精選層同步)。
 * @param {array} systems - 選取的 canonical 神明(空陣列=全部)
 * @param {array} regions - 選取的區域(空陣列=全部)
 */
function applyBaseFilter(systems, regions) {
  if (!baseLayer.loaded || !baseLayer.cluster) return;
  const filtered = baseLayer.allMarkers.filter(function(m) {
    const t = m.baseData;
    const systemMatch =
      systems.length === 0 ||
      (t.deitySystems && t.deitySystems.some(s => systems.includes(s)));
    const regionMatch = regions.length === 0 || regions.includes(t.region);
    return systemMatch && regionMatch;
  });
  baseLayer.cluster.clearLayers();
  baseLayer.cluster.addLayers(filtered);
  console.log(`Base layer filtered to ${filtered.length} markers`);
}

window.baseLayerModule = {
  getCluster: getBaseCluster,
  ensureLoaded: ensureBaseLayerLoaded,
  applyFilter: applyBaseFilter,
  refreshVisited: refreshBaseVisited,
  isLoaded: function() { return baseLayer.loaded; }
};
