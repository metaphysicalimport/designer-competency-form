const STORAGE_KEY = "designer-expectations-app-v6";
const GRADE_OPTIONS = ["14", "15", "16", "17", "18"];
const TEXT_DOCUMENT_PATTERN = /\.(txt|md|markdown|csv|json|log|rtf|yaml|yml|xml|html?|css|js|ts|tsx|jsx)$/i;
const BUNDLED_ATTACHMENTS = [
  {
    id: "builtin-designer-expectations-map",
    name: "Карта ожиданий - Музыка.md",
    url: new URL("./product-designer-competencies.md", window.location.href).toString()
  },
  {
    id: "builtin-designer-expectations-questionnaire",
    name: "Карта ожиданий - Музыка-2.md",
    url: new URL("./expectations-questionnaire.md", window.location.href).toString()
  }
];
const SERVER_EVALUATION_URL = "/api/evaluate";
const REMOTE_SERVER_EVALUATION_URL = "https://designer-competency-form.vercel.app/api/evaluate";
const REMOTE_SERVER_ATTACHMENT_SUMMARY_URL = "https://designer-competency-form.vercel.app/api/attachment_summary";
const SERVER_TRACKER_CONTEXT_URL = "/api/tracker_context";
const SERVER_TRANSCRIPTION_URL = "/api/transcribe";
const SERVER_ATTACHMENT_SUMMARY_URL = "/api/attachment_summary";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_TRANSCRIPTION_API_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_MODEL = "gpt-5-pro";
const OPENAI_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const OPENAI_KEY_STORAGE = "designer-competency-openai-key-v1";
const JSON_ATTACHMENT_SUMMARY_MARKER = "[json-attachment-summary-v2]";
const TRACKER_API_BASE_URL = "https://st-api.yandex-team.ru/v3";
const TRACKER_TOKEN_STORAGE = "designer-competency-tracker-token-v1";
const TRACKER_MAX_ISSUES = 40;
const TRACKER_PAGE_SIZE = 20;
const TRACKER_DESCRIPTION_LIMIT = 360;
const TRACKER_SNIPPET_LIMIT = 20;
const PERIOD_PRESET_OPTIONS = [
  { value: "1m", label: "последний месяц" },
  { value: "3m", label: "последние 3 месяца" },
  { value: "6m", label: "последние 6 месяцев" },
  { value: "custom", label: "свой период" }
];
const TRACKER_EXCLUDED_QUEUE_KEYS = new Set([
  "equipment",
  "corporateethics",
  "securityawareness",
  "security_awareness"
]);
const TRACKER_EXCLUDED_TYPE_KEYS = new Set(["newdocument", "education"]);
const TRACKER_EXCLUDED_TYPE_NAMES = new Set(["новыйдокумент", "обучение"]);
const TRACKER_NAME_LOGIN_MAP = {
  [normalizeTrackerName("рома жигарёв")]: "roma-zhigarev",
  [normalizeTrackerName("рома жигарев")]: "roma-zhigarev",
  [normalizeTrackerName("тимур матвеев")]: "timur57",
  [normalizeTrackerName("алина рябова")]: "alineria"
};
const MAX_AUDIO_BYTES = 64 * 1024 * 1024;
const MAX_TRANSCRIPTION_CHUNK_BYTES = 3 * 1024 * 1024;
const TOUCH_PROGRESS_DOCK_QUERY = "(pointer: coarse)";
const MEDIA_RECORDER_TIMESLICE_MS = 10_000;
const TRANSCRIPTION_WAV_SAMPLE_RATE = 16_000;
const WAV_HEADER_BYTES = 44;
const VOICE_DRAFTS_DB_NAME = "designer-voice-drafts";
const VOICE_DRAFTS_STORE_NAME = "drafts";
const EVALUATE_ICON = `
  <svg class="button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M9.1543 14.6797C9.07227 14.6797 9.00391 14.6543 8.94922 14.6035C8.89453 14.5527 8.86133 14.4863 8.84961 14.4043C8.76367 13.8027 8.66992 13.2949 8.56836 12.8809C8.4707 12.4707 8.3418 12.1348 8.18164 11.873C8.02148 11.6113 7.81055 11.4023 7.54883 11.2461C7.28711 11.0859 6.95312 10.957 6.54688 10.8594C6.14062 10.7617 5.64062 10.6738 5.04688 10.5957C4.96094 10.5879 4.89062 10.5566 4.83594 10.502C4.78516 10.4434 4.75977 10.373 4.75977 10.291C4.75977 10.209 4.78516 10.1406 4.83594 10.0859C4.89062 10.0273 4.96094 9.99414 5.04688 9.98633C5.64453 9.91992 6.14648 9.8418 6.55273 9.75195C6.95898 9.66211 7.29297 9.53711 7.55469 9.37695C7.82031 9.21289 8.0332 8.99805 8.19336 8.73242C8.35742 8.46289 8.48828 8.12109 8.58594 7.70703C8.68359 7.29297 8.77148 6.7832 8.84961 6.17773C8.86133 6.09961 8.89453 6.03516 8.94922 5.98438C9.00391 5.92969 9.07227 5.90234 9.1543 5.90234C9.22852 5.90234 9.29297 5.92969 9.34766 5.98438C9.40234 6.03516 9.43555 6.09961 9.44727 6.17773C9.5332 6.7832 9.625 7.29297 9.72266 7.70703C9.82031 8.12109 9.94922 8.46289 10.1094 8.73242C10.2695 8.99805 10.4805 9.21094 10.7422 9.37109C11.0039 9.53125 11.3379 9.6582 11.7441 9.75195C12.1543 9.8418 12.6562 9.91992 13.25 9.98633C13.3359 9.99805 13.4043 10.0312 13.4551 10.0859C13.5098 10.1406 13.5371 10.209 13.5371 10.291C13.5371 10.373 13.5098 10.4434 13.4551 10.502C13.4043 10.5566 13.3359 10.5879 13.25 10.5957C12.6562 10.6621 12.1543 10.7422 11.7441 10.8359C11.3379 10.9258 11.002 11.0508 10.7363 11.2109C10.4746 11.3711 10.2637 11.5859 10.1035 11.8555C9.94336 12.1211 9.81445 12.4609 9.7168 12.875C9.62305 13.293 9.5332 13.8027 9.44727 14.4043C9.43555 14.4863 9.40234 14.5527 9.34766 14.6035C9.29297 14.6543 9.22852 14.6797 9.1543 14.6797ZM5.35156 8.54492C5.23438 8.54492 5.16797 8.48047 5.15234 8.35156C5.10938 7.98047 5.0625 7.69141 5.01172 7.48438C4.96094 7.27734 4.88086 7.12109 4.77148 7.01562C4.66602 6.90625 4.50586 6.82422 4.29102 6.76953C4.07617 6.71484 3.78125 6.65625 3.40625 6.59375C3.26953 6.57422 3.20117 6.50781 3.20117 6.39453C3.20117 6.28516 3.26172 6.21875 3.38281 6.19531C3.76172 6.125 4.05859 6.0625 4.27344 6.00781C4.49219 5.94922 4.65625 5.86914 4.76562 5.76758C4.87891 5.66211 4.96094 5.50781 5.01172 5.30469C5.0625 5.09766 5.10938 4.81055 5.15234 4.44336C5.16797 4.31445 5.23438 4.25 5.35156 4.25C5.46875 4.25 5.53516 4.3125 5.55078 4.4375C5.60156 4.8125 5.65039 5.10742 5.69727 5.32227C5.74805 5.5332 5.82617 5.69336 5.93164 5.80273C6.04102 5.9082 6.20508 5.98828 6.42383 6.04297C6.64258 6.09375 6.94336 6.14453 7.32617 6.19531C7.37305 6.20312 7.41406 6.22461 7.44922 6.25977C7.48438 6.29492 7.50195 6.33984 7.50195 6.39453C7.50195 6.50781 7.44336 6.57422 7.32617 6.59375C6.94336 6.66797 6.64258 6.73438 6.42383 6.79297C6.20898 6.85156 6.04688 6.93359 5.9375 7.03906C5.82812 7.14062 5.74805 7.29492 5.69727 7.50195C5.65039 7.70508 5.60156 7.99219 5.55078 8.36328C5.54688 8.41406 5.52539 8.45703 5.48633 8.49219C5.44727 8.52734 5.40234 8.54492 5.35156 8.54492ZM8.03516 4.69531C7.96094 4.69531 7.91797 4.65625 7.90625 4.57812C7.85156 4.28125 7.80078 4.06641 7.75391 3.93359C7.71094 3.79688 7.62109 3.70117 7.48438 3.64648C7.34766 3.58789 7.11914 3.5293 6.79883 3.4707C6.7207 3.45508 6.68164 3.41211 6.68164 3.3418C6.68164 3.26758 6.7207 3.22461 6.79883 3.21289C7.11914 3.1543 7.34766 3.09766 7.48438 3.04297C7.62109 2.98438 7.71094 2.88867 7.75391 2.75586C7.80078 2.61914 7.85156 2.40234 7.90625 2.10547C7.91797 2.02734 7.96094 1.98828 8.03516 1.98828C8.10547 1.98828 8.14844 2.02734 8.16406 2.10547C8.21875 2.40234 8.26953 2.61914 8.31641 2.75586C8.36328 2.89258 8.45508 2.98828 8.5918 3.04297C8.72852 3.09766 8.95508 3.1543 9.27148 3.21289C9.35352 3.22461 9.39453 3.26758 9.39453 3.3418C9.39453 3.41211 9.35547 3.45508 9.27734 3.4707C8.95703 3.5293 8.72852 3.58789 8.5918 3.64648C8.45508 3.70117 8.36328 3.79688 8.31641 3.93359C8.26953 4.07031 8.21875 4.28516 8.16406 4.57812C8.14844 4.65625 8.10547 4.69531 8.03516 4.69531Z" fill="currentColor"/>
  </svg>
`;
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
const EVALUATION_INSTRUCTIONS = `
проанализируй содержимое анкеты по карте ожиданий дизайнера, саму карту ожиданий и подготовь оценку дизайнера, его грейд и точки роста.

главный инструмент калибровки - карта ожиданий. смотри на устойчивые поведенческие паттерны, а не на единичные сильные кейсы. устойчивый паттерн - это минимум 3 кейса с использованием скилла или способа работы.

не завышай оценку из-за участия в большой инициативе, если дизайнер не определял рамку, решение, направление или реальный масштаб влияния.

разные оси могут быть на разных уровнях. итоговую калибровку собирай по общему паттерну, а не по одному сильному или слабому пункту.

если среди приложений есть архив рабочей коммуникации, например result.json, извлекай из него косвенные сигналы: стиль взаимодействия, уровень самостоятельности, качество постановки вопросов, глубину аргументации, ownership, инициативность, влияние на решения, устойчивость в коммуникации, работу с неопределенностью, отношение к обратной связи и признаки лидерства.

добавь эти наблюдения в отдельный раздел "## инсайты".

в финальном тексте нельзя прямо писать, что инсайты или выводы сформированы на основании архива переписки, чата или переписки с дизайнером. формулируй их как наблюдения и выводы по совокупности материалов.

верни результат в markdown на русском языке.

структура ответа:
# оценка дизайнера

## итог
- рекомендуемый грейд
- уверенность в оценке
- краткий вывод

## обоснование грейда

## разбор по осям

## инсайты

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
    prompts: [
      "с какими задачами дизайнер реально справляется без потери качества?",
      "есть ли в его работе задачи, где не все очевидно с первого взгляда?",
      "затрагивают ли его задачи только отдельный экран, проект целиком, домен или продукт?"
    ],
    options: {
      14: "уверенно работает с понятными задачами внутри проекта, где ясны цель, рамки и ожидаемый результат",
      15: "может самостоятельно разобраться в не до конца ясной задаче внутри проекта и довести ее до результата",
      16: "может тянуть проект целиком, от которого зависит заметный результат для продукта или бизнеса",
      17: "может вести несколько связанных проектов внутри домена и держать их в общей логике",
      18: "может работать на уровне продукта, где нужно учитывать несколько доменов, сложные зависимости и высокий уровень неопределенности"
    }
  },
  {
    id: "task_source_and_problem_framing",
    title: "откуда берутся задачи",
    description:
      "насколько дизайнер работает по постановке, уточняет постановку, инициирует задачи внутри проекта, поднимает новые проекты, влияет на развитие домена или на продуктовые ставки",
    prompts: [
      "откуда обычно берутся задачи, которыми занимается дизайнер?",
      "приходится ли ему уточнять и доформулировать задачу перед началом работы?",
      "бывает ли, что он сам предлагает, какую задачу, проект, доменовую ставку или продуктовую ставку стоит делать?"
    ],
    options: {
      14: "работает по поставленной задаче с понятным тз и ожидаемым результатом",
      15: "если задача сформулирована не до конца, помогает ее уточнить и собрать рабочую рамку перед стартом",
      16: "внутри проекта сам предлагает, какие задачи стоит делать, и формулирует варианты решения",
      17: "инициирует новые проекты или крупные направления работы внутри домена, если видит проблему или возможность роста",
      18: "может влиять на появление продуктовых ставок и направлений, которые затрагивают несколько доменов внутри Музыки"
    }
  },
  {
    id: "uncertainty_tolerance",
    title: "уровень неопределенности",
    description: "как дизайнер действует, когда не хватает данных, ясности, готовой рамки или подтвержденного направления",
    prompts: [
      "может ли дизайнер продолжать движение, когда не хватает данных?",
      "спокойно ли он относится к расплывчатым задачам?",
      "помогает ли другим разобраться, когда вокруг неясность?"
    ],
    options: {
      14: "для уверенной работы ему важно, чтобы задача была четко описана",
      15: "может двигаться при частичной неопределенности - уточняет вводные и продолжает работу",
      16: "принимает решения без полной информации, даже когда данных не хватает, и двигает проект вперед",
      17: "помогает другим сориентироваться в неопределенности на уровне проекта или домена и собрать более понятную рамку работы",
      18: "может работать в неопределенности на уровне продукта, когда еще не до конца ясно, какую ставку вообще нужно делать и почему"
    }
  },
  {
    id: "scope_of_impact",
    title: "масштаб влияния",
    description: "на какой уровень продукта, команды или компании реально распространяется влияние решений дизайнера",
    prompts: [
      "его решения влияют только на локальную задачу или шире?",
      "думает ли он о том, как решение повлияет на проект, соседние команды, домен и продукт?",
      "заметно ли, что его решения меняют не только макет, но и более широкий контур?"
    ],
    options: {
      14: "его решения влияют на отдельную задачу внутри проекта - экран, сценарий, состояние или кусок флоу",
      15: "его решения влияют на заметную часть проекта и на работу своей кроссфункциональной команды внутри Музыки",
      16: "его решения влияют на проект целиком или на несколько команд внутри Музыки",
      17: "его решения влияют на домен, на несколько проектов внутри него или на ключевые подходы и приоритеты внутри Музыки",
      18: "его решения влияют на продукт, то есть на несколько доменов внутри Музыки, на общие подходы, приоритеты и качество решений"
    }
  },
  {
    id: "ownership_and_autonomy",
    title: "автономность и ответственность",
    description:
      "какой уровень оунершипа дизайнер реально держит - на уровне задачи, проекта, домена, продукта и последствий решений во времени",
    prompts: [
      "нужны ли дизайнеру инструкции, чтобы начать работу?",
      "сам ли он принимает решения внутри своей зоны ответственности?",
      "думает ли он о том, что будет с решением после релиза?"
    ],
    options: {
      14: "корректно выполняет задачу в рамках поставленной инструкции и ожидаемого результата",
      15: "самостоятельно принимает решения внутри своей задачи или крупного куска работы",
      16: "держит качество и целостность проекта от начала до конца, а не только своей локальной части",
      17: "держит оунершип за несколько проектов внутри домена, думает о последствиях решений во времени и о том, к чему они приведут дальше",
      18: "берет оунершип не только за выполнение задач, но и за качество продуктового направления, приоритеты и общую силу решений на уровне нескольких доменов"
    }
  },
  {
    id: "influence_and_collaboration",
    title: "взаимодействие и влияние",
    description:
      "как дизайнер влияет на решения других людей - внутри своей задачи, кроссфункциональной команды, проекта, домена, продукта и шире",
    prompts: [
      "может ли дизайнер понятно объяснить свои решения?",
      "влияют ли его аргументы на решения команды?",
      "обращаются ли к нему за советом по сложным вопросам?"
    ],
    options: {
      14: "коммуницирует по своим задачам и рабочим решениям внутри кроссфункциональной команды",
      15: "может аргументировать свои решения и договариваться с по, пм, разработкой и кью-эй в рамках проекта",
      16: "влияет на решения своей кроссфункциональной команды и помогает ей принимать более сильные продуктовые решения",
      17: "может продвигать и удерживать важные решения на уровне нескольких проектов или домена внутри Музыки, а также лидить других дизайнеров",
      18: "формирует подходы, принципы и рамки, на которые начинают опираться дизайнеры и команды на уровне продукта"
    }
  },
  {
    id: "superpower",
    title: "суперсила",
    description: "в чем дизайнер дает наибольшее усиление - на уровне задачи, своей команды, проекта, домена, продукта или шире",
    prompts: [
      "с какими вопросами или задачами к нему чаще всего приходят коллеги?",
      "за что его чаще всего благодарят или отмечают в работе?",
      "если убрать его из команды, в чем почувствуется наибольшая потеря?"
    ],
    options: {
      14: "сильная сторона пока скорее формируется - уже видно, где дизайнер особенно полезен, но выраженная суперсила еще не оформилась",
      15: "понимает, в чем именно его сильная сторона, и регулярно применяет ее в работе",
      16: "его сильная сторона заметно усиливает проект или качество ключевых решений внутри него",
      17: "его сильная сторона заметно усиливает домен, несколько проектов внутри него или других дизайнеров, а к его экспертизе регулярно обращаются за советом",
      18: "его сильная сторона влияет на подходы, дизайн-культуру и продуктовые решения на уровне продукта"
    }
  }
];

const DEFAULT_STATE = {
  profile: {
    reviewType: "",
    designerName: "",
    filledBy: "",
    assessmentPeriodPreset: "3m",
    assessmentStartDate: getDefaultPeriodRange("3m").startDate,
    assessmentEndDate: getDefaultPeriodRange("3m").endDate,
    currentGrade: "",
    teamOrDirection: "",
    context: "",
    periodTaskContext: ""
  },
  axes: Object.fromEntries(
    AXES.map((axis) => [
      axis.id,
      {
        selectedLevel: "",
        selectedLevels: [],
        selectedStatement: "",
        selectedStatements: [],
        evidence: ""
      }
    ])
  ),
  optionOrder: buildOptionOrderMap(),
  voiceDrafts: {},
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
let bundledDefaultAttachments = [];
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
let attachmentProcessingStatus = "";

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
      axes: {
        ...cloneDefaultState().axes,
        ...(parsed.axes || {})
      },
      voiceDrafts: {
        ...cloneDefaultState().voiceDrafts,
        ...(parsed.voiceDrafts || {})
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

    nextState.attachments = mergeDefaultAttachments(nextState.attachments);
    nextState.axes = Object.fromEntries(
      AXES.map((axis) => [axis.id, normalizeAxisState(axis.id, nextState.axes[axis.id])])
    );

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
  return AXES.filter((axis) => Number(state.axes[axis.id].selectedLevel) >= 14).length;
}

function render() {
  const answeredCount = getAnsweredCount();
  const totalCount = AXES.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  app.innerHTML = `
    <div class="progress-dock-anchor">
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
    </div>

    <section class="profile-card">
      <h2>базовая информация</h2>
      <div class="field-grid field-grid--double">
        ${renderInput("reviewType", "тип ревью", state.profile.reviewType, "например, pr или mr")}
        ${renderInput("designerName", "имя дизайнера", state.profile.designerName, "например, алина")}
      </div>
      <div class="field-grid field-grid--double">
        ${renderInput("filledBy", "кто заполняет", state.profile.filledBy, "лид, арт-директор, менеджер")}
        ${renderInput("teamOrDirection", "команда / направление", state.profile.teamOrDirection, "например, b2c")}
      </div>
      <div class="field-grid">
        ${renderTrackerTokenInput()}
      </div>
      <div class="field-stack">
        <h3 class="profile-subtitle">период оценки</h3>
        <div class="field-grid field-grid--double field-grid--period">
          ${renderDateInput("assessmentStartDate", "с даты", state.profile.assessmentStartDate)}
          ${renderDateInput("assessmentEndDate", "по дату", state.profile.assessmentEndDate)}
        </div>
      </div>
      <div class="field-grid">
        ${renderSelect("currentGrade", "текущий формальный грейд дизайнера", state.profile.currentGrade, GRADE_OPTIONS)}
      </div>
      ${renderCommentField({
        fieldId: "profile-context",
        label: "контекст команды, домена и зоны ответственности дизайнера",
        value: state.profile.context,
        placeholder:
          "опиши контекст команды, домен, тип задач дизайнера, уровень автономности, с кем он взаимодействует и за что отвечает.",
        textareaAttributes: 'data-field="profile.context"'
      })}
      ${renderCommentField({
        fieldId: "profile-period-task-context",
        label: "контекст задач за период",
        value: state.profile.periodTaskContext,
        placeholder:
          "перечисли ключевые проекты, инициативы, большие куски работы и важные изменения за оцениваемый период.",
        textareaAttributes: 'data-field="profile.periodTaskContext"'
      })}
    </section>

    <section class="section-divider">
      <h2 class="section-divider-title">оси оценки</h2>
    </section>

    ${AXES.map(renderAxisCard).join("")}

    <section class="profile-card">
      ${renderCommentField({
        fieldId: "general-notes",
        label: "дополнительные комментарии",
        value: state.generalNotes,
        placeholder:
          "например: сильные стороны, зоны роста, важные наблюдения, сомнения по калибровке или дополнительные сигналы, которые стоит учесть в оценке.",
        textareaAttributes: 'data-field="generalNotes"'
      })}
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
        ${renderEvaluateAction()}
        <button class="button button-stroke" id="export-markdown-button" type="button">экспортировать анкету</button>
      </div>
    </section>

    ${state.error ? `<section class="error-box">${escapeHtml(state.error)}</section>` : ""}
  `;

  attachEvents();
  window.requestAnimationFrame(syncProgressDockOffset);
}

function syncProgressDockOffset() {
  const progressDockAnchor = document.querySelector(".progress-dock-anchor");
  const progressDock = document.querySelector(".progress-dock");
  const touchMedia = window.matchMedia ? window.matchMedia(TOUCH_PROGRESS_DOCK_QUERY) : null;
  const disableFloatingOnTouch = touchMedia?.matches || navigator.maxTouchPoints > 0;
  const nextHeight = progressDock ? Math.ceil(progressDock.getBoundingClientRect().height) : 0;
  document.documentElement.style.setProperty("--progress-dock-height", disableFloatingOnTouch ? "0px" : `${nextHeight}px`);
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

function renderInput(fieldId, label, value, placeholder) {
  return `
    <div class="field">
      <label for="${fieldId}">${label}</label>
      <input id="${fieldId}" type="text" data-field="profile.${fieldId}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
    </div>
  `;
}

function renderSelect(fieldId, label, value, options, optionDefinitions = null) {
  const normalizedOptions = Array.isArray(optionDefinitions)
    ? optionDefinitions
    : options.map((option) => ({ value: option, label: option }));
  const optionValues = normalizedOptions.map((option) => String(option.value));
  const normalizedValue = optionValues.includes(String(value)) ? String(value) : "";

  return `
    <div class="field">
      <label for="${fieldId}">${label}</label>
      <select id="${fieldId}" data-field="profile.${fieldId}">
        <option value="">не выбран</option>
        ${normalizedOptions
          .map(
            (option) =>
              `<option value="${escapeHtml(String(option.value))}" ${
                normalizedValue === String(option.value) ? "selected" : ""
              }>${escapeHtml(String(option.label))}</option>`
          )
          .join("")}
      </select>
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
          placeholder="${hasToken ? "вставь новый токен, чтобы заменить текущий" : "вставь OAuth-токен Трекера"}"
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
      <span class="field-help">${
        hasToken
          ? "текущий токен сохранен только в этом браузере. если вставишь новый, он заменит старый."
          : "токен хранится только локально в этом браузере и используется для прямого запроса в Трекер."
      }</span>
    </div>
  `;
}

function renderCommentField({ fieldId, label, value, placeholder, textareaAttributes }) {
  const voiceButton = renderVoiceRecorderButton(fieldId);
  const voiceStatus = renderVoiceRecorderStatus(fieldId);
  const voiceRetryActions = renderVoiceDraftActions(fieldId);

  return `
    <div class="textarea-field">
      <label class="sr-only" for="${fieldId}">${label}</label>
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

function renderAxisCard(axis, index) {
  const axisState = state.axes[axis.id];
  const hasPrompts = Array.isArray(axis.prompts) && axis.prompts.length > 0;
  const selectedLevel = Number(axisState.selectedLevel);
  const hasSelection = Number.isFinite(selectedLevel) && selectedLevel >= 14;

  return `
    <section class="axis-card">
      <div class="axis-head">
        <div class="axis-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h2>${escapeHtml(axis.title)}</h2>
        </div>
        ${hasSelection
          ? `
            <button class="button-secondary" type="button" data-clear-axis="${axis.id}">
              снять выбор
            </button>
          `
          : ""}
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
            const isSelected = selectedLevel === Number(level);
            const optionLabel = String(level);

            return `
              <label class="grade-option ${isSelected ? "is-selected" : ""}">
                <input
                  type="radio"
                  name="axis-${axis.id}"
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

      ${renderCommentField({
        fieldId: `evidence-${axis.id}`,
        label: "комментарий",
        value: axisState.evidence,
        placeholder: "опиши наблюдения, примеры и сигналы по этой оси.",
        textareaAttributes: `data-evidence-axis="${axis.id}"`
      })}
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
    <button class="button button-with-icon" id="evaluate-button" type="button">
      ${EVALUATE_ICON}
      <span>получить оценку</span>
    </button>
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

  document.querySelectorAll("[data-tracker-token]").forEach((node) => {
    node.addEventListener("change", handleTrackerTokenChange);
  });

  const clearTrackerTokenButton = document.getElementById("clear-tracker-token-button");
  if (clearTrackerTokenButton) {
    clearTrackerTokenButton.addEventListener("click", handleTrackerTokenClear);
  }

  document.querySelectorAll("[data-evidence-axis]").forEach((node) => {
    node.addEventListener("input", handleEvidenceInput);
  });

  document.querySelectorAll('input[type="radio"][data-axis]').forEach((node) => {
    node.addEventListener("change", handleAxisSelectionChange);
  });

  document.querySelectorAll("[data-clear-axis]").forEach((node) => {
    node.addEventListener("click", handleAxisSelectionClear);
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
      if (key === "assessmentPeriodPreset") {
        applyAssessmentPeriodPreset(state.profile.assessmentPeriodPreset);
      }
      if (key === "assessmentStartDate" || key === "assessmentEndDate") {
        state.profile.assessmentPeriodPreset = "custom";
        normalizeAssessmentPeriodRange();
      }
    }
  }

  state.error = "";
  clearEvaluationResult();
  if (!persistState()) {
    render();
  }
}

function handleTrackerTokenChange(event) {
  const value = String(event.target.value || "").trim();
  if (value) {
    setStoredTrackerToken(value);
  }
  event.target.value = "";
  state.error = "";
  clearEvaluationResult();
  persistState();
  render();
}

function handleTrackerTokenClear() {
  clearStoredTrackerToken();
  state.error = "";
  clearEvaluationResult();
  persistState();
  render();
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

function handleAxisSelectionChange(event) {
  const axisId = event.target.dataset.axis;
  const selectedLevel = Number(event.target.value);
  const axisConfig = AXES.find((axis) => axis.id === axisId);
  const selectedStatement = axisConfig?.options?.[selectedLevel] || "";

  state.axes[axisId].selectedLevel = selectedLevel;
  state.axes[axisId].selectedLevels = selectedStatement ? [selectedLevel] : [];
  state.axes[axisId].selectedStatement = selectedStatement;
  state.axes[axisId].selectedStatements = selectedStatement ? [selectedStatement] : [];
  state.error = "";
  clearEvaluationResult();
  persistState();
  render();
}

function handleAxisSelectionClear(event) {
  const axisId = event.currentTarget.dataset.clearAxis;
  if (!axisId || !state.axes[axisId]) {
    return;
  }

  state.axes[axisId].selectedLevel = "";
  state.axes[axisId].selectedLevels = [];
  state.axes[axisId].selectedStatement = "";
  state.axes[axisId].selectedStatements = [];
  state.error = "";
  clearEvaluationResult();
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

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size > 0) {
        activeMediaChunks.push(event.data);
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
    const transcript = shouldUseServerEvaluation()
      ? await requestServerTranscription(transcriptionChunks, mimeType)
      : await requestClientTranscription(transcriptionChunks, mimeType);

    applyTranscriptToComment(fieldId, transcript);
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
    clearEvaluationResult();
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
      throw new Error("OpenAI не вернул текст транскрибации.");
    }

    return transcript;
  });
}

async function requestClientTranscription(audioChunks, mimeType) {
  const apiKey = await getOpenAIApiKey();
  return transcribeAudioChunks(audioChunks, async (audioChunk, chunkIndex) => {
    const formData = new FormData();
    formData.append("model", OPENAI_TRANSCRIPTION_MODEL);
    formData.append("language", "ru");
    formData.append("file", buildAudioFile(audioChunk, chunkIndex));

    const response = await fetch(OPENAI_TRANSCRIPTION_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(extractOpenAIErrorMessage(payload, response.status));
    }

    const transcript = String(payload.text || "").trim();
    if (!transcript) {
      throw new Error("OpenAI не вернул текст транскрибации.");
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

  return mergeTranscriptParts(transcriptParts);
}

function updateTranscriptionProgress(currentIndex, totalChunks) {
  voiceRecorder.progressLabel =
    totalChunks > 1
      ? `расшифровываем длинную запись: часть ${currentIndex + 1} из ${totalChunks}.`
      : "расшифровываем запись и подставляем текст.";
  render();
}

function mergeTranscriptParts(parts) {
  return parts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
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
    // ignore close errors from already-closed contexts
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

function applyTranscriptToComment(fieldId, transcript) {
  const normalizedTranscript = String(transcript || "").trim();
  if (!normalizedTranscript) {
    return;
  }

  if (fieldId === "profile-context") {
    state.profile.context = appendTranscript(state.profile.context, normalizedTranscript);
    return;
  }

  if (fieldId === "profile-period-task-context") {
    state.profile.periodTaskContext = appendTranscript(state.profile.periodTaskContext, normalizedTranscript);
    return;
  }

  if (fieldId === "general-notes") {
    state.generalNotes = appendTranscript(state.generalNotes, normalizedTranscript);
    return;
  }

  if (fieldId.startsWith("evidence-")) {
    const axisId = fieldId.replace("evidence-", "");
    if (state.axes[axisId]) {
      state.axes[axisId].evidence = appendTranscript(state.axes[axisId].evidence, normalizedTranscript);
    }
  }
}

function appendTranscript(existingValue, transcript) {
  const currentValue = String(existingValue || "").trim();
  return currentValue ? `${currentValue}\n\n${transcript}` : transcript;
}

function buildAudioFile(audioBlob, chunkIndex = 0, mimeTypeOverride = "") {
  const mimeType = mimeTypeOverride || audioBlob.type || "audio/webm";
  const extension = getAudioFileExtension(mimeType);
  return new File([audioBlob], `voice-note-part-${chunkIndex + 1}.${extension}`, { type: mimeType });
}

function getAudioFileExtension(mimeType) {
  if (mimeType.includes("mp4")) {
    return "mp4";
  }
  if (mimeType.includes("ogg")) {
    return "ogg";
  }
  return "webm";
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
  attachmentProcessingStatus = "сжимаю json по смыслу...";
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
    const trackerData = await collectTrackerContext();
    const evaluation = shouldUseServerEvaluation()
      ? await requestServerEvaluation(cardMarkdown, trackerData)
      : await requestClientEvaluation(cardMarkdown, trackerData);

    state.evaluation = evaluation;
    state.error = evaluation.trackerWarning || trackerData.trackerWarning || "";
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

function getServerEvaluationUrl() {
  const host = String(window.location.hostname || "").trim().toLowerCase();
  if (host === "127.0.0.1" || host === "localhost") {
    return REMOTE_SERVER_EVALUATION_URL;
  }
  return SERVER_EVALUATION_URL;
}

async function requestServerEvaluation(cardMarkdown, trackerData = {}) {
  const response = await fetch(getServerEvaluationUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      card_markdown: cardMarkdown,
      designer_name: state.profile.designerName,
      tracker_login: "",
      tracker_context: trackerData.trackerContext || "",
      tracker_warning: trackerData.trackerWarning || ""
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `не удалось получить оценку. статус ответа: ${response.status}`);
  }

  return {
    status: "done",
    fileName: payload.file_name || "designer-assessment-result.md",
    content: String(payload.content || ""),
    trackerWarning: String(payload.tracker_warning || "").trim()
  };
}

async function requestClientEvaluation(cardMarkdown, trackerData = {}) {
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
      input: buildClientEvaluationInput(cardMarkdown, trackerData)
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
    content,
    trackerWarning: String(trackerData.trackerWarning || "").trim()
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
  await clearAllVoiceDrafts();
  voiceRecorder.status = "idle";
  voiceRecorder.targetFieldId = "";
  voiceRecorder.error = "";
  await ensureBundledDefaultAttachment();
  persistState();
  render();
}

function buildMarkdownExport() {
  const lines = [
    "# анкета по карте ожиданий продуктового дизайнера",
    "",
    `- сгенерировано: ${formatTimestamp(new Date())}`,
    `- тип ревью: ${formatField(state.profile.reviewType)}`,
    `- имя дизайнера: ${formatField(state.profile.designerName)}`,
    `- кто заполняет: ${formatField(state.profile.filledBy)}`,
    `- период оценки: ${formatAssessmentPeriodLabel()}`,
    `- команда / направление: ${formatField(state.profile.teamOrDirection)}`,
    `- текущий формальный грейд дизайнера: ${formatField(state.profile.currentGrade)}`,
    "",
    "## базовая информация",
    "",
    formatParagraph(state.profile.context),
    "",
    "## контекст задач за период",
    "",
    formatParagraph(state.profile.periodTaskContext),
    "",
    "## оси оценки",
    ""
  ];

  AXES.forEach((axis, index) => {
    const axisState = state.axes[axis.id] || {};
    const selectedLevel = Number(axisState.selectedLevel);
    const displayOptions = getDisplayOptions(axis);
    const hasPrompts = Array.isArray(axis.prompts) && axis.prompts.length > 0;

    lines.push(`### ${index + 1}. ${axis.title}`);
    lines.push("");
    lines.push(axis.description);
    lines.push("");
    if (hasPrompts) {
      lines.push("проверочные вопросы:");
      lines.push(...toMarkdownBullets(axis.prompts));
      lines.push("");
    }
    lines.push("уровни:");
    lines.push(
      ...displayOptions.map(({ level, statement }) => {
        const optionLabel = String(level);
        const marker = selectedLevel === Number(level) ? "x" : " ";
        return `- [${marker}] ${optionLabel}: ${statement}`;
      })
    );
    lines.push("");
    lines.push("комментарий:");
    lines.push("");
    lines.push(formatParagraph(axisState.evidence));
    lines.push("");
  });

  lines.push("## дополнительные заметки");
  lines.push("");
  lines.push(formatParagraph(state.generalNotes));
  lines.push("");

  (state.attachments || []).forEach((attachment, index) => {
    lines.push(...buildAttachmentSection(attachment, index));
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

function buildClientEvaluationInput(cardMarkdown, trackerData = {}) {
  const sections = [String(cardMarkdown || "").trim()];
  const trackerContext = String(trackerData.trackerContext || "").trim();
  const trackerWarning = String(trackerData.trackerWarning || "").trim();

  if (trackerContext) {
    sections.push(trackerContext);
  } else if (trackerWarning) {
    sections.push(["## статус данных из Яндекс Трекера", "", trackerWarning].join("\n"));
  }

  return sections.filter(Boolean).join("\n\n").trim();
}

async function collectTrackerContext() {
  const designerName = String(state.profile.designerName || "").trim();
  if (!designerName) {
    return { trackerContext: "", trackerWarning: "" };
  }
  normalizeAssessmentPeriodRange();
  const period = getAssessmentPeriodRange();

  let trackerToken = getStoredTrackerToken();
  if (!trackerToken) {
    trackerToken = await requestTrackerToken();
  }

  if (!trackerToken) {
    return {
      trackerContext: "",
      trackerWarning:
        "Контекст из Трекера не добавлен: не указан OAuth-токен Трекера. Токен сохраняется только локально в этом браузере."
    };
  }

  if (shouldUseServerEvaluation()) {
    return requestServerTrackerContext(designerName, trackerToken, period);
  }

  return collectBrowserTrackerContextDirect(designerName, trackerToken, period);
}

async function requestServerTrackerContext(designerName, trackerToken, period) {
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
    return {
      trackerContext: "",
      trackerWarning: humanizeServerTrackerError(payload, response.status)
    };
  }

  return {
    trackerContext: String(payload.tracker_context || "").trim(),
    trackerWarning: ""
  };
}

async function collectBrowserTrackerContextDirect(designerName, trackerToken, period) {
  try {
    const trackerUser = await resolveTrackerUserFromBrowser(designerName, trackerToken);
    const issues = await fetchTrackerIssuesFromBrowser(trackerUser.login, trackerToken, period);
    return {
      trackerContext: renderTrackerContextForEvaluation({
        designerName,
        trackerLogin: trackerUser.login,
        period,
        issues
      }),
      trackerWarning: ""
    };
  } catch (error) {
    return {
      trackerContext: "",
      trackerWarning: humanizeBrowserTrackerError(error)
    };
  }
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

async function requestTrackerToken() {
  const promptedToken = window.prompt(
    "вставь OAuth-токен Яндекс Трекера. он сохранится только в этом браузере и нужен, чтобы приложение могло запросить данные из Трекера."
  );
  const normalizedToken = String(promptedToken || "").trim();
  if (!normalizedToken) {
    return "";
  }

  setStoredTrackerToken(normalizedToken);
  return normalizedToken;
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

function applyAssessmentPeriodPreset(preset) {
  const normalizedPreset = String(preset || "").trim() || "3m";
  if (normalizedPreset === "custom") {
    normalizeAssessmentPeriodRange();
    return;
  }

  const range = getDefaultPeriodRange(normalizedPreset);
  state.profile.assessmentPeriodPreset = normalizedPreset;
  state.profile.assessmentStartDate = range.startDate;
  state.profile.assessmentEndDate = range.endDate;
}

function getDefaultPeriodRange(preset = "3m") {
  const endDate = new Date();
  const startDate = new Date(endDate);
  const monthsByPreset = {
    "1m": 1,
    "3m": 3,
    "6m": 6
  };
  const months = monthsByPreset[preset] || 3;
  startDate.setMonth(startDate.getMonth() - months);

  return {
    startDate: formatDateInputValue(startDate),
    endDate: formatDateInputValue(endDate)
  };
}

function normalizeAssessmentPeriodRange() {
  const current = getAssessmentPeriodRange();
  state.profile.assessmentStartDate = current.startDate;
  state.profile.assessmentEndDate = current.endDate;
}

function getAssessmentPeriodRange() {
  const fallback = getDefaultPeriodRange(state.profile.assessmentPeriodPreset || "3m");
  let startDate = normalizeDateInputValue(state.profile.assessmentStartDate) || fallback.startDate;
  let endDate = normalizeDateInputValue(state.profile.assessmentEndDate) || fallback.endDate;

  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  return { startDate, endDate };
}

function formatAssessmentPeriodLabel() {
  const { startDate, endDate } = getAssessmentPeriodRange();
  return `${startDate} — ${endDate}`;
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

async function fetchTrackerIssuesFromBrowser(trackerLogin, trackerToken, period) {
  const issues = [];
  let page = 1;

  while (issues.length < TRACKER_MAX_ISSUES) {
    const response = await fetch(
      `${TRACKER_API_BASE_URL}/issues/_search?perPage=${TRACKER_PAGE_SIZE}&page=${page}`,
      {
        method: "POST",
        headers: {
          Authorization: `OAuth ${trackerToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query:
            `Assignee: ${trackerLogin}@ AND Updated: >= "${period.startDate}" AND Updated: <= "${period.endDate}" ` +
            `"Sort by": Updated DESC`
        })
      }
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const trackerError = new Error(
        extractTrackerApiError(payload, response.status) || `tracker request failed: ${response.status}`
      );
      trackerError.status = response.status;
      throw trackerError;
    }

    const batch = Array.isArray(payload) ? payload : [];
    if (!batch.length) {
      break;
    }

    issues.push(...batch.filter(isRelevantTrackerIssue));
    if (batch.length < TRACKER_PAGE_SIZE) {
      break;
    }

    page += 1;
  }

  return issues.slice(0, TRACKER_MAX_ISSUES);
}

async function resolveTrackerUserFromBrowser(designerName, trackerToken) {
  const knownLogin = lookupKnownTrackerLoginByName(designerName);
  if (knownLogin) {
    return {
      login: knownLogin,
      display: String(designerName || knownLogin).trim()
    };
  }

  const query = encodeURIComponent(String(designerName || "").trim());
  const response = await fetch(`${TRACKER_API_BASE_URL}/users?query=${query}`, {
    method: "GET",
    headers: {
      Authorization: `OAuth ${trackerToken}`
    }
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const trackerError = new Error(
      extractTrackerApiError(payload, response.status) || `tracker user lookup failed: ${response.status}`
    );
    trackerError.status = response.status;
    throw trackerError;
  }

  const users = Array.isArray(payload) ? payload : [];
  const winner = pickBestTrackerUser(users, designerName);
  if (!winner?.login) {
    throw new Error(
      "Не удалось найти дизайнера в Трекере по имени. Укажи имя и фамилию так же, как они записаны в Трекере."
    );
  }

  return {
    login: String(winner.login || "").trim(),
    display: String(winner.display || designerName).trim()
  };
}

function renderTrackerContextForEvaluation({ designerName, trackerLogin, period, issues }) {
  const displayName = formatField(designerName || trackerLogin);
  const safeIssues = Array.isArray(issues) ? issues : [];
  if (!safeIssues.length) {
    return [
      "## данные из Яндекс Трекера",
      "",
      `- дизайнер: ${displayName}`,
      `- период: ${period.startDate} — ${period.endDate}`,
      "- задач по фильтру не найдено"
    ].join("\n");
  }

  const queueCounts = new Map();
  const statusCounts = new Map();
  const typeCounts = new Map();
  let withDescriptionCount = 0;
  let resolvedCount = 0;

  safeIssues.forEach((issue) => {
    const queueName = extractTrackerDisplay(issue?.queue);
    const statusName = extractTrackerDisplay(issue?.status);
    const typeName = extractTrackerDisplay(issue?.type);

    if (queueName) {
      queueCounts.set(queueName, (queueCounts.get(queueName) || 0) + 1);
    }
    if (statusName) {
      statusCounts.set(statusName, (statusCounts.get(statusName) || 0) + 1);
    }
    if (typeName) {
      typeCounts.set(typeName, (typeCounts.get(typeName) || 0) + 1);
    }
    if (normalizeTrackerDescription(issue).trim()) {
      withDescriptionCount += 1;
    }
    if (issue?.resolvedAt) {
      resolvedCount += 1;
    }
  });

  const lines = [
    "## данные из Яндекс Трекера",
    "",
    `- дизайнер: ${displayName}`,
    `- период: ${period.startDate} — ${period.endDate}`,
    `- найдено задач: ${safeIssues.length}`,
    `- закрыто задач: ${resolvedCount}`,
    `- задач с описанием: ${withDescriptionCount}`,
    `- основные очереди: ${formatTrackerCounter(queueCounts)}`,
    `- статусы: ${formatTrackerCounter(statusCounts)}`,
    `- типы задач: ${formatTrackerCounter(typeCounts)}`,
    "",
    "### последние задачи",
    ""
  ];

  safeIssues.slice(0, TRACKER_SNIPPET_LIMIT).forEach((issue) => {
    lines.push(...renderTrackerIssueSnippet(issue));
  });

  return lines.join("\n").trim();
}

function renderTrackerIssueSnippet(issue) {
  const key = String(issue?.key || "").trim() || "без ключа";
  const summary = String(issue?.summary || "").trim() || "без названия";
  const queueName = extractTrackerDisplay(issue?.queue) || "без очереди";
  const issueType = extractTrackerDisplay(issue?.type) || "без типа";
  const status = extractTrackerDisplay(issue?.status) || "без статуса";
  const updatedAt = formatTrackerIssueDate(issue?.updatedAt);
  const resolvedAt = formatTrackerIssueDate(issue?.resolvedAt);
  const description = trimTrackerText(normalizeTrackerDescription(issue), TRACKER_DESCRIPTION_LIMIT);

  const lines = [
    `- ${key} | ${summary}`,
    `  очередь: ${queueName}; тип: ${issueType}; статус: ${status}; updated: ${updatedAt}${
      resolvedAt ? `; resolved: ${resolvedAt}` : ""
    }`
  ];

  if (description) {
    lines.push(`  описание: ${description}`);
  }

  return lines;
}

function humanizeBrowserTrackerError(error) {
  const message = String(error?.message || "").trim();
  const status = Number(error?.status || 0);

  if (status === 401 || status === 403) {
    return "Не удалось получить данные из Трекера напрямую из браузера. Проверь, что OAuth-токен актуален и что твой доступ к Трекеру разрешен из текущей сети.";
  }

  if (error instanceof TypeError || /failed to fetch/i.test(message)) {
    return "Не удалось сходить в Трекер напрямую из браузера. Скорее всего, нужен корпоративный Wi-Fi YTeam или VPN. В отчете будет оценка без контекста задач из Трекера.";
  }

  return (
    message ||
    "Не удалось получить данные из Трекера. В отчете будет оценка без контекста задач из Трекера."
  );
}

function humanizeServerTrackerError(payload, status) {
  const details =
    (typeof payload?.error === "string" && payload.error.trim()) ||
    extractTrackerApiError(payload, status) ||
    "";

  if (status === 401 || status === 403) {
    return "Сервер не смог получить данные из Трекера. Проверь, что OAuth-токен актуален и у него есть доступ к нужным данным.";
  }

  if (status >= 500 && details) {
    return `Не удалось получить данные из Трекера через сервер: ${details}`;
  }

  return details || "Не удалось получить данные из Трекера через сервер.";
}

function extractTrackerApiError(payload, status) {
  const errorMessage = Array.isArray(payload?.errorMessages) ? payload.errorMessages.join(" | ") : "";
  if (errorMessage.trim()) {
    return errorMessage.trim();
  }
  if (typeof payload?.error === "string" && payload.error.trim()) {
    return payload.error.trim();
  }
  return `не удалось получить данные из Трекера. статус ответа: ${status}`;
}

function isRelevantTrackerIssue(issue) {
  if (!issue || typeof issue !== "object") {
    return false;
  }

  const queueKey = normalizeTrackerKey(issue.queue?.key);
  const queueDisplay = normalizeTrackerKey(issue.queue?.display);
  const typeKey = normalizeTrackerKey(issue.type?.key);
  const typeDisplay = normalizeTrackerKey(issue.type?.display);

  if (TRACKER_EXCLUDED_QUEUE_KEYS.has(queueKey) || TRACKER_EXCLUDED_QUEUE_KEYS.has(queueDisplay)) {
    return false;
  }
  if (TRACKER_EXCLUDED_TYPE_KEYS.has(typeKey)) {
    return false;
  }
  if (TRACKER_EXCLUDED_TYPE_NAMES.has(typeDisplay)) {
    return false;
  }

  return true;
}

function extractTrackerDisplay(value) {
  if (value && typeof value === "object") {
    return String(value.display || value.key || "").trim();
  }
  return "";
}

function normalizeTrackerDescription(issue) {
  const rawDescription = String(issue?.description || "");
  if (!rawDescription) {
    return "";
  }

  return rawDescription
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$2")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatTrackerCounter(counterMap) {
  const entries = Array.from(counterMap.entries());
  if (!entries.length) {
    return "нет данных";
  }

  return entries
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "ru"))
    .slice(0, 5)
    .map(([name, count]) => `${name} (${count})`)
    .join(", ");
}

function formatTrackerIssueDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString().slice(0, 10);
}

function trimTrackerText(value, limit) {
  const normalized = String(value || "").trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function normalizeTrackerLogin(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/@yandex-team\.ru$/i, "")
    .replace(/^@+/, "")
    .replace(/\s+/g, "");
}

function normalizeTrackerKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "");
}

function pickBestTrackerUser(users, lookupName) {
  const normalizedLookup = normalizeTrackerName(lookupName);
  const candidates = (Array.isArray(users) ? users : [])
    .map((user) => ({ user, score: scoreTrackerUserCandidate(user, normalizedLookup) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  return candidates[0]?.user || null;
}

function lookupKnownTrackerLoginByName(value) {
  const normalized = normalizeTrackerName(value);
  const matched = TRACKER_NAME_LOGIN_MAP[normalized];
  return matched ? normalizeTrackerLogin(matched) : "";
}

function scoreTrackerUserCandidate(user, normalizedLookup) {
  const login = normalizeTrackerName(user?.login);
  const display = normalizeTrackerName(user?.display);
  const fullName = normalizeTrackerName(`${user?.firstName || ""} ${user?.lastName || ""}`);
  const dismissed = Boolean(user?.dismissed);

  if (!login) {
    return 0;
  }
  if (display === normalizedLookup || fullName === normalizedLookup) {
    return dismissed ? 700 : 1000;
  }
  if (display.startsWith(normalizedLookup) || fullName.startsWith(normalizedLookup)) {
    return dismissed ? 500 : 850;
  }

  const lookupTokens = new Set(normalizedLookup.split(" ").filter(Boolean));
  const fullNameTokens = new Set(fullName.split(" ").filter(Boolean));
  if (lookupTokens.size && [...lookupTokens].every((token) => fullNameTokens.has(token))) {
    return (dismissed ? 300 : 700) + lookupTokens.size;
  }

  if (normalizedLookup && (display.includes(normalizedLookup) || fullName.includes(normalizedLookup))) {
    return dismissed ? 250 : 500;
  }

  return 0;
}

function normalizeTrackerName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ");
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

function buildAttachmentSection(attachment, index) {
  const safeAttachment = sanitizeAttachment(attachment, index);
  if (!safeAttachment) {
    return [];
  }

  const lines = [`### приложение ${index + 1} - ${safeAttachment.name}`, ""];
  const analysisHint = getAttachmentAnalysisHint(safeAttachment.name);
  if (analysisHint) {
    lines.push(analysisHint, "");
  }

  lines.push(formatAttachmentContent(safeAttachment.content), "");
  return lines;
}

function getAttachmentAnalysisHint(fileName) {
  const normalizedName = String(fileName || "").trim().toLowerCase();
  if (normalizedName !== "result.json") {
    return "";
  }

  return [
    "служебная пометка для анализа:",
    "- это архив рабочей коммуникации; используй его как источник косвенных поведенческих и профессиональных сигналов",
    "- извлекай инсайты про самостоятельность, инициативность, глубину мышления, коммуникацию, ownership, влияние на решения и работу с неопределенностью",
    "- добавляй такие наблюдения в раздел \"инсайты\"",
    "- в финальной резолюции не упоминай переписку, чат или архив как прямой источник этих выводов"
  ].join("\n");
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

  const name = String(attachment.name || `документ-${index + 1}.txt`).trim() || `документ-${index + 1}.txt`;
  return {
    id: String(attachment.id || buildAttachmentId()),
    name,
    content: normalizeStoredAttachmentContent(name, normalizeTextContent(attachment.content)),
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

function isTextDocument(file) {
  return file.type.startsWith("text/") || TEXT_DOCUMENT_PATTERN.test(file.name);
}

async function readTextAttachment(file) {
  const content = await file.text();
  return {
    id: buildAttachmentId(),
    name: file.name || "документ.txt",
    content: await prepareAttachmentContent(file.name || "документ.txt", normalizeTextContent(content))
  };
}

function buildAttachmentId() {
  return `attachment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeTextContent(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function normalizeStoredAttachmentContent(fileName, rawContent) {
  return normalizeTextContent(rawContent);
}

async function prepareAttachmentContent(fileName, rawContent) {
  const normalizedName = String(fileName || "").trim().toLowerCase();
  const normalizedContent = normalizeTextContent(rawContent);
  if (!shouldSemanticSummarizeJsonAttachment(normalizedName, normalizedContent)) {
    return normalizedContent;
  }
  if (normalizedContent.startsWith(JSON_ATTACHMENT_SUMMARY_MARKER)) {
    return normalizedContent;
  }

  const summarizedContent = await requestAttachmentSemanticSummary(fileName, normalizedContent);
  return [
    JSON_ATTACHMENT_SUMMARY_MARKER,
    "json был сжат по смыслу через модель при загрузке.",
    `исходный размер: ${normalizedContent.length} символов`,
    `сжатый размер: ${summarizedContent.length} символов`,
    "",
    summarizedContent
  ].join("\n");
}

function shouldSemanticSummarizeJsonAttachment(normalizedFileName, normalizedContent) {
  if (String(normalizedFileName || "").endsWith(".json")) {
    return true;
  }

  const trimmed = String(normalizedContent || "").trimStart();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

async function requestAttachmentSemanticSummary(fileName, content) {
  if (shouldUseServerEvaluation()) {
    try {
      return await requestServerAttachmentSummary(fileName, content);
    } catch (error) {
      if (!getStoredOpenAIApiKey()) {
        throw error;
      }
      return requestClientAttachmentSummary(fileName, content);
    }
  }

  return requestClientAttachmentSummary(fileName, content);
}

async function requestServerAttachmentSummary(fileName, content) {
  const urls = getServerAttachmentSummaryUrls();
  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: fileName,
          content
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `не удалось сжать json. статус ответа: ${response.status}`);
      }

      const summarizedContent = String(payload.content || "").trim();
      if (!summarizedContent) {
        throw new Error("OpenAI не вернул смысловую выжимку по JSON.");
      }

      return summarizedContent;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("не удалось сжать json.");
}

function getServerAttachmentSummaryUrls() {
  const host = String(window.location.hostname || "").trim().toLowerCase();
  if (host === "127.0.0.1" || host === "localhost") {
    return [SERVER_ATTACHMENT_SUMMARY_URL, REMOTE_SERVER_ATTACHMENT_SUMMARY_URL];
  }
  return [SERVER_ATTACHMENT_SUMMARY_URL];
}

async function requestClientAttachmentSummary(fileName, content) {
  const apiKey = await getOpenAIApiKey();
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions: [
        "ты делаешь смысловую выжимку загруженного JSON-файла для последующей оценки продуктового дизайнера.",
        "",
        "если JSON похож на архив рабочей переписки, чатов, комментариев, тредов или логов общения:",
        "- сделай короткое summary переписки за период",
        "- выдели участников, основные темы, важные решения и сигналы про самостоятельность, качество вопросов, аргументацию, ownership, инициативность, влияние на решения, устойчивость в коммуникации, работу с неопределенностью и отношение к обратной связи",
        "",
        "если это не переписка, а другой JSON:",
        "- кратко объясни, что это за данные",
        "- выдели ключевые сущности, события и наблюдения, полезные для оценки дизайнера",
        "",
        "правила:",
        "- отвечай на русском",
        "- верни компактный markdown",
        "- не вставляй большие цитаты и не выводи сырой JSON"
      ].join("\n"),
      input: `имя файла: ${fileName}\n\njson:\n${content}`
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(extractOpenAIErrorMessage(payload, response.status));
  }

  const summarizedContent = extractEvaluationText(payload);
  if (!summarizedContent) {
    throw new Error("OpenAI не вернул смысловую выжимку по JSON.");
  }

  return summarizedContent;
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

function normalizeAxisState(axisId, axisState) {
  const defaultAxisState = cloneDefaultState().axes[axisId];
  const nextState = {
    ...defaultAxisState,
    ...(axisState || {})
  };

  const explicitLevel = Number(nextState.selectedLevel);
  const fallbackLevels = Array.isArray(nextState.selectedLevels) ? nextState.selectedLevels.map(Number) : [];
  const normalizedLevel =
    (Number.isFinite(explicitLevel) && explicitLevel >= 14
      ? explicitLevel
      : fallbackLevels.find((level) => Number.isFinite(level) && level >= 14)) || "";
  const normalizedStatement = normalizedLevel
    ? AXES.find((axis) => axis.id === axisId)?.options?.[normalizedLevel] || ""
    : "";

  return {
    ...nextState,
    selectedLevel: normalizedLevel,
    selectedLevels: normalizedStatement ? [normalizedLevel] : [],
    selectedStatement: normalizedStatement,
    selectedStatements: normalizedStatement ? [normalizedStatement] : []
  };
}
