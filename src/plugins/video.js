function videoEmbedShortcode(id, title, hiDef = true) {
  const posterImage = `https://img.youtube.com/vi/${id}/${
    hiDef ? "maxresdefault" : "hqdefault"
  }.jpg`;

  return `
  <iframe
    loading="lazy"
    width="560"
    height="315"
    src="https://www.youtube-nocookie.com/embed/${id}"
    srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${id}?autoplay=1><img src=${posterImage} alt='${title}' loading='lazy'><span>&#x25BA;</span></a>"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    title="${title}"></iframe>
`;
}

module.exports = {
  videoEmbedShortcode,
};
