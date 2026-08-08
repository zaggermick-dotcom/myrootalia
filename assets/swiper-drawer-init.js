/**
 * Swiper Initialization for Cart Drawer
 * Handles initialization and reinitialization of all Swiper instances in the drawer
 */

// Store instances for management
const drawerSwiperInstances = {
  trust: null,
  upsell: [],
};

/**
 * Initialize or reinitialize the trust slider
 */
function initTrustSlider() {
  const trustElement = document.querySelector('#drawer-trust__swiper');
  
  if (!trustElement) return;

  // Destroy existing instance if it exists
  if (drawerSwiperInstances.trust) {
    drawerSwiperInstances.trust.destroy(true, true);
    drawerSwiperInstances.trust = null;
  }

  // Create new instance
  drawerSwiperInstances.trust = new Swiper('#drawer-trust__swiper', {
    autoplay: { delay: 1000 },
    loop: true,
    navigation: {
      nextEl: '.button-next-drawer-trust__swiper',
      prevEl: '.button-prev-drawer-trust__swiper',
    },
  });
}

/**
 * Initialize or reinitialize the upsell slider (vertical single product)
 */
function initVerticalUpsellSlider() {
  const upsellElement = document.querySelector('#drawer-upsell__swiper');
  
  if (!upsellElement) return;

  // Find and destroy existing instance if it exists
  const existingIndex = drawerSwiperInstances.upsell.findIndex(
    instance => instance.el && instance.el.id === 'drawer-upsell__swiper'
  );
  
  if (existingIndex !== -1) {
    drawerSwiperInstances.upsell[existingIndex].destroy(true, true);
    drawerSwiperInstances.upsell.splice(existingIndex, 1);
  }

  // Create new instance
  const instance = new Swiper('#drawer-upsell__swiper', {
    slidesPerView: 1.2,
    spaceBetween: 10,
    autoHeight: true,
  });
  
  drawerSwiperInstances.upsell.push(instance);
}

/**
 * Initialize or reinitialize horizontal upsell collection swipers
 * These use dynamic IDs with the format: horizontal_upsell_drawer__<uniqueId>
 */
function initHorizontalUpsellSliders() {
  const horizontalUpsells = document.querySelectorAll('.drawer__upsell--swiper');
  
  if (horizontalUpsells.length === 0) return;

  horizontalUpsells.forEach(upsellElement => {
    const swiperInstanceId = upsellElement.id;
    
    // Find and destroy existing instance if it exists
    const existingIndex = drawerSwiperInstances.upsell.findIndex(
      instance => instance.el && instance.el.id === swiperInstanceId
    );
    
    if (existingIndex !== -1) {
      drawerSwiperInstances.upsell[existingIndex].destroy(true, true);
      drawerSwiperInstances.upsell.splice(existingIndex, 1);
    }

    // Extract the unique ID from the swiper element ID
    // Format: horizontal_upsell_drawer__<uniqueId>
    const uniqueId = swiperInstanceId.replace('horizontal_upsell_drawer__', '');
    
    // Find pagination and navigation elements
    const paginationEl = document.querySelector(`.pagination_${uniqueId}`);
    const prevEl = document.querySelector(`.prev_${uniqueId}`);
    const nextEl = document.querySelector(`.next_${uniqueId}`);

    // Build swiper config
    const config = {
      loop: true,
      mousewheel: { forceToAxis: true },
      spaceBetween: 24,
      slidesPerView: 1,
      autoHeight: true,
      watchOverflow: true,
      on: {
        init: toggleScroll,
        resize: toggleScroll,
        update: toggleScroll
      },
      autoplay: {
        pauseOnMouseEnter: true,
        enabled: false,
        delay: 5000
      }
    };

    // Add pagination if element exists
    if (paginationEl) {
      config.pagination = {
        el: paginationEl,
        clickable: true
      };
    }

    // Add navigation if elements exist
    if (prevEl || nextEl) {
      config.navigation = {
        prevEl: prevEl,
        nextEl: nextEl
      };
    }

    // Create new instance
    const instance = new Swiper(upsellElement, config);
    drawerSwiperInstances.upsell.push(instance);
  });
}

/**
 * Toggle scroll lock based on swiper overflow state
 */
function toggleScroll(swiper) {
  swiper.el.classList.toggle('no-scroll', swiper.isLocked);
}

/**
 * Main function to initialize all drawer swipers
 * Call this when the drawer opens
 */
function initializeDrawerSwipers() {
  initTrustSlider();
  initVerticalUpsellSlider();
  initHorizontalUpsellSliders();
}

/**
 * Reinitialize all drawer swipers after AJAX content update
 * Call this after the drawer content is updated via AJAX
 */
function reinitializeDrawerSwipers() {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initializeDrawerSwipers();
  }, 100);
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.drawerSwiperManager = {
    initialize: initializeDrawerSwipers,
    reinitialize: reinitializeDrawerSwipers,
    initTrust: initTrustSlider,
    initVerticalUpsell: initVerticalUpsellSlider,
    initHorizontalUpsell: initHorizontalUpsellSliders,
    instances: drawerSwiperInstances
  };
}
