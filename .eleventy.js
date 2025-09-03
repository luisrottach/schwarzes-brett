module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/static": "/"});
  eleventyConfig.addPassthroughCopy({"admin": "admin"});
  eleventyConfig.addFilter("isExpired", (d)=> d && new Date(d) < new Date());
  eleventyConfig.addCollection("activePosts", (c)=> c.getFilteredByGlob("src/posts/*.md")
    .filter(i => !i.data.expires || new Date(i.data.expires) >= new Date())
    .sort((a,b)=> (b.data.pinned?1:0)-(a.data.pinned?1:0) || b.date - a.date));
  return { dir:{ input:"src", includes:"_includes", layouts:"_includes/layouts" },
           markdownTemplateEngine:"njk", htmlTemplateEngine:"njk", dataTemplateEngine:"njk" };
};
