import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "DESC";
    const offset = (page - 1) * limit;

    let whereClause = "WHERE a.is_published = TRUE";
    const values = [];
    let paramCount = 1;

    if (category) {
      whereClause += ` AND c.slug = $${paramCount}`;
      values.push(category);
      paramCount++;
    }
    if (featured === "true") {
      whereClause += " AND a.is_featured = TRUE";
    }
    if (trending === "true") {
      whereClause += " AND a.is_trending = TRUE";
    }

    const allowedSorts = [
      "created_at",
      "download_count",
      "rating",
      "name",
      "updated_at",
    ];
    const safeSort = allowedSorts.includes(sort) ? sort : "created_at";
    const safeOrder = order === "ASC" ? "ASC" : "DESC";

    const apps = await sql(
      `SELECT a.id, a.name, a.slug, a.developer, a.version, a.mod_version, a.size, a.android_version,
              a.icon_url, a.rating, a.total_ratings, a.download_count, a.is_featured, a.is_trending,
              a.tags, a.created_at, a.updated_at, a.mod_features,
              c.name as category_name, c.slug as category_slug
       FROM apps a
       LEFT JOIN categories c ON a.category_id = c.id
       ${whereClause}
       ORDER BY a.${safeSort} ${safeOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      [...values, limit, offset],
    );

    const countResult = await sql(
      `SELECT COUNT(*) FROM apps a LEFT JOIN categories c ON a.category_id = c.id ${whereClause}`,
      values,
    );

    const total = parseInt(countResult[0].count);

    return Response.json({
      apps,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/apps error:", error);
    return Response.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      developer,
      category_id,
      version,
      mod_version,
      package_name,
      size,
      android_version,
      icon_url,
      screenshots,
      description,
      mod_features,
      installation_guide,
      changelog,
      download_url,
      download_mirrors,
      md5_checksum,
      is_featured,
      is_trending,
      tags,
      meta_title,
      meta_description,
    } = body;

    if (!name || !slug) {
      return Response.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const result = await sql(
      `INSERT INTO apps (name, slug, developer, category_id, version, mod_version, package_name,
        size, android_version, icon_url, screenshots, description, mod_features,
        installation_guide, changelog, download_url, download_mirrors, md5_checksum,
        is_featured, is_trending, tags, meta_title, meta_description, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,NOW())
       RETURNING *`,
      [
        name,
        slug,
        developer,
        category_id,
        version,
        mod_version,
        package_name,
        size,
        android_version,
        icon_url,
        screenshots || [],
        description,
        mod_features || [],
        installation_guide,
        changelog,
        download_url,
        download_mirrors || [],
        md5_checksum,
        is_featured || false,
        is_trending || false,
        tags || [],
        meta_title,
        meta_description,
      ],
    );

    if (category_id) {
      await sql(
        `UPDATE categories SET app_count = (SELECT COUNT(*) FROM apps WHERE category_id = $1 AND is_published = TRUE) WHERE id = $1`,
        [category_id],
      );
    }

    return Response.json({ app: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/apps error:", error);
    return Response.json({ error: "Failed to create app" }, { status: 500 });
  }
}
