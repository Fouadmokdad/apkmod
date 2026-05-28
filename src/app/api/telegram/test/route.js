import {
  callTelegramAPI,
  buildTelegramMessage,
  buildInlineKeyboard,
} from "@/app/api/utils/telegram";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { bot_token, chat_id } = await request.json();

    if (!bot_token || !chat_id) {
      return Response.json(
        { error: "Bot token and Chat ID are required" },
        { status: 400 },
      );
    }

    // First, verify the bot token by calling getMe
    const botInfo = await callTelegramAPI("getMe", {}, bot_token);
    if (!botInfo.data?.ok) {
      return Response.json({
        success: false,
        error: `Invalid bot token: ${botInfo.data?.description || "Bot not found"}`,
        stage: "bot_verification",
      });
    }

    const botName = botInfo.data.result.username;
    const botDisplayName = botInfo.data.result.first_name;

    // Build a real-looking test message
    const testApp = {
      id: 0,
      name: "Spotify Premium",
      slug: "spotify-premium",
      developer: "Spotify AB",
      mod_version: "8.9.12 MOD",
      version: "8.9.12",
      size: "34 MB",
      android_version: "6.0",
      icon_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png",
      mod_features: [
        "Premium Unlocked",
        "No Ads",
        "Offline Downloads",
        "Unlimited Skips",
      ],
      tags: ["music", "streaming", "premium"],
      category_name: "Music",
      changelog: null,
      download_mirrors: [],
    };

    const mockSettings = {
      site_url: "https://modapkstore.pro",
      telegram_include_mod_features: "true",
      telegram_include_version_info: "true",
      telegram_include_apk_size: "true",
      telegram_include_download_button: "true",
      telegram_include_changelog: "false",
      telegram_include_image: "true",
      telegram_default_hashtags: "#MODAPK #Test",
      telegram_silent_posts: "true", // silent test
    };

    const message =
      `🧪 <b>Test Connection — Mod Apk Store</b>\n\n` +
      `✅ Your Telegram integration is working!\n` +
      `🤖 Bot: <b>@${botName}</b> (${botDisplayName})\n\n` +
      buildTelegramMessage(testApp, mockSettings);

    const keyboard = buildInlineKeyboard(testApp, mockSettings);

    // Try sendPhoto first
    let result = await callTelegramAPI(
      "sendPhoto",
      {
        chat_id,
        photo: testApp.icon_url,
        caption: message,
        parse_mode: "HTML",
        disable_notification: true,
        ...(keyboard && { reply_markup: keyboard }),
      },
      bot_token,
    );

    // Fallback to sendMessage
    if (!result.data?.ok) {
      result = await callTelegramAPI(
        "sendMessage",
        {
          chat_id,
          text: message,
          parse_mode: "HTML",
          disable_notification: true,
          ...(keyboard && { reply_markup: keyboard }),
        },
        bot_token,
      );
    }

    if (result.data?.ok) {
      return Response.json({
        success: true,
        bot_name: botName,
        bot_display_name: botDisplayName,
        message_id: result.data.result?.message_id,
        chat_info: result.data.result?.chat,
        message: `✅ Connection successful! Test message sent via @${botName}`,
      });
    } else {
      return Response.json({
        success: false,
        error: result.data?.description || "Failed to send test message",
        error_code: result.data?.error_code,
        bot_name: botName,
        stage: "message_send",
        hint:
          result.data?.error_code === 400
            ? "Make sure the Chat ID is correct and starts with @ or - for groups/channels"
            : result.data?.error_code === 403
              ? "Bot needs to be added to the channel/group as Admin"
              : null,
      });
    }
  } catch (err) {
    console.error("Telegram test error:", err);
    return Response.json(
      {
        success: false,
        error: err.message || "Network error — check bot token format",
        stage: "network",
      },
      { status: 500 },
    );
  }
}
