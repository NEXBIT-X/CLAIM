"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Wallet, Upload, Database, Shield, Globe, Settings } from "lucide-react";
import PinataTest from "@/components/PinataTest";

// Standalone wallet hook for when AuthProvider is not available
const useWalletStandalone = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [walletType, setWalletType] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const connectMetaMask = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        setWalletType('MetaMask');
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect MetaMask:', error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  const connectInternetIdentity = async () => {
    try {
      setIsConnecting(true);
      // Simulate connection for now - in production, integrate with Internet Identity
      setTimeout(() => {
        setAccount('Internet Identity Connected');
        setWalletType('Internet Identity');
        setIsConnected(true);
        setIsConnecting(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to connect Internet Identity:', error);
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount("");
    setWalletType("");
  };

  return {
    isConnected,
    account,
    walletType,
    isConnecting,
    connectMetaMask,
    connectInternetIdentity,
    disconnect
  };
};

const DashboardStandalone = () => {
  const [mounted, setMounted] = useState(false);
  
  // Try to use AuthProvider if available, fallback to standalone hook
  let authData;
  try {
    // This will throw if AuthProvider is not available
    const { useAuth } = require('@/app/context/AuthProvider');
    const auth = useAuth();
    authData = {
      isWalletConnected: auth.isAuthenticated,
      account: auth.metamaskAccount || auth.internetIdentityPrincipal || '',
      walletType: auth.authMethod || '',
      isConnecting: false,
      connectMetaMask: () => auth.login('metamask'),
      connectInternetIdentity: () => auth.login('internet-identity'),
      disconnect: auth.logout
    };
  } catch {
    // Fallback to standalone wallet hook
    const standalone = useWalletStandalone();
    authData = {
      isWalletConnected: standalone.isConnected,
      account: standalone.account,
      walletType: standalone.walletType,
      isConnecting: standalone.isConnecting,
      connectMetaMask: standalone.connectMetaMask,
      connectInternetIdentity: standalone.connectInternetIdentity,
      disconnect: standalone.disconnect
    };
  }

  const {
    isWalletConnected,
    account,
    walletType,
    isConnecting,
    connectMetaMask,
    connectInternetIdentity,
    disconnect
  } = authData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const [userStats] = useState({
    submittedPatents: 5,
    verifiedPatents: 3,
    pendingReview: 2,
    totalViews: 147
  });

  const quickActions = [
    {
      title: "Submit New Patent",
      description: "Upload and submit your patent for government verification",
      icon: Upload,
      href: "/protected/dash/protect",
      color: "bg-blue-600"
    },
    {
      title: "Browse Patents",
      description: "Explore verified patents in our decentralized database",
      icon: Globe,
      href: "/browse-patents",
      color: "bg-green-600"
    },
    {
      title: "Wallet Settings",
      description: "Manage your wallet connection and preferences",
      icon: Settings,
      href: "/protected/wallet",
      color: "bg-purple-600"
    },
    {
      title: "Security Center",
      description: "View security features and verification status",
      icon: Shield,
      href: "/security",
      color: "bg-orange-600"
    }
  ];

  const getDisplayAddress = () => {
    if (walletType === 'MetaMask' && account) {
      return `${account.slice(0, 6)}...${account.slice(-4)}`;
    } else if (walletType === 'Internet Identity') {
      return 'II Connected';
    }
    return '';
  };

  if (!mounted) {
    return null;
  }

  return (
    <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
      <div className="container mx-auto">
        {/* Header with Wallet Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl">
                Dashboard
              </h1>
              {isWalletConnected && (
                <p className="text-gray-600 dark:text-gray-400">
                  Connected via {walletType}: 
                  <span className="font-mono text-blue-600 dark:text-blue-400 ml-2">
                    {getDisplayAddress()}
                  </span>
                </p>
              )}
            </div>
            
            {/* Wallet Connection Section */}
            <div className="flex gap-3">
              {!isWalletConnected ? (
                <>
                  <button
                    onClick={connectMetaMask}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    {isConnecting ? 'Connecting...' : 'MetaMask'}
                  </button>
                  <button
                    onClick={connectInternetIdentity}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {isConnecting ? 'Connecting...' : 'Internet Identity'}
                  </button>
                </>
              ) : (
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-12">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{userStats.submittedPatents}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted Patents</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total submissions</div>
              </div>
              <div className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-2 text-2xl font-bold text-green-600">{userStats.verifiedPatents}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified Patents</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Government approved</div>
              </div>
              <div className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-2 text-2xl font-bold text-yellow-600">{userStats.pendingReview}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending Review</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Under verification</div>
              </div>
              <div className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">{userStats.totalViews}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Views</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Patent visibility</div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className={`mb-4 w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-black rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">AI Garden System</div>
                    <div className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">Protected</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Automated gardening system using machine learning to optimize plant growth conditions.</p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Jan 10, 2025 • 0x7f9a...3b2c</div>
                </div>
                <div className="bg-white dark:bg-black rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">Voting Platform</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">Verified</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Transparent and secure digital voting system using blockchain technology.</p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Jan 8, 2025 • 0x8e5c...7d1a</div>
                </div>
                <div className="bg-white dark:bg-black rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">Smart Contract</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full">Pending</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Advanced smart contract for automated IP licensing and royalty distribution.</p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Jan 6, 2025 • 0x2a8f...9c5e</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-8 space-y-6"
            >
              {/* Pinata Integration */}
              <div className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Pinata IPFS Storage
                </h3>
                <PinataTest 
                  isWalletConnected={isWalletConnected} 
                  walletType={walletType}
                  walletAccount={account}
                />
              </div>

              {/* Help & Support */}
              <div className="rounded-lg bg-white dark:bg-black p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  💬 Need Help?
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/docs" 
                    className="block rounded-lg bg-gray-50 dark:bg-gray-700 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    📚 Documentation
                  </Link>
                  <Link 
                    href="/support" 
                    className="block rounded-lg bg-gray-50 dark:bg-gray-700 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    🛠️ Support Center
                  </Link>
                  <Link 
                    href="/feedback" 
                    className="block rounded-lg bg-gray-50 dark:bg-gray-700 p-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    📝 Send Feedback
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardStandalone;
