import os
import requests
import json
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

    async def get_ai_response(self, user_message: str, history: list = [], context: str = ""):
        if not self.api_token:
            return "AI Error: Hugging Face API Token (HF_API_TOKEN) is missing in .env file."

        # Dynamically build system prompt with context if available
        current_system_prompt = self.system_prompt
        if context:
            current_system_prompt += (
                f"\n\nStudy Context (from uploaded PDF):\n{context}\n\n"
                "Use the above context to answer accurately if the user asks about it. "
                "If the context is unrelated to the question, prioritize general academic knowledge."
            )


        # Try with primary model first, then fallback if needed
        for model_id in [self.primary_model, self.fallback_model]:
            try:
                # Building standard OpenAI-compatible message list
                messages = [{"role": "system", "content": current_system_prompt}]

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

    async def get_weakness_analysis(self, study_data: dict):
        if not self.api_token:
            return {"error": "HF_API_TOKEN missing"}

        # Prepare a concise summary of the data for the LLM
        subject = study_data.get('subject', 'all subjects')
        data_summary = f"""
        Target Subject: {subject}
        Study Sessions: {json.dumps(study_data['sessions'])}
        Flashcards: {json.dumps(study_data['flashcards'])}
        Assignment Marks: {json.dumps(study_data['submissions'])}
        """

        prompt = (
            f"Analyze the following study data for {subject} and identify the student's top 3 weak topics within this subject. "
            "For each weakness, provide a 'subject', 'topic', 'reason' (based on the data), and a 'recommendation'. "
            "Return the response ONLY as a valid JSON object in this format: "
            '{"weaknesses": [{"subject": "' + subject + '", "topic": "Calculus", "reason": "Low focus and high hard flashcards", "recommendation": "Review basic integration"}], "overall_status": "Improving"}'
            "\nData:\n" + data_summary
        )

        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.primary_model,
                "messages": [
                    {"role": "system", "content": "You are a data analysis expert. Return JSON only."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1000,
                "temperature": 0.3, # low temperature for structural consistency (JSON)
                "stream": False
            }

            response = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Clean up potential markdown formatting or think blocks
            if "</think>" in content:
                content = content.split("</think>")[-1].strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
            
            return json.loads(content)

        except Exception as e:
            return {"error": str(e), "weaknesses": [], "overall_status": "Evaluation failed"}

    async def generate_flashcards(self, subject: str, topics: list):
        if not self.api_token:
            return []

        prompt = (
            f"Generate a set of 10 high-quality flashcards for the subject '{subject}'. "
            f"Use the following topics as context: {', '.join(topics)}. "
            "For each flashcard, provide a clear 'question' and a concise 'answer'. "
            "Focus on key concepts, definitions, and important facts. "
            "Return the response ONLY as a valid JSON array of objects in this format: "
            '[{"question": "What is X?", "answer": "X is Y."}, {"question": "Define Z.", "answer": "Z is A."}]'
        )

        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.primary_model,
                "messages": [
                    {"role": "system", "content": "You are a teacher creating study materials. Return JSON array ONLY."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1500,
                "temperature": 0.5,
                "stream": False
            }

            response = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Clean up potential markdown formatting or think blocks
            if "</think>" in content:
                content = content.split("</think>")[-1].strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
            
            cards = json.loads(content)
            return cards if isinstance(cards, list) else []

        except Exception as e:
            print(f"Flashcard generation error: {str(e)}")
            return []


ai_service = AIService()

