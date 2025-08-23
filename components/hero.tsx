import Link from "next/link";
import Image from "next/image"
import { use } from "react";
export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center">
    <div className="min-h-full w-full relative">
    {/* Midnight Mist */}
    <div
      className="absolute inset-0 z-0 blend-multiply bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-30"></div>
         <Image alt="Blur" className="fixed filter blur-3xl w-full -z-0 bg-blend-screen"  src="/logo.svg" height="300" width="300"></Image>
</div>
    <div className="z-50 justify-center items-center flex flex-col">
      <h1 className=" text-6xl font-mono font-black text-center mt-20">CLAIM</h1>
      <p className="z-50 text-2xl text-center">A Web3 Based Patent Proving Platform </p>
      <Link href="/protected"  className="p-3 bg-transparent backdrop-blur-2xl border-border rounded-sm hover:bg-black transition-colors ease-linear ">GET STARTED</Link>
      <div className=" mt-8">
        <img className="w-full ml-0" width="100%"  src="demo.svg" alt="Demo" />
      </div>
      </div>
      
  </div>
      
  );
}
