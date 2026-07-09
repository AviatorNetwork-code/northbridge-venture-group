import type { ConsultantVoiceCopy } from "@/lib/nordi/consultant-voice/types";

export const SPANISH_COPY: ConsultantVoiceCopy = {
  soloOperatorReasoning: [
    "Cuando lo manejas todo tú solo, cada interrupción suele afectar a todo el negocio.",
    "",
    "Eso me ayuda a entender dónde las mejoras operativas podrían tener mayor impacto.",
  ].join("\n"),
  smallTeamReasoning: [
    "Con un equipo pequeño, la coordinación suele vivir en la cabeza de pocas personas.",
    "",
    "Ahí es donde normalmente aparecen primero los retrasos en seguimientos y agenda.",
  ].join("\n"),
  multiChannelReasoning: [
    "Cuando los clientes te contactan por varios canales, el contexto se dispersa rápido si no hay un lugar claro para registrar solicitudes abiertas.",
    "",
    "Ese patrón aparece mucho en negocios liderados por el dueño.",
  ].join("\n"),
  singleChannelReasoning:
    "La forma en que te contactan los clientes define dónde se pierden los mensajes — especialmente cuando estás atendiendo a alguien en persona.",
  frictionReasoning:
    "Ese tipo de fricción semanal es donde muchos dueños sienten que el negocio los controla a ellos, y no al revés.",
  referralReasoning: [
    "Los negocios que crecen por referidos suelen ganar con confianza.",
    "",
    "Eso hace que la rapidez de respuesta y la confiabilidad en la agenda sean aún más visibles para clientes nuevos.",
  ].join("\n"),
  industryDetailReasoning: (label) =>
    `Para un negocio de ${label.toLowerCase()}, los detalles operativos que compartes importan más que funciones genéricas de software.`,
  referralConnection: [
    [
      "Eso encaja con lo que ya me has contado.",
      "",
      "Los negocios por referidos dependen mucho de la rapidez de respuesta, así que la agenda de citas se vuelve aún más importante.",
    ].join("\n"),
  ],
  schedulingContactConnection:
    "Dado el tema de agenda que mencionaste, quiero entender cómo suelen iniciar contacto los clientes hoy.",
  soloFrictionConnection:
    "Como operador solo, la fricción que sientes suele estar directamente ligada a cuánto cambias de contexto en un día.",
  questionReasons: {
    "general-team-size":
      "La escala cambia dónde aparecen los cuellos de botella — quiero entender eso antes de profundizar.",
    "general-customer-contact":
      "Cómo te contactan los clientes me dice dónde es más probable que se pierdan los seguimientos.",
    "general-friction":
      "Quiero enfocarme en el cuello de botella operativo que realmente te cuesta tiempo cada semana.",
    "dental-online-booking":
      "Las reservas en línea cambian cuánta coordinación manual ocurre en recepción.",
    "dental-reminders":
      "El seguimiento de recordatorios es uno de los puntos más claros donde experiencia del paciente e ingresos se encuentran.",
    "hvac-scheduling":
      "La agenda suele ser el punto clave entre lo que prometes en marketing y lo que entregas día a día.",
    "hvac-emergency":
      "La demanda fuera de horario suele ser donde las operaciones de HVAC se vuelven costosas rápido.",
  },
  trustSummaryHeader: "Hasta ahora, esto es lo que estoy viendo:",
  trustSummaryFooter: "Eso me da una imagen mucho más clara.",
  soloOperatorLabel: "Operador solo",
  employeeCountLabel: (count) => `Aproximadamente ${count} personas involucradas en el día a día`,
  customersViaLabel: (channels) => `Los clientes te contactan por ${channels}`,
  recommendationLeads: [
    "Están empezando a destacar algunos patrones en cómo funciona el negocio día a día.",
    "Con lo que has compartido, aparecen algunos temas operativos recurrentes.",
  ],
  recommendationFooter:
    "Me gustaría entender un poco mejor tu proceso actual antes de hablar de posibles mejoras.",
  websitePermissionLeads: [
    "Si tienes un sitio web público, revisarlo puede ayudarme a conectar lo que describes con lo que ven los clientes.",
    "Una mirada rápida a tu sitio web público a veces revela brechas entre cómo funciona el negocio y cómo lo experimentan los clientes.",
    "Cuando los dueños describen bien sus operaciones, me gusta ver si el sitio web público refleja esa misma claridad.",
  ],
  websiteUrlAckPrefix: "Perfecto — revisaré tu sitio público mientras seguimos conversando.",
  websiteFinishedReview: "Terminé de revisar tu sitio web.",
  noOnlineBooking: "no encontré reservas de citas en línea",
  noContactForm: "no hay un formulario de contacto evidente para consultas nuevas",
  hvacEmergencyObs:
    "el servicio de emergencia es prominente, lo que suele significar que la coordinación fuera de horario importa",
  schedulingAlignment: "Eso coincide con lo que has estado describiendo sobre la agenda.",
  websiteFrictionConnection:
    "Puede explicar parte de la fricción que describiste — podemos seguir conectando los puntos mientras hablamos.",
  industryOpening: (label) => {
    const options = [
      `Un negocio de ${label.toLowerCase()} — eso me da un buen punto de partida.`,
      `${label} — ese contexto me ayuda a hacer mejores preguntas.`,
      `Entendido — los negocios de ${label.toLowerCase()} suelen compartir presiones operativas similares.`,
    ];
    return options[Math.floor(Math.random() * options.length)];
  },
  websitePermissionPrompt:
    "¿Te gustaría que eche un vistazo rápido a tu sitio web público mientras continuamos?",
  websiteUrlReady:
    "Perfecto — pega la URL de tu sitio web cuando quieras, y lo revisaré mientras seguimos conversando.",
  websiteDeclinedLead: "No hay problema — podemos seguir aprendiendo de la conversación.",
  websiteDeclinedFollowUp:
    "¿Cómo se ve normalmente el recorrido de un cliente desde el primer contacto hasta el servicio completado?",
  whileThatRunsPrefix: "Mientras tanto,",
  customerFindYouFallback: "cuéntame más sobre cómo suelen encontrarte los clientes.",
  salesPressureDeflection: [
    "Quiero entender bien tu negocio antes de hablar de soluciones.",
    "",
    "Ayúdame con un detalle operativo más — ¿qué parte de la semana se siente más repetitiva para tu equipo?",
  ],
  generalFrictionLead:
    "Lo que has descrito me da una imagen más clara de cómo funciona realmente la semana.",
  generalFrictionQuestion:
    "¿Qué suele generar más fricción en una semana típica — agenda, seguimientos, personal u otra cosa?",
  relationshipAcknowledgment: "",
};
