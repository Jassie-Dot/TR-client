# TR Enterprises Premium Full-Stack Website

Modern Node.js + Tailwind website for TR Enterprises.

## Stack

- Node.js backend using the built-in `http` module
- Tailwind CSS frontend compiled to `public/styles.css`
- Server-rendered public content from `data/site.js` / `data/site-content.json`
- Admin editor served from `public/admin.html`
- Inquiry submission stored in `data/inquiries.json`

## Run Locally

```bash
npm install
npm run build:css
npm start
```

For admin access in PowerShell, set secrets before starting:

```powershell
$env:ADMIN_PASSWORD = "replace-with-a-long-password"
$env:ADMIN_TOKEN_SECRET = "replace-with-a-long-random-secret"
npm start
```

Open:

```text
http://127.0.0.1:3000
```

## Useful Scripts

```bash
npm run build:css
npm run watch:css
npm run check
npm start
```

## Security

- Set `ADMIN_PASSWORD` and `ADMIN_TOKEN_SECRET` in production. Admin login is disabled when either secret is missing.
- Use a long admin password and a high-entropy token secret.
- Admin sessions use `HttpOnly`, same-site cookies; admin bearer tokens are not exposed to frontend JavaScript.
- Public page content is embedded server-side. The public frontend does not fetch `/api/site`.
- `GET /api/site` and `PUT /api/site` require an authenticated admin session.
- `POST /api/inquiries` remains public because the contact form needs it, but it is same-origin checked, JSON-only, and rate-limited.
- `GET /api/health` is disabled unless `ENABLE_HEALTHCHECK=1`.

The site API loads editable content from `data/site-content.json` at runtime and falls back to `data/site.js`.
The inquiry API validates name, phone, and service, saves the request, and returns a WhatsApp continuation URL.
