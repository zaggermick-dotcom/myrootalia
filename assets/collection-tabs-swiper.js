(() => {
  const initSwiperLogic = (root) => {
    if (!root || root.dataset.swiperInit === 'true') return;
    if (root.dataset.layout !== 'swiper') return;

    root.dataset.swiperInit = 'true';

    const AUTOPLAY_ENABLED = root.dataset.autoplay === 'true';
    const PAGINATION_ENABLED = root.dataset.pagination === 'true';

    const panels = Array.from(root.querySelectorAll('[data-panel-index]'));

    const getSwiper = (panel) => panel?.querySelector('.swiper')?.swiper || null;

    const pauseSwiper = (swiper) => {
      swiper?.autoplay?.stop?.();
    };

    const resumeSwiper = (swiper) => {
      swiper?.autoplay?.start?.();
    };

    const getPaginationElement = (panel) => {
      if (!panel) return null;

      const swiperEl = panel.querySelector('.swiper');
      if (!swiperEl) return null;

      return (
        swiperEl.parentElement?.querySelector('[class*="pagination_"]') ||
        swiperEl.parentElement?.querySelector('.swiper-pagination') ||
        panel.querySelector('.swiper-pagination')
      );
    };

    const rebuildPagination = (swiper, panel) => {
      if (!swiper || !swiper.pagination || !PAGINATION_ENABLED) return;

      const paginationEl = getPaginationElement(panel);
      if (!paginationEl) return;

      const requiredClasses = [
        'swiper-pagination-clickable',
        'swiper-pagination-bullets',
        'swiper-pagination-horizontal'
      ];

      requiredClasses.forEach((cls) => {
        if (!paginationEl.classList.contains(cls)) {
          paginationEl.classList.add(cls);
        }
      });

      // IMPORTANT: update both params and runtime reference
      swiper.params.pagination = swiper.params.pagination || {};
      swiper.params.pagination.el = paginationEl;
      swiper.pagination.el = paginationEl;
      swiper.pagination.bullets = [];

      swiper.pagination.init?.();
      swiper.pagination.render?.();
      swiper.pagination.update?.();

      const bulletsCount = paginationEl.querySelectorAll('.swiper-pagination-bullet').length || 0;

      if (bulletsCount === 0 && swiper.slides?.length > 0) {
        paginationEl.innerHTML = '';

        for (let i = 0; i < swiper.slides.length; i++) {
          const bullet = document.createElement('span');
          bullet.className = 'swiper-pagination-bullet';
          bullet.setAttribute('tabindex', '0');
          bullet.setAttribute('role', 'button');
          bullet.setAttribute('aria-label', 'Go to slide ' + (i + 1));

          if (i === swiper.activeIndex) {
            bullet.classList.add('swiper-pagination-bullet-active');
            bullet.setAttribute('aria-current', 'true');
          }

          paginationEl.appendChild(bullet);
        }

        swiper.pagination.bullets = Array.from(
          paginationEl.querySelectorAll('.swiper-pagination-bullet')
        );
        swiper.pagination.update?.();
      }
    };

    const updateSwiperForVisibleTab = (swiper, panel) => {
      if (!swiper || swiper.destroyed) return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!swiper || swiper.destroyed) return;

          swiper.update();
          swiper.updateSize?.();
          swiper.updateSlides?.();
          swiper.updateProgress?.();
          swiper.updateSlidesClasses?.();

          rebuildPagination(swiper, panel);

          swiper.navigation?.update?.();
          swiper.scrollbar?.update?.();

          swiper.slideTo?.(swiper.activeIndex || 0, 0);

          if (AUTOPLAY_ENABLED) {
            resumeSwiper(swiper);
          }
        });
      });
    };

    const syncActiveTab = () => {
      const activePanel =
        panels.find((panel) => panel.getAttribute('aria-selected') === 'true') || panels[0];

      if (!activePanel) return;

      const swiper = getSwiper(activePanel);
      if (!swiper) return;

      updateSwiperForVisibleTab(swiper, activePanel);
    };

    panels.forEach((panel) => {
      panel.addEventListener('tab:change', (e) => {
        const swiper = getSwiper(panel);
        if (!swiper) return;

        if (e.detail.isActive) {
          updateSwiperForVisibleTab(swiper, panel);
        } else {
          pauseSwiper(swiper);
        }
      });
    });

    // Initial sync so hidden/visible state is correct after file load
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncActiveTab();
      });
    });
  };

  const initAll = () => {
    document
      .querySelectorAll('.collection-tabs[data-layout="swiper"]')
      .forEach(initSwiperLogic);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();