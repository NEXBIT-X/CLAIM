"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, Wallet } from 'lucide-react';
import { useAuth } from '@/app/context/AuthProvider';

interface ProtectedContentProps {
  children: React.ReactNode;
  teaserTitle?: string;
  teaserDescription?: string;
}

const ProtectedContent: React.FC<ProtectedContentProps> = ({
  children,
  teaserTitle = "Authentication Required",
  teaserDescription = "Please connect your wallet to access this content."
}) => {
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              {teaserTitle}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {teaserDescription}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => login('metamask')}
              className="w-full sm:w-auto px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center gap-3 font-semibold"
            >
              <Wallet className="w-5 h-5" />
              Connect MetaMask
            </button>
            
            <button
              onClick={() => login('internet-identity')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-3 font-semibold"
            >
              <Shield className="w-5 h-5" />
              Internet Identity
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              New to Web3? {' '}
              <Link 
                href="/docs/getting-started" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Learn how to set up your wallet
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProtectedContent;
