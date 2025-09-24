
import Link from "next/link";

export default function Footer() {  
    return (
        <footer className="w-11/12 h-2  bg-card rounded-t-2xl z-10 w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Made with ❤️ by team{" "}
            <Link href="https://nexbitx.vercel.app" className="font-bold hover:underline">
            NEXBIT
            </Link>
          </p>
        
        </footer>
    );

}