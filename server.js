const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const initialSite = require("./data/site");

const PORT = Number(process.env.PORT || 3000);
const IS_PRODUCTION = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
const ALLOW_VERCEL_LIVE = Boolean(process.env.VERCEL) && process.env.DISABLE_VERCEL_LIVE !== "1";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || (IS_PRODUCTION ? "" : crypto.randomBytes(32).toString("base64url"));
const ADMIN_SESSION_MS = 1000 * 60 * 60 * 12;
const ADMIN_COOKIE_NAME = IS_PRODUCTION ? "__Host-tr_admin_session" : "tr_admin_session";
const CAN_PERSIST_DATA = !process.env.VERCEL;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSETS_DIR = path.join(ROOT, "assets");
const DATA_DIR = path.join(ROOT, "data");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const MAX_BODY_BYTES = 1024 * 512;
const PUBLIC_SITE_PLACEHOLDER = "__TR_SITE_DATA__";
const LOGIN_LIMIT = { limit: 6, windowMs: 15 * 60 * 1000 };
const INQUIRY_LIMIT = { limit: 8, windowMs: 60 * 60 * 1000 };
let siteState = initialSite;
let siteContentReady = null;
const rateLimitStore = new Map();

if (!ADMIN_PASSWORD) {
  console.warn("ADMIN_PASSWORD is not configured. Admin login is disabled.");
}

if (!ADMIN_TOKEN_SECRET) {
  console.warn("ADMIN_TOKEN_SECRET is not configured. Admin login is disabled.");
}

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

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  ...(IS_PRODUCTION ? { "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload" } : {}),
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    `style-src 'self' https://fonts.googleapis.com${ALLOW_VERCEL_LIVE ? " 'unsafe-inline'" : ""}`,
    "script-src 'self'",
    `script-src-elem 'self'${ALLOW_VERCEL_LIVE ? " https://vercel.live" : ""}`,
    `connect-src 'self'${ALLOW_VERCEL_LIVE ? " https://vercel.live" : ""}`,
    `frame-src 'self'${ALLOW_VERCEL_LIVE ? " https://vercel.live" : ""}`,
    ...(IS_PRODUCTION ? ["upgrade-insecure-requests"] : [])
  ].join("; ")
};

const send = (res, status, body, headers = {}, method = "GET") => {
  res.writeHead(status, {
    ...securityHeaders,
    ...headers
  });
  res.end(method === "HEAD" ? undefined : body);
};

const sendJson = (res, status, payload, headers = {}) => {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
};

const getHeader = (req, name) => {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || "";
};

const parseCookies = (req) =>
  getHeader(req, "cookie")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separator = part.indexOf("=");
      if (separator === -1) return cookies;

      const name = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      try {
        if (name) cookies[name] = decodeURIComponent(value);
      } catch {
        if (name) cookies[name] = "";
      }
      return cookies;
    }, {});

const createAdminCookie = (token, maxAgeSeconds = Math.floor(ADMIN_SESSION_MS / 1000)) => [
  `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
  "Path=/",
  "HttpOnly",
  "SameSite=Strict",
  `Max-Age=${maxAgeSeconds}`,
  ...(IS_PRODUCTION ? ["Secure"] : [])
].join("; ");

const clearAdminCookie = () => createAdminCookie("", 0);

const getClientIp = (req) =>
  getHeader(req, "x-forwarded-for").split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "unknown";

const isRateLimited = (req, bucket, { limit, windowMs }) => {
  const now = Date.now();
  const key = `${bucket}:${getClientIp(req)}`;
  const hits = (rateLimitStore.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  hits.push(now);
  rateLimitStore.set(key, hits);
  return hits.length > limit;
};

const isSameOriginRequest = (req) => {
  const host = getHeader(req, "host");
  const origin = getHeader(req, "origin");
  const referer = getHeader(req, "referer");

  try {
    if (origin) return new URL(origin).host === host;
    if (referer) return new URL(referer).host === host;
  } catch {
    return false;
  }

  return false;
};

const rejectCrossOriginMutation = (req, res) => {
  if (isSameOriginRequest(req)) return false;

  sendJson(res, 403, {
    ok: false,
    message: "Cross-origin requests are not allowed."
  });
  return true;
};

const rejectNonJsonRequest = (req, res) => {
  const contentType = getHeader(req, "content-type").split(";")[0].trim().toLowerCase();
  if (contentType === "application/json") return false;

  sendJson(res, 415, {
    ok: false,
    message: "Content-Type must be application/json."
  });
  return true;
};

const normalizePathname = (pathname) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

const getAdminToken = (req) => {
  const cookies = parseCookies(req);
  return cookies[ADMIN_COOKIE_NAME] || "";
};

const signTokenPayload = (payload) =>
  crypto
    .createHmac("sha256", ADMIN_TOKEN_SECRET)
    .update(payload)
    .digest("base64url");

const verifySignature = (payload, signature) => {
  const expected = signTokenPayload(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
};

const timingSafeStringEqual = (actual, expected) => {
  const actualBuffer = Buffer.from(String(actual));
  const expectedBuffer = Buffer.from(String(expected));

  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
};

const isAdminAuthorized = (req) => {
  if (!ADMIN_TOKEN_SECRET) return false;

  const token = getAdminToken(req);
  if (token.length > 4096) return false;
  const [payload, signature] = token.split(".");

  if (!payload || !signature || !verifySignature(payload, signature)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.scope === "admin" && Number(session.expiresAt) > Date.now();
  } catch {
    return false;
  }
};

const createAdminSession = () => {
  const payload = Buffer.from(
    JSON.stringify({
      scope: "admin",
      createdAt: Date.now(),
      expiresAt: Date.now() + ADMIN_SESSION_MS
    })
  ).toString("base64url");

  return `${payload}.${signTokenPayload(payload)}`;
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
  if (!CAN_PERSIST_DATA) {
    return false;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.rename(tempPath, filePath);
  return true;
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

const ensureSiteContent = () => {
  if (!siteContentReady) {
    siteContentReady = loadSiteContent();
  }

  return siteContentReady;
};

const validateSiteContent = (payload) => {
  const requiredObjects = ["brand", "hero", "sections"];
  const requiredArrays = ["metrics", "services", "projects", "process", "testimonials", "gallery"];
  const imagePaths = [
    payload?.hero?.image,
    ...(payload?.services || []).map((item) => item.image),
    ...(payload?.projects || []).map((item) => item.image),
    ...(payload?.gallery || []).map((item) => item.image)
  ];

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

  for (const imagePath of imagePaths) {
    if (!imagePath || !String(imagePath).startsWith("/assets/") || String(imagePath).includes("..")) {
      throw new Error("All images must point to safe asset paths.");
    }
  }
};

const pickFields = (source = {}, keys = []) =>
  keys.reduce((result, key) => {
    if (source[key] !== undefined) result[key] = source[key];
    return result;
  }, {});

const getPublicSiteState = () => ({
  brand: pickFields(siteState.brand, ["name", "shortName", "phone", "whatsapp", "location", "address"]),
  hero: pickFields(siteState.hero, ["eyebrow", "title", "text", "image", "chips"]),
  sections: siteState.sections,
  metrics: siteState.metrics,
  services: siteState.services,
  projects: siteState.projects,
  process: siteState.process,
  testimonials: siteState.testimonials,
  gallery: siteState.gallery
});

const serializeJsonForHtml = (payload) =>
  JSON.stringify(payload)
    .replaceAll("&", "\\u0026")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");

const injectPublicSiteData = (html) =>
  html.replace(PUBLIC_SITE_PLACEHOLDER, serializeJsonForHtml(getPublicSiteState()));

const saveSiteContent = async (payload) => {
  validateSiteContent(payload);
  siteState = payload;
  return writeJsonFile(SITE_CONTENT_FILE, siteState);
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
  return writeJsonFile(INQUIRIES_FILE, existing);
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

    const persisted = await saveInquiry(inquiry);

    const whatsappText = createWhatsAppMessage(inquiry);
    const whatsappUrl = `https://wa.me/${siteState.brand.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

    sendJson(res, 201, {
      ok: true,
      message: persisted ? "Inquiry saved successfully." : "Inquiry received. Continue on WhatsApp.",
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

    if (!ADMIN_PASSWORD || !ADMIN_TOKEN_SECRET || !timingSafeStringEqual(payload.password || "", ADMIN_PASSWORD)) {
      sendJson(res, 401, { ok: false, message: "Invalid admin credentials." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      expiresInMs: ADMIN_SESSION_MS
    }, {
      "Set-Cookie": createAdminCookie(createAdminSession())
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

  if (cleanPath === "favicon.ico") {
    return resolveFromDirectory(PUBLIC_DIR, "favicon.svg");
  }

  if (cleanPath.startsWith("assets/")) {
    return resolveFromDirectory(ASSETS_DIR, cleanPath.replace(/^assets\//, ""));
  }

  return resolveFromDirectory(PUBLIC_DIR, cleanPath);
};

const serveStatic = async (req, res, urlPath) => {
  const filePath = resolveStaticPath(urlPath);

  if (!filePath) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" }, req.method);
    return;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    let content = await fs.readFile(filePath);
    const responseHeaders = {
      "Content-Type": mimeTypes.get(ext) || "application/octet-stream",
      "Cache-Control": "no-store"
    };

    if (ext === ".html" && path.basename(filePath) === "index.html") {
      content = injectPublicSiteData(content.toString("utf8"));
    }

    if (ext === ".html" && path.basename(filePath) === "admin.html") {
      responseHeaders["X-Robots-Tag"] = "noindex, nofollow, noarchive";
    }

    send(res, 200, content, responseHeaders, req.method);
  } catch {
    if (!path.extname(urlPath)) {
      await serveStatic(req, res, "/index.html");
      return;
    }

    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" }, req.method);
  }
};

const handleRequest = async (req, res) => {
  await ensureSiteContent();

  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const method = req.method || "GET";
  const pathname = normalizePathname(requestUrl.pathname);

  if (method === "GET" && pathname === "/api/health" && process.env.ENABLE_HEALTHCHECK === "1") {
    sendJson(res, 200, { ok: true, service: "TR Enterprises API", timestamp: new Date().toISOString() });
    return;
  }

  if (method === "POST" && pathname === "/api/admin/login") {
    if (rejectCrossOriginMutation(req, res)) return;
    if (rejectNonJsonRequest(req, res)) return;
    if (isRateLimited(req, "admin-login", LOGIN_LIMIT)) {
      sendJson(res, 429, { ok: false, message: "Too many login attempts. Try again later." });
      return;
    }

    await handleAdminLogin(req, res);
    return;
  }

  if (method === "POST" && pathname === "/api/admin/logout") {
    if (rejectCrossOriginMutation(req, res)) return;

    sendJson(res, 200, { ok: true }, {
      "Set-Cookie": clearAdminCookie()
    });
    return;
  }

  if ((method === "GET" || method === "PUT") && pathname === "/api/site") {
    if (!isAdminAuthorized(req)) {
      sendJson(res, 401, { ok: false, message: "Admin password required." });
      return;
    }

    if (method === "GET") {
      sendJson(res, 200, siteState);
      return;
    }

    if (rejectCrossOriginMutation(req, res)) return;
    if (rejectNonJsonRequest(req, res)) return;

    try {
      const payload = await readJsonBody(req);
      const persisted = await saveSiteContent(payload);
      sendJson(res, 200, {
        ok: true,
        persisted,
        message: persisted ? "Site content saved." : "Site content updated for this runtime.",
        site: siteState
      });
    } catch (error) {
      sendJson(res, 400, { ok: false, message: error.message || "Unable to save site content." });
    }
    return;
  }

  if (method === "POST" && pathname === "/api/inquiries") {
    if (rejectCrossOriginMutation(req, res)) return;
    if (rejectNonJsonRequest(req, res)) return;
    if (isRateLimited(req, "inquiry", INQUIRY_LIMIT)) {
      sendJson(res, 429, { ok: false, message: "Too many submissions. Please try again later." });
      return;
    }

    await handleInquiry(req, res);
    return;
  }

  if (pathname.startsWith("/api/")) {
    sendJson(res, 404, { ok: false, message: "API route not found." });
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    send(res, 405, "Method not allowed", {
      "Allow": "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8"
    }, method);
    return;
  }

  if (pathname === "/admin") {
    await serveStatic(req, res, "/admin.html");
    return;
  }

  await serveStatic(req, res, pathname);
};

if (require.main === module) {
  ensureSiteContent().then(() => {
    http.createServer(handleRequest).listen(PORT, () => {
      console.log(`TR Enterprises is running at http://127.0.0.1:${PORT}`);
    });
  }).catch((error) => {
    console.error(`Unable to start TR Enterprises: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = handleRequest;
