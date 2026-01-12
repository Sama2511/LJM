"use client";

import { useEffect, useState } from "react";
import PdfViewer from "./PdfViewer";
import { createClient } from "@/app/utils/client";

type Document = {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
};

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setDocuments(data);
      }
      setLoading(false);
    }

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">No documents available yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {documents.map((doc) => (
        <PdfViewer
          key={doc.id}
          title={doc.title}
          pdfUrl={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/documents/${doc.file_url}`}
        />
      ))}
    </div>
  );
}
