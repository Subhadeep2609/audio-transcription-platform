import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#120000] via-[#1a0505] to-black text-white px-6">
      <div className="w-full max-w-md bg-[#140404] border border-red-500/20 rounded-2xl p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
