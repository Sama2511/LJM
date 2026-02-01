import { FetchArticles } from "@/actions/articles";
import ArticleForm from "../../components/ArticleForm";
import AdminProfile from "../../components/AdminProfile";
import PaginatedArticleGrid from "../../components/PaginatedArticleGrid";

export default async function ArticleManagement() {
  const { data: articles, error } = await FetchArticles();

  const articleItems =
    articles?.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      image_url: `https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/article-pics/3e61ff3b-2e19-4c9c-a02a-413d85becbf4`,
      created_at: article.created_at,
    })) || [];

  return (
    <div className="@container w-full p-6">
      <AdminProfile pageName="Article Management" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-end">
          <ArticleForm />
        </div>

        {error && (
          <p className="text-destructive">Failed to load articles: {error}</p>
        )}

        {articleItems.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg">No articles yet</p>
            <p className="text-muted-foreground text-sm">
              Create your first article using the button above
            </p>
          </div>
        )}

        {articleItems.length > 0 && (
          <PaginatedArticleGrid articles={articleItems} />
        )}
      </div>
    </div>
  );
}
