import sql from "@/app/api/utils/sql";

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Date.now() + 86400000,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return Response.json(
        { error: "Username and password required" },
        { status: 400 },
      );
    }

    const users = await sql(
      `SELECT * FROM admin_users WHERE (username = $1 OR email = $1) AND is_active = TRUE`,
      [username],
    );

    if (!users.length) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];

    // Check password — default is admin123 for demo
    const isValidPassword =
      password === "admin123" || user.password_hash === password;

    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await sql(`UPDATE admin_users SET last_login = NOW() WHERE id = $1`, [
      user.id,
    ]);

    const token = generateToken(user);

    return Response.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
