import { FetchDocuments } from "@/actions/documents";
import DocumentForm from "../../components/DocumentForm";
import DashDocumentCard from "../../components/DashDocumentCard";
import AdminProfile from "../../components/AdminProfile";

export default async function DocumentManagement() {
  const { data: documents, error } = await FetchDocuments();

  return (
    <div className="@container w-full p-6">
      <AdminProfile pageName="Document Management" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-end">
          <DocumentForm />
        </div>

        {error && (
          <p className="text-destructive">Failed to load documents: {error}</p>
        )}

        {documents && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-lg">No documents yet</p>
            <p className="text-muted-foreground text-sm">
              Upload your first document using the button above
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents?.map((doc) => (
            <DashDocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              file_url={doc.file_url}
              created_at={doc.created_at}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
