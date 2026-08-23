import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AP Payment Fraud Sentinel"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sentinel.db")
    
    # LLM Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "auto")
    
    # Sentinel Risk Thresholds
    AUTO_CLEAR_THRESHOLD: int = 30   # Risk < 30 -> Safe & Auto-cleared
    HOLD_THRESHOLD: int = 70         # Risk >= 70 -> Mandatory Payment HOLD
    
    # High-Risk Flags Weights
    WEIGHT_BANK_CHANGE: float = 35.0
    WEIGHT_AMOUNT_ANOMALY: float = 25.0
    WEIGHT_VENDOR_UNVERIFIED: float = 20.0
    WEIGHT_BEC_MISMATCH: float = 20.0

settings = Settings()
