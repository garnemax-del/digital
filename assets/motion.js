(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = document.querySelectorAll([
    '.section-head', '.two-col > *', '.metric', '.proof-item', '.offer-strip',
    '.case', '.insight-card', '.cap', '.process', '.process-item', '.strategy',
    '.result', '.result-head > *', '.statement blockquote', '.statement cite',
    '.fit > *', '.cta-grid > *',
    '.final-grid > *'
  ].join(','));
  const photos = document.querySelectorAll([
    '.hero-card img', '.case-media img', '.hero-image img',
    '.image-pair img', '.image-triptych img', '.mazi-identity-grid img'
  ].join(','));

  document.documentElement.classList.add('motion-ready');
  items.forEach((item) => {
    item.classList.add('reveal-item');
    const siblings = item.parentElement ? [...item.parentElement.children].filter((child) => child.matches('.metric,.proof-item,.case,.insight-card,.cap,.process,.process-item,.strategy,.result,.image-pair figure,.image-triptych figure')) : [];
    const siblingIndex = siblings.indexOf(item);
    if (siblingIndex > -1) item.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 5) * 70}ms`);
  });
  photos.forEach((photo) => {
    photo.classList.add('reveal-photo');
    const siblings = photo.parentElement?.parentElement
      ? [...photo.parentElement.parentElement.children].filter((child) => child.matches('figure'))
      : [];
    const siblingIndex = siblings.indexOf(photo.parentElement);
    if (siblingIndex > -1) photo.style.setProperty('--photo-delay', `${Math.min(siblingIndex, 4) * 90}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  items.forEach((item) => observer.observe(item));
  photos.forEach((photo) => observer.observe(photo));

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) return;

  let current = window.scrollY;
  let target = current;
  let frame = 0;

  const animateScroll = () => {
    current += (target - current) * 0.13;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo(0, current);
    if (current !== target) frame = requestAnimationFrame(animateScroll);
    else frame = 0;
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const scrollable = event.target instanceof Element ? event.target.closest('[data-native-scroll]') : null;
    if (scrollable) return;
    event.preventDefault();
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    target = Math.max(0, Math.min(max, target + event.deltaY));
    if (!frame) {
      current = window.scrollY;
      frame = requestAnimationFrame(animateScroll);
    }
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (!frame) current = target = window.scrollY;
  }, { passive: true });
})();
