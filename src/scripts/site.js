import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const captureMode = new URLSearchParams(window.location.search).has("capture");
const reduceMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches || captureMode;

// 1. Lenis Smooth Scrolling Setup
let lenis = null;
if (!reduceMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.4,
    infinite: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// Smooth Anchor Link Navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      document.body.classList.remove("nav-open");
      const menuBtn = document.querySelector(".menu");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

      if (lenis) {
        lenis.scrollTo(target, {
          offset: -20,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// 2. Initial Loader & Page Entrance Animation
const loader = document.querySelector(".loader");
const loaderCount = document.querySelector(".loader-count");

if (reduceMotion) {
  loader?.remove();
} else {
  const state = { value: 0 };
  const loaderTl = gsap.timeline({
    onComplete: () => {
      loader?.remove();
    },
  });

  loaderTl
    .to(state, {
      value: 100,
      duration: 0.85,
      ease: "power2.out",
      onUpdate: () => {
        if (loaderCount) {
          loaderCount.textContent = String(Math.round(state.value)).padStart(2, "0");
        }
      },
    })
    .to(".loader-line i", { scaleX: 1, duration: 0.85, ease: "power2.out" }, 0)
    .to(loader, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "+=0.06")
    .from(
      ".title-line span",
      { yPercent: 110, duration: 1.05, stagger: 0.08, ease: "power4.out" },
      "-=0.4"
    )
    .from(
      ".hero-eyebrow, .hero-main-bottom, .visual-top, .visual-bottom",
      { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: "power3.out" },
      "-=0.6"
    )
    .from(
      ".visual-card",
      { opacity: 0, x: 45, stagger: 0.1, duration: 0.85, ease: "power3.out" },
      "-=0.65"
    )
    .from(
      ".system-core",
      { scale: 0.7, opacity: 0, duration: 0.9, ease: "back.out(1.4)" },
      "-=0.8"
    );

  // 3. Ambient Rotations & Floating
  gsap.to(".ring-one", { rotation: 360, duration: 36, repeat: -1, ease: "none" });
  gsap.to(".ring-two", { rotation: -360, duration: 46, repeat: -1, ease: "none" });
  gsap.to(".ring-three", { rotation: 360, duration: 58, repeat: -1, ease: "none" });
  gsap.to(".system-core", { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".spark-one", { y: -8, rotation: 15, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".spark-two", { y: 8, rotation: -20, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

  gsap.to(".contact-sun i:nth-child(1)", { rotation: 360, duration: 45, repeat: -1, ease: "none" });
  gsap.to(".contact-sun i:nth-child(2)", { rotation: -360, duration: 60, repeat: -1, ease: "none" });
  gsap.to(".contact-sun i:nth-child(3)", { rotation: 360, duration: 75, repeat: -1, ease: "none" });
  gsap.to(".footer-orbit", { rotation: 360, duration: 20, repeat: -1, ease: "none" });

  // 4. Subtle Hero Interactive Mouse Parallax
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && matchMedia("(pointer:fine)").matches) {
    const setVisualX = gsap.quickTo(".visual-system", "x", { duration: 0.6, ease: "power3.out" });
    const setVisualY = gsap.quickTo(".visual-system", "y", { duration: 0.6, ease: "power3.out" });
    const setCardsX = gsap.quickTo(".visual-cards", "x", { duration: 0.8, ease: "power3.out" });
    const setCardsY = gsap.quickTo(".visual-cards", "y", { duration: 0.8, ease: "power3.out" });

    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setVisualX(relX * 24);
      setVisualY(relY * 24);
      setCardsX(relX * -18);
      setCardsY(relY * -18);
    }, { passive: true });

    heroVisual.addEventListener("mouseleave", () => {
      setVisualX(0);
      setVisualY(0);
      setCardsX(0);
      setCardsY(0);
    });
  }

  // 5. Hero Scroll Parallax & Smoothed Marquee
  gsap.to(".hero-title", {
    yPercent: 16,
    opacity: 0.35,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
    },
  });

  gsap.to(".marquee-track", {
    xPercent: -35,
    ease: "none",
    scrollTrigger: {
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
    },
  });

  // 6. Section ScrollTrigger Reveals
  document.querySelectorAll(".reveal-copy").forEach((el) => {
    gsap.from(el.children, {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        once: true,
      },
    });
  });

  gsap.from(".agent-row", {
    y: 45,
    opacity: 0,
    stagger: 0.08,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".agent-list",
      start: "top 82%",
      once: true,
    },
  });

  gsap.from(".proof-banner > *", {
    y: 35,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".proof-banner",
      start: "top 80%",
      once: true,
    },
  });

  gsap.from(".service-card", {
    y: 50,
    opacity: 0,
    stagger: 0.1,
    duration: 0.95,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".service-grid",
      start: "top 82%",
      once: true,
    },
  });

  gsap.from(".manifesto-line", {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top 78%",
      once: true,
    },
  });

  gsap.from(".sell-intro > *", {
    y: 40,
    opacity: 0,
    stagger: 0.09,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".product-sell", start: "top 75%", once: true },
  });

  gsap.from(".sell-tile", {
    y: 55,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".sell-grid", start: "top 82%", once: true },
  });

  gsap.from(".faq-title > *, .faq details", {
    y: 30,
    opacity: 0,
    stagger: 0.07,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: { trigger: ".faq", start: "top 78%", once: true },
  });

  gsap.from(".early-access .access-copy > *, .early-access .access-form", {
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".early-access", start: "top 75%", once: true },
  });

  gsap.from(".contact-top, .contact-link span, .contact-link b, .contact-bottom", {
    y: 45,
    opacity: 0,
    stagger: 0.09,
    duration: 1.0,
    ease: "power3.out",
    scrollTrigger: { trigger: ".contact", start: "top 70%", once: true },
  });

  // 7. Pinned Product Stage (Silky, Non-Jumping Crossfades)
  const steps = gsap.utils.toArray(".stage-step");
  if (window.matchMedia("(min-width: 851px)").matches && steps.length > 1) {
    gsap.set(steps.slice(1), { autoAlpha: 0, y: 30 });

    const stageTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".product-stage",
        start: "top top",
        end: "+=220%",
        scrub: 1.1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Step 1 to Step 2
    stageTl
      .to(steps[0], { autoAlpha: 0, y: -30, duration: 0.8, ease: "power2.inOut" })
      .to(steps[1], { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.inOut" }, "<+=0.2")
      .to(".scanline", { top: "52%", duration: 0.8, ease: "power2.inOut" }, "<")
      .to(".run-line strong", { textContent: "Validating frontend & backend", duration: 0.3 }, "<")
      .to(".run-line b", { textContent: "84%", duration: 0.5 }, "<");

    // Step 2 to Step 3
    stageTl
      .to(steps[1], { autoAlpha: 0, y: -30, duration: 0.8, ease: "power2.inOut" })
      .to(steps[2], { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.inOut" }, "<+=0.2")
      .to(".scanline", { top: "82%", duration: 0.8, ease: "power2.inOut" }, "<")
      .to(".run-line strong", { textContent: "All review gates passed", duration: 0.3 }, "<")
      .to(".run-line b", { textContent: "100%", duration: 0.5 }, "<")
      .to(
        ".agent-stream .agent-event:nth-child(3) i",
        {
          backgroundColor: "#173f42",
          borderColor: "#2b736d",
          color: "#75c7ac",
          innerHTML: "✓",
          duration: 0.4,
        },
        "<"
      )
      .to(
        ".agent-stream .agent-event:nth-child(3) small",
        {
          textContent: "05:02",
          color: "#738991",
          duration: 0.4,
        },
        "<"
      );
  }
}

// 8. Interactive Brief Lab
const briefs = {
  platform: {
    prompt: "“Build a calm workspace where small teams can track projects, files, and decisions.”",
    items: ["Project scope and user stories", "Workspace roles and access rules", "API and data model"],
  },
  marketplace: {
    prompt: "“Build a local marketplace where independent makers can list and sell their work.”",
    items: ["Buyer and seller journeys", "Listings, checkout, and order flows", "Trust and payment boundaries"],
  },
  dashboard: {
    prompt: "“Build a clear dashboard that helps my team understand sales and spot changes early.”",
    items: ["Metrics and decision points", "Data sources and refresh rules", "Charts, filters, and access controls"],
  },
};

const briefPrompt = document.querySelector(".brief-prompt");
const briefItems = document.querySelector(".brief-result ul");

document.querySelectorAll(".brief-option").forEach((option) =>
  option.addEventListener("click", () => {
    const selected = briefs[option.dataset.brief];
    if (!selected || option.getAttribute("aria-pressed") === "true") return;

    document.querySelectorAll(".brief-option").forEach((button) => {
      button.classList.remove("is-selected");
      button.setAttribute("aria-pressed", "false");
    });
    option.classList.add("is-selected");
    option.setAttribute("aria-pressed", "true");

    const update = () => {
      if (briefPrompt) briefPrompt.textContent = selected.prompt;
      if (briefItems) {
        briefItems.replaceChildren(
          ...selected.items.map((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            return li;
          })
        );
      }
    };

    if (reduceMotion) {
      update();
    } else {
      gsap.to(".brief-output", {
        opacity: 0,
        y: 10,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          update();
          gsap.to(".brief-output", {
            opacity: 1,
            y: 0,
            duration: 0.38,
            ease: "power2.out",
          });
        },
      });
    }
  })
);

// 9. Smooth FAQ Accordion Expansion
document.querySelectorAll(".faq details").forEach((detail) => {
  const summary = detail.querySelector("summary");
  const content = detail.querySelector("p");
  if (!summary || !content) return;

  summary.addEventListener("click", (e) => {
    e.preventDefault();
    if (detail.open) {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          detail.removeAttribute("open");
          gsap.set(content, { clearProps: "all" });
        },
      });
    } else {
      detail.setAttribute("open", "");
      const fullHeight = content.scrollHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => gsap.set(content, { clearProps: "height" }),
        }
      );
    }
  });
});

// 10. Custom Smooth Trailing Cursor
const cursor = document.querySelector(".cursor");
const label = cursor?.querySelector("span");

if (cursor && matchMedia("(pointer:fine)").matches && !reduceMotion) {
  gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
  const moveX = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
  const moveY = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });

  let cursorVisible = false;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (!cursorVisible) {
        cursorVisible = true;
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
      }
      moveX(event.clientX);
      moveY(event.clientY);
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    cursorVisible = false;
    gsap.to(cursor, { opacity: 0, duration: 0.25 });
  });

  document.querySelectorAll("a, button, [data-cursor]").forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursor.classList.add("is-active");
      if (label) label.textContent = target.dataset.cursor || "GO";
      gsap.to(cursor, { scale: 1.15, duration: 0.25, ease: "power2.out" });
    });
    target.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-active");
      gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power2.out" });
    });
  });
}

// 11. Magnetic Elements with Spring Easing
document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (e) => {
    if (reduceMotion) return;
    const box = button.getBoundingClientRect();
    const x = (e.clientX - box.left - box.width / 2) * 0.22;
    const y = (e.clientY - box.top - box.height / 2) * 0.22;
    gsap.to(button, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  button.addEventListener("mouseleave", () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1.1, 0.35)",
    });
  });
});

// 12. Mobile Menu Navigation
const menu = document.querySelector(".menu");
menu?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  menu.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".topbar nav a").forEach((link) =>
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menu?.setAttribute("aria-expanded", "false");
  })
);
