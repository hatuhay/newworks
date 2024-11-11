((Drupal) => {
  Drupal.behaviors.pdf = {
    attach() {
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = wrapper.dataset.workerUrl;

      // Asynchronous download of PDF
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(function(pdf_) {
        pdfDoc = pdf_;
        // Added check if canvas with id "pdf-page-canvas" already exists.
        if (document.getElementById('pdf-page-canvas')) return;
        document.getElementById("page-count").innerText = pdfDoc.numPages;
        canvas = document.createElement("canvas");
        canvas.className = "pdf-page-canvas";
        canvas.id = "pdf-page-canvas";
        wrapper.appendChild(canvas);
        renderPage(pageNum);
      }, function(reason) {
        // PDF loading error
        console.error(reason);
      });

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
      document
        .querySelector("#prev-page")
        .addEventListener("click", showPrevPage);
      document
        .querySelector("#next-page")
        .addEventListener("click", showNextPage);
    },
  };

  window.onload = function() {
    // Get the sticky navigation component
    var navComponent = document.querySelector('.c-sticky-navigation-menu');

    // Get the value of --drupal-displace-offset-top
    var drupalOffsetTopRaw = getComputedStyle(document.documentElement).getPropertyValue('--drupal-displace-offset-top');

    // Check if --drupal-displace-offset-top exists and if so, parse it as an integer.
    var drupalOffsetTop = drupalOffsetTopRaw ? parseInt(drupalOffsetTopRaw, 10) : 0;

    // Check if the sticky navigation component exists on the current page
    if (navComponent) {
      // Get the height of the navigation component
      var navHeight = navComponent.offsetHeight;

      // Add the height of navigation component and --drupal-displace-offset-top
      var totalHeight = navHeight + drupalOffsetTop;

      // Set the CSS variable for the navigation height
      document.documentElement.style.setProperty('--sticky-nav-height', totalHeight + 'px');
    } else {
      // If the sticky navigation component does not exist, set the navigation height to 0
      document.documentElement.style.setProperty('--sticky-nav-height', '0px');
    }
  };
})(Drupal);
