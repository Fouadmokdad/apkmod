/**
 * Telegram Bot API Service
 * Core service for sending professional MOD APK posts to Telegram
 */

import sql from "@/app/api/utils/sql";

// ─── Settings cache ────────────────────────────────────────────────────────
let settingsCache = null;
let settingsCacheAt = 0;
const CACHE_TTL = 30_000; // 30s

export async function getTelegramSettings() {
  const now = Date.now();
  if (settingsCache && now - settingsCacheAt < CACHE_TTL) return settingsCache;

  const rows = await sql`
    SELECT key, value FROM settings
    WHERE key LIKE 'telegram_%' OR key = 'site_url' OR key = 'site_name'
  `;
  const map = {};
  for (const row of rows) map[row.key] = row.value;

  settingsCache = map;
  settingsCacheAt = now;
  return map;
}

export function invalidateSettingsCache() {
  settingsCache = null;
  settingsCacheAt = 0;
}

// ─── Hashtag Generator ────────────────────────────────────────────────────
export function generateHashtags(app, defaultHashtags = "") {
  const tags = new Set();

  // App name → camelCase hashtag
  if (app.name) {
    const clean = app.name
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(" ")
      .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join("");
    if (clean) tags.add(`#${clean}`);
  }

  // Category
  if (app.category_name) {
    const cat = app.category_name.replace(/[^a-zA-Z0-9]/g, "");
    if (cat) tags.add(`#${cat}`);
  }

  // App tags array
  if (Array.isArray(app.tags)) {
    for (const t of app.tags) {
      const clean = t.replace(/[^a-zA-Z0-9]/g, "");
      if (clean) tags.add(`#${clean}`);
    }
  }

  // Always include
  tags.add("#MODAPK");
  tags.add("#AndroidApps");
  tags.add("#FreeDownload");

  // Merge with admin defaults
  if (defaultHashtags) {
    for (const ht of defaultHashtags.split(/\s+/)) {
      if (ht.startsWith("#")) tags.add(ht);
    }
  }

  return [...tags].slice(0, 8).join(" ");
}

// ─── Message Template ─────────────────────────────────────────────────────
export function buildTelegramMessage(app, settings) {
  const lines = [];

  const appName = (app.name || "Unknown App").replace(
    /[<>&"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c],
  );
  const siteUrl = settings.site_url || "https://modapkstore.pro";
  const appUrl = `${siteUrl}/app/${app.slug}`;

  // ── Header ──
  lines.push(`🔥 <b>${appName} MOD APK</b>`);
  if (app.mod_version) lines.push(`📦 <b>Version:</b> ${app.mod_version}`);
  lines.push("");

  // ── MOD Features ──
  if (
    settings.telegram_include_mod_features !== "false" &&
    Array.isArray(app.mod_features) &&
    app.mod_features.length
  ) {
    const featureEmojis = [
      "✨",
      "🚫",
      "🎯",
      "⚡",
      "🔓",
      "💎",
      "🌐",
      "🎵",
      "📥",
      "🔥",
    ];
    for (let i = 0; i < Math.min(app.mod_features.length, 6); i++) {
      const feat = (app.mod_features[i] || "").replace(
        /[<>&"]/g,
        (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c],
      );
      lines.push(`${featureEmojis[i % featureEmojis.length]} ${feat}`);
    }
    lines.push("");
  }

  // ── Version Info ──
  if (settings.telegram_include_version_info !== "false") {
    const infoLines = [];
    if (app.mod_version || app.version)
      infoLines.push(`📌 <b>Version:</b> ${app.mod_version || app.version}`);
    if (settings.telegram_include_apk_size !== "false" && app.size)
      infoLines.push(`📦 <b>Size:</b> ${app.size}`);
    if (app.android_version)
      infoLines.push(`📱 <b>Android:</b> ${app.android_version}+`);
    if (infoLines.length) {
      lines.push(...infoLines);
      lines.push("");
    }
  }

  // ── Changelog ──
  if (settings.telegram_include_changelog === "true" && app.changelog) {
    const changelogLines = app.changelog.split("\n").slice(0, 4);
    lines.push("🆕 <b>Changelog:</b>");
    for (const cl of changelogLines) {
      const clean = cl
        .trim()
        .replace(
          /[<>&"]/g,
          (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c],
        );
      if (clean) lines.push(`  ${clean}`);
    }
    lines.push("");
  }

  // ── Download link (text fallback) ──
  lines.push(`🌐 <a href="${appUrl}">View &amp; Download on Mod Apk Store</a>`);
  lines.push("");

  // ── Hashtags ──
  const hashtags = generateHashtags(app, settings.telegram_default_hashtags);
  if (hashtags) lines.push(hashtags);

  return lines.join("\n");
}

// ─── Inline Keyboard ──────────────────────────────────────────────────────
export function buildInlineKeyboard(app, settings) {
  const siteUrl = settings.site_url || "https://modapkstore.pro";
  const appUrl = `${siteUrl}/app/${app.slug}`;

  const buttons = [];

  if (settings.telegram_include_download_button !== "false") {
    const row = [
      { text: "⬇️ Download APK", url: appUrl },
      { text: "🌐 Website", url: siteUrl },
    ];
    if (app.download_mirrors?.[0]) {
      row.push({ text: "🔄 Mirror", url: app.download_mirrors[0] });
    }
    buttons.push(row);
  }

  return buttons.length ? { inline_keyboard: buttons } : null;
}

// ─── Core Telegram API Caller ─────────────────────────────────────────────
export async function callTelegramAPI(method, payload, botToken) {
  const url = `https://api.telegram.org/bot${botToken}/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return { ok: res.ok, status: res.status, data: json };
}

// ─── Send App Post ────────────────────────────────────────────────────────
export async function sendTelegramPost(app, optionsOverride = {}) {
  const settings = await getTelegramSettings();

  // Guard: enabled?
  if (settings.telegram_enabled !== "true" && !optionsOverride.force) {
    return { skipped: true, reason: "Telegram posting is disabled" };
  }

  const botToken = settings.telegram_bot_token;
  const chatId = settings.telegram_chat_id;

  if (!botToken || !chatId) {
    return { skipped: true, reason: "Bot token or Chat ID not configured" };
  }

  const message = buildTelegramMessage(app, settings);
  const keyboard = buildInlineKeyboard(app, settings);
  const isSilent = settings.telegram_silent_posts === "true";
  const shouldPin = settings.telegram_pin_posts === "true";

  // Create pending log
  const logRow = await sql`
    INSERT INTO telegram_logs
      (app_id, app_name, app_slug, app_version, status, telegram_chat_id, payload, triggered_by)
    VALUES
      (${app.id}, ${app.name}, ${app.slug}, ${app.mod_version || app.version},
       'pending', ${chatId}, ${message}, ${optionsOverride.triggeredBy || "auto"})
    RETURNING id
  `;
  const logId = logRow[0].id;

  // ── Attempt with retry ──
  let lastError = null;
  let result = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const useImage =
        settings.telegram_include_image !== "false" && app.icon_url;

      if (useImage) {
        // sendPhoto with caption
        const payload = {
          chat_id: chatId,
          photo: app.icon_url,
          caption: message,
          parse_mode: "HTML",
          disable_notification: isSilent,
          ...(keyboard && { reply_markup: keyboard }),
        };
        result = await callTelegramAPI("sendPhoto", payload, botToken);
      }

      // Fallback to sendMessage if sendPhoto failed or no image
      if (!useImage || !result?.data?.ok) {
        const payload = {
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: false,
          disable_notification: isSilent,
          ...(keyboard && { reply_markup: keyboard }),
        };
        result = await callTelegramAPI("sendMessage", payload, botToken);
      }

      if (result?.data?.ok) {
        const msgId = result.data?.result?.message_id;

        // Pin the post if configured
        if (shouldPin && msgId) {
          await callTelegramAPI(
            "pinChatMessage",
            {
              chat_id: chatId,
              message_id: msgId,
              disable_notification: true,
            },
            botToken,
          );
        }

        // Update log → posted
        await sql`
          UPDATE telegram_logs SET
            status = 'posted',
            telegram_message_id = ${msgId || null},
            response_data = ${JSON.stringify(result.data)},
            retry_count = ${attempt},
            posted_at = NOW(),
            updated_at = NOW()
          WHERE id = ${logId}
        `;

        return { success: true, logId, messageId: msgId, attempt };
      }

      lastError = result?.data?.description || "Unknown Telegram error";
    } catch (err) {
      lastError = err.message || "Network error";
    }

    // Wait before retry (exponential backoff)
    if (attempt < 2)
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));

    // Update retry count
    await sql`
      UPDATE telegram_logs SET
        status = 'retrying', retry_count = ${attempt + 1}, updated_at = NOW()
      WHERE id = ${logId}
    `;
  }

  // All attempts failed
  await sql`
    UPDATE telegram_logs SET
      status = 'failed',
      error_message = ${lastError},
      response_data = ${result ? JSON.stringify(result.data) : null},
      updated_at = NOW()
    WHERE id = ${logId}
  `;

  return { success: false, logId, error: lastError };
}
