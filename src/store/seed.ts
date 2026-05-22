// Стартовые мок-данные прототипа. Покрывают все обязательные состояния ТЗ:
// проект в тендере, этап на проверке, завершённый этап, а также черновик,
// приглашение подрядчика и архив. Бэкенда нет — это статичные данные.

import type { Contractor, Project } from "@/lib/types";

/** Личность текущего клиента. */
export const CLIENT = {
  name: "Анна Котова",
  company: "ООО «Вертикаль»",
  contact: "a.kotova@vertikal.ru",
};

/** Личность текущего менеджера платформы. */
export const MANAGER = {
  name: "Игорь Лебедев",
  contact: "manager@struxco.ru",
};

/** Текущий подрядчик (роль «Подрядчик» в прототипе). */
export const CURRENT_CONTRACTOR_ID = "ctr-stroyalliance";

export const CONTRACTORS: Contractor[] = [
  {
    id: "ctr-stroyalliance",
    name: "СтройАльянс",
    contactPerson: "Дмитрий Орлов",
    contact: "d.orlov@stroyalliance.ru",
  },
  {
    id: "ctr-monolitstroy",
    name: "МонолитСтрой",
    contactPerson: "Сергей Гущин",
    contact: "guschin@monolitstroy.ru",
  },
];

const clientLabel = `${CLIENT.name}, ${CLIENT.company}`;

export function buildSeedProjects(): Project[] {
  return [
    // ── P1 · Черновик ─ ТЗ ожидает валидации менеджером ───────────────────
    {
      id: "p1",
      code: "STX-104",
      name: "Ремонт офиса под ключ, ул. Лесная 7",
      description:
        "Нужен комплексный ремонт офиса 320 м² под ключ: демонтаж старой отделки, " +
        "электрика и слаботочка, выравнивание стен и потолков, чистовая отделка, " +
        "монтаж кондиционирования. Открытое пространство + 4 переговорные.",
      budgetFrom: 2_400_000,
      budgetTo: 3_100_000,
      desiredStart: "2026-06-15",
      desiredEnd: "2026-09-30",
      status: "draft",
      priority: "medium",
      archived: false,
      clientName: clientLabel,
      clientContact: CLIENT.contact,
      invitedContractorIds: [],
      proposals: [],
      stages: [],
      files: [
        {
          id: "f-p1-1",
          name: "ТЗ_ремонт_офиса.pdf",
          kind: "tz",
          size: "1,2 МБ",
          uploadedBy: CLIENT.name,
          date: "2026-05-17",
        },
        {
          id: "f-p1-2",
          name: "Планировка_2_этаж.pdf",
          kind: "tz",
          size: "840 КБ",
          uploadedBy: CLIENT.name,
          date: "2026-05-17",
        },
      ],
      messages: [
        {
          id: "m-p1-1",
          authorRole: "platform",
          authorName: "Платформа Struxco",
          text: "Здравствуйте! ТЗ получено, менеджер платформы изучает детали. Уточним пару моментов и откроем тендер.",
          time: "17.05, 14:20",
        },
      ],
      activity: [
        {
          id: "a-p1-1",
          time: "17.05, 14:05",
          text: "Клиент создал проект и отправил ТЗ на согласование",
          actor: "client",
        },
      ],
    },

    // ── P5 · Тендер ─ подрядчику отправлено приглашение, КП ещё не подан ──
    {
      id: "p5",
      code: "STX-101",
      name: "Монтаж вентиляции, БЦ «Прогресс»",
      description:
        "Проектирование и монтаж приточно-вытяжной вентиляции на этаже 1 100 м². " +
        "Включая закупку оборудования, прокладку воздуховодов и пусконаладку.",
      budgetFrom: 900_000,
      budgetTo: 1_300_000,
      desiredStart: "2026-06-01",
      desiredEnd: "2026-07-20",
      status: "tender",
      priority: "high",
      archived: false,
      clientName: clientLabel,
      clientContact: CLIENT.contact,
      invitedContractorIds: ["ctr-stroyalliance", "ctr-monolitstroy"],
      proposals: [
        {
          id: "pr-p5-monolit",
          contractorId: "ctr-monolitstroy",
          contractorName: "МонолитСтрой",
          total: 1_180_000,
          durationDays: 40,
          comment:
            "Готовы начать сразу после согласования. Оборудование — Systemair, гарантия 3 года.",
          validatedByManager: true,
          stages: [
            { name: "Проектная привязка и закупка", amount: 280_000, durationDays: 8 },
            { name: "Монтаж воздуховодов", amount: 540_000, durationDays: 20 },
            { name: "Пусконаладка и сдача", amount: 360_000, durationDays: 12 },
          ],
        },
      ],
      stages: [],
      files: [
        {
          id: "f-p5-1",
          name: "ТЗ_вентиляция_Прогресс.pdf",
          kind: "tz",
          size: "960 КБ",
          uploadedBy: CLIENT.name,
          date: "2026-05-12",
        },
        {
          id: "f-p5-2",
          name: "КП_МонолитСтрой.pdf",
          kind: "kp",
          size: "1,1 МБ",
          uploadedBy: "Сергей Гущин",
          date: "2026-05-16",
        },
      ],
      messages: [
        {
          id: "m-p5-1",
          authorRole: "platform",
          authorName: "Платформа Struxco",
          text: "Тендер открыт. В short-list приглашены два проверенных подрядчика. Ждём второе КП.",
          time: "14.05, 11:30",
        },
      ],
      activity: [
        {
          id: "a-p5-1",
          time: "12.05, 09:40",
          text: "Клиент отправил ТЗ на согласование",
          actor: "client",
        },
        {
          id: "a-p5-2",
          time: "14.05, 11:30",
          text: "Менеджер открыл тендер и пригласил 2 подрядчиков",
          actor: "platform",
        },
        {
          id: "a-p5-3",
          time: "16.05, 16:10",
          text: "Подрядчик «МонолитСтрой» подал КП — проверено менеджером",
          actor: "platform",
        },
      ],
    },

    // ── P2 · Тендер ─ оба КП собраны и переданы клиенту на выбор ──────────
    {
      id: "p2",
      code: "STX-097",
      name: "Реконструкция склада «Север»",
      description:
        "Реконструкция складского комплекса 1 800 м²: демонтаж, усиление несущих " +
        "конструкций, замена кровли и фасада, прокладка инженерных сетей.",
      budgetFrom: 1_800_000,
      budgetTo: 2_400_000,
      desiredStart: "2026-06-10",
      desiredEnd: "2026-09-15",
      status: "tender",
      priority: "medium",
      archived: false,
      clientName: clientLabel,
      clientContact: CLIENT.contact,
      invitedContractorIds: ["ctr-stroyalliance", "ctr-monolitstroy"],
      proposals: [
        {
          id: "pr-p2-stroy",
          contractorId: "ctr-stroyalliance",
          contractorName: "СтройАльянс",
          total: 2_150_000,
          durationDays: 95,
          comment:
            "Берём проект целиком. Своя бригада монтажников, техника в собственности — без простоев.",
          validatedByManager: true,
          stages: [
            { name: "Демонтаж и расчистка", amount: 320_000, durationDays: 14 },
            { name: "Усиление несущих конструкций", amount: 780_000, durationDays: 35 },
            { name: "Кровля и фасад", amount: 640_000, durationDays: 28 },
            { name: "Инженерные сети и сдача", amount: 410_000, durationDays: 18 },
          ],
        },
        {
          id: "pr-p2-monolit",
          contractorId: "ctr-monolitstroy",
          contractorName: "МонолитСтрой",
          total: 2_290_000,
          durationDays: 82,
          comment:
            "Сделаем быстрее за счёт параллельных бригад. Усиление каркаса — по проверенной технологии.",
          validatedByManager: true,
          stages: [
            { name: "Демонтаж и подготовка площадки", amount: 350_000, durationDays: 12 },
            { name: "Усиление каркаса", amount: 820_000, durationDays: 30 },
            { name: "Кровельные и фасадные работы", amount: 700_000, durationDays: 24 },
            { name: "Прокладка инженерных систем", amount: 420_000, durationDays: 16 },
          ],
        },
      ],
      stages: [],
      files: [
        {
          id: "f-p2-1",
          name: "ТЗ_реконструкция_склад.pdf",
          kind: "tz",
          size: "1,8 МБ",
          uploadedBy: CLIENT.name,
          date: "2026-05-06",
        },
        {
          id: "f-p2-2",
          name: "КП_СтройАльянс.pdf",
          kind: "kp",
          size: "1,3 МБ",
          uploadedBy: "Дмитрий Орлов",
          date: "2026-05-13",
        },
        {
          id: "f-p2-3",
          name: "КП_МонолитСтрой.pdf",
          kind: "kp",
          size: "1,4 МБ",
          uploadedBy: "Сергей Гущин",
          date: "2026-05-14",
        },
      ],
      messages: [
        {
          id: "m-p2-1",
          authorRole: "platform",
          authorName: "Платформа Struxco",
          text: "Оба коммерческих предложения собраны и проверены. Вкладка «Тендер» — сравните и выберите подрядчика.",
          time: "15.05, 10:00",
        },
        {
          id: "m-p2-2",
          authorRole: "client",
          authorName: "Анна Котова",
          text: "Спасибо, изучаю предложения.",
          time: "15.05, 12:42",
        },
      ],
      activity: [
        {
          id: "a-p2-1",
          time: "06.05, 13:00",
          text: "Клиент отправил ТЗ на согласование",
          actor: "client",
        },
        {
          id: "a-p2-2",
          time: "08.05, 09:15",
          text: "Менеджер согласовал ТЗ и открыл тендер",
          actor: "platform",
        },
        {
          id: "a-p2-3",
          time: "13.05, 17:20",
          text: "Подрядчик «СтройАльянс» подал КП",
          actor: "contractor",
        },
        {
          id: "a-p2-4",
          time: "14.05, 11:05",
          text: "Подрядчик «МонолитСтрой» подал КП",
          actor: "contractor",
        },
        {
          id: "a-p2-5",
          time: "15.05, 10:00",
          text: "Менеджер проверил оба КП и передал клиенту",
          actor: "platform",
        },
      ],
    },

    // ── P3 · В работе / На приёмке ─ обязательные демо-состояния этапов ───
    {
      id: "p3",
      code: "STX-088",
      name: "Отделка шоурума «Галерея»",
      description:
        "Чистовая отделка торгового шоурума 540 м²: демонтаж, электрика и слаботочка, " +
        "финишная отделка, монтаж торгового оборудования и сдача объекта.",
      budgetFrom: 1_400_000,
      budgetTo: 1_900_000,
      desiredStart: "2026-04-01",
      desiredEnd: "2026-07-10",
      status: "in_progress",
      priority: "high",
      archived: false,
      clientName: clientLabel,
      clientContact: CLIENT.contact,
      invitedContractorIds: ["ctr-stroyalliance", "ctr-monolitstroy"],
      contractorId: "ctr-stroyalliance",
      contractorName: "СтройАльянс",
      selectedProposalId: "pr-p3-stroy",
      proposals: [],
      stages: [
        {
          id: "st-p3-1",
          name: "Демонтаж и подготовка",
          status: "accepted",
          amount: 240_000,
          planStart: "2026-04-01",
          planEnd: "2026-04-18",
          reportFiles: [
            {
              id: "f-p3-r1",
              name: "Отчёт_демонтаж_фото.zip",
              kind: "report",
              size: "8,4 МБ",
              uploadedBy: "Дмитрий Орлов",
              date: "2026-04-17",
            },
          ],
        },
        {
          id: "st-p3-2",
          name: "Электромонтаж и слаботочка",
          status: "review",
          reviewPhase: "manager_check",
          amount: 520_000,
          planStart: "2026-04-19",
          planEnd: "2026-05-22",
          reportFiles: [
            {
              id: "f-p3-r2",
              name: "Отчёт_электрика_фото.zip",
              kind: "report",
              size: "12,1 МБ",
              uploadedBy: "Дмитрий Орлов",
              date: "2026-05-19",
            },
            {
              id: "f-p3-r3",
              name: "Акт_скрытых_работ.pdf",
              kind: "report",
              size: "640 КБ",
              uploadedBy: "Дмитрий Орлов",
              date: "2026-05-19",
            },
          ],
        },
        {
          id: "st-p3-3",
          name: "Чистовая отделка",
          status: "needs_payment",
          amount: 660_000,
          planStart: "2026-05-23",
          planEnd: "2026-06-20",
          reportFiles: [],
        },
        {
          id: "st-p3-4",
          name: "Финишные работы и сдача",
          status: "needs_payment",
          amount: 260_000,
          planStart: "2026-06-21",
          planEnd: "2026-07-10",
          reportFiles: [],
        },
      ],
      files: [
        {
          id: "f-p3-1",
          name: "ТЗ_шоурум_Галерея.pdf",
          kind: "tz",
          size: "1,5 МБ",
          uploadedBy: CLIENT.name,
          date: "2026-03-20",
        },
        {
          id: "f-p3-2",
          name: "КП_СтройАльянс_итог.pdf",
          kind: "kp",
          size: "1,2 МБ",
          uploadedBy: "Дмитрий Орлов",
          date: "2026-03-28",
        },
        {
          id: "f-p3-3",
          name: "Договор_подряда_STX-088.pdf",
          kind: "contract",
          size: "420 КБ",
          uploadedBy: "Платформа Struxco",
          date: "2026-03-30",
        },
      ],
      messages: [
        {
          id: "m-p3-1",
          authorRole: "platform",
          authorName: "Платформа Struxco",
          text: "Проект в работе. Этап «Демонтаж» принят и оплачен. Подрядчик приступил к электромонтажу.",
          time: "19.04, 09:00",
        },
        {
          id: "m-p3-2",
          authorRole: "contractor",
          authorName: "Дмитрий Орлов",
          text: "Электромонтаж завершён, выложил фото-отчёт и акт скрытых работ. Прошу приёмку.",
          time: "19.05, 08:30",
        },
        {
          id: "m-p3-3",
          authorRole: "platform",
          authorName: "Платформа Struxco",
          text: "Принял отчёт в проверку. Проверим и передадим на подтверждение клиенту.",
          time: "19.05, 09:15",
        },
      ],
      activity: [
        {
          id: "a-p3-1",
          time: "28.03, 14:00",
          text: "Клиент выбрал подрядчика «СтройАльянс» — проект переведён в работу",
          actor: "client",
        },
        {
          id: "a-p3-2",
          time: "01.04, 10:00",
          text: "Этап «Демонтаж и подготовка» оплачен — средства в эскроу",
          actor: "client",
        },
        {
          id: "a-p3-3",
          time: "17.04, 16:30",
          text: "Этап «Демонтаж и подготовка» принят и оплачен подрядчику",
          actor: "platform",
        },
        {
          id: "a-p3-4",
          time: "19.04, 09:00",
          text: "Этап «Электромонтаж и слаботочка» оплачен — средства в эскроу",
          actor: "client",
        },
        {
          id: "a-p3-5",
          time: "19.05, 08:30",
          text: "Подрядчик запросил приёмку этапа «Электромонтаж и слаботочка»",
          actor: "contractor",
        },
      ],
    },

    // ── P4 · Завершён + Архив ─ демонстрация фильтра «Архив» ──────────────
    {
      id: "p4",
      code: "STX-061",
      name: "Косметический ремонт переговорных",
      description:
        "Косметический ремонт трёх переговорных комнат: подготовка поверхностей, " +
        "малярные работы, замена напольного покрытия.",
      budgetFrom: 350_000,
      budgetTo: 480_000,
      desiredStart: "2026-02-01",
      desiredEnd: "2026-04-15",
      status: "done",
      priority: "low",
      archived: true,
      clientName: clientLabel,
      clientContact: CLIENT.contact,
      invitedContractorIds: ["ctr-monolitstroy", "ctr-stroyalliance"],
      contractorId: "ctr-monolitstroy",
      contractorName: "МонолитСтрой",
      selectedProposalId: "pr-p4-monolit",
      proposals: [],
      stages: [
        {
          id: "st-p4-1",
          name: "Подготовка и демонтаж",
          status: "accepted",
          amount: 90_000,
          planStart: "2026-02-01",
          planEnd: "2026-02-20",
          reportFiles: [],
        },
        {
          id: "st-p4-2",
          name: "Малярные работы",
          status: "accepted",
          amount: 180_000,
          planStart: "2026-02-21",
          planEnd: "2026-03-25",
          reportFiles: [],
        },
        {
          id: "st-p4-3",
          name: "Замена напольного покрытия",
          status: "accepted",
          amount: 140_000,
          planStart: "2026-03-26",
          planEnd: "2026-04-15",
          reportFiles: [],
        },
      ],
      files: [
        {
          id: "f-p4-1",
          name: "ТЗ_переговорные.pdf",
          kind: "tz",
          size: "680 КБ",
          uploadedBy: CLIENT.name,
          date: "2026-01-15",
        },
        {
          id: "f-p4-2",
          name: "Договор_подряда_STX-061.pdf",
          kind: "contract",
          size: "390 КБ",
          uploadedBy: "Платформа Struxco",
          date: "2026-01-28",
        },
      ],
      messages: [
        {
          id: "m-p4-1",
          authorRole: "platform",
          authorName: "Платформа Struxco",
          text: "Все этапы приняты и оплачены. Проект завершён, спасибо за работу!",
          time: "15.04, 18:00",
        },
      ],
      activity: [
        {
          id: "a-p4-1",
          time: "28.01, 12:00",
          text: "Клиент выбрал подрядчика «МонолитСтрой» — проект переведён в работу",
          actor: "client",
        },
        {
          id: "a-p4-2",
          time: "15.04, 18:00",
          text: "Все этапы приняты и оплачены — проект завершён",
          actor: "platform",
        },
      ],
    },
  ];
}
