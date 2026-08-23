import os
import json
import httpx
from typing import Dict, Any, Optional
from app.config import settings

class LLMProvider:
    @staticmethod
    async def generate_json(prompt: str, system_instruction: str = "") -> Optional[Dict[str, Any]]:
        # Only attempt remote API if key is explicitly configured
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "contents": [{"parts": [{"text": f"{system_instruction}\n\n{prompt}\n\nRespond ONLY with valid JSON."}]}],
                    "generationConfig": {"responseMimeType": "application/json"}
                }
                async with httpx.AsyncClient(timeout=3.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        text_out = data['candidates'][0]['content']['parts'][0]['text']
                        return json.loads(text_out)
            except Exception:
                pass

        # Zero-delay fallback to deterministic heuristic intelligence engine
        return None
