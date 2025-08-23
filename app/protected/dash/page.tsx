'use client';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6">
      {/* Grid Layout Container */}
      <div className="max-w-full mx-auto grid grid-cols-3 gap-6 h-screen">
        
        {/* Dashboard Stats - Top Left */}
        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white">
            <div className="text-4xl font-bold mb-2">24</div>
            <div className="text-lg mb-2">Protected Patents</div>
            <div className="text-sm opacity-80">Active Portfolio</div>
          </div>
        </div>

        {/* Main Dashboard Content - Top Center & Right */}
        <div className="col-span-2 row-span-1">
          <div className="card h-full bg-card border-border rounded-2xl p-8 border  shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Overview</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Welcome back! Monitor your protected intellectual property patents, 
              track verification status, analyze portfolio performance, and manage 
              your complete IP protection strategy from this central hub.
            </p>
            <div className="mt-8">
              <button 
                className="btn"
                onClick={() => window.location.href = '/protected/dash/protect'}
              >
                <div>NEW PATENT</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m-7-7h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Cards - Bottom Row */}
        <div className="col-span-1 row-span-1">
          <div 
            className="card h-full rounded-2xl p-6 border  shadow-lg flex flex-col justify-center cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => window.location.href = '/verify'}
          >
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Verify Patents</h3>
            <p className="text-gray-600 dark:text-gray-400">Check authenticity and blockchain records</p>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <div 
            className="card h-full bg-card rounded-2xl p-6 border border-border shadow-lg flex flex-col justify-center cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => window.location.href = '/protect'}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Protect New IP</h3>
            <p className="text-gray-600 dark:text-gray-400">Secure intellectual property on blockchain</p>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <div 
            className="card h-full bg-card rounded-2xl p-6 border border-border shadow-lg flex flex-col justify-center cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => window.location.href = '/analytics'}
          >
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">View Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">Portfolio insights and trend analysis</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">AI Garden System</div>
              <div className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">Protected</div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">Automated gardening system using machine learning to optimize plant growth conditions.</p>
            <div className="text-xs text-gray-500 dark:text-gray-500">Jan 10, 2025 • 0x7f9a...3b2c</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Voting Platform</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">Verified</div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">Transparent and secure digital voting system using blockchain technology.</p>
            <div className="text-xs text-gray-500 dark:text-gray-500">Jan 8, 2025 • 0x8e5c...7d1a</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Smart Contract</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full">Pending</div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">Advanced smart contract for automated IP licensing and royalty distribution.</p>
            <div className="text-xs text-gray-500 dark:text-gray-500">Jan 6, 2025 • 0x2a8f...9c5e</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
