document.addEventListener('DOMContentLoaded', () => {
  const GAP_FALLBACK = 20;

  function parseGap(node) {
    try {
      const style = window.getComputedStyle(node);
      return parseFloat(style.gap || style.columnGap) || GAP_FALLBACK;
    } catch {
      return GAP_FALLBACK;
    }
  }

  function computeSlideStep(slide, gap) {
    if (!slide) return 0;
    const rect = slide.getBoundingClientRect();
    const w = Math.round(rect.width) || slide.offsetWidth || slide.clientWidth || 0;
    return w + (gap || 0);
  }

  document.querySelectorAll('.ih-carousel').forEach((carousel) => {
    const track = carousel.querySelector('[data-track]');
    if (!track) return;

    const prevBtn = carousel.querySelector('[data-prev]');
    const nextBtn = carousel.querySelector('[data-next]');
    const dotsWrap = carousel.querySelector('[data-dots]');
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
    const section = carousel.closest('.image-hotspot');
    const hotspots = section ? Array.from(section.querySelectorAll('.hotspot')) : [];

    const originalSlides = Array.from(track.querySelectorAll('.ih-slide'));
    const realCount = originalSlides.length;
    if (realCount === 0) return;

    // Triple copy: left | center | right
    const fragment = document.createDocumentFragment();
    for (let copy = 0; copy < 3; copy++) {
      originalSlides.forEach((s, idx) => {
        const clone = s.cloneNode(true);
        clone.dataset.realIndex = idx;
        fragment.appendChild(clone);
      });
    }
    track.innerHTML = '';
    track.appendChild(fragment);

    const slides = Array.from(track.children);
    const copySize = realCount;
    let current = copySize; // start in center copy
    let gap = parseGap(track);
    let inTransition = false;

    function getStep() {
      gap = parseGap(track);
      return computeSlideStep(slides[0], gap) || 0;
    }

    function setTransform(x, animate = true) {
      track.style.transition = animate ? 'transform .35s ease' : 'none';
      track.style.transform = `translate3d(${x}px,0,0)`;
    }

    function updatePosition(animate = true) {
      const step = getStep();
      if (!step) return;
      setTransform(-current * step, animate);

      // update dots & hotspots
      const realIndex = ((current % copySize) + copySize) % copySize;
      if (dots.length) dots.forEach((d, i) => d.classList.toggle('active', i === realIndex));
      if (hotspots.length) hotspots.forEach((h, i) => h.classList.toggle('hotspot--active', i === realIndex));
    }

    function moveBy(delta) {
      if (inTransition) return;
      inTransition = true;
      current += delta;
      updatePosition(true);
    }

    function goToRealIndex(idx) {
      if (inTransition) return;
      inTransition = true;
      current = idx + copySize;
      updatePosition(true);
    }

    // arrows
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); moveBy(1); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); moveBy(-1); });

    // dots
    if (dots.length) dots.forEach((dot, i) => dot.addEventListener('click', (ev) => { ev.preventDefault(); goToRealIndex(i); }));

    // hotspots
    if (hotspots.length) {
      hotspots.forEach((h, i) => {
        h.addEventListener('click', (ev) => { if (!ev.target.closest('a')) { ev.preventDefault(); goToRealIndex(i); }});
        h.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); goToRealIndex(i); }});
      });
    }

    // after transition, silently reset to center copy if needed
    track.addEventListener('transitionend', () => {
      inTransition = false;
      if (current < copySize) current += copySize;
      else if (current >= copySize * 2) current -= copySize;
      updatePosition(false);
    });

    // swipe support
    let dragging = false, startX = 0, deltaX = 0;
    function startDrag(e) { dragging = true; startX = e.touches ? e.touches[0].clientX : e.clientX; deltaX = 0; track.style.transition = 'none'; }
    function onDrag(e) { if (!dragging) return; const clientX = e.touches ? e.touches[0].clientX : e.clientX; deltaX = clientX - startX; const step = getStep(); track.style.transform = `translate3d(${ -current * step + deltaX }px,0,0)`; }
    function endDrag() { if (!dragging) return; dragging = false; const threshold = 40; if (Math.abs(deltaX) > threshold) { deltaX < 0 ? moveBy(1) : moveBy(-1); } else { updatePosition(true); } deltaX = 0; }

    track.addEventListener('touchstart', startDrag, {passive:true});
    track.addEventListener('touchmove', onDrag, {passive:true});
    track.addEventListener('touchend', endDrag);
    track.addEventListener('mousedown', (e)=>{ e.preventDefault(); startDrag(e); });
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);

    // resize observer
    try { new ResizeObserver(()=>updatePosition(false)).observe(track); } catch { window.addEventListener('resize', ()=>updatePosition(false)); }

    // initial position
    function ensureReady(retries=0) {
      if (retries > 10) return;
      if (!getStep()) return setTimeout(()=>ensureReady(retries+1), 120);
      updatePosition(false);
    }
    ensureReady();
  });
});
