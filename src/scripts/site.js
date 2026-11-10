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
const primaryLinks = [...document.querySelectorAll('.topbar nav a[href^="#"]')];
const navigationSections = primaryLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if (navigationSections.length) {
  const navigationObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    primaryLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -60%', threshold: [0, .1, .5] });
  navigationSections.forEach((section) => navigationObserver.observe(section));
}
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
      gsap.fromTo(panel, { clipPath: 'inset(7% 3%)' }, {
        clipPath: 'inset(0% 0%)',
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: processTween, start: 'left 90%', end: 'center center', scrub: true },
      });
    });
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedNetwork = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
  const filmObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      if (!video.dataset.loaded) {
        const hdSource = video.getAttribute('data-src-hd');
        const preferredSource = hdSource;
        const fallbackSource = hdSource;
        video.dataset.loaded = 'true';
        video.src = preferredSource || fallbackSource;
        video.addEventListener('error', () => {
          if (fallbackSource && video.currentSrc !== fallbackSource) {
            video.src = fallbackSource;
            video.load();
          }
        }, { once: true });
        video.load();
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }), { rootMargin: constrainedNetwork ? '10% 0%' : '30% 10%', threshold: .01 });
  document.querySelectorAll('.smart-video').forEach((video) => filmObserver.observe(video));

  document.querySelectorAll('.material-film').forEach((figure) => {
    const frame = figure.querySelector('div');
    gsap.fromTo(frame, { clipPath: 'inset(14% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'none',
      scrollTrigger: { trigger: figure, start: 'top 88%', end: 'top 38%', scrub: .7 },
    });
  });

  gsap.fromTo('.ada-title h2', { xPercent: 10 }, {
    xPercent: -5,
    ease: 'none',
    scrollTrigger: { trigger: '.ada', start: 'top bottom', end: 'center top', scrub: true },
  });

  const identityMark = document.querySelector('[data-ada-mark]');
  const identityImage = identityMark?.querySelector('img');
  const identityScan = identityMark?.querySelector('.ada-identity__scan');
  if (identityMark && identityImage) {
    gsap.fromTo(identityImage,
      { scale: .56, rotation: -7 },
      { scale: 1.03, rotation: 3, ease: 'none', scrollTrigger: { trigger: '.ada-identity', start: 'top bottom', end: 'bottom bottom', scrub: 1 } },
    );
    gsap.fromTo(identityScan,
      { y: -20 },
      { y: () => identityMark.clientHeight + 20, ease: 'none', scrollTrigger: { trigger: '.ada-identity', start: 'top 70%', end: 'bottom 30%', scrub: .7, invalidateOnRefresh: true } },
    );

    if (matchMedia('(pointer:fine)').matches) {
      const moveX = gsap.quickTo(identityImage, 'x', { duration: .45, ease: 'power3.out' });
      const moveY = gsap.quickTo(identityImage, 'y', { duration: .45, ease: 'power3.out' });
      identityMark.addEventListener('pointermove', (event) => {
        const bounds = identityMark.getBoundingClientRect();
        moveX(((event.clientX - bounds.left) / bounds.width - .5) * 22);
        moveY(((event.clientY - bounds.top) / bounds.height - .5) * 22);
      });
      identityMark.addEventListener('pointerleave', () => { moveX(0); moveY(0); });
    }
  }

  const packStage = document.querySelector('.pack-stage');
  const packDogs = gsap.utils.toArray('.pack-dog');
  const packWhole = document.querySelector('.pack-whole');
  if (packStage && packDogs.length && packWhole) {
    const packCursor = packStage.querySelector('.pack-cursor');
    const packCount = packStage.querySelector('.pack-count b');
    const pointer = { x: packStage.clientWidth / 2, y: packStage.clientHeight * .52 };
    let packTimeline;

    const updatePointer = (event) => {
      if (packStage.classList.contains('is-complete')) return;
      const bounds = packStage.getBoundingClientRect();
      pointer.x = Math.max(70, Math.min(bounds.width - 70, event.clientX - bounds.left));
      pointer.y = Math.max(70, Math.min(bounds.height - 65, event.clientY - bounds.top));
      gsap.to(packCursor, { left: pointer.x, top: pointer.y, duration: .18, ease: 'power2.out', overwrite: true });
    };

    const assemblePack = () => {
      packTimeline?.kill();
      packStage.classList.remove('is-complete');
      packStage.classList.add('is-tracking');
      if (packCount) packCount.textContent = '00 / 05';
      gsap.set(packWhole, { opacity: 0, left: '50%', top: '52%', xPercent: -50, yPercent: -50, scale: .55, rotation: -5 });
      packTimeline = gsap.timeline({
        onComplete: () => {
          packStage.classList.remove('is-tracking');
          packStage.classList.add('is-complete');
        },
      });
      packDogs.forEach((dog, index) => {
        packTimeline.fromTo(dog,
          { y: 64, opacity: 0, scale: .5, rotation: index % 2 ? 8 : -8 },
          {
            left: () => pointer.x, top: () => pointer.y, xPercent: -50, yPercent: -50,
            y: 0, opacity: 1, scale: .38, rotation: 0, duration: .72, ease: 'power3.inOut',
            onStart: () => { if (packCount) packCount.textContent = `0${index + 1} / 05`; },
          }, index * .13,
        );
      });
      packTimeline
        .to(packDogs, { opacity: 0, scale: .08, duration: .22, stagger: .035, ease: 'power2.in' }, '>-0.08')
        .set(packWhole, { left: () => pointer.x, top: () => pointer.y })
        .to(packWhole, { opacity: 1, scale: .72, rotation: 0, duration: .3, ease: 'back.out(2)' })
        .to(packWhole, { left: '50%', top: '52%', scale: 1, duration: .65, ease: 'expo.inOut' }, '+=.08');
    };

    const scatterPack = () => {
      packTimeline?.kill();
      packStage.classList.remove('is-tracking', 'is-complete');
      if (packCount) packCount.textContent = '00 / 05';
      gsap.to(packWhole, { opacity: 0, scale: .45, duration: .25, overwrite: true });
      gsap.to(packDogs, { opacity: 0, y: 70, duration: .3, stagger: .035, overwrite: true });
    };

    packStage.addEventListener('pointermove', updatePointer);
    packStage.addEventListener('pointerenter', assemblePack);
    packStage.addEventListener('pointerleave', scatterPack);
    packStage.addEventListener('focusin', assemblePack);
    packStage.addEventListener('focusout', scatterPack);
    if (!matchMedia('(pointer:fine)').matches) {
      ScrollTrigger.create({ trigger: packStage, start: 'top 80%', once: true, onEnter: assemblePack });
    }

    gsap.fromTo('.site-footer__wordmark',
      { letterSpacing: '-.13em', opacity: .08 },
      { letterSpacing: '-.095em', opacity: .2, ease: 'none', scrollTrigger: { trigger: '.site-footer', start: 'top 75%', end: 'center center', scrub: .7 } },
    );
  }

}
const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'CLOSE' : 'MENU';
});
if (reduced) document.querySelectorAll('video').forEach((video) => video.pause());

const companion = document.querySelector('.ada-companion');
const companionTrigger = companion?.querySelector('.ada-companion__trigger');
const companionPanel = companion?.querySelector('.ada-companion__panel');
const companionClose = companion?.querySelector('.ada-companion__bar button');

const setCompanion = (open) => {
  if (!companion || !companionTrigger || !companionPanel) return;
  companion.classList.toggle('is-open', open);
  companionTrigger.setAttribute('aria-expanded', String(open));
  companionPanel.setAttribute('aria-hidden', String(!open));
  if (open) companionClose?.focus({ preventScroll: true });
  else companionTrigger.focus({ preventScroll: true });
};

companionTrigger?.addEventListener('click', () => {
  setCompanion(!companion?.classList.contains('is-open'));
});
companionClose?.addEventListener('click', () => setCompanion(false));
companion?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setCompanion(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && companion?.classList.contains('is-open')) setCompanion(false);
});
