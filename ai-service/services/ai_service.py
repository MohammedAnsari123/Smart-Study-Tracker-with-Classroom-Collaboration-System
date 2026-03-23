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
            "You are a STRICTLY STUDY-ONLY assistant for the 'Smart Study' platform. "
            "RULES YOU MUST FOLLOW:\n"
            "1. ONLY answer questions related to academics, education, studying, learning, homework, exams, concepts, subjects, and coursework.\n"
            "2. If a user asks about ANYTHING not related to studying or academics (e.g., jokes, news, coding projects, personal advice, entertainment, politics, weather, recipes, gaming, social media), "
            "you MUST politely decline by saying: 'I'm your Study Assistant and can only help with academic and study-related topics. Please ask me something related to your studies!'\n"
            "3. Your responses should be DETAILED and INFORMATIVE — aim for around 1500 to 2000 words. Use bullet points, bold text, and markdown formatting for clarity.\n"
            "4. Cover the topic thoroughly but stay focused. Do not generate endless exhaustive lists or full multi-phase roadmaps.\n"
            "5. If a topic is very broad, give a solid overview and offer to dive deeper into specific parts.\n"
            "6. Do NOT cut off mid-sentence. Finish your thought within the word limit.\n"
            "7. Avoid conversational filler. Get straight to the academic point."
        )

    async def get_ai_response(self, user_message: str, history: list = [], context: str = ""):
        if not self.api_token:
            return "AI Error: Hugging Face API Token (HF_API_TOKEN) is missing in .env file."

        # Dynamically build system prompt with context if available
        current_system_prompt = self.system_prompt
        if context:
            current_system_prompt += (
                f"\n\nPERSONAL ACADEMIC PROFILE & STUDY CONTEXT:\n{context}\n\n"
                "Use the above profile/context (Curriculum, Flashcards, Sessions, Assignments) to answer accurately and personally. "
                "If the user asks about their specific progress, flashcards, or study history, refer to this data."
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
                    "max_tokens": 4096, # Detailed 2000 word answers
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

    async def generate_flashcards(self, subject: str, topics: list, syllabus_context: str = ""):
        if not self.api_token:
            return []

        prompt = (
            f"Generate a set of 10 high-quality flashcards for the subject '{subject}'.\n\n"
            f"==== MANDATORY CURRICULUM CONTEXT ====\n{syllabus_context}\n======================================\n\n"
            f"Use the following topics as secondary focus: {', '.join(topics)}.\n\n"
            "CRITICAL RULES FOR FLASHCARD GENERATION:\n"
            "1. ONLY generate flashcards that can be answered using the provided MANDATORY CURRICULUM CONTEXT.\n"
            "2. Ensure the 'question' is clear and the 'answer' is concise and accurate according to the context.\n"
            "3. DO NOT hallucinate facts or concepts outside the provided context.\n"
            "Return the response ONLY as a valid JSON array of objects in this format: "
            '[{"question": "What is X?", "answer": "X is Y."}, {"question": "Define Z.", "answer": "Z is A."}]'
        )

        print(f"Generating flashcards for {subject}...")
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
            print(f"Raw AI content length: {len(content)}")
            
            # Clean up potential markdown formatting or think blocks
            if "</think>" in content:
                content = content.split("</think>")[-1].strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
            
            print(f"Cleaned content for parsing: {content[:100]}...")
            cards = json.loads(content)
            print(f"Parsed {len(cards) if isinstance(cards, list) else 0} cards")
            return cards if isinstance(cards, list) else []

        except Exception as e:
            print(f"Flashcard generation error: {str(e)}")
            if 'content' in locals():
                print(f"Failed content snippet: {content[:200]}")
            return []

    async def generate_test(self, test_data: dict):
        if not self.api_token:
            return {"error": "HF_API_TOKEN missing", "questions": []}

        subject = test_data.get("subject", "General")
        topic = test_data.get("topic", "Various Topics")
        subtopic = test_data.get("subtopic", "")
        duration = test_data.get("durationMinutes", 30)
        notes = test_data.get("notes", "")

        prompt = (
            f"Generate a 10-question multiple-choice test for a student who just studied '{subject}' "
            f"focusing on the topic '{topic}'" + (f" and subtopic '{subtopic}'. " if subtopic else ". ") +
            f"They studied for {duration} minutes.\n\n"
            f"==== MANDATORY CONTEXT & NOTES ====\n{notes}\n==================================\n\n"
            "CRITICAL RULES FOR TEST GENERATION:\n"
            "1. ONLY ask questions that can be definitively answered using the provided MANDATORY CONTEXT & NOTES.\n"
            "2. DO NOT hallucinate concepts, theories, or facts outside of this strict boundary.\n"
            "3. If the context is limited, create deep, analytical questions about the limited text rather than inventing new topics.\n"
            "For each question, provide the 'question', a list of 4 'options', and the exact string of the 'correctAnswer' (which must be exactly one of the options). "
            "Return the response ONLY as a valid JSON object in this format: "
            '{"questions": [{"question": "What is x?", "options": ["y", "z", "w", "x"], "correctAnswer": "x"}]}'
        )

        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.primary_model,
                "messages": [
                    {"role": "system", "content": "You are a teacher evaluating a student. Return JSON strictly."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 2000,
                "temperature": 0.4,
                "stream": False
            }

            response = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            if "</think>" in content:
                content = content.split("</think>")[-1].strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
            
            parsed = json.loads(content)
            return parsed

        except Exception as e:
            print(f"Test generation error: {str(e)}")
            return {"error": str(e), "questions": []}

ai_service = AIService()
