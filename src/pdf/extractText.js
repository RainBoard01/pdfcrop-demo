import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractText = async (src) => {
  const doc = await pdfjsLib.getDocument(src).promise;
  let page;
  let pages = [];
  for (let i = 1; i <= 40; i++) {
    page = await doc.getPage(i);
    pages = [...pages, await page.getTextContent()];
  }
  return pages;
};
