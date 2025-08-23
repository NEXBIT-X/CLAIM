"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart,
  Settings,
  LifeBuoy,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "./custom-scrollbar.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Script from "next/script";
import Dashboard from "./dash/page";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      
   
      {/* Sidebar - Responsive */}
      <aside
        className={cn(
          "bg-card flex-col items-center py-4 md:py-8",
          "transition-transform duration-300 ease-in-out",
          "fixed h-full z-30 flex",
          // Mobile: full width drawer, Desktop: fixed narrow sidebar
          "w-64 md:w-[120px]",
          // Mobile: no margins/radius, Desktop: margins and rounded
          "md:m-2 md:rounded-3xl",
          "md:h-[calc(100vh-16px)]",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full md:translate-x-0": !isSidebarOpen,
          }
        )}
      >
        {/* Mobile Header in Sidebar */}
        <div className="md:hidden w-full px-4 pb-4 mb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-foreground"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-center flex-grow w-full px-4 md:px-0">
          {/* Desktop Logo */}
          <div className="hidden md:block mb-12">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" width={64} height={64} />
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col w-full md:w-auto md:items-center gap-2 md:gap-4 flex-grow">
            <Link
              href="/protected"
              className="flex items-center gap-3 md:justify-center p-3 rounded-lg hover:bg-muted transition-colors w-full md:w-auto"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Home size={24} />
              <span className="md:hidden">Dashboard</span>
            </Link>
            <Link
              href="protected/dash"
              className="flex items-center gap-3 md:justify-center p-3 rounded-lg hover:bg-muted transition-colors w-full md:w-auto"
              onClick={() => setIsSidebarOpen(false)}
            >
              <LayoutDashboard size={24} />
              <span className="md:hidden">Analytics</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 md:justify-center p-3 rounded-lg hover:bg-muted transition-colors w-full md:w-auto"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Settings size={24} />
              <span className="md:hidden">Settings</span>
            </Link>
            <div className="flex items-center gap-3 md:justify-center p-3 w-full md:w-auto">
              <ThemeSwitcher />
              <span className="md:hidden">Theme</span>
            </div>
          </nav>
          
          {/* Support Link */}
          <div className="mt-auto w-full md:w-auto">
            <Link
              href="#"
              className="flex items-center gap-3 md:justify-center p-3 rounded-lg hover:bg-muted transition-colors w-full md:w-auto"
              onClick={() => setIsSidebarOpen(false)}
            >
              <LifeBuoy size={24} />
              <span className="md:hidden">Support</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[136px] h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-card p-4 flex justify-between items-center z-10 border-b border-border shrink-0">
          <Link href="/protected">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-foreground hover:bg-muted p-2 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Content Window */}
        <div className="flex-1 overflow-hidden p-0 md:p-2">
          <div className="bg-card h-full flex flex-col overflow-hidden rounded-none md:rounded-3xl">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 md:p-8">
                {children}
              </div>
              
              {/* Footer */}
              <footer className="w-full flex items-center justify-center border-t border-border mx-auto text-center text-xs gap-8 py-8 md:py-16 mt-auto px-4">
                <p>
                  Made with ❤️ by team{" "}
                  <Link 
                    href="https://nexbitx.vercel.app" 
                    className="font-bold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NEXBIT
                  </Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}