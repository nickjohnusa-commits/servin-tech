export type StepItem = {
  text?: string;
  code?: string;
  note?: string;
  warn?: string;
};

export type DocStep = {
  title: string;
  icon: string;
  intro?: string;
  items: StepItem[];
};

export type DocsContent = {
  label: string;
  h1: string;
  sub: string;
  prereqTitle: string;
  prereqIntro: string;
  tableHeaders: [string, string, string];
  services: [string, string, string][];
  steps: DocStep[];
};

export const docsContent: Record<"en" | "es", DocsContent> = {
  en: {
    label: "Documentation",
    h1: "Setup & Installation Guide",
    sub: "A complete step-by-step guide to get your AI receptionist live. Most contractors finish in under 15 minutes.",
    prereqTitle: "Prerequisites — Create your accounts first",
    prereqIntro: "Before configuring any environment variables, create a free account at each service below. You will collect API keys and credentials during each account's setup — keep a notepad open to store them as you go.",
    tableHeaders: ["Service", "Purpose", "URL"],
    services: [
      ["Supabase", "PostgreSQL database + file storage", "supabase.com"],
      ["Clerk", "Authentication, user accounts + team management", "clerk.com"],
      ["Twilio", "Phone numbers, inbound calls + SMS", "twilio.com"],
      ["OpenAI", "GPT-4o AI voice and text processing", "platform.openai.com"],
      ["Stripe", "Monthly subscription billing", "stripe.com"],
      ["Resend", "Transactional email notifications", "resend.com"],
      ["Inngest", "Background job queue + scheduled functions", "inngest.com"],
      ["Vercel", "Next.js web app hosting + edge deployment", "vercel.com"],
      ["Railway", "Voice WebSocket server hosting", "railway.app"],
    ],
    steps: [
      {
        title: "Step 1 — Supabase (Database)",
        icon: "🗄️",
        intro: "Supabase provides the PostgreSQL database that stores all leads, organizations, and settings. You need two separate connection strings — one for runtime queries and one for running migrations.",
        items: [
          { text: "Go to supabase.com → click 'New project'. Give it a name (e.g. servin-tech), choose the region closest to your users, and set a strong database password. Save this password — you will need it in the connection strings." },
          { text: "Wait for the project to finish provisioning (about 30 seconds), then open Settings → Database in the left sidebar." },
          { text: "Scroll to 'Connection string'. Select the URI tab. Switch mode to Transaction — copy the full string. Replace [YOUR-PASSWORD] with your database password. This is your DATABASE_URL.", code: "postgresql://postgres.xxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" },
          { text: "Switch mode to Session — copy this string as well and replace [YOUR-PASSWORD]. This is your DIRECT_URL (used for migrations only).", code: "postgresql://postgres.xxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres" },
          { text: "Go to Settings → API. Copy the 'Project URL' → this is SUPABASE_URL. Copy the 'anon public' key → this is SUPABASE_ANON_KEY.", note: "Never use the service_role key in the browser — it bypasses all row-level security." },
          { text: "After setting all environment variables and deploying, run the database migration to create all tables:", code: "pnpm db:migrate:deploy" },
        ],
      },
      {
        title: "Step 2 — Clerk (Authentication)",
        icon: "🔐",
        intro: "Clerk handles user sign-up, sign-in, and organization (business account) management. Each contractor signs up and gets their own isolated organization.",
        items: [
          { text: "Go to clerk.com → Create application. Name it (e.g. Servin Tech AI Solutions). Under 'How will your users sign in?' enable Email address and Google. Click Create application." },
          { text: "In the left sidebar go to Configure → Organizations. Toggle Organizations ON. This enables multi-tenant business accounts.", note: "Organizations is required — the entire app is built around Clerk orgs. Do not skip this." },
          { text: "Go to API Keys. Copy the Publishable key → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Copy the Secret key → CLERK_SECRET_KEY." },
          { text: "Go to Webhooks → Add Endpoint. Set the URL to your production domain:", code: "https://servintechsolutions.com/api/webhooks/clerk" },
          { text: "Under 'Subscribe to events' select: user.created, organization.created, organizationMembership.created, organizationMembership.deleted. Click Create." },
          { text: "On the webhook detail page click 'Signing Secret' → copy the value → CLERK_WEBHOOK_SECRET.", warn: "If this secret is wrong, all Clerk webhooks will be rejected with 400 errors and new accounts won't be provisioned in your database." },
        ],
      },
      {
        title: "Step 3 — Twilio (Phone Numbers & SMS)",
        icon: "📞",
        intro: "Twilio provides the phone numbers that customers call and text. Individual numbers are provisioned automatically per contractor during their onboarding — you do not need to buy numbers manually.",
        items: [
          { text: "Go to console.twilio.com → create a free account. Verify your email and phone number." },
          { text: "On the Console Dashboard, find your Account SID and Auth Token (click the eye icon to reveal). Copy them:", code: "TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nTWILIO_AUTH_TOKEN=your_auth_token_here" },
          { text: "For testing: go to Develop → Testing → Test Credentials. Copy the test Account SID and test Auth Token → TWILIO_TEST_ACCOUNT_SID and TWILIO_TEST_AUTH_TOKEN.", note: "Test credentials let you simulate calls and texts without being charged. Real credentials are used in production." },
          { text: "After deploying, go to Phone Numbers → Manage → Active Numbers → click your AI number. Set the voice webhook to:", code: "https://servintechsolutions.com/api/webhooks/twilio/voice" },
          { text: "Set the SMS webhook to:", code: "https://servintechsolutions.com/api/webhooks/twilio/sms" },
          { text: "Both webhook methods should be HTTP POST. Click Save configuration.", warn: "Twilio validates a signature on every webhook. If TWILIO_AUTH_TOKEN doesn't match, all calls and texts will be rejected with 401." },
        ],
      },
      {
        title: "Step 4 — OpenAI (AI Voice & Text)",
        icon: "🤖",
        intro: "OpenAI powers the bilingual AI receptionist. Voice calls use the GPT-4o Realtime API. Text (SMS) conversations use GPT-4o and GPT-4o-mini.",
        items: [
          { text: "Go to platform.openai.com → sign in → click your profile (top right) → API Keys → Create new secret key. Name it (e.g. servin-tech-prod) and copy immediately — it is only shown once.", code: "OPENAI_API_KEY=sk-proj-..." },
          { text: "Verify your API tier. Go to Settings → Limits. Voice calls require gpt-4o-realtime-preview, which needs Tier 1 or higher.", note: "Tier 1 is reached after $5 in API spend and a 7-day account age. If your account is brand new, add $5 in credit first." },
          { text: "Go to Settings → Billing → Add payment method to ensure your account stays active. Without billing set up, API calls will fail once the free credit expires." },
          { text: "Optionally set a monthly spending limit under Settings → Limits → Set monthly budget to prevent unexpected charges." },
        ],
      },
      {
        title: "Step 5 — Stripe (Subscription Billing)",
        icon: "💳",
        intro: "Stripe handles all subscription billing. Contractors pay monthly via Stripe Checkout. The app supports three plans: Starter ($149), Professional ($299), and Agency ($499).",
        items: [
          { text: "Go to dashboard.stripe.com → Developers → API keys. Copy the Publishable key and Secret key. Use test keys during setup and live keys for production:", code: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...\nSTRIPE_SECRET_KEY=sk_live_..." },
          { text: "Go to Product catalog → + Add product. Create three products with recurring monthly pricing:" },
          { text: "Product 1: Name = Starter, Price = $149.00 USD, Billing = Recurring, Interval = Monthly. Save and copy the Price ID (starts with price_) → STRIPE_PRICE_STARTER." },
          { text: "Product 2: Name = Professional, Price = $299.00 USD. Copy Price ID → STRIPE_PRICE_PROFESSIONAL." },
          { text: "Product 3: Name = Agency, Price = $499.00 USD. Copy Price ID → STRIPE_PRICE_AGENCY.", code: "STRIPE_PRICE_STARTER=price_...\nSTRIPE_PRICE_PROFESSIONAL=price_...\nSTRIPE_PRICE_AGENCY=price_..." },
          { text: "Go to Developers → Webhooks → + Add endpoint. Set the URL to:", code: "https://servintechsolutions.com/api/webhooks/stripe" },
          { text: "Select events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted. Click Add endpoint. Copy the Signing secret → STRIPE_WEBHOOK_SECRET.", warn: "Make sure to add the webhook in the same mode (test or live) as your API keys. A live webhook secret won't work with test keys." },
        ],
      },
      {
        title: "Step 6 — Resend (Email Notifications)",
        icon: "✉️",
        intro: "Resend sends instant email alerts to the owner and dispatcher whenever a new lead comes in, plus any other transactional emails.",
        items: [
          { text: "Go to resend.com → sign up → API Keys → + Create API Key. Name it (e.g. servin-tech), set permission to Full access, click Add. Copy the key immediately:", code: "RESEND_API_KEY=re_..." },
          { text: "Go to Domains → + Add Domain. Enter your sending domain (e.g. servintechsolutions.com). Resend will give you 3 DNS records to add in Google Domains (MX, TXT for SPF, TXT for DKIM)." },
          { text: "Add those DNS records in Google Domains → DNS → Manage custom records. Once added, click Verify in Resend. Verification can take 5–30 minutes." },
          { text: "Once verified, set your from address:", code: "RESEND_FROM_EMAIL=support@servintechsolutions.com" },
          { note: "Until your domain is verified, emails will be sent from onboarding@resend.dev — fine for testing, but not suitable for production." },
        ],
      },
      {
        title: "Step 7 — Inngest (Background Jobs)",
        icon: "⚙️",
        intro: "Inngest runs background tasks triggered by events: sending lead notification emails, running follow-up sequences, and generating monthly reports.",
        items: [
          { text: "Go to app.inngest.com → sign up → create a new app named servin-tech." },
          { text: "Go to Manage → Event Keys → + Create event key. Name it and copy the value:", code: "INNGEST_EVENT_KEY=..." },
          { text: "Go to Manage → Signing Keys → copy the signing key:", code: "INNGEST_SIGNING_KEY=signkey-prod-..." },
          { text: "After deploying to Vercel, register your serve endpoint so Inngest can discover your functions. Go to your Inngest dashboard → Apps → + Sync app and enter:", code: "https://servintechsolutions.com/api/webhooks/inngest" },
          { note: "Inngest will automatically re-sync functions on each Vercel deployment if you configure the integration in the Vercel marketplace." },
        ],
      },
      {
        title: "Step 8 — Railway (Voice Server)",
        icon: "🚀",
        intro: "The voice server is a separate Node.js WebSocket service that handles real-time audio streaming between Twilio and the OpenAI Realtime API. It must be deployed separately from the Next.js app.",
        items: [
          { text: "Install the Railway CLI globally:", code: "npm install -g @railway/cli" },
          { text: "Log in to Railway from your terminal:", code: "railway login" },
          { text: "From inside the voice-server folder, initialize and deploy:", code: "cd voice-server\nrailway init\nrailway up" },
          { text: "Set the required environment variables on Railway:", code: "OPENAI_API_KEY=sk-proj-...\nINTERNAL_API_SECRET=<run: openssl rand -hex 32>\nNEXT_APP_URL=https://servintechsolutions.com" },
          { text: "After deploy, Railway assigns a public URL. Copy it and set it on Vercel:", code: "VOICE_SERVER_URL=wss://your-service.up.railway.app" },
          { text: "Verify the voice server is healthy:", code: "curl https://your-service.up.railway.app/health\n# Expected: {\"status\":\"ok\",\"service\":\"servin-tech-voice\"}", note: "Railway automatically redeploys when you push to the connected GitHub branch." },
        ],
      },
      {
        title: "Step 9 — Vercel (Web App)",
        icon: "▲",
        intro: "Vercel hosts the Next.js web app — the customer-facing marketing site, the contractor dashboard, and all API routes.",
        items: [
          { text: "Push your code to GitHub. Go to vercel.com → Add New Project → Import your GitHub repository." },
          { text: "In the project settings → Environment Variables, add all variables from .env.example. Required variables:", code: "DATABASE_URL\nDIRECT_URL\nSUPABASE_URL\nSUPABASE_ANON_KEY\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\nCLERK_SECRET_KEY\nCLERK_WEBHOOK_SECRET\nTWILIO_ACCOUNT_SID\nTWILIO_AUTH_TOKEN\nOPENAI_API_KEY\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\nSTRIPE_SECRET_KEY\nSTRIPE_PRICE_STARTER\nSTRIPE_PRICE_PROFESSIONAL\nSTRIPE_PRICE_AGENCY\nSTRIPE_WEBHOOK_SECRET\nRESEND_API_KEY\nRESEND_FROM_EMAIL\nINNGEST_EVENT_KEY\nINNGEST_SIGNING_KEY\nINTERNAL_API_SECRET\nVOICE_SERVER_URL\nNEXT_PUBLIC_APP_URL" },
          { text: "Click Deploy. Vercel will run pnpm install → prisma generate → next build automatically." },
          { text: "Once deployed, set your custom domain: Vercel → Settings → Domains → add servintechsolutions.com.", note: "Add an A record in Google Domains pointing @ to 76.76.21.21 to connect your domain to Vercel." },
          { text: "After the domain is live, update Clerk, Twilio, Stripe, and Inngest webhooks to use https://servintechsolutions.com (not the vercel.app URL)." },
        ],
      },
      {
        title: "Step 10 — Go Live",
        icon: "✅",
        intro: "With all services connected and deployed, do a full end-to-end test before sending real customers to the platform.",
        items: [
          { text: "Sign up at servintechsolutions.com. Complete the 5-step onboarding: business name, AI greeting, phone number, notifications, test mode." },
          { text: "Go to /test in your dashboard. Send a simulated SMS conversation. Verify the lead appears with correct qualification data (job type, urgency, address)." },
          { text: "Call your provisioned AI phone number from your real phone. The AI should answer, greet you in the correct language, and walk through the qualification questions." },
          { text: "Check the lead dashboard — the call should appear as a new lead with a full transcript and summary within seconds of hanging up." },
          { text: "Verify you receive the email notification at the owner's email address." },
          { text: "In /test, toggle Test Mode OFF. Your AI receptionist is now live and accepting real calls and texts.", warn: "Make sure Test Mode is OFF before directing real customers to the number. Test leads are flagged and isolated from your real pipeline." },
        ],
      },
    ],
  },

  es: {
    label: "Documentación",
    h1: "Guía de Configuración e Instalación",
    sub: "Una guía completa paso a paso para activar tu recepcionista con IA. La mayoría de los contratistas terminan en menos de 15 minutos.",
    prereqTitle: "Requisitos previos — Crea tus cuentas primero",
    prereqIntro: "Antes de configurar cualquier variable de entorno, crea una cuenta gratuita en cada servicio a continuación. Recopilarás claves API y credenciales durante la configuración de cada cuenta — ten un bloc de notas abierto para guardarlas conforme avances.",
    tableHeaders: ["Servicio", "Propósito", "URL"],
    services: [
      ["Supabase", "Base de datos PostgreSQL + almacenamiento de archivos", "supabase.com"],
      ["Clerk", "Autenticación, cuentas de usuario + gestión de equipos", "clerk.com"],
      ["Twilio", "Números de teléfono, llamadas entrantes + SMS", "twilio.com"],
      ["OpenAI", "Voz y texto con IA GPT-4o", "platform.openai.com"],
      ["Stripe", "Facturación de suscripciones mensuales", "stripe.com"],
      ["Resend", "Notificaciones de correo electrónico transaccional", "resend.com"],
      ["Inngest", "Cola de trabajos en segundo plano + funciones programadas", "inngest.com"],
      ["Vercel", "Hospedaje de la app Next.js + despliegue en el edge", "vercel.com"],
      ["Railway", "Hospedaje del servidor de voz WebSocket", "railway.app"],
    ],
    steps: [
      {
        title: "Paso 1 — Supabase (Base de datos)",
        icon: "🗄️",
        intro: "Supabase proporciona la base de datos PostgreSQL que almacena todos los prospectos, organizaciones y configuraciones. Necesitas dos cadenas de conexión separadas: una para consultas en tiempo de ejecución y otra para ejecutar migraciones.",
        items: [
          { text: "Ve a supabase.com → clic en 'New project'. Ponle un nombre (ej. servin-tech), elige la región más cercana a tus usuarios y establece una contraseña segura. Guarda esta contraseña — la necesitarás en las cadenas de conexión." },
          { text: "Espera a que el proyecto termine de aprovisionarse (unos 30 segundos), luego abre Settings → Database en la barra lateral izquierda." },
          { text: "Desplázate hasta 'Connection string'. Selecciona la pestaña URI. Cambia el modo a Transaction — copia la cadena completa. Reemplaza [YOUR-PASSWORD] con tu contraseña de base de datos. Esta es tu DATABASE_URL.", code: "postgresql://postgres.xxxx:[CONTRASEÑA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" },
          { text: "Cambia el modo a Session — copia también esta cadena y reemplaza [YOUR-PASSWORD]. Esta es tu DIRECT_URL (solo para migraciones).", code: "postgresql://postgres.xxxx:[CONTRASEÑA]@aws-0-us-east-1.pooler.supabase.com:5432/postgres" },
          { text: "Ve a Settings → API. Copia la 'Project URL' → esta es SUPABASE_URL. Copia la clave 'anon public' → esta es SUPABASE_ANON_KEY.", note: "Nunca uses la clave service_role en el navegador — omite toda la seguridad a nivel de fila." },
          { text: "Después de configurar todas las variables de entorno y desplegar, ejecuta la migración para crear todas las tablas:", code: "pnpm db:migrate:deploy" },
        ],
      },
      {
        title: "Paso 2 — Clerk (Autenticación)",
        icon: "🔐",
        intro: "Clerk gestiona el registro, inicio de sesión y las organizaciones (cuentas de empresa). Cada contratista se registra y obtiene su propia organización aislada.",
        items: [
          { text: "Ve a clerk.com → Create application. Nómbrala (ej. Servin Tech AI Solutions). En '¿Cómo iniciarán sesión tus usuarios?' activa Email address y Google. Clic en Create application." },
          { text: "En la barra lateral izquierda ve a Configure → Organizations. Activa Organizations.", note: "Las organizaciones son obligatorias — toda la app está construida alrededor de las orgs de Clerk. No omitas este paso." },
          { text: "Ve a API Keys. Copia la Publishable key → NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Copia la Secret key → CLERK_SECRET_KEY." },
          { text: "Ve a Webhooks → Add Endpoint. Establece la URL en tu dominio de producción:", code: "https://servintechsolutions.com/api/webhooks/clerk" },
          { text: "En 'Subscribe to events' selecciona: user.created, organization.created, organizationMembership.created, organizationMembership.deleted. Clic en Create." },
          { text: "En la página de detalle del webhook, clic en 'Signing Secret' → copia el valor → CLERK_WEBHOOK_SECRET.", warn: "Si este secreto es incorrecto, todos los webhooks de Clerk serán rechazados con errores 400 y las nuevas cuentas no se crearán en tu base de datos." },
        ],
      },
      {
        title: "Paso 3 — Twilio (Números de teléfono y SMS)",
        icon: "📞",
        intro: "Twilio proporciona los números de teléfono que los clientes llaman y a los que envían mensajes. Los números individuales se aprovisionan automáticamente por contratista durante su registro.",
        items: [
          { text: "Ve a console.twilio.com → crea una cuenta gratuita. Verifica tu correo y número de teléfono." },
          { text: "En el Panel de la consola, encuentra tu Account SID y Auth Token (clic en el ícono de ojo para revelar). Cópialos:", code: "TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nTWILIO_AUTH_TOKEN=tu_token_aquí" },
          { text: "Para pruebas: ve a Develop → Testing → Test Credentials. Copia el SID de prueba y el Auth Token de prueba → TWILIO_TEST_ACCOUNT_SID y TWILIO_TEST_AUTH_TOKEN.", note: "Las credenciales de prueba te permiten simular llamadas y mensajes sin cargos. Las credenciales reales se usan en producción." },
          { text: "Después de desplegar, ve a Phone Numbers → Manage → Active Numbers → clic en tu número de IA. Establece el webhook de voz en:", code: "https://servintechsolutions.com/api/webhooks/twilio/voice" },
          { text: "Establece el webhook de SMS en:", code: "https://servintechsolutions.com/api/webhooks/twilio/sms" },
          { text: "Ambos métodos deben ser HTTP POST. Clic en Save configuration.", warn: "Twilio valida una firma en cada webhook. Si TWILIO_AUTH_TOKEN no coincide, todas las llamadas y mensajes serán rechazados con 401." },
        ],
      },
      {
        title: "Paso 4 — OpenAI (Voz e IA de Texto)",
        icon: "🤖",
        intro: "OpenAI impulsa el recepcionista bilingüe. Las llamadas de voz usan la API en Tiempo Real de GPT-4o. Las conversaciones por SMS usan GPT-4o y GPT-4o-mini.",
        items: [
          { text: "Ve a platform.openai.com → inicia sesión → clic en tu perfil (arriba a la derecha) → API Keys → Create new secret key. Nómbrala y cópiala inmediatamente — solo se muestra una vez.", code: "OPENAI_API_KEY=sk-proj-..." },
          { text: "Verifica tu nivel de API. Ve a Settings → Limits. Las llamadas de voz requieren gpt-4o-realtime-preview, que necesita Nivel 1 o superior.", note: "El Nivel 1 se alcanza después de $5 en uso de API y 7 días de antigüedad de cuenta. Si tu cuenta es nueva, agrega $5 en crédito primero." },
          { text: "Ve a Settings → Billing → Add payment method para asegurarte de que tu cuenta siga activa." },
          { text: "Opcionalmente establece un límite de gasto mensual en Settings → Limits → Set monthly budget para evitar cargos inesperados." },
        ],
      },
      {
        title: "Paso 5 — Stripe (Facturación de Suscripciones)",
        icon: "💳",
        intro: "Stripe gestiona toda la facturación de suscripciones. Los contratistas pagan mensualmente mediante Stripe Checkout. La app soporta tres planes: Inicial ($149), Profesional ($299) y Agencia ($499).",
        items: [
          { text: "Ve a dashboard.stripe.com → Developers → API keys. Copia la Publishable key y la Secret key. Usa claves de prueba durante la configuración y claves en vivo para producción:", code: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...\nSTRIPE_SECRET_KEY=sk_live_..." },
          { text: "Ve a Product catalog → + Add product. Crea tres productos con precio recurrente mensual:" },
          { text: "Producto 1: Nombre = Inicial, Precio = $149.00 USD, Facturación = Recurrente, Intervalo = Mensual. Guarda y copia el Price ID (comienza con price_) → STRIPE_PRICE_STARTER." },
          { text: "Producto 2: Nombre = Profesional, Precio = $299.00 USD. Copia el Price ID → STRIPE_PRICE_PROFESSIONAL." },
          { text: "Producto 3: Nombre = Agencia, Precio = $499.00 USD. Copia el Price ID → STRIPE_PRICE_AGENCY.", code: "STRIPE_PRICE_STARTER=price_...\nSTRIPE_PRICE_PROFESSIONAL=price_...\nSTRIPE_PRICE_AGENCY=price_..." },
          { text: "Ve a Developers → Webhooks → + Add endpoint. Establece la URL en:", code: "https://servintechsolutions.com/api/webhooks/stripe" },
          { text: "Selecciona los eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted. Clic en Add endpoint. Copia el Signing secret → STRIPE_WEBHOOK_SECRET.", warn: "Asegúrate de agregar el webhook en el mismo modo (prueba o en vivo) que tus claves API." },
        ],
      },
      {
        title: "Paso 6 — Resend (Correo Electrónico)",
        icon: "✉️",
        intro: "Resend envía alertas instantáneas de correo electrónico al propietario y al despachador cada vez que llega un nuevo prospecto.",
        items: [
          { text: "Ve a resend.com → regístrate → API Keys → + Create API Key. Nómbrala, establece permisos Full access, clic en Add. Copia la clave inmediatamente:", code: "RESEND_API_KEY=re_..." },
          { text: "Ve a Domains → + Add Domain. Ingresa tu dominio de envío (ej. servintechsolutions.com). Resend te dará 3 registros DNS para agregar en Google Domains (MX, TXT para SPF, TXT para DKIM)." },
          { text: "Agrega esos registros DNS en Google Domains → DNS → Manage custom records. Una vez agregados, clic en Verify en Resend. La verificación puede tardar 5–30 minutos." },
          { text: "Una vez verificado, establece tu dirección de envío:", code: "RESEND_FROM_EMAIL=support@servintechsolutions.com" },
          { note: "Hasta que tu dominio esté verificado, los correos se enviarán desde onboarding@resend.dev — aceptable para pruebas, pero no apto para producción." },
        ],
      },
      {
        title: "Paso 7 — Inngest (Trabajos en Segundo Plano)",
        icon: "⚙️",
        intro: "Inngest ejecuta tareas en segundo plano: envío de correos de notificación de prospectos, secuencias de seguimiento y reportes mensuales.",
        items: [
          { text: "Ve a app.inngest.com → regístrate → crea una nueva app llamada servin-tech." },
          { text: "Ve a Manage → Event Keys → + Create event key. Nómbrala y copia el valor:", code: "INNGEST_EVENT_KEY=..." },
          { text: "Ve a Manage → Signing Keys → copia la clave de firma:", code: "INNGEST_SIGNING_KEY=signkey-prod-..." },
          { text: "Después de desplegar en Vercel, registra tu endpoint para que Inngest descubra tus funciones:", code: "https://servintechsolutions.com/api/webhooks/inngest" },
          { note: "Inngest re-sincroniza las funciones automáticamente en cada despliegue de Vercel si configuras la integración en el marketplace de Vercel." },
        ],
      },
      {
        title: "Paso 8 — Railway (Servidor de Voz)",
        icon: "🚀",
        intro: "El servidor de voz es un servicio WebSocket Node.js separado que maneja la transmisión de audio en tiempo real entre Twilio y la API en Tiempo Real de OpenAI.",
        items: [
          { text: "Instala el CLI de Railway globalmente:", code: "npm install -g @railway/cli" },
          { text: "Inicia sesión en Railway desde tu terminal:", code: "railway login" },
          { text: "Desde la carpeta voice-server, inicializa y despliega:", code: "cd voice-server\nrailway init\nrailway up" },
          { text: "Configura las variables de entorno requeridas en Railway:", code: "OPENAI_API_KEY=sk-proj-...\nINTERNAL_API_SECRET=<ejecuta: openssl rand -hex 32>\nNEXT_APP_URL=https://servintechsolutions.com" },
          { text: "Después del despliegue, Railway asigna una URL pública. Cópiala y configúrala en Vercel:", code: "VOICE_SERVER_URL=wss://tu-servicio.up.railway.app" },
          { text: "Verifica que el servidor de voz está funcionando:", code: "curl https://tu-servicio.up.railway.app/health\n# Esperado: {\"status\":\"ok\",\"service\":\"servin-tech-voice\"}", note: "Railway vuelve a desplegar automáticamente cuando haces push a la rama de GitHub conectada." },
        ],
      },
      {
        title: "Paso 9 — Vercel (App Web)",
        icon: "▲",
        intro: "Vercel hospeda la app web Next.js — el sitio de marketing, el panel del contratista y todas las rutas de API.",
        items: [
          { text: "Sube tu código a GitHub. Ve a vercel.com → Add New Project → Import your GitHub repository." },
          { text: "En la configuración del proyecto → Environment Variables, agrega todas las variables de .env.example:", code: "DATABASE_URL, DIRECT_URL, SUPABASE_URL, SUPABASE_ANON_KEY,\nNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET,\nTWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, OPENAI_API_KEY,\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY,\nSTRIPE_PRICE_STARTER, STRIPE_PRICE_PROFESSIONAL, STRIPE_PRICE_AGENCY,\nSTRIPE_WEBHOOK_SECRET, RESEND_API_KEY, RESEND_FROM_EMAIL,\nINNGEST_EVENT_KEY, INNGEST_SIGNING_KEY,\nINTERNAL_API_SECRET, VOICE_SERVER_URL, NEXT_PUBLIC_APP_URL" },
          { text: "Clic en Deploy. Vercel ejecutará automáticamente pnpm install → prisma generate → next build." },
          { text: "Una vez desplegado, agrega tu dominio personalizado: Vercel → Settings → Domains → agrega servintechsolutions.com.", note: "Agrega un registro A en Google Domains apuntando @ a 76.76.21.21 para conectar tu dominio a Vercel." },
          { text: "Después de que el dominio esté activo, actualiza los webhooks de Clerk, Twilio, Stripe e Inngest para usar https://servintechsolutions.com." },
        ],
      },
      {
        title: "Paso 10 — Activar en Producción",
        icon: "✅",
        intro: "Con todos los servicios conectados y desplegados, realiza una prueba completa de extremo a extremo antes de dirigir clientes reales a la plataforma.",
        items: [
          { text: "Regístrate en servintechsolutions.com. Completa el alta de 5 pasos: nombre del negocio, saludo de IA, número de teléfono, notificaciones, modo de prueba." },
          { text: "Ve a /test en tu panel. Envía una conversación SMS simulada. Verifica que el prospecto aparece con los datos correctos (tipo de trabajo, urgencia, dirección)." },
          { text: "Llama a tu número de teléfono con IA desde tu teléfono real. La IA debe contestar, saludarte en el idioma correcto y hacer las preguntas de calificación." },
          { text: "Revisa el panel de prospectos — la llamada debe aparecer como nuevo prospecto con transcripción completa y resumen en segundos de colgar." },
          { text: "Verifica que recibes la notificación por correo electrónico en la dirección del propietario." },
          { text: "En /test, desactiva el Modo de Prueba. Tu recepcionista con IA ya está en vivo y acepta llamadas y mensajes reales.", warn: "Asegúrate de que el Modo de Prueba esté DESACTIVADO antes de dirigir clientes reales al número. Los prospectos de prueba quedan marcados y aislados de tu pipeline real." },
        ],
      },
    ],
  },
};
