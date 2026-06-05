import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1b3a6b] flex items-center justify-center">
              <span className="text-white text-xs font-bold">ST</span>
            </div>
            <span className="font-semibold text-[#0f172a] text-sm">
              Servin Tech Solutions
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
              Pricing
            </Link>
            <Link href="/docs/setup" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
              Docs
            </Link>
            <Link href="/sign-in" className="text-sm text-[#64748b] hover:text-[#0f172a] transition-colors">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-[#1b3a6b] text-white text-sm px-4 py-2 rounded-md hover:bg-[#162e55] transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#e2e8f0] bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1b3a6b] flex items-center justify-center">
              <span className="text-white text-xs font-bold">ST</span>
            </div>
            <span className="text-sm text-[#64748b]">Servin Tech Solutions</span>
          </div>
          <p className="text-xs text-[#94a3b8]">
            © {new Date().getFullYear()} Servin Tech Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/docs/setup" className="text-xs text-[#64748b] hover:text-[#0f172a]">Docs</Link>
            <Link href="/pricing" className="text-xs text-[#64748b] hover:text-[#0f172a]">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
