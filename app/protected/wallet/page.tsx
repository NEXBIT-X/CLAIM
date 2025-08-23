'use client';
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart,
  Settings,
  LifeBuoy,
  Home,
  WalletCards,
} from "lucide-react";

export default function WalletPage() {
  return (
    <div className="min-h-screen p-6">
      {/* Grid Layout Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 h-screen">
        
        {/* Wallet Logo - Top Left */}
        <div className="col-span-1 row-span-1">
          <div className="card h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1M16 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-7-3a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
        </div>

        {/* Main Wallet Content - Top Center & Right */}
        <div className="col-span-2 row-span-1">
          <div className="card h-full bg-card border-border rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Wallet Connection</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Connect your Web3 wallet to interact with the CLAIM blockchain network. 
              Manage your digital assets, sign transactions for patent protection, 
              and access your complete IP portfolio securely.
            </p>
            <div className="mt-8">
              <button 
                className="btn"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.ethereum) {
                    window.ethereum.request({ method: 'eth_requestAccounts' });
                  } else {
                    alert('Please install MetaMask or another Web3 wallet to connect.');
                  }
                }}
              >
                <div>CONNECT WALLET</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Wallet Feature Cards - Bottom Row */}
        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">MetaMask</h3>
            <p className="text-gray-600 dark:text-gray-400">Most popular Web3 wallet integration</p>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col justify-center">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">WalletConnect</h3>
            <p className="text-gray-600 dark:text-gray-400">Connect with 100+ mobile wallets</p>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col justify-center">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Transactions</h3>
            <p className="text-gray-600 dark:text-gray-400">End-to-end encrypted blockchain operations</p>
          </div>
        </div>
      </div>

      {/* Wallet Features Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Wallet Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Digital Signatures</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Cryptographically sign your IP protection transactions</p>
          </div>

          <div className="bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transaction History</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Track all your blockchain transactions and patent registrations</p>
          </div>

          <div className="bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gas Optimization</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Smart gas price estimation for cost-effective transactions</p>
          </div>

          <div className="bg-card border-border rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multi-Network</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Support for Ethereum, Polygon, and other networks</p>
          </div>
        </div>
      </div>

      {/* Connection Status Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-card border-border rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Connection Status</h2>
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1M16 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-7-3a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">No wallet connected. Connect your Web3 wallet to get started with patent protection.</p>
            <button 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined' && window.ethereum) {
                  window.ethereum.request({ method: 'eth_requestAccounts' });
                } else {
                  alert('Please install MetaMask or another Web3 wallet to connect.');
                }
              }}
            >
              Connect Your Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
