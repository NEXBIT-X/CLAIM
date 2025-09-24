import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";

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
        
        <div>
          <Image 
          alt="Background Logo" 
           height={800} 
          width={800}
          className="fixed w-screen h-screen  scale-150 -z-30 mt-80 blur-2xl " 
          src="/logo.svg" 
        
        />
          <Hero />
        </div>

        
          <Footer></Footer>
      </div>
    </main>
  );
}
