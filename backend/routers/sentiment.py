from fastapi import APIRouter, HTTPException, Depends
from data_store import get
from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


@router.get("/{ticker}")
def get_sentiment(ticker: str, _: User = Depends(get_current_user)):
    data = get("sentiment", ticker)
    if not data:
        raise HTTPException(404, f"No sentiment data for {ticker}")
    return data


@router.get("/all/overview")
def sentiment_overview(_: User = Depends(get_current_user)):
    all_sent = get("sentiment")
    return {"data": list(all_sent.values())}
