const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TOKEN = '7629814043:AAHrljzdtBl-vFCEvzp--jZ21JORicHH6PI';
const KEY = 'AIzaSyCFz057vs-7B_i5FH32-wXXmv5bw6zSvso'; 
const ADMIN = 1379805039;

const bot = new TelegramBot(TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(KEY);

// Настройка личности Нафани v5.4
const instruction = "Ты — Нафаня v5.4, ИИ-оркестратор. Твой владелец Алексей. Твоя цель: управление бизнесом и ветками Finance, Media, Ads. Отвечай как мощный аналитический ИИ. Минимум воды.";

async function generate(text) {
    try {
        // Используем gemini-pro как самую стабильную для API v1
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(instruction + "\n\nЗАПРОС ВЛАДЕЛЬЦА: " + text);
        const response = await result.response;
        return response.text();
    } catch (e) {
        return "❌ КРИТИЧЕСКИЙ СБОЙ МОДЕЛИ: " + e.message;
    }
}

bot.on('message', async (msg) => {
    if (msg.from.id !== ADMIN || !msg.text || msg.text.startsWith('/')) return;

    const statusMsg = await bot.sendMessage(ADMIN, "⚙️ *Нафаня v5.4: Обработка...*", { parse_mode: 'Markdown' });

    const response = await generate(msg.text);
    
    bot.editMessageText(response, {
        chat_id: ADMIN,
        message_id: statusMsg.message_id
    }).catch(() => {
        bot.sendMessage(ADMIN, response);
    });
});

bot.onText(/\/start/, (msg) => {
    if (msg.from.id === ADMIN) {
        bot.sendMessage(ADMIN, "🔘 **НАФАНЯ v5.4: ЯДРО СИНХРОНИЗИРОВАНО**\n\nСвязь с Google AI установлена. Жду задач по архитектуре.");
    }
});

console.log("НАФАНЯ v5.4: Стабильный режим активирован.");
