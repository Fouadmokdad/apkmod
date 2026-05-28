import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    const apps = await sql(
      `SELECT id, download_url FROM apps WHERE slug = $1 AND is_published = TRUE`,
      [slug],
    );
    if (!apps.length)
      return Response.json({ error: "App not found" }, { status: 404 });

    const app = apps[0];

    await sql(
      `UPDATE apps SET download_count = download_count + 1 WHERE id = $1`,
      [app.id],
    );
    await sql(
      `INSERT INTO download_logs (app_id, ip_address, user_agent) VALUES ($1,$2,$3)`,
      [app.id, ip, userAgent],
    );

    return Response.json({ download_url: app.download_url, success: true });
  } catch (error) {
    console.error("Download error:", error);
    return Response.json(
      { error: "Failed to process download" },
      { status: 500 },
    );
  }
}
