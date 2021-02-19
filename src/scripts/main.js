(function () {
  // Load the Youtube iframe API
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";

  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  /**
   * Create an iframe in which we embed the video
   */
  var player;
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("background-video", {
      height: "360",
      width: "640",
      videoId: "UESAjCkj9BY",
      events: {
        onReady: onPlayerReady,
      },
      playerVars: {
        autoplay: 1, // Play the video when it loads
        controls: 0, // Hide the player controls
        modestbranding: 1, // Reduce the branding as much as possible
        disablekb: 1, // Disable keyboard controls
        loop: 1, // Loop the video
        playlist: "UESAjCkj9BY", // In order to loop, we must provide the video ID here
      },
    });
  };

  /**
   * Callback when the video player is ready to go
   */
  function onPlayerReady(event) {
    // event.target.playVideo();
    event.target.setVolume(0);

    setTimeout(function () {
      // Youtube doesn't allow us to hide their branding, so instead we hide the
      // video until their branding goes away
      document.getElementById("background-video").style.opacity = 1;
    }, 4000);
  }
})();
