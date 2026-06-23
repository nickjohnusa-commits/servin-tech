export type Lang = "en" | "es";

export const t = {
  en: {
    nav: {
      pricing: "Pricing",
      docs: "Docs",
      signIn: "Sign in",
      getStarted: "Get started",
    },
    footer: {
      rights: "All rights reserved.",
    },
    hero: {
      badge: "Bilingual AI — English & Spanish",
      h1a: "Your AI receptionist for",
      h1b: "home service contractors",
      sub: "Never miss a lead again. Your AI answers calls and texts 24/7 in English and Spanish, qualifies every prospect, and notifies you instantly — so you focus on the job.",
      cta: "Start free — no credit card",
      seePricing: "See pricing →",
    },
    trades: {
      label: "Built for",
    },
    howItWorks: {
      h2: "How it works",
      sub: "Set up in 5 minutes. Live the same day.",
      steps: [
        { title: "Get your AI number", desc: "We provision a local phone number. Customers call or text it — or forward your existing number to it." },
        { title: "AI qualifies every lead", desc: "Your AI receptionist answers, collects 6 key details, and asks for photos — in English or Spanish." },
        { title: "You close more jobs", desc: "You get an instant alert with the full lead. Estimates that don't convert get followed up automatically." },
      ],
    },
    features: {
      h2: "Everything you need",
      items: [
        { icon: "📞", title: "Never miss a lead", desc: "Your AI answers every call and text instantly — 24/7, including after hours and weekends." },
        { icon: "🇲🇽", title: "Fully bilingual", desc: "Auto-detects Spanish or English and responds fluently in the customer's language." },
        { icon: "📋", title: "Qualify in seconds", desc: "Collects job type, urgency, address, photos, budget, and preferred appointment — before you pick up the phone." },
        { icon: "🔔", title: "Instant alerts", desc: "Get a text and email the moment a new lead comes in — with all the details already filled in." },
        { icon: "📨", title: "Automatic follow-ups", desc: "Estimates not converting? The AI follows up on Day 1, Day 3, and Day 7 automatically." },
        { icon: "⟶", title: "Simple CRM pipeline", desc: "Drag leads from New → Contacted → Estimate Sent → Won. No complicated software." },
      ],
    },
    cta: {
      h2: "Ready to stop missing leads?",
      sub: "Free setup. Month-to-month. Cancel anytime.",
      btn: "Get started free →",
    },
  },

  es: {
    nav: {
      pricing: "Precios",
      docs: "Guía",
      signIn: "Iniciar sesión",
      getStarted: "Comenzar",
    },
    footer: {
      rights: "Todos los derechos reservados.",
    },
    hero: {
      badge: "IA Bilingüe — Inglés y Español",
      h1a: "Tu recepcionista con IA para",
      h1b: "contratistas de servicios del hogar",
      sub: "Nunca pierdas un cliente. Tu IA responde llamadas y mensajes las 24 horas en inglés y español, califica cada prospecto y te notifica al instante — para que te concentres en el trabajo.",
      cta: "Empieza gratis — sin tarjeta",
      seePricing: "Ver precios →",
    },
    trades: {
      label: "Diseñado para",
    },
    howItWorks: {
      h2: "Cómo funciona",
      sub: "Configúralo en 5 minutos. En vivo el mismo día.",
      steps: [
        { title: "Obtén tu número con IA", desc: "Te asignamos un número local. Los clientes llaman o escriben — o redirige tu número actual." },
        { title: "La IA califica cada prospecto", desc: "Tu recepcionista responde, recopila 6 datos clave y solicita fotos — en inglés o español." },
        { title: "Tú cierras más trabajos", desc: "Recibes una alerta inmediata con el prospecto completo. Las cotizaciones pendientes reciben seguimiento automático." },
      ],
    },
    features: {
      h2: "Todo lo que necesitas",
      items: [
        { icon: "📞", title: "Nunca pierdas un cliente", desc: "Tu IA responde cada llamada y mensaje al instante — 24/7, incluidos fines de semana y fuera de horario." },
        { icon: "🇲🇽", title: "Completamente bilingüe", desc: "Detecta automáticamente español o inglés y responde con fluidez en el idioma del cliente." },
        { icon: "📋", title: "Califica en segundos", desc: "Recopila tipo de trabajo, urgencia, dirección, fotos, presupuesto y cita preferida — antes de que contestes." },
        { icon: "🔔", title: "Alertas instantáneas", desc: "Recibe un mensaje y correo en el momento en que llega un nuevo prospecto — con todos los datos ya registrados." },
        { icon: "📨", title: "Seguimiento automático", desc: "¿Las cotizaciones no convierten? La IA hace seguimiento el Día 1, Día 3 y Día 7 automáticamente." },
        { icon: "⟶", title: "CRM sencillo", desc: "Mueve prospectos de Nuevo → Contactado → Cotización enviada → Ganado. Sin software complicado." },
      ],
    },
    cta: {
      h2: "¿Listo para dejar de perder clientes?",
      sub: "Configuración gratuita. Mes a mes. Cancela cuando quieras.",
      btn: "Empieza gratis →",
    },
  },
} as const;
