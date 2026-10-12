(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
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
      ".project-profile-grid > *",
      ".team-card",
    ].join(","),
  );
  const photos = document.querySelectorAll(
    [
      ".case-media img",
      ".hero-image img",
      ".image-pair img",
      ".image-triptych img",
      ".mazi-identity-grid img",
      ".team-card img",
    ].join(","),
  );
  const typingSelector = [
    ".section-head h2",
    ".two-col h2",
    ".result-head h2",
    ".process > .wrap > h2",
    ".final h2",
    ".fit h2",
    ".cta h2",
    ".statement blockquote",
  ].join(",");
  const heroItems = document.querySelectorAll(
    ".hero .eyebrow, .hero-copy, .hero-intro, .hero-bottom, .hero-side, .hero-clients, .hero-image",
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
            ".metric,.proof-item,.case,.insight-card,.cap,.process,.process-item,.strategy,.result",
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
    const figures = photo.parentElement?.parentElement
      ? [...photo.parentElement.parentElement.children].filter((child) =>
          child.matches("figure"),
        )
      : [];
    const siblingIndex = figures.indexOf(photo.parentElement);
    if (siblingIndex > -1)
      photo.style.setProperty(
        "--photo-delay",
        `${Math.min(siblingIndex, 4) * 90}ms`,
      );
  });

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
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      heroItems.forEach((item) => item.classList.add("is-visible")),
    ),
  );

  const splitText = (element, className = "scroll-type") => {
    if (!element || element.dataset.motionSplit === "true") return;
    element.setAttribute(
      "aria-label",
      element.textContent.trim().replace(/\s+/g, " "),
    );
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode())
      if (walker.currentNode.nodeValue.length) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue
        .split(/(\s+)/)
        .filter(Boolean)
        .forEach((token) => {
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(" "));
            return;
          }
          const word = document.createElement("span");
          word.className = "motion-word";
          word.setAttribute("aria-hidden", "true");
          Array.from(token).forEach((character) => {
            const span = document.createElement("span");
            span.className = "motion-char";
            span.textContent = character;
            span.style.setProperty("--char-index", index++);
            word.appendChild(span);
          });
          fragment.appendChild(word);
        });
      node.replaceWith(fragment);
    });
    element.dataset.motionSplit = "true";
    element.classList.add(className);
  };

  let typingElements = [];
  const initTyping = () => {
    document
      .querySelectorAll(typingSelector)
      .forEach((element) => splitText(element));
    const heroTitle = document.querySelector(".hero h1");
    splitText(heroTitle, "hero-type");
    typingElements = [...document.querySelectorAll(".scroll-type")];
    requestAnimationFrame(() => heroTitle?.classList.add("is-visible"));
    updateMotion();
  };

  const resetTypingAfterLanguageChange = () => {
    setTimeout(() => {
      document
        .querySelectorAll(`${typingSelector}, .hero h1`)
        .forEach((element) => {
          element.removeAttribute("data-motion-split");
          element.classList.remove("scroll-type", "hero-type", "is-visible");
        });
      initTyping();
    }, 0);
  };
  document
    .querySelectorAll("[data-lang]")
    .forEach((button) =>
      button.addEventListener("click", resetTypingAfterLanguageChange),
    );

  const counters = [
    ...document.querySelectorAll(
      ".proof-number, .metric strong, .result strong",
    ),
  ];
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.42 },
  );

  counters.forEach((element) => {
    const original = element.textContent.trim();
    const matches = [...original.matchAll(/\d+(?:[.,]\d+)?/g)];
    if (matches.length !== 1) {
      element.classList.add("number-emphasis");
      observer.observe(element);
      return;
    }
    const match = matches[0];
    const numeric = match[0].replace(",", ".");
    element.dataset.counterOriginal = original;
    element.dataset.counterPrefix = original.slice(0, match.index);
    element.dataset.counterSuffix = original.slice(
      match.index + match[0].length,
    );
    element.dataset.counterTarget = numeric;
    element.dataset.counterDecimals = numeric.includes(".")
      ? numeric.split(".")[1].length
      : "0";
    element.classList.add("counter-number");
    counterObserver.observe(element);
  });

  function animateCounter(element) {
    const target = Number(element.dataset.counterTarget);
    const decimals = Number(element.dataset.counterDecimals);
    const prefix = element.dataset.counterPrefix || "";
    const suffix = element.dataset.counterSuffix || "";
    const duration = 1500;
    const start = performance.now();
    element.classList.add("counter-active");
    const frame = (time) => {
      const t = clamp((time - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
      else {
        element.textContent = element.dataset.counterOriginal;
        element.classList.remove("counter-active");
        element.classList.add("counter-settled");
      }
    };
    requestAnimationFrame(frame);
  }

  let motionFrame = 0;
  function updateMotion() {
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - innerHeight,
    );
    progress.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;
    const startLine = innerHeight * 0.9;
    const endLine = innerHeight * 0.34;
    typingElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const amount = clamp((startLine - rect.top) / (startLine - endLine));
      const chars = element.querySelectorAll(".motion-char");
      const cursor = amount * (chars.length + 7);
      chars.forEach((char, index) => {
        const local = clamp(cursor - index);
        char.style.opacity = String(0.08 + local * 0.92);
        char.style.transform = `translate3d(0, ${(1 - local) * 14}px, 0)`;
        char.style.filter = `blur(${(1 - local) * 3}px)`;
      });
    });
    motionFrame = 0;
  }
  const requestMotionUpdate = () => {
    if (!motionFrame) motionFrame = requestAnimationFrame(updateMotion);
  };
  window.addEventListener("scroll", requestMotionUpdate, { passive: true });
  window.addEventListener("resize", requestMotionUpdate, { passive: true });
  initTyping();

})();
