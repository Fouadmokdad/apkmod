import sql from "@/app/api/utils/sql";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    const allowedStatuses = ["pending", "approved", "rejected", "completed"];
    if (!allowedStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }
    const result = await sql(
      `UPDATE app_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id],
    );
    return Response.json({ request: result[0] });
  } catch (error) {
    return Response.json(
      { error: "Failed to update request" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql(`DELETE FROM app_requests WHERE id = $1`, [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete request" },
      { status: 500 },
    );
  }
}
