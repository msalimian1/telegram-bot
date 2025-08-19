import os
from dotenv import load_dotenv
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

# بارگذاری کلیدها از فایل .env
load_dotenv()
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# دستور start
def start(update, context):
    update.message.reply_text("سلام 👋 من ربات تلگرام هستم و به Google API وصل می‌شم!")

# تست گرفتن گوگل API Key
def test_google(update, context):
    if GOOGLE_API_KEY:
        update.message.reply_text(f"✅ Google API Key شناسایی شد: {GOOGLE_API_KEY[:6]}******")
    else:
        update.message.reply_text("❌ Google API Key تنظیم نشده.")

# اکو کردن متن
def echo(update, context):
    update.message.reply_text(update.message.text)

def main():
    if not TELEGRAM_TOKEN:
        print("❌ TELEGRAM_BOT_TOKEN در فایل .env تعریف نشده")
        return

    updater = Updater(TELEGRAM_TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("google", test_google))
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))

    updater.start_polling()
    updater.idle()

if __name__ == "__main__":
    main()
