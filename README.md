HAMM Solutions — Cloudflare Pages notes

This repository contains a single-page site and a Cloudflare Pages Functions handler for the contact form for HAMM Solutions. The site serves homeowners and small-to-medium businesses with home/office automation, networking, and on-site IT services.

What I changed:
- Replaced anchor/button links to open the contact form as an accessible modal popup in `Index.html`.
- Contact form now POSTs JSON to `/api/contact` (Cloudflare Pages function).
- Added `functions/contact.js` which validates input and returns a JSON response.

Deploying to Cloudflare Pages:
1. Create a new Pages project in the Cloudflare dashboard and connect your Git repository.
2. Set the build command to `npm run build` (if you add a build step) or leave empty for plain static.
3. Set the build output directory to the repository root (where `Index.html` lives) or to the folder you prefer.
4. Cloudflare Pages will automatically pick up the `functions/` directory and mount it under `/api`.

Wiring email delivery:
- The example function returns success without sending email. For production, integrate with an email provider:
  - SendGrid, Mailgun, Postmark, or use Cloudflare Workers + a Mail API.
  - Store API keys in Pages environment variables (Dashboard → Pages → Settings → Environment Variables & Secrets).
  - Example flow: inside `functions/contact.js`, call the provider's HTTP API using fetch with the API key from env.

Security notes:
- Validate input server-side (the function includes minimal checks).
- Protect any API keys with environment secrets — never commit them.

Next steps you might want:
- Implement provider-specific send code in `functions/contact.js` and add tests.
- Save messages to a KV namespace or FaunaDB/Postgres if you want persistence.
- Add reCAPTCHA or hCaptcha to reduce spam.

If you want, I can implement a SendGrid example using environment variables and a short test harness.
