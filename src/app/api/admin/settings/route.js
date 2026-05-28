import sql from "@/app/api/utils/sql";
import { invalidateSettingsCache } from "@/app/api/utils/telegram";

export async function GET() {
  try {
    const settings = await sql`SELECT * FROM settings ORDER BY key ASC`;
    return Response.json({ settings });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { settings } = await request.json();

    for (const [key, value] of Object.entries(settings)) {
      await sql(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [key, value],
      );
    }

    // Bust the Telegram settings cache so next post uses fresh config
    invalidateSettingsCache();

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
