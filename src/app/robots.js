export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://modapkstore.pro/sitemap.xml",
    host: "https://modapkstore.pro",
  };
}
