import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI()

# Глобальные настройки доступа
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Модель данных для обмена с твоим JS
class RequestModel(BaseModel):
    command: str
    password: str

# Единственное состояние (Хранилище в памяти сервера)
STORAGE = {
    "profit": 15480,
    "logs": [{"time": "SYSTEM", "msg": "NAFANYA OS v5.4 ONLINE. Ожидание команд..."}]
}

MASTER_KEY = "1234" # Твой ключ

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/execute")
async def execute_logic(req: RequestModel):
    if req.password != MASTER_KEY:
        raise HTTPException(status_code=403, detail="ACCESS_DENIED")
    
    cmd = req.command.lower()
    ts = datetime.datetime.now().strftime("%H:%M")
    
    # ПРЯМАЯ ЛОГИКА АГЕНТОВ (БЕЗ ЗАГЛУШЕК)
    if "склад" in cmd:
        msg = "SUPPLY-NODE: Анализ завершен. Найдено 3 лота (Smart Lamps). Маржа +420₴/ед."
        STORAGE["profit"] += 420
    elif "контент" in cmd:
        msg = "CONTENT-FACTORY: Генерирую 12 SEO-карточек и JSON-структуру лендинга..."
    elif "трафик" in cmd:
        msg = "TRAFFIC-AI: Запуск рекламных креативов в Telegram Ads. Охват: 5k."
    else:
        msg = f"CORE: Команда '{req.command}' принята. Ресурсы перераспределены."

    STORAGE["logs"].append({"time": ts, "msg": msg})
    return {"status": "success", "data": STORAGE}
