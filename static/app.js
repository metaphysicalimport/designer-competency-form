const STORAGE_KEY = "designer-competency-app-v5";
const OPTION_LABELS = ["a", "b", "c", "d", "e"];
const GRADE_OPTIONS = ["14", "15", "16", "17", "18"];
const TEXT_DOCUMENT_PATTERN = /\.(txt|md|markdown|csv|json|log|rtf|yaml|yml|xml|html?|css|js|ts|tsx|jsx)$/i;
const BUNDLED_ATTACHMENT_ID = "builtin-product-designer-competencies";
const BUNDLED_ATTACHMENT_NAME = "компетенции продуктового дизайнера.md";
const BUNDLED_ATTACHMENT_URL = new URL("./product-designer-competencies.md", window.location.href).toString();
const SERVER_EVALUATION_URL = "/api/evaluate";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-4.1";
const OPENAI_KEY_STORAGE = "designer-competency-openai-key-v1";
const EVALUATION_INSTRUCTIONS = `
проанализируй содержимое анкеты, критерии карты компетенции, и подготовь оценку дизайнера, его грейд и точки роста.

верни результат в markdown на русском языке.

структура ответа:
# оценка дизайнера

## итог
- рекомендуемый грейд
- уверенность в оценке
- краткий вывод

## обоснование грейда

## сильные стороны

## точки роста

## риски и пробелы в данных

## рекомендации для следующего шага
`.trim();

const AXES = [
  {
    id: "complexity_of_tasks",
    title: "сложность задач",
    description: "с какими по масштабу и степени неопределенности задачами дизайнер устойчиво справляется на практике",
    prompts: [],
    options: {
      14: "уверенно работает с понятными задачами внутри проекта, где ясны цель, рамки и ожидаемый результат",
      15: "может самостоятельно разобраться в не до конца ясной задаче внутри проекта и довести ее до результата",
      16: "может вести крупные куски проекта в рамках своей кроссфункциональной команды - с по, пм, дев и кью-а",
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
      15: "может аргументировать свои решения и договариваться с по, пм, дев и кью-а в рамках проекта",
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
    stage: "дискавери этап",
    title: "генерация решений и сценарное мышление",
    bullets: [
      "умеет смотреть на задачу целиком, а не только на отдельный экран",
      "предлагает несколько осмысленных вариантов решения, а не первый очевидный",
      "видит последствия решений в соседних состояниях, переходах и флоу"
    ]
  },
  {
    id: "aesthetics_ui",
    stage: "дискавери этап",
    title: "эстетика",
    bullets: [
      "чувствует визуальную планку продукта и умеет собирать цельные, аккуратные и выразительные интерфейсы",
      "работает с типографикой, цветом, композицией, ритмом и компонентами не формально, а как с частью качества решения",
      "держит связь между продуктом, брендом и визуальным языком",
      "умеет искать релевантные рефы и на их основе собирать собственное решение, а не копировать чужое",
      "на этапе поиска решения не сводит работу только к функциональности, а думает и про лук-энд-фил"
    ]
  },
  {
    id: "user_research",
    stage: "дискавери этап",
    title: "юзер ресерч",
    bullets: [
      "умеет сформулировать, что именно нужно проверить и зачем",
      "может собрать базовый план ресерча - гипотезы, формат, вопросы, сценарий проведения",
      "выделяет из наблюдений и ответов понятные инсайты, а не просто пересказывает материал",
      "переводит результаты ресерча в рекомендации для продукта и дизайна",
      "умеет донести выводы до команды так, чтобы они повлияли на решения"
    ]
  },
  {
    id: "frameworks_analytics",
    stage: "дискавери этап",
    title: "продуктовое мышление и аналитика",
    bullets: [
      "умеет связывать дизайн-решения с целями продукта, пользовательской ценностью и метриками",
      "понимает, какие данные помогают принять решение, и умеет на них опираться",
      "может использовать фреймворки приоритизации и структурирования, если это помогает команде сфокусироваться",
      "не просто смотрит на цифры, а умеет делать из них выводы для продукта и дизайна",
      "видит не только качество интерфейса, но и влияние решения на продукт целиком"
    ]
  },
  {
    id: "design_pitching",
    stage: "дискавери этап",
    title: "дизайн питчинг",
    bullets: [
      "умеет ясно объяснять логику своих решений",
      "может защищать решение через аргументы, а не через вкус или давление",
      "учитывает контекст стейкхолдеров и подбирает понятный для них способ подачи",
      "умеет обсуждать альтернативы и ограничения без потери сути решения",
      "может продвигать сильное решение даже в сложной коммуникационной среде"
    ]
  },
  {
    id: "empathy_compromises",
    stage: "дискавери этап",
    title: "эмпатия и взаимодействие",
    bullets: [
      "слышит ограничения команды и продукта, не теряя при этом планку качества",
      "умеет искать консенсус, который сохраняет смысл решения, а не просто упрощает его",
      "не застревает в позиции \"либо идеально, либо никак\"",
      "ищет обходные пути, если появляются блокеры по срокам, ресурсам или технологии",
      "умеет договариваться так, чтобы команда двигалась вперед, а качество не разваливалось"
    ]
  },
  {
    id: "critique_response",
    stage: "дискавери этап",
    title: "работа с фидбэком",
    bullets: [
      "спокойно принимает фидбэк и не уходит в защиту там, где нужно услышать суть",
      "умеет отделять оценку решения от оценки себя",
      "может переосмыслить решение после обратной связи, если аргументы сильные",
      "не цепляется за первую версию только потому, что уже вложился в нее",
      "использует фидбэк как способ усилить решение, а не как формальную помеху"
    ]
  },
  {
    id: "work_speed",
    stage: "деливери этап",
    title: "эффективность работы",
    bullets: [
      "умеет двигаться с хорошей скоростью без заметной просадки по качеству",
      "не тратит лишнее время на очевидные вещи и умеет выбирать нужную глубину проработки",
      "использует подходы и инструменты, которые реально ускоряют работу и улучшают результат",
      "по мере роста задач повышает не только скорость, но и личную эффективность",
      "умеет держать темп на дистанции, а не только в режиме разового рывка"
    ]
  },
  {
    id: "flow_detailing",
    stage: "деливери этап",
    title: "проработка флоу и системность",
    bullets: [
      "прорабатывает основные и пограничные сценарии, состояния и ошибки",
      "думает о связности флоу, а не только о ключевом хэппи пассе",
      "учитывает платформенные гайдлайны, продуктовые паттерны и дизайн-систему",
      "умеет формулировать или дособирать микрокопи, если это нужно для качества решения",
      "передает решение в разработку в достаточно полном и понятном виде"
    ]
  },
  {
    id: "handoff_and_production",
    stage: "деливери этап",
    title: "хэнд-офф и ответственность за прод",
    bullets: [
      "не считает задачу законченной на этапе макетов",
      "сопровождает решение в разработке и участвует в дизайн-ревью по ходу реализации",
      "замечает расхождения между макетами и продом и помогает их исправлять",
      "если в реализации появляются ограничения, умеет вместе с командой находить достойные альтернативы",
      "держит ответственность за качество решения до момента, когда оно реально заработало в продукте"
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
  attachments: [],
  evaluation: {
    status: "idle",
    fileName: "",
    content: ""
  },
  error: ""
};

let state = loadState();
const app = document.getElementById("app");
let bundledDefaultAttachment = null;

init();

async function init() {
  await ensureBundledDefaultAttachment();
  persistState();
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
      evaluation: {
        ...cloneDefaultState().evaluation,
        ...(parsed.evaluation || {})
      },
      attachments: Array.isArray(parsed.attachments)
        ? parsed.attachments.map(sanitizeAttachment).filter(Boolean)
        : [],
      optionOrder: buildOptionOrderMap()
    };

    if (!nextState.profile.designerRole || nextState.profile.designerRole === "product designer") {
      nextState.profile.designerRole = cloneDefaultState().profile.designerRole;
    }

    nextState.attachments = mergeDefaultAttachments(nextState.attachments);

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
      const levels = Object.keys(axis.options)
        .map(Number)
        .sort((left, right) => left - right);

      return [axis.id, levels];
    })
  );
}

function persistState() {
  const snapshot = {
    ...state,
    profile: { ...state.profile },
    axes: JSON.parse(JSON.stringify(state.axes)),
    idealRatings: JSON.parse(JSON.stringify(state.idealRatings)),
    evaluation: { ...state.evaluation },
    attachments: JSON.parse(JSON.stringify(state.attachments || [])),
    optionOrder: JSON.parse(JSON.stringify(state.optionOrder))
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch (error) {
    state.error =
      "не удалось сохранить форму в браузере. возможно, загруженные приложения слишком большие для локального хранения.";
    return false;
  }
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

    <section class="section-divider">
      <h2 class="section-divider-title">общая оценка</h2>
    </section>

    ${AXES.map(renderAxisCard).join("")}

    <section class="section-divider">
      <h2 class="section-divider-title">оценка по навыкам</h2>
    </section>

    ${renderIdealDesignerSections()}

    <section class="profile-card">
      <h2>дополнительные заметки</h2>
      <p class="field-help">
        сюда можно добавить крупные кейсы, сомнения по калибровке, сильные стороны,
        обратную связь от pm или разработки и любые наблюдения, которые важно не потерять.
      </p>
      <div class="textarea-field">
        <label for="general-notes">комментарий</label>
        <textarea id="general-notes" data-field="generalNotes" placeholder="например: сильные стороны, зоны роста, важные наблюдения, сомнения по калибровке или дополнительные сигналы, которые стоит учесть в оценке.">${escapeHtml(state.generalNotes)}</textarea>
      </div>
      <div class="file-upload-stack">
        <label for="notes-attachments">текстовые приложения</label>
        <p class="field-help">
          можно загрузить несколько текстовых документов. их содержимое автоматически
          попадет в анкету и экспорт как отдельные приложения.
        </p>
        <div class="file-upload-row">
          <label class="button file-trigger" for="notes-attachments">выбрать файлы</label>
        </div>
        <input
          id="notes-attachments"
          class="file-input file-input--hidden"
          type="file"
          data-attachments-input
          accept=".txt,.md,.markdown,.csv,.json,.log,.rtf,.yaml,.yml,.xml,.html,.htm,.css,.js,.ts,.tsx,.jsx,text/*"
          multiple
        />
      </div>
      ${renderAttachmentList()}
    </section>

    <section class="submit-bar">
      <div class="meta-row">
        <span class="mini-chip">${progress}% заполнено</span>
      </div>
      <div class="action-row">
        ${renderEvaluateAction()}
        <button class="button button-stroke" id="export-markdown-button" type="button">экспортировать анкету</button>
      </div>
      <p class="footer-note">
        в файл попадут контекст оценки, вопросы, выбранные ответы, оценки по навыкам,
        комментарии и загруженные приложения.
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
      ([stage, sections]) => `
        <section class="profile-card">
          <h2 class="subsection-title">${escapeHtml(stage)}</h2>
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

function renderEvaluateAction() {
  const evaluation = state.evaluation || cloneDefaultState().evaluation;

  if (evaluation.status === "loading") {
    return `
      <div class="loader-box" aria-live="polite">
        <span class="loader-spinner" aria-hidden="true"></span>
        <span>готовим оценку...</span>
      </div>
    `;
  }

  if (evaluation.status === "done" && evaluation.content) {
    return `
      <button class="button button-success" id="download-evaluation-button" type="button">
        скачать результат
      </button>
    `;
  }

  return `
    <button class="button" id="evaluate-button" type="button">получить оценку</button>
  `;
}

function renderAttachmentList() {
  const attachments = Array.isArray(state.attachments) ? state.attachments : [];
  if (!attachments.length) {
    return "";
  }

  return `
    <div class="attachment-list">
      ${attachments.map((attachment, index) => renderAttachmentCard(attachment, index)).join("")}
    </div>
  `;
}

function renderAttachmentCard(attachment, index) {
  return `
    <section class="attachment-card">
      <div class="attachment-card-head">
        <div class="attachment-card-copy">
          <span class="eyebrow-soft">приложение ${index + 1}</span>
          <h3>${escapeHtml(attachment.name)}</h3>
        </div>
        ${attachment.locked
          ? ""
          : `
            <button
              class="button-secondary"
              type="button"
              data-remove-attachment="${escapeHtml(attachment.id)}"
            >
              удалить
            </button>
          `}
      </div>
      <pre class="attachment-content">${escapeHtml(attachment.content)}</pre>
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

  const attachmentsInput = document.querySelector("[data-attachments-input]");
  if (attachmentsInput) {
    attachmentsInput.addEventListener("change", handleAttachmentUpload);
  }

  document.querySelectorAll("[data-remove-attachment]").forEach((node) => {
    node.addEventListener("click", handleAttachmentRemove);
  });

  const exportMarkdownButton = document.getElementById("export-markdown-button");
  if (exportMarkdownButton) {
    exportMarkdownButton.addEventListener("click", exportMarkdown);
  }

  const evaluateButton = document.getElementById("evaluate-button");
  if (evaluateButton) {
    evaluateButton.addEventListener("click", requestEvaluation);
  }

  const downloadEvaluationButton = document.getElementById("download-evaluation-button");
  if (downloadEvaluationButton) {
    downloadEvaluationButton.addEventListener("click", downloadEvaluationResult);
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
  clearEvaluationResult();
  if (!persistState()) {
    render();
  }
}

function handleEvidenceInput(event) {
  const axisId = event.target.dataset.evidenceAxis;
  state.axes[axisId].evidence = event.target.value;
  state.error = "";
  clearEvaluationResult();
  if (!persistState()) {
    render();
  }
}

function handleRatingScoreChange(event) {
  const sectionId = event.target.dataset.ratingSection;
  state.idealRatings[sectionId].score = Number(event.target.value);
  state.error = "";
  clearEvaluationResult();
  persistState();
  render();
}

function handleRatingCommentInput(event) {
  const sectionId = event.target.dataset.ratingComment;
  state.idealRatings[sectionId].comment = event.target.value;
  state.error = "";
  clearEvaluationResult();
  if (!persistState()) {
    render();
  }
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
  clearEvaluationResult();
  persistState();
  render();
}

async function handleAttachmentUpload(event) {
  const input = event.target;
  const files = Array.from(input.files || []);
  if (!files.length) {
    return;
  }

  const previousAttachments = Array.isArray(state.attachments) ? [...state.attachments] : [];
  state.error = "";
  clearEvaluationResult();

  try {
    const invalidFile = files.find((file) => !isTextDocument(file));
    if (invalidFile) {
      throw new Error(
        `файл "${invalidFile.name}" не похож на текстовый документ. загрузи txt, md, csv, json или другой text-файл.`
      );
    }

    const nextAttachments = await Promise.all(files.map(readTextAttachment));
    state.attachments = mergeDefaultAttachments([...previousAttachments, ...nextAttachments]);

    if (!persistState()) {
      state.attachments = previousAttachments;
      persistState();
    }
  } catch (error) {
    state.attachments = previousAttachments;
    state.error = error.message || "не удалось прочитать загруженные документы.";
    persistState();
  }

  input.value = "";
  render();
}

function handleAttachmentRemove(event) {
  const attachmentId = event.currentTarget.dataset.removeAttachment;
  if (attachmentId === BUNDLED_ATTACHMENT_ID) {
    return;
  }

  state.attachments = mergeDefaultAttachments(
    (state.attachments || []).filter((attachment) => attachment.id !== attachmentId)
  );
  state.error = "";
  clearEvaluationResult();
  persistState();
  render();
}

async function requestEvaluation() {
  const cardMarkdown = buildMarkdownExport();
  state.error = "";
  state.evaluation = {
    status: "loading",
    fileName: "",
    content: ""
  };
  persistState();
  render();

  try {
    const evaluation = shouldUseServerEvaluation()
      ? await requestServerEvaluation(cardMarkdown)
      : await requestClientEvaluation(cardMarkdown);

    state.evaluation = evaluation;
    state.error = "";
  } catch (error) {
    const errorMessage =
      error instanceof TypeError
        ? "браузер не смог отправить запрос в OpenAI. проверь сеть, доступность api.openai.com и возможную блокировку по региону."
        : error.message || "не удалось получить оценку.";

    state.evaluation = {
      status: "idle",
      fileName: "",
      content: ""
    };
    state.error = errorMessage;
  }

  persistState();
  render();
}

function shouldUseServerEvaluation() {
  return !window.location.hostname.endsWith("github.io");
}

async function requestServerEvaluation(cardMarkdown) {
  const response = await fetch(SERVER_EVALUATION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      card_markdown: cardMarkdown
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `не удалось получить оценку. статус ответа: ${response.status}`);
  }

  return {
    status: "done",
    fileName: payload.file_name || "designer-assessment-result.md",
    content: String(payload.content || "")
  };
}

async function requestClientEvaluation(cardMarkdown) {
  const apiKey = await getOpenAIApiKey();
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions: EVALUATION_INSTRUCTIONS,
      input: cardMarkdown
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(extractOpenAIErrorMessage(payload, response.status));
  }

  const content = extractEvaluationText(payload);
  if (!content) {
    throw new Error("OpenAI не вернул текст результата.");
  }

  return {
    status: "done",
    fileName: "designer-assessment-result.md",
    content
  };
}

function downloadEvaluationResult() {
  const evaluation = state.evaluation || {};
  if (!evaluation.content) {
    state.error = "результат оценки пока недоступен.";
    persistState();
    render();
    return;
  }

  downloadTextFile(
    evaluation.fileName || "designer-assessment-result.md",
    evaluation.content,
    "text/markdown;charset=utf-8"
  );
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

async function resetForm() {
  const shouldReset = window.confirm("сбросить все поля формы и удалить сохраненные ответы?");
  if (!shouldReset) {
    return;
  }

  state = cloneDefaultState();
  await ensureBundledDefaultAttachment();
  persistState();
  render();
}

function buildMarkdownExport() {
  const lines = [
    "# карточка",
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
    "## общая оценка",
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
        return `- [${marker}] ${optionLabel}: ${statement}`;
      })
    );
    lines.push("");
    lines.push("комментарий:");
    lines.push("");
    lines.push(formatParagraph(axisState.evidence));
    lines.push("");
  });

  lines.push("## оценка по навыкам");
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

  (state.attachments || []).forEach((attachment, index) => {
    lines.push(`### приложение ${index + 1} - ${attachment.name}`);
    lines.push("");
    lines.push(formatAttachmentContent(attachment.content));
    lines.push("");
  });

  return lines.join("\n");
}

function buildExportFileName() {
  const designerName = state.profile.designerName || "designer";
  return `designer-review-${slugifyFileName(designerName)}.md`;
}

function clearEvaluationResult() {
  state.evaluation = {
    status: "idle",
    fileName: "",
    content: ""
  };
}

async function getOpenAIApiKey() {
  const storedKey = getStoredOpenAIApiKey();
  if (storedKey) {
    return storedKey;
  }

  const promptedKey = window.prompt("вставь OpenAI API key для получения оценки");
  const normalizedKey = String(promptedKey || "").trim();
  if (!normalizedKey) {
    throw new Error("OpenAI API key не указан.");
  }

  setStoredOpenAIApiKey(normalizedKey);
  return normalizedKey;
}

function getStoredOpenAIApiKey() {
  try {
    return localStorage.getItem(OPENAI_KEY_STORAGE) || "";
  } catch (error) {
    return "";
  }
}

function setStoredOpenAIApiKey(value) {
  try {
    localStorage.setItem(OPENAI_KEY_STORAGE, value);
  } catch (error) {
    return;
  }
}

function extractEvaluationText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  const parts = [];
  output.forEach((item) => {
    const content = Array.isArray(item.content) ? item.content : [];
    content.forEach((entry) => {
      if (entry?.type === "output_text" && typeof entry.text === "string") {
        parts.push(entry.text);
      }
    });
  });

  return parts.join("\n").trim();
}

function extractOpenAIErrorMessage(payload, status) {
  const apiError = payload?.error;
  if (typeof apiError === "string" && apiError.trim()) {
    return apiError;
  }

  if (apiError && typeof apiError === "object") {
    const message = String(apiError.message || "").trim();
    const code = String(apiError.code || "").trim();
    const type = String(apiError.type || "").trim();
    const parts = [message, code, type].filter(Boolean);
    if (parts.length) {
      return parts.join(" | ");
    }
  }

  return `не удалось получить оценку. статус ответа: ${status}`;
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

function formatAttachmentContent(value) {
  const normalized = normalizeTextContent(value).trim();
  return normalized || "не заполнено";
}

function toMarkdownBullets(items) {
  if (!Array.isArray(items) || !items.length) {
    return ["- не заполнено"];
  }

  return items.map((item) => `- ${item}`);
}

function sanitizeAttachment(attachment, index = 0) {
  if (!attachment || typeof attachment !== "object") {
    return null;
  }

  return {
    id: String(attachment.id || buildAttachmentId()),
    name: String(attachment.name || `документ-${index + 1}.txt`).trim() || `документ-${index + 1}.txt`,
    content: normalizeTextContent(attachment.content),
    locked: Boolean(attachment.locked)
  };
}

async function ensureBundledDefaultAttachment() {
  try {
    if (!bundledDefaultAttachment) {
      const response = await fetch(BUNDLED_ATTACHMENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`не удалось загрузить встроенное приложение: ${response.status}`);
      }

      bundledDefaultAttachment = sanitizeAttachment({
        id: BUNDLED_ATTACHMENT_ID,
        name: BUNDLED_ATTACHMENT_NAME,
        content: await response.text(),
        locked: true
      });
    }

    state.attachments = mergeDefaultAttachments(state.attachments);
  } catch (error) {
    console.error(error);
  }
}

function mergeDefaultAttachments(attachments) {
  const normalized = Array.isArray(attachments) ? attachments.map(sanitizeAttachment).filter(Boolean) : [];
  if (!bundledDefaultAttachment) {
    return normalized;
  }

  return [
    bundledDefaultAttachment,
    ...normalized.filter((attachment) => attachment.id !== bundledDefaultAttachment.id)
  ];
}

function isTextDocument(file) {
  return file.type.startsWith("text/") || TEXT_DOCUMENT_PATTERN.test(file.name);
}

async function readTextAttachment(file) {
  const content = await file.text();
  return {
    id: buildAttachmentId(),
    name: file.name || "документ.txt",
    content: normalizeTextContent(content)
  };
}

function buildAttachmentId() {
  return `attachment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTextContent(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
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
