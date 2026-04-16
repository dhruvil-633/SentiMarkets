from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, Watchlist
from schemas import WatchlistItem, WatchlistOut
from dependencies import get_db, get_current_user
from data_store import get, all_tickers

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.get("", response_model=List[WatchlistOut])
def get_watchlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    items = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()
    enriched = []
    for item in items:
        meta = get("meta", item.ticker) or {}
        enriched.append(
            {
                "id": item.id,
                "ticker": item.ticker,
                "added_at": item.added_at,
                **meta,
            }
        )
    return items


@router.get("/enriched")
def get_watchlist_enriched(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    items = db.query(Watchlist).filter(Watchlist.user_id == user.id).all()
    enriched = []
    for item in items:
        meta = get("meta", item.ticker) or {}
        sentiment = get("sentiment", item.ticker) or {}
        enriched.append(
            {
                "id": item.id,
                "ticker": item.ticker,
                "added_at": str(item.added_at),
                **meta,
                "sentiment_label": sentiment.get("label", "neutral"),
                "aggregate_score": sentiment.get("aggregate_score", 0),
            }
        )
    return {"watchlist": enriched}


@router.post("")
def add_to_watchlist(
    body: WatchlistItem,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ticker = body.ticker.upper()
    if ticker not in all_tickers():
        raise HTTPException(400, f"{ticker} is not in our database")
    existing = db.query(Watchlist).filter(
        Watchlist.user_id == user.id, Watchlist.ticker == ticker
    ).first()
    if existing:
        raise HTTPException(409, f"{ticker} already in watchlist")
    item = Watchlist(user_id=user.id, ticker=ticker)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"message": f"{ticker} added", "id": item.id, "ticker": item.ticker}


@router.delete("/{ticker}")
def remove_from_watchlist(
    ticker: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = db.query(Watchlist).filter(
        Watchlist.user_id == user.id, Watchlist.ticker == ticker.upper()
    ).first()
    if not item:
        raise HTTPException(404, "Not in watchlist")
    db.delete(item)
    db.commit()
    return {"message": f"{ticker.upper()} removed"}
