import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db
from data_store import load_all
from routers import auth_router, stocks, news, sentiment, watchlist

load_dotenv()

app = FastAPI(title="SentiMarket API", version="1.0.0")


def get_allowed_origins() -> list[str]:
    frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:5173")
    origins = [origin.strip() for origin in frontend_urls.split(",") if origin.strip()]
    return origins or ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()
    load_all()


app.include_router(auth_router.router)
app.include_router(stocks.router)
app.include_router(news.router)
app.include_router(sentiment.router)
app.include_router(watchlist.router)


@app.get("/health")
def health():
    return {"status": "ok", "message": "SentiMarket API running"}
