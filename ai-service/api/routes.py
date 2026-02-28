from fastapi import APIRouter, HTTPException
from api.models import ChatRequest
from services.ai_service import ai_service

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Convert Pydantic models to dictionaries for the service
        history_dicts = [msg.dict() for msg in request.history]
        
        response = await ai_service.get_ai_response(
            user_message=request.message,
            history=history_dicts
        )
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
