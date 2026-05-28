import sql from "@/app/api/utils/sql";
import { sendTelegramPost } from "@/app/api/utils/telegram";

// Manual post trigger — called from admin panel
export async function POST(request) {
  try {
    const { app_slug, app_id, force } = await request.json();

    let app;
    if (app_slug) {
      const rows = await sql`
        SELECT a.*, c.name as category_name, c.slug as category_slug
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.slug = ${app_slug}
        LIMIT 1
      `;
      app = rows[0];
    } else if (app_id) {
      const rows = await sql`
        SELECT a.*, c.name as category_name, c.slug as category_slug
        FROM apps a
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.id = ${app_id}
        LIMIT 1
      `;
      app = rows[0];
    }

    if (!app) return Response.json({ error: "App not found" }, { status: 404 });

    if (!app.is_published && !force) {
      return Response.json(
        { error: "Cannot post unpublished apps. Use force=true to override." },
        { status: 400 },
      );
    }

    const result = await sendTelegramPost(app, {
      force: force || false,
      triggeredBy: "manual",
    });

    if (result.skipped) {
      return Response.json({
        success: false,
        skipped: true,
        reason: result.reason,
      });
    }
    if (result.success) {
      return Response.json({
        success: true,
        logId: result.logId,
        messageId: result.messageId,
      });
    }
    return Response.json(
      { success: false, error: result.error, logId: result.logId },
      { status: 500 },
    );
  } catch (error) {
    console.error("Manual Telegram send error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
