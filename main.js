/* =============================================
   RODRIGUE BOKO — PORTFOLIO JS
   Particles, typewriter, counters, scroll reveal
   ============================================= */

// ---- TYPEWRITER ----
const titles = [
  'Biostatisticien RWE',
  'Data Scientist en Santé',
  'Analyste SNDS & REIN',
  'Spécialiste R Shiny',
  'Épidémiologiste quantitatif'
];

let titleIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById('typedTitle');

function typewriter() {
  const current = titles[titleIndex];
  if (!deleting) {
    typedEl.innerHTML = current.substring(0, charIndex + 1) + '<span class="cursor"></span>';
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typewriter, 2000);
      return;
    }
  } else {
    typedEl.innerHTML = current.substring(0, charIndex - 1) + '<span class="cursor"></span>';
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }
  setTimeout(typewriter, deleting ? 50 : 80);
}
typewriter();

// ---- PARTICLE CANVAS ----
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    const palette = ['#00d4b4', '#4f8ef7', '#8b5cf6'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Create particles
for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00d4b4';
        ctx.globalAlpha = (1 - dist / maxDist) * 0.08;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animate);
}
animate();

// Stop animation when hero is not visible (perf)
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) {
      cancelAnimationFrame(animFrame);
    } else {
      animate();
    }
  });
}, { threshold: 0.1 });
heroObserver.observe(document.getElementById('hero'));

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(8,13,26,0.95)';
  } else {
    navbar.style.background = 'rgba(8,13,26,0.8)';
  }
});

// ---- BURGER MENU ----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ---- SKILL BARS ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.dataset.w;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-group').forEach(sg => skillObserver.observe(sg));

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll(
  '.exp-card, .tl-card, .proj-card, .contact-card, .skill-group, .cert-box, .about-card, .tag-cloud'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- ACTIVE NAV LINKS ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        a.style.background = '';
      });
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) {
        active.style.color = '#00d4b4';
        active.style.background = 'rgba(0,212,180,0.08)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

// ---- SMOOTH HOVER TILT on project cards ----
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `translateY(-4px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
