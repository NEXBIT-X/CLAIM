"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Patent {
  id: string;
  title: string;
  description: string;
  inventors: string[];
  patentNumber: string;
  authority: string;
  filingDate: string;
  category: string;
  keywords: string[];
  views: number;
  verified: boolean;
  owner: string;
  ipfsHash: string;
  createdAt: string;
}

const BrowsePatents = () => {
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Only access wagmi hooks on client side
    if (typeof window !== 'undefined') {
      try {
        const { useAccount } = require('wagmi');
        const accountData = useAccount();
        setAddress(accountData.address);
        setIsConnected(accountData.isConnected);
      } catch (error) {
        console.warn('Wagmi not available');
      }
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mock data - in real app this would come from blockchain/IPFS
  const mockPatents: Patent[] = [
    {
      id: "1",
      title: "AI-Powered Medical Diagnosis System",
      description: "A machine learning system that assists healthcare professionals in diagnosing diseases through image analysis and pattern recognition.",
      inventors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
      patentNumber: "US11234567B2",
      authority: "USPTO",
      filingDate: "2023-06-15",
      category: "Medical Devices",
      keywords: ["artificial intelligence", "medical diagnosis", "image analysis"],
      views: 1245,
      verified: true,
      owner: "0x742d35cc6bf8d5c5",
      ipfsHash: "QmX7j8K9L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6a7B8c9D",
      createdAt: "2023-09-15T10:30:00Z"
    },
    {
      id: "2",
      title: "Quantum Computing Optimization Algorithm",
      description: "Novel optimization algorithm for quantum computers that reduces computational complexity for certain NP-hard problems.",
      inventors: ["Dr. Emily Watson", "Dr. James Park"],
      patentNumber: "US11345678B2",
      authority: "USPTO",
      filingDate: "2023-08-20",
      category: "Computer Science",
      keywords: ["quantum computing", "optimization", "algorithm"],
      views: 892,
      verified: true,
      owner: "0x842e46dd7cf9e6d6",
      ipfsHash: "QmY8k9L3n4o5P6q7R8s9T0u1V2w3X4y5Z6a7B8c9D0e1F",
      createdAt: "2023-09-10T14:20:00Z"
    },
    {
      id: "3",
      title: "Sustainable Energy Storage Device",
      description: "Eco-friendly battery technology using organic compounds for long-term energy storage with minimal environmental impact.",
      inventors: ["Dr. Robert Green", "Dr. Lisa Miller"],
      patentNumber: "US11456789B2",
      authority: "USPTO",
      filingDate: "2023-07-10",
      category: "Chemical Engineering",
      keywords: ["energy storage", "sustainable", "battery technology"],
      views: 2103,
      verified: true,
      owner: "0x943f57ee8dfa07e7",
      ipfsHash: "QmZ9l0M4n5o6P7q8R9s0T1u2V3w4X5y6Z7a8B9c0D1e2G",
      createdAt: "2023-09-05T09:15:00Z"
    }
  ];

  const categories = [
    "All Categories",
    "AI & Machine Learning",
    "Biotechnology", 
    "Chemical Engineering",
    "Computer Science",
    "Electrical Engineering",
    "Medical Devices",
    "Mechanical Engineering",
    "Pharmaceuticals",
    "Software",
    "Telecommunications"
  ];

  const authorities = [
    "All Authorities",
    "USPTO (United States)",
    "IPO India",
    "WIPO",
    "EPO (European)",
    "JPO (Japan)",
    "CNIPA (China)"
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "mostViewed", label: "Most Viewed" },
    { value: "alphabetical", label: "Alphabetical" }
  ];

  const filteredPatents = mockPatents.filter(patent => {
    const matchesSearch = patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patent.inventors.some(inv => inv.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         patent.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "" || selectedCategory === "All Categories" || 
                           patent.category === selectedCategory;
    
    const matchesAuthority = selectedAuthority === "" || selectedAuthority === "All Authorities" || 
                            patent.authority === selectedAuthority.split(" ")[0];

    return matchesSearch && matchesCategory && matchesAuthority;
  });

  const PatentCard = ({ patent }: { patent: Patent }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg bg-zin dark:bg-zinc-900 p-6 shadow-two dark:shadow-three hover:shadow-three dark:hover:shadow-gray-dark transition-all"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-black dark:text-white line-clamp-2">
            {patent.title}
          </h3>
          <p className="mb-3 text-sm text-body-color dark:text-body-color-dark line-clamp-3">
            {patent.description}
          </p>
        </div>
        {patent.verified && (
          <div className="ml-4 rounded-full bg-green-100 px-2 py-1 dark:bg-green-900/20">
            <span className="text-xs font-medium text-green-800 dark:text-green-200">
              ✓ Verified
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {patent.category}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {patent.authority}
          </span>
        </div>
        <div className="text-sm text-body-color dark:text-body-color-dark">
          <span className="font-medium">Patent #:</span> {patent.patentNumber}
        </div>
        <div className="text-sm text-body-color dark:text-body-color-dark">
          <span className="font-medium">Inventors:</span> {patent.inventors.join(", ")}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {patent.keywords.slice(0, 3).map((keyword, index) => (
          <span
            key={index}
            className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {keyword}
          </span>
        ))}
        {patent.keywords.length > 3 && (
          <span className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            +{patent.keywords.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-body-color dark:text-body-color-dark">
          <span className="flex items-center space-x-1">
            <span>👁️</span>
            <span>{patent.views.toLocaleString()}</span>
          </span>
          <span>{new Date(patent.filingDate).toLocaleDateString()}</span>
        </div>
        <div className="flex space-x-2">
          <button className="rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary hover:text-white transition-colors">
            View Details
          </button>
          <button className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
            Download
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
        <div className="p-head mb-12 text-center border-2">
          <center>
            <img src="https://raw.githubusercontent.com/NEXBIT-X/CLAIM/b9cf5c33111470338654a7e7897dc6d4321dee90/app/src/assets/icons/pdf.svg" id="banner" alt="Banner" />
          </center>
        </div>        
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            Browse Verified Patents
          </h1>
          <p className="text-body-color dark:text-body-color-dark">
            Discover government-verified patents stored on the blockchain
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 rounded-lg bg-zin dark:bg-zinc-900 p-6 shadow-two dark:shadow-three"
        >
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Search Patents
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, inventor..."
                className="w-full rounded-lg border border-gray-300 bg-zin px-3 py-2 text-sm text-black focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Select Patent Category"
                className="w-full rounded-lg border border-gray-300 bg-zin px-3 py-2 text-sm text-black focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Authority Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Authority
              </label>
              <select
                value={selectedAuthority}
                onChange={(e) => setSelectedAuthority(e.target.value)}
                title="Select Government Authority"
                className="w-full rounded-lg border border-gray-300 bg-zin px-3 py-2 text-sm text-black focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                {authorities.map((auth) => (
                  <option key={auth} value={auth}>
                    {auth}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                title="Sort Patents By"
                className="w-full rounded-lg border border-gray-300 bg-zin px-3 py-2 text-sm text-black focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 flex items-center justify-between"
        >
          <p className="text-body-color dark:text-body-color-dark">
            Showing {filteredPatents.length} of {mockPatents.length} patents
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-body-color dark:text-body-color-dark">View:</span>
            <button className="rounded-lg bg-primary px-3 py-1 text-white">
              Grid
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-600 dark:border-gray-600 dark:text-gray-300">
              List
            </button>
          </div>
        </motion.div>

        {/* Patents Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatents.map((patent, index) => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPatents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-16 text-center"
          >
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
              No patents found
            </h3>
            <p className="text-body-color dark:text-body-color-dark">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}

        {/* Load More */}
        {filteredPatents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <button className="rounded-lg border border-primary px-8 py-3 text-primary hover:bg-primary hover:text-white transition-colors">
              Load More Patents
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BrowsePatents;