# TR Enterprises Premium Full-Stack Website

Modern Node.js + Tailwind website for TR Enterprises.

## Stack

- Node.js backend using the built-in `http` module
- Tailwind CSS frontend compiled to `public/styles.css`
- API-driven content from `data/site.js`
- Inquiry submission stored in `data/inquiries.json`

## Run Locally

```bash
npm install
npm run build:css
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

## API

- `GET /api/health`
- `GET /api/site`
- `POST /api/inquiries`

The inquiry API validates name, phone, and service, saves the request, and returns a WhatsApp continuation URL.
