const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const forms = document.querySelectorAll("[data-inquiry-form]");
const whatsappNumber = "919310508703";

const storedTheme = localStorage.getItem("tr-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

document.documentElement.dataset.theme = initialTheme;

const progress = document.createElement("div");
progress.className = "scroll-progress";
progress.setAttribute("aria-hidden", "true");
document.body.prepend(progress);

const quickActions = document.createElement("div");
quickActions.className = "quick-actions";
quickActions.innerHTML = `
  <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener" aria-label="Open WhatsApp inquiry" title="WhatsApp inquiry">WA</a>
  <button class="to-top" type="button" aria-label="Back to top" title="Back to top">^</button>
`;
document.body.appendChild(quickActions);

const toTop = quickActions.querySelector(".to-top");

const setScrolledHeader = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  header?.classList.toggle("is-scrolled", scrollY > 12);
  toTop?.classList.toggle("is-visible", scrollY > 520);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(percent, 100)}%`;
};

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

setScrolledHeader();
window.addEventListener("scroll", setScrolledHeader, { passive: true });

window.addEventListener("load", () => {
  document.body.classList.add("page-ready");
  setScrolledHeader();
});

if (document.readyState !== "loading") {
  document.body.classList.add("page-ready");
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("tr-theme", nextTheme);
});

const page = document.body.dataset.page;
document.querySelector(`[data-nav-link="${page}"]`)?.classList.add("is-active");

const closeMenu = () => {
  header?.classList.remove("menu-open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
};

navToggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("menu-open") || false;
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 38, 260)}ms`);
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    )
  : null;

revealItems.forEach((item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add("is-visible");
  }
});

const animateCounter = (counter) => {
  const end = Number(counter.dataset.count || 0);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const startTime = performance.now();

  const tick = (time) => {
    const progressAmount = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progressAmount, 3);
    counter.textContent = `${Math.round(end * eased)}${suffix}`;
    if (progressAmount < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    )
  : null;

counters.forEach((counter) => {
  if (counterObserver) {
    counterObserver.observe(counter);
  } else {
    animateCounter(counter);
  }
});

document.querySelectorAll("[data-testimonial-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".testimonial-slide"));
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  const showSlide = (nextIndex) => {
    slides[index]?.classList.remove("is-active");
    index = (nextIndex + slides.length) % slides.length;
    slides[index]?.classList.add("is-active");
  };

  prev?.addEventListener("click", () => showSlide(index - 1));
  next?.addEventListener("click", () => showSlide(index + 1));

  if (slides.length > 1) {
    window.setInterval(() => showSlide(index + 1), 6500);
  }
});

const filterRoot = document.querySelector("[data-project-filters]");
if (filterRoot) {
  const buttons = filterRoot.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      cards.forEach((card) => {
        const categories = card.dataset.category || "";
        const shouldShow = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

const lightboxItems = document.querySelectorAll("[data-lightbox]");
if (lightboxItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <figure>
      <button type="button" aria-label="Close preview">x</button>
      <img alt="" />
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("figcaption");
  const close = () => lightbox.classList.remove("is-open");

  lightbox.querySelector("button").addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  lightboxItems.forEach((item) => {
    item.addEventListener("click", () => {
      image.src = item.dataset.lightbox;
      image.alt = item.querySelector("img")?.alt || "";
      caption.textContent = item.dataset.caption || "";
      lightbox.classList.add("is-open");
    });
  });
}

forms.forEach((form) => {
  const formNote = form.querySelector("[data-form-note]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const service = String(data.get("service") || "").trim();
    const location = String(data.get("location") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !service) {
      if (formNote) {
        formNote.textContent = "Please add your name, phone number, and service requirement.";
      }
      return;
    }

    const inquiry = [
      "Hello TR Enterprises, I want a free quote.",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Service: ${service}`,
      location ? `Location: ${location}` : "",
      message ? `Message: ${message}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    if (formNote) {
      formNote.textContent = "Opening WhatsApp with your inquiry...";
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inquiry)}`, "_blank", "noopener");
  });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const url = new URL(link.href, window.location.href);
  const isLocalPage = url.pathname.endsWith(".html") && url.origin === window.location.origin;
  const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

  if (!isLocalPage || link.target || isModified || url.hash) return;

  event.preventDefault();
  closeMenu();
  document.body.classList.add("is-leaving");
  window.setTimeout(() => {
    window.location.href = link.href;
  }, 170);
});
