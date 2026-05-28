import sql from "@/app/api/utils/sql";
import { sendTelegramPost } from "@/app/api/utils/telegram";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const values = [];
    let p = 1;

    if (status && status !== "all") {
      whereClause += ` AND tl.status = $${p++}`;
      values.push(status);
    }

    const logs = await sql(
      `SELECT tl.*, a.icon_url as app_icon
       FROM telegram_logs tl
       LEFT JOIN apps a ON tl.app_id = a.id
       ${whereClause}
       ORDER BY tl.created_at DESC
       LIMIT $${p} OFFSET $${p + 1}`,
      [...values, limit, offset],
    );

    const countResult = await sql(
      `SELECT COUNT(*) FROM telegram_logs tl ${whereClause}`,
      values,
    );

    const statsResult = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'posted') as posted,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'retrying') as retrying,
        COUNT(*) as total
      FROM telegram_logs
    `;

    return Response.json({
      logs,
      stats: statsResult[0],
      pagination: {
        page,
        limit,
        total: parseInt(countResult[0].count),
        totalPages: Math.ceil(parseInt(countResult[0].count) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/telegram/logs error:", error);
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");

    if (all === "true") {
      await sql`DELETE FROM telegram_logs WHERE status = 'failed'`;
      return Response.json({
        success: true,
        message: "All failed logs cleared",
      });
    }

    if (!id)
      return Response.json({ error: "Log ID required" }, { status: 400 });
    await sql`DELETE FROM telegram_logs WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to delete log" }, { status: 500 });
  }
}
