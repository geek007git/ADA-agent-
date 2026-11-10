import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('capture');
let lenis;
if (!reduced) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.5 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  document.body.classList.remove('nav-open');
  document.querySelector('.menu')?.setAttribute('aria-expanded', 'false');
  lenis ? lenis.scrollTo(target) : target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));
const loader = document.querySelector('.loader');
const loaderCount = loader?.querySelector('b');
if (reduced) loader?.remove();
else {
  const counter = { value: 0 };
  gsap.to(counter, { value: 100, duration: .55, onUpdate: () => loaderCount.textContent = String(Math.round(counter.value)).padStart(2, '0') });
  gsap.timeline({ delay: .6 }).to(loader, { yPercent: -100, duration: .65, ease: 'power3.inOut' }).from('.hero h1 span', { yPercent: 110, duration: .9, stagger: .08, ease: 'power3.out' }, '-=.2');
  gsap.utils.toArray('section').forEach((section) => {
    if (section.classList.contains('process-reel')) return;
    const items = section.querySelectorAll('h2, h3, .section-tag, article, .agent-index > div');
    if (!items.length) return;
    gsap.from(items, { y: 34, opacity: 0, duration: .75, stagger: .05, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 78%' } });
  });

  gsap.to('.scroll-progress i', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .2 },
  });

  gsap.to('.hero h1', {
    yPercent: 22,
    scale: .94,
    transformOrigin: 'left bottom',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  gsap.fromTo('.film video', { scale: 1.16 }, {
    scale: 1,
    yPercent: 7,
    ease: 'none',
    scrollTrigger: { trigger: '.film', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  gsap.fromTo('.film-caption strong', { yPercent: 35 }, {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.film', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  const processTrack = document.querySelector('.process-track');
  const processPanels = gsap.utils.toArray('.process-panel');
  const processCount = document.querySelector('.process-counter b');
  if (processTrack && matchMedia('(min-width: 851px)').matches) {
    const processTween = gsap.to(processTrack, {
      x: () => -(processTrack.scrollWidth - innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-reel',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const chapter = Math.min(3, Math.max(1, Math.ceil(self.progress * 3)));
          if (processCount) processCount.textContent = `0${chapter} / 03`;
        },
      },
    });

    processPanels.filter((panel) => panel.classList.contains('process-panel--film')).forEach((panel) => {
      const video = panel.querySelector('video');
      gsap.fromTo(panel, { clipPath: 'inset(7% 3%)' }, {
        clipPath: 'inset(0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: processTween, start: 'left 90%', end: 'center center', scrub: true },
      });
      gsap.fromTo(video, { scale: 1.18 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: processTween, start: 'left right', end: 'right left', scrub: true },
      });
    });
  }

  const filmObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }), { rootMargin: '35% 35%', threshold: .05 });
  document.querySelectorAll('.process-panel video, .material-film video').forEach((video) => filmObserver.observe(video));

  document.querySelectorAll('.material-film').forEach((figure) => {
    const frame = figure.querySelector('div');
    const video = figure.querySelector('video');
    gsap.fromTo(frame, { clipPath: 'inset(14% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'none',
      scrollTrigger: { trigger: figure, start: 'top 88%', end: 'top 38%', scrub: .7 },
    });
    gsap.fromTo(video, { scale: 1.15, yPercent: -4 }, {
      scale: 1,
      yPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  gsap.fromTo('.ada-title h2', { xPercent: 10 }, {
    xPercent: -5,
    ease: 'none',
    scrollTrigger: { trigger: '.ada', start: 'top bottom', end: 'center top', scrub: true },
  });

  gsap.fromTo('.split-film video', { scale: 1.18, yPercent: -5 }, {
    scale: 1,
    yPercent: 5,
    ease: 'none',
    scrollTrigger: { trigger: '.split-film', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'CLOSE' : 'MENU';
});
if (reduced) document.querySelectorAll('video').forEach((video) => video.pause());
