import os

class Settings:
    PROJECT_NAME: str = "CashLens Intelligence Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Max file upload size: 10MB
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  
    ALLOWED_EXTENSIONS: set = {"pdf", "csv", "txt"}

settings = Settings()