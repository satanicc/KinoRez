const STORAGE_KEY = "kinorez-di-profile-v1";
const CHECKLIST_KEY = "kinorez-di-checklist-v1";

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    return { ...defaultProfile(), ...JSON.parse(raw) };
  } catch (e) {
    return defaultProfile();
  }
}

function defaultProfile() {
  return {
    classId: "barbarian",
    level: 1,
    resonance: 0,
    paragon: 0,
    hellTier: 0,
    ownedGems: {},
  };
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function loadChecklist() {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveChecklist(state) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
}

let profile = loadProfile();
let checklistState = loadChecklist();

function getClass(id) {
  return CLASSES.find((c) => c.id === id) || CLASSES[0];
}

// ---------- Навигация по вкладкам ----------

function initTabs() {
  const buttons = document.querySelectorAll("nav.tabs button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById(btn.dataset.view).classList.add("active");
      if (btn.dataset.view === "view-recommendations") renderRecommendations();
    });
  });
}

// ---------- Профиль ----------

function renderClassPicker() {
  const container = document.getElementById("class-picker");
  container.innerHTML = "";
  CLASSES.forEach((c) => {
    const pill = document.createElement("div");
    pill.className = "class-pill" + (c.id === profile.classId ? " selected" : "");
    pill.textContent = c.name;
    pill.addEventListener("click", () => {
      profile.classId = c.id;
      renderClassPicker();
    });
    container.appendChild(pill);
  });
}

function renderGemCheckboxes() {
  const container = document.getElementById("gem-checkboxes");
  container.innerHTML = "";
  UNIVERSAL_GEMS.forEach((gem) => {
    const label = document.createElement("label");
    label.className = "check-item";
    const checked = !!profile.ownedGems[gem.id];
    label.innerHTML = `<input type="checkbox" data-gem="${gem.id}" ${checked ? "checked" : ""}/>
      <span><strong>${gem.name}</strong><br/><span class="muted">${gem.why}</span></span>`;
    container.appendChild(label);
  });
  container.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      profile.ownedGems[e.target.dataset.gem] = e.target.checked;
    });
  });
}

function initProfileForm() {
  document.getElementById("level").value = profile.level;
  document.getElementById("resonance").value = profile.resonance;
  document.getElementById("paragon").value = profile.paragon;
  document.getElementById("hellTier").value = profile.hellTier;

  renderClassPicker();
  renderGemCheckboxes();

  document.getElementById("save-profile").addEventListener("click", () => {
    profile.level = parseInt(document.getElementById("level").value, 10) || 0;
    profile.resonance = parseInt(document.getElementById("resonance").value, 10) || 0;
    profile.paragon = parseInt(document.getElementById("paragon").value, 10) || 0;
    profile.hellTier = parseInt(document.getElementById("hellTier").value, 10) || 0;
    saveProfile(profile);
    const status = document.getElementById("save-status");
    status.textContent = "Сохранено ✓";
    setTimeout(() => (status.textContent = ""), 2000);
    renderRecommendations();
  });
}

// ---------- Прокачка ----------

function renderLeveling() {
  const container = document.getElementById("leveling-content");
  container.innerHTML = "";
  LEVELING_ROADMAP.forEach((stage, stageIdx) => {
    const card = document.createElement("div");
    card.className = "card";
    const title = document.createElement("h3");
    title.textContent = stage.stage;
    card.appendChild(title);
    const list = document.createElement("div");
    list.className = "checklist";
    stage.tasks.forEach((task, taskIdx) => {
      const key = `stage-${stageIdx}-task-${taskIdx}`;
      const label = document.createElement("label");
      label.className = "check-item";
      const checked = !!checklistState[key];
      label.innerHTML = `<input type="checkbox" data-key="${key}" ${checked ? "checked" : ""}/> <span>${task}</span>`;
      list.appendChild(label);
    });
    card.appendChild(list);
    container.appendChild(card);
  });
  container.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      checklistState[e.target.dataset.key] = e.target.checked;
      saveChecklist(checklistState);
    });
  });
}

// ---------- Снаряжение ----------

function renderGearing() {
  const container = document.getElementById("gearing-content");
  container.innerHTML = "";
  GEARING_PRINCIPLES.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${p.title}</h3><p>${p.text}</p>`;
    container.appendChild(card);
  });

  const gemCard = document.createElement("div");
  gemCard.className = "card";
  gemCard.innerHTML = "<h3>Универсальные легендарные камни</h3>";
  UNIVERSAL_GEMS.forEach((g) => {
    const row = document.createElement("p");
    row.innerHTML = `<strong>${g.name}</strong> — ${g.why}`;
    gemCard.appendChild(row);
  });
  container.appendChild(gemCard);
}

// ---------- Классы и сборки ----------

function renderClasses() {
  const nav = document.getElementById("class-nav");
  const detail = document.getElementById("class-detail");
  nav.innerHTML = "";

  CLASSES.forEach((c) => {
    const pill = document.createElement("div");
    pill.className = "class-pill";
    pill.textContent = c.name;
    pill.addEventListener("click", () => {
      nav.querySelectorAll(".class-pill").forEach((p) => p.classList.remove("selected"));
      pill.classList.add("selected");
      renderClassDetail(c.id);
    });
    nav.appendChild(pill);
  });

  // По умолчанию показываем класс из профиля
  renderClassDetail(profile.classId);
  const activePill = Array.from(nav.children).find((_, i) => CLASSES[i].id === profile.classId);
  if (activePill) activePill.classList.add("selected");
}

function renderClassDetail(classId) {
  const c = getClass(classId);
  const detail = document.getElementById("class-detail");
  detail.innerHTML = "";

  const header = document.createElement("div");
  header.className = "card";
  header.innerHTML = `
    <h2>${c.name}</h2>
    <span class="badge">${c.role}</span>
    <span class="badge">Ресурс: ${c.resource}</span>
    <p>${c.summary}</p>
  `;
  detail.appendChild(header);

  const skillsCard = document.createElement("div");
  skillsCard.className = "card";
  skillsCard.innerHTML = "<h3>Ключевые умения</h3><ul>" +
    c.coreSkills.map((s) => `<li>${s}</li>`).join("") + "</ul>";
  detail.appendChild(skillsCard);

  const buildsCard = document.createElement("div");
  buildsCard.className = "card";
  buildsCard.innerHTML = "<h3>Сборки</h3>";
  c.builds.forEach((b) => {
    const block = document.createElement("div");
    block.className = "build-block";
    block.innerHTML = `
      <h4>${b.name}</h4>
      <p class="muted">${b.focus}</p>
      <div class="stat-tags">${b.statPriority.map((s) => `<span>${s}</span>`).join("")}</div>
      <p>${b.notes}</p>
    `;
    buildsCard.appendChild(block);
  });
  detail.appendChild(buildsCard);

  const gearCard = document.createElement("div");
  gearCard.className = "card";
  gearCard.innerHTML = `<h3>На что смотреть в снаряжении</h3><p>${c.gearFocus}</p>`;
  detail.appendChild(gearCard);
}

// ---------- Рекомендации ----------

function renderRecommendations() {
  const container = document.getElementById("recommendations-content");
  container.innerHTML = "";
  const c = getClass(profile.classId);

  const recs = [];

  const summaryCard = document.createElement("div");
  summaryCard.className = "card";
  summaryCard.innerHTML = `
    <h3>Твой профиль</h3>
    <p><strong>Класс:</strong> ${c.name} · <strong>Уровень:</strong> ${profile.level} ·
    <strong>Резонанс:</strong> ${profile.resonance} · <strong>Paragon:</strong> ${profile.paragon} ·
    <strong>Уровень Ада:</strong> ${profile.hellTier}</p>
  `;
  container.appendChild(summaryCard);

  if (profile.level < 60) {
    const stageIdx = profile.level < 20 ? 0 : profile.level < 40 ? 1 : 2;
    const stage = LEVELING_ROADMAP[stageIdx];
    recs.push({
      type: "ok",
      title: `Сейчас твой этап: ${stage.stage}`,
      text: "Открой вкладку «Прокачка» и отметь, что уже сделано — там пошаговый чек-лист для этого этапа.",
    });
  } else {
    recs.push({
      type: "ok",
      title: "Ты на 60 уровне — начался эндгейм",
      text: "Основной прогресс теперь идёт через Резонанс, Paragon и легендарные камни, а не через уровень персонажа.",
    });

    if (profile.hellTier < 1) {
      recs.push({
        type: "warn",
        title: "Ещё не открыт ни один уровень Ада",
        text: "Подними Резонанс через ранги камней и пробуждение снаряжения, затем попробуй открыть Ад I.",
      });
    }

    const missingGems = UNIVERSAL_GEMS.filter((g) => !profile.ownedGems[g.id]);
    if (missingGems.length > 0) {
      recs.push({
        type: "warn",
        title: `Не хватает ${missingGems.length} из ${UNIVERSAL_GEMS.length} универсальных камней`,
        text:
          "Фарми Древний разлом (Elder Rift) и Свод Преисподней (Helliquary): " +
          missingGems.map((g) => g.name).join(", "),
      });
    } else {
      recs.push({
        type: "ok",
        title: "Все базовые универсальные камни собраны",
        text: "Теперь фокусируйся на поднятии их ранга и подборе камней под конкретную сборку класса.",
      });
    }

    if (profile.paragon < 50) {
      recs.push({
        type: "warn",
        title: "Paragon только начат",
        text: "Испытание разлома (Challenge Rift) — лучший источник опыта Paragon после 60 уровня.",
      });
    }
  }

  const buildRec = c.builds[0];
  recs.push({
    type: "ok",
    title: `Рекомендуемая сборка для класса «${c.name}»`,
    text: `${buildRec.name} — ${buildRec.focus}. Приоритет характеристик: ${buildRec.statPriority.join(", ")}.`,
  });

  recs.forEach((r) => {
    const div = document.createElement("div");
    div.className = `rec ${r.type}`;
    div.innerHTML = `<strong>${r.title}</strong><p>${r.text}</p>`;
    container.appendChild(div);
  });
}

// ---------- Инициализация ----------

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initProfileForm();
  renderLeveling();
  renderGearing();
  renderClasses();
  renderRecommendations();
});
