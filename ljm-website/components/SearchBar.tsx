"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, description")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      const { data: pagesData } = await supabase
        .from("pages")
        .select("id, title, content")
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);

      const combined: SearchResult[] = [
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

      setResults(combined);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 Live search on typing (debounce for API efficiency)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) fetchResults(query);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleItemClick = (item: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);

    if (item.type === "Event") router.push(`/events`);
    if (item.type === "Page") router.push(`/`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        setHasSearched(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="rounded-full p-2 transition hover:bg-[#ffe4cc]"
        >
          <Search size={20} className="text-[#3b3b3b]" />
        </button>
      )}

      {isOpen && (
        <div ref={inputRef} className="relative w-35">
          <div className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="rounded-full py-2 pr-3 pl-3 flex-1"
            />

            <button
              onClick={() => {
                setIsOpen(false);
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {hasSearched && (
            <div className="absolute z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-md bg-white shadow-lg">
              {isLoading && (
                <div className="flex justify-center py-5">
                  <Loader2 className="animate-spin" size={20} />
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
                      onClick={() => handleItemClick(res)}
                      className="cursor-pointer border-b p-4 last:border-b-0 hover:bg-gray-50"
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
      )}
    </div>
  );
}
