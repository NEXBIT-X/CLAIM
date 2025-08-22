
export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center">
    <div className="min-h-full w-full relative">
    {/* Midnight Mist */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)
        `,
      }}
    />
    <div className="z-50">
      <h1 className=" text-6xl font-mono font-black text-center mt-20">CLAIM</h1>
      <p className="z-50 text-2xl text-center">A Web3 Based Patent Proving Platform </p>
      
      <div className="flex items-center justify-center gap-4 mt-8">
        <img className=""  src="demo.svg" alt="Demo" />
      </div>
      </div>
      
  </div>
      
    </div>
  );
}
