(function () {
  // Handle the mobile navigation menu
  const navElement = document.getElementById("js-nav-container");
  const triggerElement = document.getElementById("js-nav-trigger");
  let navIsVisible = false;

  /**
   * When an anchor element is clicked, we close the nav
   */
  const closeNavOnLinkClicked = (event) => {
    if (event.target.tagName === "A") {
      hideNav();
    }
  };

  /**
   * Display the mobile nav
   */
  const showNav = () => {
    navElement.classList.remove("hidden");
    navIsVisible = true;

    // Prevent scrolling the rest of the page
    document.body.style.overflow = "hidden";

    // Animate the trigger
    triggerElement.classList.add("active");

    // Because some links in the nav scroll the page, we need to hide the nav
    // when they're clicked
    navElement.addEventListener("click", closeNavOnLinkClicked);
  };

  /**
   * Hide the mobile nav
   */
  const hideNav = () => {
    navElement.classList.add("hidden");
    navIsVisible = false;
    document.body.style.overflow = null;
    triggerElement.classList.remove("active");
    navElement.addEventListener("click", closeNavOnLinkClicked);
  };

  /**
   * Display or hide the mobile nav
   */
  const toggleNav = () => {
    if (navIsVisible) {
      hideNav();
    } else {
      showNav();
    }
  };

  triggerElement.addEventListener("click", toggleNav);
})();
