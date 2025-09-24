"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Shield, Database, Globe, Zap, Lock, FileCheck, Wallet, Upload, Coins, Key, Eye, Server, ChevronDown } from "lucide-react";


// GSAP Animation Hook


const HowItWorks = () => {
 
  const steps = [
    {
      step: 1,
      icon: Wallet,
      title: "Connect Wallet",
      description: "Connect your Web3 wallet (MetaMask) to authenticate with the CLAIM platform.",
      detail: "Secure authentication using your Ethereum wallet address"
    },
    {
      step: 2,
      icon: Upload,
      title: "Submit Patent",
      description: "Upload your patent PDF and fill in the required metadata and information.",
      detail: "Include patent number, inventors, filing date, and description"
    },
    {
      step: 3,
      icon: Shield,
      title: "Government Verification",
      description: "Our system cross-references your patent with official government databases.",
      detail: "Automated verification with USPTO, IPO India, WIPO, and other authorities"
    },
    {
      step: 4,
      icon: Coins,
      title: "Mint NFT",
      description: "Upon verification, your patent is minted as an NFT on the Ethereum blockchain.",
      detail: "Creates immutable, tamper-proof ownership record"
    },
    {
      step: 5,
      icon: Database,
      title: "IPFS Storage",
      description: "Patent documents are permanently stored on IPFS via Pinata for global access.",
      detail: "Decentralized storage ensures permanent availability"
    },
    {
      step: 6,
      icon: Globe,
      title: "Global Discovery",
      description: "Your verified patent becomes discoverable in our public innovation network.",
      detail: "Showcase your IP for collaboration and licensing opportunities"
    }
  ];

  return (
    <>
    <section  className="py-16 md:py-20 lg:py-24  overflow-hidden m-72">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
          
        </div>

        {/* Steps */}
        {/* Header */}
        <div className="section-header mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            How CLAIM Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Secure your intellectual property in 6 simple steps with blockchain technology and government verification.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 lg:space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
            
              className={`flex flex-col items-center lg:flex-row ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } gap-8 lg:gap-12`}
            >
              {/* Step Content */}
              <div className="flex-1 w-full">
                <div className="step-content rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 p-9 slide">
                  <div className="mb-6 flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md">
                      {step.step}
                    </div>
                    <div className="step-icon flex h-12 w-12 items-center justify-center rounded-lg border border-blue-100 dark:border-blue-800/50 transition-colors duration-300">
                      <step.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {step.detail}
                  </p>
                </div>
              </div>

              {/* Visual Element */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <div className="step-visual aspect-square w-full max-w-md mx-auto p-8 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                    <step.icon className="h-24 w-24 text-blue-600 dark:text-blue-400 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-section mt-16 text-center">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Ready to Secure Your Patents?
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Join the revolution in intellectual property protection with blockchain technology.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/protected"
                className="cta-primary inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Now
              </Link>
              <Link
                href="#features"
                className="cta-secondary inline-block rounded-lg border border-gray-300 dark:border-gray-600 px-8 py-3 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
    </section>
    </>
  );
};

const SecurityFeatures = () => {
  
  const features = [
    {
      icon: Shield,
      title: "Government Verification",
      description: "Every patent is cross-verified with official government databases before blockchain storage.",
      benefits: ["USPTO Integration", "IPO India Verification", "WIPO Database", "Real-time Validation"]
    },
    {
      icon: Lock,
      title: "Blockchain Security",
      description: "Immutable records on Ethereum blockchain ensure your patents cannot be tampered with or deleted.",
      benefits: ["Immutable Records", "Cryptographic Proof", "Decentralized Network", "Transparent History"]
    },
    {
      icon: Key,
      title: "Cryptographic Hashing",
      description: "Each document is secured with SHA-256 hashing, creating unique digital fingerprints.",
      benefits: ["SHA-256 Encryption", "Digital Fingerprints", "Tamper Detection", "Secure Validation"]
    },
    {
      icon: Eye,
      title: "Public Verification",
      description: "Transparent verification process allows anyone to validate patent authenticity and ownership.",
      benefits: ["Public Audit", "Trust Verification", "Transparency", "Open Standards"]
    },
    {
      icon: Server,
      title: "IPFS Storage",
      description: "Permanent, distributed storage on IPFS ensures your patents are always accessible globally.",
      benefits: ["Permanent Storage", "Global Access", "Redundancy", "Censorship Resistant"]
    },
    {
      icon: Zap,
      title: "Smart Contracts",
      description: "Automated processes through smart contracts eliminate human error and ensure consistency.",
      benefits: ["Automated Processes", "Error Reduction", "Consistent Execution", "Gas Optimization"]
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="security-header mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl">
            Enterprise-Grade Security
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            CLAIM implements multiple layers of security to protect your intellectual property with military-grade encryption and blockchain technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
             
              className="group rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              {/* Icon */}
              <div className="feature-icon mb-6 flex h-16 w-16 items-center justify-center rounded-lg border border-blue-100 dark:border-blue-800/50 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/50 transition-all duration-300">
                <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Content */}
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlatformStats = () => {
  

  const stats = [
    {
      number: 1000,
      label: "patents to be proved",
      suffix: "+",
      description: "Government-verified patents planned to be stored on blockchain"
    },
    {
      number: 100,
      label: "Verification Rate",
      suffix: "%",
      description: "Success rate for government verification"
    },
    {
      number: 5,
      label: "Countries Supported",
      suffix: "",
      description: "Patent offices integrated worldwide"
    },
    {
      number: 24,
      label: "Response Time",
      suffix: "h",
      description: "Average customer support waiting time"
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24" >
      <div className="container mx-auto px-4">
        <div className="stats-header text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl">
            Trusted by Innovators Worldwide
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Join thousands of inventors and organizations who trust CLAIM to secure their intellectual property on the blockchain.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <span 
                className="stat-number text-4xl font-bold text-blue-600 dark:text-blue-400 md:text-5xl"
              >
            {stat.number}
              </span>
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 md:text-5xl">
                {stat.suffix}
              </span>
              <h3 className="mb-2 mt-4 text-xl font-semibold text-black dark:text-gray-100">
                {stat.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators text-center">
          <p className="mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            INTEGRATED WITH GOVERNMENT AUTHORITIES
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["USPTO", "IPO India", "WIPO", "EPO", "JPO"].map((authority, index) => (
              <div 
                key={authority}
                className="authority-badge text-2xl font-bold text-black dark:text-white opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
              >
                {authority}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {


  const featuresData = [
    {
      icon: Shield,
      title: "Government Verified",
      description: "Only patents verified by official government authorities (USPTO, IPO India, WIPO) can be submitted to our platform.",
    },
    {
      icon: Lock,
      title: "Blockchain Secured",
      description: "Immutable records on Ethereum blockchain ensure your patents are tamper-proof and permanently secured.",
    },
    {
      icon: Database,
      title: "IPFS Storage",
      description: "Documents stored on IPFS via Pinata ensure permanent, decentralized storage with global accessibility.",
    },
    {
      icon: FileCheck,
      title: "NFT Ownership",
      description: "Your verified patents are minted as NFTs, providing cryptographic proof of ownership and authenticity.",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access a worldwide network of verified patents for collaboration, licensing, and innovation opportunities.",
    },
    {
      icon: Zap,
      title: "Smart Contracts",
      description: "Automated processes through smart contracts ensure efficient, error-free patent management and verification.",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-25 xl:py-30" >
      <div className="mx-auto max-w-7xl px-4 md:px-8 xl:px-0">
        <div className="features-header text-center mb-12">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            CLAIM FEATURES
          </p>
          <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl mb-4">
            Why Choose CLAIM?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Experience the future of intellectual property protection with blockchain technology, government verification, and permanent decentralized storage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:gap-12.5">
          {featuresData.map((feature, key) => (
            <div 
              key={key} 

              className="rounded-xl bg-white dark:bg-black p-8 shadow-lg transition-all duration-500 border border-gray-200 dark:border-gray-700 group cursor-pointer"
            >
              <div className="feature-icon-container relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-5 mt-7.5 text-xl font-semibold text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
            ))}

        </div>  
        

      </div>
      
    </section>
  );
}

   

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

     

  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }
  
  const currentTheme = resolvedTheme || theme;
  
  // Split title into characters for animation
  const titleText = "CLAIM";
  const titleChars = titleText.split('').map((char, index) => (
    <span key={index} className="char inline-block">{char}</span>
  ));
  return (
    <div className="relative flex flex-col">
      {/* Hero Section */}
      <div ref={heroRef} className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div ref={backgroundRef} className="absolute inset-0 ">
          <div className="absolute inset-0"></div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Main Content */}
        <div className="z-10 justify-center items-center flex flex-col text-center px-4 max-w-6xl">
          <h1 ref={titleRef} className="text-6xl md:text-9xl font-bold mb-4 text-white">
            {titleChars}
          </h1>
          
          <p  className="text-xl md:text-2xl mb-8 text-gray-200 font-light max-w-2xl leading-relaxed animate-fade-in" >
            A Web3 Based Patent Proving Platform
          </p>
          
          <div ref={ctaRef}>
            <Link 
              href="/protected" 
              className="inline-block px-12 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              GET STARTED
            </Link>
          </div>
          
          <div ref={videoRef} className="mt-16 max-w-5xl w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <video 
                key={currentTheme}
                className="w-full h-auto" 
                autoPlay 
                loop 
                muted
                playsInline
              >
                <source src={currentTheme === 'dark' ? '/demo_dark.mp4' : '/demo_light.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Video overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

    
      </div>
      
      {/* Content Sections */}
      <div className="p-4 bg-white dark:bg-black  w-screen rounded-3xl">
  
  
    

<div className="min-h-screen w-full relative">
  {/* Azure Depths */}
  <div
    className="inset absolute z-0"
    style={{
      background: "radial-gradient(125% 125% at 30% 10%, #000000 40%, #010133 100%)",
    }}
  />
  <PlatformStats />
        <Features />
        <HowItWorks />
        <SecurityFeatures />

</div>
      
      </div>
    </div>
  );
}


export { Hero };

