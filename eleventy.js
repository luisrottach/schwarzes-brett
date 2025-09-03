
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/static": "/"});
  eleventyConfig.addPassthroughCopy({"admin": "admin"});

  eleventyConfig.addFilter("isExpired", function(dateStr) {
    if (!dateStr) return false;
    const now = new Date();
    const d = new Date(dateStr);
    return d < now;
  });

  eleventyConfig.addCollection("activePosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").filter(item => {
      const exp = item.data.expires;
      if (!exp) return true;
      return new Date(exp) >= new Date();
    }).sort((a, b) => {
      // pinned first
      const ap = a.data.pinned ? 1 : 0;
      const bp = b.data.pinned ? 1 : 0;
      if (ap !== bp) return bp - ap;
      // newest first
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
