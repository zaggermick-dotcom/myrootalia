class FloatingVideo extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    this.storageKey = `floating-video:${this.dataset.sectionId}`;
    this.rememberClose = this.dataset.rememberClose === 'true';
    this.clickAction = this.dataset.clickAction || 'popup';
    this.designMode = Boolean(window.Shopify && window.Shopify.designMode);

    if (this.isDismissed()) {
      this.remove();
      return;
    }

    this.thumbnail = this.querySelector('.floating-video__thumbnail');
    this.openButton = this.querySelector('.floating-video__open');
    this.closeButton = this.querySelector('.floating-video__close');
    this.soundButton = this.querySelector('.floating-video__sound');
    this.handle = this.querySelector('.floating-video__handle');
    this.timeLabel = this.querySelector('.floating-video__time');
    this.popup = this.querySelector('.floating-video__popup');
    this.popupInner = this.querySelector('.floating-video__popup-inner');
    this.popupTemplate = this.querySelector('template');
    this.popupCloseButton = this.querySelector('.floating-video__popup-close');

    this.onKeydown = this.onKeydown.bind(this);

    // Sortie du widget : un ancêtre transformé (animation, transition de page)
    // ferait de lui le bloc conteneur du position:fixed et enfermerait la popup.
    if (this.popup) document.body.appendChild(this.popup);

    if (this.handle && this.dataset.edgeRetracted === 'true') this.setRetracted(true);

    this.bindEvents();
    this.startThumbnail();
    this.scheduleReveal();
  }

  disconnectedCallback() {
    window.clearTimeout(this.revealTimer);
    document.removeEventListener('keydown', this.onKeydown);

    // Ne pas relâcher le scroll si c'est une autre popup du thème qui le retient.
    if (this.popup?.classList.contains('is-open')) {
      document.body.classList.remove('popup-open');
    }

    // La popup vit dans <body> : sans ça, un re-rendu de section en laisserait
    // une par enregistrement dans l'éditeur.
    this.popup?.remove();
  }

  isDismissed() {
    if (this.designMode || !this.rememberClose) return false;

    try {
      return sessionStorage.getItem(this.storageKey) === 'dismissed';
    } catch (error) {
      return false;
    }
  }

  bindEvents() {
    this.openButton?.addEventListener('click', () => this.onOpenClick());
    this.closeButton?.addEventListener('click', () => this.dismiss());
    this.popupCloseButton?.addEventListener('click', () => this.closePopup());
    this.soundButton?.addEventListener('click', () => this.toggleSound());
    this.handle?.addEventListener('click', () => this.setRetracted(!this.classList.contains('is-retracted')));

    this.popup?.addEventListener('click', event => {
      if (event.target === this.popup) this.closePopup();
    });

    if (this.thumbnail) {
      this.thumbnail.addEventListener('timeupdate', () => this.renderTime());
      this.thumbnail.addEventListener('loadedmetadata', () => this.renderTime());
    }
  }

  onOpenClick() {
    if (this.clickAction === 'popup') this.openPopup();
    if (this.clickAction === 'expand') this.toggleExpand();
    if (this.clickAction === 'play') this.togglePlayback();
  }

  setRetracted(retracted) {
    this.classList.toggle('is-retracted', retracted);
    this.handle?.setAttribute('aria-expanded', retracted ? 'false' : 'true');

    // Replié, le panneau n'est plus regardé : inutile de le laisser sonoriser.
    if (retracted) this.setMuted(true);
  }

  // Lecture sur place : la vignette prend le son, sans agrandissement ni popup.
  togglePlayback() {
    if (!this.thumbnail) return;

    if (this.thumbnail.muted) {
      this.setMuted(false);
      const played = this.thumbnail.play();
      if (played && typeof played.catch === 'function') played.catch(() => {});
    } else {
      this.setMuted(true);
    }
  }

  scheduleReveal() {
    const delay = parseInt(this.dataset.delay, 10) || 0;

    this.revealTimer = window.setTimeout(() => {
      this.classList.add('is-visible');
    }, this.designMode ? 0 : delay);
  }

  startThumbnail() {
    if (!this.thumbnail) return;

    this.setMuted(true);
    this.renderTime();

    // L'autoplay peut être refusé (économie de données, réglage navigateur) :
    // la vignette reste alors sur sa première image, la popup fonctionne toujours.
    const played = this.thumbnail.play();
    if (played && typeof played.catch === 'function') played.catch(() => {});
  }

  setMuted(muted) {
    if (!this.thumbnail) return;

    this.thumbnail.muted = muted;

    if (!this.soundButton) return;
    this.soundButton.setAttribute('aria-pressed', muted ? 'false' : 'true');
    this.soundButton.classList.toggle('floating-video__sound--on', !muted);
  }

  renderTime() {
    if (!this.timeLabel || !this.thumbnail) return;

    const seconds = Math.floor(this.thumbnail.currentTime || 0);
    const minutes = Math.floor(seconds / 60);

    this.timeLabel.textContent = `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  toggleSound() {
    if (!this.thumbnail) return;

    this.setMuted(!this.thumbnail.muted);
  }

  toggleExpand() {
    const expanded = this.classList.toggle('is-expanded');

    // Agrandir vaut lecture volontaire : on donne le son, on le retire au repli.
    this.setMuted(!expanded);
    if (expanded) {
      const played = this.thumbnail?.play();
      if (played && typeof played.catch === 'function') played.catch(() => {});
    }
  }

  openPopup() {
    if (!this.popup || !this.popupTemplate) return;

    this.popupInner.append(this.popupTemplate.content.cloneNode(true));

    const media = this.popupInner.querySelector('video');
    if (media && this.thumbnail) {
      media.currentTime = this.thumbnail.currentTime;
      const played = media.play();
      if (played && typeof played.catch === 'function') played.catch(() => {});
    }

    this.thumbnail?.pause();
    this.classList.add('is-popup-open');
    this.popup.classList.add('is-open');
    document.body.classList.add('popup-open');
    document.addEventListener('keydown', this.onKeydown);
    this.popupCloseButton?.focus();
  }

  closePopup() {
    if (!this.popup) return;

    this.popup.classList.remove('is-open');
    // Avant le focus plus bas : un élément masqué n'est pas focusable.
    this.classList.remove('is-popup-open');
    document.body.classList.remove('popup-open');
    document.removeEventListener('keydown', this.onKeydown);

    // L'iframe YouTube/Vimeo continue de jouer tant qu'elle est dans le DOM.
    this.popupInner.querySelectorAll('video, iframe').forEach(element => element.remove());

    this.startThumbnail();
    this.openButton?.focus();
  }

  onKeydown(event) {
    if (event.key === 'Escape') this.closePopup();
  }

  dismiss() {
    this.classList.remove('is-visible');
    this.classList.remove('is-expanded');
    this.thumbnail?.pause();

    if (this.rememberClose && !this.designMode) {
      try {
        sessionStorage.setItem(this.storageKey, 'dismissed');
      } catch (error) {
        // Navigation privée : la fermeture ne survit pas au changement de page.
      }
    }
  }
}

if (!customElements.get('floating-video')) {
  customElements.define('floating-video', FloatingVideo);
}
