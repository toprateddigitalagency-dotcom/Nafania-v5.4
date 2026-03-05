const TelegramBot = require('node-telegram-bot-api');

// Конфигурация системы Нафаня v5.4
const token = '7629814043:AAEK_tA9lDRaMKKOQspcZj1a9URfC6eED60';
const adminId = 1379805039;

const bot = new TelegramBot(token, {polling: true});

// Инициализация веток
const branches = {
  core: "⬡ AI-Core: Система стабильна. Связь с GitHub установлена.",
  finance: "💰 AI-Finance: Модуль прибыли готов к транзакциям.",
  media: "◉ AI-Media: Контент-план для соцсетей сформирован."
};

// Приветствие
bot.onText(/\/start/, (msg) => {
  if (msg.from.id === adminId) {
    bot.sendMessage(adminId, `Приветствую, Алексей! \n\nСистема Нафаня v5.4 развернута.\n\n${branches.core}\n${branches.finance}\n${branches.media}\n\nОжидаю команды для наполнения магазина.`);
  }
});

console.log("Оркестратор Нафаня запущен...");
