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
    const items = section.querySelectorAll('h2, h3, .section-tag, article, .agent-index > div');
    if (!items.length) return;
    gsap.from(items, { y: 34, opacity: 0, duration: .75, stagger: .05, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 78%' } });
  });
}
const menu = document.querySelector('.menu');
menu?.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'CLOSE' : 'MENU';
});
if (reduced) document.querySelectorAll('video').forEach((video) => video.pause());
