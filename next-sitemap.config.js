// next-sitemap.config.js
module.exports = {
  siteUrl: process.env.SITE_URL || "",
  generateRobotsTxt: true, // (optional) Generate a robots.txt file
  exclude: ["/api/*", "/admin/*"],
  // You can also add additional configuration options here
};
