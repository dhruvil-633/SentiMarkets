from fastapi import APIRouter, HTTPException, Depends, Query
from data_store import get
from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/{ticker}")
def get_news(
    ticker: str,
    limit: int = Query(default=20, le=50),
    sentiment: str = Query(default=None),
    _: User = Depends(get_current_user),
):
    data = get("news", ticker)
    if not data:
        raise HTTPException(404, f"No news for {ticker}")
    articles = data[:limit]
    if sentiment and sentiment in ("bullish", "bearish", "neutral"):
        articles = [a for a in articles if a["sentiment_label"] == sentiment]
    return {"ticker": ticker.upper(), "articles": articles, "total": len(articles)}


@router.get("/all/feed")
def get_all_news(
    limit: int = Query(default=40, le=100),
    sentiment: str = Query(default=None),
    _: User = Depends(get_current_user),
):
    all_news = get("news")
    combined = []
    for ticker, articles in all_news.items():
        for a in articles:
            combined.append({**a, "ticker": ticker})
    combined.sort(key=lambda x: x["publishedAt"], reverse=True)
    if sentiment and sentiment in ("bullish", "bearish", "neutral"):
        combined = [a for a in combined if a["sentiment_label"] == sentiment]
    return {"articles": combined[:limit], "total": len(combined)}
