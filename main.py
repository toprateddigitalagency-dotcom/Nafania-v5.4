from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import os

app = FastAPI()

# Разрешаем доступ с любого устройства
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# КОНФИГУРАЦИЯ БЕЗОПАСНОСТИ
MASTER_PASSWORD = "YOUR_SECURE_PASS_2026" # Измени на свой

class Action(BaseModel):
    command: str
    password: str

# СОСТОЯНИЕ СИСТЕМЫ (БАЗА ДАННЫХ)
db = {
    "balance": 0,
    "active_agents": ["CONTENT", "SUPPLY", "LEGAL", "TRAFFIC"],
    "logs": []
}

@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/execute")
async def execute(action: Action):
    if action.password != MASTER_PASSWORD:
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    cmd = action.command.lower()
    log_msg = ""

    # ЛОГИКА ОРКЕСТРАТОРА (РАСПРЕДЕЛЕНИЕ ПО АГЕНТАМ)
    if "ниша" in cmd:
        log_msg = "ANALYTICS-AI: Поиск прибыльных ниш... Найдено: Эко-освещение (ROI 4.2)."
    elif "контент" in cmd:
        log_msg = "CONTENT-FACTORY: Генерация 50 уникальных карточек товара завершена."
    elif "склад" in cmd:
        log_msg = "SUPPLY-AI: Связь со складом установлена. Синхронизация остатков..."
    else:
        log_msg = f"CORE: Команда '{cmd}' принята в обработку оркестром."

    db["logs"].append(log_msg)
    return {"status": "success", "message": log_msg, "db": db}

@app.get("/api/status")
async def get_status():
    return db
  
