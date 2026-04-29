import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
print(f"Testing API Key: {api_key[:10]}...")

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello!")
    print("Success with google-generativeai!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Failed with google-generativeai: {e}")

try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    
    project = os.getenv("VERTEX_PROJECT")
    location = os.getenv("VERTEX_LOCATION", "us-central1")
    
    # Try with api_key if supported (requires newer sdk)
    try:
        vertexai.init(project=project, location=location, api_key=api_key)
        model = GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Say hello!")
        print("Success with vertexai (API Key)!")
    except TypeError:
        print("vertexai.init does not support api_key in this version.")
    except Exception as e:
        print(f"Failed with vertexai (API Key): {e}")
except ImportError:
    print("vertexai not installed or import failed.")
