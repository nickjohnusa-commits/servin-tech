export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1b3a6b] flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">ST</span>
          </div>
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide">
            Servin Tech Solutions — Setup
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
