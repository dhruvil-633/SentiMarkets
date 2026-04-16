import json
import random
import math
from datetime import datetime, timedelta

random.seed(42)

# ── 15 US Stocks ──────────────────────────────────────────────────────────────
STOCKS = {
    "AAPL":  {"name": "Apple Inc.",                "base": 189.5,  "sector": "Technology"},
    "MSFT":  {"name": "Microsoft Corporation",     "base": 415.2,  "sector": "Technology"},
    "GOOGL": {"name": "Alphabet Inc.",             "base": 175.8,  "sector": "Technology"},
    "AMZN":  {"name": "Amazon.com Inc.",           "base": 192.3,  "sector": "Consumer Cyclical"},
    "NVDA":  {"name": "NVIDIA Corporation",        "base": 875.4,  "sector": "Technology"},
    "TSLA":  {"name": "Tesla Inc.",                "base": 248.6,  "sector": "Automotive"},
    "META":  {"name": "Meta Platforms Inc.",       "base": 502.1,  "sector": "Technology"},
    "JPM":   {"name": "JPMorgan Chase & Co.",      "base": 198.7,  "sector": "Financial Services"},
    "JNJ":   {"name": "Johnson & Johnson",         "base": 158.4,  "sector": "Healthcare"},
    "V":     {"name": "Visa Inc.",                 "base": 275.9,  "sector": "Financial Services"},
    "WMT":   {"name": "Walmart Inc.",              "base": 68.3,   "sector": "Consumer Defensive"},
    "XOM":   {"name": "Exxon Mobil Corporation",  "base": 112.6,  "sector": "Energy"},
    "BAC":   {"name": "Bank of America Corp.",     "base": 38.9,   "sector": "Financial Services"},
    "DIS":   {"name": "The Walt Disney Company",   "base": 112.4,  "sector": "Communication"},
    "NFLX":  {"name": "Netflix Inc.",              "base": 628.7,  "sector": "Communication"},
}

# ── Date range: March 17 – April 16, 2025 (22 trading days) ──────────────────
def get_trading_days():
    days = []
    start = datetime(2025, 3, 17)
    end   = datetime(2025, 4, 16)
    current = start
    while current <= end:
        if current.weekday() < 5:  # Mon–Fri
            days.append(current)
        current += timedelta(days=1)
    return days

TRADING_DAYS = get_trading_days()

# ── OHLCV generator ────────────────────────────────────────────────────────────
def generate_ohlcv(ticker, base_price):
    candles = []
    price = base_price
    trend = random.choice([-1, 1]) * random.uniform(0.001, 0.004)

    for day in TRADING_DAYS:
        # drift + noise
        drift   = trend + random.gauss(0, 0.008)
        open_p  = round(price * (1 + random.gauss(0, 0.003)), 2)
        close_p = round(open_p * (1 + drift), 2)
        high_p  = round(max(open_p, close_p) * (1 + abs(random.gauss(0, 0.006))), 2)
        low_p   = round(min(open_p, close_p) * (1 - abs(random.gauss(0, 0.006))), 2)
        volume  = int(random.uniform(12_000_000, 95_000_000) * (base_price / 200))

        candles.append({
            "time":   int(day.timestamp()),
            "date":   day.strftime("%Y-%m-%d"),
            "open":   open_p,
            "high":   high_p,
            "low":    low_p,
            "close":  close_p,
            "volume": volume
        })

        price = close_p
        # small trend reversal chance
        if random.random() < 0.15:
            trend = -trend

    return candles

# ── Indicators ─────────────────────────────────────────────────────────────────
def calc_sma(closes, window):
    result = []
    for i in range(len(closes)):
        if i < window - 1:
            result.append(None)
        else:
            result.append(round(sum(closes[i-window+1:i+1]) / window, 4))
    return result

def calc_ema(closes, window):
    result = []
    k = 2 / (window + 1)
    ema = None
    for i, c in enumerate(closes):
        if i < window - 1:
            result.append(None)
        elif i == window - 1:
            ema = sum(closes[:window]) / window
            result.append(round(ema, 4))
        else:
            ema = c * k + ema * (1 - k)
            result.append(round(ema, 4))
    return result

def calc_rsi(closes, period=14):
    result = [None] * period
    for i in range(period, len(closes)):
        window = closes[i-period:i+1]
        gains  = [max(window[j]-window[j-1], 0) for j in range(1, len(window))]
        losses = [max(window[j-1]-window[j], 0) for j in range(1, len(window))]
        ag = sum(gains)  / period
        al = sum(losses) / period
        rs = ag / al if al != 0 else 100
        result.append(round(100 - 100/(1+rs), 2))
    return result

def calc_bb(closes, window=10, num_std=2):
    upper, middle, lower = [], [], []
    for i in range(len(closes)):
        if i < window - 1:
            upper.append(None); middle.append(None); lower.append(None)
        else:
            w   = closes[i-window+1:i+1]
            m   = sum(w) / window
            std = math.sqrt(sum((x - m)**2 for x in w) / window)
            middle.append(round(m, 4))
            upper.append(round(m + num_std * std, 4))
            lower.append(round(m - num_std * std, 4))
    return upper, middle, lower

def build_indicator_series(candles):
    times  = [c["time"] for c in candles]
    closes = [c["close"] for c in candles]

    sma20 = calc_sma(closes, 10)   # fewer bars → use 10
    sma50 = calc_sma(closes, 14)
    ema20 = calc_ema(closes, 10)
    rsi14 = calc_rsi(closes, 10)
    bb_u, bb_m, bb_l = calc_bb(closes, 10, 2)

    def zip_series(vals):
        return [{"time": t, "value": v} for t, v in zip(times, vals) if v is not None]

    return {
        "sma_20":  zip_series(sma20),
        "sma_50":  zip_series(sma50),
        "ema_20":  zip_series(ema20),
        "rsi_14":  zip_series(rsi14),
        "bb": {
            "upper":  zip_series(bb_u),
            "middle": zip_series(bb_m),
            "lower":  zip_series(bb_l),
        }
    }

# ── News templates ─────────────────────────────────────────────────────────────
NEWS_TEMPLATES = {
    "bullish": [
        ("{ticker} Smashes Earnings Expectations, Stock Surges {pct}%",
         "{name} reported Q1 earnings that beat analyst consensus by a wide margin, driven by strong revenue growth and expanding margins. Investors reacted positively, pushing shares higher in after-hours trading."),
        ("{ticker} Announces $10B Share Buyback Program",
         "{name} revealed a new $10 billion share repurchase program, signaling management confidence in the company's long-term outlook. Analysts upgraded the stock following the announcement."),
        ("{ticker} Wins Major Government Contract Worth $4.2B",
         "{name} secured a significant multi-year government contract, adding substantial visibility to future revenue streams. The deal is expected to be accretive to earnings starting next quarter."),
        ("Analysts Raise {ticker} Price Target to ${pt}",
         "A chorus of Wall Street analysts raised their price targets for {name} following a strong product launch and positive channel checks. The consensus rating remains a Strong Buy."),
        ("{ticker} Revenue Growth Accelerates for Third Straight Quarter",
         "{name} posted its third consecutive quarter of accelerating revenue growth, outpacing sector peers. The company raised full-year guidance above the high end of prior estimates."),
        ("{ticker} Expands into High-Growth Asian Markets",
         "{name} announced a strategic expansion into Southeast Asian markets, targeting a $50B addressable opportunity. The move is expected to meaningfully diversify the company's revenue base."),
    ],
    "bearish": [
        ("{ticker} Misses Revenue Estimates as Competition Intensifies",
         "{name} reported disappointing quarterly revenues, falling short of analyst expectations for the second consecutive period. Management cited intensifying competitive pressure and softer consumer demand."),
        ("{ticker} CFO Departs Unexpectedly; Shares Drop",
         "{name} disclosed the sudden resignation of its Chief Financial Officer, raising governance concerns among institutional investors. The stock fell sharply as uncertainty around financial strategy increased."),
        ("{ticker} Faces Regulatory Scrutiny Over Data Practices",
         "Regulators announced a formal investigation into {name}'s data handling practices, potentially exposing the company to significant fines and operational restrictions."),
        ("{ticker} Cuts Full-Year Guidance Citing Macro Headwinds",
         "{name} lowered its full-year outlook, citing persistent macroeconomic headwinds including elevated interest rates and slowing enterprise spending. The guidance cut surprised most market observers."),
        ("Institutional Investors Reduce {ticker} Holdings by 8%",
         "SEC 13F filings reveal that major institutional investors trimmed their {name} positions significantly in the most recent quarter, suggesting diminished conviction in the near-term outlook."),
    ],
    "neutral": [
        ("{ticker} Holds Annual Shareholder Meeting; No Major Announcements",
         "{name} conducted its annual shareholder meeting with no material new announcements. Management reiterated existing guidance and outlined long-term strategic priorities consistent with prior communications."),
        ("{ticker} Completes Planned Debt Refinancing at Lower Rates",
         "{name} successfully refinanced a portion of its long-term debt at favorable rates, modestly reducing its interest expense. The transaction was in line with the company's stated capital allocation strategy."),
        ("{ticker} Appoints New Chief Marketing Officer",
         "{name} named a veteran marketing executive as its new Chief Marketing Officer. The appointment is seen as routine and consistent with the company's ongoing leadership succession planning."),
        ("{ticker} Participates in Industry Conference; Reiterates Outlook",
         "Management of {name} presented at a major industry conference, reiterating their previously issued financial guidance and discussing long-term growth initiatives without offering new financial metrics."),
        ("{ticker} Signs Partnership with Mid-Tier Technology Vendor",
         "{name} announced a partnership with a regional technology provider to enhance certain back-office capabilities. The financial terms were not disclosed and the impact on earnings is expected to be minimal."),
    ]
}

SOURCES = [
    "Bloomberg", "Reuters", "CNBC", "MarketWatch", "Barron's",
    "The Wall Street Journal", "Financial Times", "Seeking Alpha",
    "Motley Fool", "Yahoo Finance", "Investopedia", "Forbes",
    "Business Insider", "TechCrunch", "The Street"
]

def generate_news(ticker, info):
    articles = []
    name = info["name"]
    base = info["base"]

    # ~18 articles spread over 30 days
    used_days = sorted(random.sample(range(30), 18))

    for i, day_offset in enumerate(used_days):
        pub_date = datetime(2025, 3, 17) + timedelta(days=day_offset)
        # weighted: more bullish/neutral than bearish
        label = random.choices(["bullish", "bearish", "neutral"], weights=[0.45, 0.25, 0.30])[0]
        template_title, template_desc = random.choice(NEWS_TEMPLATES[label])

        pt = round(base * random.uniform(1.08, 1.22), 0)
        pct = round(random.uniform(3.5, 12.4), 1)

        title = template_title.format(ticker=ticker, name=name, pt=int(pt), pct=pct)
        desc  = template_desc.format(ticker=ticker, name=name)

        if label == "bullish":
            score = round(random.uniform(0.18, 0.92), 4)
        elif label == "bearish":
            score = round(random.uniform(-0.92, -0.18), 4)
        else:
            score = round(random.uniform(-0.12, 0.12), 4)

        articles.append({
            "id":              f"{ticker}_{i}",
            "title":           title,
            "description":     desc,
            "url":             f"https://finance.example.com/{ticker.lower()}-news-{i}",
            "publishedAt":     pub_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "source":          random.choice(SOURCES),
            "sentiment_score": score,
            "sentiment_label": label,
        })

    return sorted(articles, key=lambda x: x["publishedAt"], reverse=True)

def aggregate_sentiment(articles):
    scores = [a["sentiment_score"] for a in articles]
    labels = [a["sentiment_label"] for a in articles]
    n      = len(scores)
    avg    = round(sum(scores) / n, 4) if n else 0.0
    dominant = max(set(labels), key=labels.count) if labels else "neutral"
    return {
        "aggregate_score": avg,
        "label":           dominant,
        "bullish_pct":  round(labels.count("bullish")  / n * 100, 1),
        "bearish_pct":  round(labels.count("bearish")  / n * 100, 1),
        "neutral_pct":  round(labels.count("neutral")  / n * 100, 1),
        "article_count": n
    }

# ── Assemble everything ────────────────────────────────────────────────────────
all_ohlc       = {}
all_indicators = {}
all_news       = {}
all_sentiment  = {}
all_meta       = {}

for ticker, info in STOCKS.items():
    print(f"Generating {ticker}...")
    candles    = generate_ohlcv(ticker, info["base"])
    indicators = build_indicator_series(candles)
    news       = generate_news(ticker, info)
    sentiment  = aggregate_sentiment(news)

    # current price = last close
    last  = candles[-1]["close"]
    first = candles[0]["close"]
    chg   = round(last - first, 2)
    chgp  = round((chg / first) * 100, 2)

    all_ohlc[ticker]       = candles
    all_indicators[ticker] = indicators
    all_news[ticker]       = news
    all_sentiment[ticker]  = {**sentiment, "ticker": ticker}
    all_meta[ticker]       = {
        "ticker":   ticker,
        "name":     info["name"],
        "sector":   info["sector"],
        "price":    last,
        "change":   chg,
        "changePct": chgp,
        "volume":   candles[-1]["volume"],
        "open":     candles[-1]["open"],
        "high":     candles[-1]["high"],
        "low":      candles[-1]["low"],
        "exchange": "NASDAQ" if info["sector"] == "Technology" else "NYSE",
    }

# ── Write files ────────────────────────────────────────────────────────────────
out = "/home/claude/sentimarket_data"

with open(f"{out}/ohlc.json",       "w") as f: json.dump(all_ohlc,       f, indent=2)
with open(f"{out}/indicators.json", "w") as f: json.dump(all_indicators, f, indent=2)
with open(f"{out}/news.json",       "w") as f: json.dump(all_news,       f, indent=2)
with open(f"{out}/sentiment.json",  "w") as f: json.dump(all_sentiment,  f, indent=2)
with open(f"{out}/meta.json",       "w") as f: json.dump(all_meta,       f, indent=2)

# Combined single file for easy import
combined = {
    "ohlc":       all_ohlc,
    "indicators": all_indicators,
    "news":       all_news,
    "sentiment":  all_sentiment,
    "meta":       all_meta,
}
with open(f"{out}/sentimarket_db.json", "w") as f: json.dump(combined, f, indent=2)

print("\n✅ Done! Files written:")
for ticker in STOCKS:
    candles = all_ohlc[ticker]
    last_close = candles[-1]["close"]
    chgp = all_meta[ticker]["changePct"]
    sign = "+" if chgp >= 0 else ""
    print(f"   {ticker:6s}  ${last_close:<8.2f}  {sign}{chgp}%  |  {len(all_news[ticker])} articles  |  sentiment: {all_sentiment[ticker]['label']}")

print(f"\n📁 Output: {out}/")
print("   ohlc.json, indicators.json, news.json, sentiment.json, meta.json")
print("   sentimarket_db.json  ← single import file")
