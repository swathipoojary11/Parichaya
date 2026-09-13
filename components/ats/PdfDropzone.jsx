"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { extractTextFromPDF } from "@/lib/services/pdfParserService";

export default function PdfDropzone({ onParsedText, onRawFile }) {
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please select a valid PDF resume file.");
      return;
    }

    setError("");
    setFileName(file.name);
    setParsing(true);

    try {
      const extractedText = await extractTextFromPDF(file);
      if (!extractedText || extractedText.length < 50) {
        throw new Error("PDF contains little or no extractable text.");
      }
      if (onParsedText) onParsedText(extractedText);
      if (onRawFile) onRawFile(file);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to extract text from PDF.");
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700">Upload Existing Resume (PDF Only) *</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors cursor-pointer space-y-3"
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl border border-indigo-100 shadow-xs">
          📄
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {fileName ? fileName : "Drag & drop your PDF resume here"}
          </p>
          <p className="text-xs text-slate-500 mt-1">100% Client PDF Extraction &bull; Zero Cloud Leakage</p>
        </div>

        <div>
          <input
            type="file"
            accept="application/pdf"
            id="pdf-upload-input"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={parsing}
            onClick={() => document.getElementById("pdf-upload-input").click()}
          >
            {fileName ? "Change PDF File" : "Browse PDF File"}
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-mono font-medium">{error}</p>}
    </div>
  );
}
