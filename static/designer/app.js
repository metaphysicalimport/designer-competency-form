const STORAGE_KEY = "designer-self-questionnaire-v2";
const TEXT_DOCUMENT_PATTERN = /\.(txt|md|markdown|csv|json|log|rtf|yaml|yml|xml|html?|css|js|ts|tsx|jsx)$/i;
const SERVER_TRACKER_CONTEXT_URL = "/api/tracker_context";
const TRACKER_TOKEN_STORAGE = "designer-questionnaire-tracker-token-v1";
const TRACKER_NAME_LOGIN_MAP = {
  [normalizeTrackerName("рома жигарёв")]: "roma-zhigarev",
  [normalizeTrackerName("рома жигарев")]: "roma-zhigarev",
  [normalizeTrackerName("тимур матвеев")]: "timur57",
  [normalizeTrackerName("алина рябова")]: "alineria"
};
const SERVER_TRANSCRIPTION_URL = "/api/transcribe";
const MAX_AUDIO_BYTES = 64 * 1024 * 1024;
const MAX_TRANSCRIPTION_CHUNK_BYTES = 3 * 1024 * 1024;
const TOUCH_PROGRESS_DOCK_QUERY = "(pointer: coarse)";
const MEDIA_RECORDER_TIMESLICE_MS = 10_000;
const TRANSCRIPTION_WAV_SAMPLE_RATE = 16_000;
const WAV_HEADER_BYTES = 44;
const VOICE_DRAFTS_DB_NAME = "designer-voice-drafts";
const VOICE_DRAFTS_STORE_NAME = "drafts";
const BUNDLED_ATTACHMENTS = [];

const MICROPHONE_ICON = `
  <svg class="button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8V4.5C10.5 3.11929 9.38071 2 8 2C6.61929 2 5.5 3.11929 5.5 4.5V8C5.5 9.38071 6.61929 10.5 8 10.5Z" stroke="currentColor" stroke-width="1.25"/>
    <path d="M3.5 7.5V8C3.5 10.4853 5.51472 12.5 8 12.5M12.5 7.5V8C12.5 10.4853 10.4853 12.5 8 12.5M8 12.5V14" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>
  </svg>
`;
const TRASH_ICON = `
  <svg class="button-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M4.5 6H13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M7 8.25V12.25" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M11 8.25V12.25" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M6.25 3.75H11.75" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M5.25 6L5.7 13.04C5.76 13.93 6.5 14.62 7.39 14.62H10.61C11.5 14.62 12.24 13.93 12.3 13.04L12.75 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const REFLECTION_QUESTIONS = [
  {
    id: "memorable_tasks",
    title: "какие задачи за этот период были для тебя самыми запоминающимися? почему?",
    placeholder: "опиши конкретные кейсы и что именно сделало их важными для тебя."
  },
  {
    id: "proud_results",
    title: "какими задачами или результатами ты больше всего гордишься?",
    placeholder: "сфокусируйся на том, что получилось особенно хорошо и в чем была твоя роль."
  },
  {
    id: "difficult_cases",
    title: "были ли задачи, которые прошли не так, как хотелось? в чем была сложность?",
    placeholder: "опиши, что происходило, почему было сложно и что ты из этого вынес."
  }
];

const MAIN_QUESTIONS = [
  {
    id: "q1",
    title: "вопрос 1",
    prompt:
      "вспомни задачи, над которыми ты работал(а) в последнее время. как они обычно у тебя появляются — с чем ты приходишь в работу на старте?",
    placeholder: "опиши, кто приносит задачу, насколько она сформулирована и что обычно уже известно на старте."
  },
  {
    id: "q2",
    title: "вопрос 2",
    prompt:
      "если задача сформулирована не до конца или в ней есть белые пятна, как ты обычно действуешь? как ты превращаешь ее в понятную рабочую задачу?",
    placeholder: "опиши свой подход: что уточняешь, с кем синхронизируешься, что фиксируешь."
  },
  {
    id: "q3",
    title: "вопрос 3",
    prompt:
      "какой самый крупный кусок работы ты брал(а) на себя за последнее время? что именно ты вел(а) и где заканчивалась твоя зона ответственности?",
    placeholder: "важно показать масштаб работы и границы своей ответственности."
  },
  {
    id: "q4",
    title: "вопрос 4",
    prompt:
      "были ли у тебя задачи, где нужно было учитывать несколько частей продукта, зависимостей или работать параллельно с несколькими направлениями? как ты принимал(а) решения в таких ситуациях?",
    placeholder: "опиши, как собирал(а) контекст, раскладывал(а) ограничения и принимал(а) решения."
  },
  {
    id: "q5",
    title: "вопрос 5",
    prompt:
      "вспомни ситуации, где тебе приходилось принимать решения без полной информации или подтвержденного направления. на что ты опирался(ась) и как двигал(а) работу дальше?",
    placeholder: "расскажи, что помогало принимать решение при неполных данных."
  },
  {
    id: "q6",
    title: "вопрос 6",
    prompt:
      "бывали ли ситуации, когда в процессе работы ты понимал(а), что нужно сделать что-то еще, помимо изначальной задачи? что ты делал(а) в таких случаях?",
    placeholder: "опиши, как замечал(а) дополнительный объем и что происходило дальше."
  },
  {
    id: "q7",
    title: "вопрос 7",
    prompt:
      "вспомни, были ли у тебя кейсы, когда ты предлагал(а) начать отдельную задачу, инициативу или кусок работы, которого изначально не было. откуда это возникло и что происходило дальше?",
    placeholder: "покажи, что именно ты заметил(а), предложил(а) и чем это закончилось."
  },
  {
    id: "q8",
    title: "вопрос 8",
    prompt:
      "были ли у тебя ситуации, когда никто не формулировал конкретную задачу, а было только общее направление или сигнал, что что-то работает не так? как ты действовал(а) и к чему это приводило?",
    placeholder: "опиши путь от слабого сигнала к более конкретной работе."
  },
  {
    id: "q9",
    title: "вопрос 9",
    prompt:
      "вспомни решения, которые ты принимал(а). на что они в итоге повлияли — внутри задачи, проекта или шире?",
    placeholder: "зафиксируй реальный масштаб влияния, а не только список действий."
  },
  {
    id: "q10",
    title: "вопрос 10",
    prompt:
      "как обычно строится твое взаимодействие с командой (PO, PM, разработка, другие дизайнеры) при принятии решений? в каких ситуациях ты влияешь на решения других?",
    placeholder: "опиши формат взаимодействия, как доносишь позицию и где действительно влияешь на выбор."
  },
  {
    id: "q11",
    title: "вопрос 11",
    prompt:
      "как ты понимаешь, за что ты отвечаешь в своей работе? что происходит после того, как задача или проект завершен?",
    placeholder: "расскажи, как ты смотришь на ответственность до и после релиза."
  },
  {
    id: "q12",
    title: "вопрос 12",
    prompt:
      "были ли у тебя ситуации, когда ты видел(а) проблему или возможность шире, чем текущие задачи, и предлагал(а), что с этим делать? как ты это формулировал(а) и к чему это приводило?",
    placeholder: "опиши, как замечал(а) более широкий контекст и как переводил(а) его в действие."
  }
];

const MASTERY_OPTIONS = [
  { value: "1", label: "не про меня" },
  { value: "2", label: "про меня, но не всё" },
  { value: "3", label: "точно про меня" },
  { value: "4", label: "всё это и даже больше" }
];

const DESIGN_MASTERY_SECTIONS = [
  {
    id: "solution_generation",
    stage: "дискавери этап",
    title: "генерация решений и сценарное мышление",
    bullets: [
      "умею смотреть на задачу целиком, а не только на отдельный экран",
      "предлагаю несколько осмысленных вариантов решения, а не первый очевидный",
      "вижу последствия решений в соседних состояниях, переходах и флоу"
    ]
  },
  {
    id: "aesthetics",
    stage: "дискавери этап",
    title: "эстетика",
    bullets: [
      "чувствую визуальную планку продукта и умею собирать цельные, аккуратные и выразительные интерфейсы",
      "работаю с типографикой, цветом, композицией, ритмом и компонентами как с частью качества решения",
      "думаю не только про функциональность, но и про look and feel"
    ]
  },
  {
    id: "user_research",
    stage: "дискавери этап",
    title: "юзер ресерч",
    bullets: [
      "умею сформулировать, что именно нужно проверить и зачем",
      "могу собрать базовый план ресерча: гипотезы, формат, вопросы, сценарий",
      "перевожу результаты ресерча в рекомендации для продукта и дизайна"
    ]
  },
  {
    id: "product_thinking",
    stage: "дискавери этап",
    title: "продуктовое мышление и аналитика",
    bullets: [
      "связываю дизайн-решения с целями продукта, пользовательской ценностью и метриками",
      "понимаю, какие данные помогают принять решение, и умею на них опираться",
      "вижу не только качество интерфейса, но и влияние решения на продукт целиком"
    ]
  },
  {
    id: "design_pitching",
    stage: "дискавери этап",
    title: "дизайн-питчинг",
    bullets: [
      "умею ясно объяснять логику своих решений",
      "могу защищать решение через аргументы, а не через вкус",
      "умею обсуждать альтернативы и ограничения без потери сути решения"
    ]
  },
  {
    id: "feedback_and_collaboration",
    stage: "дискавери этап",
    title: "эмпатия, компромиссы и работа с фидбэком",
    bullets: [
      "слышу ограничения команды и продукта, не теряя планку качества",
      "спокойно принимаю фидбэк и умею переосмыслять решение, если аргументы сильные",
      "ищу рабочий компромисс, который сохраняет смысл решения"
    ]
  },
  {
    id: "work_speed",
    stage: "деливери этап",
    title: "эффективность работы",
    bullets: [
      "двигаюсь с хорошей скоростью без заметной просадки по качеству",
      "умею выбирать нужную глубину проработки",
      "держу темп на дистанции, а не только в режиме разового рывка"
    ]
  },
  {
    id: "flow_detailing",
    stage: "деливери этап",
    title: "проработка флоу и системность",
    bullets: [
      "прорабатываю основные и пограничные сценарии, состояния и ошибки",
      "думаю о связности флоу, а не только о хэппи-пассе",
      "передаю решение в разработку в полном и понятном виде"
    ]
  },
  {
    id: "handoff_and_production",
    stage: "деливери этап",
    title: "хэнд-офф и ответственность за прод",
    bullets: [
      "не считаю задачу законченной на этапе макетов",
      "сопровождаю решение в разработке и участвую в дизайн-ревью",
      "держу ответственность за качество решения до момента, когда оно реально заработало в продукте"
    ]
  }
];

const SUPERPOWER_QUESTIONS = [
  {
    id: "requests",
    title: "с какими задачами или вопросами к тебе чаще всего приходят?",
    placeholder: "опиши, в чем тебя чаще всего подключают и почему."
  },
  {
    id: "gratitude",
    title: "за что тебя чаще всего благодарят или отмечают?",
    placeholder: "перечисли повторяющиеся сигналы от команды и партнеров."
  },
  {
    id: "difference",
    title: "в чем команда почувствовала бы наибольшую разницу, если бы тебя не было в команде?",
    placeholder: "что ты усиливаешь сильнее всего в повседневной работе."
  },
  {
    id: "consistency",
    title: "видно ли, что это проявляется регулярно?",
    placeholder: "приведи примеры повторяемости, а не единичного сильного кейса."
  }
];

const DEFAULT_STATE = {
  profile: {
    reviewType: "",
    designerName: "",
    teamOrDirection: "",
    assessmentStartDate: getDefaultPeriodRange("3m").startDate,
    assessmentEndDate: getDefaultPeriodRange("3m").endDate,
    periodTaskContext: ""
  },
  reflection: Object.fromEntries(REFLECTION_QUESTIONS.map((question) => [question.id, ""])),
  mainQuestions: Object.fromEntries(MAIN_QUESTIONS.map((question) => [question.id, ""])),
  designMastery: Object.fromEntries(
    DESIGN_MASTERY_SECTIONS.map((section) => [
      section.id,
      {
        score: "",
        comment: ""
      }
    ])
  ),
  superpower: Object.fromEntries(SUPERPOWER_QUESTIONS.map((question) => [question.id, ""])),
  tracker: {
    content: "",
    warning: ""
  },
  voiceDrafts: {},
  attachments: [],
  error: ""
};

let state = loadState();
let bundledDefaultAttachments = [];
let attachmentProcessingStatus = "";
let trackerLoading = false;
const app = document.getElementById("app");
const voiceRecorder = {
  status: "idle",
  targetFieldId: "",
  error: "",
  progressLabel: ""
};
let activeMediaRecorder = null;
let activeMediaStream = null;
let activeMediaChunks = [];
let activeMediaMimeType = "";

init();

async function init() {
  window.addEventListener("scroll", syncProgressDockOffset, { passive: true });
  window.addEventListener("resize", syncProgressDockOffset, { passive: true });
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
      reflection: {
        ...cloneDefaultState().reflection,
        ...(parsed.reflection || {})
      },
      mainQuestions: {
        ...cloneDefaultState().mainQuestions,
        ...(parsed.mainQuestions || {})
      },
      designMastery: {
        ...cloneDefaultState().designMastery,
        ...(parsed.designMastery || {})
      },
      superpower: {
        ...cloneDefaultState().superpower,
        ...(parsed.superpower || {})
      },
      tracker: {
        ...cloneDefaultState().tracker,
        ...(parsed.tracker || {})
      },
      voiceDrafts: {
        ...cloneDefaultState().voiceDrafts,
        ...(parsed.voiceDrafts || {})
      },
      attachments: Array.isArray(parsed.attachments)
        ? parsed.attachments.map(sanitizeAttachment).filter(Boolean)
        : []
    };

    nextState.attachments = mergeDefaultAttachments(nextState.attachments);
    normalizeAssessmentPeriodRange(nextState.profile);
    return nextState;
  } catch (error) {
    return cloneDefaultState();
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function persistState() {
  const snapshot = {
    ...state,
    profile: { ...state.profile },
    reflection: { ...state.reflection },
    mainQuestions: { ...state.mainQuestions },
    designMastery: JSON.parse(JSON.stringify(state.designMastery)),
    superpower: { ...state.superpower },
    tracker: { ...state.tracker },
    voiceDrafts: { ...state.voiceDrafts },
    attachments: JSON.parse(JSON.stringify(state.attachments || []))
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch (error) {
    state.error =
      "не удалось сохранить анкету в браузере. возможно, приложений стало слишком много для локального хранения.";
    return false;
  }
}

function countFilledValues(scope, keys) {
  return keys.filter((key) => String(scope?.[key] || "").trim()).length;
}

function getAnsweredCount() {
  let count = 0;

  count += countFilledValues(state.reflection, REFLECTION_QUESTIONS.map((question) => question.id));
  count += countFilledValues(state.mainQuestions, MAIN_QUESTIONS.map((question) => question.id));
  count += countFilledValues(state.superpower, SUPERPOWER_QUESTIONS.map((question) => question.id));
  count += Number(Boolean(String(state.profile.periodTaskContext || "").trim()));
  count += DESIGN_MASTERY_SECTIONS.filter(
    (section) => Number(state.designMastery?.[section.id]?.score) >= 1
  ).length;

  return count;
}

function getTotalCount() {
  return (
    REFLECTION_QUESTIONS.length +
    MAIN_QUESTIONS.length +
    SUPERPOWER_QUESTIONS.length +
    1 +
    DESIGN_MASTERY_SECTIONS.length
  );
}

function render() {
  const answeredCount = getAnsweredCount();
  const totalCount = getTotalCount();
  const progress = Math.round((answeredCount / totalCount) * 100);

  app.innerHTML = `
    <div class="progress-dock-anchor">
      <section class="progress-dock">
        <div class="progress-dock-head">
          <div class="progress-dock-actions">
            <span class="mini-chip">${progress}% заполнено</span>
            <button class="button button-secondary" id="reset-form-button" type="button">сбросить форму</button>
          </div>
          <span class="progress-copy">заполнено ${answeredCount} из ${totalCount} смысловых блоков</span>
        </div>
        <div class="progress-line">
          <div class="progress-fill" style="width:${progress}%"></div>
        </div>
      </section>
    </div>

    <section class="profile-card intro-card">
      <h2>как заполнять</h2>
      <p class="section-copy">
        анкета нужна, чтобы понять, как ты реально работаешь: с какими задачами сталкиваешься,
        как принимаешь решения, на что влияешь и какой уровень ответственности держишь.
      </p>
      <p class="section-copy">
        лучше меньше, но конкретнее. опирайся на реальные кейсы и показывай свою роль, а не только участие.
      </p>
      <ul class="question-points">
        <li>отвечай честно и по фактам</li>
        <li>опирайся на реальные кейсы</li>
        <li>описывай не разовые ситуации, а то, как ты действуешь регулярно</li>
        <li>не пытайся угадать правильный ответ и не оценивай себя вместо описания опыта</li>
      </ul>
    </section>

    <section class="profile-card">
      <h2>базовая информация</h2>
      <div class="field-grid field-grid--double">
        ${renderInput("reviewType", "тип ревью (pr или mr)", state.profile.reviewType, "например, pr")}
        ${renderInput("designerName", "имя", state.profile.designerName, "например, алина рябова")}
      </div>
      <div class="field-grid field-grid--double field-grid--period">
        ${renderDateInput("assessmentStartDate", "с даты", state.profile.assessmentStartDate)}
        ${renderDateInput("assessmentEndDate", "по дату", state.profile.assessmentEndDate)}
      </div>
      <div class="field-grid">
        ${renderInput(
          "teamOrDirection",
          "команда / направление",
          state.profile.teamOrDirection,
          "например, b2c / рекомендации"
        )}
      </div>
      ${renderCommentField({
        fieldId: "profile-period-task-context",
        label: "контекст задач за период",
        value: state.profile.periodTaskContext,
        placeholder:
          "опиши ключевые проекты, большие куски работы, изменения в контексте, новые зоны ответственности и важные ограничения за период.",
        textareaAttributes: 'data-field="profile.periodTaskContext"'
      })}
    </section>

    <section class="section-divider">
      <h2 class="section-divider-title">часть 1. рефлексия по периоду</h2>
    </section>

    <section class="question-stack">
      ${REFLECTION_QUESTIONS.map((question, index) =>
        renderQuestionCard({
          fieldId: `reflection-${question.id}`,
          eyebrow: `рефлексия ${index + 1}`,
          title: question.title,
          value: state.reflection[question.id],
          placeholder: question.placeholder,
          textareaAttributes: `data-reflection="${question.id}"`
        })
      ).join("")}
    </section>

    <section class="section-divider">
      <h2 class="section-divider-title">часть 2. список задач</h2>
    </section>

    <section class="profile-card">
      <h2>список задач</h2>
      <p class="section-copy">
        выгрузка из трекера по токену задач за выбранный период.
      </p>
      ${renderTrackerTokenInput()}
      <div class="action-row">
        <button class="button" id="fetch-tracker-context-button" type="button" ${trackerLoading ? "disabled" : ""}>
          ${trackerLoading ? "подтягиваем задачи..." : "подтянуть задачи из трекера"}
        </button>
      </div>
      <p class="section-copy">
        после нажатия кнопки форма подтянет задачи дизайнера из Трекера за выбранный период и добавит их в экспорт анкеты.
      </p>
      ${renderTrackerStatus()}
    </section>

    <section class="section-divider">
      <h2 class="section-divider-title">часть 3. основные вопросы</h2>
    </section>

    <section class="question-stack">
      ${MAIN_QUESTIONS.map((question) =>
        renderQuestionCard({
          fieldId: `main-${question.id}`,
          eyebrow: question.title,
          title: question.prompt,
          value: state.mainQuestions[question.id],
          placeholder: question.placeholder,
          textareaAttributes: `data-main-question="${question.id}"`
        })
      ).join("")}
    </section>

    <section class="section-divider">
      <h2 class="section-divider-title">часть 4. мастерство дизайнера</h2>
    </section>

    ${renderDesignMasterySections()}

    <section class="section-divider">
      <h2 class="section-divider-title">часть 5. суперсила</h2>
    </section>

    <section class="question-stack">
      ${SUPERPOWER_QUESTIONS.map((question, index) =>
        renderQuestionCard({
          fieldId: `superpower-${question.id}`,
          eyebrow: `суперсила ${index + 1}`,
          title: question.title,
          value: state.superpower[question.id],
          placeholder: question.placeholder,
          textareaAttributes: `data-superpower="${question.id}"`
        })
      ).join("")}
    </section>

    <section class="profile-card">
      <h2>приложения</h2>
      <p class="section-copy">
        сюда можно добавить дополнительные материалы: заметки, self-review, выгрузки, ссылки, json-архивы и другие текстовые файлы.
      </p>
      <div class="file-upload-stack">
        <div class="file-upload-row">
          <label class="button file-trigger" for="notes-attachments">загрузить файл</label>
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
      ${renderAttachmentProcessingState()}
      ${renderAttachmentList()}
    </section>

    <section class="submit-bar">
      <div class="meta-row">
        <span class="mini-chip">${progress}% заполнено</span>
      </div>
      <div class="action-row">
        <button class="button" id="export-markdown-button" type="button">экспортировать анкету</button>
      </div>
    </section>

    ${state.error ? `<section class="error-box">${escapeHtml(state.error)}</section>` : ""}
  `;

  attachEvents();
  window.requestAnimationFrame(syncProgressDockOffset);
}

function renderQuestionCard({ fieldId, eyebrow, title, note = "", value, placeholder, textareaAttributes }) {
  return `
    <section class="profile-card question-card">
      <div class="question-card-head">
        <span class="eyebrow">${escapeHtml(eyebrow)}</span>
        <h3 class="question-title">${escapeHtml(title)}</h3>
        ${note ? `<p class="question-note">${escapeHtml(note)}</p>` : ""}
      </div>
      ${renderCommentField({
        fieldId,
        label: title,
        value,
        placeholder,
        textareaAttributes
      })}
    </section>
  `;
}

function renderDesignMasterySections() {
  const grouped = DESIGN_MASTERY_SECTIONS.reduce((accumulator, section) => {
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
            ${sections.map(renderMasteryCard).join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function renderMasteryCard(section) {
  const masteryState = state.designMastery?.[section.id] || { score: "", comment: "" };

  return `
    <section class="rating-card">
      <div class="rating-card-head">
        <h3>${escapeHtml(section.title)}</h3>
      </div>
      <ul class="axis-prompts">
        ${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
      </ul>
      <div class="mastery-option-grid">
        ${MASTERY_OPTIONS.map((option) => {
          const isSelected = String(masteryState.score) === option.value;
          return `
            <label class="mastery-option ${isSelected ? "is-selected" : ""}">
              <input
                type="radio"
                name="mastery-${section.id}"
                value="${option.value}"
                data-mastery-score="${section.id}"
                ${isSelected ? "checked" : ""}
              />
              <span>${escapeHtml(option.label)}</span>
            </label>
          `;
        }).join("")}
      </div>
      ${renderCommentField({
        fieldId: `mastery-comment-${section.id}`,
        label: `комментарий по блоку ${section.title}`,
        value: masteryState.comment,
        placeholder: "Добавить пример или короткий комментарий, почему ты так считаешь",
        textareaAttributes: `data-mastery-comment="${section.id}"`
      })}
    </section>
  `;
}

function renderTrackerTokenInput() {
  const hasToken = Boolean(getStoredTrackerToken());

  return `
    <div class="field tracker-token-field">
      <label for="tracker-token">OAuth-токен Трекера</label>
      <div class="tracker-token-controls">
        <input
          id="tracker-token"
          type="text"
          data-tracker-token
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          data-lpignore="true"
          placeholder="${hasToken ? "вставь новый OAuth-токен Трекера" : "вставь OAuth-токен Трекера"}"
        />
        <button
          class="button button-secondary icon-button tracker-token-clear"
          id="clear-tracker-token-button"
          type="button"
          aria-label="удалить токен"
          title="удалить токен"
          ${hasToken ? "" : "disabled"}
        >${TRASH_ICON}</button>
      </div>
      <span class="field-help">
        токен хранится только локально в этом браузере и используется, чтобы подтянуть список задач.
      </span>
    </div>
  `;
}

function renderTrackerStatus() {
  if (state.tracker.warning) {
    return `<section class="tracker-status tracker-status--warning">${escapeHtml(state.tracker.warning)}</section>`;
  }

  if (state.tracker.content) {
    return `
      <section class="tracker-status">
        <div class="field-help">задачи успешно подтянуты и попадут в markdown-экспорт.</div>
        <pre class="attachment-content tracker-preview">${escapeHtml(state.tracker.content)}</pre>
      </section>
    `;
  }

  return "";
}

function renderInput(fieldId, label, value, placeholder) {
  return `
    <div class="field">
      <label for="${fieldId}">${label}</label>
      <input
        id="${fieldId}"
        type="text"
        data-field="profile.${fieldId}"
        value="${escapeHtml(value)}"
        placeholder="${escapeHtml(placeholder)}"
      />
    </div>
  `;
}

function renderDateInput(fieldId, label, value) {
  return `
    <div class="field">
      <label for="${fieldId}">${label}</label>
      <input id="${fieldId}" type="date" data-field="profile.${fieldId}" value="${escapeHtml(value || "")}" />
    </div>
  `;
}

function renderCommentField({ fieldId, label, value, placeholder, textareaAttributes }) {
  const voiceButton = renderVoiceRecorderButton(fieldId);
  const voiceStatus = renderVoiceRecorderStatus(fieldId);
  const voiceRetryActions = renderVoiceDraftActions(fieldId);

  return `
    <div class="textarea-field">
      <label class="sr-only" for="${fieldId}">${escapeHtml(label)}</label>
      <div class="textarea-field-toolbar">
        ${voiceButton}
        ${voiceStatus}
        ${voiceRetryActions}
      </div>
      <textarea id="${fieldId}" aria-label="${escapeHtml(label)}" ${textareaAttributes} placeholder="${escapeHtml(
    placeholder
  )}">${escapeHtml(value)}</textarea>
    </div>
  `;
}

function renderVoiceRecorderButton(fieldId) {
  if (!supportsVoiceRecording()) {
    return `
      <button class="button-secondary voice-trigger" type="button" disabled>
        ${MICROPHONE_ICON}
        <span>записать голосовое</span>
      </button>
    `;
  }

  const isTarget = voiceRecorder.targetFieldId === fieldId;
  const isRecording = isTarget && voiceRecorder.status === "recording";
  const isTranscribing = isTarget && voiceRecorder.status === "transcribing";
  const isBusyElsewhere = voiceRecorder.status !== "idle" && !isTarget;
  const label = isRecording ? "стоп" : isTranscribing ? "обрабатываем..." : "записать голосовое";

  return `
    <button
      class="button-secondary voice-trigger ${isRecording ? "is-recording" : ""}"
      type="button"
      data-voice-trigger="${fieldId}"
      ${isTranscribing || isBusyElsewhere ? "disabled" : ""}
    >
      ${MICROPHONE_ICON}
      <span>${label}</span>
    </button>
  `;
}

function renderVoiceRecorderStatus(fieldId) {
  const isTarget = voiceRecorder.targetFieldId === fieldId;
  const draft = state.voiceDrafts?.[fieldId];
  if (!isTarget) {
    if (draft?.status === "failed" && draft.lastError) {
      return `<span class="voice-status voice-status--error">${escapeHtml(draft.lastError)}</span>`;
    }
    if (draft?.status === "transcribed") {
      return '<span class="voice-status">запись сохранена.</span>';
    }
    if (draft?.status === "saved") {
      return '<span class="voice-status">запись сохранена. можно отправить еще раз.</span>';
    }
    return "";
  }

  if (voiceRecorder.status === "recording") {
    return '<span class="voice-status">идет запись. нажми "стоп", когда закончишь.</span>';
  }

  if (voiceRecorder.status === "transcribing") {
    return `<span class="voice-status">${escapeHtml(
      voiceRecorder.progressLabel || "расшифровываем запись и подставляем текст."
    )}</span>`;
  }

  if (voiceRecorder.error) {
    return `<span class="voice-status voice-status--error">${escapeHtml(voiceRecorder.error)}</span>`;
  }

  return "";
}

function renderVoiceDraftActions(fieldId) {
  const draft = state.voiceDrafts?.[fieldId];
  if (!draft) {
    return "";
  }

  const isBusyTarget = voiceRecorder.targetFieldId === fieldId && voiceRecorder.status !== "idle";
  return `
    <span class="voice-action-group">
      <button
        class="button-secondary voice-action-button"
        type="button"
        data-retry-voice="${fieldId}"
        ${isBusyTarget ? "disabled" : ""}
      >
        отправить еще раз
      </button>
      <button
        class="button-secondary voice-action-button"
        type="button"
        data-delete-voice="${fieldId}"
        ${isBusyTarget ? "disabled" : ""}
      >
        удалить запись
      </button>
    </span>
  `;
}

function renderAttachmentProcessingState() {
  if (!attachmentProcessingStatus) {
    return "";
  }

  return `
    <div class="meta-row">
      <span class="mini-chip">${escapeHtml(attachmentProcessingStatus)}</span>
    </div>
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
  const body = attachment.locked
    ? '<p class="section-copy">встроенный документ. он будет приложен к экспорту автоматически.</p>'
    : `<pre class="attachment-content">${escapeHtml(attachment.content)}</pre>`;

  return `
    <section class="attachment-card">
      <div class="attachment-card-head">
        <div class="attachment-card-copy">
          <span class="eyebrow-soft">приложение ${index + 1}</span>
          <h3>${escapeHtml(attachment.name)}</h3>
        </div>
        ${
          attachment.locked
            ? ""
            : `
              <button
                class="button-secondary"
                type="button"
                data-remove-attachment="${escapeHtml(attachment.id)}"
              >
                удалить
              </button>
            `
        }
      </div>
      ${body}
    </section>
  `;
}

function attachEvents() {
  document.querySelectorAll("[data-field]").forEach((node) => {
    node.addEventListener("input", handleFieldInput);
    node.addEventListener("change", handleFieldInput);
  });

  document.querySelectorAll("[data-reflection]").forEach((node) => {
    node.addEventListener("input", handleReflectionInput);
  });

  document.querySelectorAll("[data-main-question]").forEach((node) => {
    node.addEventListener("input", handleMainQuestionInput);
  });

  document.querySelectorAll("[data-superpower]").forEach((node) => {
    node.addEventListener("input", handleSuperpowerInput);
  });

  document.querySelectorAll("[data-mastery-score]").forEach((node) => {
    node.addEventListener("change", handleMasteryScoreChange);
  });

  document.querySelectorAll("[data-mastery-comment]").forEach((node) => {
    node.addEventListener("input", handleMasteryCommentInput);
  });

  document.querySelectorAll("[data-voice-trigger]").forEach((node) => {
    node.addEventListener("click", handleVoiceRecorderToggle);
  });

  document.querySelectorAll("[data-retry-voice]").forEach((node) => {
    node.addEventListener("click", handleVoiceDraftRetry);
  });

  document.querySelectorAll("[data-delete-voice]").forEach((node) => {
    node.addEventListener("click", handleVoiceDraftDelete);
  });

  document.querySelectorAll("[data-remove-attachment]").forEach((node) => {
    node.addEventListener("click", handleAttachmentRemove);
  });

  const attachmentsInput = document.querySelector("[data-attachments-input]");
  if (attachmentsInput) {
    attachmentsInput.addEventListener("change", handleAttachmentUpload);
  }

  const exportMarkdownButton = document.getElementById("export-markdown-button");
  if (exportMarkdownButton) {
    exportMarkdownButton.addEventListener("click", exportMarkdown);
  }

  document.querySelectorAll("[data-tracker-token]").forEach((node) => {
    node.addEventListener("input", handleTrackerTokenInput);
  });

  const clearTrackerTokenButton = document.getElementById("clear-tracker-token-button");
  if (clearTrackerTokenButton) {
    clearTrackerTokenButton.addEventListener("click", handleTrackerTokenClear);
  }

  const fetchTrackerContextButton = document.getElementById("fetch-tracker-context-button");
  if (fetchTrackerContextButton) {
    fetchTrackerContextButton.addEventListener("click", handleTrackerContextFetch);
  }

  const resetFormButton = document.getElementById("reset-form-button");
  if (resetFormButton) {
    resetFormButton.addEventListener("click", resetForm);
  }
}

function handleFieldInput(event) {
  const path = event.target.dataset.field;
  const [scope, key] = path.split(".");
  if (scope === "profile") {
    state.profile[key] = event.target.value;
    if (key === "assessmentStartDate" || key === "assessmentEndDate") {
      normalizeAssessmentPeriodRange(state.profile);
    }
  }

  state.error = "";
  if (!persistState()) {
    render();
  }
}

function handleReflectionInput(event) {
  const questionId = event.target.dataset.reflection;
  state.reflection[questionId] = event.target.value;
  state.error = "";
  if (!persistState()) {
    render();
  }
}

function handleMainQuestionInput(event) {
  const questionId = event.target.dataset.mainQuestion;
  state.mainQuestions[questionId] = event.target.value;
  state.error = "";
  if (!persistState()) {
    render();
  }
}

function handleSuperpowerInput(event) {
  const questionId = event.target.dataset.superpower;
  state.superpower[questionId] = event.target.value;
  state.error = "";
  if (!persistState()) {
    render();
  }
}

function handleMasteryScoreChange(event) {
  const sectionId = event.target.dataset.masteryScore;
  state.designMastery[sectionId].score = String(event.target.value || "");
  state.error = "";
  persistState();
  render();
}

function handleMasteryCommentInput(event) {
  const sectionId = event.target.dataset.masteryComment;
  state.designMastery[sectionId].comment = event.target.value;
  state.error = "";
  if (!persistState()) {
    render();
  }
}

function normalizeTextContent(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function handleTrackerTokenInput(event) {
  const normalizedToken = String(event.target.value || "").trim();
  if (normalizedToken) {
    setStoredTrackerToken(normalizedToken);
  }
  state.tracker.warning = "";
}

function handleTrackerTokenClear() {
  clearStoredTrackerToken();
  state.tracker = { content: "", warning: "" };
  state.error = "";
  persistState();
  render();
}

async function handleTrackerContextFetch() {
  const designerName = String(state.profile.designerName || "").trim();
  const trackerToken = getStoredTrackerToken();

  if (!designerName) {
    state.tracker.warning = "сначала укажи имя дизайнера, чтобы подтянуть задачи из Трекера.";
    state.error = "";
    persistState();
    render();
    return;
  }

  if (!trackerToken) {
    state.tracker.warning = "добавь OAuth-токен Трекера, чтобы подтянуть список задач.";
    state.error = "";
    persistState();
    render();
    return;
  }

  trackerLoading = true;
  state.tracker.warning = "";
  state.error = "";
  render();

  try {
    const period = getAssessmentPeriodRange(state.profile);
    const response = await fetch(SERVER_TRACKER_CONTEXT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        designer_name: designerName,
        tracker_login: lookupKnownTrackerLoginByName(designerName),
        tracker_token: trackerToken,
        period_start: period.startDate,
        period_end: period.endDate
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(String(payload.error || "не удалось подтянуть задачи из Трекера."));
    }

    state.tracker = {
      content: String(payload.tracker_context || "").trim(),
      warning: ""
    };
    persistState();
  } catch (error) {
    state.tracker = {
      content: "",
      warning: error.message || "не удалось подтянуть задачи из Трекера."
    };
    persistState();
  } finally {
    trackerLoading = false;
    render();
  }
}

function slugifyFileName(value) {
  const slug = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "designer";
}

function formatAttachmentContent(value) {
  const normalized = normalizeTextContent(value).trim();
  return normalized || "не заполнено";
}

function getDefaultPeriodRange(monthCount = "3m") {
  const endDate = new Date();
  const startDate = new Date(endDate);
  const months = String(monthCount) === "1m" ? 1 : String(monthCount) === "6m" ? 6 : 3;
  startDate.setMonth(startDate.getMonth() - months);

  return {
    startDate: formatDateInputValue(startDate),
    endDate: formatDateInputValue(endDate)
  };
}

function normalizeAssessmentPeriodRange(profile = state.profile) {
  const current = getAssessmentPeriodRange(profile);
  profile.assessmentStartDate = current.startDate;
  profile.assessmentEndDate = current.endDate;
}

function getAssessmentPeriodRange(profile = state.profile) {
  const fallback = getDefaultPeriodRange("3m");
  let startDate = normalizeDateInputValue(profile.assessmentStartDate) || fallback.startDate;
  let endDate = normalizeDateInputValue(profile.assessmentEndDate) || fallback.endDate;

  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  return { startDate, endDate };
}

function normalizeDateInputValue(value) {
  const normalized = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return "";
  }
  return normalized;
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function lookupKnownTrackerLoginByName(value) {
  const normalized = normalizeTrackerName(value);
  const matched = TRACKER_NAME_LOGIN_MAP[normalized];
  return matched ? normalizeTrackerLogin(matched) : "";
}

function normalizeTrackerName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ");
}

function normalizeTrackerLogin(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/@yandex-team\.ru$/i, "")
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
}

function getStoredTrackerToken() {
  try {
    return localStorage.getItem(TRACKER_TOKEN_STORAGE) || "";
  } catch (error) {
    return "";
  }
}

function setStoredTrackerToken(value) {
  try {
    localStorage.setItem(TRACKER_TOKEN_STORAGE, value);
  } catch (error) {
    return;
  }
}

function clearStoredTrackerToken() {
  try {
    localStorage.removeItem(TRACKER_TOKEN_STORAGE);
  } catch (error) {
    return;
  }
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

function sanitizeAttachment(attachment, index = 0) {
  if (!attachment || typeof attachment !== "object") {
    return null;
  }

  const name = String(attachment.name || `документ-${index + 1}.txt`).trim() || `документ-${index + 1}.txt`;
  return {
    id: String(attachment.id || buildAttachmentId()),
    name,
    content: normalizeTextContent(attachment.content),
    locked: Boolean(attachment.locked)
  };
}

async function ensureBundledDefaultAttachment() {
  try {
    if (!bundledDefaultAttachments.length) {
      bundledDefaultAttachments = (
        await Promise.all(
          BUNDLED_ATTACHMENTS.map(async (attachment) => {
            const response = await fetch(attachment.url, { cache: "no-store" });
            if (!response.ok) {
              throw new Error(`не удалось загрузить встроенное приложение: ${response.status}`);
            }

            return sanitizeAttachment({
              id: attachment.id,
              name: attachment.name,
              content: await response.text(),
              locked: true
            });
          })
        )
      ).filter(Boolean);
    }

    state.attachments = mergeDefaultAttachments(state.attachments);
  } catch (error) {
    console.error(error);
  }
}

function mergeDefaultAttachments(attachments) {
  const normalized = Array.isArray(attachments) ? attachments.map(sanitizeAttachment).filter(Boolean) : [];
  if (!bundledDefaultAttachments.length) {
    return normalized;
  }

  return [
    ...bundledDefaultAttachments,
    ...normalized.filter(
      (attachment) => !bundledDefaultAttachments.some((defaultAttachment) => defaultAttachment.id === attachment.id)
    )
  ];
}

async function handleAttachmentUpload(event) {
  const input = event.target;
  const files = Array.from(input.files || []);
  if (!files.length) {
    return;
  }

  const previousAttachments = Array.isArray(state.attachments) ? [...state.attachments] : [];
  state.error = "";
  attachmentProcessingStatus = "добавляем приложения...";
  render();

  try {
    const invalidFile = files.find((file) => !isTextDocument(file));
    if (invalidFile) {
      throw new Error(
        `файл "${invalidFile.name}" не похож на текстовый документ. загрузи txt, md, csv, json или другой text-файл.`
      );
    }

    const nextAttachments = await Promise.all(files.map(readTextAttachment));
    state.attachments = mergeDefaultAttachments([...previousAttachments, ...nextAttachments]);
    attachmentProcessingStatus = "";

    if (!persistState()) {
      state.attachments = previousAttachments;
      persistState();
    }
  } catch (error) {
    attachmentProcessingStatus = "";
    state.attachments = previousAttachments;
    state.error = error.message || "не удалось прочитать загруженные документы.";
    persistState();
  }

  input.value = "";
  render();
}

function handleAttachmentRemove(event) {
  const attachmentId = event.currentTarget.dataset.removeAttachment;
  if (BUNDLED_ATTACHMENTS.some((attachment) => attachment.id === attachmentId)) {
    return;
  }

  state.attachments = mergeDefaultAttachments(
    (state.attachments || []).filter((attachment) => attachment.id !== attachmentId)
  );
  state.error = "";
  persistState();
  render();
}

function buildAttachmentSection(attachment, index) {
  const safeAttachment = sanitizeAttachment(attachment, index);
  if (!safeAttachment) {
    return [];
  }

  return [
    `## приложение ${index + 1} - ${safeAttachment.name}`,
    "",
    formatAttachmentContent(safeAttachment.content),
    ""
  ];
}

function formatMasteryScore(score) {
  const matched = MASTERY_OPTIONS.find((option) => option.value === String(score || ""));
  return matched ? matched.label : "не заполнено";
}

function buildMarkdownExport() {
  const period = getAssessmentPeriodRange(state.profile);
  const lines = [
    "# анкета по карте ожиданий продуктового дизайнера",
    "",
    `- сгенерировано: ${formatTimestamp(new Date())}`,
    `- тип ревью: ${formatField(state.profile.reviewType)}`,
    `- имя: ${formatField(state.profile.designerName)}`,
    `- период: ${period.startDate} — ${period.endDate}`,
    `- команда / направление: ${formatField(state.profile.teamOrDirection)}`,
    "",
    "## базовая информация",
    "",
    "### контекст задач за период",
    "",
    formatParagraph(state.profile.periodTaskContext),
    "",
    "## часть 1. рефлексия по периоду",
    ""
  ];

  REFLECTION_QUESTIONS.forEach((question, index) => {
    lines.push(`### ${index + 1}. ${question.title}`);
    lines.push("");
    lines.push(formatParagraph(state.reflection[question.id]));
    lines.push("");
  });

  lines.push("## часть 2. список задач");
  lines.push("");
  if (state.tracker.content) {
    lines.push(state.tracker.content, "");
  } else if (state.tracker.warning) {
    lines.push(state.tracker.warning, "");
  } else {
    lines.push("не загружено", "");
  }

  lines.push("## часть 3. основные вопросы");
  lines.push("");
  MAIN_QUESTIONS.forEach((question) => {
    lines.push(`### ${question.title}`);
    lines.push("");
    lines.push(question.prompt);
    lines.push("");
    lines.push(formatParagraph(state.mainQuestions[question.id]));
    lines.push("");
  });

  lines.push("## часть 4. мастерство дизайнера");
  lines.push("");
  let currentStage = "";
  DESIGN_MASTERY_SECTIONS.forEach((section) => {
    const mastery = state.designMastery?.[section.id] || { score: "", comment: "" };
    if (section.stage !== currentStage) {
      currentStage = section.stage;
      lines.push(`### ${currentStage}`);
      lines.push("");
    }

    lines.push(`#### ${section.title}`);
    lines.push("");
    lines.push(...section.bullets.map((bullet) => `- ${bullet}`));
    lines.push("");
    lines.push(`- самооценка: ${formatMasteryScore(mastery.score)}`);
    lines.push("");
    if (String(mastery.comment || "").trim()) {
      lines.push("комментарий:");
      lines.push("");
      lines.push(formatParagraph(mastery.comment));
      lines.push("");
    }
  });

  lines.push("## часть 5. суперсила");
  lines.push("");
  SUPERPOWER_QUESTIONS.forEach((question) => {
    lines.push(`### ${question.title}`);
    lines.push("");
    lines.push(formatParagraph(state.superpower[question.id]));
    lines.push("");
  });

  (state.attachments || []).forEach((attachment, index) => {
    lines.push(...buildAttachmentSection(attachment, index));
  });

  return lines.join("\n");
}

function buildExportFileName() {
  const designerName = state.profile.designerName || "designer";
  return `designer-questionnaire-${slugifyFileName(designerName)}.md`;
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
  await clearAllVoiceDrafts();
  voiceRecorder.status = "idle";
  voiceRecorder.targetFieldId = "";
  voiceRecorder.error = "";
  await ensureBundledDefaultAttachment();
  persistState();
  render();
}

async function handleVoiceRecorderToggle(event) {
  const fieldId = event.currentTarget.dataset.voiceTrigger;
  if (!fieldId) {
    return;
  }

  if (voiceRecorder.status === "recording" && voiceRecorder.targetFieldId === fieldId) {
    await stopVoiceRecording();
    return;
  }

  if (voiceRecorder.status !== "idle") {
    return;
  }

  await startVoiceRecording(fieldId);
}

async function startVoiceRecording(fieldId) {
  if (!supportsVoiceRecording()) {
    setVoiceRecorderError(fieldId, "браузер не поддерживает запись с микрофона.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = getPreferredRecordingMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

    activeMediaRecorder = recorder;
    activeMediaStream = stream;
    activeMediaChunks = [];
    activeMediaMimeType = recorder.mimeType || mimeType || "audio/webm";

    recorder.addEventListener("dataavailable", (dataEvent) => {
      if (dataEvent.data && dataEvent.data.size > 0) {
        activeMediaChunks.push(dataEvent.data);
      }
    });

    recorder.addEventListener("error", () => {
      setVoiceRecorderError(fieldId, "не удалось записать аудио. попробуй еще раз.");
      cleanupVoiceRecording();
    });

    voiceRecorder.status = "recording";
    voiceRecorder.targetFieldId = fieldId;
    voiceRecorder.error = "";
    voiceRecorder.progressLabel = "";
    recorder.start(MEDIA_RECORDER_TIMESLICE_MS);
    render();
  } catch (error) {
    const message =
      error?.name === "NotAllowedError"
        ? "нет доступа к микрофону. разреши доступ в браузере и попробуй снова."
        : "не удалось включить микрофон. проверь разрешения и попробуй еще раз.";
    setVoiceRecorderError(fieldId, message);
  }
}

async function stopVoiceRecording() {
  const fieldId = voiceRecorder.targetFieldId;
  if (!fieldId || !activeMediaRecorder) {
    cleanupVoiceRecording();
    voiceRecorder.status = "idle";
    voiceRecorder.progressLabel = "";
    render();
    return;
  }

  voiceRecorder.status = "transcribing";
  voiceRecorder.error = "";
  voiceRecorder.progressLabel = "сохраняем запись перед расшифровкой.";
  render();

  try {
    const audioCapture = await finalizeVoiceRecording();
    if (!audioCapture.blob.size) {
      throw new Error("запись получилась пустой. попробуй еще раз.");
    }
    if (audioCapture.blob.size > MAX_AUDIO_BYTES) {
      throw new Error("аудио слишком большое. попробуй записать более короткий комментарий.");
    }

    await upsertVoiceDraft(fieldId, audioCapture, "saved");
    await transcribeSavedVoiceDraft(fieldId);
  } catch (error) {
    setVoiceRecorderError(fieldId, error.message || "не удалось расшифровать запись.");
  } finally {
    cleanupVoiceRecording();
  }
}

async function handleVoiceDraftRetry(event) {
  const fieldId = event.currentTarget.dataset.retryVoice;
  if (!fieldId || voiceRecorder.status !== "idle") {
    return;
  }

  try {
    await transcribeSavedVoiceDraft(fieldId);
  } catch (error) {
    setVoiceRecorderError(fieldId, error.message || "не удалось отправить запись повторно.");
  }
}

async function handleVoiceDraftDelete(event) {
  const fieldId = event.currentTarget.dataset.deleteVoice;
  if (!fieldId) {
    return;
  }

  await removeVoiceDraft(fieldId);
  if (voiceRecorder.targetFieldId === fieldId) {
    voiceRecorder.status = "idle";
    voiceRecorder.targetFieldId = "";
    voiceRecorder.error = "";
    voiceRecorder.progressLabel = "";
  }
  render();
}

function finalizeVoiceRecording() {
  return new Promise((resolve, reject) => {
    const recorder = activeMediaRecorder;
    const mimeType = activeMediaMimeType || "audio/webm";

    if (!recorder) {
      reject(new Error("запись не найдена."));
      return;
    }

    const handleStop = () => {
      recorder.removeEventListener("stop", handleStop);
      recorder.removeEventListener("error", handleError);
      const chunks = activeMediaChunks.filter((chunk) => chunk && chunk.size > 0);
      const blob = new Blob(chunks, { type: mimeType });
      resolve({
        blob,
        chunks
      });
    };

    const handleError = () => {
      recorder.removeEventListener("stop", handleStop);
      recorder.removeEventListener("error", handleError);
      reject(new Error("во время остановки записи произошла ошибка."));
    };

    recorder.addEventListener("stop", handleStop);
    recorder.addEventListener("error", handleError);
    recorder.stop();
    stopActiveMediaStream();
  });
}

function cleanupVoiceRecording() {
  stopActiveMediaStream();
  activeMediaRecorder = null;
  activeMediaChunks = [];
  activeMediaMimeType = "";
}

function stopActiveMediaStream() {
  if (!activeMediaStream) {
    return;
  }

  activeMediaStream.getTracks().forEach((track) => track.stop());
  activeMediaStream = null;
}

function setVoiceRecorderError(fieldId, message) {
  cleanupVoiceRecording();
  voiceRecorder.status = "idle";
  voiceRecorder.targetFieldId = fieldId;
  voiceRecorder.error = message;
  voiceRecorder.progressLabel = "";
  render();
}

async function transcribeSavedVoiceDraft(fieldId) {
  const audioDraft = await readVoiceDraft(fieldId);
  const audioBlob = audioDraft?.blob || null;
  if (!audioBlob) {
    throw new Error("сохраненная запись не найдена. запиши голосовое еще раз.");
  }

  const mimeType = audioBlob.type || state.voiceDrafts?.[fieldId]?.mimeType || "audio/webm";
  voiceRecorder.progressLabel = "подготавливаем запись к расшифровке.";
  render();
  const transcriptionChunks = await buildTranscriptionChunks(audioDraft, mimeType);

  voiceRecorder.status = "transcribing";
  voiceRecorder.targetFieldId = fieldId;
  voiceRecorder.error = "";
  voiceRecorder.progressLabel =
    transcriptionChunks.length > 1
      ? `расшифровываем длинную запись: часть 1 из ${transcriptionChunks.length}.`
      : "расшифровываем запись и подставляем текст.";
  await setVoiceDraftMeta(fieldId, {
    status: "sending",
    lastError: "",
    mimeType,
    size: audioBlob.size,
    chunkCount: transcriptionChunks.length
  });
  render();

  try {
    const transcript = await requestServerTranscription(transcriptionChunks, mimeType);
    applyTranscriptToField(fieldId, transcript);
    await setVoiceDraftMeta(fieldId, {
      status: "transcribed",
      lastError: "",
      mimeType,
      size: audioBlob.size,
      chunkCount: transcriptionChunks.length
    });
    voiceRecorder.status = "idle";
    voiceRecorder.targetFieldId = fieldId;
    voiceRecorder.error = "";
    voiceRecorder.progressLabel = "";
    state.error = "";
    persistState();
    render();
  } catch (error) {
    await setVoiceDraftMeta(fieldId, {
      status: "failed",
      lastError: error.message || "не удалось расшифровать запись.",
      mimeType,
      size: audioBlob.size,
      chunkCount: transcriptionChunks.length
    });
    throw error;
  }
}

function applyTranscriptToField(fieldId, transcript) {
  const normalizedTranscript = String(transcript || "").trim();
  if (!normalizedTranscript) {
    return;
  }

  if (fieldId === "profile-period-task-context") {
    state.profile.periodTaskContext = appendTranscript(state.profile.periodTaskContext, normalizedTranscript);
    return;
  }

  if (fieldId.startsWith("reflection-")) {
    const questionId = fieldId.replace("reflection-", "");
    state.reflection[questionId] = appendTranscript(state.reflection[questionId], normalizedTranscript);
    return;
  }

  if (fieldId.startsWith("main-")) {
    const questionId = fieldId.replace("main-", "");
    state.mainQuestions[questionId] = appendTranscript(state.mainQuestions[questionId], normalizedTranscript);
    return;
  }

  if (fieldId.startsWith("superpower-")) {
    const questionId = fieldId.replace("superpower-", "");
    state.superpower[questionId] = appendTranscript(state.superpower[questionId], normalizedTranscript);
    return;
  }

  if (fieldId.startsWith("mastery-comment-")) {
    const sectionId = fieldId.replace("mastery-comment-", "");
    state.designMastery[sectionId].comment = appendTranscript(
      state.designMastery[sectionId].comment,
      normalizedTranscript
    );
  }
}

function appendTranscript(existingValue, transcript) {
  const currentValue = String(existingValue || "").trim();
  return currentValue ? `${currentValue}\n\n${transcript}` : transcript;
}

function supportsVoiceRecording() {
  return Boolean(window.MediaRecorder && navigator.mediaDevices?.getUserMedia);
}

function supportsVoiceDraftPersistence() {
  return Boolean(window.indexedDB);
}

function getPreferredRecordingMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus"
  ];

  return candidates.find((mimeType) => MediaRecorder.isTypeSupported?.(mimeType)) || "";
}

async function upsertVoiceDraft(fieldId, audioInput, status) {
  if (!supportsVoiceDraftPersistence()) {
    throw new Error("браузер не поддерживает локальное сохранение аудио.");
  }

  const { blob, chunks } = normalizeAudioCapture(audioInput);
  const record = {
    fieldId,
    blob,
    chunks,
    mimeType: blob.type || "audio/webm",
    size: blob.size,
    updatedAt: Date.now()
  };

  await withVoiceDraftStore("readwrite", (store) => {
    store.put(record);
  });

  await setVoiceDraftMeta(fieldId, {
    status,
    lastError: "",
    mimeType: record.mimeType,
    size: record.size,
    chunkCount: record.chunks.length,
    updatedAt: record.updatedAt
  });
}

async function readVoiceDraft(fieldId) {
  if (!supportsVoiceDraftPersistence()) {
    return null;
  }

  return withVoiceDraftStore("readonly", (store) => store.get(fieldId));
}

async function removeVoiceDraft(fieldId) {
  if (supportsVoiceDraftPersistence()) {
    await withVoiceDraftStore("readwrite", (store) => {
      store.delete(fieldId);
    });
  }

  delete state.voiceDrafts[fieldId];
  persistState();
}

async function setVoiceDraftMeta(fieldId, patch) {
  state.voiceDrafts[fieldId] = {
    ...(state.voiceDrafts[fieldId] || {}),
    ...patch
  };
  persistState();
}

async function clearAllVoiceDrafts() {
  if (!supportsVoiceDraftPersistence()) {
    return;
  }

  await withVoiceDraftStore("readwrite", (store) => {
    store.clear();
  });
}

function withVoiceDraftStore(mode, operation) {
  return new Promise((resolve, reject) => {
    const openRequest = window.indexedDB.open(VOICE_DRAFTS_DB_NAME, 1);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains(VOICE_DRAFTS_STORE_NAME)) {
        db.createObjectStore(VOICE_DRAFTS_STORE_NAME, { keyPath: "fieldId" });
      }
    };

    openRequest.onerror = () => {
      reject(new Error("не удалось открыть локальное хранилище записей."));
    };

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction(VOICE_DRAFTS_STORE_NAME, mode);
      const store = transaction.objectStore(VOICE_DRAFTS_STORE_NAME);
      const request = operation(store);

      transaction.oncomplete = () => {
        resolve(request?.result);
        db.close();
      };

      transaction.onerror = () => {
        reject(new Error("не удалось сохранить аудиозапись локально."));
        db.close();
      };
    };
  });
}

async function requestServerTranscription(audioChunks, mimeType) {
  return transcribeAudioChunks(audioChunks, async (audioChunk, chunkIndex, totalChunks) => {
    const response = await fetch(SERVER_TRANSCRIPTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": audioChunk.type || mimeType || "audio/webm",
        "X-Audio-Mime-Type": audioChunk.type || mimeType || "audio/webm",
        "X-Chunk-Index": String(chunkIndex + 1),
        "X-Chunk-Count": String(totalChunks)
      },
      body: audioChunk
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `не удалось расшифровать запись. статус ответа: ${response.status}`);
    }

    const transcript = String(payload.text || "").trim();
    if (!transcript) {
      throw new Error("сервер не вернул текст транскрибации.");
    }

    return transcript;
  });
}

async function transcribeAudioChunks(audioChunks, transcribeChunk) {
  const transcriptParts = [];

  for (const [index, audioChunk] of audioChunks.entries()) {
    updateTranscriptionProgress(index, audioChunks.length);
    const transcriptPart = await transcribeChunk(audioChunk, index, audioChunks.length);
    if (transcriptPart) {
      transcriptParts.push(transcriptPart);
    }
  }

  return transcriptParts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function updateTranscriptionProgress(currentIndex, totalChunks) {
  voiceRecorder.progressLabel =
    totalChunks > 1
      ? `расшифровываем длинную запись: часть ${currentIndex + 1} из ${totalChunks}.`
      : "расшифровываем запись и подставляем текст.";
  render();
}

async function buildTranscriptionChunks(audioDraft, mimeType) {
  const audioBlob = audioDraft?.blob;
  if (!isNonEmptyAudioBlob(audioBlob)) {
    throw new Error("сохраненная запись не найдена. запиши голосовое еще раз.");
  }

  if (audioBlob.size <= MAX_TRANSCRIPTION_CHUNK_BYTES) {
    return [new Blob([audioBlob], { type: audioBlob.type || mimeType || "audio/webm" })];
  }

  try {
    const wavChunks = await splitAudioBlobToWavChunks(audioBlob);
    const oversizedChunk = wavChunks.find((chunk) => chunk.size > MAX_TRANSCRIPTION_CHUNK_BYTES);
    if (oversizedChunk) {
      throw new Error(
        `не удалось безопасно разбить запись на части до 3 МБ: один из подготовленных фрагментов весит ${formatAudioSize(
          oversizedChunk.size
        )}.`
      );
    }
    return wavChunks;
  } catch (error) {
    throw new Error(
      error?.message ||
        "не удалось подготовить длинную запись к расшифровке. попробуй записать комментарий короче или отправить еще раз."
    );
  }
}

function normalizeAudioCapture(audioInput) {
  if (audioInput instanceof Blob) {
    return {
      blob: audioInput,
      chunks: [audioInput]
    };
  }

  const blob = audioInput?.blob instanceof Blob ? audioInput.blob : new Blob([], { type: "audio/webm" });
  const rawChunks = Array.isArray(audioInput?.chunks) ? audioInput.chunks.filter(isNonEmptyAudioBlob) : [];

  return {
    blob,
    chunks: rawChunks.length ? rawChunks : blob.size ? [blob] : []
  };
}

function isNonEmptyAudioBlob(value) {
  return value instanceof Blob && value.size > 0;
}

function formatAudioSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

async function splitAudioBlobToWavChunks(audioBlob) {
  const monoSamples = await decodeAudioBlobToMonoSamples(audioBlob);
  const maxSamplesPerChunk = Math.max(
    1,
    Math.floor((MAX_TRANSCRIPTION_CHUNK_BYTES - WAV_HEADER_BYTES) / 2)
  );
  const chunks = [];

  for (let offset = 0; offset < monoSamples.length; offset += maxSamplesPerChunk) {
    const slice = monoSamples.subarray(offset, Math.min(offset + maxSamplesPerChunk, monoSamples.length));
    chunks.push(buildWavBlobFromSamples(slice, TRANSCRIPTION_WAV_SAMPLE_RATE));
  }

  return chunks;
}

async function decodeAudioBlobToMonoSamples(audioBlob) {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioContext = createAudioContext();

  if (!audioContext) {
    throw new Error("браузер не поддерживает подготовку длинной записи к расшифровке.");
  }

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const monoBuffer = mixAudioBufferToMono(audioBuffer);
    return resampleMonoSamples(monoBuffer, audioBuffer.sampleRate, TRANSCRIPTION_WAV_SAMPLE_RATE);
  } catch (error) {
    throw new Error(
      "не удалось прочитать аудиозапись в браузере. попробуй удалить запись и записать голосовое еще раз."
    );
  } finally {
    await closeAudioContext(audioContext);
  }
}

function createAudioContext() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  return new AudioContextCtor();
}

async function closeAudioContext(audioContext) {
  if (!audioContext?.close) {
    return;
  }

  try {
    await audioContext.close();
  } catch {
    // ignore close errors
  }
}

function mixAudioBufferToMono(audioBuffer) {
  const channelCount = audioBuffer.numberOfChannels;
  const sampleCount = audioBuffer.length;
  const mono = new Float32Array(sampleCount);

  for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
    const channelData = audioBuffer.getChannelData(channelIndex);
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      mono[sampleIndex] += channelData[sampleIndex] / channelCount;
    }
  }

  return mono;
}

function resampleMonoSamples(samples, fromSampleRate, toSampleRate) {
  if (fromSampleRate === toSampleRate) {
    return samples;
  }

  const targetLength = Math.max(1, Math.round(samples.length * (toSampleRate / fromSampleRate)));
  const resampled = new Float32Array(targetLength);
  const ratio = fromSampleRate / toSampleRate;

  for (let index = 0; index < targetLength; index += 1) {
    const sourceIndex = index * ratio;
    const leftIndex = Math.floor(sourceIndex);
    const rightIndex = Math.min(leftIndex + 1, samples.length - 1);
    const interpolation = sourceIndex - leftIndex;
    const leftValue = samples[leftIndex] || 0;
    const rightValue = samples[rightIndex] || 0;
    resampled[index] = leftValue + (rightValue - leftValue) * interpolation;
  }

  return resampled;
}

function buildWavBlobFromSamples(samples, sampleRate) {
  const pcmBytes = samples.length * 2;
  const buffer = new ArrayBuffer(WAV_HEADER_BYTES + pcmBytes);
  const view = new DataView(buffer);

  writeAsciiString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcmBytes, true);
  writeAsciiString(view, 8, "WAVE");
  writeAsciiString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAsciiString(view, 36, "data");
  view.setUint32(40, pcmBytes, true);

  let offset = WAV_HEADER_BYTES;
  for (let index = 0; index < samples.length; index += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[index]));
    const pcm = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    view.setInt16(offset, Math.round(pcm), true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeAsciiString(dataView, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    dataView.setUint8(offset + index, value.charCodeAt(index));
  }
}

function downloadTextFile(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function syncProgressDockOffset() {
  const progressDockAnchor = document.querySelector(".progress-dock-anchor");
  const progressDock = document.querySelector(".progress-dock");
  const touchMedia = window.matchMedia ? window.matchMedia(TOUCH_PROGRESS_DOCK_QUERY) : null;
  const disableFloatingOnTouch = touchMedia?.matches || navigator.maxTouchPoints > 0;
  const nextHeight = progressDock ? Math.ceil(progressDock.getBoundingClientRect().height) : 0;
  document.documentElement.style.setProperty(
    "--progress-dock-height",
    disableFloatingOnTouch ? "0px" : `${nextHeight}px`
  );
  if (!progressDockAnchor || !progressDock) {
    return;
  }

  if (disableFloatingOnTouch) {
    progressDock.classList.remove("is-floating");
    progressDockAnchor.style.height = "";
    return;
  }

  const shouldFloat = progressDockAnchor.getBoundingClientRect().top <= 0;
  progressDock.classList.toggle("is-floating", shouldFloat);
  progressDockAnchor.style.height = shouldFloat ? `${nextHeight}px` : "";
}
