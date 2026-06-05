import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#1b3a6b] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">ST</span>
          </div>
          <h1 className="text-xl font-semibold text-[#0f172a]">Create your account</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Set up your AI reception in minutes — free to start
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              card: "shadow-sm border border-[#e2e8f0] rounded-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border border-[#e2e8f0] text-[#0f172a] hover:bg-[#f8fafc]",
              formButtonPrimary:
                "bg-[#1b3a6b] hover:bg-[#162e55] text-white",
              footerActionLink: "text-[#2563eb] hover:text-[#1d4ed8]",
            },
          }}
        />
      </div>
    </div>
  );
}
