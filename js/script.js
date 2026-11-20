// ---------- Typing effect ----------
const roles = [
  "Maintenance & Reliability",
  "Inspection & Condition Monitoring",
  "Thermal Systems & Heat Transfer",
  "SolidWorks · AutoCAD · MATLAB",
];
const typedEl = document.getElementById("typed");
let ri = 0, ci = 0, deleting = false;
function typeLoop() {
  const word = roles[ri];
  typedEl.textContent = word.slice(0, ci);
  if (!deleting && ci < word.length) ci++;
  else if (deleting && ci > 0) ci--;
  else if (!deleting) { deleting = true; return setTimeout(typeLoop, 1600); }
  else { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menuBtn.classList.remove("open");
  navLinks.classList.remove("open");
}));

// ---------- Reveal on scroll + counters ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");
    e.target.querySelectorAll?.("[data-count]").forEach(countUp);
    if (e.target.matches("[data-count]")) countUp(e.target);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

function countUp(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 250); };
  step();
}

// ---------- Active nav link (scroll spy) ----------
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];
const toTop = document.getElementById("toTop");
const gears = [...document.querySelectorAll(".bg .gear")];

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  let current = "";
  sections.forEach(s => { if (y >= s.offsetTop - 160) current = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  toTop.classList.toggle("show", y > 500);
  // Gears rotate with scroll, meshing in opposite directions
  gears[0].style.transform = `rotate(${y * 0.15}deg)`;
  gears[1].style.transform = `rotate(${-y * 0.255 + 11}deg)`;
  gears[2].style.transform = `rotate(${y * 0.2}deg)`;
}, { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

// ---------- Cursor glow ----------
const glow = document.getElementById("cursorGlow");
window.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ---------- Skill filter ----------
const tabs = document.querySelectorAll("#skillTabs .tab");
const chips = document.querySelectorAll("#skillChips .chip");
tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  const f = tab.dataset.filter;
  chips.forEach(c => c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f));
}));

// ---------- Project cards: 3D tilt + modal ----------
const projects = [
  {
    tag: "Final Year Project",
    title: "TEG & PCM-Based Hybrid Heat Exchanger for Solar Panels",
    desc: "A hybrid thermal management system designed to reduce solar panel operating temperature and improve performance, with real-time monitoring and data logging.",
    points: [
      "Built the system using thermoelectric generator (TEG) modules, paraffin phase change material (PCM), heat sinks and cooling fans.",
      "Integrated temperature sensors with an Arduino microcontroller for real-time monitoring.",
      "Displayed live readings on an LCD and logged data to a microSD card to monitor system performance.",
    ],
    tools: ["Arduino", "TEG Modules", "Paraffin PCM", "Temperature Sensors", "LCD", "microSD Logging"],
  },
  {
    tag: "HVAC",
    title: "HVAC System Design",
    desc: "HVAC system design for the Mechanical Engineering department building.",
    points: [
      "Designed the HVAC system using HAP (Hourly Analysis Program) software.",
      "Applied cooling and heating load calculation methods to size the system.",
    ],
    tools: ["HAP", "Load Calculation", "Thermodynamics", "Heat Transfer"],
  },
  {
    tag: "CAD Design",
    title: "Vehicle Transmission System",
    desc: "3D design of a vehicle transmission system.",
    points: ["Designed and modelled the vehicle transmission system in SolidWorks, applying machine design principles."],
    tools: ["SolidWorks", "Machine Design"],
  },
  {
    tag: "Prototyping",
    title: "Glass Prototype",
    desc: "Design-to-manufacture prototype project.",
    points: ["Designed the prototype in AutoCAD.", "Manufactured the prototype using 3D printing."],
    tools: ["AutoCAD", "3D Printing"],
  },
];

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
function openModal(i) {
  const p = projects[i];
  modalBody.innerHTML = `
    <span class="pill">${p.tag}</span>
    <h3>${p.title}</h3>
    <p class="muted">${p.desc}</p>
    <ul>${p.points.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="p-tags">${p.tools.map(t => `<span>${t}</span>`).join("")}</div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("click", () => openModal(+card.dataset.project));
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(800px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 10}deg) translateY(-4px)`;
    card.style.setProperty("--mx", x * 100 + "%");
    card.style.setProperty("--my", y * 100 + "%");
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
