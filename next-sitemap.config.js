/** @type {import('next-sitemap').IConfig} */

const RAW_SITE_URL = process.env.SITE_URL || "https://commongermanwords.com";

// A protocol-less SITE_URL produces sitemap/robots entries search engines reject
const SITE_URL = /^https?:\/\//.test(RAW_SITE_URL)
  ? RAW_SITE_URL
  : `https://${RAW_SITE_URL}`;

// Signed-in / personal pages: keep them out of the index entirely.
const PRIVATE_PATHS = [
  "/profile",
  "/progress",
  "/signin",
  "/sign-in-complete",
  "/word-lists/*",
];

// Noindexed but still crawlable — keep it out of the sitemap only.
const SITEMAP_EXCLUDE = [...PRIVATE_PATHS, "/learn/cards"];

// Content pages that should rank highest.
const HIGH_PRIORITY = /^\/(browse|top-100-words|top-500-words)?$/;

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: SITEMAP_EXCLUDE,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === "/" ? "daily" : config.changefreq,
    priority: HIGH_PRIORITY.test(path) ? 1.0 : config.priority,
    lastmod: new Date().toISOString(),
  }),
};
