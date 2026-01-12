"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // controls input visibility
  const inputRef = useRef<HTMLInputElement>(null);

  const navLinks = ["Event", "Page"];

  // Fetch results from Supabase
  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, description")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      const { data: pagesData } = await supabase
        .from("pages")
        .select("id, title, content")
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      const combinedResults: SearchResult[] = [
        ...(eventsData || []).map((r) => ({
          ...r,
          description: r.description || "",
          type: "Event",
        })),
        ...(pagesData || []).map((r) => ({
          id: r.id,
          title: r.title,
          description: r.content || "",
          type: "Page",
        })),
      ];

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
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // handle click outside to close input
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (item: SearchResult) => {
    if (item.type === "Event") {
      window.location.href = `/events/${item.id}`;
    } else if (item.type === "Page") {
      window.location.href = `/pages/${item.id}`;
    }
  };

  return (
    <div className="relative">
      {/* Search Icon */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="p-2 rounded-full hover:bg-[#ffe4cc] transition"
        >
          <Search size={20} className="text-[#3b3b3b]" />
        </button>
      )}

      {/* Input box when open */}
      {isOpen && (
        <div ref={inputRef} className="relative w-64">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the site..."
            className="pl-3 pr-8 py-2 rounded-full"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X size={16} className="text-gray-500" />
          </button>

          {/* Results dropdown */}
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
                        {res.description
                          ? res.description.slice(0, 100)
                          : "No description"}
                        ...
                      </p>
                      <p className="text-xs text-gray-400">{res.type}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
