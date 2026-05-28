import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { app_name, package_name, requester_email, note } =
      await request.json();
    if (!app_name)
      return Response.json({ error: "App name is required" }, { status: 400 });

    await sql(
      `INSERT INTO app_requests (app_name, package_name, requester_email, note) VALUES ($1,$2,$3,$4)`,
      [app_name, package_name, requester_email, note],
    );
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to submit request" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    let where = "WHERE 1=1";
    const values = [];
    if (status) {
      where += " AND status = $1";
      values.push(status);
    }

    const requests = await sql(
      `SELECT * FROM app_requests ${where} ORDER BY created_at DESC LIMIT 50`,
      values,
    );
    return Response.json({ requests });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
