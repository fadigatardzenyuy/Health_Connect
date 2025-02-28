import { useState, useEffect } from "react";
import { Search, X, User, AlertCircle } from "lucide-react";
import { Layout } from "../components/Layout";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Simulated search with loading state
  const handleSearch = (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API request with timeout
    setTimeout(() => {
      // Mock data with more realistic user info
      const mockResults = [
        {
          id: 1,
          title: "John Smith",
          description: "Product Manager at TechCorp",
          avatar: "/api/placeholder/40/40",
        },
        {
          id: 2,
          title: "Sarah Johnson",
          description: "UI/UX Designer at DesignLab",
          avatar: "/api/placeholder/40/40",
        },
        {
          id: 3,
          title: "Michael Chen",
          description: "Software Engineer at CodeWorks",
          avatar: "/api/placeholder/40/40",
        },
        {
          id: 4,
          title: "Jessica Williams",
          description: "Marketing Specialist at BrandMakers",
          avatar: "/api/placeholder/40/40",
        },
      ];

      // Filter results based on query
      const filteredResults = mockResults.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filteredResults);
      setIsSearching(false);

      // Add to recent searches if it's not already there
      if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
        setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)]);
      }
    }, 600);
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Use recent search
  const useRecentSearch = (search) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <Layout>
      <div className="col-span-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Find Users
        </h1>

        {/* Search Bar with enhanced styling */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={query}
            onChange={handleInputChange}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-0 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-400 transition-all duration-300"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-2">
              Recent Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => useRecentSearch(search)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="flex justify-center my-12">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results with enhanced UI */}
        {!isSearching && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((result, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    key={result.id}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      {result.avatar ? (
                        <img
                          src={result.avatar}
                          alt={result.title}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {result.description}
                      </p>
                    </div>
                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">
                  No results found
                </h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  We couldn't find any users matching "{query}". Try a different
                  search term.
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Type a name to search for users
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
