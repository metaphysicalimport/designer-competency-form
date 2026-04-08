const STORAGE_KEY = "designer-competency-app-v5";
const OPTION_LABELS = ["A", "B", "C", "D", "E"];
const GRADE_OPTIONS = ["14", "15", "16", "17", "18"];

const AXES = [
  {
    id: "complexity_of_tasks",
    title: "Сложность задач",
    description: "С какими задачами ты реально справляешься без потери качества.",
    prompts: [
      "С какими задачами я способен работать без потери качества?",
      "Есть ли в моей работе задачи, где не все очевидно с первого взгляда?",
      "Затрагивают ли мои задачи несколько частей продукта или команд?"
    ],
    options: {
      14: "Делаю задачи, где понятно, что делать и какой должен быть результат.",
      15: "Могу сам разобраться в задаче, если что-то не ясно, и довести ее до конца.",
      16: "Работаю с задачами, которые затрагивают несколько частей продукта и другие команды.",
      17: "Беру сложные задачи, от которых зависит важный результат для продукта и бизнеса.",
      18: "Начинаю работать, даже когда никто толком не понимает, что именно нужно сделать."
    }
  },
  {
    id: "task_source_and_problem_framing",
    title: "Откуда берутся задачи",
    description: "Насколько ты работаешь по постановке и насколько сам формулируешь проблему.",
    prompts: [
      "Откуда обычно берутся задачи, которыми я занимаюсь?",
      "Приходится ли мне уточнять и доформулировать задачу перед работой?",
      "Бывает ли, что я сам предлагаю, какую задачу нужно сделать?"
    ],
    options: {
      14: "Мне дают задачу, и я ее делаю. С понятным ТЗ.",
      15: "Мне дают задачу. Если задача не до конца понятна, уточняю ее перед началом работы.",
      16: "Мне дают задачу. Предлагаю варианты решения внутри поставленной задачи.",
      17: "Мне дают задачу, я формулирую проблему и предлагаю, что нужно сделать. Также сам предлагаю задачи.",
      18: "Сам ставлю задачи, исходя из целей системы и бизнеса. Сам нахожу, где есть проблема, и ставлю задачи, которые стоит делать."
    }
  },
  {
    id: "uncertainty_tolerance",
    title: "Уровень неопределенности",
    description: "Как ты держишься, когда не хватает данных, ясности и готовой рамки.",
    prompts: [
      "Могу ли я продолжать работу, когда не хватает данных?",
      "Спокойно ли я отношусь к расплывчатым задачам?",
      "Помогаю ли я другим разобраться, когда задача непонятна?"
    ],
    options: {
      14: "Мне важно, чтобы задача была четко описана.",
      15: "Могу двигаться при частичной неопределенности. Если задача описана не полностью, могу уточнить и продолжить работу.",
      16: "Принимаю решения без полной информации, даже когда не хватает данных.",
      17: "Помогаю другим ориентироваться в неопределенности и разбираться, когда вокруг неясность.",
      18: "Спокойно работаю и поступательно двигаюсь в условиях высокой и длительной неопределенности."
    }
  },
  {
    id: "scope_of_impact",
    title: "Масштаб влияния",
    description: "На какой кусок продукта и компании реально влияют твои решения.",
    prompts: [
      "Мои решения влияют только на мой экран или шире?",
      "Думаю ли я о том, как мое решение повлияет на другие части продукта?",
      "Замечают ли, что мои решения заметно меняют продукт?"
    ],
    options: {
      14: "Отдельные задачи или части продукта. Мои решения влияют на конкретный экран или задачу.",
      15: "Мои решения влияют на работу фичи или части продукта.",
      16: "Мои решения влияют на несколько частей продукта или команд.",
      17: "Мои решения влияют на продукт целиком или на его ключевые области.",
      18: "Мои решения влияют на то, как в компании в целом подходят к дизайну, продукту, принципам, культуре и бизнес-результатам."
    }
  },
  {
    id: "autonomy_and_responsibility",
    title: "Автономность и ответственность",
    description: "Какой горизонт ownership ты реально держишь.",
    prompts: [
      "Нужны ли мне советы или инструкции, чтобы начать работу?",
      "Сам ли я принимаю решения внутри своей задачи?",
      "Думаю ли я о том, что будет с решением после релиза?"
    ],
    options: {
      14: "Корректно выполняю задачи так, как поставили.",
      15: "Сам принимаю решения внутри своей задачи.",
      16: "Отвечаю за то, чтобы задача была сделана хорошо от начала до конца.",
      17: "Отвечаю за последствия решений во времени. Думаю о том, что будет с моим решением дальше и к чему оно приведет.",
      18: "Отвечаю не за задачу, а за общее направление и качество решений."
    }
  },
  {
    id: "interaction_and_influence",
    title: "Взаимодействие и влияние",
    description: "Как ты влияешь на решения других людей и команд.",
    prompts: [
      "Могу ли я понятно объяснить свои решения?",
      "Влияют ли мои аргументы на решения команды?",
      "Обращаются ли ко мне за советом по сложным вопросам?"
    ],
    options: {
      14: "Коммуницирую по своим задачам. Обсуждаю свои задачи с командой.",
      15: "Могу аргументировать решения и договариваться.",
      16: "Влияю на решения внутри команды и смежников.",
      17: "Влияю на мышление и подходы других команд. Помогаю другим думать лучше и принимать более сильные решения.",
      18: "Формирую принципы и подходы, на которые опираются и начинают пользоваться другие."
    }
  },
  {
    id: "superpower",
    title: "Суперсила",
    description: "Чем именно ты усиливаешь команду сильнее всего.",
    prompts: [
      "С какими вопросами или задачами ко мне чаще всего приходят коллеги?",
      "За что меня чаще всего благодарят или отмечают в работе?",
      "Если меня вынуть из команды, в чем почувствуется наибольшая потеря?"
    ],
    options: {
      14: "Понимаю, в чем я могу быть полезен команде. Возможно, суперсилы пока нет.",
      15: "Понимаю, в чем моя сильная сторона, и активно применяю ее в задачах.",
      16: "Моя сильная сторона заметно усиливает команду и дизайн продукта.",
      17: "На мою экспертизу опираются при принятии решений. Ко мне приходят за экспертизой и советом.",
      18: "Моя экспертиза влияет на развитие продукта и подходов в команде."
    }
  }
];

const IDEAL_DESIGNER_SECTIONS = [
  {
    id: "idea_generation_ux",
    stage: "На этапе поиска решений",
    title: "Генерация идей + сценарии / ю-икс",
    bullets: [
      "умеет включать хеликоптер вью и видеть картину целиком",
      "разгоняет не только идеи, но и альтернативные сценарии реализации",
      "скорость и широта альтернатив - разнообразие решений и свежесть подходов",
      "генерит пользовательские сценарии на лету и сразу думает про последствия в флоу"
    ]
  },
  {
    id: "aesthetics_ui",
    stage: "На этапе поиска решений",
    title: "Эстетика / ю-ай",
    bullets: [
      "не обесценивает значение метрики эстетик-юзабилити эффект",
      "обеспечивает связь и консистентность продукта и бренда",
      "дотошно работает с типографикой, цветом, дизайн-системой и компонентами",
      "умеет искать правильные рефы у прямых и непрямых конкурентов и синтезировать уникальные решения с высоким уровнем эстетики",
      "не обесценивает эстетику на этапе поиска лук-энд-фил продукта"
    ]
  },
  {
    id: "user_research",
    stage: "На этапе поиска решений",
    title: "Юзер рисерч",
    bullets: [
      "умеет спланировать рисерч: гипотезы, план, скрипт, формат (интервью, опросы)",
      "синтезирует инсайты в понятные рекомендации",
      "умеет запитчить результаты команде и довести до изменений в продукте"
    ]
  },
  {
    id: "frameworks_analytics",
    stage: "На этапе поиска решений",
    title: "Фреймворки / аналитика",
    bullets: [
      "умеет связать дизайн с целями и метриками продукта",
      "применяет райс и другие фреймворки для фокусировки продуктовой команды и ранжирования идей",
      "умеет трактовать статистику и делать из нее выводы"
    ]
  },
  {
    id: "design_pitching",
    stage: "На этапе поиска решений",
    title: "Дизайн питчинг",
    bullets: [
      "умеет эффективно защищать свои решения перед стейкхолдерами и командой"
    ]
  },
  {
    id: "empathy_compromises",
    stage: "На этапе поиска решений",
    title: "Эмпатия и компромиссы",
    bullets: [
      "умеет находить компромиссы, которые сохраняют целевую планку качества реализации",
      "умеет искать возможности обойти блокеры внутри команды, не просаживая качество"
    ]
  },
  {
    id: "work_speed",
    stage: "На этапе детализации макетов",
    title: "Скорость работы",
    bullets: [
      "регулярно обучается и повышает свою эффективность",
      "использует нетривиальные подходы и инструменты, чтобы быстрее достигать нужного результата"
    ]
  },
  {
    id: "flow_detailing",
    stage: "На этапе детализации макетов",
    title: "Проработка флоу",
    bullets: [
      "описывает и отрисовывает все состояния, ошибки и пограничные кейсы",
      "сам или в коллаборации с редактором формулирует микрокопирайт",
      "обеспечивает соответствие платформенным гайдлайнам и дизайн-системе",
      "обеспечивает высокий уровень качества передачи дизайна в разработку: спеки, аннотации, компоненты дизайн-системы"
    ]
  },
  {
    id: "handoff_and_production",
    stage: "На этапе детализации макетов",
    title: "Хэнд-офф и ответственность за прод",
    bullets: [
      "проводит дизайн-ревью по ходу разработки фичи",
      "контролирует, что продакшн совпадает с макетами на 99%",
      "открыт к поиску альтернативных решений, если на этапе дизайн-ревью возникают сложности"
    ]
  },
  {
    id: "critique_response",
    stage: "На этапе детализации макетов",
    title: "Критик респонс",
    bullets: [
      "спокойно принимает фидбэк, отделяет личное от рабочего",
      "умеет корректировать свои решение после фидбека"
    ]
  }
];

const DEFAULT_STATE = {
  profile: {
    designerName: "",
    designerRole: "старший дизайнер продукта",
    currentGrade: "",
    targetGrade: "",
    context: ""
  },
  axes: Object.fromEntries(
    AXES.map((axis) => [
      axis.id,
      {
        selectedLevels: [],
        selectedStatements: [],
        evidence: ""
      }
    ])
  ),
  idealRatings: Object.fromEntries(
    IDEAL_DESIGNER_SECTIONS.map((section) => [
      section.id,
      {
        score: "",
        comment: ""
      }
    ])
  ),
  optionOrder: buildOptionOrderMap(),
  generalNotes: "",
  error: ""
};

let state = loadState();
const app = document.getElementById("app");

init();

function init() {
  render();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return cloneDefaultState();
    }

    const parsed = JSON.parse(raw);
    const nextState = {
      ...cloneDefaultState(),
      ...parsed,
      profile: {
        ...cloneDefaultState().profile,
        ...(parsed.profile || {})
      },
      axes: {
        ...cloneDefaultState().axes,
        ...(parsed.axes || {})
      },
      idealRatings: {
        ...cloneDefaultState().idealRatings,
        ...(parsed.idealRatings || {})
      },
      optionOrder: parsed.optionOrder || buildOptionOrderMap()
    };

    if (!nextState.profile.designerRole || nextState.profile.designerRole === "product designer") {
      nextState.profile.designerRole = cloneDefaultState().profile.designerRole;
    }

    return nextState;
  } catch (error) {
    return cloneDefaultState();
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function buildOptionOrderMap() {
  return Object.fromEntries(
    AXES.map((axis) => {
      const levels = Object.keys(axis.options).map(Number);
      const shuffled = seededShuffle(levels, hashString(axis.id));
      const ordered =
        shuffled.every((level, index) => level === levels[index]) ? [...shuffled].reverse() : shuffled;

      return [axis.id, ordered];
    })
  );
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash || 1;
}

function seededShuffle(items, seed) {
  const result = [...items];
  let currentSeed = seed;

  for (let index = result.length - 1; index > 0; index -= 1) {
    currentSeed = (currentSeed * 1664525 + 1013904223) >>> 0;
    const swapIndex = currentSeed % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function persistState() {
  const snapshot = {
    ...state,
    profile: { ...state.profile },
    axes: JSON.parse(JSON.stringify(state.axes)),
    idealRatings: JSON.parse(JSON.stringify(state.idealRatings)),
    optionOrder: JSON.parse(JSON.stringify(state.optionOrder))
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function getAnsweredCount() {
  const axesAnswered = AXES.filter(
    (axis) => Array.isArray(state.axes[axis.id].selectedLevels) && state.axes[axis.id].selectedLevels.length > 0
  ).length;
  const ratingsAnswered = IDEAL_DESIGNER_SECTIONS.filter(
    (section) => Number(state.idealRatings?.[section.id]?.score) >= 1
  ).length;

  return axesAnswered + ratingsAnswered;
}

function render() {
  const answeredCount = getAnsweredCount();
  const totalCount = AXES.length + IDEAL_DESIGNER_SECTIONS.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  app.innerHTML = `
    <section class="progress-dock">
      <div class="progress-dock-head">
        <span class="mini-chip">${progress}% заполнено</span>
        <span class="progress-copy">заполнено ${answeredCount} из ${totalCount} блоков</span>
      </div>
      <div class="progress-line">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>
    </section>

    <section class="profile-card">
      <h2>Контекст оценки</h2>
      <div class="field-grid">
        ${renderInput("designerName", "Дизайнер", state.profile.designerName, "Например, Алина")}
        ${renderInput(
          "designerRole",
          "Роль дизайнера",
          state.profile.designerRole,
          "Например, старший дизайнер продукта"
        )}
      </div>
      <div class="field-grid field-grid--double">
        ${renderSelect("currentGrade", "Текущий формальный грейд", state.profile.currentGrade, GRADE_OPTIONS)}
        ${renderSelect("targetGrade", "Целевой грейд", state.profile.targetGrade, GRADE_OPTIONS)}
      </div>
      <div class="textarea-field">
        <label for="profile-context">Контекст команды и зоны ответственности дизайнера</label>
        <textarea id="profile-context" data-field="profile.context" placeholder="Опиши продукт, команду, тип задач дизайнера, уровень автономности, с кем он взаимодействует, за что отвечает.">${escapeHtml(state.profile.context)}</textarea>
      </div>
    </section>

    ${AXES.map(renderAxisCard).join("")}

    ${renderIdealDesignerSections()}

    <section class="profile-card">
      <h2>Дополнительные заметки</h2>
      <p class="field-help">
        Сюда можно добавить крупные кейсы, сомнения по калибровке, сильные стороны,
        обратную связь от PM или разработки и любые наблюдения, которые важно не потерять.
      </p>
      <div class="textarea-field">
        <label for="general-notes">Комментарий арт-директора</label>
        <textarea id="general-notes" data-field="generalNotes" placeholder="Например: вел сложный редизайн, хорошо держит коммуникацию с PM, но пока неустойчив в problem framing без внешней рамки.">${escapeHtml(state.generalNotes)}</textarea>
      </div>
    </section>

    <section class="submit-bar">
      <div class="meta-row">
        <span class="mini-chip">${progress}% заполнено</span>
      </div>
      <div class="action-row">
        <button class="button" id="export-markdown-button" type="button">Экспортировать</button>
      </div>
      <p class="footer-note">
        В файл попадут контекст оценки, вопросы, выбранные ответы, оценки по навыкам и все комментарии арт-директора.
      </p>
    </section>

    ${state.error ? `<section class="error-box">${escapeHtml(state.error)}</section>` : ""}
  `;

  attachEvents();
}

function renderInput(fieldId, label, value, placeholder) {
  return `
    <div class="field">
      <label for="${fieldId}">${label}</label>
      <input id="${fieldId}" type="text" data-field="profile.${fieldId}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </div>
  `;
}

function renderSelect(fieldId, label, value, options) {
  const normalizedValue = options.includes(String(value)) ? String(value) : "";

  return `
    <div class="field">
      <label for="${fieldId}">${label}</label>
      <select id="${fieldId}" data-field="profile.${fieldId}">
        <option value="">Не выбран</option>
        ${options
          .map(
            (option) =>
              `<option value="${option}" ${normalizedValue === option ? "selected" : ""}>${option}</option>`
          )
          .join("")}
      </select>
    </div>
  `;
}

function renderAxisCard(axis, index) {
  const axisState = state.axes[axis.id];

  return `
    <section class="axis-card">
      <div class="axis-head">
        <div class="axis-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h2>${escapeHtml(axis.title)}</h2>
          <p class="axis-description">${escapeHtml(axis.description)}</p>
        </div>
      </div>

      <ul class="axis-prompts">
        ${axis.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}
      </ul>

      <div class="option-stack">
        ${getDisplayOptions(axis)
          .map(({ level, statement }, displayIndex) => {
            const selectedLevels = Array.isArray(axisState.selectedLevels) ? axisState.selectedLevels.map(Number) : [];
            const isSelected = selectedLevels.includes(Number(level));
            const optionLabel = OPTION_LABELS[displayIndex] || String(displayIndex + 1);

            return `
              <label class="grade-option ${isSelected ? "is-selected" : ""}">
                <input
                  type="checkbox"
                  name="${axis.id}-${level}"
                  value="${level}"
                  data-axis="${axis.id}"
                  ${isSelected ? "checked" : ""}
                />
                <span class="grade-badge">${optionLabel}</span>
                <span class="grade-copy">
                  <strong>Вариант ${optionLabel}</strong>
                  <span>${escapeHtml(statement)}</span>
                </span>
              </label>
            `;
          })
          .join("")}
      </div>

      <div class="textarea-field">
        <label for="evidence-${axis.id}">Комментарий арт-директора</label>
        <textarea
          id="evidence-${axis.id}"
          data-evidence-axis="${axis.id}"
          placeholder="Опиши наблюдения, примеры и сигналы по этой оси."
        >${escapeHtml(axisState.evidence)}</textarea>
      </div>
    </section>
  `;
}

function renderIdealDesignerSections() {
  const grouped = IDEAL_DESIGNER_SECTIONS.reduce((accumulator, section) => {
    if (!accumulator[section.stage]) {
      accumulator[section.stage] = [];
    }
    accumulator[section.stage].push(section);
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(
      ([stage, sections], index) => `
        <section class="profile-card">
          ${index === 0
            ? `
              <h2>Дополнительная оценка по навыкам</h2>
              <p class="field-help">
                Ниже добавлены блоки по ключевым навыкам. Для каждого навыка поставь оценку
                от 1 до 5 и оставь свободный комментарий арт-директора.
              </p>
            `
            : ""}
          <h3 class="subsection-title">${escapeHtml(stage)}</h3>
          <div class="ideal-stack">
            ${sections.map(renderIdealDesignerCard).join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function renderIdealDesignerCard(section) {
  const ratingState = state.idealRatings?.[section.id] || { score: "", comment: "" };

  return `
    <section class="rating-card">
      <div class="rating-card-head">
        <h3>${escapeHtml(section.title)}</h3>
      </div>
      <ul class="axis-prompts">
        ${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
      <div class="axis-label">Оценка от 1 до 5</div>
      <div class="score-row">
        ${[1, 2, 3, 4, 5]
          .map((score) => {
            const isSelected = Number(ratingState.score) === score;
            return `
              <label class="score-pill ${isSelected ? "is-selected" : ""}">
                <input
                  type="radio"
                  name="score-${section.id}"
                  value="${score}"
                  data-rating-section="${section.id}"
                  ${isSelected ? "checked" : ""}
                />
                <span>${score}</span>
              </label>
            `;
          })
          .join("")}
      </div>
      <div class="textarea-field">
        <label for="rating-comment-${section.id}">Комментарий арт-директора</label>
        <textarea
          id="rating-comment-${section.id}"
          data-rating-comment="${section.id}"
          placeholder="Опиши, почему поставлена такая оценка по этому навыку."
        >${escapeHtml(ratingState.comment)}</textarea>
      </div>
    </section>
  `;
}

function getDisplayOptions(axis) {
  const order = state.optionOrder?.[axis.id] || Object.keys(axis.options).map(Number);
  return order.map((level) => ({
    level,
    statement: axis.options[level]
  }));
}

function attachEvents() {
  document.querySelectorAll("[data-field]").forEach((node) => {
    node.addEventListener("input", handleFieldInput);
    node.addEventListener("change", handleFieldInput);
  });

  document.querySelectorAll("[data-evidence-axis]").forEach((node) => {
    node.addEventListener("input", handleEvidenceInput);
  });

  document.querySelectorAll('input[type="radio"][data-rating-section]').forEach((node) => {
    node.addEventListener("change", handleRatingScoreChange);
  });

  document.querySelectorAll("[data-rating-comment]").forEach((node) => {
    node.addEventListener("input", handleRatingCommentInput);
  });

  document.querySelectorAll('input[type="checkbox"][data-axis]').forEach((node) => {
    node.addEventListener("change", handleAxisSelectionToggle);
  });

  const exportMarkdownButton = document.getElementById("export-markdown-button");
  if (exportMarkdownButton) {
    exportMarkdownButton.addEventListener("click", exportMarkdown);
  }
}

function handleFieldInput(event) {
  const path = event.target.dataset.field;
  if (!path.includes(".")) {
    state[path] = event.target.value;
  } else {
    const [scope, key] = path.split(".");
    if (scope === "profile") {
      state.profile[key] = event.target.value;
    }
  }

  state.error = "";
  persistState();
}

function handleEvidenceInput(event) {
  const axisId = event.target.dataset.evidenceAxis;
  state.axes[axisId].evidence = event.target.value;
  state.error = "";
  persistState();
}

function handleRatingScoreChange(event) {
  const sectionId = event.target.dataset.ratingSection;
  state.idealRatings[sectionId].score = Number(event.target.value);
  state.error = "";
  persistState();
  render();
}

function handleRatingCommentInput(event) {
  const sectionId = event.target.dataset.ratingComment;
  state.idealRatings[sectionId].comment = event.target.value;
  state.error = "";
  persistState();
}

function handleAxisSelectionToggle(event) {
  const axisId = event.target.dataset.axis;
  const toggledLevel = Number(event.target.value);
  const axisConfig = AXES.find((axis) => axis.id === axisId);
  const previousLevels = Array.isArray(state.axes[axisId].selectedLevels) ? [...state.axes[axisId].selectedLevels] : [];

  const nextLevels = event.target.checked
    ? Array.from(new Set([...previousLevels, toggledLevel]))
    : previousLevels.filter((level) => Number(level) !== toggledLevel);

  nextLevels.sort((left, right) => left - right);

  state.axes[axisId].selectedLevels = nextLevels;
  state.axes[axisId].selectedStatements = nextLevels
    .map((level) => axisConfig?.options?.[level] || "")
    .filter(Boolean);
  state.error = "";
  persistState();
  render();
}

function exportMarkdown() {
  try {
    const markdown = buildMarkdownExport();
    const fileName = buildExportFileName();
    downloadTextFile(fileName, markdown, "text/markdown;charset=utf-8");
    state.error = "";
  } catch (error) {
    state.error = error.message || "Не удалось собрать markdown-файл.";
  }

  persistState();
  render();
}

function buildMarkdownExport() {
  const lines = [
    "# Оценка дизайнера",
    "",
    `- Сгенерировано: ${formatTimestamp(new Date())}`,
    `- Дизайнер: ${formatField(state.profile.designerName)}`,
    `- Роль дизайнера: ${formatField(state.profile.designerRole)}`,
    `- Текущий формальный грейд: ${formatField(state.profile.currentGrade)}`,
    `- Целевой грейд: ${formatField(state.profile.targetGrade)}`,
    "",
    "## Контекст команды и зоны ответственности",
    "",
    formatParagraph(state.profile.context),
    "",
    "## Основные вопросы",
    ""
  ];

  AXES.forEach((axis, index) => {
    const axisState = state.axes[axis.id] || {};
    const selectedLevels = Array.isArray(axisState.selectedLevels) ? axisState.selectedLevels.map(Number) : [];
    const displayOptions = getDisplayOptions(axis);

    lines.push(`### ${index + 1}. ${axis.title}`);
    lines.push("");
    lines.push(axis.description);
    lines.push("");
    lines.push("Вопросы:");
    lines.push(...toMarkdownBullets(axis.prompts));
    lines.push("");
    lines.push("Варианты и ответы:");
    lines.push(
      ...displayOptions.map(({ level, statement }, displayIndex) => {
        const optionLabel = OPTION_LABELS[displayIndex] || String(displayIndex + 1);
        const marker = selectedLevels.includes(Number(level)) ? "x" : " ";
        return `- [${marker}] Вариант ${optionLabel}: ${statement}`;
      })
    );
    lines.push("");
    lines.push("Комментарий арт-директора:");
    lines.push("");
    lines.push(formatParagraph(axisState.evidence));
    lines.push("");
  });

  lines.push("## Дополнительная оценка по навыкам");
  lines.push("");

  let currentStage = "";
  IDEAL_DESIGNER_SECTIONS.forEach((section) => {
    const rating = state.idealRatings?.[section.id] || { score: "", comment: "" };
    if (section.stage !== currentStage) {
      currentStage = section.stage;
      lines.push(`### ${currentStage}`);
      lines.push("");
    }

    lines.push(`#### ${section.title}`);
    lines.push("");
    lines.push("Критерии:");
    lines.push(...toMarkdownBullets(section.bullets));
    lines.push("");
    lines.push(`- Оценка: ${rating.score ? `${rating.score} / 5` : "Не заполнено"}`);
    lines.push("");
    lines.push("Комментарий арт-директора:");
    lines.push("");
    lines.push(formatParagraph(rating.comment));
    lines.push("");
  });

  lines.push("## Дополнительные заметки");
  lines.push("");
  lines.push(formatParagraph(state.generalNotes));
  lines.push("");

  return lines.join("\n");
}

function buildExportFileName() {
  const designerName = state.profile.designerName || "designer";
  return `designer-review-${slugifyFileName(designerName)}.md`;
}

function slugifyFileName(value) {
  const slug = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "designer";
}

function formatTimestamp(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatField(value) {
  const trimmed = String(value || "").trim();
  return trimmed || "Не заполнено";
}

function formatParagraph(value) {
  const trimmed = String(value || "").trim();
  return trimmed || "Не заполнено";
}

function toMarkdownBullets(items) {
  if (!Array.isArray(items) || !items.length) {
    return ["- Не заполнено"];
  }

  return items.map((item) => `- ${item}`);
}

function downloadTextFile(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
