import { useState } from "react";
import { Search, X } from "lucide-react"; // Import icons
import { Layout } from "../components/Layout";

const SearchPage = () => {
  const [query, setQuery] = useState(""); // State for search query
  const [results, setResults] = useState([]); // State for search results

  // Mock search function (replace with your actual search logic)
  const handleSearch = (query) => {
    if (!query) {
      setResults([]);
      return;
    }

    // Mock data for demonstration
    const mockResults = [
      { id: 1, title: "User 1", description: "Description for User 1" },
      { id: 2, title: "User 2", description: "Description for User 2" },
      { id: 3, title: "User 3", description: "Description for User 3" },
    ];

    // Filter results based on query
    const filteredResults = mockResults.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value); // Trigger search on every keystroke
  };

  // Clear search
  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <Layout>
      <div className=" col-span-12 ">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search post..."
              value={query}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-lg placeholder-gray-400"
            />
            <Search className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
            {query && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-3xl mx-auto mt-8 space-y-4">
          {results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-105 cursor-pointer"
              >
                <h3 className="font-semibold text-xl text-gray-800">
                  {result.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {result.description}
                </p>
              </div>
            ))
          ) : query ? (
            <p className="text-center text-gray-500 text-lg">
              No results found.
            </p>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              Start typing to search...
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
