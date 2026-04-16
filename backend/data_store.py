"""
Loads all 5 JSON files into memory once at startup.
All API routes read from this in-memory dict — zero file I/O per request.
"""

import json
import os

_store = {}


def load_all():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    files = ["ohlc", "indicators", "news", "sentiment", "meta"]
    for name in files:
        path = os.path.join(data_dir, f"{name}.json")
        with open(path, "r", encoding="utf-8") as f:
            _store[name] = json.load(f)
    print(f"Data store loaded: {[k for k in _store]} - {list(_store['meta'].keys())}")


def get(section: str, ticker: str = None):
    if ticker:
        return _store.get(section, {}).get(ticker.upper())
    return _store.get(section, {})


def all_tickers():
    return list(_store.get("meta", {}).keys())


def search_tickers(query: str):
    q = query.upper()
    results = []
    for ticker, info in _store.get("meta", {}).items():
        if q in ticker or q in info.get("name", "").upper():
            results.append(
                {
                    "ticker": ticker,
                    "name": info["name"],
                    "exchange": info["exchange"],
                    "sector": info["sector"],
                    "price": info["price"],
                    "changePct": info["changePct"],
                }
            )
    return results[:8]
