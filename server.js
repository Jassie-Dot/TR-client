const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const site = require("./data/site");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSETS_DIR = path.join(ROOT, "assets");
const INQUIRIES_FILE = path.join(ROOT, "data", "inquiries.json");
const MAX_BODY_BYTES = 1024 * 64;

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

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...headers
  });
  res.end(body);
};

const sendJson = (res, status, payload) => {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
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
  await fs.writeFile(INQUIRIES_FILE, `${JSON.stringify(existing, null, 2)}\n`);
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
    const whatsappUrl = `https://wa.me/${site.brand.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

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

const resolveStaticPath = (urlPath) => {
  const decoded = decodeURIComponent(urlPath);
  const cleanPath = decoded === "/" ? "/index.html" : decoded;

  if (cleanPath.startsWith("/assets/")) {
    const relativeAssetPath = cleanPath.replace(/^\/assets\//, "");
    const assetPath = path.normalize(path.join(ASSETS_DIR, relativeAssetPath));
    return assetPath.startsWith(ASSETS_DIR) ? assetPath : null;
  }

  const publicPath = path.normalize(path.join(PUBLIC_DIR, cleanPath));
  return publicPath.startsWith(PUBLIC_DIR) ? publicPath : null;
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
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=86400"
    });
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
    sendJson(res, 200, site);
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
    send(res, 405, "Method not allowed", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  await serveStatic(req, res, requestUrl.pathname);
});

server.listen(PORT, () => {
  console.log(`TR Enterprises is running at http://127.0.0.1:${PORT}`);
});
