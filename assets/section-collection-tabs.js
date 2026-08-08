(() => {
  const initTabs = (root) => {
    if (!root || root.dataset.tabsInit === 'true') {
      return;
    }
    root.dataset.tabsInit = 'true';

    const tabs = Array.from(root.querySelectorAll('[data-tab-target]'));
    const panels = Array.from(root.querySelectorAll('[data-panel-index]'));

    const activate = (index) => {
      tabs.forEach((tab, i) => {
        const newState = i === index ? 'true' : 'false';
        tab.setAttribute('aria-selected', newState);
      });

      panels.forEach((panel, i) => {
        const isActive = i === index;
        const newState = isActive ? 'true' : 'false';
        panel.setAttribute('aria-selected', newState);

        panel.dispatchEvent(new CustomEvent('tab:change', {
          detail: { isActive }
        }));
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabIndex = Number(tab.dataset.tabTarget || 0);
        activate(tabIndex);
      });
    });

    const activeIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true')
    );

    requestAnimationFrame(() => {
      activate(activeIndex);
    });
  };

  const initAll = () => {
    document.querySelectorAll('.collection-tabs').forEach(initTabs);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();