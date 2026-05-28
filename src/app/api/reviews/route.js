import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get("app_id");
    const approved = searchParams.get("approved");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    let where = "WHERE 1=1";
    const values = [];
    let p = 1;
    if (appId) {
      where += ` AND app_id = $${p++}`;
      values.push(appId);
    }
    if (approved !== null && approved !== undefined) {
      where += ` AND is_approved = $${p++}`;
      values.push(approved === "true");
    }

    const reviews = await sql(
      `SELECT r.*, a.name as app_name, a.slug as app_slug FROM reviews r
       LEFT JOIN apps a ON r.app_id = a.id
       ${where} ORDER BY r.created_at DESC LIMIT $${p} OFFSET $${p + 1}`,
      [...values, limit, offset],
    );
    const countResult = await sql(
      `SELECT COUNT(*) FROM reviews r ${where}`,
      values,
    );
    return Response.json({
      reviews,
      total: parseInt(countResult[0].count),
      page,
      limit,
    });
  } catch (error) {
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { app_id, user_name, user_email, rating, comment } =
      await request.json();
    if (!app_id || !user_name || !rating || !comment) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (rating < 1 || rating > 5)
      return Response.json({ error: "Rating must be 1-5" }, { status: 400 });

    const result = await sql(
      `INSERT INTO reviews (app_id, user_name, user_email, rating, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [app_id, user_name, user_email, rating, comment],
    );

    const ratingStats = await sql(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE app_id = $1 AND is_approved = TRUE`,
      [app_id],
    );
    if (ratingStats[0]) {
      await sql(
        `UPDATE apps SET rating = $1, total_ratings = $2 WHERE id = $3`,
        [
          parseFloat(ratingStats[0].avg_rating || 0).toFixed(2),
          ratingStats[0].total,
          app_id,
        ],
      );
    }

    return Response.json(
      { review: result[0], message: "Review submitted for approval" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, is_approved, admin_reply } = await request.json();
    const result = await sql(
      `UPDATE reviews SET is_approved = COALESCE($1, is_approved), admin_reply = COALESCE($2, admin_reply) WHERE id = $3 RETURNING *`,
      [is_approved, admin_reply, id],
    );
    return Response.json({ review: result[0] });
  } catch (error) {
    return Response.json({ error: "Failed to update review" }, { status: 500 });
  }
}
