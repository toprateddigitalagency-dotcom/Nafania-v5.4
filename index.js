const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- КОНФИГУРАЦИЯ ---
const TG_TOKEN = '7629814043:AAHrljzdtBl-vFCEvzp--jZ21JORicHH6PI';
const GEMINI_API_KEY = 'AIzaSyCFz057vs-7B_i5FH32-wXXmv5bw6zSvso'; 
const ADMIN_ID = 1379805039;

const bot = new TelegramBot(TG_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_PROMPT = "Ты — Нафаня v5.4, главный ИИ-оркестратор. Твой владелец — Алексей. Отвечай как мощная бизнес-система: четко, по делу, с аналитикой веток Finance, Media и Ads. Минимум воды.";

async function askGemini(userPrompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nЗапрос Алексея: ${userPrompt}`);
    const response = await result.response;
    return response.text();
}

bot.on('message', async (msg) => {
    if (msg.from.id !== ADMIN_ID || !msg.text || msg.text.startsWith('/')) return;

    const waitMsg = await bot.sendMessage(ADMIN_ID, "🧠 *Нафаня анализирует...*", { parse_mode: 'Markdown' });

    try {
        const aiResponse = await askGemini(msg.text);
        // Если ответ слишком длинный, Телеграм может выдать ошибку, поэтому режем или шлем как есть
        bot.editMessageText(aiResponse, { 
            chat_id: ADMIN_ID, 
            message_id: waitMsg.message_id,
            parse_mode: 'Markdown' 
        }).catch(() => bot.editMessageText(aiResponse, { chat_id: ADMIN_ID, message_id: waitMsg.message_id }));
        
    } catch (error) {
        bot.editMessageText("❌ ОШИБКА ЯДРА: " + error.message, { chat_id: ADMIN_ID, message_id: waitMsg.message_id });
    }
});

bot.onText(/\/start/, (msg) => {
    if (msg.from.id === ADMIN_ID) {
        bot.sendMessage(ADMIN_ID, "🔘 **НАФАНЯ v5.4: ЯДРО АКТИВИРОВАНО**\n\nАлексей, я готов к управлению проектом. Вводи любую задачу.");
    }
});

console.log("Нафаня v5.4 запущена на ключе Gemini.");
