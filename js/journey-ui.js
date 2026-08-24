// 台灣進香地圖 — 個人進香之路 UI(v1.x)
//
// 呈現:側欄「進香足跡」區(統計/紀錄列表/匯入匯出)、打卡表單(重用 temple-modal)、
//       足跡路線圖層(依時間排序連線 + 每筆紀錄錨點)、精選與底圖標記的「已參拜」金環。
// 資料邏輯見 js/journey.js(D4:localStorage)。

let journeyLayer = null;

function journeyUILayer() {
  if (!journeyLayer) journeyLayer = L.layerGroup();
  return journeyLayer;
}

function rebuildJourneyLayer() {
  const layer = journeyUILayer();
  layer.clearLayers();
  const ordered = window.journeyModule.ordered();
  if (ordered.length === 0) return;

  // 足跡線(依參拜時間排序)
  if (ordered.length >= 2) {
    L.polyline(ordered.map(r => [r.lat, r.lng]), {
      color: '#8E44AD',
      weight: 3,
      opacity: 0.75,
      dashArray: '1 8',
      lineCap: 'round'
    }).addTo(layer);
  }

  // 每筆參拜錨點
  ordered.forEach((r, i) => {
    const m = L.circleMarker([r.lat, r.lng], {
      radius: 6,
      color: '#6C3483',
      fillColor: '#BB8FCE',
      fillOpacity: 0.95,
      weight: 2
    });
    m.bindTooltip(`#${i + 1} ${r.name}`);
    m.bindPopup(`
      <div class="popup-content">
        <div class="popup-temple-name">${escapeHtml(r.name)}</div>
        <div class="popup-info">${fmtDate(r.visitedAt)}</div>
        ${r.note ? `<div class="popup-info">${escapeHtml(r.note)}</div>` : ''}
      </div>
    `);
    layer.addLayer(m);
  });
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// ---------- 已參拜標記刷新(精選 + 底圖) ----------

function refreshVisitedMarkers() {
  const visited = window.journeyModule.visitedKeys();
  if (window.mapModule && window.mapModule.refreshVisited) {
    window.mapModule.refreshVisited(visited);
  }
  if (window.baseLayerModule && window.baseLayerModule.refreshVisited) {
    window.baseLayerModule.refreshVisited(visited);
  }
}

// ---------- 側欄面板 ----------

function renderJourneyPanel() {
  const statsEl = document.getElementById('journey-stats');
  const listEl = document.getElementById('journey-records');
  if (!statsEl || !listEl) return;

  const s = window.journeyModule.stats();
  const lang = window.i18n.getCurrentLanguage();
  const t = k => window.i18n.getText(k);

  const deityLines = Object.entries(s.byDeity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([d, n]) => `${d} ${n}`)
    .join(' · ');

  statsEl.innerHTML = `
    <div class="journey-stat-line">
      <strong>${s.visits}</strong> ${t('journeyVisitsUnit')} /
      <strong>${s.temples}</strong> ${t('journeyTemplesUnit')}
    </div>
    ${deityLines ? `<div class="journey-stat-sub">${deityLines}</div>` : ''}
  `;

  if (s.records.length === 0) {
    listEl.innerHTML = `<div class="journey-empty">${t('journeyEmpty')}</div>`;
    return;
  }
  listEl.innerHTML = s.records
    .slice()
    .sort((a, b) => b.visitedAt.localeCompare(a.visitedAt))
    .slice(0, 30)
    .map(r => `
      <div class="journey-item" data-key="${escapeHtml(r.key)}" data-at="${escapeHtml(r.visitedAt)}">
        <span class="journey-item-date">${fmtDate(r.visitedAt)}</span>
        <span class="journey-item-name">${escapeHtml(r.name)}</span>
        ${r.note ? `<span class="journey-item-note">${escapeHtml(r.note)}</span>` : ''}
        <button class="journey-item-del" title="${t('delete')}">×</button>
      </div>
    `).join('');

  listEl.querySelectorAll('.journey-item-del').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.journey-item');
      window.journeyModule.remove(item.getAttribute('data-key'), item.getAttribute('data-at'));
    });
  });
}

// ---------- 打卡表單(重用 temple-modal 容器) ----------

function toLocalInputValue(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/**
 * 開啟打卡表單。popup 按鈕以 inline onclick 呼叫。
 */
function journeyCheckIn(key, name, deity, lat, lng) {
  const lang = window.i18n.getCurrentLanguage();
  const t = k => window.i18n.getText(k);
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h2 class="modal-temple-name">${t('checkInTitle')}</h2>
    <p class="modal-temple-name-en">${escapeHtml(name)}</p>
    <div class="modal-section">
      <strong>${t('checkInDate')}</strong>
      <input type="datetime-local" id="checkin-date" value="${toLocalInputValue(new Date())}" style="width:100%;margin-top:6px;">
    </div>
    <div class="modal-section">
      <strong>${t('checkInNote')}</strong>
      <textarea id="checkin-note" rows="3" style="width:100%;margin-top:6px;"></textarea>
    </div>
    <div class="modal-booking-section">
      <button class="btn-primary" id="checkin-save">${t('save')}</button>
      <button class="btn-secondary" id="checkin-cancel">${t('cancel')}</button>
    </div>
  `;
  document.getElementById('temple-modal').classList.add('active');
  document.getElementById('checkin-cancel').addEventListener('click', () => {
    document.getElementById('temple-modal').classList.remove('active');
  });
  document.getElementById('checkin-save').addEventListener('click', () => {
    const dateVal = document.getElementById('checkin-date').value;
    const note = document.getElementById('checkin-note').value.trim();
    const visitedAt = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();
    window.journeyModule.add({ key, name, deity, lat, lng, visitedAt, note });
    document.getElementById('temple-modal').classList.remove('active');
  });
}

// ---------- 匯入匯出 ----------

function downloadText(filename, text, mime) {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

function initJourneyUI() {
  rebuildJourneyLayer();

  window.addEventListener('journeyChanged', function() {
    rebuildJourneyLayer();
    renderJourneyPanel();
    refreshVisitedMarkers();
  });

  document.getElementById('journey-export-json').addEventListener('click', function() {
    downloadText(`pilgrim-journey-${new Date().toISOString().slice(0, 10)}.json`,
      window.journeyModule.exportJSON(), 'application/json');
  });
  document.getElementById('journey-export-gpx').addEventListener('click', function() {
    downloadText(`pilgrim-journey-${new Date().toISOString().slice(0, 10)}.gpx`,
      window.journeyModule.exportGPX(), 'application/gpx+xml');
  });
  document.getElementById('journey-import').addEventListener('click', function() {
    document.getElementById('journey-import-file').click();
  });
  document.getElementById('journey-import-file').addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      const text = String(reader.result);
      try {
        const result = /\.gpx$/i.test(file.name) || text.trim().startsWith('<?xml')
          ? window.journeyModule.importGPX(text)
          : window.journeyModule.importJSON(text);
        const lang = window.i18n.getCurrentLanguage();
        alert(lang === 'zh' ? `匯入完成:新增 ${result.added} 筆(共 ${result.total} 筆)` : `Imported: ${result.added} added (${result.total} total)`);
      } catch (e) {
        alert(lang === 'zh' ? `匯入失敗:${e.message}` : `Import failed: ${e.message}`);
      }
      document.getElementById('journey-import-file').value = '';
    };
    reader.readAsText(file);
  });
  document.getElementById('journey-clear').addEventListener('click', function() {
    const lang = window.i18n.getCurrentLanguage();
    if (window.journeyModule.stats().visits === 0) return;
    if (confirm(lang === 'zh' ? '確定清除全部參拜紀錄?此動作無法復原(建議先匯出備份)。' : 'Clear all visit records? This cannot be undone (export first!).')) {
      window.journeyModule.clear();
    }
  });

  renderJourneyPanel();
  refreshVisitedMarkers();
}

window.journeyCheckIn = journeyCheckIn;
window.journeyUI = {
  init: initJourneyUI,
  getLayer: journeyUILayer
};
