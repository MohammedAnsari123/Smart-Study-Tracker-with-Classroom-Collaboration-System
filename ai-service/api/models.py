from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    context: Optional[str] = ""


class StudyData(BaseModel):
    subject: Optional[str] = None
    thresholdMet: Optional[bool] = True
    sessions: List[dict]
    flashcards: List[dict]
    submissions: List[dict]

class WeaknessRequest(BaseModel):
    data: StudyData

class FlashcardRequest(BaseModel):
    subject: str
    topics: List[str]
    syllabus_context: Optional[str] = ""

class TestRequest(BaseModel):
    subject: str
    topic: str
    subtopic: Optional[str] = ""
    durationMinutes: Optional[int] = 30
    notes: Optional[str] = ""
