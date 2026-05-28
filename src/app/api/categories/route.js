import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const categories = await sql(
      `SELECT c.*, COUNT(a.id) as actual_count
       FROM categories c
       LEFT JOIN apps a ON a.category_id = c.id AND a.is_published = TRUE
       GROUP BY c.id
       ORDER BY c.name ASC`,
    );
    return Response.json({ categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { name, slug, icon, description } = await request.json();
    if (!name || !slug)
      return Response.json(
        { error: "Name and slug required" },
        { status: 400 },
      );

    const result = await sql(
      `INSERT INTO categories (name, slug, icon, description) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, slug, icon, description],
    );
    return Response.json({ category: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
