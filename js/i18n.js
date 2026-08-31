// Taiwan Pilgrim Map - i18n Module (D6 語言政策:中文為主)
//
// 2026-08-31 v3.0 起依 D6 收斂:介面固定中文,移除全介面英文化切換;
// 英文僅用於精選落地點的 nameEn/addressEn 欄位(於彈窗/詳情卡以次要行顯示)。
// 保留 getText/getDeityText/getRegionText 介面,眾模組以 zh 字典取值。

/**
 * 中文介面文字(鍵值即 data-i18n 屬性)
 */
const translations = {
  zh: {
    // Header
    title: "台灣進香地圖",

    // Search
    searchPlaceholder: "搜尋廟宇名稱或地址...",

    // Filters
    filterByDeity: "依神明篩選",
    filterByRegion: "依地區篩選",
    clearFilters: "清除篩選",

    // Deity Types
    deityMazu: "媽祖",
    deityWangYe: "五府千歲",
    deityBaosheng: "保生大帝",
    deityGuandi: "關聖帝君",
    deityLudongbin: "呂洞賓",
    deityBuddhist: "佛教",
    deityGuanyin: "觀音菩薩",
    deityTudigong: "土地公",
    deityYuhuang: "玉皇大帝",
    deityDizang: "地藏菩薩",
    deityAmitabha: "阿彌陀佛",

    // Regions
    regionNorth: "北部",
    regionCentral: "中部",
    regionSouth: "南部",
    regionEast: "東部",
    regionIslands: "離島",

    // Route Planning
    planRoute: "路線規劃",
    start: "起點",
    end: "終點",
    selectTemple: "選擇廟宇...",
    getRoute: "規劃路線",
    clearRoute: "清除路線",
    distance: "距離:",
    estimatedTime: "預估時間:",
    straightLine: "(直線距離)",

    // Temple Details
    phone: "電話",
    website: "網站",
    address: "地址",
    description: "簡介",
    addToRoute: "加入路線",
    addedToRoute: "已加入路線",
    viewDetails: "查看詳情",
    foundedYearLabel: "創建",
    lodgingLabel: "香客大樓",
    landingLabel: "落地屬性",
    historyLabel: "沿革",

    // Footer
    mapData: "地圖資料:",
    routing: "路線規劃:",

    // Journey (v1.x)
    journeyTitle: "進香足跡",
    journeyVisitsUnit: "次參拜",
    journeyTemplesUnit: "間廟宇",
    journeyEmpty: "尚無參拜紀錄——在廟宇彈窗點「參拜打卡」開始",
    checkInTitle: "參拜打卡",
    checkInDate: "參拜時間",
    checkInNote: "備註",
    save: "儲存",
    cancel: "取消",
    delete: "刪除",

    // Messages
    noResults: "沒有找到廟宇",
    routeError: "無法計算路線，顯示直線距離。",
    loading: "載入中..."
  }
};

/**
 * Deity name mapping (from data.mainDeity to translation key)
 */
const deityTranslationMap = {
  "媽祖": "deityMazu",
  "五府千歲": "deityWangYe",
  "保生大帝": "deityBaosheng",
  "關聖帝君": "deityGuandi",
  "呂洞賓": "deityLudongbin",
  "佛教": "deityBuddhist",
  "觀音菩薩": "deityGuanyin",
  "土地公": "deityTudigong",
  "玉皇大帝": "deityYuhuang",
  "地藏菩薩": "deityDizang",
  "阿彌陀佛": "deityAmitabha"
};

/**
 * Region name mapping (from data.region to translation key)
 */
const regionTranslationMap = {
  "North": "regionNorth",
  "Central": "regionCentral",
  "South": "regionSouth",
  "East": "regionEast",
  "Islands": "regionIslands"
};

/**
 * Current language state (D6: fixed 'zh'; interface is Chinese-primary)
 */
const currentLanguage = 'zh';

/**
 * Get current language
 * @returns {string} Language code ('zh')
 */
function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Get translated text for a key
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
function getText(key) {
  return translations[currentLanguage][key] || key;
}

/**
 * Get translated deity name
 * @param {string} deity - Deity name in Chinese
 * @returns {string} Translated deity name
 */
function getDeityText(deity) {
  const key = deityTranslationMap[deity];
  return key ? getText(key) : deity;
}

/**
 * Get translated region name
 * @param {string} region - Region name in English
 * @returns {string} Translated region name
 */
function getRegionText(region) {
  const key = regionTranslationMap[region];
  return key ? getText(key) : region;
}

/**
 * Update all UI text elements with data-i18n attribute
 */
function updateUIText() {
  // Update elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = getText(key);
  });

  // Update elements with data-i18n-placeholder attribute
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = getText(key);
  });

  // Update document title
  document.title = getText('title');
}

/**
 * Update search input placeholder
 */
function updateSearchPlaceholder() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.placeholder = getText('searchPlaceholder');
  }
}

/**
 * Initialize i18n module
 */
function initI18n() {
  // Initial UI text update
  updateUIText();
  updateSearchPlaceholder();

  console.log(`i18n initialized with language: ${currentLanguage}`);
}

// Export functions for use by other modules
window.i18n = {
  init: initI18n,
  getText: getText,
  getDeityText: getDeityText,
  getRegionText: getRegionText,
  getCurrentLanguage: getCurrentLanguage
};
