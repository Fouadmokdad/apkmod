import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "download_count";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    if (!q.trim()) {
      return Response.json({
        apps: [],
        pagination: { total: 0, page, limit, totalPages: 0 },
        query: q,
      });
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    let whereClause = `WHERE a.is_published = TRUE AND (
      LOWER(a.name) LIKE LOWER($1)
      OR LOWER(a.developer) LIKE LOWER($1)
      OR LOWER(a.description) LIKE LOWER($1)
      OR $2 = ANY(a.tags)
    )`;
    const values = [`%${q}%`, q.toLowerCase()];
    let paramCount = 3;

    if (category) {
      whereClause += ` AND c.slug = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    const allowedSorts = ["download_count", "rating", "created_at", "name"];
    const safeSort = allowedSorts.includes(sort) ? sort : "download_count";

    const apps = await sql(
      `SELECT a.id, a.name, a.slug, a.developer, a.icon_url, a.version, a.mod_version,
              a.size, a.android_version, a.rating, a.download_count, a.tags, a.created_at,
              c.name as category_name, c.slug as category_slug
       FROM apps a LEFT JOIN categories c ON a.category_id = c.id
       ${whereClause}
       ORDER BY a.${safeSort} DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset],
    );

    const countResult = await sql(
      `SELECT COUNT(*) FROM apps a LEFT JOIN categories c ON a.category_id = c.id ${whereClause}`,
      values,
    );
    const total = parseInt(countResult[0].count);

    await sql(
      `INSERT INTO search_logs (query, results_count, ip_address) VALUES ($1,$2,$3)`,
      [q, total, ip],
    );

    return Response.json({
      apps,
      query: q,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
