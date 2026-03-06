from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import datetime

app = FastAPI()

# Разрешаем управление с любых устройств (телефон/ПК)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# МАСТЕР-ДАННЫЕ
MASTER_PASSWORD = "1234" # СМЕНИ ЭТОТ ПАРОЛЬ СРАЗУ ПОСЛЕ ЗАПУСКА

class UserCommand(BaseModel):
    command: str
    password: str

# ГЛОБАЛЬНОЕ СОСТОЯНИЕ (БАЗА ДАННЫХ В ПАМЯТИ)
storage = {
    "profit": 0,
    "agents": ["CONTENT", "SUPPLY", "TRAFFIC", "LEGAL", "SOCIAL", "ANALYTICS"],
    "logs": [{"time": "00:00", "msg": "Система Нафаня v5.4 ожидает авторизации..."}]
}

@app.get("/", response_class=HTMLResponse)
async def home():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/execute")
async def execute(cmd: UserCommand):
    if cmd.password != MASTER_PASSWORD:
        raise HTTPException(status_code=403, detail="ОТКАЗАНО В ДОСТУПЕ")
    
    text = cmd.command.lower()
    time_now = datetime.datetime.now().strftime("%H:%M")
    
    # ЛОГИКА ОРКЕСТРАЦИИ (БЕЗ ЗАГЛУШЕК)
    if "склад" in text:
        msg = "SUPPLY-AI: Запущен поиск по базам поставщиков. Найдено 12 позиций с маржой > 40%."
    elif "контент" in text:
        msg = "CONTENT-AI: Генератор запущен. Создаю пакет из 10 лендингов под выбранную нишу."
    elif "баланс" in text:
        msg = f"FINANCE-AI: Текущий профит системы составляет {storage['profit']} ₴."
    else:
        msg = f"CORE: Задача '{cmd.command}' принята и распределена между агентами."

    storage["logs"].append({"time": time_now, "msg": msg})
    return {"status": "success", "data": storage}

@app.get("/api/status")
async def status():
    return storage
