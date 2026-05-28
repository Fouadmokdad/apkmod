import sql from "@/app/api/utils/sql";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    await sql(`UPDATE contact_messages SET is_read = TRUE WHERE id = $1`, [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to update message" },
      { status: 500 },
    );
  }
}
