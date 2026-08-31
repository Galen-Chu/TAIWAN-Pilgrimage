// Taiwan Pilgrim Map - Routing Module

/**
 * Routing control instance
 */
let routingControl = null;

/**
 * Current route
 */
let currentRoute = null;

/**
 * Calculate Haversine distance between two points
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a) / Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Format distance for display
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance string
 */
function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format time for display
 * @param {number} hours - Time in hours
 * @returns {string} Formatted time string
 */
function formatTime(hours) {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  const h = Math.floor(hours);
  const min = Math.round((hours - h) * 60);
  return min > 0 ? `${h}h ${min}min` : `${h}h`;
}

/**
 * Calculate route between two temples
 * @param {object} map - Leaflet map instance
 * @param {object} startTemple - Start temple data object
 * @param {object} endTemple - End temple data object
 */
function calculateRoute(map, startTemple, endTemple) {
  // Clear existing route
  clearRoute();

  // Show loading state
  const routeInfo = document.getElementById('route-info');
  const distanceEl = document.getElementById('route-distance');
  const timeEl = document.getElementById('route-time');

  routeInfo.style.display = 'block';
  distanceEl.textContent = window.i18n.getText('loading');
  timeEl.textContent = '';

  // Try OSRM routing
  try {
    routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startTemple.lat, startTemple.lng),
        L.latLng(endTemple.lat, endTemple.lng)
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: {
        styles: [
          { color: '#C8102E', opacity: 0.8, weight: 5 }
        ]
      },
      createMarker: function() { return null; }, // Don't create extra markers
      addWaypoints: false
    }).addTo(map);

    // Handle route found
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      if (routes.length > 0) {
        const route = routes[0];
        currentRoute = route;

        // Display route info
        const summary = route.summary;
        distanceEl.textContent = formatDistance(summary.totalDistance / 1000);
        timeEl.textContent = formatTime(summary.totalTime / 3600);

        console.log('Route calculated successfully');
      }
    });

    // Handle routing error
    routingControl.on('routingerror', function(e) {
      console.error('Routing error:', e);
      fallbackToHaversine(startTemple, endTemple, distanceEl, timeEl);
    });

  } catch (error) {
    console.error('Failed to create route:', error);
    fallbackToHaversine(startTemple, endTemple, distanceEl, timeEl);
  }
}

/**
 * Fallback to Haversine distance calculation
 * @param {object} startTemple - Start temple data object
 * @param {object} endTemple - End temple data object
 * @param {object} distanceEl - Distance display element
 * @param {object} timeEl - Time display element
 */
function fallbackToHaversine(startTemple, endTemple, distanceEl, timeEl) {
  const distance = calculateHaversineDistance(
    startTemple.lat, startTemple.lng,
    endTemple.lat, endTemple.lng
  );

  distanceEl.textContent = `${formatDistance(distance)} ${window.i18n.getText('straightLine')}`;

  // Estimate time (assuming 50 km/h average driving speed)
  const estimatedHours = distance / 50;
  timeEl.textContent = formatTime(estimatedHours);

  // Draw straight line on map
  const map = window.mapModule.getMap();
  if (map) {
    currentRoute = L.polyline([
      [startTemple.lat, startTemple.lng],
      [endTemple.lat, endTemple.lng]
    ], {
      color: '#C8102E',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 10'
    }).addTo(map);

    map.fitBounds(currentRoute.getBounds(), { padding: [50, 50] });
  }

  console.log('Using Haversine distance as fallback');
}

/**
 * Clear route from map
 */
function clearRoute() {
  if (routingControl) {
    routingControl.splice();
    routingControl = null;
  }

  if (currentRoute) {
    const map = window.mapModule.getMap();
    if (map && currentRoute.remove) {
      map.removeLayer(currentRoute);
    }
    currentRoute = null;
  }

  const routeInfo = document.getElementById('route-info');
  routeInfo.style.display = 'none';

  console.log('Route cleared');
}

/**
 * Populate route dropdown menus with temple options
 * @param {array} temples - Array of temple data objects
 */
function populateRouteDropdowns(temples) {
  const startSelect = document.getElementById('route-start');
  const endSelect = document.getElementById('route-end');

  const lang = window.i18n.getCurrentLanguage();

  // Clear existing options (keep placeholder)
  startSelect.innerHTML = `<option value="">${window.i18n.getText('selectTemple')}</option>`;
  endSelect.innerHTML = `<option value="">${window.i18n.getText('selectTemple')}</option>`;

  // Add temple options
  temples.forEach(temple => {
    const name = lang === 'zh' ? temple.nameZh : (temple.nameEn || temple.nameZh);
    const option = `<option value="${temple.id}">${name}</option>`;
    startSelect.innerHTML += option;
    endSelect.innerHTML += option;
  });
}

/**
 * Add temple to route (called from modal)
 * @param {number} templeId - Temple ID
 */
function addTempleToRoute(templeId) {
  const startSelect = document.getElementById('route-start');
  const endSelect = document.getElementById('route-end');

  // If start is empty, set as start
  if (!startSelect.value) {
    startSelect.value = templeId;
  }
  // Otherwise set as end
  else if (!endSelect.value) {
    endSelect.value = templeId;
  }
  // If both are set, replace end
  else {
    endSelect.value = templeId;
  }
}

/**
 * Initialize routing module
 * @param {object} map - Leaflet map instance
 * @param {array} temples - Array of temple data objects
 */
function initRouting(map, temples) {
  // Populate dropdowns
  populateRouteDropdowns(temples);

  // Set up calculate route button
  const calculateButton = document.getElementById('calculate-route');
  calculateButton.addEventListener('click', function() {
    const startId = parseInt(document.getElementById('route-start').value);
    const endId = parseInt(document.getElementById('route-end').value);

    if (!startId || !endId) {
      alert(window.i18n.getCurrentLanguage() === 'zh'
        ? '請選擇起點和終點廟宇'
        : 'Please select start and end temples');
      return;
    }

    if (startId === endId) {
      alert(window.i18n.getCurrentLanguage() === 'zh'
        ? '起點和終點不能相同'
        : 'Start and end temples must be different');
      return;
    }

    const startTemple = temples.find(t => t.id === startId);
    const endTemple = temples.find(t => t.id === endId);

    if (startTemple && endTemple) {
      calculateRoute(map, startTemple, endTemple);
    }
  });

  // Set up clear route button
  const clearButton = document.getElementById('clear-route');
  clearButton.addEventListener('click', clearRoute);

  console.log('Routing initialized');
}

// Make addTempleToRoute globally available
window.addTempleToRoute = addTempleToRoute;

// Export functions for use in other modules
window.routingModule = {
  init: initRouting,
  calculate: calculateRoute,
  clear: clearRoute,
  addTemple: addTempleToRoute
};
