module.exports = function(eleventyConfig) {
  // Statische Dateien durchreichen
  eleventyConfig.addPassthroughCopy({"src/static": "/"});
  eleventyConfig.addPassthroughCopy({"admin": "admin"});

  // Kleiner Date-Filter für Nunjucks im 11ty-Stil: date("%d.%m.%Y")
  const pad = n => String(n).padStart(2, "0");
  eleventyConfig.addFilter("date", (value, fmt = "%d.%m.%Y") => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d)) return "";
    const map = {
      "%d": pad(d.getDate()),
      "%m": pad(d.getMonth() + 1),
      "%Y": d.getFullYear(),
      "%H": pad(d.getHours()),
      "%M": pad(d.getMinutes()),
    };
    return fmt.replace(/%[dmYHM]/g, m => map[m] ?? m);
  });

  // Hilfsfilter: abgelaufen?
  eleventyConfig.addFilter("isExpired", (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  });

  // Sammlung: aktive Posts (angepinnt zuerst, dann neueste)
  eleventyConfig.addCollection("activePosts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter(item => {
        const exp = item.data.expires;
        return !exp || new Date(exp) >= new Date();
      })
      .sort((a,b) => {
        const ap = a.data.pinned ? 1 : 0;
        const bp = b.data.pinned ? 1 : 0;
        if (ap !== bp) return bp - ap;      // Pinned zuerst
        return b.date - a.date;             // Neueste zuerst
      });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
