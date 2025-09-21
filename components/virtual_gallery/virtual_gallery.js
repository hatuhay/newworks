(function (Drupal, drupalSettings) {
  "use strict";

  Drupal.behaviors.virtualGallery = {
    attach: function (context, settings) {
      // Find all gallery triggers once
      const galleryTriggers = once("gallery-init", ".gallery-trigger", context);

      galleryTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", function (event) {
          event.preventDefault();
          const galleryId = this.getAttribute("data-gallery-id");
          const images =
            drupalSettings.ayarachis?.virtual_gallery?.[galleryId]?.images ||
            [];

          // Initialize blueimp Gallery with the images
          blueimp.Gallery(images, {
            container: `#${galleryId}`,
            carousel: true,
            closeOnEscape: true,
            closeOnSlideClick: false,
            closeOnSwipeUpOrDown: false,
            enableKeyboardNavigation: true,
          });
        });
      });
    },
  };
})(Drupal, drupalSettings);
