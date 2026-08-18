// Taiwan Pilgrim Map - Filters Module

/**
 * Filter state
 */
let selectedDeities = [];
let selectedRegions = [];

/**
 * Extract unique deities and regions from temple data
 * @param {array} temples - Array of temple data objects
 * @returns {object} Object with deities and regions arrays
 */
function extractFilterOptions(temples) {
  const deities = [...new Set(temples.map(t => t.mainDeity))];
  const regions = [...new Set(temples.map(t => t.region))];

  // Count occurrences
  const deityCounts = {};
  const regionCounts = {};

  temples.forEach(temple => {
    deityCounts[temple.mainDeity] = (deityCounts[temple.mainDeity] || 0) + 1;
    regionCounts[temple.region] = (regionCounts[temple.region] || 0) + 1;
  });

  return { deities, regions, deityCounts, regionCounts };
}

/**
 * Create filter checkboxes in the sidebar
 * @param {array} temples - Array of temple data objects
 */
function createFilterUI(temples) {
  const { deities, regions, deityCounts, regionCounts } = extractFilterOptions(temples);

  // Create deity filters
  const deityFiltersContainer = document.getElementById('deity-filters');
  deityFiltersContainer.innerHTML = '';

  deities.forEach(deity => {
    const count = deityCounts[deity];
    const deityText = window.i18n.getDeityText(deity);
    const label = window.i18n.getCurrentLanguage() === 'zh' ? `${deityText} (${count})` : `${deityText} (${count})`;

    const checkbox = createFilterCheckbox('deity', deity, label);
    deityFiltersContainer.appendChild(checkbox);
  });

  // Create region filters
  const regionFiltersContainer = document.getElementById('region-filters');
  regionFiltersContainer.innerHTML = '';

  regions.sort().forEach(region => {
    const count = regionCounts[region];
    const regionText = window.i18n.getRegionText(region);
    const label = `${regionText} (${count})`;

    const checkbox = createFilterCheckbox('region', region, label);
    regionFiltersContainer.appendChild(checkbox);
  });
}

/**
 * Create a filter checkbox element
 * @param {string} type - Filter type ('deity' or 'region')
 * @param {string} value - Filter value
 * @param {string} label - Display label
 * @returns {HTMLElement} Checkbox element
 */
function createFilterCheckbox(type, value, label) {
  const div = document.createElement('div');
  div.className = 'filter-checkbox';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = `filter-${type}-${value}`;
  input.name = `${type}-filter`;
  input.value = value;

  const labelElement = document.createElement('label');
  labelElement.htmlFor = input.id;
  labelElement.innerHTML = label;

  div.appendChild(input);
  div.appendChild(labelElement);

  // Add event listener
  input.addEventListener('change', handleFilterChange);

  return div;
}

/**
 * Handle filter checkbox change
 * @param {Event} event - Change event
 */
function handleFilterChange(event) {
  const checkbox = event.target;
  const type = checkbox.name.split('-')[0]; // 'deity' or 'region'
  const value = checkbox.value;

  if (checkbox.checked) {
    // Add to selected filters
    if (type === 'deity' && !selectedDeities.includes(value)) {
      selectedDeities.push(value);
    } else if (type === 'region' && !selectedRegions.includes(value)) {
      selectedRegions.push(value);
    }
  } else {
    // Remove from selected filters
    if (type === 'deity') {
      selectedDeities = selectedDeities.filter(d => d !== value);
    } else if (type === 'region') {
      selectedRegions = selectedRegions.filter(r => r !== value);
    }
  }

  // Apply filters
  applyFilters();
}

/**
 * Apply filters to markers
 */
function applyFilters() {
  window.mapModule.filter(selectedDeities, selectedRegions);
}

/**
 * Clear all filters
 */
function clearFilters() {
  selectedDeities = [];
  selectedRegions = [];

  // Uncheck all checkboxes
  const checkboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  // Apply filters (show all)
  applyFilters();
}

/**
 * Initialize filters module
 * @param {array} temples - Array of temple data objects
 */
function initFilters(temples) {
  createFilterUI(temples);

  // Set up clear filters button
  const clearButton = document.getElementById('clear-filters');
  if (clearButton) {
    clearButton.addEventListener('click', clearFilters);
  }

  console.log('Filters initialized');
}

/**
 * Get selected deities
 * @returns {array} Array of selected deity names
 */
function getSelectedDeities() {
  return selectedDeities;
}

/**
 * Get selected regions
 * @returns {array} Array of selected region names
 */
function getSelectedRegions() {
  return selectedRegions;
}

// Export functions for use in other modules
window.filtersModule = {
  init: initFilters,
  apply: applyFilters,
  clear: clearFilters,
  getSelectedDeities: getSelectedDeities,
  getSelectedRegions: getSelectedRegions
};
