/* ============================================================
   PORTFOLIO IRSA AHMAD — script.js  v4
   ============================================================ */

// ============================================================
// DONNÉES : associations compétences → projets
// ============================================================
const SKILLS_DATA = {
  admin: {
    title: "Administrer les réseaux et l'Internet",
    desc: "Conception, configuration, administration et sécurisation des infrastructures réseau. Gestion des équipements réseau, des serveurs, des systèmes virtualisés ainsi que la supervision et le maintien en condition opérationnelle des architectures réseau d'entreprise.",
    projects: ["vlan","wifi","streaming"]
  },
  connecter: {
    title: "Connecter les entreprises et les usagers",
    desc: "Déploiement et intégration des solutions de télécommunications permettant de relier les entreprises, les utilisateurs et les différents réseaux de communication. Installation et maintenance des infrastructures cuivre, fibre, Wi-Fi et mobiles.",
    projects: ["vlan","wifi"]
  },
  creer: {
    title: "Créer des outils et applications informatiques pour les R&T",
    desc: "Développement d'outils logiciels et d'applications destinés à l'administration, l'automatisation et l'exploitation des réseaux et systèmes de télécommunications. Programmation, scripts d'automatisation et développement web.",
    projects: ["vlan","streaming"]
  },
  infra: {
    title: "Gérer les infrastructures et les services des réseaux opérateurs",
    desc: "Exploitation, pilotage et maintenance des infrastructures utilisées par les opérateurs télécoms. Supervision des équipements opérateurs, gestion des incidents, suivi des performances réseau et déploiement des services de connectivité.",
    projects: ["wifi"]
  },
  multimedia: {
    title: "Gérer les communications unifiées et la vidéo sur Internet",
    desc: "Mise en place, administration et optimisation des solutions de communication multimédia en environnement professionnel. Téléphonie sur IP, visioconférence, streaming vidéo et collaboration à distance.",
    projects: ["streaming"]
  }
};

const PROJECTS_DATA = {
  streaming: { name: "Système de streaming multimédia virtualisé", meta: "Projet réalisé à 2 — Note : 15/20" },
  vlan:      { name: "Infrastructure réseau VLAN segmentée — Agile", meta: "Projet réalisé à 4 — Note : 17/20" },
  sip:       { name: "Interconnexion 5G ↔ VoIP via Trunk SIP", meta: "Projet réalisé solo — sous supervision du maître de stage" },
  lstm:      { name: "Audit offensif 5G & modèle de détection LSTM", meta: "Projet réalisé en binôme" },
  wifi:      { name: "Wi-Fi sécurisée — RADIUS + MySQL + 2FA", meta: "Projet réalisé à 4 — Note : 18/20" },
  powershell:{ name: "Surveillance réseau — Alerting PowerShell", meta: "Projet réalisé solo" }
};

// ============================================================
// THÈME DARK / LIGHT
// ============================================================
const themeBtn  = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  if (themeIcon) themeIcon.textContent = t === 'light' ? '🌙 Dark' : '☀️ Light';
}
setTheme(localStorage.getItem('theme') || 'dark');
if (themeBtn) themeBtn.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ============================================================
// CURSEUR CUSTOM
// ============================================================
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function anim(){
  tx+=(mx-tx)*.12; ty+=(my-ty)*.12;
  trail.style.left=tx+'px'; trail.style.top=ty+'px';
  requestAnimationFrame(anim);
})();
document.querySelectorAll('a,button,.skill-tag,.project-card,.academic-card,.captcha-checkbox,.filter-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(2.2)';cursor.style.background='var(--accent2)';});
  el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)';cursor.style.background='var(--cursor-color)';});
});

// ============================================================
// SCROLL PROGRESS
// ============================================================
const scrollLine=document.getElementById('scrollLine');
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  if(scrollLine) scrollLine.style.width=pct+'%';
});

// ============================================================
// ANIMATIONS AU SCROLL
// ============================================================
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:.07});
document.querySelectorAll('.fade-in,.timeline-item').forEach(el=>obs.observe(el));

// ============================================================
// EFFET LUMIÈRE CARTES PROJET
// ============================================================
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  });
});

// ============================================================
// NAV ACTIVE LINK
// ============================================================
const navLinks=document.querySelectorAll('.nav-links a');
const navObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) navLinks.forEach(l=>
      l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id));
  });
},{threshold:.35});
document.querySelectorAll('section[id]').forEach(s=>navObs.observe(s));

// ============================================================
// MAIL REVEAL
// ============================================================
document.querySelectorAll('.mail-trigger').forEach(btn=>{
  btn.addEventListener('click',e=>{
    e.preventDefault();
    const r=btn.closest('.mail-btn-wrap')?.querySelector('.mail-reveal');
    if(r) r.classList.toggle('show');
  });
});
document.addEventListener('click',e=>{
  if(!e.target.closest('.mail-btn-wrap'))
    document.querySelectorAll('.mail-reveal').forEach(r=>r.classList.remove('show'));
});

// ============================================================
// PANEL : COMPÉTENCE → PROJETS ASSOCIÉS
// ============================================================
const panel      = document.getElementById('skills-projects-panel');
const panelClose = document.getElementById('panelClose');
const panelTitle = document.getElementById('panelSkillTitle');
const panelDesc  = document.getElementById('panelSkillDesc');
const panelList  = document.getElementById('panelProjectList');

function openPanel(skillKey) {
  const skill = SKILLS_DATA[skillKey];
  if (!skill || !panel) return;
  panelTitle.textContent = skill.title;
  panelDesc.textContent  = skill.desc;
  panelList.innerHTML = skill.projects.map(pk => {
    const p = PROJECTS_DATA[pk];
    return `<div class="panel-project-item">
      <p class="panel-project-name">${p.name}</p>
      <p class="panel-project-meta">${p.meta}</p>
    </div>`;
  }).join('');
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  if (panel) panel.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-skill-key]').forEach(btn => {
  btn.addEventListener('click', () => openPanel(btn.dataset.skillKey));
});
if (panelClose) panelClose.addEventListener('click', closePanel);
if (panel) panel.addEventListener('click', e => { if(e.target===panel) closePanel(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') closePanel(); });

// ============================================================
// FILTRE PROJETS PAR COMPÉTENCE
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card[data-skills]').forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const cardSkills = card.dataset.skills.split(',');
        card.classList.toggle('hidden', !cardSkills.includes(filter));
      }
    });
  });
});

// ============================================================
// CAPTCHA SIMPLE
// ============================================================
const captchaBox = document.getElementById('captchaBox');
const captchaMsg = document.getElementById('captchaMsg');
if (captchaBox) {
  let done=false;
  captchaBox.addEventListener('click',()=>{
    if(done) return; done=true;
    setTimeout(()=>{
      captchaBox.classList.add('checked');
      if(captchaMsg) captchaMsg.textContent='Vérifié ✓';
    }, 700+Math.random()*400);
  });
}
