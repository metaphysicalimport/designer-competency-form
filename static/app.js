const STORAGE_KEY = "designer-competency-app-v5";
const OPTION_LABELS = ["a", "b", "c", "d", "e"];
const GRADE_OPTIONS = ["14", "15", "16", "17", "18"];
const TEXT_DOCUMENT_PATTERN = /\.(txt|md|markdown|csv|json|log|rtf|yaml|yml|xml|html?|css|js|ts|tsx|jsx)$/i;
const BUNDLED_ATTACHMENT_ID = "builtin-product-designer-competencies";
const BUNDLED_ATTACHMENT_NAME = "компетенции продуктового дизайнера.md";
const BUNDLED_ATTACHMENT_URL = new URL("./product-designer-competencies.md", window.location.href).toString();
const SERVER_EVALUATION_URL = "/api/evaluate";
const SERVER_TRANSCRIPTION_URL = "/api/transcribe";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_TRANSCRIPTION_API_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_MODEL = "gpt-4.1";
const OPENAI_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const OPENAI_KEY_STORAGE = "designer-competency-openai-key-v1";
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

const IDEAL_DESIGNER_SECTIONS = [
  {
    id: "solution_generation",
    stage: "дискавери этап",
    title: "генерация решений и сценарное мышление",
    bullets: [
      "умеет смотреть на задачу целиком, а не только на отдельный экран",
      "предлагает несколько осмысленных вариантов решения, а не первый очевидный",
      "видит последствия решений в соседних состояниях, переходах и флоу"
    ]
  },
  {
    id: "aesthetics",
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
  },
  {
    id: "shared_contribution",
    stage: "общее дело",
    title: "общее дело",
    bullets: [
      "вклад в общую планку качества",
      "развитие способов работы",
      "усиление других дизайнеров",
      "инициативы, которые улучшают систему, а не только локальный результат",
      "вклад в общую ясность, культуру решений и силу дизайн-функции"
    ]
  }
];

const DEFAULT_STATE = {
  profile: {
    evaluatorName: "",
    evaluatorRole: "",
    designerName: "",
    trackerLogin: "",
    designerRole: "",
    currentGrade: "",
    targetGrade: "",
    context: ""
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
let bundledDefaultAttachment = null;
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
      axes: {
        ...cloneDefaultState().axes,
        ...(parsed.axes || {})
      },
      idealRatings: {
        ...cloneDefaultState().idealRatings,
        ...(parsed.idealRatings || {})
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

    if (!nextState.profile.designerRole || nextState.profile.designerRole === "product designer") {
      nextState.profile.designerRole = cloneDefaultState().profile.designerRole;
    }

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
  const axesAnswered = AXES.filter((axis) => Number(state.axes[axis.id].selectedLevel) >= 14).length;
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
      <h2>контекст оценки</h2>
      <div class="field-grid field-grid--double">
        ${renderInput("designerName", "имя дизайнера", state.profile.designerName, "например, алина")}
        ${renderInput(
          "trackerLogin",
          "логин в Трекере",
          state.profile.trackerLogin,
          "например, bolshakovd"
        )}
      </div>
      <div class="field-grid field-grid--double">
        ${renderInput(
          "designerRole",
          "роль дизайнера",
          state.profile.designerRole,
          "например, старший дизайнер продукта"
        )}
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
    </section>

    <section class="section-divider">
      <h2 class="section-divider-title">оси оценки</h2>
    </section>

    ${AXES.map(renderAxisCard).join("")}

    <section class="section-divider">
      <h2 class="section-divider-title">оценка по навыкам</h2>
    </section>

    ${renderIdealDesignerSections()}

    <section class="profile-card">
      ${renderCommentField({
        fieldId: "general-notes",
        label: "комментарий",
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
            const optionLabel = OPTION_LABELS[displayIndex] || String(displayIndex + 1);

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
      ${renderCommentField({
        fieldId: `rating-comment-${section.id}`,
        label: "комментарий",
        value: ratingState.comment,
        placeholder: "опиши, почему поставлена такая оценка по этому навыку.",
        textareaAttributes: `data-rating-comment="${section.id}"`
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

  if (fieldId === "general-notes") {
    state.generalNotes = appendTranscript(state.generalNotes, normalizedTranscript);
    return;
  }

  if (fieldId.startsWith("evidence-")) {
    const axisId = fieldId.replace("evidence-", "");
    if (state.axes[axisId]) {
      state.axes[axisId].evidence = appendTranscript(state.axes[axisId].evidence, normalizedTranscript);
    }
    return;
  }

  if (fieldId.startsWith("rating-comment-")) {
    const sectionId = fieldId.replace("rating-comment-", "");
    if (state.idealRatings[sectionId]) {
      state.idealRatings[sectionId].comment = appendTranscript(
        state.idealRatings[sectionId].comment,
        normalizedTranscript
      );
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
    state.error = evaluation.trackerWarning || "";
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
      card_markdown: cardMarkdown,
      designer_name: state.profile.designerName,
      tracker_login: state.profile.trackerLogin
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
    "# анкета для оценки дизайнера по карте компетенций",
    "",
    `- сгенерировано: ${formatTimestamp(new Date())}`,
    `- имя дизайнера: ${formatField(state.profile.designerName)}`,
    `- логин в Трекере: ${formatField(state.profile.trackerLogin)}`,
    `- роль дизайнера: ${formatField(state.profile.designerRole)}`,
    `- текущий формальный грейд дизайнера: ${formatField(state.profile.currentGrade)}`,
    "",
    "## контекст оценки",
    "",
    formatParagraph(state.profile.context),
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
    lines.push("варианты:");
    lines.push(
      ...displayOptions.map(({ level, statement }, displayIndex) => {
        const optionLabel = OPTION_LABELS[displayIndex] || String(displayIndex + 1);
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
