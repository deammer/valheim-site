const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");

module.exports = function (eleventyConfig) {
  // Customize the Markdown rendering
  const markdownRenderer = markdownIt({
    html: true,
  });

  // Add attributes to external links
  markdownRenderer.use(markdownItLinkAttributes, {
    pattern: /^https?:/,
    attrs: {
      target: "_blank",
      rel: "noopener",
    },
  });

  eleventyConfig.setLibrary("md", markdownRenderer);

  // Add our custom shortcodes, filters, and such
  eleventyConfig.addNunjucksAsyncShortcode(
    "headerImage",
    require("./src/plugins/images").headerImageShortcode
  );

  eleventyConfig.addNunjucksAsyncShortcode(
    "logo",
    require("./src/plugins/images").logoShortcode
  );

  eleventyConfig.addNunjucksAsyncShortcode(
    "screenshot",
    require("./src/plugins/images").screenshotShortcode
  );

  eleventyConfig.addNunjucksAsyncShortcode(
    "srcSet",
    require("./src/plugins/images").srcSetShortcode
  );

  // Tell 11ty where to look for files
  eleventyConfig.dir = { input: "src", output: "_site" };
  eleventyConfig.templateFormats = [
    "html",
    "njk",
    "jpg",
    "jpeg",
    "png",
    "mp4",
    "md",
  ];

  return eleventyConfig;
};
