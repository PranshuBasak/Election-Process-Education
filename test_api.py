import asyncio
import httpx

async def test_api():
    base = "http://127.0.0.1:8000/api"
    async with httpx.AsyncClient() as client:
        # Health
        res = await client.get(f"{base}/health")
        print("Health:", res.status_code, res.text)
        
        # Timeline
        res = await client.get(f"{base}/timeline")
        print("Timeline:", res.status_code)
        
        # Learn
        res = await client.get(f"{base}/learn")
        print("Learn Modules:", res.status_code)
        
        # Glossary
        res = await client.get(f"{base}/glossary")
        print("Glossary:", res.status_code)
        
        # Sources
        res = await client.get(f"{base}/sources")
        print("Sources:", res.status_code)

        # Chat
        res = await client.post(f"{base}/chat", json={"message": "What is the Model Code of Conduct?", "locale": "en"})
        print("Chat:", res.status_code, "Intent:", res.json().get("intent", "None"))
        
        # Quiz
        res = await client.post(f"{base}/quiz", json={"topic": "Voting Eligibility", "difficulty": "medium", "count": 1, "locale": "en"})
        print("Quiz:", res.status_code)

        # Eligibility
        res = await client.post(f"{base}/eligibility", json={"age": 20, "nationality": "Indian", "has_epic": True})
        print("Eligibility:", res.status_code, "Eligible:", res.json().get("eligible", False))
        
        # Polling
        res = await client.get(f"{base}/polling?q=Mumbai")
        print("Polling:", res.status_code)

if __name__ == "__main__":
    asyncio.run(test_api())
