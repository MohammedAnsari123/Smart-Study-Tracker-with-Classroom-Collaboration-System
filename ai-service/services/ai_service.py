import os
import requests
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        # Confirmed 2025 Hugging Face Inference Router URL
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        # Using DeepSeek-R1-Distill-Qwen-7B as the primary model (distilled for speed/stability)
        self.primary_model = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
        # Fallback model in case the primary is overloaded
        self.fallback_model = "deepseek-ai/DeepSeek-R1-Distill-Llama-8B"
        self.api_token = os.getenv("HF_API_TOKEN")
        
        self.system_prompt = (
            "You are a domain-specific study assistant for the 'Smart Study' platform. "
            "Your goal is to provide helpful, concise study information and explain concepts. "
            "IMPORTANT RESPONSE LIMITS: "
            "1. Your response MUST be complete and fit within the available context window. "
            "2. Do not cut off mid-sentence. "
            "3. If a topic is complex, provide a high-level summary that is full and precise rather than an exhaustive roadmap that gets cut off. "
            "4. Use Markdown (bullet points, bold text) to keep information dense and readable. "
            "5. Avoid conversational filler. Get straight to the academic point."
        )

    async def get_ai_response(self, user_message: str, history: list = []):
        if not self.api_token:
            return "AI Error: Hugging Face API Token (HF_API_TOKEN) is missing in .env file."

        # Try with primary model first, then fallback if needed
        for model_id in [self.primary_model, self.fallback_model]:
            try:
                # Building standard OpenAI-compatible message list
                messages = [{"role": "system", "content": self.system_prompt}]
                # Keep history short (last 3 messages) to save context for the answer
                for msg in history[-3:]: 
                    messages.append({"role": msg['role'], "content": msg['content']})
                messages.append({"role": "user", "content": user_message})

                headers = {
                    "Authorization": f"Bearer {self.api_token}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": model_id,
                    "messages": messages,
                    "max_tokens": 1024, # Optimized for complete answers
                    "temperature": 0.6, # Slightly lower for more structured/stable output
                    "stream": False
                }

                # Direct POST to the router
                response = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
                
                # Check for 5xx errors or 429 to trigger fallback
                if response.status_code >= 500 or response.status_code == 429:
                    if model_id == self.primary_model:
                        print(f"Primary model {model_id} failed with {response.status_code}. Trying fallback...")
                        continue # Try the next model
                
                # Detailed error handling
                if response.status_code == 401:
                    return "AI Error: Unauthorized. Please check if your Hugging Face API Token (HF_API_TOKEN) is correct and has 'Inference' permissions."
                
                if response.status_code == 503:
                    return "AI Error: Model is currently loading on Hugging Face servers. Please try again in 20 seconds."
                
                if response.status_code == 400:
                    return f"AI Error: Bad Request (400). This might mean the model '{model_id}' is temporarily unsupported on the router."

                response.raise_for_status()
                
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    content = result["choices"][0]["message"]["content"]
                    # Distilled models sometimes output <think> blocks; we strip them for the end-user
                    if "</think>" in content:
                        content = content.split("</think>")[-1].strip()
                    return content
                    
                return "I'm sorry, I couldn't generate a response."

            except requests.exceptions.RequestException as e:
                # If it's the primary model and it timed out or erred, try fallback
                if model_id == self.primary_model:
                    print(f"Request error with {model_id}: {str(e)}. Trying fallback...")
                    continue
                return f"Error connecting to Hugging Face API: {str(e)}"
            except Exception as e:
                return f"An unexpected error occurred: {str(e)}"
        
        return "AI Error: Both primary and fallback models are currently unavailable. Hugging Face servers may be overloaded. Please try again in a few minutes."

ai_service = AIService()
