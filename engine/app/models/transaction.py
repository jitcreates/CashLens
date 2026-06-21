from pydantic import BaseModel

class RawTransaction(BaseModel):
    date: str
    description: str
    amount: float
    type: str