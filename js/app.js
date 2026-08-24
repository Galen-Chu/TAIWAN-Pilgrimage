// Taiwan Pilgrim Map - Main Application Controller

/**
 * Main Application Initialization
 * Coordinates all modules and handles global event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Taiwan Pilgrim Map...');

  try {
    // 1. Initialize internationalization first (needed by other modules)
    window.i18n.init();

    // 2. Initialize map and create markers
    const map = window.mapModule.init(temples);

    // 3. Initialize filters
    window.filtersModule.init(temples);

    // 4. Initialize search
    window.searchModule.init(temples);

    // 5. Initialize routing
    window.routingModule.init(map, temples);

    // 6. Initialize personal journey (v1.x: check-in, footprint, import/export)
    window.journeyUI.init();

    // 6. Setup global event listeners
    setupGlobalEventListeners();

    console.log('Application initialized successfully');

  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});

/**
 * Setup global event listeners
 */
function setupGlobalEventListeners() {
  // Handle window resize for responsive adjustments
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      const map = window.mapModule.getMap();
      if (map) {
        map.invalidateSize();
      }
    }, 250);
  });

  // Handle escape key to close modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close temple modal
      const templeModal = document.getElementById('temple-modal');
      if (templeModal.classList.contains('active')) {
        templeModal.classList.remove('active');
      }

      // Close search results
      window.searchModule.hideResults();
    }
  });

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          sidebar.classList.remove('active');
        }
      }
    });
  }

  // Handle scroll to hide/show header on mobile
  let lastScrollTop = 0;
  const header = document.querySelector('.header');

  if (window.innerWidth <= 768 && header) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide header
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
    });
  }

  // Print-friendly: disable map interactions when printing
  window.addEventListener('beforeprint', function() {
    const map = window.mapModule.getMap();
    if (map) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
    }
  });

  window.addEventListener('afterprint', function() {
    const map = window.mapModule.getMap();
    if (map) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
    }
  });

  console.log('Global event listeners setup complete');
}

/**
 * Utility function to check if device is mobile
 * @returns {boolean} True if mobile device
 */
function isMobileDevice() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Utility function to smooth scroll to element
 * @param {string} elementId - Element ID to scroll to
 */
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Handle errors gracefully
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
function handleError(error, context) {
  console.error(`Error in ${context}:`, error);

  // Show user-friendly error message
  const lang = window.i18n.getCurrentLanguage();
  const message = lang === 'zh'
    ? '發生錯誤，請重新整理頁面。'
    : 'An error occurred. Please refresh the page.';

  // Only show alert in development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    alert(message);
  }
}

// Global error handler
window.addEventListener('error', function(e) {
  handleError(e.error, 'Global');
});

// Make utility functions globally available
window.app = {
  isMobile: isMobileDevice,
  scrollTo: scrollToElement,
  handleError: handleError
};

console.log('Main app controller loaded');
