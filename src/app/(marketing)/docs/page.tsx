import Link from "next/link";

export const metadata = {
  title: "Documentation — Servin Tech Solutions",
};

const DOCS = [
  {
    href: "/docs/setup",
    icon: "⚙️",
    title: "Setup & Installation",
    desc: "Step-by-step guide to get your AI receptionist live, including all third-party services.",
  },
  {
    href: "/docs/owner-guide",
    icon: "👤",
    title: "Owner Guide",
    desc: "How to manage leads, configure AI settings, set up notifications, and run monthly reports.",
  },
  {
    href: "/docs/dispatcher-guide",
    icon: "📋",
    title: "Dispatcher Guide",
    desc: "How to work the pipeline, respond to leads, and use the dashboard as a dispatcher.",
  },
];

export default function DocsPage() {
  return (
    <div className="py-12 px-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">Documentation</h1>
          <p className="text-[#64748b]">Everything you need to get set up and get the most out of Servin Tech Solutions.</p>
        </div>
        <div className="space-y-4">
          {DOCS.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="flex items-start gap-5 bg-white border border-[#e2e8f0] rounded-xl p-6 hover:border-[#1b3a6b] hover:shadow-sm transition-all"
            >
              <span className="text-3xl shrink-0">{doc.icon}</span>
              <div>
                <h2 className="text-base font-semibold text-[#0f172a] mb-1">{doc.title}</h2>
                <p className="text-sm text-[#64748b]">{doc.desc}</p>
              </div>
              <span className="ml-auto text-[#94a3b8] text-lg shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
