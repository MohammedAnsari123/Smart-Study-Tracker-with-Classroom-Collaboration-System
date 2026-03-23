from fastapi import APIRouter, HTTPException
from api.models import ChatRequest, WeaknessRequest, FlashcardRequest, TestRequest
from services.ai_service import ai_service

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Convert Pydantic models to dictionaries for the service
        history_dicts = [msg.dict() for msg in request.history]
        
        response = await ai_service.get_ai_response(
            user_message=request.message,
            history=history_dicts,
            context=request.context
        )

        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/weakness-analysis")
async def weakness_analysis(request: WeaknessRequest):
    try:
        result = await ai_service.get_weakness_analysis(request.data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-flashcards")
async def generate_flashcards(request: FlashcardRequest):
    try:
        cards = await ai_service.generate_flashcards(request.subject, request.topics, request.syllabus_context)
        return {"flashcards": cards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test/generate")
async def generate_test(request: TestRequest):
    try:
        test = await ai_service.generate_test(request.dict())
        return test
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
