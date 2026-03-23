'use strict';

/* NAV SCROLL */
window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 60));

/* HAMBURGER */
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('mobileMenu').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click', closeMobile);
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }

/* PARTICLES */
const pEl = document.getElementById('particles');
if(pEl){for (let i = 0; i < 18; i++) {const p = document.createElement('div'); p.className = 'particle'; const s = Math.random()*80+20; p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*-20}s;`; pEl.appendChild(p);}}

/* COUNTER */
function animCtr(el) {
  const t = +el.dataset.target, s = performance.now(), d = 2000;
  (function run(n) {
    const p = Math.min((n-s)/d,1), v = Math.round((1-Math.pow(1-p,3))*t);
    el.textContent = t>=1000 ? v.toLocaleString('fr-FR') : v;
    p < 1 && requestAnimationFrame(run);
  })(s);
}

/* OBSERVERS */
const doneCtr = new Set();
const revealObs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target);}}),{threshold:0.1});
const ctrObs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting&&!doneCtr.has(e.target)){doneCtr.add(e.target);animCtr(e.target);ctrObs.unobserve(e.target);}}),{threshold:0.3});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
document.querySelectorAll('.counter').forEach(el => ctrObs.observe(el));

/* SLIDERS */
function initSliders() {
  document.querySelectorAll('[data-slider]:not([data-init])').forEach(sl => {
    sl.setAttribute('data-init','1');
    let drag = false;
    const af = sl.querySelector('.ba-after'), hd = sl.querySelector('.ba-handle');
    const set = x => { const r=sl.getBoundingClientRect(),p=Math.min(Math.max((x-r.left)/r.width*100,2),98); af.style.clipPath=`inset(0 ${100-p}% 0 0)`; hd.style.left=p+'%'; };
    sl.addEventListener('mousedown', e => { drag=true; set(e.clientX); });
    window.addEventListener('mousemove', e => { if(drag) set(e.clientX); });
    window.addEventListener('mouseup', () => { drag=false; });
    sl.addEventListener('touchstart', e => { drag=true; set(e.touches[0].clientX); },{passive:true});
    window.addEventListener('touchmove', e => { if(drag) set(e.touches[0].clientX); },{passive:true});
    window.addEventListener('touchend', () => { drag=false; });
  });
}
initSliders();

/* CAROUSEL */
const TRACK = document.getElementById('DTRACK');
if(TRACK){
  const CARDS = Array.from(TRACK.querySelectorAll('.dfc'));
  const carDots = document.getElementById('carDots');
  const carBar  = document.getElementById('carBar');
  let cidx = 0, autoT = null, isDrag = false, dragStartX = 0, dragScrollLeft = 0;
  if(carDots){CARDS.forEach((_, i) => { const d = document.createElement('div'); d.className = 'car-dot' + (i === 0 ? ' act' : ''); d.addEventListener('click', () => { goCard(i); resetAuto(); }); carDots.appendChild(d); });}
  function updCar() {
    const cx = TRACK.getBoundingClientRect().left + TRACK.getBoundingClientRect().width / 2;
    let best = 0, minDist = Infinity;
    CARDS.forEach((card, i) => { const r = card.getBoundingClientRect(); const dist = Math.abs(r.left + r.width / 2 - cx); if (dist < minDist) { minDist = dist; best = i; } });
    cidx = best;
    CARDS.forEach((c, i) => c.classList.toggle('act', i === best));
    if(carDots)carDots.querySelectorAll('.car-dot').forEach((d, i) => d.classList.toggle('act', i === best));
    if(carBar){const pct = 14 + (best / (CARDS.length - 1)) * 86; carBar.style.width = pct + '%';}
  }
  TRACK.addEventListener('scroll', () => requestAnimationFrame(updCar));
  function goCard(i) {
    cidx = ((i % CARDS.length) + CARDS.length) % CARDS.length;
    const trackRect = TRACK.getBoundingClientRect();
    const cardRect  = CARDS[cidx].getBoundingClientRect();
    const offset = TRACK.scrollLeft + (cardRect.left - trackRect.left) - (trackRect.width / 2 - cardRect.width / 2);
    TRACK.scrollTo({ left: offset, behavior: 'smooth' });
    updCar();
  }
  function startAuto() { autoT = setInterval(() => goCard(cidx + 1), 3400); }
  function resetAuto()  { clearInterval(autoT); startAuto(); }
  TRACK.addEventListener('mousedown', e => { isDrag = true; dragStartX = e.pageX - TRACK.offsetLeft; dragScrollLeft = TRACK.scrollLeft; TRACK.classList.add('grabbing'); clearInterval(autoT); });
  TRACK.addEventListener('mousemove', e => { if (!isDrag) return; e.preventDefault(); TRACK.scrollLeft = dragScrollLeft - (e.pageX - TRACK.offsetLeft - dragStartX) * 1.3; });
  ['mouseup','mouseleave'].forEach(ev => TRACK.addEventListener(ev, () => { if (isDrag) { isDrag = false; TRACK.classList.remove('grabbing'); setTimeout(() => { updCar(); resetAuto(); }, 150); } }));
  TRACK.addEventListener('touchstart', () => clearInterval(autoT), { passive: true });
  TRACK.addEventListener('touchend',   () => setTimeout(() => { updCar(); resetAuto(); }, 200));
  const prevBtn = document.getElementById('carPrev'), nextBtn = document.getElementById('carNext');
  if(prevBtn)prevBtn.addEventListener('click', () => { goCard(cidx - 1); resetAuto(); });
  if(nextBtn)nextBtn.addEventListener('click', () => { goCard(cidx + 1); resetAuto(); });
  window.addEventListener('load', () => { CARDS[0].classList.add('act'); setTimeout(() => { goCard(0); startAuto(); }, 150); });
}

/* FORM */
const devisForm = document.getElementById('devisForm');
if(devisForm){
  devisForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const b = this.querySelector('.form-submit');
    b.innerHTML = '<span>Envoi en cours…</span>'; b.disabled = true;
    setTimeout(() => { b.style.display='none'; document.getElementById('formSuccess').style.display='block'; }, 1200);
  });
}
