const STORAGE_KEY = "designer-competency-app-v5";
const OPTION_LABELS = ["a", "b", "c", "d", "e"];
const GRADE_OPTIONS = ["14", "15", "16", "17", "18"];

const AXES = [
  {
    id: "complexity_of_tasks",
    title: "сложность задач",
    description: "с какими по масштабу и степени неопределенности задачами дизайнер устойчиво справляется на практике",
    prompts: [],
    options: {
      14: "уверенно работает с понятными задачами внутри проекта, где ясны цель, рамки и ожидаемый результат",
      15: "может самостоятельно разобраться в не до конца ясной задаче внутри проекта и довести ее до результата",
      16: "может вести крупные куски проекта в рамках своей кроссфункциональной команды - с по, пи-эмом, разработкой и кью-эй",
      17: "может тянуть проект целиком или его ключевую часть внутри музыки, от которой зависит заметный результат для продукта или бизнеса",
      18: "может начинать движение в зоне высокой неопределенности, когда еще неясно, какая задача, проект или направление вообще нужны и что именно стоит делать"
    }
  },
  {
    id: "task_source_and_problem_framing",
    title: "откуда берутся задачи",
    description:
      "насколько дизайнер работает по постановке, уточняет постановку, инициирует задачи внутри проекта, поднимает новые проекты или влияет на появление новых направлений",
    prompts: [],
    options: {
      14: "работает по поставленной задаче с понятным тз и ожидаемым результатом",
      15: "если задача сформулирована не до конца, помогает ее уточнить и собрать рабочую рамку перед стартом",
      16: "внутри проекта сам предлагает, какие задачи стоит делать, и формулирует варианты решения",
      17: "инициирует новые задачи или крупные куски работы внутри проекта, если видит проблему или возможность роста",
      18: "может инициировать отдельный проект или новое направление и доказывать его значимость для музыки, фантеха или бизнеса"
    }
  },
  {
    id: "uncertainty_tolerance",
    title: "уровень неопределенности",
    description: "как дизайнер действует, когда не хватает данных, ясности, готовой рамки или подтвержденного направления",
    prompts: [],
    options: {
      14: "уверенно двигается в условиях частичной неопределенности на уровне задачи - уточняет вводные и продолжает работу",
      15: "может принимать решения без полной информации, когда данных недостаточно, но цель в целом понятна",
      16: "сохраняет устойчивость в неопределенности на уровне проекта - когда непонятно, какой именно подход сработает и как лучше собрать решение",
      17: "помогает другим сориентироваться в неясной ситуации и собрать более понятную рамку работы",
      18: "может работать в неопределенности на уровне направления - когда еще не до конца ясно, какую проблему вообще нужно решать, почему это важно и во что это должно вылиться"
    }
  },
  {
    id: "scope_of_impact",
    title: "масштаб влияния",
    description: "на какой уровень продукта, команды или компании реально распространяется влияние решений дизайнера",
    prompts: [],
    options: {
      14: "его решения влияют на отдельную задачу внутри проекта - экран, сценарий, состояние или кусок флоу",
      15: "его решения влияют на заметную часть проекта и на работу своей кроссфункциональной команды внутри музыки",
      16: "его решения влияют на проект целиком или на несколько команд внутри музыки",
      17: "его решения влияют на ключевые подходы, большие продуктовые области или приоритеты внутри музыки",
      18: "его решения влияют за пределами музыки - на фантех или на более широкий контур компании"
    }
  },
  {
    id: "autonomy_and_responsibility",
    title: "автономность и ответственность",
    description:
      "какой уровень оунершипа дизайнер реально держит - на уровне задачи, проекта, направления и последствий решений во времени",
    prompts: [],
    options: {
      14: "корректно выполняет задачу в рамках поставленной инструкции и ожидаемого результата",
      15: "самостоятельно принимает решения внутри своей задачи или зоны ответственности",
      16: "держит качество и целостность крупного куска проекта от начала до конца, а не только свою локальную часть",
      17: "думает о последствиях решений во времени - что будет после релиза, как решение поведет себя дальше и к чему приведет",
      18: "берет оунершип не только за выполнение задач, но и за качество проектного направления, приоритеты и общую силу решений в своей зоне или на уровне музыки"
    }
  },
  {
    id: "interaction_and_influence",
    title: "взаимодействие и влияние",
    description: "как дизайнер влияет на решения других людей - внутри своей задачи, кроссфункциональной команды, проекта, музыки и шире",
    prompts: [],
    options: {
      14: "коммуницирует по своим задачам и рабочим решениям внутри кроссфункциональной команды",
      15: "может аргументировать свои решения и договариваться с по, пи-эмом, разработкой и кью-эй в рамках проекта",
      16: "влияет на решения своей кроссфункциональной команды и помогает ей принимать более сильные продуктовые решения",
      17: "может продвигать и удерживать важные решения на уровне проекта, нескольких команд или больших продуктовых тем внутри музыки",
      18: "формирует подходы, принципы и рамки, на которые начинают опираться другие команды внутри музыки, фантеха или шире"
    }
  },
  {
    id: "superpower",
    title: "суперсила",
    description: "в чем дизайнер дает наибольшее усиление - на уровне задачи, своей команды, проекта, музыки или шире",
    prompts: [],
    options: {
      14: "у дизайнера есть выраженная сильная сторона, которая заметно усиливает качество конкретных задач и решений",
      15: "к его экспертизе регулярно обращаются внутри кроссфункциональной команды - за советом, оценкой или более сильным решением",
      16: "его сильная сторона заметно усиливает проект целиком или несколько команд внутри музыки, а не только его собственный участок работы",
      17: "его сильная сторона влияет на то, как работает команда или дизайн внутри музыки - как думают, принимают решения или собирают качество",
      18: "его сильная сторона выходит за рамки музыки и начинает влиять на подходы, дизайн-культуру или продуктовые решения на уровне фантеха или шире"
    }
  }
];

const IDEAL_DESIGNER_SECTIONS = [
  {
    id: "idea_generation_ux",
    stage: "на этапе поиска решений",
    title: "генерация идей + сценарии / ю-икс",
    bullets: [
      "умеет включать хеликоптер вью и видеть картину целиком",
      "разгоняет не только идеи, но и альтернативные сценарии реализации",
      "скорость и широта альтернатив - разнообразие решений и свежесть подходов",
      "генерит пользовательские сценарии на лету и сразу думает про последствия в флоу"
    ]
  },
  {
    id: "aesthetics_ui",
    stage: "на этапе поиска решений",
    title: "эстетика / ю-ай",
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
    stage: "на этапе поиска решений",
    title: "юзер рисерч",
    bullets: [
      "умеет спланировать рисерч: гипотезы, план, скрипт, формат (интервью, опросы)",
      "синтезирует инсайты в понятные рекомендации",
      "умеет запитчить результаты команде и довести до изменений в продукте"
    ]
  },
  {
    id: "frameworks_analytics",
    stage: "на этапе поиска решений",
    title: "фреймворки / аналитика",
    bullets: [
      "умеет связать дизайн с целями и метриками продукта",
      "применяет райс и другие фреймворки для фокусировки продуктовой команды и ранжирования идей",
      "умеет трактовать статистику и делать из нее выводы"
    ]
  },
  {
    id: "design_pitching",
    stage: "на этапе поиска решений",
    title: "дизайн питчинг",
    bullets: [
      "умеет эффективно защищать свои решения перед стейкхолдерами и командой"
    ]
  },
  {
    id: "empathy_compromises",
    stage: "на этапе поиска решений",
    title: "эмпатия и компромиссы",
    bullets: [
      "умеет находить компромиссы, которые сохраняют целевую планку качества реализации",
      "умеет искать возможности обойти блокеры внутри команды, не просаживая качество"
    ]
  },
  {
    id: "work_speed",
    stage: "на этапе детализации макетов",
    title: "скорость работы",
    bullets: [
      "регулярно обучается и повышает свою эффективность",
      "использует нетривиальные подходы и инструменты, чтобы быстрее достигать нужного результата"
    ]
  },
  {
    id: "flow_detailing",
    stage: "на этапе детализации макетов",
    title: "проработка флоу",
    bullets: [
      "описывает и отрисовывает все состояния, ошибки и пограничные кейсы",
      "сам или в коллаборации с редактором формулирует микрокопирайт",
      "обеспечивает соответствие платформенным гайдлайнам и дизайн-системе",
      "обеспечивает высокий уровень качества передачи дизайна в разработку: спеки, аннотации, компоненты дизайн-системы"
    ]
  },
  {
    id: "handoff_and_production",
    stage: "на этапе детализации макетов",
    title: "хэнд-офф и ответственность за прод",
    bullets: [
      "проводит дизайн-ревью по ходу разработки фичи",
      "контролирует, что продакшн совпадает с макетами на 99%",
      "открыт к поиску альтернативных решений, если на этапе дизайн-ревью возникают сложности"
    ]
  },
  {
    id: "critique_response",
    stage: "на этапе детализации макетов",
    title: "критик респонс",
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
        <div class="progress-dock-actions">
          <span class="mini-chip">${progress}% заполнено</span>
          <button class="button button-secondary" id="reset-form-button" type="button">сбросить форму</button>
        </div>
        <span class="progress-copy">заполнено ${answeredCount} из ${totalCount} блоков</span>
      </div>
      <div class="progress-line">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>
    </section>

    <section class="profile-card">
      <h2>контекст оценки</h2>
      <div class="field-grid">
        ${renderInput("designerName", "дизайнер", state.profile.designerName, "например, алина")}
        ${renderInput(
          "designerRole",
          "роль дизайнера",
          state.profile.designerRole,
          "например, старший дизайнер продукта"
        )}
      </div>
      <div class="field-grid field-grid--double">
        ${renderSelect("currentGrade", "текущий формальный грейд", state.profile.currentGrade, GRADE_OPTIONS)}
        ${renderSelect("targetGrade", "целевой грейд", state.profile.targetGrade, GRADE_OPTIONS)}
      </div>
      <div class="textarea-field">
        <label for="profile-context">контекст команды и зоны ответственности дизайнера</label>
        <textarea id="profile-context" data-field="profile.context" placeholder="опиши продукт, команду, тип задач дизайнера, уровень автономности, с кем он взаимодействует, за что отвечает.">${escapeHtml(state.profile.context)}</textarea>
      </div>
    </section>

    ${AXES.map(renderAxisCard).join("")}

    ${renderIdealDesignerSections()}

    <section class="profile-card">
      <h2>дополнительные заметки</h2>
      <p class="field-help">
        сюда можно добавить крупные кейсы, сомнения по калибровке, сильные стороны,
        обратную связь от pm или разработки и любые наблюдения, которые важно не потерять.
      </p>
      <div class="textarea-field">
        <label for="general-notes">комментарий</label>
        <textarea id="general-notes" data-field="generalNotes" placeholder="например: вел сложный редизайн, хорошо держит коммуникацию с pm, но пока неустойчив в problem framing без внешней рамки.">${escapeHtml(state.generalNotes)}</textarea>
      </div>
    </section>

    <section class="submit-bar">
      <div class="meta-row">
        <span class="mini-chip">${progress}% заполнено</span>
      </div>
      <div class="action-row">
        <button class="button" id="export-markdown-button" type="button">экспортировать</button>
      </div>
      <p class="footer-note">
        в файл попадут контекст оценки, вопросы, выбранные ответы, оценки по навыкам и все комментарии.
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
        <option value="">не выбран</option>
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
  const hasPrompts = Array.isArray(axis.prompts) && axis.prompts.length > 0;

  return `
    <section class="axis-card">
      <div class="axis-head">
        <div class="axis-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h2>${escapeHtml(axis.title)}</h2>
          <p class="axis-description">${escapeHtml(axis.description)}</p>
        </div>
      </div>

      ${hasPrompts
        ? `
          <ul class="axis-prompts">
            ${axis.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}
          </ul>
        `
        : ""}

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
                  <strong>вариант ${optionLabel}</strong>
                  <span>${escapeHtml(statement)}</span>
                </span>
              </label>
            `;
          })
          .join("")}
      </div>

      <div class="textarea-field">
        <label for="evidence-${axis.id}">комментарий</label>
        <textarea
          id="evidence-${axis.id}"
          data-evidence-axis="${axis.id}"
          placeholder="опиши наблюдения, примеры и сигналы по этой оси."
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
              <h2>дополнительная оценка по навыкам</h2>
              <p class="field-help">
                ниже добавлены блоки по ключевым навыкам. Для каждого навыка поставь оценку
                от 1 до 5 и оставь свободный комментарий.
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
      <div class="axis-label">оценка от 1 до 5</div>
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
        <label for="rating-comment-${section.id}">комментарий</label>
        <textarea
          id="rating-comment-${section.id}"
          data-rating-comment="${section.id}"
          placeholder="опиши, почему поставлена такая оценка по этому навыку."
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

  const resetFormButton = document.getElementById("reset-form-button");
  if (resetFormButton) {
    resetFormButton.addEventListener("click", resetForm);
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
    state.error = error.message || "не удалось собрать markdown-файл.";
  }

  persistState();
  render();
}

function resetForm() {
  const shouldReset = window.confirm("сбросить все поля формы и удалить сохраненные ответы?");
  if (!shouldReset) {
    return;
  }

  state = cloneDefaultState();
  persistState();
  render();
}

function buildMarkdownExport() {
  const lines = [
    "# оценка дизайнера",
    "",
    `- сгенерировано: ${formatTimestamp(new Date())}`,
    `- дизайнер: ${formatField(state.profile.designerName)}`,
    `- роль дизайнера: ${formatField(state.profile.designerRole)}`,
    `- текущий формальный грейд: ${formatField(state.profile.currentGrade)}`,
    `- целевой грейд: ${formatField(state.profile.targetGrade)}`,
    "",
    "## контекст команды и зоны ответственности",
    "",
    formatParagraph(state.profile.context),
    "",
    "## основные вопросы",
    ""
  ];

  AXES.forEach((axis, index) => {
    const axisState = state.axes[axis.id] || {};
    const selectedLevels = Array.isArray(axisState.selectedLevels) ? axisState.selectedLevels.map(Number) : [];
    const displayOptions = getDisplayOptions(axis);
    const hasPrompts = Array.isArray(axis.prompts) && axis.prompts.length > 0;

    lines.push(`### ${index + 1}. ${axis.title}`);
    lines.push("");
    lines.push(axis.description);
    lines.push("");
    if (hasPrompts) {
      lines.push("вопросы:");
      lines.push(...toMarkdownBullets(axis.prompts));
      lines.push("");
    }
    lines.push("варианты и ответы:");
    lines.push(
      ...displayOptions.map(({ level, statement }, displayIndex) => {
        const optionLabel = OPTION_LABELS[displayIndex] || String(displayIndex + 1);
        const marker = selectedLevels.includes(Number(level)) ? "x" : " ";
        return `- [${marker}] вариант ${optionLabel}: ${statement}`;
      })
    );
    lines.push("");
    lines.push("комментарий:");
    lines.push("");
    lines.push(formatParagraph(axisState.evidence));
    lines.push("");
  });

  lines.push("## дополнительная оценка по навыкам");
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
    lines.push("критерии:");
    lines.push(...toMarkdownBullets(section.bullets));
    lines.push("");
    lines.push(`- оценка: ${rating.score ? `${rating.score} / 5` : "не заполнено"}`);
    lines.push("");
    lines.push("комментарий:");
    lines.push("");
    lines.push(formatParagraph(rating.comment));
    lines.push("");
  });

  lines.push("## дополнительные заметки");
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
  return trimmed || "не заполнено";
}

function formatParagraph(value) {
  const trimmed = String(value || "").trim();
  return trimmed || "не заполнено";
}

function toMarkdownBullets(items) {
  if (!Array.isArray(items) || !items.length) {
    return ["- не заполнено"];
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
