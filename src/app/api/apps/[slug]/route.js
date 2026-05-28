import sql from "@/app/api/utils/sql";
import { sendTelegramPost } from "@/app/api/utils/telegram";

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const apps = await sql(
      `SELECT a.*, c.name as category_name, c.slug as category_slug
       FROM apps a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = $1 AND a.is_published = TRUE`,
      [slug],
    );

    if (!apps.length) {
      return Response.json({ error: "App not found" }, { status: 404 });
    }

    const reviews = await sql(
      `SELECT * FROM reviews WHERE app_id = $1 AND is_approved = TRUE ORDER BY created_at DESC LIMIT 10`,
      [apps[0].id],
    );

    const related = await sql(
      `SELECT id, name, slug, icon_url, rating, download_count, mod_version, size
       FROM apps WHERE category_id = $1 AND slug != $2 AND is_published = TRUE
       ORDER BY download_count DESC LIMIT 6`,
      [apps[0].category_id, slug],
    );

    return Response.json({ app: apps[0], reviews, related });
  } catch (error) {
    console.error("GET /api/apps/[slug] error:", error);
    return Response.json({ error: "Failed to fetch app" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();

    // Capture old publish status for Telegram trigger
    const oldRows = await sql(`SELECT is_published FROM apps WHERE slug = $1`, [
      slug,
    ]);
    const wasPublished = oldRows[0]?.is_published;

    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      "name",
      "developer",
      "category_id",
      "version",
      "mod_version",
      "package_name",
      "size",
      "android_version",
      "icon_url",
      "screenshots",
      "description",
      "mod_features",
      "installation_guide",
      "changelog",
      "download_url",
      "download_mirrors",
      "md5_checksum",
      "is_featured",
      "is_trending",
      "is_published",
      "tags",
      "meta_title",
      "meta_description",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(body[field]);
        paramCount++;
      }
    }

    fields.push(`updated_at = NOW()`);
    values.push(slug);

    const result = await sql(
      `UPDATE apps SET ${fields.join(", ")} WHERE slug = $${paramCount} RETURNING *`,
      values,
    );

    if (!result.length) {
      return Response.json({ error: "App not found" }, { status: 404 });
    }

    const updatedApp = result[0];

    // ── Telegram Auto-Post Trigger ──
    // Fire when: app just got published (was draft → now published)
    const justPublished = body.is_published === true && wasPublished === false;
    if (justPublished) {
      // Fetch full app with category for rich Telegram message
      const fullRows = await sql(
        `
        SELECT a.*, c.name as category_name, c.slug as category_slug
        FROM apps a LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.slug = $1`,
        [slug],
      );

      if (fullRows.length) {
        // Fire async — don't block the response
        sendTelegramPost(fullRows[0], { triggeredBy: "publish" }).catch((err) =>
          console.error("[Telegram] Auto-post failed silently:", err),
        );
      }
    }

    return Response.json({ app: updatedApp });
  } catch (error) {
    console.error("PUT /api/apps/[slug] error:", error);
    return Response.json({ error: "Failed to update app" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    await sql(`DELETE FROM apps WHERE slug = $1`, [slug]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/apps/[slug] error:", error);
    return Response.json({ error: "Failed to delete app" }, { status: 500 });
  }
}
