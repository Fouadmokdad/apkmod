import sql from "@/app/api/utils/sql";

export default async function sitemap() {
  const baseUrl = "https://modapkstore.pro";

  // Static pages
  const staticPages = [
    "",
    "/top-downloads",
    "/latest",
    "/search",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
    "/dmca",
    "/disclaimer",
    "/faq",
    "/submit-app",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  // Apps
  let appPages = [];
  try {
    const apps =
      await sql`SELECT slug, updated_at FROM apps WHERE is_published = TRUE`;
    appPages = apps.map((app) => ({
      url: `${baseUrl}/app/${app.slug}`,
      lastModified: app.updated_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch {}

  // Categories
  let categoryPages = [];
  try {
    const cats = await sql`SELECT slug FROM categories`;
    categoryPages = cats.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch {}

  return [...staticPages, ...appPages, ...categoryPages];
}
