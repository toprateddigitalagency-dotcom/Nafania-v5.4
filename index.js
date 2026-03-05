const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TOKEN = '7629814043:AAHrljzdtBl-vFCEvzp--jZ21JORicHH6PI';
const KEY = 'AIzaSyCFz057vs-7B_i5FH32-wXXmv5bw6zSvso'; 
const ADMIN = 1379805039;

const bot = new TelegramBot(TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(KEY);

async function generate(text) {
    try {
        // Используем модель gemini-pro — она самая стабильная для этого API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Ты — Нафаня v5.4, ИИ-оркестратор Алексея. Отвечай кратко и по делу. Запрос: ${text}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (e) {
        return "❌ ОШИБКА ДОСТУПА: " + e.message;
    }
}

bot.on('message', async (msg) => {
    if (msg.from.id !== ADMIN || !msg.text || msg.text.startsWith('/')) return;

    const waitMsg = await bot.sendMessage(ADMIN, "⚙️ *Нафаня думает...*", { parse_mode: 'Markdown' });

    const aiResponse = await generate(msg.text);
    
    bot.editMessageText(aiResponse, {
        chat_id: ADMIN,
        message_id: waitMsg.message_id
    }).catch(() => {
        bot.sendMessage(ADMIN, aiResponse);
    });
});

bot.onText(/\/start/, (msg) => {
    if (msg.from.id === ADMIN) {
        bot.sendMessage(ADMIN, "🔘 **НАФАНЯ v5.4: ЯДРО ПЕРЕЗАГРУЖЕНО**\n\nИспользую стабильный узел Gemini Pro. Напиши что угодно для проверки.");
    }
});
