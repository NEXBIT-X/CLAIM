"use client";
import Link from "next/link";
import Image from "next/image"
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="hero-skeleton">Loading...</div>;
  }
  
  const currentTheme = resolvedTheme || theme;
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="min-h-full w-full relative">
        <div className="absolute inset-0 z-0 blend-multiply bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-30"></div>
        <Image alt="Blur" className="fixed filter blur-3xl w-full -z-0 bg-blend-screen" src="/logo.svg" height="300" width="300"></Image>
      </div>
      <div className="z-50 justify-center items-center flex flex-col">
        <h1 className=" text-6xl font-mono font-black text-center mt-20">CLAIM</h1>
        <p className="z-50 text-2xl text-center">A Web3 Based Patent Proving Platform </p>
        <Link href="/protected" className="p-3 bg-transparent backdrop-blur-2xl border-border rounded-sm hover:bg-black transition-colors ease-linear ">GET STARTED</Link>
        <div className=" mt-8">
          <video 
            key={currentTheme} // This forces the video to reload when theme changes
            className="rounded-2xl" 
            width="" 
            height="" 
            autoPlay 
            loop 
            muted
          >
            <source src={currentTheme === 'dark' ? 'demo_dark.mp4' : 'demo_light.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}