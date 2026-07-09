import type { InterruptionType, SupportedLanguage } from "./types.js";

type KnowledgeLibrary = Record<SupportedLanguage, Record<InterruptionType, string>>;

const KNOWLEDGE: KnowledgeLibrary = {
  en: {
    company: [
      "Northbridge Digital is a software company focused on helping businesses operate more intelligently.",
      "",
      "Our flagship platform, Nordi, learns how a business operates, connects existing systems, and helps owners understand what is happening across their organization.",
      "",
      "For businesses with unique operational requirements, our engineering team also develops custom digital solutions.",
    ].join("\n"),
    pricing: [
      "Pricing depends on what your business actually needs — there is no one-size-fits-all package.",
      "",
      "Nordi starts with understanding your operation first. Once we know where support would genuinely help, we can discuss options that fit your scale and priorities.",
      "",
      "I'm not here to sell before we understand your business.",
    ].join("\n"),
    products: [
      "Our flagship product is **Nordi** — business operating intelligence that learns how your business runs.",
      "",
      "Nordi focuses on business understanding, connected operations, operational visibility, evidence-based insights, and continuous business memory.",
      "",
      "You can explore more at /services#products.",
    ].join("\n"),
    services: [
      "Northbridge Digital offers two paths:",
      "",
      "• **Nordi** — our flagship platform for business operating intelligence",
      "• **Custom digital solutions** — websites, portals, mobile apps, workflow automation, integrations, and enterprise software when your operation needs something unique",
      "",
      "Everything starts with understanding how your business actually works.",
    ].join("\n"),
    founder: [
      "Northbridge was founded by **Andres Suarez**, an entrepreneur and aviation professional.",
      "",
      "The work started with Aviator Network and expanded into building software that helps operators run better businesses — with human judgment always in the lead.",
    ].join("\n"),
    location: [
      "Northbridge Digital works with business owners remotely and serves clients across the United States.",
      "",
      "If you'd like to speak with the team directly, you can request a call anytime.",
    ].join("\n"),
    website: [
      "You can explore the Northbridge website anytime — About, Services, Ventures, Products, and Contact are all available from the menu.",
      "",
      "I'm here in the conversation if you'd rather keep learning through dialogue.",
    ].join("\n"),
    human_assistance: [
      "Absolutely — I can connect you with a member of the Northbridge team.",
      "",
      "Use **Request Call** whenever you're ready, and we'll follow up directly.",
    ].join("\n"),
    navigation: [
      "You can explore the Northbridge website from the menu — About, Services, Ventures, Products, Contact, and Help are all available.",
      "",
      "We can also keep talking here and I'll guide you.",
    ].join("\n"),
    general_knowledge: [
      "Northbridge builds software that helps businesses operate with greater clarity — starting with conversation, not a product catalog.",
      "",
      "Nordi learns your business first, then recommends operational support that fits how you actually work.",
    ].join("\n"),
    small_talk: "Of course — happy to keep going whenever you're ready.",
  },
  es: {
    company: [
      "Northbridge Digital es una empresa de software enfocada en ayudar a los negocios a operar con más inteligencia.",
      "",
      "Nuestra plataforma principal, Nordi, aprende cómo funciona un negocio, conecta sistemas existentes y ayuda a los dueños a entender qué ocurre en su organización.",
      "",
      "Para negocios con necesidades operativas únicas, nuestro equipo de ingeniería también desarrolla soluciones digitales personalizadas.",
    ].join("\n"),
    pricing: [
      "El precio depende de lo que su negocio realmente necesita — no hay un paquete único para todos.",
      "",
      "Nordi empieza entendiendo su operación primero. Cuando sepamos dónde el apoyo ayudaría de verdad, podemos hablar de opciones acordes a su escala y prioridades.",
      "",
      "No estoy aquí para vender antes de entender su negocio.",
    ].join("\n"),
    products: [
      "Nuestro producto principal es **Nordi** — inteligencia operativa que aprende cómo funciona su negocio.",
      "",
      "Nordi se enfoca en comprensión del negocio, operaciones conectadas, visibilidad operativa, insights basados en evidencia y memoria continua del negocio.",
      "",
      "Puede explorar más en /services#products.",
    ].join("\n"),
    services: [
      "Northbridge Digital ofrece dos caminos:",
      "",
      "• **Nordi** — nuestra plataforma principal de inteligencia operativa",
      "• **Soluciones digitales personalizadas** — sitios web, portales, apps móviles, automatización, integraciones y software empresarial cuando su operación necesita algo único",
      "",
      "Todo empieza por entender cómo funciona realmente su negocio.",
    ].join("\n"),
    founder: [
      "Northbridge fue fundada por **Andres Suarez**, emprendedor y profesional de aviación.",
      "",
      "El trabajo comenzó con Aviator Network y creció hacia software que ayuda a los operadores a dirigir mejores negocios — con el criterio humano siempre al frente.",
    ].join("\n"),
    location: [
      "Northbridge Digital trabaja con dueños de negocios de forma remota y atiende clientes en Estados Unidos.",
      "",
      "Si prefiere hablar con el equipo directamente, puede solicitar una llamada en cualquier momento.",
    ].join("\n"),
    website: [
      "Puede explorar el sitio web de Northbridge cuando quiera — Acerca de, Servicios, Ventures, Productos y Contacto están disponibles en el menú.",
      "",
      "También podemos seguir conversando aquí si prefiere aprender por diálogo.",
    ].join("\n"),
    human_assistance: [
      "Por supuesto — puedo conectarlo con un miembro del equipo de Northbridge.",
      "",
      "Use **Solicitar llamada** cuando esté listo y le daremos seguimiento directamente.",
    ].join("\n"),
    navigation: [
      "Puede explorar el sitio web de Northbridge desde el menú — Acerca de, Servicios, Ventures, Productos, Contacto y Ayuda están disponibles.",
      "",
      "También podemos seguir hablando aquí y lo guiaré.",
    ].join("\n"),
    general_knowledge: [
      "Northbridge construye software que ayuda a los negocios a operar con mayor claridad — empezando por la conversación, no por un catálogo de productos.",
      "",
      "Nordi aprende su negocio primero y luego recomienda apoyo operativo acorde a cómo trabaja realmente.",
    ].join("\n"),
    small_talk: "Claro — podemos continuar cuando quiera.",
  },
};

export function buildInterruptionAnswer(
  type: InterruptionType,
  language: SupportedLanguage = "en",
): string {
  return KNOWLEDGE[language][type] ?? KNOWLEDGE.en[type];
}
