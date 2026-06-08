"use strict";

/* ─── ELEMENT REFS ─── */
const $ = id => document.getElementById(id);

const dobInput     = $('dob');
const tobInput     = $('tob');
const calcBtn      = $('calcBtn');
const clearBtn     = $('clearBtn');
const btnText      = calcBtn.querySelector('.btn-text');
const btnLoader    = calcBtn.querySelector('.btn-loader');
const btnRipple    = calcBtn.querySelector('.btn-ripple');
const emptyState   = $('emptyState');
const resultsWrap  = $('resultsWrapper');
const themeToggle  = $('themeToggle');
const backTop      = $('backTop');
const canvas       = $('particlesCanvas');
const glassCard    = document.querySelector('.glass-card');

// Stat elements
const EL = {
  years:      $('statYears'),
  months:     $('statMonths'),
  weeks:      $('statWeeks'),
  days:       $('statDays'),
  hours:      $('statHours'),
  minutes:    $('statMinutes'),
  seconds:    $('statSeconds'),
  heartbeats: $('milHeartbeats'),
  breaths:    $('milBreaths'),
  sleep:      $('milSleep'),
  sunrises:   $('milSunrises'),
  moon:       $('milMoon'),
  bdayDays:   $('bdayDays'),
  bdayHours:  $('bdayHours'),
  bdayMins:   $('bdayMinutes'),
  bdaySecs:   $('bdaySeconds'),
  zodiacSymbol:$('zodiacSymbol'),
  zodiacName: $('zodiacName'),
  zodiacDates:$('zodiacDates'),
  elementSymbol:$('elementSymbol'),
  elementName:$('elementName'),
  zodiacKW:   $('zodiacKeyword'),
  factsList:  $('factsList'),
};

/* ─── STATE ─── */
let birthDate   = null;
let liveTimer   = null;
let particles   = null;
let animationId = null;

/* ─── UTILITIES ─── */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function normalizeBirthDate(birth) {
  const year = birth.getFullYear();
  const month = birth.getMonth();
  const day = birth.getDate();
  if (month === 1 && day === 29 && !isLeapYear(year)) {
    return new Date(year, 1, 28, birth.getHours(), birth.getMinutes(), birth.getSeconds());
  }
  return birth;
}

/* ─── THEME ─── */
(function initTheme() {
  const saved = localStorage.getItem('ageCalcTheme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  themeToggle.setAttribute('aria-pressed', saved === 'light' ? 'true' : 'false');
})();

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ageCalcTheme', next);
  themeToggle.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
});

/* ─── PARTICLES (OPTIMIZED) ─── */
(function initParticles() {
  const ctx = canvas.getContext('2d');
  let W, H;
  particles = [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', debounce(resize, 150));

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(201,168,76,${this.alpha})`
        : `rgba(196,132,106,${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticlesArray() {
    particles = [];
    const count = Math.min(90, Math.floor((W * H) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticlesArray();

  let lastFrame = 0;
  let paused = false;

  function loop(timestamp) {
    if (paused || document.hidden) {
      animationId = requestAnimationFrame(loop);
      return;
    }
    if (timestamp - lastFrame < 16) {
      animationId = requestAnimationFrame(loop);
      return;
    }
    lastFrame = timestamp;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(loop);
  }
  animationId = requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      paused = true;
    } else {
      paused = false;
      lastFrame = 0;
    }
  });
})();

/* ─── PARALLAX MOUSE TILT — desktop only ─── */
(function initTilt() {
  // Detect touch device — skip tilt entirely on mobile
  const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouchDevice()) return;

  let mx = 0, my = 0;
  const MAX = 6;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    mx = ((e.clientX - cx) / cx) * MAX;
    my = ((e.clientY - cy) / cy) * MAX;
    glassCard.classList.add('tilt-active');
    glassCard.style.transform = `perspective(1200px) rotateY(${mx * 0.5}deg) rotateX(${-my * 0.4}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    glassCard.classList.remove('tilt-active');
    glassCard.style.transform = '';
  });
})();

/* ─── MOBILE TOUCH ANIMATIONS ─── */
(function initMobileAnimations() {
  if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  // Touch press effect on stat cards
  document.addEventListener('touchstart', e => {
    const card = e.target.closest('.stat-card, .milestone-card, .zodiac-card, .bday-unit');
    if (!card) return;
    card.style.transform = 'scale(0.96)';
    card.style.transition = 'transform 0.12s ease';
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const card = e.target.closest('.stat-card, .milestone-card, .zodiac-card, .bday-unit');
    if (!card) return;
    card.style.transform = '';
    // Flash glow
    card.style.boxShadow = '0 0 24px var(--glow-violet)';
    setTimeout(() => { card.style.boxShadow = ''; card.style.transition = ''; }, 350);
  }, { passive: true });
})();

/* ─── BACK TO TOP ─── */
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 300);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── ZODIAC DATA ─── */
const ZODIACS = [
  { sign:'Capricorn', symbol:'♑', el:'Earth',  keyword:'Ambitious',   dates:'Dec 22 – Jan 19', eIcon:'🌍' },
  { sign:'Aquarius',  symbol:'♒', el:'Air',    keyword:'Visionary',   dates:'Jan 20 – Feb 18', eIcon:'💨' },
  { sign:'Pisces',    symbol:'♓', el:'Water',  keyword:'Intuitive',   dates:'Feb 19 – Mar 20', eIcon:'💧' },
  { sign:'Aries',     symbol:'♈', el:'Fire',   keyword:'Pioneering',  dates:'Mar 21 – Apr 19', eIcon:'🔥' },
  { sign:'Taurus',    symbol:'♉', el:'Earth',  keyword:'Grounded',    dates:'Apr 20 – May 20', eIcon:'🌍' },
  { sign:'Gemini',    symbol:'♊', el:'Air',    keyword:'Curious',     dates:'May 21 – Jun 20', eIcon:'💨' },
  { sign:'Cancer',    symbol:'♋', el:'Water',  keyword:'Empathetic',  dates:'Jun 21 – Jul 22', eIcon:'💧' },
  { sign:'Leo',       symbol:'♌', el:'Fire',   keyword:'Charismatic', dates:'Jul 23 – Aug 22', eIcon:'🔥' },
  { sign:'Virgo',     symbol:'♍', el:'Earth',  keyword:'Analytical',  dates:'Aug 23 – Sep 22', eIcon:'🌍' },
  { sign:'Libra',     symbol:'♎', el:'Air',    keyword:'Harmonious',  dates:'Sep 23 – Oct 22', eIcon:'💨' },
  { sign:'Scorpio',   symbol:'♏', el:'Water',  keyword:'Intense',     dates:'Oct 23 – Nov 21', eIcon:'💧' },
  { sign:'Sagittarius',symbol:'♐',el:'Fire',   keyword:'Adventurous', dates:'Nov 22 – Dec 21', eIcon:'🔥' },
];

function getZodiac(month, day) {
  const d = [
    [19,'Capricorn'],[18,'Aquarius'],[20,'Pisces'],[19,'Aries'],
    [20,'Taurus'],[20,'Gemini'],[22,'Cancer'],[22,'Leo'],
    [22,'Virgo'],[22,'Libra'],[21,'Scorpio'],[21,'Sagittarius'],
  ];
  const sign = (day <= d[month - 1][0]) ? d[month - 1][1] : d[month % 12][1];
  return ZODIACS.find(z => z.sign === sign);
}

/* ─── NUMBER HELPERS ─── */
function fmt(n) {
  return Math.floor(n).toLocaleString();
}

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0');
}

/* ─── COUNT-UP ANIMATION ─── */
function countUp(el, target, duration = 800) {
  const start   = performance.now();
  const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
  const diff    = target - current;

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(current + diff * ease);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = fmt(target);
  }
  requestAnimationFrame(step);
}

/* ─── AGE CALCULATION ─── */
function calcAge(birth, now) {
  const b = normalizeBirthDate(birth);
  let years  = now.getFullYear()  - b.getFullYear();
  let months = now.getMonth()     - b.getMonth();
  let days   = now.getDate()      - b.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    if (days < 0) {
      months--;
      const prevPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
      days += prevPrevMonth.getDate();
    }
  }
  if (months < 0) { years--; months += 12; }

  const totalMs    = now - birth;
  const totalSec   = totalMs / 1000;
  const totalMin   = totalSec / 60;
  const totalHours = totalMin / 60;
  const totalDays  = totalHours / 24;
  const totalWeeks = totalDays / 7;

  return { years, months, days, totalMs, totalSec, totalMin, totalHours, totalDays, totalWeeks };
}

/* ─── MILESTONES ─── */
const HEARTBEAT_RATE = 1.17;  // per second (~70 bpm)
const BREATH_INTERVAL = 4;    // seconds per breath (~15/min)
const SLEEP_FACTOR = 3;       // sleep ~8h/day = 1/3 of day
const SECONDS_IN_DAY = 86400;
const MOON_CYCLE_DAYS = 29.53;

function calcMilestones(totalSec) {
  return {
    heartbeats: Math.floor(totalSec * HEARTBEAT_RATE),
    breaths:    Math.floor(totalSec / BREATH_INTERVAL),
    sleep:      Math.floor(totalSec / SLEEP_FACTOR / 3600),
    sunrises:   Math.floor(totalSec / SECONDS_IN_DAY),
    moon:       Math.floor(totalSec / (MOON_CYCLE_DAYS * SECONDS_IN_DAY)),
  };
}

/* ─── NEXT BIRTHDAY (FIXED LEAP YEAR) ─── */
function calcNextBirthday(birth, now) {
  const birthNorm = normalizeBirthDate(birth);
  let next = new Date(now.getFullYear(), birthNorm.getMonth(), birthNorm.getDate(),
                      birthNorm.getHours(), birthNorm.getMinutes(), birthNorm.getSeconds());
  if (next <= now) {
    next.setFullYear(now.getFullYear() + 1);
    if (birthNorm.getMonth() === 1 && birthNorm.getDate() === 29 && !isLeapYear(next.getFullYear())) {
      next.setDate(28);
    }
  }
  const diff = next - now;
  const s    = Math.floor(diff / 1000);
  const m    = Math.floor(s / 60);
  const h    = Math.floor(m / 60);
  const d    = Math.floor(h / 24);
  return { d, h: h % 24, m: m % 60, s: s % 60 };
}

/* ─── DYNAMIC FUN FACTS ─── */
function buildFacts(age, totalDays, totalHours) {
  const sleepYears = (totalHours / 3 / 8760).toFixed(1);
  const sunsets    = Math.floor(totalDays);
  const websites   = 2e9;
  const webDays    = 30 * 365; // avg website age ~30yrs but most < your age
  const pct        = Math.min(99, Math.floor((age.years / 35) * 95));
  const pizzas     = Math.floor(totalDays / 3);        // ~3 days per pizza
  const songs      = Math.floor(totalHours * 15);      // 15 songs per hour of music
  const coffees    = Math.floor(totalDays * 1.5);      // ~1.5 coffees/day

  return [
    `You are older than approximately ${pct}% of all currently active websites on the internet.`,
    `You have experienced roughly ${fmt(sunsets)} sunsets in your lifetime.`,
    `You've spent an estimated ${sleepYears} years sleeping — that's a whole life within your life.`,
    `If all your heartbeats were musical notes, you'd have composed ${fmt(Math.floor(age.totalSec * 1.17 / 44100))} minutes of music.`,
    `You've inhaled roughly ${fmt(Math.floor(age.totalSec / 4 * 0.5))} litres of air in your life.`,
    `Assuming average consumption, you've enjoyed around ${fmt(coffees)} cups of coffee or tea.`,
    `Your age in light-seconds: light could have traveled to the Moon and back ${fmt(Math.floor(age.totalSec * 300000 / 768000))} times.`,
    `You've witnessed approximately ${fmt(Math.floor(totalDays / 365.25 * 4))} seasons change since you were born.`,
  ];
}

/* ─── REVEAL ANIMATIONS ─── */
function revealCards() {
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach((c, i) => {
    c.style.animationDelay = `${i * 80}ms`;
    c.classList.add('reveal');
  });
}

function revealSections() {
  const blocks = document.querySelectorAll('.section-block');
  blocks.forEach((b, i) => {
    setTimeout(() => b.classList.add('reveal'), 200 + i * 120);
  });
}

function revealFacts(facts) {
  EL.factsList.innerHTML = '';
  facts.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'fact-item';
    item.setAttribute('role', 'listitem');
    item.innerHTML = `<span class="fact-bullet" aria-hidden="true">◆</span><p class="fact-text">${f}</p>`;
    EL.factsList.appendChild(item);
    setTimeout(() => item.classList.add('reveal'), i * 100);
  });
}

/* ─── BUTTON RIPPLE ─── */
function triggerRipple() {
  btnRipple.classList.remove('animate');
  void btnRipple.offsetWidth; // reflow
  btnRipple.classList.add('animate');
}

/* ─── LIVE UPDATE TICK ─── */
function liveTick() {
  if (!birthDate) return;
  const now  = new Date();
  const age  = calcAge(birthDate, now);
  const mil  = calcMilestones(age.totalSec);
  const bday = calcNextBirthday(birthDate, now);

  // Seconds live — update directly (no count-up to keep it snappy)
  EL.seconds.textContent = fmt(age.totalSec);
  EL.minutes.textContent = fmt(age.totalMin);
  EL.hours.textContent   = fmt(age.totalHours);

  // Milestones (live) - these don't need aria-live
  EL.heartbeats.textContent = fmt(mil.heartbeats);
  EL.breaths.textContent    = fmt(mil.breaths);
  EL.sleep.textContent      = fmt(mil.sleep);
  EL.sunrises.textContent   = fmt(mil.sunrises);
  EL.moon.textContent       = fmt(mil.moon);

  // Birthday countdown
  EL.bdayDays.textContent  = pad(bday.d);
  EL.bdayHours.textContent = pad(bday.h);
  EL.bdayMins.textContent  = pad(bday.m);
  EL.bdaySecs.textContent  = pad(bday.s);
}

/* ─── CLEAR/RESET ─── */
function resetCalculator() {
  clearInterval(liveTimer);
  liveTimer = null;
  birthDate = null;

  dobInput.value = '';
  tobInput.value = '';
  dobInput.removeAttribute('aria-invalid');
  dobInput.style.borderColor = '';
  dobInput.style.boxShadow = '';

  emptyState.style.display = 'flex';
  emptyState.style.opacity = '1';
  emptyState.style.transform = 'scale(1)';

  resultsWrap.classList.add('hidden');

  calcBtn.classList.remove('loading', 'success');
  calcBtn.disabled = false;
  btnText.textContent = 'Calculate My Age';

  document.querySelectorAll('.stat-card, .section-block, .fact-item').forEach(el => {
    el.classList.remove('reveal');
    el.style.animationDelay = '';
  });

  EL.factsList.innerHTML = '';
}

/* ─── MAIN CALCULATE ─── */
function calculate() {
  const dobVal = dobInput.value;
  if (!dobVal) {
    dobInput.focus();
    dobInput.setAttribute('aria-invalid', 'true');
    dobInput.style.borderColor = 'var(--accent-red)';
    dobInput.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.2)';
    setTimeout(() => {
      dobInput.removeAttribute('aria-invalid');
      dobInput.style.borderColor = '';
      dobInput.style.boxShadow   = '';
    }, 2000);
    return;
  }

  // Build birth date
  const tobVal = tobInput.value;
  let h = 0, m = 0;
  if (tobVal) {
    const parts = tobVal.split(':').map(Number);
    if (parts.length === 2 && parts[0] >= 0 && parts[0] <= 23 && parts[1] >= 0 && parts[1] <= 59) {
      [h, m] = parts;
    }
  }
  const [yr, mo, dy] = dobVal.split('-').map(Number);
  const birth = new Date(yr, mo - 1, dy, h, m, 0);

  if (birth > new Date()) {
    dobInput.setAttribute('aria-invalid', 'true');
    dobInput.style.borderColor = 'var(--accent-red)';
    dobInput.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.2)';
    setTimeout(() => {
      dobInput.removeAttribute('aria-invalid');
      dobInput.style.borderColor = '';
      dobInput.style.boxShadow   = '';
    }, 2000);
    return;
  }

  birthDate = birth;

  // Button loading state - minimal delay
  calcBtn.classList.add('loading');
  calcBtn.disabled = true;
  triggerRipple();

  setTimeout(() => {
    calcBtn.classList.remove('loading');
    calcBtn.classList.add('success');
    btnText.textContent = '✓ Calculated';
    calcBtn.disabled = false;

    setTimeout(() => {
      calcBtn.classList.remove('success');
      btnText.textContent = 'Recalculate';
    }, 1500);

    // Show results, hide empty state
    emptyState.style.opacity = '0';
    emptyState.style.transform = 'scale(0.95)';
    setTimeout(() => emptyState.style.display = 'none', 300);

    resultsWrap.classList.remove('hidden');

    const now = new Date();
    const age = calcAge(birth, now);
    const mil = calcMilestones(age.totalSec);

    // Count-up animations
    countUp(EL.years,  age.years,       800);
    countUp(EL.months, age.months,      700);
    countUp(EL.weeks,  age.totalWeeks,  650);
    countUp(EL.days,   age.totalDays,   600);
    countUp(EL.hours,  age.totalHours,  550);
    countUp(EL.minutes,age.totalMin,    500);
    countUp(EL.seconds,age.totalSec,    450);

    revealCards();
    revealSections();

    // Zodiac
    const zodiac = getZodiac(mo, dy);
    if (zodiac) {
      EL.zodiacSymbol.textContent  = zodiac.symbol;
      EL.zodiacName.textContent    = zodiac.sign;
      EL.zodiacDates.textContent   = zodiac.dates;
      EL.elementSymbol.textContent = zodiac.eIcon;
      EL.elementName.textContent   = zodiac.el;
      EL.zodiacKW.textContent      = zodiac.keyword;
    }

    // Fun facts
    const facts = buildFacts(age, age.totalDays, age.totalHours);
    revealFacts(facts);

    // Start live timer
    clearInterval(liveTimer);
    liveTimer = setInterval(liveTick, 1000);
    liveTick();

    // Focus management — move focus to results
    const resultsHeader = resultsWrap.querySelector('.results-title');
    if (resultsHeader) resultsHeader.setAttribute('tabindex', '-1');
    if (resultsHeader) resultsHeader.focus({ preventScroll: true });

    // Scroll to results on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => resultsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    }

  }, 300); // minimal loading delay
}

/* ─── EVENT LISTENERS ─── */
calcBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', resetCalculator);

dobInput.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
tobInput.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });

// Set max date to today
dobInput.max = new Date().toISOString().split('T')[0];

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
const scrollReveal = (function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  const mo = new MutationObserver(() => {
    if (!resultsWrap.classList.contains('hidden')) {
      document.querySelectorAll('.section-block').forEach(b => obs.observe(b));
      mo.disconnect();
    }
  });
  mo.observe(resultsWrap, { attributes: true, attributeFilter: ['class'] });
  return { mo, obs };
})();

/* ─── CLEANUP ON UNLOAD ─── */
window.addEventListener('beforeunload', () => {
  clearInterval(liveTimer);
  if (animationId) cancelAnimationFrame(animationId);
  if (scrollReveal && scrollReveal.mo) scrollReveal.mo.disconnect();
  if (scrollReveal && scrollReveal.obs) scrollReveal.obs.disconnect();
});