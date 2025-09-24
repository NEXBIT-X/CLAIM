export interface WalletState {
  isConnected: boolean;
  account: string;
  walletType: 'MetaMask' | 'Internet Identity' | '';
  isConnecting: boolean;
}

export interface PinataFile {
  id: number;
  name: string;
  hash: string;
  size: number;
  uploadedAt: string;
}

export interface UserStats {
  submittedPatents: number;
  verifiedPatents: number;
  pendingReview: number;
  totalViews: number;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (params: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (data: any) => void) => void;
      removeListener?: (event: string, handler: (data: any) => void) => void;
    };
  }
}
