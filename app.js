const form = document.querySelector("#planForm");
const weeksInput = document.querySelector("#weeks");
const weeksOutput = document.querySelector("#weeksOutput");
const metricInputs = document.querySelector("#metricInputs");
const imperialInputs = document.querySelector("#imperialInputs");
const resetButton = document.querySelector("#resetButton");
const installButton = document.querySelector("#installButton");
const offlineToast = document.querySelector("#offlineToast");
const profileNameInput = document.querySelector("#profileName");
const heightCm = document.querySelector("#heightCm");
const weightKg = document.querySelector("#weightKg");
const heightFt = document.querySelector("#heightFt");
const heightIn = document.querySelector("#heightIn");
const weightLb = document.querySelector("#weightLb");
const dietSelect = document.querySelector("#diet");
const profileNameLabel = document.querySelector("#profileNameLabel");
const savedCount = document.querySelector("#savedCount");
const savePlanButton = document.querySelector("#savePlanButton");
const savedPlans = document.querySelector("#savedPlans");

const planTitle = document.querySelector("#planTitle");
const planSubtitle = document.querySelector("#planSubtitle");
const minutesTarget = document.querySelector("#minutesTarget");
const strengthDays = document.querySelector("#strengthDays");
const cardioDays = document.querySelector("#cardioDays");
const recoveryDays = document.querySelector("#recoveryDays");
const weekRoadmap = document.querySelector("#weekRoadmap");
const dayPlan = document.querySelector("#dayPlan");
const guide = document.querySelector("#guide");
const nutrition = document.querySelector("#nutrition");

let deferredInstallPrompt = null;
let currentProfile = null;

const PROFILE_KEY = "pulseplan-profile";
const SAVED_PLANS_KEY = "pulseplan-saved-plans";

const experienceProfiles = {
  new: {
    label: "foundation",
    minutes: 120,
    strength: 2,
    cardio: 3,
    recovery: 2,
    intensity: "easy",
    title: "foundation",
    subtitle:
      "Start with short sessions, controlled reps, and enough recovery to make consistency feel possible.",
    phases: ["Learn the rhythm", "Add time", "Build confidence", "Repeat comfortably"],
    schedule: [
      ["Mon", "Walk + mobility", "20 minutes easy walk, then hip circles and shoulder rolls."],
      ["Tue", "Strength basics", "2 rounds: chair squat, wall push-up, glute bridge, dead bug."],
      ["Wed", "Recovery", "10 minutes stretching or an unhurried walk."],
      ["Thu", "Cardio practice", "Intervals: 1 minute brisk, 2 minutes easy, repeat 7 times."],
      ["Fri", "Strength basics", "2 rounds with slow reps and perfect form."],
      ["Sat", "Long easy movement", "25 to 35 minutes walking, cycling, swimming, or dancing."],
      ["Sun", "Rest", "Light mobility if it feels good."]
    ],
    examples: [
      ["Chair squat", "Sit back to a chair, stand tall, keep knees tracking over toes."],
      ["Wall push-up", "Hands on wall, body straight, lower with control and press away."],
      ["Glute bridge", "Feet flat, squeeze glutes, lift hips without arching the lower back."],
      ["Dead bug", "Brace gently, alternate arms and legs while the back stays quiet."],
      ["Brisk walk", "Move fast enough to breathe deeper while still able to talk."],
      ["Mobility reset", "Move joints through comfortable ranges, never forcing end range."]
    ]
  },
  beginner: {
    label: "builder",
    minutes: 150,
    strength: 3,
    cardio: 3,
    recovery: 1,
    intensity: "moderate",
    title: "builder",
    subtitle:
      "A balanced week with simple strength sessions and cardio that nudges toward common adult activity targets.",
    phases: ["Base week", "Add a set", "Add intervals", "Deload and repeat"],
    schedule: [
      ["Mon", "Full-body strength", "3 rounds: squat, incline push-up, row, hinge, plank."],
      ["Tue", "Zone 2 cardio", "30 minutes at a pace where sentences are possible."],
      ["Wed", "Strength technique", "3 rounds with lighter effort and extra form focus."],
      ["Thu", "Cardio intervals", "5 minute warm-up, 8 x 45 seconds brisk, cool down."],
      ["Fri", "Full-body strength", "Add one rep per set if form stayed crisp."],
      ["Sat", "Choice cardio", "35 to 45 minutes walking, cycling, swimming, or sport."],
      ["Sun", "Recovery", "Easy mobility, breath work, or a relaxed walk."]
    ],
    examples: [
      ["Goblet squat", "Hold a weight at chest height, squat to a steady depth, stand tall."],
      ["Incline push-up", "Hands on bench or counter, ribs down, elbows angled naturally."],
      ["Backpack row", "Hinge slightly, pull a loaded backpack toward lower ribs."],
      ["Hip hinge", "Push hips back, soft knees, keep back long, then stand."],
      ["Forearm plank", "Brace gently, breathe, and stop before form breaks."],
      ["Cardio interval", "Alternate brisk effort with easy recovery without sprinting."]
    ]
  },
  advanced: {
    label: "performance",
    minutes: 210,
    strength: 4,
    cardio: 3,
    recovery: 1,
    intensity: "progressive",
    title: "performance",
    subtitle:
      "Higher training density with progressive overload, conditioning, and deliberate easier days.",
    phases: ["Volume base", "Load progression", "Conditioning push", "Consolidate"],
    schedule: [
      ["Mon", "Lower strength", "Squat pattern, hinge pattern, split squat, carry, core."],
      ["Tue", "Conditioning", "10 x 1 minute hard with 90 seconds easy recovery."],
      ["Wed", "Upper strength", "Push, pull, vertical press, row, anti-rotation core."],
      ["Thu", "Aerobic base", "40 to 50 minutes steady moderate cardio."],
      ["Fri", "Full-body power", "Hinge, push, pull, lunge, loaded carry, short finisher."],
      ["Sat", "Skill or long cardio", "Sport, hill walk, cycle, swim, or tempo intervals."],
      ["Sun", "Recovery", "Mobility, easy walk, and sleep priority."]
    ],
    examples: [
      ["Split squat", "Descend with control, drive through the front foot, keep torso tall."],
      ["Romanian deadlift", "Hinge with neutral spine, feel hamstrings, stand by driving hips."],
      ["Loaded carry", "Walk tall with weight in one or both hands, ribs stacked."],
      ["Push-pull superset", "Pair a press with a row while keeping reps clean."],
      ["Tempo interval", "Sustain a challenging pace, then recover fully before repeating."],
      ["Deload week", "Reduce sets by about a third when fatigue or soreness accumulates."]
    ]
  }
};

const recipeSets = {
  omnivore: [
    ["Protein power bowl", "30 min", ["Grilled chicken or eggs", "Brown rice", "Greens", "Tomato salsa", "Greek yogurt sauce"]],
    ["Turkey bean chili", "40 min", ["Lean turkey", "Beans", "Peppers", "Tomatoes", "Avocado"]],
    ["Berry oat breakfast", "10 min", ["Oats", "Milk", "Berries", "Chia", "Peanut butter"]]
  ],
  vegetarian: [
    ["Paneer and lentil tray bowl", "35 min", ["Paneer or halloumi", "Lentils", "Roasted veg", "Lemon herbs", "Quinoa"]],
    ["Egg and avocado toast", "12 min", ["Eggs", "Whole-grain toast", "Avocado", "Spinach", "Pumpkin seeds"]],
    ["Greek yogurt recovery jar", "8 min", ["Greek yogurt", "Berries", "Granola", "Walnuts", "Honey"]]
  ],
  vegan: [
    ["Tofu peanut noodle bowl", "25 min", ["Tofu", "Rice noodles", "Edamame", "Cabbage", "Peanut lime sauce"]],
    ["Lentil sweet potato stew", "40 min", ["Red lentils", "Sweet potato", "Tomatoes", "Spinach", "Fortified nutritional yeast"]],
    ["Chickpea crunch wrap", "15 min", ["Chickpeas", "Hummus", "Salad leaves", "Tahini", "Whole-grain wrap"]]
  ],
  pescatarian: [
    ["Salmon greens plate", "25 min", ["Salmon", "Potatoes", "Green beans", "Lemon", "Olive oil yogurt sauce"]],
    ["Tuna quinoa salad", "15 min", ["Tuna", "Quinoa", "Cucumber", "Beans", "Herbs"]],
    ["Shrimp rice skillet", "20 min", ["Shrimp", "Rice", "Peppers", "Peas", "Garlic"]]
  ],
  glutenFree: [
    ["Chicken rice power plate", "25 min", ["Chicken", "Rice", "Roasted veg", "Avocado", "Lime"]],
    ["Bean and corn taco bowl", "18 min", ["Black beans", "Corn", "Salsa", "Lettuce", "Greek yogurt or tofu crema"]],
    ["Egg potato breakfast hash", "20 min", ["Eggs", "Potatoes", "Spinach", "Mushrooms", "Feta"]]
  ]
};

const dietTips = {
  omnivore: "Aim for protein at each meal plus colorful plants and slow carbs.",
  vegetarian: "Rotate eggs, dairy, beans, lentils, tofu, nuts, and seeds for variety.",
  vegan: "Use legumes, tofu, tempeh, nuts, seeds, and fortified foods; consider B12 guidance from a clinician.",
  pescatarian: "Mix fish, eggs or dairy if used, legumes, whole grains, and plenty of plants.",
  glutenFree: "Choose naturally gluten-free staples such as rice, potatoes, quinoa, beans, fruit, and vegetables."
};

const labelMaps = {
  gender: {
    woman: "Woman",
    man: "Man",
    nonbinary: "Non-binary"
  },
  experience: {
    new: "New",
    beginner: "Beginner",
    advanced: "Advanced"
  },
  diet: {
    omnivore: "Omnivore",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    pescatarian: "Pescatarian",
    glutenFree: "Gluten-free"
  }
};

const iconPaths = [
  "M4 17h16M7 17V9m5 8V5m5 12v-6",
  "M6 19V5m0 0h10l-2 4 2 4H6",
  "M5 12h14M12 5v14",
  "M8 17a4 4 0 0 1 8 0M12 3v7m0 0 3-3m-3 3L9 7",
  "M6 18 18 6M8 6h10v10",
  "M4 14c4-8 12-8 16 0M7 15c3 4 7 4 10 0"
];

function getFormState() {
  const data = new FormData(form);
  const units = data.get("units");
  const height =
    units === "metric"
      ? Number(data.get("heightCm"))
      : (Number(data.get("heightFt")) * 12 + Number(data.get("heightIn"))) * 2.54;
  const weight =
    units === "metric" ? Number(data.get("weightKg")) : Number(data.get("weightLb")) * 0.453592;

  return {
    profileName: profileNameInput.value.trim() || "My PulsePlan",
    gender: data.get("gender"),
    experience: data.get("experience"),
    units,
    height,
    weight,
    diet: data.get("diet"),
    weeks: Number(data.get("weeks"))
  };
}

function normalizeProfile(profile) {
  const heightM = profile.height / 100;
  const bmi = heightM > 0 ? profile.weight / (heightM * heightM) : 0;
  const experience = experienceProfiles[profile.experience];
  let minutes = experience.minutes;

  if (bmi >= 30 && profile.experience === "new") {
    minutes = 100;
  }

  if (profile.weeks <= 4 && profile.experience === "advanced") {
    minutes -= 20;
  }

  return {
    ...profile,
    bmi,
    minutes,
    experience
  };
}

function renderPlan(profile) {
  const plan = normalizeProfile(profile);
  const dietLabel = labelMaps.diet[plan.diet];
  const experienceLabel = labelMaps.experience[profile.experience];
  const genderLabel = labelMaps.gender[profile.gender];
  const titleWeeks = `${plan.weeks}-week ${plan.experience.title} plan`;

  planTitle.textContent = `Your ${titleWeeks}`;
  planSubtitle.textContent = `${experienceLabel} level, ${genderLabel.toLowerCase()} profile, ${dietLabel.toLowerCase()} nutrition ideas, ${plan.experience.intensity} pacing. ${plan.experience.subtitle}`;
  profileNameLabel.textContent = profile.profileName;
  minutesTarget.textContent = String(plan.minutes);
  strengthDays.textContent = String(plan.experience.strength);
  cardioDays.textContent = String(plan.experience.cardio);
  recoveryDays.textContent = String(plan.experience.recovery);

  renderRoadmap(plan);
  renderSchedule(plan);
  renderExamples(plan);
  renderRecipes(plan);
  currentProfile = profile;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  renderSavedPlans();
}

function renderRoadmap(plan) {
  const blocks = getPhaseBlocks(plan.weeks, plan.experience.phases);
  weekRoadmap.innerHTML = blocks
    .map((block, index) => {
      const width = Math.round(((index + 1) / blocks.length) * 100);
      return `
        <article class="week-card">
          <strong>${block.label}</strong>
          <small>${block.copy}</small>
          <div class="progress-line" aria-hidden="true"><span style="width:${width}%"></span></div>
        </article>
      `;
    })
    .join("");
}

function getPhaseBlocks(weeks, phases) {
  const chunk = Math.max(1, Math.ceil(weeks / phases.length));
  return phases.map((phase, index) => {
    const start = index * chunk + 1;
    const end = Math.min(weeks, start + chunk - 1);
    return {
      label: `Weeks ${start}-${end}: ${phase}`,
      copy:
        index === 0
          ? "Keep every set easy enough to finish with control."
          : index === phases.length - 1
            ? "Repeat the best week or reduce volume if fatigue is high."
            : "Add small progress: minutes, reps, sets, or cleaner technique."
    };
  });
}

function renderSchedule(plan) {
  dayPlan.innerHTML = plan.experience.schedule
    .map(
      ([day, title, copy]) => `
      <article class="day-card">
        <span class="day-dot">${day}</span>
        <div>
          <strong>${title}</strong>
          <p>${copy}</p>
        </div>
      </article>
    `
    )
    .join("");
}

function renderExamples(plan) {
  guide.innerHTML = plan.experience.examples
    .map(
      ([title, copy], index) => `
      <article class="guide-card">
        <span class="source-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="${iconPaths[index % iconPaths.length]}"></path></svg>
        </span>
        <h3>${title}</h3>
        <p>${copy}</p>
      </article>
    `
    )
    .join("");
}

function renderRecipes(plan) {
  const recipes = recipeSets[plan.diet] || recipeSets.omnivore;
  nutrition.innerHTML = recipes
    .map(
      ([title, time, ingredients]) => `
      <article class="recipe-card">
        <span class="recipe-tag">${time}</span>
        <h3>${title}</h3>
        <p>${dietTips[plan.diet]}</p>
        <ul>${ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `
    )
    .join("");
}

function updateUnits() {
  const units = new FormData(form).get("units");
  const showImperial = units === "imperial";
  metricInputs.classList.toggle("hidden", showImperial);
  metricInputs.setAttribute("aria-hidden", String(showImperial));
  imperialInputs.classList.toggle("hidden", !showImperial);
  imperialInputs.setAttribute("aria-hidden", String(!showImperial));
}

function setActiveTab(tabId) {
  document.querySelectorAll(".tab").forEach((button) => {
    const active = button.id === tabId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    const active = panel.getAttribute("aria-labelledby") === tabId;
    panel.classList.toggle("hidden", !active);
  });
}

function showToast(message) {
  offlineToast.textContent = message;
  offlineToast.classList.add("visible");
  window.setTimeout(() => offlineToast.classList.remove("visible"), 2200);
}

function getSavedPlans() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_PLANS_KEY)) || [];
  } catch {
    return [];
  }
}

function setSavedPlans(plans) {
  localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(plans));
  renderSavedPlans();
}

function saveCurrentPlan() {
  const profile = currentProfile || getFormState();
  const plan = normalizeProfile(profile);
  const plans = getSavedPlans();
  const savedPlan = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    profile,
    title: `${profile.profileName} - ${profile.weeks} week ${plan.experience.title}`,
    summary: `${labelMaps.experience[profile.experience]}, ${labelMaps.diet[profile.diet]}, ${plan.minutes} min/week`
  };

  plans.unshift(savedPlan);
  setSavedPlans(plans.slice(0, 12));
  showToast("Plan saved to this device");
}

function renderSavedPlans() {
  const plans = getSavedPlans();
  savedCount.textContent =
    plans.length === 0 ? "No saved plans yet" : `${plans.length} saved plan${plans.length === 1 ? "" : "s"}`;

  if (plans.length === 0) {
    savedPlans.innerHTML = `
      <article class="empty-saved">
        <strong>No saved plans yet</strong>
        <p>Create a profile, generate a plan, then save it here for quick access.</p>
      </article>
    `;
    return;
  }

  savedPlans.innerHTML = plans
    .map((plan) => {
      const date = new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(plan.createdAt));

      return `
        <article class="saved-plan">
          <div>
            <strong>${escapeHtml(plan.title)}</strong>
            <small>${escapeHtml(plan.summary)} - saved ${date}</small>
          </div>
          <div class="saved-plan-actions">
            <button class="ghost-button" type="button" data-load-plan="${plan.id}">Load</button>
            <button class="icon-button" type="button" data-delete-plan="${plan.id}" aria-label="Delete ${escapeHtml(plan.title)}">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M10 11v6m4-6v6M8 7l1-3h6l1 3m-9 0 1 13h8l1-13" /></svg>
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function loadSavedPlan(id) {
  const plan = getSavedPlans().find((item) => item.id === id);
  if (!plan) return;

  applyProfileToForm(plan.profile);
  renderPlan(getFormState());
  showToast("Saved plan loaded");
}

function deleteSavedPlan(id) {
  setSavedPlans(getSavedPlans().filter((plan) => plan.id !== id));
  showToast("Saved plan deleted");
}

function applyProfileToForm(profile) {
  Object.entries(profile).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"][value="${value}"]`);
    if (input) input.checked = true;
  });

  profileNameInput.value = profile.profileName || "My PulsePlan";

  if (profile.units === "metric") {
    heightCm.value = Math.round(profile.height);
    weightKg.value = Math.round(profile.weight);
  } else {
    const totalInches = Math.round(profile.height / 2.54);
    heightFt.value = Math.floor(totalInches / 12);
    heightIn.value = totalInches % 12;
    weightLb.value = Math.round(profile.weight / 0.453592);
  }

  dietSelect.value = profile.diet;
  weeksInput.value = profile.weeks;
  weeksOutput.textContent = `${profile.weeks} weeks`;
  updateUnits();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

function restoreProfile() {
  const saved = localStorage.getItem(PROFILE_KEY);
  if (!saved) return false;

  try {
    const profile = JSON.parse(saved);
    applyProfileToForm(profile);
    renderPlan(getFormState());
    return true;
  } catch {
    return false;
  }
}

form.addEventListener("input", (event) => {
  if (event.target.name === "units") updateUnits();
  if (event.target.name === "weeks") {
    weeksOutput.textContent = `${event.target.value} weeks`;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderPlan(getFormState());
  document.querySelector("#plan").scrollIntoView({ behavior: "smooth", block: "start" });
});

resetButton.addEventListener("click", () => {
  form.reset();
  weeksOutput.textContent = "8 weeks";
  updateUnits();
  localStorage.removeItem(PROFILE_KEY);
  renderPlan(getFormState());
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.id));
});

document.querySelectorAll("[data-tab-target]").forEach((link) => {
  link.addEventListener("click", () => {
    setActiveTab(link.dataset.tabTarget);
  });
});

savePlanButton.addEventListener("click", saveCurrentPlan);

savedPlans.addEventListener("click", (event) => {
  const loadButton = event.target.closest("[data-load-plan]");
  const deleteButton = event.target.closest("[data-delete-plan]");

  if (loadButton) {
    loadSavedPlan(loadButton.dataset.loadPlan);
  }

  if (deleteButton) {
    deleteSavedPlan(deleteButton.dataset.deletePlan);
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.disabled = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    showToast("Use your browser menu to install PulsePlan");
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
});

window.addEventListener("online", () => showToast("Back online"));
window.addEventListener("offline", () => showToast("Plan available offline"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      if (!navigator.serviceWorker.controller) return;
      showToast("Ready offline");
    } catch {
      showToast("Offline setup blocked");
    }
  });
}

if (!restoreProfile()) {
  renderPlan(getFormState());
}

renderSavedPlans();
