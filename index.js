import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// ربات تلگرام
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// گوگل Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 📌 دکمه‌ها
const mainMenu = {
  reply_markup: {
    keyboard: [
      [{ text: "📞 شماره تماس" }, { text: "📍 آدرس مغازه" }],
      [{ text: "🕒 ساعات کاری" }, { text: "📡 لوکیشن" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

// 📌 وقتی کاربر /start رو بزنه
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "به فروشگاه *سلتاک* خوش آمدید 🙌\n\nخدمات تخصصی نرم‌افزاری و سخت‌افزاری انواع موبایل و کامپیوتر",
    { parse_mode: "Markdown", ...mainMenu }
  );
});

// 📌 پاسخ به دکمه‌ها
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "📞 شماره تماس") {
    bot.sendMessage(chatId, "📞 09192220860");
  } else if (text === "📍 آدرس مغازه") {
    bot.sendMessage(
      chatId,
      "🏪 *فروشگاه سلتاک*\nخدمات تخصصی نرم افزاری و سخت افزاری انواع موبایل و کامپیوتر\n\n📍 اتوبان ارتش - شهرک شهید محلاتی - میدان شاهد - خ مروارید - پاساژ مروارید - طبقه اول پلاک 119",
      { parse_mode: "Markdown" }
    );
  } else if (text === "🕒 ساعات کاری") {
    bot.sendMessage(
      chatId,
      "🕒 ساعات کاری:\nهر روز ۱۰:۳۰ تا ۱۴:۰۰\n۱۶:۰۰ تا ۲۰:۰۰\n❌ تعطیل: جمعه‌ها و روزهای تعطیل رسمی"
    );
  } else if (text === "📡 لوکیشن") {
    // 📌 لوکیشن مختصات فروشگاه سلتاک
    bot.sendLocation(chatId, 35.80003275631633, 51.50658302364511); // اینجا مختصات پاساژ مروارید شهرک شهید محلاتی
  } else if (!text.startsWith("/")) {
    // اگر متن معمولی بود، بفرست به Gemini
    try {
      const result = await model.generateContent(text);
      const reply = result.response.text();
      await bot.sendMessage(chatId, reply);
    } catch (error) {
      console.error("خطا:", error);
      await bot.sendMessage(chatId, "❌ مشکلی پیش اومد. بعداً دوباره امتحان کن.");
    }
  }
});
