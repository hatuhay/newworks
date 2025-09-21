(function (Drupal, drupalSettings) {
  "use strict";

  Drupal.behaviors.videoPopup = {
    attach: function (context, settings) {
      // Find all video popup triggers once
      const videoTriggers = once(
        "video-popup-init",
        ".videopopup-trigger",
        context
      );

      videoTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (event) {
          event.preventDefault();

          // Get modal info from data attributes
          const modalId = this.getAttribute("data-modal-id");
          const imageAlt = this.getAttribute("data-image-alt") || "";
          const videoSrc = this.getAttribute("data-video-src") || "";
          const videoType = this.getAttribute("data-video-type") || "video/mp4";

          // Check if modal already exists
          let modalElement = document.getElementById(`videoModal-${modalId}`);

          // If modal doesn't exist, create and inject it
          if (!modalElement) {
            const modalHTML = `
              <div class="modal fade" id="videoModal-${modalId}" tabindex="-1" aria-labelledby="videoModalLabel-${modalId}" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="videoModalLabel-${modalId}">${imageAlt}</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                      <div class="ratio ratio-16x9">
                        <video id="v-${modalId}" loop controls>
                          <source src="${videoSrc}" type="${videoType}">
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;

            // Append modal to body
            const div = document.createElement("div");
            div.innerHTML = modalHTML;
            document.body.appendChild(div.firstElementChild);

            // Get the newly created modal
            modalElement = document.getElementById(`videoModal-${modalId}`);

            // Add event listeners for video control
            modalElement.addEventListener("shown.bs.modal", function () {
              const video = document.getElementById(`v-${modalId}`);
              if (video) video.play();
            });

            modalElement.addEventListener("hidden.bs.modal", function () {
              const video = document.getElementById(`v-${modalId}`);
              if (video) video.pause();
            });
          }

          // Open modal using Bootstrap API
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        });
      });
    },
  };
})(Drupal, drupalSettings);
