const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- КОНФИГУРАЦИЯ ---
const TOKEN = '7629814043:AAHrljzdtBl-vFCEvzp--jZ21JORicHH6PI';
const KEY = 'AIzaSyCFz057vs-7B_i5FH32-wXXmv5bw6zSvso'; 
const ADMIN = 1379805039;

const bot = new TelegramBot(TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(KEY);

// Настройка личности Нафани
const instruction = "Ты — Нафаня v5.4, ИИ-оркестратор. Твой владелец Алексей. Твоя цель: масштабирование бизнеса через ветки Finance, Media, Ads. Отвечай жестко, по делу, с конкретными планами действий. Никакой воды.";

async function generate(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(instruction + "\n\nЗАПРОС ВЛАДЕЛЬЦА: " + text);
        return result.response.text();
    } catch (e) {
        return "❌ ОШИБКА ИНТЕЛЛЕКТА: " + e.message;
    }
}

bot.on('message', async (msg) => {
    if (msg.from.id !== ADMIN || !msg.text) return;

    // Автоматический старт при любом сообщении, если система была в ауте
    if (msg.text === '/start') {
        return bot.sendMessage(ADMIN, "🔘 **НАФАНЯ v5.4: СИСТЕМА В СТРОГОМ РЕЖИМЕ**\n\nЯдро синхронизировано. Жду приказов.");
    }

    const statusMsg = await bot.sendMessage(ADMIN, "⚙️ *Обработка запроса оркестратором...*", { parse_mode: 'Markdown' });

    const response = await generate(msg.text);
    
    bot.editMessageText(response, {
        chat_id: ADMIN,
        message_id: statusMsg.message_id,
        parse_mode: 'Markdown'
    }).catch(() => {
        // Запасной вариант если Markdown упал
        bot.editMessageText(response, { chat_id: ADMIN, message_id: statusMsg.message_id });
    });
});

console.log("НАФАНЯ v5.4: ЯДРО АКТИВИРОВАНО");
