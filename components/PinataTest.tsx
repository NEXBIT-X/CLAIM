"use client";
import { useState, useRef } from 'react';
import { Database, Upload, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { PinataFile } from '@/types/wallet';

interface PinataTestProps {
  isWalletConnected: boolean;
  walletType: string;
  walletAccount?: string;
}

const PinataTest: React.FC<PinataTestProps> = ({ 
  isWalletConnected, 
  walletType, 
  walletAccount 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<PinataFile[]>([]);
  const [pinataConnected, setPinataConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const connectToPinata = async () => {
    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setConnectionLoading(true);
    setError(null);

    try {
      // Simulate API connection to Pinata
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Authenticate with Pinata API using JWT
      // 2. Verify wallet signature
      // 3. Set up IPFS connection
      
      setPinataConnected(true);
      setConnectionLoading(false);
    } catch (err) {
      setError('Failed to connect to Pinata. Please try again.');
      setConnectionLoading(false);
    }
  };

  const uploadToPinata = async (file: File) => {
    if (!pinataConnected) {
      setError('Please connect to Pinata first');
      return;
    }

    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      setError('Only PDF and document files are supported for patent uploads');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulate file upload to IPFS via Pinata
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const newFile: PinataFile = {
        id: Date.now(),
        name: file.name,
        hash: `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload file to IPFS. Please try again.');
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadToPinata(file);
    }
  };

  const viewOnIPFS = (hash: string) => {
    window.open(`https://ipfs.io/ipfs/${hash}`, '_blank');
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      // You could add a toast notification here
    } catch (err) {
      setError('Failed to copy hash to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="space-y-4">
        {!isWalletConnected ? (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Connect your wallet to enable Pinata IPFS storage
              </p>
            </div>
          </div>
        ) : !pinataConnected ? (
          <button
            onClick={connectToPinata}
            disabled={connectionLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <Database className="w-5 h-5" />
            {connectionLoading ? 'Connecting to Pinata...' : 'Connect to Pinata IPFS'}
          </button>
        ) : (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    Connected to Pinata IPFS
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    Via {walletType} • {walletAccount?.slice(0, 6)}...{walletAccount?.slice(-4)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPinataConnected(false);
                  setUploadedFiles([]);
                  setError(null);
                }}
                className="text-green-600 hover:text-green-700 text-sm underline"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* File Upload */}
      {pinataConnected && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              id="patent-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              disabled={isUploading}
            />
            <label
              htmlFor="patent-upload"
              className={`cursor-pointer flex flex-col items-center gap-3 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-10 h-10 text-gray-400" />
              <div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {isUploading ? 'Uploading to IPFS...' : 'Upload Patent Documents'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Click to browse or drag and drop PDF files
                </div>
              </div>
            </label>
            
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Encrypting and storing on IPFS...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded to IPFS ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div 
                key={file.id} 
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => copyHash(file.hash)}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      Copy Hash
                    </button>
                    <button
                      onClick={() => viewOnIPFS(file.hash)}
                      className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </button>
                  </div>
                </div>
                
                <div className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded break-all">
                  IPFS: {file.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PinataTest;
