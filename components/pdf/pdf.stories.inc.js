document.addEventListener("DOMContentLoaded", function (event) {
  var wrapper = document.getElementById("pdf-wrapper");
  var url = wrapper.dataset.pdf;
  var scale = 2;
  var pdfDoc = null;
  var canvas;
  var pageNum = 1;
  var pageIsRendering = false;
  var currentPage = document.getElementById("page-num");

  // Loaded via <script> tag, create shortcut to access PDF.js exports.
  var { pdfjsLib } = globalThis;

  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdfjs/build/pdf.worker.min.js";

  // Asynchronous download of PDF
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(
    function (pdf_) {
      pdfDoc = pdf_;
      document.getElementById("page-count").innerText = pdfDoc.numPages;
      canvas = document.createElement("canvas");
      canvas.className = "pdf-page-canvas";
      canvas.id = "pdf-page-canvas";
      wrapper.appendChild(canvas);
      renderPage(pageNum);
    },
    function (reason) {
      // PDF loading error
      console.error(reason);
    }
  );

  const renderPage = (pageNum) => {
    pdfDoc.getPage(pageNum).then(function (page) {
      var viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      currentPage.innerText = pageNum;
      page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      });
    });
  };

  // Check for pages rendering
  const queueRenderPage = (pageNum) => {
    if (pageIsRendering) {
      pageNumIsPending = pageNum;
    } else {
      renderPage(pageNum);
    }
  };
  // Show Prev Page
  const showPrevPage = () => {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  };
  // Show Next Page
  const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  };
  // Button Events
  document.querySelector("#prev-page").addEventListener("click", showPrevPage);
  document.querySelector("#next-page").addEventListener("click", showNextPage);
});
