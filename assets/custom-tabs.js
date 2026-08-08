/*
 * Tabs block. A theme block cannot iterate its children in Liquid
 * ({% content_for 'blocks' %} is the only render path), so the tab bar
 * is built here from each panel's data-tab-title. Without JS, the block's
 * CSS shows the first panel only.
 */
if (!customElements.get('custom-tabs')) {
  class CustomTabs extends HTMLElement {
    connectedCallback() {
      this.nav = this.querySelector(':scope > .custom-tabs__nav');
      const panelsWrap = this.querySelector(':scope > .custom-tabs__panels');
      if (!this.nav || !panelsWrap) return;

      // Own panels only; nested tabs manage theirs.
      this.panels = Array.from(panelsWrap.querySelectorAll('.custom-tab-panel')).filter(
        (panel) => panel.closest('custom-tabs') === this
      );
      if (!this.panels.length) return;

      this.build();

      // Editor: selecting a tab (or a block inside it) shows its panel.
      if (window.Shopify && window.Shopify.designMode) {
        this.onBlockSelect = (event) => {
          const panel = event.target.closest('.custom-tab-panel');
          const index = this.panels.indexOf(panel);
          if (index !== -1) this.activate(index);
        };
        document.addEventListener('shopify:block:select', this.onBlockSelect);
      }
    }

    disconnectedCallback() {
      if (this.onBlockSelect) {
        document.removeEventListener('shopify:block:select', this.onBlockSelect);
        this.onBlockSelect = null;
      }
    }

    build() {
      this.nav.textContent = '';
      this.buttons = this.panels.map((panel, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'custom-tabs__tab';
        button.textContent = panel.dataset.tabTitle || '';
        button.id = `${panel.id}-tab`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', button.id);
        button.addEventListener('click', () => this.activate(index));
        this.nav.appendChild(button);
        return button;
      });

      this.nav.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const step = event.key === 'ArrowRight' ? 1 : -1;
        const next = (this.current + step + this.buttons.length) % this.buttons.length;
        this.activate(next);
        this.buttons[next].focus();
      });

      this.classList.add('js-ready');
      this.activate(0);
    }

    activate(index) {
      this.current = index;
      this.panels.forEach((panel, i) => {
        const active = i === index;
        panel.classList.toggle('is-active', active);
        const button = this.buttons[i];
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
        button.tabIndex = active ? 0 : -1;
      });
    }
  }

  customElements.define('custom-tabs', CustomTabs);
}
