"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Result type
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string; // Event, Page, etc.
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch results from Supabase
  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Search events table - FIXED: proper .or() syntax
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("id, title, description")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      if (eventsError) {
        console.error("Events search error:", eventsError);
      }

      // Search pages table - FIXED: proper .or() syntax
      const { data: pagesData, error: pagesError } = await supabase
        .from("pages")
        .select("id, title, content")
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      if (pagesError) {
        console.error("Pages search error:", pagesError);
      }

      const combinedResults: SearchResult[] = [
        ...(eventsData || []).map((r) => ({ 
          ...r, 
          description: r.description || "", 
          type: "Event" 
        })),
        ...(pagesData || []).map((r) => ({ 
          id: r.id,
          title: r.title,
          description: r.content || "", 
          type: "Page" 
        })),
      ];

      console.log("Search results:", combinedResults); // Debug log
      setResults(combinedResults);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Live search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) fetchResults(query);
      else setResults([]);
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleItemClick = (item: SearchResult) => {
    // Example: navigate to item detail page (replace with your routing)
    if (item.type === "Event") {
      window.location.href = `/events/${item.id}`;
    } else if (item.type === "Page") {
      window.location.href = `/pages/${item.id}`;
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search the site..."
          className="pl-10"
        />
      </div>

      {/* Inline results dropdown */}
      {query && (
        <div className="absolute z-50 w-full bg-white shadow-lg rounded-b-md mt-1 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-5">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="p-5 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul>
              {results.map((res) => (
                <li
                  key={res.id}
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleItemClick(res)}
                >
                  <p className="font-semibold">{res.title}</p>
                  <p className="text-sm text-gray-600">
                    {res.description ? res.description.slice(0, 100) : "No description"}...
                  </p>
                  <p className="text-xs text-gray-400">{res.type}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}