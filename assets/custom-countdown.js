/*
 * Compte à rebours du bloc « Compte à rebours » de la section avancée.
 *
 * Volontairement distinct de <timer-banner> (sections/timer.liquid) : celui-ci
 * supprime la SECTION entière quand il expire, ce qui emporterait toute la
 * section avancée et les autres blocs qu'elle contient. Ici on masque
 * uniquement le bloc.
 */
if (!customElements.get('custom-countdown')) {
  // Portée limitée au bloc : le fichier est chargé une fois par instance du
  // bloc, des const globales planteraient à la 2e exécution et pollueraient
  // l'espace de noms du thème.
  const pad = (n) => ('0' + n).slice(-2);
  const setText = (el, value) => {
    if (el && el.textContent !== value) el.textContent = value;
  };

  class CustomCountdown extends HTMLElement {
    connectedCallback() {
      const config = this.querySelector(':scope > [type="application/json"]');
      if (!config) return;

      this.settings = JSON.parse(config.innerText);
      this.block = this.closest('.custom-countdown');
      this.days = this.querySelector('[data-days]');
      this.hrs = this.querySelector('[data-hours]');
      this.mins = this.querySelector('[data-minutes]');
      this.secs = this.querySelector('[data-seconds]');
      this.start(`countdown-${this.settings.id}`);
    }

    start(name) {
      const cookieDeadline = this.getCookie(name);
      const initialDeadline = Date.now() + this.settings.time * 60000;
      const cookieExpire = new Date(initialDeadline + this.settings.expiry * 60000).toUTCString();
      const deadline = Number(cookieDeadline) || initialDeadline;
      if (!cookieDeadline) document.cookie = `${name}=${deadline};expires=${cookieExpire};path=/`;

      const tick = () => {
        const total = deadline - Date.now();
        if (total <= 0 || isNaN(total)) {
          // On masque le bloc, jamais la section.
          if (this.block) this.block.hidden = true;
          return;
        }
        const time = {
          days: Math.floor(total / (1000 * 60 * 60 * 24)),
          hrs: Math.floor((total / (1000 * 60 * 60)) % 24),
          mins: Math.floor((total / 1000 / 60) % 60),
          secs: Math.floor((total / 1000) % 60),
        };
        // textContent plutôt qu'innerHTML : pas d'analyse HTML quatre fois
        // par seconde, et on n'écrit que si la valeur a changé.
        setText(this.days, time.days > 0 ? pad(time.days) : '');
        setText(this.hrs, time.hrs > 0 ? pad(time.hrs) : '');
        setText(this.mins, time.mins > 0 ? pad(time.mins) : '');
        setText(this.secs, pad(time.secs));
        setTimeout(tick, 1000 - (Date.now() % 1000));
      };
      tick();
    }

    getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
  }

  customElements.define('custom-countdown', CustomCountdown);
}
