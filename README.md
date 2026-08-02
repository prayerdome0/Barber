# Royal Cutz — Premium Barbershop Website

Multi-page website for **Royal Cutz** (a brand of **Seedwell Investment Limited**), deployed on Vercel.

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, stats, services preview, gallery strip, testimonials |
| Services | `services.html` | Full service menu with prices & durations |
| Gallery | `gallery.html` | Photo gallery with lightbox |
| About | `about.html` | Story, values, experience, team |
| Booking | `booking.html` | Online booking form + WhatsApp booking |
| Contact | `contact.html` | Contact info, message form, map |
| 404 | `404.html` | Custom not-found page |

## Tech

- Plain HTML + CSS + vanilla JS (no build step — deploys straight to Vercel)
- Shared stylesheet: `assets/css/style.css`
- Shared script: `assets/js/main.js`
- Local photo library: `assets/images/`

## ✏️ Before going live — update these placeholders

All placeholder info is clearly marked. The easiest place to start is the
**SITE CONFIG** at the top of `assets/js/main.js`:

```js
const SITE = {
  whatsapp: "XXXXXXXXXXX",   // WhatsApp number, digits only
  phone: "XXX XXX XXX",
  email: "example@xxx.com",
  address: "123 Barber Street, XXX City",
  hours: "Mon – Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM",
  instagram: "#",            // e.g. "https://instagram.com/yourhandle"
  tiktok: "#"                // e.g. "https://tiktok.com/@yourhandle"
};
```

Then update the visible contact details in every page's header/footer
(phone, email, address) and the map embed in `contact.html`
(`src="https://www.google.com/maps?q=..."` — replace the query with the
real shop address).

## Deploy

The site is fully static — just push to the connected GitHub repo and
Vercel will build & deploy automatically. No configuration required.

## Booking behavior

- The booking form collects name, phone, service, barber, date, time and notes.
- Service cards across the site deep-link into the form (`booking.html?service=...`).
- On submit, the form shows a summary and offers **"Confirm via WhatsApp"**,
  which opens WhatsApp with all details pre-filled.
