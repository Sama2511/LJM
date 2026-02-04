"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Calendar, MapPin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

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

const staticPages = [
  {
    id: "services",
    title: "Services",
    description: "Explore our professional services and offerings",
    type: "Page",
    keywords: ["services", "professional", "offerings"],
  },
  {
    id: "crew",
    title: "Crew",
    description: "Meet our talented team members",
    type: "Page",
    keywords: ["crew", "team", "members", "staff"],
  },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
      const searchPattern = `%${searchTerm}%`;

      const filteredStatic = staticPages.filter((page) => {
        const searchableText = [
          page.title,
          page.description,
          ...(page.keywords || []),
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchTerm.toLowerCase());
      });

      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, description, date, location, image_url")
        .or(
          `title.ilike.${searchPattern},description.ilike.${searchPattern},location.ilike.${searchPattern}`
        )
        .order("date", { ascending: false })
        .limit(10);

      const { data: rolesData } = await supabase
        .from("event_roles")
        .select(
          "event_id, events(id, title, description, date, location, image_url)"
        )
        .ilike("role_name", searchPattern);

      const eventsFromRoles =
        rolesData
          ?.map((r) => r.events)
          .filter(
            (event): event is NonNullable<typeof event> =>
              event !== null && !Array.isArray(event)
          )
          .filter(
            (event, index, self) =>
              index === self.findIndex((e) => e.id === event.id)
          ) || [];

      const { data: pagesData } = await supabase
        .from("pages")
        .select("id, title, content")
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .limit(10);

      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title, content, image_url, created_at")
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .order("created_at", { ascending: false })
        .limit(10);

      const eventResults: SearchResult[] = [
        ...(eventsData || []),
        ...eventsFromRoles,
      ]
        .filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.id === event.id)
        )
        .map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description || "",
          type: "Event",
          date: event.date,
          location: event.location,
          image_url: event.image_url,
        }));

      const pageResults: SearchResult[] = (pagesData || []).map((page) => ({
        id: page.id,
        title: page.title,
        description: page.content || "",
        type: "Page",
      }));

      const articleResults: SearchResult[] = (articlesData || []).map(
        (article) => ({
          id: article.id,
          title: article.title,
          description: article.content || "",
          type: "Article",
          image_url: article.image_url,
          created_at: article.created_at,
        })
      );

      const combined: SearchResult[] = [
        ...filteredStatic,
        ...eventResults,
        ...pageResults,
        ...articleResults,
      ];

      setResults(combined);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Keyboard shortcut: Ctrl+K or Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const handleItemClick = (item: SearchResult) => {
    handleClose();

    if (item.type === "Event") {
      const eventDate = item.date ? new Date(item.date) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = eventDate && eventDate < today;
      router.push(`/events?tab=${isPast ? "past" : "upcoming"}`);
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

  const handleEnterKey = () => {
    if (results.length > 0) {
      handleItemClick(results[0]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Event":
        return "bg-primary/10 text-primary";
      case "Article":
        return "bg-secondary/50 text-secondary-foreground";
      case "Page":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:bg-accent rounded-full p-2 transition"
      >
        <Search size={20} className="text-foreground" />
      </button>

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent
          showCloseButton={false}
          className="top-[30%] max-w-lg translate-y-[-30%] gap-0 overflow-hidden p-0 sm:max-w-xl"
        >
          <DialogTitle className="sr-only">Search</DialogTitle>

          {/* Search input */}
          <div className="border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-muted-foreground flex-shrink-0" />
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEnterKey();
                  if (e.key === "Escape") handleClose();
                }}
                placeholder="Search events, articles, pages..."
                className="border-0 p-0 text-base shadow-none focus-visible:ring-0"
                autoFocus
              />
              <kbd className="bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 text-xs font-mono sm:inline-block">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results area */}
          <div className="max-h-[350px] overflow-y-auto">
            {/* Empty state before searching */}
            {!hasSearched && !query && (
              <div className="px-4 py-8 text-center">
                <Search
                  size={32}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground text-sm">
                  Start typing to search...
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Search for events, articles, and pages
                </p>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2
                  className="text-muted-foreground animate-spin"
                  size={24}
                />
              </div>
            )}

            {/* No results */}
            {!isLoading && hasSearched && results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <div className="bg-muted mx-auto mb-3 w-fit rounded-full p-3">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <h3 className="text-foreground mb-1 font-semibold">
                  No results found
                </h3>
                <p className="text-muted-foreground text-sm">
                  We couldn&apos;t find anything matching &quot;{query}&quot;
                </p>
              </div>
            )}

            {/* Results list */}
            {!isLoading && results.length > 0 && (
              <ul>
                {results.map((res) => (
                  <li
                    key={`${res.type}-${res.id}`}
                    onClick={() => handleItemClick(res)}
                    className="hover:bg-muted/50 cursor-pointer border-b px-4 py-3 transition-colors last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate font-medium">
                          {res.title}
                        </p>
                        {res.description && (
                          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                            {res.description}
                          </p>
                        )}
                        {(res.date || res.location) && (
                          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-xs">
                            {res.date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(res.date)}
                              </span>
                            )}
                            {res.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {res.location}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeColor(res.type)}`}
                      >
                        {res.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="text-muted-foreground border-t px-4 py-2 text-center text-xs">
              Press <kbd className="bg-muted rounded px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to go to first result
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
