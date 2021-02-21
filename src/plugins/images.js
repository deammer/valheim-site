const Image = require("@11ty/eleventy-img");

/**
 * We use the eleventy-img plugin to create various sizes and formats. This
 * allows us to avoid delivering extremely large images on small screens.
 * https://www.11ty.dev/docs/plugins/image/#usage
 */

function getSourceRoot(src) {
  return "./src" + src;
}

function assignDefinedProps(target, source) {
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val !== undefined) {
      target[key] = val;
    }
  }
  return target;
}

async function generatePicture(src, options) {
  // Add defaults to the options
  options = assignDefinedProps(
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

  const sourceElements = Object.values(metadata).map((imageFormat) => {
    const srcSet = imageFormat.map((entry) => entry.srcset).join(", ");
    return `<source type="${imageFormat[0].sourceType}" srcset="${srcSet}" sizes="100vw">`;
  });

  return `<picture>
      ${sourceElements.join("\n")}
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

async function headerImageShortcode(src, alt, className = "") {
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
    widths: [768, 1024, 1440, 2048],
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
      const srcSet = imageFormat.map((entry) => entry.srcset).join(", ");
      return `<source type="${imageFormat[0].sourceType}" srcset="${srcSet}" sizes="100vw">`;
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
