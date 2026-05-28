const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

let site = null;

const setLoginNote = (message = "", type = "") => {
  const note = $("[data-login-note]");
  note.textContent = message;
  note.className = `login-note ${type ? `is-${type}` : ""}`;
};

const lockAdmin = (message = "") => {
  document.body.classList.add("is-locked");
  setLoginNote(message);
  $("[name='password']")?.focus();
};

const unlockAdmin = () => {
  document.body.classList.remove("is-locked");
  setLoginNote("");
};

const listConfigs = {
  metrics: {
    title: "Metrics",
    addLabel: "Add Metric",
    empty: { value: "New", label: "metric label" },
    fields: [
      ["value", "Value"],
      ["label", "Label"]
    ]
  },
  services: {
    title: "Services",
    addLabel: "Add Service",
    empty: { id: "new-service", title: "New Service", category: "Category", image: "/assets/images/solar-panel-cleaning.png", summary: "Short service summary.", bullets: ["First point"] },
    fields: [
      ["id", "Anchor ID"],
      ["title", "Title"],
      ["category", "Category"],
      ["image", "Image Path"],
      ["summary", "Summary", "textarea"],
      ["bullets", "Bullets", "list"]
    ]
  },
  projects: {
    title: "Projects",
    addLabel: "Add Project",
    empty: { title: "New Project", type: "Project Type", image: "/assets/images/solar-panel-cleaning.png", impact: "Project impact." },
    fields: [
      ["title", "Title"],
      ["type", "Type"],
      ["image", "Image Path"],
      ["impact", "Impact", "textarea"]
    ]
  },
  process: {
    title: "Process",
    addLabel: "Add Step",
    empty: { step: "04", title: "New step", text: "Step description." },
    fields: [
      ["step", "Step"],
      ["title", "Title"],
      ["text", "Text", "textarea"]
    ]
  },
  testimonials: {
    title: "Reviews",
    addLabel: "Add Review",
    empty: { quote: "Client quote.", name: "Client Name", role: "Client role" },
    fields: [
      ["quote", "Quote", "textarea"],
      ["name", "Name"],
      ["role", "Role"]
    ]
  },
  gallery: {
    title: "Gallery",
    addLabel: "Add Gallery Item",
    empty: { title: "New Image", image: "/assets/images/industrial-maintenance.png" },
    fields: [
      ["title", "Title"],
      ["image", "Image Path"]
    ]
  }
};

const field = ({ label, value, path, type = "input", full = false }) => {
  const currentValue = Array.isArray(value) ? value.join(", ") : value || "";
  const tag = type === "textarea" || type === "list" ? "textarea" : "input";
  const hint = type === "list" ? " comma separated" : "";

  return `
    <div class="field ${full || tag === "textarea" ? "full" : ""}">
      <label>${label}${hint}</label>
      <${tag} data-path="${path}">${tag === "textarea" ? escapeHtml(currentValue) : ""}</${tag}>
    </div>
  `.replace("<input", `<input value="${escapeAttribute(currentValue)}"`);
};

const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const setStatus = (message, type = "") => {
  const status = $("[data-status]");
  status.textContent = message;
  status.className = `admin-status ${type ? `is-${type}` : ""}`;
};

const fetchAdmin = (url, options = {}) =>
  fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: options.headers || {}
  });

const getPath = (path) =>
  path.split(".").reduce((current, key) => {
    if (!current) return undefined;
    return current[Number.isNaN(Number(key)) ? key : Number(key)];
  }, site);

const setPath = (path, value) => {
  const parts = path.split(".");
  const key = parts.pop();
  const parent = parts.reduce((current, part) => current[Number.isNaN(Number(part)) ? part : Number(part)], site);
  parent[Number.isNaN(Number(key)) ? key : Number(key)] = value;
  syncRawJson();
};

const bindInputs = (root = document) => {
  $$("[data-path]", root).forEach((input) => {
    input.addEventListener("input", () => {
      const previous = getPath(input.dataset.path);
      const value = Array.isArray(previous)
        ? input.value.split(",").map((item) => item.trim()).filter(Boolean)
        : input.value;
      setPath(input.dataset.path, value);
    });
  });
};

const renderObjectPanel = (panelName, title, fields) => {
  const panel = $(`[data-tab-panel="${panelName}"]`);
  panel.innerHTML = `
    <div class="panel-title"><h2>${title}</h2><span>Edit text, links, and paths</span></div>
    <div class="field-grid">
      ${fields.map(([key, label, type]) => field({ label, value: getPath(`${panelName}.${key}`), path: `${panelName}.${key}`, type, full: type === "textarea" || key === "image" || key === "address" })).join("")}
    </div>
  `;
  bindInputs(panel);
};

const renderSectionsPanel = () => {
  const panel = $('[data-tab-panel="sections"]');
  const groups = [
    {
      title: "Marquee Strip",
      fields: [["sections.marquee", "Scrolling Capability Text", "list"]]
    },
    {
      title: "Services Section",
      fields: [
        ["sections.services.eyebrow", "Eyebrow"],
        ["sections.services.title", "Title"],
        ["sections.services.text", "Text", "textarea"],
        ["sections.services.indexLabel", "Index Label"]
      ]
    },
    {
      title: "Projects Section",
      fields: [
        ["sections.projects.eyebrow", "Eyebrow"],
        ["sections.projects.title", "Title"],
        ["sections.projects.text", "Text", "textarea"]
      ]
    },
    {
      title: "Process Section",
      fields: [
        ["sections.process.eyebrow", "Eyebrow"],
        ["sections.process.title", "Title"]
      ]
    },
    {
      title: "Gallery Section",
      fields: [
        ["sections.gallery.eyebrow", "Eyebrow"],
        ["sections.gallery.title", "Title"],
        ["sections.gallery.text", "Text", "textarea"]
      ]
    },
    {
      title: "Reviews Section",
      fields: [
        ["sections.reviews.eyebrow", "Eyebrow"],
        ["sections.reviews.title", "Title"],
        ["sections.reviews.button", "Button Text"]
      ]
    },
    {
      title: "Contact Section",
      fields: [
        ["sections.contact.eyebrow", "Eyebrow"],
        ["sections.contact.title", "Title", "textarea"],
        ["sections.contact.formEyebrow", "Form Eyebrow"],
        ["sections.contact.formTitle", "Form Title"],
        ["sections.contact.button", "Submit Button"]
      ]
    },
    {
      title: "Footer",
      fields: [
        ["sections.footer.tagline", "Tagline", "textarea"],
        ["sections.footer.copyright", "Copyright"]
      ]
    }
  ];

  panel.innerHTML = `
    <div class="panel-title"><h2>Sections</h2><span>Edit headings, CTAs, footer, and marquee</span></div>
    <div class="editor-list">
      ${groups.map((group) => `
        <article class="editor-item">
          <div class="item-actions"><strong>${group.title}</strong></div>
          <div class="item-grid">
            ${group.fields.map(([path, label, type]) => field({ label, value: getPath(path), path, type, full: type === "textarea" || type === "list" })).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
  bindInputs(panel);
};

const renderListPanel = (key) => {
  const config = listConfigs[key];
  const panel = $(`[data-tab-panel="${key}"]`);
  const items = site[key] || [];

  panel.innerHTML = `
    <div class="panel-title">
      <h2>${config.title}</h2>
      <button type="button" data-add="${key}">${config.addLabel}</button>
    </div>
    <div class="editor-list">
      ${items.map((item, index) => `
        <article class="editor-item">
          <div class="item-actions">
            <strong>${String(index + 1).padStart(2, "0")} ${escapeAttribute(item.title || item.label || item.name || item.step || "Item")}</strong>
            <button type="button" data-remove="${key}" data-index="${index}">Remove</button>
          </div>
          <div class="item-grid">
            ${config.fields.map(([fieldKey, label, type]) => field({ label, value: item[fieldKey], path: `${key}.${index}.${fieldKey}`, type, full: type === "textarea" || type === "list" || fieldKey === "image" })).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;

  $(`[data-add="${key}"]`, panel).addEventListener("click", () => {
    site[key].push(JSON.parse(JSON.stringify(config.empty)));
    renderListPanel(key);
    syncRawJson();
  });

  $$(`[data-remove="${key}"]`, panel).forEach((button) => {
    button.addEventListener("click", () => {
      site[key].splice(Number(button.dataset.index), 1);
      renderListPanel(key);
      syncRawJson();
    });
  });

  bindInputs(panel);
};

const syncRawJson = () => {
  const raw = $("[data-raw-json]");
  if (raw) raw.value = JSON.stringify(site, null, 2);
};

const renderAll = () => {
  renderObjectPanel("brand", "Brand", [
    ["name", "Business Name"],
    ["shortName", "Short Name"],
    ["phone", "Phone"],
    ["whatsapp", "WhatsApp Number"],
    ["email", "Email"],
    ["location", "Location"],
    ["address", "Address"]
  ]);

  renderObjectPanel("hero", "Hero", [
    ["eyebrow", "Eyebrow"],
    ["title", "Headline"],
    ["text", "Subtext", "textarea"],
    ["image", "Hero Image Path"],
    ["chips", "Trust Chips", "list"]
  ]);

  renderSectionsPanel();
  Object.keys(listConfigs).forEach(renderListPanel);
  syncRawJson();
};

const loadSite = async () => {
  const response = await fetchAdmin("/api/site");
  if (!response.ok) throw new Error("Unable to load site data.");
  site = await response.json();
  renderAll();
  setStatus("Loaded. Edit and save when ready.", "ok");
};

const saveSite = async () => {
  setStatus("Saving...");
  try {
    const response = await fetchAdmin("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site)
    });
    const result = await response.json();

    if (response.status === 401) {
      lockAdmin("Session expired. Enter the admin password again.");
      throw new Error(result.message || "Admin password required.");
    }

    if (!response.ok || !result.ok) throw new Error(result.message || "Unable to save.");
    site = result.site;
    renderAll();
    setStatus(
      result.persisted
        ? "Saved. Refresh the site to see changes."
        : "Saved for this runtime. Add persistent storage before relying on admin edits in production.",
      "ok"
    );
  } catch (error) {
    setStatus(error.message || "Unable to save.", "error");
  }
};

const setupTabs = () => {
  $$("[data-tab-button]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-tab-button]").forEach((item) => item.classList.remove("is-active"));
      $$("[data-tab-panel]").forEach((panel) => panel.classList.remove("is-active"));
      button.classList.add("is-active");
      $(`[data-tab-panel="${button.dataset.tabButton}"]`).classList.add("is-active");
      const nav = button.closest(".admin-sidebar");
      if (nav) {
        nav.scrollTo({
          left: button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2,
          behavior: "auto"
        });
      }
    });
  });
};

const setupLogin = () => {
  const form = $("[data-login-form]");
  const logout = $("[data-logout]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginNote("Checking...");

    const password = new FormData(form).get("password");

    try {
      const response = await fetchAdmin("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Invalid admin password.");
      }

      form.reset();
      await loadSite();
      unlockAdmin();
    } catch (error) {
      setLoginNote(error.message || "Unable to unlock admin.");
    }
  });

  logout.addEventListener("click", async () => {
    try {
      await fetchAdmin("/api/admin/logout", { method: "POST" });
    } catch {
      // The local lock still clears the admin UI even if the network is interrupted.
    }
    lockAdmin("Admin locked.");
  });
};

const setupRawJson = () => {
  $("[data-apply-json]").addEventListener("click", () => {
    try {
      site = JSON.parse($("[data-raw-json]").value);
      renderAll();
      setStatus("JSON applied to editor. Save to publish.", "ok");
    } catch (error) {
      setStatus(error.message || "Invalid JSON.", "error");
    }
  });
};

setupTabs();
setupRawJson();
setupLogin();
$("[data-save]").addEventListener("click", saveSite);

loadSite()
  .then(unlockAdmin)
  .catch(() => lockAdmin());
