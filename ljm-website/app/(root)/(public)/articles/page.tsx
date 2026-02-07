import ArticleCard from "@/components/ArticleCard";
import { FetchArticles } from "@/actions/articles";

export default async function ArticlesPage() {
  const { data: articles, error } = await FetchArticles();

  return (
    <div className="font-chillax @container flex min-h-screen flex-col items-center pb-20">
      <div className="mb-20 flex flex-col items-center">
        <h1 className="text-foreground mt-10 text-4xl font-medium sm:text-6xl lg:text-7xl">
          Articles
        </h1>
        <h2 className="mt-5 max-w-[85%] text-center text-lg">
          Explore our collection of articles, guides, and resources.
        </h2>
      </div>

      {error && <p className="text-destructive">Failed to load articles</p>}

      {articles && articles.length === 0 && (
        <p className="text-muted-foreground">No articles available yet.</p>
      )}

      <section className="grid max-w-[90%] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
        {articles?.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            content={article.content}
            image_url={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/article-pics/${article.image_url}`}
            created_at={article.created_at}
          />
        ))}
      </section>
    </div>
  );
}
