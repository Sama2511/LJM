"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  title: string;
  pdfUrl: string;
};

export default function PdfViewer({ title, pdfUrl }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function goToPrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  }

  const handleOpen = () => {
    setIsOpen(true);
    setPageNumber(1);
    setLoading(true);
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleOpen}
      >
        <FileText className="h-5 w-5" />
        {title}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-5xl flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 flex-col items-center overflow-auto">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            )}

            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading=""
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
                width={950}
              />
            </Document>
          </div>

          {numPages && (
            <div className="flex items-center justify-center gap-4 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
