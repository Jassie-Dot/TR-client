const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const iconFor = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("solar")) return "SOL";
  if (normalized.includes("industrial") || normalized.includes("plant")) return "PLT";
  if (normalized.includes("power")) return "PWR";
  if (normalized.includes("workforce")) return "CREW";
  return "OPS";
};

const setProgress = () => {
  const progress = $("[data-scroll-progress]");
  const toTop = $("[data-to-top]");
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  if (progress) progress.style.width = `${Math.min(percent, 100)}%`;
  if (toTop) toTop.classList.toggle("hidden", window.scrollY < 640);
};

const setupTheme = () => {
  const toggles = $$("[data-theme-toggle]");
  const labels = $$("[data-theme-label]");

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    labels.forEach((label) => {
      label.textContent = theme === "dark" ? "Light" : "Dark";
    });

    try {
      localStorage.setItem("tr-theme", theme);
    } catch {
      // Theme still works for this visit if storage is unavailable.
    }

    window.dispatchEvent(new CustomEvent("tr-theme-change", { detail: { theme } }));
  };

  applyTheme(document.documentElement.dataset.theme || "dark");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });
};

const setupMenu = () => {
  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-mobile-nav]");

  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("overflow-hidden", isOpen);
  });

  $$("[data-mobile-nav] a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.add("hidden");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    });
  });
};

const setupReveal = () => {
  const items = $$(".reveal");
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      )
    : null;

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 14, 84)}ms`;
    if (observer) observer.observe(item);
    else item.classList.add("is-visible");
  });
};

const renderHero = ({ brand, hero, metrics }) => {
  $("[data-brand-short]").textContent = brand.shortName;
  $("[data-brand-name]").textContent = brand.name;
  $("[data-hero-eyebrow]").textContent = hero.eyebrow;
  $("[data-hero-title]").textContent = hero.title;
  $("[data-hero-text]").textContent = hero.text;
  const heroImage = $("[data-hero-image]");
  if (heroImage && hero.image) {
    heroImage.src = hero.image;
  }

  $("[data-phone-link]").href = `tel:${brand.phone.replace(/\s/g, "")}`;
  $("[data-floating-whatsapp]").href = `https://wa.me/${brand.whatsapp}`;

  $("[data-hero-chips]").innerHTML = (hero.chips || [])
    .map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`)
    .join("");

  const heroMetrics = $("[data-hero-metrics]");
  if (heroMetrics) {
    heroMetrics.innerHTML = (metrics || [])
      .map(
        (metric) => `
          <div class="metric-card rounded-lg p-4">
            <strong class="block font-display text-3xl font-black text-signal-amber">${escapeHtml(metric.value)}</strong>
            <span class="metric-label mt-2 block text-sm font-bold leading-6">${escapeHtml(metric.label)}</span>
          </div>
        `
      )
      .join("");
  }

  $("[data-metric-strip]").innerHTML = (metrics || [])
    .map(
      (metric) => `
        <div class="metric-cell border-b p-6 md:border-b-0 md:border-r last:border-r-0">
          <strong class="block font-display text-3xl font-black">${escapeHtml(metric.value)}</strong>
          <span class="metric-label mt-2 block text-sm font-black uppercase tracking-[.12em]">${escapeHtml(metric.label)}</span>
        </div>
      `
    )
    .join("");
};

const setText = (selector, value) => {
  const node = $(selector);
  if (node && value !== undefined) node.textContent = value;
};

const renderStaticContent = (sections = {}) => {
  const marquee = sections.marquee || [];
  if (marquee.length) {
    $("[data-marquee-track]").innerHTML = [...marquee, ...marquee]
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  setText("[data-services-eyebrow]", sections.services?.eyebrow);
  setText("[data-services-title]", sections.services?.title);
  setText("[data-services-text]", sections.services?.text);
  setText("[data-services-index-label]", sections.services?.indexLabel);
  setText("[data-projects-eyebrow]", sections.projects?.eyebrow);
  setText("[data-projects-title]", sections.projects?.title);
  setText("[data-projects-text]", sections.projects?.text);
  setText("[data-process-eyebrow]", sections.process?.eyebrow);
  setText("[data-process-title]", sections.process?.title);
  setText("[data-gallery-eyebrow]", sections.gallery?.eyebrow);
  setText("[data-gallery-title]", sections.gallery?.title);
  setText("[data-gallery-text]", sections.gallery?.text);
  setText("[data-reviews-eyebrow]", sections.reviews?.eyebrow);
  setText("[data-reviews-title]", sections.reviews?.title);
  setText("[data-reviews-button]", sections.reviews?.button);
  setText("[data-contact-eyebrow]", sections.contact?.eyebrow);
  setText("[data-contact-title]", sections.contact?.title);
  setText("[data-contact-form-eyebrow]", sections.contact?.formEyebrow);
  setText("[data-contact-form-title]", sections.contact?.formTitle);
  setText("[data-contact-submit]", sections.contact?.button);
  setText("[data-footer-tagline]", sections.footer?.tagline);
  setText("[data-footer-copyright]", sections.footer?.copyright);
};

const renderServices = (services) => {
  const indexRoot = $("[data-service-index]");
  if (indexRoot) {
    indexRoot.innerHTML = services
      .map(
        (service, index) => `
          <a class="service-index-link" href="#${escapeHtml(service.id)}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(service.title)}</strong>
          </a>
        `
      )
      .join("");
  }

  $("[data-services]").innerHTML = services
    .map((service, index) => {
      const isFeatured = index === 0;
      return `
        <article class="${isFeatured ? "service-feature-card md:col-span-2 md:row-span-2" : "service-mini-card"} reveal group" id="${escapeHtml(service.id)}">
          <div class="${isFeatured ? "service-feature-media" : "service-mini-media"}">
            <img src="${service.image}" alt="${escapeHtml(service.title)}" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-coal-950/80 via-coal-950/20 to-transparent"></div>
            <span class="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-2 font-display text-xs font-black text-coal-950">${iconFor(service.category)}</span>
          </div>
          <div class="${isFeatured ? "p-6 sm:p-8" : "p-5"}">
            <span class="text-xs font-black uppercase tracking-[.15em] text-signal-orange">${escapeHtml(service.category)}</span>
            <h3 class="card-title mt-3 font-display ${isFeatured ? "text-4xl" : "text-2xl"} font-black tracking-normal">${escapeHtml(service.title)}</h3>
            <p class="card-copy mt-3 ${isFeatured ? "text-base" : "text-sm"} font-medium leading-7">${escapeHtml(service.summary)}</p>
            <ul class="mt-5 grid gap-2">
              ${service.bullets.map((bullet) => `<li class="card-bullet flex gap-3 text-sm font-black"><span class="mt-2 h-2 w-2 rounded-sm bg-signal-green"></span>${escapeHtml(bullet)}</li>`).join("")}
            </ul>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderProjects = (projects) => {
  $("[data-projects]").innerHTML = projects
    .map(
      (project, index) => `
        <article class="case-card reveal group">
          <div class="case-number">${String(index + 1).padStart(2, "0")}</div>
          <div class="case-image">
            <img src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy" />
          </div>
          <div class="case-copy">
            <span>${escapeHtml(project.type)}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.impact)}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderProcess = (process) => {
  $("[data-process]").innerHTML = process
    .map(
      (item, index) => `
        <article class="dispatch-card reveal">
          <span class="dispatch-step">${escapeHtml(item.step)}</span>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </div>
          ${index < process.length - 1 ? '<span class="dispatch-connector" aria-hidden="true"></span>' : ""}
        </article>
      `
    )
    .join("");
};

const renderTestimonials = (testimonials) => {
  $("[data-testimonials]").innerHTML = testimonials
    .map(
      (item, index) => `
        <article class="${index === 0 ? "review-feature" : "review-card"} reveal">
          <div class="text-signal-amber">★★★★★</div>
          <p class="review-quote mt-4 ${index === 0 ? "text-3xl leading-10" : "text-xl leading-8"} font-bold">"${escapeHtml(item.quote)}"</p>
          <div class="mt-5 flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-lg bg-brand-metal font-display font-black text-coal-950">${escapeHtml(item.name[0])}</span>
            <div>
              <strong class="block">${escapeHtml(item.name)}</strong>
              <span class="review-role text-sm font-bold">${escapeHtml(item.role)}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const setupGallery = (gallery) => {
  const grid = $("[data-gallery]");
  const lightbox = $("[data-lightbox]");
  const image = $("[data-lightbox-image]");
  const caption = $("[data-lightbox-caption]");

  grid.innerHTML = gallery
    .map(
      (item, index) => `
        <button class="gallery-item reveal ${index === 0 ? "gallery-hero-tile" : ""} ${index === 3 ? "gallery-wide-tile" : ""}" type="button" data-gallery-index="${index}">
          <img class="h-full w-full object-cover transition duration-300 hover:scale-105" src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <span>${escapeHtml(item.title)}</span>
        </button>
      `
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-index]");
    if (!button) return;

    const item = gallery[Number(button.dataset.galleryIndex)];
    image.src = item.image;
    image.alt = item.title;
    caption.textContent = item.title;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("grid");
  });

  const close = () => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("grid");
  };

  $("[data-lightbox-close]").addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
};

const setupContact = ({ brand, services }) => {
  $("[data-contact-phone]").href = `tel:${brand.phone.replace(/\s/g, "")}`;
  $("[data-contact-phone-text]").textContent = brand.phone;
  $("[data-contact-location]").textContent = brand.location;
  $("[data-contact-address]").textContent = brand.address;

  const select = $("[data-service-select]");
  select.innerHTML = [
    '<option value="">Select service</option>',
    ...services.map((service) => `<option>${escapeHtml(service.title)}</option>`)
  ].join("");

  const form = $("[data-inquiry-form]");
  const note = $("[data-form-note]");
  const whatsappResult = $("[data-whatsapp-result]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    note.textContent = "Sending...";
    note.className = "theme-muted mt-4 min-h-6 font-bold";
    whatsappResult.classList.add("hidden");

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Unable to submit inquiry.");
      }

      note.textContent = "Saved. Continue on WhatsApp.";
      note.className = "mt-4 min-h-6 font-bold text-signal-green";
      whatsappResult.href = result.whatsappUrl;
      whatsappResult.classList.remove("hidden");
      form.reset();
    } catch (error) {
      note.textContent = error.message || "Please try again.";
      note.className = "mt-4 min-h-6 font-bold text-red-600";
    }
  });
};

const setupTilt = () => {
  $$(".service-feature-card, .service-mini-card, .case-card, .dispatch-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -2.4}deg) rotateY(${x * 2.4}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
};

const loadSite = async () => {
  const response = await fetch("/api/site");
  if (!response.ok) throw new Error("Unable to load site data.");
  return response.json();
};

const boot = async () => {
  setupTheme();
  setupMenu();
  window.addEventListener("scroll", setProgress, { passive: true });
  $("[data-to-top]").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  setProgress();

  try {
    const site = await loadSite();
    renderStaticContent(site.sections);
    renderHero(site);
    renderServices(site.services);
    renderProjects(site.projects);
    renderProcess(site.process);
    renderTestimonials(site.testimonials);
    setupGallery(site.gallery);
    setupContact(site);
    setupReveal();
    setupTilt();
  } catch (error) {
    const note = document.createElement("div");
    note.className = "fixed bottom-4 left-4 z-[100] rounded-lg bg-red-600 px-4 py-3 font-bold text-white shadow-premium";
    note.textContent = error.message;
    document.body.appendChild(note);
  }
};

boot();
