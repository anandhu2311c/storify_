from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import tempfile
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
import json


load_dotenv()

app = FastAPI()

# CORS for local dev (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face API setup
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HUGGINGFACE_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"

# Groq setup for story generation and transcription
LLm_API_KEY = os.getenv("LLm_API_KEY")
client = OpenAi(api_key=LLm_API_KEY)

@app.post("/api/process-dream")
async def process_dream(
    audio: UploadFile = File(...),
    style: str = Form(...)
):
    print("=" * 50)
    print("✅ Received POST request to /api/process-dream")
    print(f"📁 Uploaded file name: {audio.filename}")
    print(f"📁 File content type: {audio.content_type}")
    print(f"🎨 Style chosen: {style}")
    
    # Check if API keys are available
    if not GROQ_API_KEY:
        print("❌API_KEY not found in environment")
        raise HTTPException(status_code=500, detail=" API key not configured")
    
    if not HUGGINGFACE_API_KEY:
        print("⚠️ HUGGINGFACE_API_KEY not found, will use fallback emotions")

    # Step 1: Transcribe the audio using  Whisper
    try:
        # Read the audio file
        audio_bytes = await audio.read()
        print(f"📊 Audio file size: {len(audio_bytes)} bytes")
        
        if len(audio_bytes) == 0:
            print("❌ Empty audio file received")
            raise HTTPException(status_code=400, detail="Empty audio file received")

        # Create a temporary file to save the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
            temp_file.write(audio_bytes)
            temp_file_path = temp_file.name
            print(f"💾 Saved audio to temp file: {temp_file_path}")

        # Use Whisper API for transcription
        print("🎯 Calling  Whisper API...")
        with open(temp_file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3",
                language="en"  # Optional: specify language
            )
        
        transcribed_text = transcription.text.strip()
        print(f"📝 Transcribed text: '{transcribed_text}'")
        print(f"📏 Transcription length: {len(transcribed_text)} characters")
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        print("🗑️ Cleaned up temporary file")
        
        if not transcribed_text:
            print("❌ No speech detected in audio")
            raise HTTPException(status_code=400, detail="No speech detected in audio")

    except Exception as e:
        print(f"❌ Error in transcription: {type(e).__name__}: {e}")
        # Clean up temp file if it exists
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
                print("🗑️ Cleaned up temporary file after error")
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    # Step 2: Analyze emotion using Hugging Face
    try:
        if not HUGGINGFACE_API_KEY:
            print("⚠️ Skipping emotion analysis - no API key")
            dominant_emotion = "mysterious"
            secondary_emotion = "contemplative"
        else:
            print("🎭 Calling Hugging Face emotion analysis...")
            headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
            response = requests.post(
                HUGGINGFACE_URL,
                headers=headers,
                json={"inputs": transcribed_text},
                timeout=30
            )
            
            if response.status_code != 200:
                dominant_emotion = "neutral"
                secondary_emotion = "contemplative"
            else:
                emotion_data = response.json()
                print(f"🎭 Raw emotion data: {emotion_data}")
                if isinstance(emotion_data, list) and len(emotion_data) > 0:
                    emotion_scores = emotion_data[0]
                    sorted_emotions = sorted(emotion_scores, key=lambda x: x['score'], reverse=True)
                    dominant_emotion = sorted_emotions[0]['label']
                    secondary_emotion = sorted_emotions[1]['label'] if len(sorted_emotions) > 1 else "neutral"
                else:
                    dominant_emotion = "neutral"
                    secondary_emotion = "contemplative"
        
        print(f"🎭 Final emotions: {dominant_emotion}, {secondary_emotion}")
        
    except Exception as e:
        print(f"❌ Error in emotion analysis: {type(e).__name__}: {e}")
        # Use fallback emotions
        dominant_emotion = "mysterious"
        secondary_emotion = "contemplative"

    # Step 3: Generate story using  LLM
    try:
        print("📖 Generating story with LLM...")
        # Create a more detailed prompt based on style
        style_instructions = {
            "Shakespearean": "Write in the style of Shakespeare with poetic language, metaphors, and dramatic flair. Use archaic language patterns and rich imagery.",
            "Tarantino": "Write in Quentin Tarantino's style with sharp dialogue, non-linear narrative elements, and vivid, cinematic descriptions.",
            "Sci-Fi": "Write as a science fiction story with futuristic elements, advanced technology, and speculative concepts."
        }
        
        style_instruction = style_instructions.get(style, "Write as a compelling narrative story.")
        
        prompt = f"""Transform this dream fragment into a captivating short story (200-400 words).

Dream Fragment: "{transcribed_text}"
Dominant Emotion: {dominant_emotion}
Secondary Emotion: {secondary_emotion}
Style: {style_instruction}

Create a story that:
1. Captures the essence and mood of the dream
2. Incorporates the dominant emotions naturally
3. Maintains the dreamlike, surreal quality
4. Has a clear beginning, middle, and end
5. Uses vivid, sensory descriptions

Story:"""

        print(f"📝 Story prompt created (length: {len(prompt)} chars)")
        
        story_response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a creative writer who specializes in transforming dream fragments into compelling short stories. Focus on atmosphere, emotion, and vivid imagery."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=800,
            temperature=0.8
        )
        
        story_text = story_response.choices[0].message.content.strip()
        print(f"📖 Story generated successfully (length: {len(story_text)} chars)")
        
    except Exception as e:
        print(f"❌ Error in story generation: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")

    # Return the complete output
    result = {
        "transcribed_text": transcribed_text,
        "dominant_emotion": dominant_emotion,
        "secondary_emotion": secondary_emotion,
        "story": story_text,
        "style": style,
        "status": "success"
    }
    
    print("✅ Request processed successfully")
    print("=" * 50)
    return result

@app.get("/")
async def root():
    return {"message": "Dream Story API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working"}

@app.get("/api/dreams/{dream_id}")
async def get_dream_by_id(dream_id: str):
    file_path = f"dreams/{dream_id}.json"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dream not found")
    
    with open(file_path, "r") as f:
        dream_data = json.load(f)
    return JSONResponse(content=dream_data)

# Run the app locally
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
