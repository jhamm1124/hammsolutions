HAMM Solutions — Cloudflare Pages notes

This repository is a static HTML/CSS/JS site for HAMM Solutions, serving homeowners and small-to-medium businesses with home/office automation, networking, and on-site IT services. It has no build step and no server-side code of its own.

Deploying to Cloudflare Pages:
1. Create a new Pages project in the Cloudflare dashboard and connect this repository.
2. Leave the build command empty and set the build output directory to the repository root (where `index.html` lives).
3. `_headers` in the repo root is picked up automatically by Cloudflare Pages and applies the site's security headers (CSP, HSTS, etc.) to every page.

Contact form:
- The contact form on `index.html` posts directly (client-side `fetch`) to a separate Cloudflare Worker at `contact-form-hammsolutions.jdhamm17.workers.dev`. That Worker is not part of this repository — it validates the submission and sends the notification/auto-reply emails via Resend.
- If you need to change the email templates, subject lines, or recipient address, edit that Worker's source directly (wherever it's deployed from), not anything in this repo.

Security notes:
- Keep the Worker's Resend API key in its own environment secret — never commit it anywhere.
