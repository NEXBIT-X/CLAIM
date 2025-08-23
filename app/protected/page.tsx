const Info = () => {
  return (
    <div className="min-h-screen p-6">
      {/* Grid Layout Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 h-screen">
        
        {/* Logo Section - Top Left */}
        <div className="col-span-1 row-span-1">
          <div className="card h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
            <img
              src="/logo.svg"
              alt="CLAIM"
              className="h-24 w-24 filter brightness-0 invert"
            />
          </div>
        </div>

        {/* Main Content - Top Center & Right */}
        <div className="col-span-2 row-span-1">
          <div className="card h-full bg-card  rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">CLAIM Platform</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Decentralized platform for government-verified patent protection. 
              Leverage Ethereum blockchain and IPFS for tamper-proof, 
              indexed, and future-proof patent discovery.
            </p>
            <div className="mt-8">
              {/* Uiverse.io button - GET STARTED */}
              <button className="btn"
              >
                <div>GET STARTED</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                  <path d="M11.6801 14.62L14.2401 12.06L11.6801 9.5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M4 12.0601H14.17" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M12 4C16.42 4 20 7 20 12C20 17 16.42 20 12 20" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid - Bottom Row */}
        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-card  rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Blockchain Security</h3>
            <p className="text-gray-600 dark:text-gray-400">Immutable proof timestamps on Ethereum</p>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-card  rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col justify-center">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Government Verified</h3>
            <p className="text-gray-600 dark:text-gray-400">Only official patents accepted</p>
          </div>
        </div>

        <div className="col-span-1 row-span-1">
          <div className="card h-full bg-card  rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col justify-center">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">IPFS Storage</h3>
            <p className="text-gray-600 dark:text-gray-400">Decentralized, permanent storage</p>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Info;
