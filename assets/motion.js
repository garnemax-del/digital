(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = document.querySelectorAll(
    [
      ".section-head",
      ".two-col > *",
      ".metric",
      ".proof-item",
      ".offer-strip",
      ".case",
      ".insight-card",
      ".cap",
      ".process",
      ".process-item",
      ".strategy",
      ".result",
      ".result-head > *",
      ".statement blockquote",
      ".statement cite",
      ".fit > *",
      ".cta-grid > *",
      ".final-grid > *",
    ].join(","),
  );
  const photos = document.querySelectorAll(
    [
      ".hero-card img",
      ".case-media img",
      ".hero-image img",
      ".image-pair img",
      ".image-triptych img",
      ".mazi-identity-grid img",
    ].join(","),
  );
  const titles = document.querySelectorAll(
    ".section-head h2, .two-col h2, .result-head h2, .process > .wrap > h2, .final h2, .fit h2, .cta h2",
  );
  const heroItems = document.querySelectorAll(
    ".hero .eyebrow, .hero h1, .hero-copy, .hero-intro, .hero-bottom, .hero-side, .hero-clients, .hero-image",
  );

  document.documentElement.classList.add("motion-ready");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  items.forEach((item) => {
    item.classList.add("reveal-item");
    const siblings = item.parentElement
      ? [...item.parentElement.children].filter((child) =>
          child.matches(
            ".metric,.proof-item,.case,.insight-card,.cap,.process,.process-item,.strategy,.result,.image-pair figure,.image-triptych figure",
          ),
        )
      : [];
    const siblingIndex = siblings.indexOf(item);
    if (siblingIndex > -1)
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(siblingIndex, 5) * 70}ms`,
      );
  });
  photos.forEach((photo) => {
    photo.classList.add("reveal-photo");
    const siblings = photo.parentElement?.parentElement
      ? [...photo.parentElement.parentElement.children].filter((child) =>
          child.matches("figure"),
        )
      : [];
    const siblingIndex = siblings.indexOf(photo.parentElement);
    if (siblingIndex > -1)
      photo.style.setProperty(
        "--photo-delay",
        `${Math.min(siblingIndex, 4) * 90}ms`,
      );
  });
  titles.forEach((title) => title.classList.add("reveal-title"));
  heroItems.forEach((item, index) => {
    item.classList.add("hero-enter");
    item.style.setProperty("--hero-delay", `${Math.min(index, 5) * 95}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
  );

  items.forEach((item) => observer.observe(item));
  photos.forEach((photo) => observer.observe(photo));
  titles.forEach((title) => observer.observe(title));
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      heroItems.forEach((item) => item.classList.add("is-visible")),
    ),
  );

  let progressFrame = 0;
  const updateProgress = () => {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    progress.style.transform = `scaleX(${Math.min(1, window.scrollY / max)})`;
    progressFrame = 0;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    },
    { passive: true },
  );
  updateProgress();

  const finePointer = window.matchMedia("(pointer: fine)").matches;
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

  window.addEventListener(
    "wheel",
    (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      const scrollable =
        event.target instanceof Element
          ? event.target.closest("[data-native-scroll]")
          : null;
      if (scrollable) return;
      event.preventDefault();
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      target = Math.max(0, Math.min(max, target + event.deltaY));
      if (!frame) {
        current = window.scrollY;
        frame = requestAnimationFrame(animateScroll);
      }
    },
    { passive: false },
  );

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) current = target = window.scrollY;
    },
    { passive: true },
  );
})();
