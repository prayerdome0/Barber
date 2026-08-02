/* ============================================================
   ROYAL CUTZ — Seedwell Investment Limited
   Shared script for all pages
   ============================================================ */

/* ============================================================
   SITE CONFIG — ✏️ EDIT THESE PLACEHOLDERS WITH YOUR REAL INFO
   ============================================================ */
const SITE = {
  whatsapp: "XXXXXXXXXXX",        // WhatsApp number, digits only (no + or spaces)
  phone: "XXX XXX XXX",           // Display phone number
  email: "example@xxx.com",       // Display email
  address: "123 Barber Street, XXX City",
  hours: "Mon – Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM",
  instagram: "#",                 // e.g. "https://instagram.com/yourhandle"
  tiktok: "#",                    // e.g. "https://tiktok.com/@yourhandle"
  facebook: "#"                   // e.g. "https://facebook.com/yourpage"
};

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  initReveal();
  initLightbox();
  initBookingForm();
  initContactForm();
  initSocial();
  initToTop();
  initYear();
});

/* ---------- Social links (wired from SITE config) ---------- */
function initSocial() {
  const map = { instagram: SITE.instagram, tiktok: SITE.tiktok, facebook: SITE.facebook };
  document.querySelectorAll(".footer-social a, .mm-social a").forEach((a) => {
    const label = (a.getAttribute("aria-label") || "").toLowerCase();
    if (label === "whatsapp") a.href = `https://wa.me/${SITE.whatsapp}`;
    else if (map[label]) a.href = map[label];
  });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

/* ---------- Sticky header shadow ---------- */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Gallery lightbox ---------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll("[data-lightbox]");
  const lightbox = document.getElementById("lightbox");
  if (!galleryItems.length || !lightbox) return;

  const lbImg = lightbox.querySelector(".lb-img");
  const lbCaption = lightbox.querySelector(".lb-caption");
  const items = Array.from(galleryItems);
  let current = 0;

  function open(index) {
    current = index;
    update();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function update() {
    const item = items[current];
    lbImg.src = item.dataset.full || item.querySelector("img").src;
    lbCaption.textContent = item.dataset.caption || "";
  }
  function move(dir) {
    current = (current + dir + items.length) % items.length;
    update();
  }

  items.forEach((item, i) => item.addEventListener("click", () => open(i)));
  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => move(-1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => move(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });
}

/* ---------- Booking form ---------- */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  // Pre-select service passed via ?service= on the URL
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get("service");
  const serviceSelect = document.getElementById("service");
  if (serviceParam && serviceSelect) {
    const match = Array.from(serviceSelect.options).find(
      (o) => o.value.toLowerCase() === serviceParam.toLowerCase() || o.textContent.toLowerCase().includes(serviceParam.toLowerCase())
    );
    if (match) serviceSelect.value = match.value;
  }

  // Minimum booking date = today
  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const data = new FormData(form);
    const summary = {
      name: data.get("name") || "",
      phone: data.get("phone") || "",
      service: data.get("service") || "",
      barber: data.get("barber") || "",
      date: formatDate(data.get("date")) || "",
      time: data.get("time") || "",
      notes: data.get("notes") || ""
    };

    // WhatsApp prefilled message
    const message =
      `Hello Royal Cutz! I'd like to book an appointment.%0A%0A` +
      `👤 Name: ${encodeURIComponent(summary.name)}%0A` +
      `📞 Phone: ${encodeURIComponent(summary.phone)}%0A` +
      `💈 Service: ${encodeURIComponent(summary.service)}%0A` +
      `✂️ Barber: ${encodeURIComponent(summary.barber)}%0A` +
      `📅 Date: ${encodeURIComponent(summary.date)}%0A` +
      `⏰ Time: ${encodeURIComponent(summary.time)}` +
      (summary.notes ? `%0A📝 Notes: ${encodeURIComponent(summary.notes)}` : "");

    const waLink = `https://wa.me/${SITE.whatsapp}?text=${message}`;

    // Show success panel
    const panel = document.getElementById("bookingSuccess");
    const summaryBox = document.getElementById("bookingSummary");
    form.style.display = "none";
    panel.classList.add("show");
    if (summaryBox) summaryBox.innerHTML = buildSummary(summary);
    const waBtn = document.getElementById("waConfirm");
    if (waBtn) waBtn.href = waLink;
    window.scrollTo({ top: panel.offsetTop - 120, behavior: "smooth" });
  });

  // "Book again" resets the form
  const againBtn = document.getElementById("bookAgain");
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      form.reset();
      form.style.display = "";
      document.getElementById("bookingSuccess").classList.remove("show");
    });
  }
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const field = input.closest(".field");
    const ok = input.value.trim() !== "";
    field.classList.toggle("error", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    const firstError = form.querySelector(".field.error input, .field.error select");
    if (firstError) firstError.focus();
  }
  return valid;
}

function formatDate(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[+m - 1]} ${y}`;
}

function buildSummary(s) {
  const rows = [
    ["Name", s.name],
    ["Phone", s.phone],
    ["Service", s.service],
    ["Barber", s.barber],
    ["Date", s.date],
    ["Time", s.time]
  ];
  return rows.map(([k, v]) => `<li><i class="fas fa-check"></i><span><strong>${k}:</strong> ${v || "—"}</span></li>`).join("");
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const name = form.querySelector("[name=name]").value;
    const panel = document.getElementById("contactSuccess");
    const msg = document.getElementById("contactSuccessMsg");
    if (msg) msg.textContent = `Thanks, ${name}! Your message has been received. We'll get back to you within 24 hours.`;
    form.style.display = "none";
    panel.classList.add("show");
    window.scrollTo({ top: panel.offsetTop - 120, behavior: "smooth" });
  });
}

/* ---------- Back to top ---------- */
function initToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Footer year ---------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ---------- Helpers used by inline buttons ---------- */
function bookService(serviceName) {
  window.location.href = `booking.html?service=${encodeURIComponent(serviceName)}`;
}
function openWhatsApp() {
  window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello Royal Cutz! I'd like to book an appointment.")}`, "_blank");
}
