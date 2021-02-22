# Valheim's website, but improved

This is a re-creation of the original [valheimgame.com](https://www.valheimgame.com) website. All the assets, copy, and design belong to their respective owners.

## Why?

I love Valheim, and I've spent countless hours wandering the wilderness and petting boars. However, I noticed that Valheim's website performed very poorly, both on desktop and mobile. I decided to rebuild the website from scratch over a weekend to see how much I could improve it (and practice my [11ty](https://www.11ty.dev/) skills.)

Please note that I'm not trying to throw any shade at Iron Gate studios or their marketing team. Every team's situation is unique, and it's expensive to hire dedicated web developers, so sometimes a Squarespace website is the best solution. It's all about pragmatism!

## The problems

Here's a side-by-side comparison of Lighthouse audits:

| Original website                                                              | Improved website                                                         |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Lighthouse audit of the original website](/docs/valheim_audit_original.png) | ![Lighthouse audit of the improved website](/docs/valheim_audit_new.png) |

The biggest problems with the existing site are:

- the youtube video in the background is extremely slow to download. It is also hidden for a few seconds until the Youtube branding goes away.
- the images are very large. For example, one of the background images measures 3840x1728px and is 90% transparent, which is a waste of bandwidth.
- the screenshots aren't accessible to keyboard users, ie it's impossible to enlarge the images in the gallery without a mouse
- the "About", "Videos", and "Screenshots" links in the nav reload the page instead of scrolling down
- the embedded Youtube videos download a bunch of JavaScript that prevent the page from rendering

## The solutions

### Images

I built some tooling to size images properly and deliver them to the browser in the WebP or PNG formats.

For example, here's the HTML for the logo at the top of the home page:

```html
<picture>
  <source
    type="image/webp"
    srcset="
      /img/213a5062-512.webp   512w,
      /img/213a5062-720.webp   720w,
      /img/213a5062-1024.webp 1024w,
      /img/213a5062-1440.webp 1440w,
      /img/213a5062-2048.webp 2048w
    "
    sizes="100vw"
  />
  <source
    type="image/png"
    srcset="
      /img/213a5062-512.png   512w,
      /img/213a5062-720.png   720w,
      /img/213a5062-1024.png 1024w,
      /img/213a5062-1440.png 1440w,
      /img/213a5062-2048.png 2048w
    "
    sizes="100vw"
  />
  <img
    class="block w-full max-w-5xl mx-auto mb-8"
    src="/img/213a5062-512.png"
    alt=""
    loading="eager"
    decoding="async"
    width="512"
    height="225"
  />
</picture>
```

This does a few things:

- serves the right image size for each viewport. If you're viewing the site on a phone, you'll get the 512px or 720px image (depending on your resolution)
- serves images in the WebP format for browsers that support it, or falls back to PNG for browsers that don't
- the `loading="eager"` attribute tells the page that this is an important image and that it should be downloaded as fast as possible
- the `width` and `height` attributes are important: they help avoid [cumulative layout shift](https://web.dev/cls/)

For the images below the fold, I use the `loading="lazy"` attribute. This tells the browser that we don't need to download those images until they're within the viewport, thus saving a bunch of bandwidth.

### Video background

The video background at the top of the front page is very slow to load because:

- it requires a bunch of JavaScript
- it takes up a lot of bandwidth
- it must remain hidden until the video has started playing, otherwise visitors would see the Youtube branding

Instead of relying on Youtube, I decided to self-host the video. I also:

- reduced its duration to under 40 seconds
- removed the audio track to reduce bandwidth usage
- sized the video based on the visitor's device, just like images

The markup looks similar to a `<picture>` tag:

```html
<video
  id="hosted-video"
  autoplay=""
  muted=""
  loop=""
  class="h-full w-full object-cover"
  disablepictureinpicture=""
  width="1280"
  height="720"
>
  <source
    src="/images/videos/valheim_loop_540_short.mp4"
    type="video/mp4"
    media="all and (max-width: 540px)"
  />
  <source
    src="/images/videos/valheim_loop_720_short.mp4"
    type="video/mp4"
    media="all and (max-width: 720px)"
  />
  <source src="/images/videos/valheim_loop_1080_short.mp4" type="video/mp4" />
</video>
```

#### Mobile Firefox support

Some browsers do not allow videos to play automatically. Firefox's mobile browser, for example, requires a user interaction to being playing a video. As a result, the background video never appears on the original website. In the new site, I've opted to fall back to an image. This required a bit of JavaScript:

```js
// Autoplay the video (autoplay is disabled in mobile browsers)
const video = document.getElementById("hosted-video");

video.play().catch(() => {
  // If we get here, it's safe to assume to browser won't allow video playback.
  // Let's then hide the video...
  video.style.display = "none";

  // ... and display an image as a fallback
  const fallback = document.getElementById("hosted-video-fallback");
  fallback.classList.remove("hidden");
  fallback.classList.add("block");
});
```

### Accessibility

The original website uses divs for everything, which is awful for screen-readers (and SEO!) [Semantic HTML is important!](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

The new site uses semantic HTML such as the `<main>`, `<section>`, and `<footer>` elements. These help screen-readers understand the structure of the page.

Using `<a>` and `<button>` elements for interactions means that we get all the benefits that are baked into browsers, like the ability to use the Tab key to navigate around the page.

The `alt` attribute was missing from most images, so I fixed that as well and provided some helpful captions. Some images (like the logo) have an empty attribrute: `alt=""`. Those images are presentational and aren't crucial to understand what the page is about.

All iframes and links now have discernable names, which again improves the navigation for screen-reader users.

The lightbox (the UI that displays screenshots) can now be closed using the Escape key. It will also return focus to the screenshot that was clicked, which allows users to view screenshots using their keyboard.

### Search Engine Optimization

The original website does pretty well on that front. The only thing that was missing was a `description` meta tag, which I've added. This is used by search engines to summarize the content of a page.

### Best practices

Some of the images were delivered over `http` instead of `https`, which is a [potential security risk](https://web.dev/is-on-https/). Most browsers will also display a warning when they detect mixed content, which can reduce visitors' trust in a website.

The fonts used by the original website took around 750ms to download. There were a total 7 http requests to 2 fonts! I opted to self-host the fonts and to use the `display: swap` CSS property to avoid a [flash of missing text](https://css-tricks.com/fout-foit-foft/).

Youtube's embedded videos download and execute a ton of code, and web developers have little control over it. The page has 6 videos, which translates to 10 requests to Youtube's servers on page load. Instead of making users wait for that, I used [a trick by Arthur Corenzan](https://dev.to/haggen/lazy-load-embedded-youtube-videos-520g) to prevent loading videos until the visitor clicks on them. This improved the page load speed quite a bit!

## Other opportunities

I did this over a weekend so it's far from perfect. Here are some opportunities for further improvements:

- add some CSS transitions to the nav and lightbox
- fixed the contrast ratio issues: some of the text is difficult to read over some backgrounds
- the links in the navigation overflow over 2 lines at a certain width, which looks sloppy
