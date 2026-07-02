/* ==========================================================================
   CASE FILE — script.js
   Everything is organized by section: EDIT ME data, scene manager,
   per-scene controllers, ambient effects, then easter eggs.
   ========================================================================== */

/* ==========================================================================
   1. EDIT ME — all content lives here. Swap photos/captions freely.
   ========================================================================== */

const CASE_TARGET_NAME = "Jamaica";
const CASE_TARGET_ALIAS = "Lovey";

// Boot sequence log lines, shown one at a time with a typewriter effect.
const bootLines = [
  "Initializing...",
  "Establishing secure connection...",
  "Scanning visitor...",
  "Identity found...",
  "Access request sent...",
  "Decrypting archive...",
  "Access Granted."
];

// Fake progress jumps — intentionally non-linear per the brief.
const bootProgressSteps = [12, 46, 31, 68, 89, 100];

// Evidence shown one-at-a-time in Scene 3/4. Add or remove freely —
// everything downstream (progress counters, discovery field) adapts.
const evidence = [
  {
    image: "assets/photos/photo1.jpg",
    caption: "Subject ay nasa observation, Cute phase 1"
  },
  {
    image: "assets/photos/photo2.jpg",
    caption: "Starting to show midlevel Cuteness Aura"
  },
  {
    image: "assets/photos/photo3.jpg",
    caption: "Bwhahahhahah, Sleepwell lovey hahah, (Gero raba Kayka, ni sleep ka una hahaha)"
  },
  {
    image: "assets/photos/photo4.jpg",
    caption: "High Alert, the Subject itself has reach its peak Cuteness"
  },
  {
    image: "assets/photos/photo5.jpg",
    caption: "The Evidence suggest thatthe Subject is proven Guilty cuz of cuteness hahaha"
  }
];

// Failure scene copy.
const failureLines = [
  "Too many Cute Smiles detected...",
  "Attempting recovery..."
];

/* ==========================================================================
   2. STATE + SCENE MANAGER
   ========================================================================== */

const scenes = [
  "scene-landing",
  "scene-boot",
  "scene-archive",
  "scene-discovery",
  "scene-failure",
  "scene-report",
  "scene-ending"
];

let currentSceneId = null;

function goToScene(id) {
  const outgoing = document.getElementById(currentSceneId);
  const incoming = document.getElementById(id);
  if (!incoming) return;

  if (outgoing && outgoing !== incoming) {
    outgoing.classList.add("is-exiting");
    outgoing.classList.remove("is-active");
    setTimeout(() => outgoing.classList.remove("is-exiting"), 900);
  }

  incoming.classList.add("is-active");
  currentSceneId = id;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

/* ==========================================================================
   3. SCENE 1 — LANDING
   ========================================================================== */

function initLanding() {
  const btn = document.getElementById("btn-start");
  const ripple = btn.querySelector(".btn-ripple");

  btn.addEventListener("click", () => {
    ripple.classList.remove("firing");
    // Force reflow so the animation can restart if clicked twice quickly.
    void ripple.offsetWidth;
    ripple.classList.add("firing");

    setTimeout(() => {
      goToScene("scene-boot");
      runBootSequence();
    }, 420);
  });

  goToScene("scene-landing");
}

/* ==========================================================================
   4. SCENE 2 — BOOT SEQUENCE
   ========================================================================== */

function runBootSequence() {
  const log = document.getElementById("boot-log");
  const fill = document.getElementById("boot-bar-fill");
  const percentLabel = document.getElementById("boot-percent");
  log.innerHTML = "";

  let lineIndex = 0;
  let progressIndex = 0;

  function typeNextLine() {
    if (lineIndex >= bootLines.length) {
      setTimeout(() => {
        goToScene("scene-archive");
        runArchiveScene();
      }, 900);
      return;
    }

    const lineEl = document.createElement("span");
    lineEl.className = "boot-line";
    if (bootLines[lineIndex] === "Access Granted.") {
      lineEl.classList.add("granted");
    }
    log.appendChild(lineEl);

    typewriter(lineEl, bootLines[lineIndex], 26, () => {
      lineIndex++;
      // advance the fake progress bar out of sync with the lines, per the brief
      if (progressIndex < bootProgressSteps.length) {
        const pct = bootProgressSteps[progressIndex];
        fill.style.width = pct + "%";
        percentLabel.textContent = pct + "%";
        progressIndex++;
      }
      setTimeout(typeNextLine, 260);
    });
  }

  typeNextLine();
}

/**
 * Types `text` into `el` one character at a time, calling `onDone` after.
 * Appends a blinking cursor span while typing, removed on completion.
 */
function typewriter(el, text, speed, onDone) {
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  let i = 0;

   // Auto-scrolls the letter box to the very bottom as new text streams in
const letterBox = document.getElementById("letter-box");
if (letterBox) {
  letterBox.scrollTop = letterBox.scrollHeight;
}


  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      setTimeout(step, speed);
    } else {
      cursor.remove();
      if (onDone) onDone();
    }
  }
  step();
}

/* ==========================================================================
   5. SCENE 3/4 — ARCHIVE / INVESTIGATION
   ========================================================================== */

let archiveIndex = 0;

function runArchiveScene() {
  const tag = document.getElementById("archive-tag");
  const title = document.getElementById("archive-title");
  const stage = document.getElementById("evidence-stage");
  const totalEl = document.getElementById("archive-progress-total");
  const nextBtn = document.getElementById("btn-next-evidence");

  archiveIndex = 0;
  totalEl.textContent = evidence.length;
  tag.classList.remove("is-visible");
  void tag.offsetWidth;
  tag.style.animation = "none";
  void tag.offsetWidth;
  tag.style.animation = "";

  typewriter(title, "Evidence #001", 40);

  stage.innerHTML = "";
  nextBtn.classList.remove("is-visible");

  showEvidenceCard(archiveIndex);

  nextBtn.onclick = () => {
    archiveIndex++;
    if (archiveIndex < evidence.length) {
      showEvidenceCard(archiveIndex);
    } else {
      goToScene("scene-discovery");
      runDiscoveryScene();
    }
  };
}

function showEvidenceCard(index) {
  const stage = document.getElementById("evidence-stage");
  const currentEl = document.getElementById("archive-progress-current");
  const title = document.getElementById("archive-title");
  const nextBtn = document.getElementById("btn-next-evidence");
  const item = evidence[index];

  nextBtn.classList.remove("is-visible");
  currentEl.textContent = index;

  const label = "Evidence #" + String(index + 1).padStart(3, "0");
  title.textContent = "";
  typewriter(title, label, 40);

  const card = document.createElement("div");
  card.className = "evidence-card";
  card.innerHTML = `
    <div class="evidence-number">FILE ${String(index + 1).padStart(3, "0")}</div>
    <div class="evidence-photo-frame">
      <img src="${item.image}" alt="Evidence photo ${index + 1}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27500%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27%23151518%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 fill=%27%23555%27 font-family=%27monospace%27 font-size=%2716%27 text-anchor=%27middle%27%3Ephoto missing%3C/text%3E%3C/svg%3E'">
      <div class="evidence-scan-line"></div>
    </div>
    <div class="evidence-caption"></div>
  `;

  stage.innerHTML = "";
  stage.appendChild(card);

  // Trigger the blur-to-sharp reveal shortly after mount.
  requestAnimationFrame(() => {
    setTimeout(() => card.classList.add("is-revealed"), 350);
  });

  const captionEl = card.querySelector(".evidence-caption");
  setTimeout(() => {
    typewriter(captionEl, item.caption, 22, () => {
      currentEl.textContent = index + 1;
      nextBtn.classList.add("is-visible");
      nextBtn.textContent = index + 1 < evidence.length ? "Next Evidence \u2192" : "Continue Investigation \u2192";
    });
  }, 1500);
}

/* ==========================================================================
   6. SCENE 5 — INTERACTIVE DISCOVERY
   ========================================================================== */

let discoveryRevealedCount = 0;

function runDiscoveryScene() {
  const field = document.getElementById("discovery-field");
  const sub = document.getElementById("discovery-sub");
  field.innerHTML = "";
  discoveryRevealedCount = 0;
  sub.textContent = `0 / ${evidence.length} clues uncovered`;

  const fieldWidth = field.clientWidth || 900;
  const fieldHeight = field.clientHeight || 460;
  const nodeSize = window.innerWidth <= 640 ? 84 : 108;
  const padding = nodeSize * 0.6;

  evidence.forEach((item, index) => {
    const node = document.createElement("div");
    node.className = "discovery-node";
    node.tabIndex = 0;
    node.setAttribute("role", "button");
    node.setAttribute("aria-label", "Reveal clue " + (index + 1));

    const left = padding + Math.random() * Math.max(1, fieldWidth - nodeSize - padding * 2);
    const top = padding + Math.random() * Math.max(1, fieldHeight - nodeSize - padding * 2);
    node.style.left = left + "px";
    node.style.top = top + "px";

    // Gentle random drift, different per node so they don't move in unison.
    const dx1 = (Math.random() * 24 - 12).toFixed(1) + "px";
    const dy1 = (Math.random() * 24 - 12).toFixed(1) + "px";
    const dx2 = (Math.random() * 24 - 12).toFixed(1) + "px";
    const dy2 = (Math.random() * 24 - 12).toFixed(1) + "px";
    node.style.setProperty("--dx1", dx1);
    node.style.setProperty("--dy1", dy1);
    node.style.setProperty("--dx2", dx2);
    node.style.setProperty("--dy2", dy2);
    node.style.animationDuration = (5 + Math.random() * 4).toFixed(1) + "s";
    node.style.animationDelay = (-Math.random() * 4).toFixed(1) + "s";

    node.innerHTML = `
      <img src="${item.image}" alt="Clue ${index + 1}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27%23151518%27/%3E%3C/svg%3E'">
      <div class="discovery-node-caption">${item.caption}</div>
    `;

    function reveal() {
      if (node.classList.contains("is-revealed")) return;
      node.classList.add("is-revealed");
      discoveryRevealedCount++;
      sub.textContent = `${discoveryRevealedCount} / ${evidence.length} clues uncovered`;

      if (discoveryRevealedCount >= evidence.length) {
        setTimeout(() => {
          goToScene("scene-failure");
          runFailureScene();
        }, 1400);
      }
    }

    node.addEventListener("mouseenter", reveal);
    node.addEventListener("click", reveal);
    node.addEventListener("focus", reveal);
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reveal();
      }
    });

    // Hidden easter egg: double-clicking the last photo plays a bonus pulse.
    if (index === evidence.length - 1) {
      node.addEventListener("dblclick", () => playHiddenPulse(node));
    }

    field.appendChild(node);
  });
}

function playHiddenPulse(node) {
  node.animate(
    [
      { transform: node.style.transform + " scale(1)", filter: "brightness(1)" },
      { transform: node.style.transform + " scale(1.25)", filter: "brightness(1.4)" },
      { transform: node.style.transform + " scale(1)", filter: "brightness(1)" }
    ],
    { duration: 700, easing: "cubic-bezier(0.34,1.56,0.64,1)" }
  );
  showSecretToast("A little extra spark, just for you \u2728");
}

/* ==========================================================================
   7. SCENE 6 — SYSTEM FAILURE
   ========================================================================== */

function runFailureScene() {
  const sceneEl = document.getElementById("scene-failure");
  const errorEl = document.getElementById("failure-error");
  const line1 = document.getElementById("failure-line-1");
  const line2 = document.getElementById("failure-line-2");
  const bars = document.getElementById("glitch-bars");

  line1.classList.remove("is-visible");
  line2.classList.remove("is-visible");
  errorEl.style.opacity = "0";
  bars.innerHTML = "";

  // Build a handful of glitch bars for a scanline-tear look.
  for (let i = 0; i < 10; i++) {
    const bar = document.createElement("div");
    bar.className = "glitch-bar";
    bar.style.top = Math.random() * 100 + "%";
    bar.style.height = 2 + Math.random() * 10 + "px";
    bars.appendChild(bar);
  }

  setTimeout(() => {
    errorEl.style.opacity = "1";
    sceneEl.classList.add("glitching");
    setTimeout(() => sceneEl.classList.remove("glitching"), 1500);
  }, 200);

  setTimeout(() => line1.classList.add("is-visible"), 1200);
  setTimeout(() => line2.classList.add("is-visible"), 2400);

  setTimeout(() => {
    goToScene("scene-report");
    runReportScene();
  }, 4200);
}

/* ==========================================================================
   8. SCENE 7 — FINAL REPORT
   ========================================================================== */

function runReportScene() {
  const target = document.getElementById("report-target");
  const alias = document.getElementById("report-alias");
  const rows = document.querySelectorAll("#scene-report .report-row");
  const stamp = document.getElementById("guilty-stamp");
  const sentenceBlock = document.getElementById("report-sentence");

  target.textContent = CASE_TARGET_NAME;
  alias.innerHTML = `<span class="redacted">${CASE_TARGET_ALIAS}</span>`;

  rows.forEach((row) => row.classList.remove("is-visible"));
  stamp.classList.remove("slam");
  stamp.style.opacity = "0";
  sentenceBlock.classList.remove("is-visible");

  rows.forEach((row, i) => {
    setTimeout(() => row.classList.add("is-visible"), 300 + i * 260);
  });

  // Declassify the alias redaction shortly after rows finish appearing.
  const aliasReveal = 300 + rows.length * 260 + 500;
  setTimeout(() => {
    const redactedSpan = alias.querySelector(".redacted");
    if (redactedSpan) redactedSpan.classList.add("declassified");
  }, aliasReveal);

  const stampDelay = aliasReveal + 900;
  setTimeout(() => {
    stamp.style.opacity = "1";
    stamp.classList.add("slam");
  }, stampDelay);

  const sentenceDelay = stampDelay + 900;
  setTimeout(() => {
    sentenceBlock.classList.add("is-visible");
  }, sentenceDelay);

  setTimeout(() => {
    goToScene("scene-ending");
    runEndingScene();
  }, sentenceDelay + 3200);
}

/* ==========================================================================
   9. SCENE 8 — ENDING / COLLAGE
   ========================================================================== */

function runEndingScene() {
  const sceneEl = document.getElementById("scene-ending");
  const stage = document.getElementById("collage-stage");
  const acceptBtn = document.getElementById("btn-accept");
  const finalBlock = document.getElementById("ending-final");
  const letterText = document.getElementById("letter-text"); // Locates the letter text span

  sceneEl.classList.remove("warm");
  finalBlock.classList.remove("is-visible");
  acceptBtn.classList.remove("is-hidden");
  stage.innerHTML = "";
  if (letterText) letterText.textContent = ""; 

  const positions = collagePositions(evidence.length);

  evidence.forEach((item, index) => {
    const photo = document.createElement("div");
    photo.className = "collage-photo";
    photo.style.left = "50%";
    photo.style.top = "50%";
    photo.style.transform = "translate(-50%, -50%) scale(0.4) rotate(0deg)";
    photo.innerHTML = `<img src="${item.image}" alt="" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27130%27 height=%27130%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27%23151518%27/%3E%3C/svg%3E'">`;
    stage.appendChild(photo);

    const pos = positions[index];
    setTimeout(() => {
      photo.style.left = pos.left;
      photo.style.top = pos.top;
      photo.style.transform = `translate(-50%, -50%) scale(1) rotate(${pos.rotate}deg)`;
      photo.classList.add("landed");
    }, 150 + index * 180);
  });

  setTimeout(() => {
    sceneEl.classList.add("warm");
    startConfetti();
  }, 300 + evidence.length * 180);

  // This is the click event that triggers the letter
  acceptBtn.onclick = () => {
    acceptBtn.classList.add("is-hidden"); // Hides the button
    finalBlock.classList.add("is-visible"); // Reveals the final text and the letter box
    burstConfetti();

    // YOUR LETTER GOES HERE
    const loveLetterParagraph = `Gulat ka no hahhhahha, CUte mo talaga, gero man kay ka, gika tulgan ramn ko nimo hahahha, okay rako ana ois, hahahhbzta  ikaw, ana man jud ka haha...... I love you my labs, my lovey babe, my lovey hehheheh, special ka sakin hehehhe, I love you hehhehe. Good night.. stay safe kanunay lovey I always pray for you my loves hehehe, I love You, hopefully no that magpadayun jud ta ba hahh 3 months nalang kuwang, haahahabzta, choya sa hahahhahahehehe, Thank u my lovey, kaayu hhehehhe`;

    // Starts the typing effect 0.6 seconds after the button is clicked
    setTimeout(() => {
      if (letterText) {
        typewriter(letterText, loveLetterParagraph, 35);
      }
    }, 600);
  };
}
function collagePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    
    // 1. Widen the circle horizontally so photos spread out further left/right
    const radiusX = 32 + (window.innerWidth <= 640 ? 0 : 6); 
    const radiusY = 18; 
    
    // 2. CHANGE '46' TO '30' or '28' to shift the whole circle UPWARDS
    const left = 50 + Math.cos(angle) * radiusX + (Math.random() * 4 - 2);
    const top = 30 + Math.sin(angle) * radiusY + (Math.random() * 4 - 2); // Shuffled up!
    
    positions.push({
      left: left + "%",
      top: top + "%",
      rotate: (Math.random() * 16 - 8).toFixed(1)
    });
  }
  return positions;
}

/* ==========================================================================
   10. AMBIENT — particle canvas (archive/discovery scenes)
   ========================================================================== */

function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    const count = window.innerWidth < 640 ? 26 : 50;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 1.6,
      vy: 0.08 + Math.random() * 0.18,
      vx: (Math.random() - 0.5) * 0.06,
      alpha: 0.1 + Math.random() * 0.3
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -10) {
        p.y = window.innerHeight + 10;
        p.x = Math.random() * window.innerWidth;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,245,245,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  seed();
  tick();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
}

/* ==========================================================================
   11. AMBIENT — mouse spotlight
   ========================================================================== */

function initSpotlight() {
  const spotlight = document.getElementById("spotlight");
  const spotlightScenes = new Set(["scene-archive", "scene-discovery"]);

  document.addEventListener("mousemove", (e) => {
    if (!spotlightScenes.has(currentSceneId)) {
      spotlight.classList.remove("active");
      return;
    }
    spotlight.classList.add("active");
    spotlight.style.setProperty("--sx", e.clientX + "px");
    spotlight.style.setProperty("--sy", e.clientY + "px");
  });
}

/* ==========================================================================
   12. AMBIENT — confetti (ending scene)
   ========================================================================== */

let confettiCtx, confettiParticles = [], confettiRunning = false;

function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  confettiCtx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  spawnConfetti(60);
  if (!confettiRunning) {
    confettiRunning = true;
    confettiTick();
  }
}

function spawnConfetti(count) {
  const colors = ["#ff3d71", "#ffb37a", "#fff3e8", "#7fffa0"];
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 200,
      w: 5 + Math.random() * 5,
      h: 8 + Math.random() * 8,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      vy: 1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 1.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0
    });
  }
}

function burstConfetti() {
  spawnConfetti(90);
}

function confettiTick() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiParticles.forEach((p) => {
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.y * 0.02) * 0.4;
    p.rot += p.vRot;
    p.life++;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rot * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });

  confettiParticles = confettiParticles.filter((p) => p.y < window.innerHeight + 40);
  requestAnimationFrame(confettiTick);
}

/* ==========================================================================
   13. EASTER EGGS
   ========================================================================== */

function showSecretToast(message) {
  const toast = document.getElementById("secret-toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showSecretToast._t);
  showSecretToast._t = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function initEasterEggs() {
  // 1. Click the archive title 5 times to unlock "developer mode."
  let titleClicks = 0;
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "archive-title") {
      titleClicks++;
      if (titleClicks === 5) {
        document.getElementById("dev-mode-badge").classList.add("is-visible");
        showSecretToast("Developer Mode unlocked. You found the seams. \ud83d\udc7e");
      }
    }
  });

  // 2. Typing "iloveyou" anywhere reveals a secret message.
  // 4. Konami Code unlocks "Secret Archive Unlocked."
  const secretWord = "iloveyou";
  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let wordBuffer = "";
  let konamiBuffer = [];

  document.addEventListener("keydown", (e) => {
    // secret word tracking (letters only)
    if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
      wordBuffer += e.key.toLowerCase();
      wordBuffer = wordBuffer.slice(-secretWord.length);
      if (wordBuffer === secretWord) {
        showSecretToast(`${CASE_TARGET_ALIAS}, this whole thing was built for you. \u2764\ufe0f`);
      }
    }

    // konami code tracking
    konamiBuffer.push(e.key);
    konamiBuffer = konamiBuffer.slice(-konami.length);
    if (konami.every((k, i) => konamiBuffer[i] === k)) {
      showSecretToast("Secret Archive Unlocked.");
    }
  });
}

/* ==========================================================================
   14. INIT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initSpotlight();
  initEasterEggs();
  initLanding();
});
