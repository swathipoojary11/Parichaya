/**
 * Client-Side PDF Text Parser Service
 * Uses pdfjs-dist to extract raw text from PDF files directly in the browser.
 */

import * as pdfjsLib from "pdfjs-dist";

// Set worker source to CDN or local worker if needed
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Extracts plain text from an uploaded PDF File object.
 * @param {File} file - Browser File handle.
 * @returns {Promise<string>} Extracted plain text.
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    throw new Error("Could not extract text from PDF. Ensure the file is not encrypted or corrupted.");
  }
}
