import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-8/12 flex justify-center bg-white/80 dark:bg-secondary/80 h-20 rounded-2xl mt-6 shadow-lg border border-border backdrop-blur-md">
          <div className="w-full max-w-6xl flex items-center justify-between px-6 py-2">
            {/* Left: Logo and Product Name */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                <span className="text-2xl font-extrabold tracking-tight text-primary">Claim</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>
        
        <div className="p-4">
          <Hero />
          
        </div>

        <footer className="w-11/12 h-2  bg-card rounded-t-2xl z-10 w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Made with ❤️ by team{" "}
            <Link href="https://nexbitx.vercel.app" className="font-bold hover:underline">
            NEXBIT
            </Link>
          </p>
          
        </footer>
      </div>
    </main>
  );
}
