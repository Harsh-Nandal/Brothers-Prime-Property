# Deploying on Hostinger (Node.js hosting)

Use a Hostinger plan that supports Node.js web apps (check the plan page before buying).

1. Buy hosting + domain in the CLIENT's name/email (per quotation).
2. Copy `.env.example` to `.env.local` (or set the same variables in hPanel > Node.js > Environment variables) and fill in the real phone, WhatsApp, email, address, map query and your domain in NEXT_PUBLIC_SITE_URL.
3. Upload the project (zip WITHOUT node_modules and .next) or connect the GitHub repo in hPanel.
4. Settings: Node.js 20+ (22 works), build command `npm run build`, start command `npm start`, install `npm install`.
5. Point the domain to the hosting and enable the free SSL in hPanel.
6. Test: open every page, send a test enquiry (saved to `data/enquiries.jsonl`, or forwarded if ENQUIRY_WEBHOOK_URL is set), click the WhatsApp button.

Before going live: replace sample projects in `lib/projects.js`, add real photos to `public/projects/<slug>/`, and replace placeholder stats in `lib/site.js`.
