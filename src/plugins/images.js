const Image = require("@11ty/eleventy-img");

/**
 * We use the eleventy-img plugin to create various sizes and formats. This
 * allows us to avoid delivering extremely large images on small screens.
 * https://www.11ty.dev/docs/plugins/image/#usage
 */

function getSourceRoot(src) {
  return "./src" + src;
}

async function generatePicture(src, options) {
  // Add defaults to the options
  options = Object.assign(
    {
      className: "",
      sizes: "100vw",
      loading: "lazy",
    },
    options
  );

  if (options.alt == null) {
    throw new Error(`Missing "alt" attribute on image from: ${src}`);
  }

  if (options.widths == null) {
    throw new Error(`Mssing "widths" array in generatePicture()`);
  }

  let metadata = await Image(src, {
    outputDir: "./_site/img/",
    widths: options.widths, // `null` means original resolution
    formats: ["webp", "png"],
  });

  let lowsrc = metadata.png[0];

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `<source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .map((entry) => entry.srcset)
          .join(", ")} sizes="100vw">`;
      })
      .join("\n")}
      <img
        class="${options.className}"
        height="${lowsrc.height}"
        width="${lowsrc.width}"
        src="${lowsrc.url}"
        alt="${options.alt}"
        loading=${options.loading}
        decoding="async">
    </picture>`;
}

async function screenshotShortcode(src, alt, className) {
  return await generatePicture(src, {
    alt,
    widths: [310, 620],
    className,
  });
}

async function headerImageShortcode(src, alt, className) {
  return await generatePicture(src, {
    alt,
    widths: [512, 1024, 2048],
    className,
    loading: "eager",
  });
}

async function logoShortcode(src, alt) {
  return await generatePicture(src, {
    widths: [110, 220],
    alt,
    loading: "eager",
  });
}

async function fullScreenImageShortcode(src) {
  return await generatePicture(src, {
    widths: [768, 1024, 1440, 2560, null],
    alt: "",
  });
}

async function srcSetShortcode(src, widths) {
  let metadata = await Image(getSourceRoot(src), {
    outputDir: "./_site/img/",
    widths: widths,
    formats: ["webp", "png"],
  });

  return Object.values(metadata)
    .map((imageFormat) => {
      return `<source type="${
        imageFormat[0].sourceType
      }" srcset="${imageFormat
        .map((entry) => entry.srcset)
        .join(", ")} sizes="100vw">`;
    })
    .join("\n");
}

module.exports = {
  headerImageShortcode,
  logoShortcode,
  screenshotShortcode,
  fullScreenImageShortcode,
  srcSetShortcode,
};
