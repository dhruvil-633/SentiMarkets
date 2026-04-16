import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sentimarket_local.db"
DEFAULT_SQLITE_URL = f"sqlite:///{DB_PATH.as_posix()}"


def get_database_url() -> str:
    db_url = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL).strip()
    # Some providers still return postgres://, but SQLAlchemy expects postgresql://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    return db_url


DATABASE_URL = get_database_url()
is_sqlite = DATABASE_URL.startswith("sqlite")
engine_kwargs = {"connect_args": {"check_same_thread": False}} if is_sqlite else {}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def init_db():
    from models import User, Watchlist, TokenBlacklist

    Base.metadata.create_all(bind=engine)
