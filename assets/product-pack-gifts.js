(function () {
  const giftWrapper = document.querySelector('.pack-free-gifts__list');
  if (!giftWrapper) return;

  const productPackNode = document.querySelector('product-pack') || giftWrapper.closest('.pack-free-gifts');

  function readGiftCount(packIndex) {
    if (!productPackNode) return 0;
    const dsKey = productPackNode.dataset && productPackNode.dataset['giftCount' + packIndex];
    if (typeof dsKey !== 'undefined') {
      return parseInt(dsKey, 10) || 0;
    }
    const attrKey = productPackNode.getAttribute && productPackNode.getAttribute('data-gift-count-' + packIndex);
    return parseInt(attrKey || '0', 10) || 0;
  }

  function cssVarMs(varName, fallbackMs) {
    const root = document.querySelector('.pack-free-gifts') || document.documentElement;
    const val = getComputedStyle(root).getPropertyValue(varName).trim() || '';
    if (!val) return fallbackMs;
    if (val.endsWith('ms')) return parseFloat(val.replace('ms', ''));
    if (val.endsWith('s')) return parseFloat(val.replace('s', '')) * 1000;
    const numeric = parseFloat(val);
    return isFinite(numeric) ? numeric : fallbackMs;
  }

  const popMs = () => cssVarMs('--paper-pop-duration', 520);
  const hideMs = () => cssVarMs('--paper-hide-duration', 360);
  const staggerMs = () => cssVarMs('--paper-stagger-step', 120);

  function animateIn(el, delay = 0) {
    // avoid re-adding if already revealing
    if (el.classList.contains('paper-reveal') || el.classList.contains('visible')) {
      el.classList.add('visible'); // ensure visible
      el.style.removeProperty('--reveal-delay');
      return;
    }
    el.style.setProperty('--reveal-delay', `${delay}ms`);
    // ensure a clean start
    el.classList.remove('paper-hide');
    // next tick to force style recalculation
    requestAnimationFrame(() => {
      el.classList.add('visible'); // put into visible state so layout stable
      void el.offsetWidth; // force reflow for animation start
      el.classList.add('paper-reveal');
    });

    function onEnd(e) {
      if (e && e.animationName && (e.animationName === 'paperPop' || e.type === 'animationend')) {
        el.classList.remove('paper-reveal');
        el.style.removeProperty('--reveal-delay');
        el.removeEventListener('animationend', onEnd);
      }
    }
    el.addEventListener('animationend', onEnd);
    // safety timeout fallback
    setTimeout(() => {
      onEnd();
    }, popMs() + 300);
  }

  function animateOut(el) {
    if (!el.classList.contains('visible')) return;
    // don't remove visible immediately to avoid layout jank — animate out
    el.classList.remove('paper-reveal');
    // ensure paper-hide applied
    requestAnimationFrame(() => {
      el.classList.add('paper-hide');
    });

    function onEnd(e) {
      if (e && e.animationName && (e.animationName === 'paperHide' || e.type === 'animationend')) {
        el.classList.remove('paper-hide');
        el.classList.remove('visible');
        el.style.removeProperty('--reveal-delay');
        el.removeEventListener('animationend', onEnd);
      }
    }
    el.addEventListener('animationend', onEnd);
    // safety fallback
    setTimeout(() => {
      onEnd();
    }, hideMs() + 250);
  }

  function showForPack(index) {
    const count = readGiftCount(index);

    // find all gift elements (assume data-gift-index on node)
    const gifts = Array.from(giftWrapper.querySelectorAll('.pack-free-gift'));
    // for each gift element, decide action
    gifts.forEach((el, idx) => {
      const i = parseInt(el.getAttribute('data-gift-index'), 10) || (idx + 1);
      const shouldBeVisible = i <= count;
      const isVisible = el.classList.contains('visible');

      if (shouldBeVisible && !isVisible) {
        const delay = (i - 1) * staggerMs();
        animateIn(el, delay);
      } else if (!shouldBeVisible && isVisible) {
        animateOut(el);
      } else {
        // unchanged — ensure no animation classes linger
        el.classList.remove('paper-hide', 'paper-reveal');
        el.style.removeProperty('--reveal-delay');
      }
    });
  }

  // hookup pack clicks / mutation observers similar to your existing code
  function indexOfPackNode(packNode) {
    return Array.prototype.indexOf.call(packNode.parentElement.querySelectorAll('.pack'), packNode);
  }

  const packs = document.querySelectorAll('.pack__wrapper .pack');
  packs.forEach(pack => {
    pack.addEventListener('click', function () {
      const idx = typeof pack.dataset.packIndex !== 'undefined' ? parseInt(pack.dataset.packIndex, 10) : indexOfPackNode(pack);
      showForPack(idx);
    });

    const obs = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.attributeName !== 'class') return;
        if (pack.classList.contains('pack__selected')) {
          const idx = typeof pack.dataset.packIndex !== 'undefined' ? parseInt(pack.dataset.packIndex, 10) : indexOfPackNode(pack);
          showForPack(idx);
        }
      });
    });
    obs.observe(pack, { attributes: true });
  });

  // init
  (function init() {
    const sel = document.querySelector('.pack__wrapper .pack.pack__selected');
    if (sel) {
      const idx = typeof sel.dataset.packIndex !== 'undefined' ? parseInt(sel.dataset.packIndex, 10) : indexOfPackNode(sel);
      showForPack(idx);
    } else {
      const behaviour = productPackNode && (productPackNode.dataset && productPackNode.dataset.giftDisplayBehavior);
      if (behaviour === 'show_images_always') {
        showForPack(0);
      }
    }
  })();

})();
