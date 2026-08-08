if (!customElements.get('media-popup')) {
  class MediaPopup extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      // Get all grid items with popup triggers
      const gridItems = document.querySelectorAll('[data-popup-trigger]');
      
      gridItems.forEach(item => {
        item.addEventListener('click', () => {
          const popupId = item.dataset.popupTrigger;
          const popup = document.getElementById(popupId);
          if (popup) this.open(popup);
        });
      });

      // Add click event to all close buttons
      const closeButtons = document.querySelectorAll('.popup-media__closer');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const popup = button.closest('.media__popup');
          if (popup) this.close(popup);
        });
      });

      // Close when clicking outside the media container
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('media__popup') || e.target.classList.contains('media__popup-wrapper')) {
          const popup = e.target.closest('.media__popup');
          if (popup && !e.target.closest('.media__popup-container')) {
            this.close(popup);
          }
        }
      });

      // Close on escape key
      document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
          const openPopup = document.querySelector('.media__popup[style*="visibility: visible"]');
          if (openPopup) this.close(openPopup);
        }
      });
    }

    open(popup) {
      document.body.classList.add('popup-open');
      popup.style.visibility = 'visible';
      popup.style.opacity = '1';
    }

    close(popup) {
      document.body.classList.remove('popup-open');
      popup.style.visibility = 'hidden';
      popup.style.opacity = '0';
    }
  }

  customElements.define('media-popup', MediaPopup);
}

