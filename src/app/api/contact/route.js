import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }
    await sql(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4)`,
      [name, email, subject || "General Inquiry", message],
    );
    return Response.json({
      success: true,
      message: "Your message has been received. We'll reply within 24 hours.",
    });
  } catch (error) {
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const offset = (page - 1) * limit;
    const messages = await sql(
      `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    const count = await sql(`SELECT COUNT(*) FROM contact_messages`);
    return Response.json({ messages, total: parseInt(count[0].count) });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
