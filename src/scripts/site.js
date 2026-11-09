import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const captureMode = new URLSearchParams(window.location.search).has("capture");
const reduceMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches || captureMode;
const loader = document.querySelector(".loader");
const loaderCount = document.querySelector(".loader-count");
if (reduceMotion) loader?.remove();
else {
  const state = { value: 0 };
  gsap.to(state, {
    value: 100,
    duration: 0.55,
    ease: "power2.inOut",
    onUpdate: () => {
      if (loaderCount)
        loaderCount.textContent = String(Math.round(state.value)).padStart(
          2,
          "0",
        );
    },
  });
  gsap
    .timeline({ delay: 0.55 })
    .to(".loader-line i", { scaleX: 1, duration: 0.1 })
    .to(loader, { yPercent: -100, duration: 0.65, ease: "power3.inOut" })
    .from(
      ".title-line span",
      { yPercent: 115, duration: 0.85, stagger: 0.07, ease: "power3.out" },
      "-=.25",
    )
    .from(
      ".hero-foot, .hero-status",
      { opacity: 0, y: 25, duration: 0.7, stagger: 0.1 },
      "-=.55",
    );
  gsap.to(".orbit-a", {
    rotation: 360,
    duration: 28,
    repeat: -1,
    ease: "none",
  });
  gsap.to(".orbit-b", {
    rotation: -360,
    duration: 36,
    repeat: -1,
    ease: "none",
  });
  gsap.to(".orbit-c", {
    rotation: 360,
    duration: 46,
    repeat: -1,
    ease: "none",
  });
  gsap.to(".hero-title", {
    yPercent: 18,
    opacity: 0.18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.to(".marquee-track", {
    xPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
  document
    .querySelectorAll(".reveal-copy")
    .forEach((el) =>
      gsap.from(el.children, {
        y: 55,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      }),
    );
  gsap.from(".agent-row", {
    y: 60,
    opacity: 0,
    stagger: 0.09,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: { trigger: ".agent-list", start: "top 80%" },
  });
  gsap.from(".service-card", {
    y: 70,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".service-grid", start: "top 80%" },
  });
  gsap.from('.sell-intro > *', { y: 50, opacity: 0, stagger: .1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.product-sell', start: 'top 72%' } });
  gsap.from('.sell-tile', { y: 65, opacity: 0, stagger: .13, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.sell-grid', start: 'top 82%' } });
  gsap.from('.faq-title, .faq details', { y: 38, opacity: 0, stagger: .08, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: '.faq', start: 'top 75%' } });
  gsap.from('.early-access .access-copy > *, .early-access .access-form', { y: 45, opacity: 0, stagger: .12, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: '.early-access', start: 'top 72%' } });
  gsap.from('.contact-link span, .contact-link b', { yPercent: 110, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.contact', start: 'top 65%' } });
  const steps = gsap.utils.toArray(".stage-step");
  if (window.matchMedia("(min-width: 851px)").matches) {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".product-stage",
      start: "top top",
      end: "+=180%",
      scrub: true,
      pin: true,
    },
  });
  steps.forEach((step, index) => {
    if (!index) return;
    timeline
      .to(steps[index - 1], { opacity: 0, y: -28, duration: 0.2 })
      .set(steps[index - 1], { display: "none" })
      .set(step, { display: "block" })
      .fromTo(step, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.25 })
      .to(".scanline", { top: `${20 + index * 30}%`, duration: 0.3 }, "<");
  });
  }
}
const briefs = {
  platform: { prompt: '“Build a calm workspace where small teams can track projects, files, and decisions.”', items: ['Project scope and user stories', 'Workspace roles and access rules', 'API and data model'] },
  marketplace: { prompt: '“Build a local marketplace where independent makers can list and sell their work.”', items: ['Buyer and seller journeys', 'Listings, checkout, and order flows', 'Trust and payment boundaries'] },
  dashboard: { prompt: '“Build a clear dashboard that helps my team understand sales and spot changes early.”', items: ['Metrics and decision points', 'Data sources and refresh rules', 'Charts, filters, and access controls'] },
};
const briefPrompt = document.querySelector('.brief-prompt');
const briefItems = document.querySelector('.brief-result ul');
document.querySelectorAll('.brief-option').forEach((option) => option.addEventListener('click', () => {
  const selected = briefs[option.dataset.brief];
  if (!selected || option.getAttribute('aria-pressed') === 'true') return;
  document.querySelectorAll('.brief-option').forEach((button) => { button.classList.remove('is-selected'); button.setAttribute('aria-pressed', 'false'); });
  option.classList.add('is-selected'); option.setAttribute('aria-pressed', 'true');
  const update = () => { briefPrompt.textContent = selected.prompt; briefItems.replaceChildren(...selected.items.map((item) => { const li = document.createElement('li'); li.textContent = item; return li; })); };
  if (reduceMotion) update();
  else gsap.to('.brief-output', { opacity: 0, y: 12, duration: 0.16, onComplete: () => { update(); gsap.to('.brief-output', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }); } });
}));
const cursor = document.querySelector(".cursor");
const label = cursor?.querySelector("span");
if (cursor && matchMedia("(pointer:fine)").matches && !reduceMotion) {
  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power2.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power2.out' });
  window.addEventListener('pointermove', (event) => { moveX(event.clientX); moveY(event.clientY); }, { passive: true });
  document.querySelectorAll("a,button,[data-cursor]").forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursor.classList.add("is-active");
      if (label) label.textContent = target.dataset.cursor || "GO";
    });
    target.addEventListener("mouseleave", () =>
      cursor.classList.remove("is-active"),
    );
  });
}
document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    if (reduceMotion) return;
    const box = button.getBoundingClientRect();
    gsap.to(button, {
      x: (e.clientX - box.left - box.width / 2) * 0.18,
      y: (e.clientY - box.top - box.height / 2) * 0.18,
      duration: 0.25,
    });
  });
  button.addEventListener("mouseleave", () =>
    gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,.35)" }),
  );
});
const menu = document.querySelector(".menu");
menu?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  menu.setAttribute("aria-expanded", String(open));
});
document
  .querySelectorAll(".topbar nav a")
  .forEach((link) =>
    link.addEventListener("click", () =>
      document.body.classList.remove("nav-open"),
    ),
  );
