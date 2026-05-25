const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const initialSite = require("./data/site");

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "150680";
const ADMIN_SESSION_MS = 1000 * 60 * 60 * 12;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSETS_DIR = path.join(ROOT, "assets");
const DATA_DIR = path.join(ROOT, "data");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const MAX_BODY_BYTES = 1024 * 512;
let siteState = initialSite;
const adminSessions = new Map();

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"]
]);

const send = (res, status, body, headers = {}, method = "GET") => {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...headers
  });
  res.end(method === "HEAD" ? undefined : body);
};

const sendJson = (res, status, payload) => {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
};

const getHeader = (req, name) => {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || "";
};

const getAdminToken = (req) => {
  const auth = getHeader(req, "authorization");
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }

  return getHeader(req, "x-admin-token").trim();
};

const pruneAdminSessions = () => {
  const now = Date.now();
  for (const [token, session] of adminSessions) {
    if (session.expiresAt <= now) adminSessions.delete(token);
  }
};

const isAdminAuthorized = (req) => {
  pruneAdminSessions();
  const session = adminSessions.get(getAdminToken(req));
  return Boolean(session && session.expiresAt > Date.now());
};

const createAdminSession = () => {
  pruneAdminSessions();
  const token = crypto.randomBytes(32).toString("base64url");
  adminSessions.set(token, {
    createdAt: Date.now(),
    expiresAt: Date.now() + ADMIN_SESSION_MS
  });
  return token;
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    let bodyTooLarge = false;

    req.on("data", (chunk) => {
      if (bodyTooLarge) return;

      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        bodyTooLarge = true;
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON payload."));
      }
    });

    req.on("error", reject);
  });

const writeJsonFile = async (filePath, payload) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.rename(tempPath, filePath);
};

const loadSiteContent = async () => {
  try {
    const content = await fs.readFile(SITE_CONTENT_FILE, "utf8");
    siteState = JSON.parse(content);
    validateSiteContent(siteState);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Using default site content: ${error.message}`);
    }

    siteState = initialSite;
    await writeJsonFile(SITE_CONTENT_FILE, siteState);
  }
};

const validateSiteContent = (payload) => {
  const requiredObjects = ["brand", "hero", "sections"];
  const requiredArrays = ["metrics", "services", "projects", "process", "testimonials", "gallery"];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Site content must be a JSON object.");
  }

  requiredObjects.forEach((key) => {
    if (!payload[key] || typeof payload[key] !== "object" || Array.isArray(payload[key])) {
      throw new Error(`Missing required object: ${key}.`);
    }
  });

  requiredArrays.forEach((key) => {
    if (!Array.isArray(payload[key])) {
      throw new Error(`Missing required list: ${key}.`);
    }
  });

  if (!payload.brand.name || !payload.brand.phone || !payload.brand.whatsapp) {
    throw new Error("Brand name, phone, and WhatsApp number are required.");
  }

  if (!payload.hero.title || !payload.hero.text) {
    throw new Error("Hero title and text are required.");
  }

  if (!payload.hero.image || !String(payload.hero.image).startsWith("/assets/")) {
    throw new Error("Hero image must point to an asset path.");
  }
};

const saveSiteContent = async (payload) => {
  validateSiteContent(payload);
  siteState = payload;
  await writeJsonFile(SITE_CONTENT_FILE, siteState);
};

const sanitize = (value) => String(value || "").trim().slice(0, 800);

const createWhatsAppMessage = (inquiry) =>
  [
    "Hello TR Enterprises, I want a free quote.",
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    inquiry.email ? `Email: ${inquiry.email}` : "",
    `Service: ${inquiry.service}`,
    inquiry.location ? `Location: ${inquiry.location}` : "",
    inquiry.message ? `Message: ${inquiry.message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

const saveInquiry = async (inquiry) => {
  let existing = [];

  try {
    existing = JSON.parse(await fs.readFile(INQUIRIES_FILE, "utf8"));
  } catch {
    existing = [];
  }

  existing.unshift(inquiry);
  await writeJsonFile(INQUIRIES_FILE, existing);
};

const handleInquiry = async (req, res) => {
  try {
    const payload = await readJsonBody(req);
    const inquiry = {
      id: crypto.randomUUID(),
      name: sanitize(payload.name),
      phone: sanitize(payload.phone),
      email: sanitize(payload.email),
      service: sanitize(payload.service),
      location: sanitize(payload.location),
      message: sanitize(payload.message),
      createdAt: new Date().toISOString()
    };

    if (!inquiry.name || !inquiry.phone || !inquiry.service) {
      sendJson(res, 400, {
        ok: false,
        message: "Name, phone number, and service are required."
      });
      return;
    }

    await saveInquiry(inquiry);

    const whatsappText = createWhatsAppMessage(inquiry);
    const whatsappUrl = `https://wa.me/${siteState.brand.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

    sendJson(res, 201, {
      ok: true,
      message: "Inquiry saved successfully.",
      inquiry,
      whatsappUrl
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      message: error.message || "Unable to submit inquiry."
    });
  }
};

const handleAdminLogin = async (req, res) => {
  try {
    const payload = await readJsonBody(req);

    if (String(payload.password || "") !== ADMIN_PASSWORD) {
      sendJson(res, 401, { ok: false, message: "Invalid admin password." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      token: createAdminSession(),
      expiresInMs: ADMIN_SESSION_MS
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      message: error.message || "Unable to sign in."
    });
  }
};

const isInsideDirectory = (filePath, directory) => {
  const relative = path.relative(directory, filePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
};

const resolveFromDirectory = (directory, relativePath) => {
  const filePath = path.resolve(directory, relativePath);
  return isInsideDirectory(filePath, directory) ? filePath : null;
};

const resolveStaticPath = (urlPath) => {
  let decoded;

  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  const cleanPath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");

  if (cleanPath.startsWith("assets/")) {
    return resolveFromDirectory(ASSETS_DIR, cleanPath.replace(/^assets\//, ""));
  }

  return resolveFromDirectory(PUBLIC_DIR, cleanPath);
};

const serveStatic = async (req, res, urlPath) => {
  const filePath = resolveStaticPath(urlPath);

  if (!filePath) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, content, {
      "Content-Type": mimeTypes.get(ext) || "application/octet-stream",
      "Cache-Control": "no-store"
    }, req.method);
  } catch {
    if (!path.extname(urlPath)) {
      serveStatic(req, res, "/index.html");
      return;
    }

    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
  }
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const method = req.method || "GET";

  if (method === "GET" && requestUrl.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "TR Enterprises API", timestamp: new Date().toISOString() });
    return;
  }

  if (method === "GET" && requestUrl.pathname === "/api/site") {
    sendJson(res, 200, siteState);
    return;
  }

  if (method === "POST" && requestUrl.pathname === "/api/admin/login") {
    await handleAdminLogin(req, res);
    return;
  }

  if (method === "PUT" && requestUrl.pathname === "/api/site") {
    if (!isAdminAuthorized(req)) {
      sendJson(res, 401, { ok: false, message: "Admin password required." });
      return;
    }

    try {
      const payload = await readJsonBody(req);
      await saveSiteContent(payload);
      sendJson(res, 200, { ok: true, message: "Site content saved.", site: siteState });
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message || "Unable to save site content." });
    }
    return;
  }

  if (method === "POST" && requestUrl.pathname === "/api/inquiries") {
    await handleInquiry(req, res);
    return;
  }

  if (requestUrl.pathname.startsWith("/api/")) {
    sendJson(res, 404, { ok: false, message: "API route not found." });
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    send(res, 405, "Method not allowed", {
      "Allow": "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    });
    return;
  }

  await serveStatic(req, res, requestUrl.pathname);
});

loadSiteContent().then(() => {
  server.listen(PORT, () => {
    console.log(`TR Enterprises is running at http://127.0.0.1:${PORT}`);
  });
}).catch((error) => {
  console.error(`Unable to start TR Enterprises: ${error.message}`);
  process.exitCode = 1;
});
