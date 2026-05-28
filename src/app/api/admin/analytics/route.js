import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [
      appStats,
      categoryStats,
      downloadStats,
      searchStats,
      recentDownloads,
      topApps,
      reviewStats,
      subscriberCount,
    ] = await sql.transaction([
      sql`SELECT COUNT(*) as total_apps, COUNT(*) FILTER (WHERE is_published=TRUE) as published, COUNT(*) FILTER (WHERE is_featured=TRUE) as featured FROM apps`,
      sql`SELECT c.name, COUNT(a.id) as count FROM categories c LEFT JOIN apps a ON a.category_id = c.id GROUP BY c.id, c.name ORDER BY count DESC`,
      sql`SELECT DATE(created_at) as date, COUNT(*) as count FROM download_logs WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY date`,
      sql`SELECT query, COUNT(*) as count FROM search_logs WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY query ORDER BY count DESC LIMIT 10`,
      sql`SELECT d.created_at, a.name as app_name, a.slug FROM download_logs d JOIN apps a ON d.app_id = a.id ORDER BY d.created_at DESC LIMIT 10`,
      sql`SELECT id, name, slug, download_count, rating, icon_url FROM apps WHERE is_published = TRUE ORDER BY download_count DESC LIMIT 10`,
      sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_approved=TRUE) as approved, COUNT(*) FILTER (WHERE is_approved=FALSE) as pending FROM reviews`,
      sql`SELECT COUNT(*) as count FROM newsletter_subscribers WHERE is_active = TRUE`,
    ]);

    const totalDownloads =
      await sql`SELECT SUM(download_count) as total FROM apps`;
    const unreadMessages =
      await sql`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = FALSE`;

    return Response.json({
      appStats: appStats[0],
      categoryStats,
      downloadStats,
      searchStats,
      recentDownloads,
      topApps,
      reviewStats: reviewStats[0],
      subscriberCount: subscriberCount[0].count,
      totalDownloads: totalDownloads[0].total || 0,
      unreadMessages: unreadMessages[0].count,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return Response.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
