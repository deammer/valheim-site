(function () {
  let lightboxIsVisible = false;

  const closeLightboxElements = document.querySelectorAll(
    "[data-close-lightbox]"
  );
  const lightboxElement = document.getElementById("lightbox");
  const lightboxContainerElement = document.getElementById(
    "lightbox-container"
  );

  const lightboxTargets = document.querySelectorAll("[data-lightbox]");

  const onKeydown = (event) => {
    const { key } = event;
    switch (key) {
      case "Escape":
        hideLightbox();
        break;
      case "ArrowRight":
        // TODO
        break;
      case "ArrowLeft":
        // TODO
        break;
    }
  };

  const hideLightbox = () => {
    lightboxIsVisible = false;
    lightboxElement.style.display = "none";
    document.removeEventListener("keydown", onKeydown);

    // Remove the elements inside the container
    while (lightboxContainerElement.firstChild) {
      lightboxContainerElement.removeChild(lightboxContainerElement.firstChild);
    }
  };

  const showLightbox = () => {
    if (!lightboxIsVisible) {
      lightboxElement.style.display = "block";
      document.addEventListener("keydown", onKeydown);

      // Focus on the first element able to close the lightbox
      closeLightboxElements.item(0).focus();
    }
    lightboxIsVisible = true;
  };

  closeLightboxElements.forEach((target) =>
    target.addEventListener("click", hideLightbox)
  );

  lightboxTargets.forEach((target) => {
    target.addEventListener("click", (event) => {
      const { src, alt } = event.target;

      const imageElem = document.createElement("img");
      imageElem.src = src;
      imageElem.alt = alt;
      imageElem.style.display = "block";
      imageElem.style.maxHeight = "100%";
      lightboxContainerElement.appendChild(imageElem);

      // Show the whole thing
      showLightbox();
    });
  });
})();
