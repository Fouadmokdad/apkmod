import sql from "@/app/api/utils/sql";
import { sendTelegramPost } from "@/app/api/utils/telegram";

export async function POST(request, { params }) {
  const { id } = params;
  try {
    // Retry a failed post
    const rows = await sql`
      SELECT tl.*, a.name, a.slug, a.mod_version, a.version, a.size, a.android_version,
             a.icon_url, a.mod_features, a.tags, a.download_mirrors, a.changelog,
             c.name as category_name
      FROM telegram_logs tl
      LEFT JOIN apps a ON tl.app_id = a.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE tl.id = ${id}
    `;

    if (!rows.length)
      return Response.json({ error: "Log not found" }, { status: 404 });
    const log = rows[0];

    if (!log.app_id) {
      return Response.json(
        { error: "App no longer exists — cannot retry" },
        { status: 400 },
      );
    }

    // Reset this log entry
    await sql`
      UPDATE telegram_logs SET
        status = 'pending', retry_count = 0, error_message = NULL, updated_at = NOW()
      WHERE id = ${id}
    `;

    const app = {
      id: log.app_id,
      name: log.app_name,
      slug: log.app_slug,
      mod_version: log.mod_version,
      version: log.version,
      size: log.size,
      android_version: log.android_version,
      icon_url: log.icon_url,
      mod_features: log.mod_features,
      tags: log.tags,
      download_mirrors: log.download_mirrors,
      changelog: log.changelog,
      category_name: log.category_name,
    };

    // Delete the old log and send fresh (so sendTelegramPost creates a new one)
    await sql`DELETE FROM telegram_logs WHERE id = ${id}`;

    const result = await sendTelegramPost(app, {
      force: true,
      triggeredBy: "manual_retry",
    });

    return Response.json({
      success: result.success || result.skipped,
      ...result,
    });
  } catch (error) {
    console.error("Retry error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const rows = await sql`SELECT * FROM telegram_logs WHERE id = ${id}`;
    if (!rows.length)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ log: rows[0] });
  } catch (error) {
    return Response.json({ error: "Failed to fetch log" }, { status: 500 });
  }
}
