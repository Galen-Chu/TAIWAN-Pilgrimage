// Taiwan Pilgrim Map - Internationalization (i18n) Module

/**
 * Translation data for bilingual support (Chinese/English)
 */
const translations = {
  en: {
    // Header
    title: "Taiwan Pilgrim Map",
    langToggle: "中文",

    // Search
    searchPlaceholder: "Search temples by name or address...",

    // Filters
    filterByDeity: "Filter by Deity",
    filterByRegion: "Filter by Region",
    clearFilters: "Clear Filters",

    // Deity Types
    deityMazu: "Mazu",
    deityWangYe: "Wang Ye (Five Princes)",
    deityBaosheng: "Baosheng Dadi",
    deityGuandi: "Guan Di",
    deityLudongbin: "Lu Dongbin",
    deityBuddhist: "Buddhist",
    deityGuanyin: "Guanyin",
    deityTudigong: "Earth God (Tudigong)",
    deityYuhuang: "Jade Emperor",
    deityDizang: "Ksitigarbha",
    deityAmitabha: "Amitabha",

    // Regions
    regionNorth: "North",
    regionCentral: "Central",
    regionSouth: "South",
    regionEast: "East",
    regionIslands: "Islands",

    // Route Planning
    planRoute: "Route Planning",
    start: "Start",
    end: "End",
    selectTemple: "Select temple...",
    getRoute: "Get Route",
    clearRoute: "Clear Route",
    distance: "Distance:",
    estimatedTime: "Est. Time:",
    straightLine: "(Straight-line distance)",

    // Temple Details
    phone: "Phone",
    website: "Website",
    address: "Address",
    description: "Description",
    addToRoute: "Add to Route",
    addedToRoute: "Added to Route",
    viewDetails: "View Details",
    foundedYearLabel: "Founded",
    lodgingLabel: "Pilgrim Lodging",
    landingLabel: "Landing Point",
    historyLabel: "History",

    // Footer
    mapData: "Map Data:",
    routing: "Routing:",

    // Messages
    noResults: "No temples found",
    routeError: "Unable to calculate route. Showing straight-line distance.",
    loading: "Loading..."
  },

  zh: {
    // Header
    title: "台灣進香地圖",
    langToggle: "English",

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
 * Current language state
 */
let currentLanguage = localStorage.getItem('pilgrim-map-language') || 'zh';

/**
 * Get current language
 * @returns {string} Current language code ('zh' or 'en')
 */
function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Toggle language between Chinese and English
 */
function toggleLanguage() {
  currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
  localStorage.setItem('pilgrim-map-language', currentLanguage);
  updateUIText();
  updateMarkersLanguage();
  updateSearchPlaceholder();
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
 * Update marker popups with current language
 * This function will be called by the map module
 */
function updateMarkersLanguage() {
  // Trigger custom event that map module will listen to
  window.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language: currentLanguage }
  }));
}

/**
 * Initialize i18n module
 */
function initI18n() {
  // Set initial language
  const savedLang = localStorage.getItem('pilgrim-map-language');
  if (savedLang) {
    currentLanguage = savedLang;
  }

  // Set up language toggle button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }

  // Initial UI text update
  updateUIText();
  updateSearchPlaceholder();

  console.log(`i18n initialized with language: ${currentLanguage}`);
}

// Export functions for use in other modules
window.i18n = {
  init: initI18n,
  toggle: toggleLanguage,
  getText: getText,
  getDeityText: getDeityText,
  getRegionText: getRegionText,
  getCurrentLanguage: getCurrentLanguage
};
