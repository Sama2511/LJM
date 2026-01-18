"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, Calendar, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
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
  date?: string;
  location?: string;
  image_url?: string;
  created_at?: string;
}

// Static pages that aren't in the database
const staticPages = [
  { 
    id: "services", 
    title: "Services", 
    description: "Explore our professional services and offerings", 
    type: "Page",
    keywords: ["services", "professional", "offerings"]
  },
  { 
    id: "crew", 
    title: "Crew", 
    description: "Meet our talented team members", 
    type: "Page",
    keywords: ["crew", "team", "members", "staff"]
  },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleEnterKey = () => {
    if (results.length > 0) {
      handleItemClick(results[0]);
    }
  };

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchPattern = `%${searchTerm}%`;
      
      // Search static pages
      const filteredStatic = staticPages.filter(page => {
        const searchableText = [
          page.title,
          page.description,
          ...(page.keywords || [])
        ].join(" ").toLowerCase();
        
        return searchableText.includes(searchTerm.toLowerCase());
      });

      // Search events - title, description, location
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, description, date, location, image_url")
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},location.ilike.${searchPattern}`)
        .order("date", { ascending: false })
        .limit(10);

      // Search event roles to find events by role name
      const { data: rolesData } = await supabase
        .from("event_roles")
        .select("event_id, events(id, title, description, date, location, image_url)")
        .ilike("role_name", searchPattern);

      // Extract unique events from role search and flatten the array
      const eventsFromRoles = rolesData
        ?.map(r => r.events)
        .filter((event): event is NonNullable<typeof event> => event !== null && !Array.isArray(event))
        .filter((event, index, self) => 
          index === self.findIndex(e => e.id === event.id)
        ) || [];

      // Search pages
      const { data: pagesData } = await supabase
        .from("pages")
        .select("id, title, content")
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .limit(10);

      // Search articles - title and content
      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title, content, image_url, created_at")
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .order("created_at", { ascending: false })
        .limit(10);

      // Combine all results - ensure eventsFromRoles items have correct types
      const eventResults: SearchResult[] = [
        ...(eventsData || []),
        ...eventsFromRoles
      ].filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      ).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        type: "Event",
        date: event.date,
        location: event.location,
        image_url: event.image_url
      }));

      const pageResults: SearchResult[] = (pagesData || []).map(page => ({
        id: page.id,
        title: page.title,
        description: page.content || "",
        type: "Page"
      }));

      const articleResults: SearchResult[] = (articlesData || []).map(article => ({
        id: article.id,
        title: article.title,
        description: article.content || "",
        type: "Article",
        image_url: article.image_url,
        created_at: article.created_at
      }));

      const combined: SearchResult[] = [
        ...filteredStatic,
        ...eventResults,
        ...pageResults,
        ...articleResults
      ];

      setResults(combined);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Live search on typing (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) fetchResults(query);
      else {
        setResults([]);
        setHasSearched(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleItemClick = (item: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);

    if (item.type === "Event") {
      // Check if event is past or upcoming
      const eventDate = item.date ? new Date(item.date) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isPast = eventDate && eventDate < today;
      
      // Navigate with tab parameter
      router.push(`/events?tab=${isPast ? 'past' : 'upcoming'}`);
    } else if (item.type === "Article") {
      router.push(`/articles`);
    } else if (item.type === "Page") {
      if (item.id === "services") {
        router.push(`/services`);
      } else if (item.id === "crew") {
        router.push(`/crew`);
      } else {
        router.push(`/`);
      }
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
        <div ref={inputRef} className="relative w-36">
          <div className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnterKey();
                }
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setQuery("");
                  setResults([]);
                  setHasSearched(false);
                }
              }}
              placeholder="Search..."
              className="rounded-full py-1.5 pr-3 pl-3 flex-1 text-sm"
              autoFocus
            />

            <button
              onClick={() => {
                setIsOpen(false);
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {hasSearched && (
            <div className="absolute z-50 mt-2 max-h-[500px] w-full overflow-y-auto rounded-lg bg-white shadow-xl border">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              )}

              {!isLoading && results.length === 0 && (
                <div className="p-10 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-gray-100 rounded-full p-4">
                      <Search className="text-gray-400" size={32} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500 mb-1">
                    We couldn't find anything matching "{query}"
                  </p>
                                  </div>
              )}

              {!isLoading && results.length > 0 && (
                <ul className="divide-y">
                  {results.map((res) => (
                    <li
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleItemClick(res)}
                      className="cursor-pointer p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-gray-900 truncate">
                              {res.title}
                            </p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                              {res.type}
                            </span>
                          </div>
                        </div>
                      </div>
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