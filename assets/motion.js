(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = document.querySelectorAll([
    '.section-head', '.two-col > *', '.metric', '.proof-item', '.offer-strip',
    '.case', '.insight-card', '.cap', '.process', '.process-item', '.strategy',
    '.result', '.result-head > *', '.image-pair figure', '.image-triptych figure',
    '.statement blockquote', '.statement cite', '.fit > *', '.cta-grid > *',
    '.final-grid > *'
  ].join(','));

  document.documentElement.classList.add('motion-ready');
  items.forEach((item) => {
    item.classList.add('reveal-item');
    const siblings = item.parentElement ? [...item.parentElement.children].filter((child) => child.matches('.metric,.proof-item,.case,.insight-card,.cap,.process,.process-item,.strategy,.result,.image-pair figure,.image-triptych figure')) : [];
    const siblingIndex = siblings.indexOf(item);
    if (siblingIndex > -1) item.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 5) * 70}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  items.forEach((item) => observer.observe(item));
})();
