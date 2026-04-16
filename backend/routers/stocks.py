from fastapi import APIRouter, HTTPException, Depends
from data_store import get, all_tickers, search_tickers
from dependencies import get_current_user
from models import User

router = APIRouter(prefix="/stock", tags=["stocks"])


@router.get("/list")
def list_stocks(_: User = Depends(get_current_user)):
    meta = get("meta")
    return {"tickers": all_tickers(), "stocks": list(meta.values())}


@router.get("/search")
def search(q: str, _: User = Depends(get_current_user)):
    return {"results": search_tickers(q)}


@router.get("/{ticker}/ohlc")
def get_ohlc(ticker: str, _: User = Depends(get_current_user)):
    data = get("ohlc", ticker)
    if not data:
        raise HTTPException(404, f"Ticker {ticker} not found")
    return {"ticker": ticker.upper(), "data": data}


@router.get("/{ticker}/indicators")
def get_indicators(ticker: str, _: User = Depends(get_current_user)):
    data = get("indicators", ticker)
    if not data:
        raise HTTPException(404, f"Ticker {ticker} not found")
    return {"ticker": ticker.upper(), **data}


@router.get("/{ticker}/meta")
def get_meta(ticker: str, _: User = Depends(get_current_user)):
    data = get("meta", ticker)
    if not data:
        raise HTTPException(404, f"Ticker {ticker} not found")
    return data
