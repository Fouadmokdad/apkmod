import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email)
      return Response.json({ error: "Email is required" }, { status: 400 });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return Response.json({ error: "Invalid email address" }, { status: 400 });

    const existing = await sql(
      `SELECT id FROM newsletter_subscribers WHERE email = $1`,
      [email],
    );
    if (existing.length) {
      if (existing[0].is_active)
        return Response.json({ message: "Already subscribed!" });
      await sql(
        `UPDATE newsletter_subscribers SET is_active = TRUE WHERE email = $1`,
        [email],
      );
      return Response.json({
        success: true,
        message: "Welcome back! You've been resubscribed.",
      });
    }

    await sql(`INSERT INTO newsletter_subscribers (email) VALUES ($1)`, [
      email,
    ]);
    return Response.json({
      success: true,
      message: "Successfully subscribed! You'll get the latest MOD APKs.",
    });
  } catch (error) {
    return Response.json({ error: "Subscription failed" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 50;
    const offset = (page - 1) * limit;
    const subscribers = await sql(
      `SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    const count = await sql(
      `SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = TRUE`,
    );
    return Response.json({ subscribers, total: parseInt(count[0].count) });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 },
    );
  }
}
