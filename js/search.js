// Taiwan Pilgrim Map - Search Module

/**
 * Search input debounce timer
 */
let searchTimeout = null;

/**
 * Search temples by query string
 * @param {string} query - Search query
 * @param {array} temples - Array of temple data objects
 * @returns {array} Array of matching temples
 */
function searchTemples(query, temples) {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const lang = window.i18n.getCurrentLanguage();

  return temples.filter(temple => {
    // Search in both Chinese and English names (English only on curated points)
    const nameMatch =
      (temple.nameZh || '').toLowerCase().includes(searchTerm) ||
      (temple.nameEn || '').toLowerCase().includes(searchTerm);

    // Also search in addresses
    const addressMatch =
      (temple.addressZh || '').toLowerCase().includes(searchTerm) ||
      (temple.addressEn || '').toLowerCase().includes(searchTerm);

    return nameMatch || addressMatch;
  });
}

/**
 * Display search results in dropdown
 * @param {array} results - Array of matching temples
 */
function showSearchResults(results) {
  const resultsContainer = document.getElementById('search-results');

  if (results.length === 0) {
    resultsContainer.innerHTML = `<div class="search-result-item">${window.i18n.getText('noResults')}</div>`;
    resultsContainer.classList.add('active');
    return;
  }

  const lang = window.i18n.getCurrentLanguage();

  resultsContainer.innerHTML = results.map(temple => `
    <div class="search-result-item" data-temple-id="${temple.id}">
      <div class="temple-name">${lang === 'zh' ? temple.nameZh : (temple.nameEn || temple.nameZh)}</div>
      <div class="temple-region">${window.i18n.getDeityText(temple.mainDeity)} · ${window.i18n.getRegionText(temple.region)}</div>
    </div>
  `).join('');

  resultsContainer.classList.add('active');

  // Add click handlers
  const resultItems = resultsContainer.querySelectorAll('.search-result-item');
  resultItems.forEach(item => {
    item.addEventListener('click', function() {
      const templeId = parseInt(this.getAttribute('data-temple-id'));
      selectTempleFromSearch(templeId);
    });
  });
}

/**
 * Hide search results dropdown
 */
function hideSearchResults() {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.classList.remove('active');
}

/**
 * Select temple from search results
 * @param {number} templeId - Temple ID
 */
function selectTempleFromSearch(templeId) {
  // Focus on temple in map
  window.mapModule.focus(templeId);

  // Clear search input and hide results
  const searchInput = document.getElementById('search-input');
  searchInput.value = '';
  hideSearchResults();
}

/**
 * Initialize search module
 * @param {array} temples - Array of temple data objects
 */
function initSearch(temples) {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  // Add input event listener with debounce
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout (300ms debounce)
    searchTimeout = setTimeout(() => {
      const results = searchTemples(query, temples);
      showSearchResults(results);
    }, 300);
  });

  // Hide results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      hideSearchResults();
  }
  });

  // Handle Enter key
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = e.target.value;
      const results = searchTemples(query, temples);
      if (results.length > 0) {
        selectTempleFromSearch(results[0].id);
      }
    }
  });

  console.log('Search initialized');
}

// Export functions for use in other modules
window.searchModule = {
  init: initSearch,
  search: searchTemples,
  showResults: showSearchResults,
  hideResults: hideSearchResults
};
