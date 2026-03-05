const TelegramBot = require('node-telegram-bot-api');

// КОНФИГУРАЦИЯ СИСТЕМЫ
const TOKEN = '7629814043:AAHrljzdtBl-vFCEvzp--jZ21JORicHH6PI';
const ADMIN_ID = 1379805039;

const bot = new TelegramBot(TOKEN, { polling: true });

// Имитация состояния веток системы
const systemStatus = {
    core: "🟢 Active",
    finance: "🟡 Standby (Waiting for API)",
    media: "🟡 Standby (Waiting for Content)",
    ads: "🟡 Standby (Waiting for Budget)"
};

// Главное меню
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            ['📊 Статус Системы', '💰 AI-Finance'],
            ['📢 AI-Media', '🚀 Запустить Трафик']
        ],
        resize_keyboard: true
    }
};

// Обработка команд
bot.onText(/\/start/, (msg) => {
    if (msg.from.id === ADMIN_ID) {
        bot.sendMessage(ADMIN_ID, 
            `🛰 **Нафаня v5.4: Оркестратор запущен**\n\nПриветствую, Алексей. Система развернута на внешнем узле и готова к работе.\n\nИспользуй меню ниже для управления ветками.`, 
            { parse_mode: 'Markdown', ...mainKeyboard }
        );
    } else {
        bot.sendMessage(msg.chat.id, "Доступ запрещен. Требуется авторизация владельца.");
    }
});

bot.on('message', (msg) => {
    const text = msg.text;
    if (msg.from.id !== ADMIN_ID) return;

    if (text === '📊 Статус Системы') {
        const statusReport = `📋 **ОТЧЕТ ОРКЕСТРАТОРА:**\n\n` +
            `⬡ AI-Core: ${systemStatus.core}\n` +
            `💰 AI-Finance: ${systemStatus.finance}\n` +
            `◉ AI-Media: ${systemStatus.media}\n` +
            `◆ AI-Ads: ${systemStatus.ads}\n\n` +
            `📍 Узел: Render Cloud (Free)`;
        bot.sendMessage(ADMIN_ID, statusReport, { parse_mode: 'Markdown' });
    }

    if (text === '💰 AI-Finance') {
        bot.sendMessage(ADMIN_ID, "💵 **Ветка AI-Finance:**\nТекущая прибыль: 0.00$\nОжидание первой транзакции...");
    }
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.log("Ошибка связи с Telegram: ", error.code);
});

console.log("Нафаня v5.4 успешно запущен в облаке.");
