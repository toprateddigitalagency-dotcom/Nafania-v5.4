const TelegramBot = require('node-telegram-bot-api');
const token = '7629814043:AAEK_tA9lDRaMKKOQspcZj1a9URfC6eED60';
const adminId = 1379805039;

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  if (msg.from.id === adminId) {
    bot.sendMessage(adminId, "📡 Нафаня v5.4: Связь подтверждена. Система готова к масштабированию!");
  }
});

console.log("Оркестратор запущен успешно...");
