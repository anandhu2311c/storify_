# 🌙 Storify – AI-Powered Dream Journal ✨

**Storify** is a voice-powered dream journal app that helps you **capture**, **transform**, and **store** your dreams in a creative and meaningful way. Speak your dreams when you wake up, and Storify uses **AI** to transcribe your thoughts, analyze the mood, and generate a beautifully written story in your chosen style — be it Shakespearean, Sci-Fi, or something bold like a Tarantino thriller.

---

### 📸 Features

- 🎤 **Voice Recording**  
  Capture your dreams as soon as you wake up by simply speaking.

- 🧠 **AI-Powered Story Generator**  
  Converts your dream fragments into a rich, styled story using **OpenAI**.

- 🗣️ **Whisper (Hugging Face)**  
  Audio transcription powered by **Whisper ASR** via **Hugging Face Transformers**.

- 💾 **Dream Journal**  
  Save, revisit, and relive your dreams through a timeline of generated stories.

- 🌈 **Emotion & Symbol Extraction**  
  Understand the emotions and symbols embedded in your dreams.

- 🎨 **Story Style Selection**  
  Choose from multiple creative writing styles to shape your dream narrative.

- 🌘 **Dark Mode Support**  
  Designed for comfort, even in the middle of the night.

---

### 🧠 Tech Stack

- **Frontend**: React + TypeScript, TailwindCSS, React Router, Framer Motion, Lucide Icons  
- **Backend**: FastAPI (Python), **Whisper (Hugging Face)** for transcription, **OpenAI** for story generation  
- **Database**: SQLite (can be swapped with Supabase/PostgreSQL)

---

 ![Screenshot 1](https://github.com/anandhu2311c/storify_/blob/1a54f21d87f16e2f46277c51319089427f0d5ae4/images/1.png?raw=true) 
 ![Screenshot 2](https://github.com/anandhu2311c/storify_/blob/1a54f21d87f16e2f46277c51319089427f0d5ae4/images/2.png?raw=true) 
 ![Screenshot 4](https://github.com/anandhu2311c/storify_/blob/1a54f21d87f16e2f46277c51319089427f0d5ae4/images/4.png?raw=true) 
 ![Screenshot 5](https://github.com/anandhu2311c/storify_/blob/1a54f21d87f16e2f46277c51319089427f0d5ae4/images/5.png?raw=true) 
 ![Screenshot 6](https://github.com/anandhu2311c/storify_/blob/1a54f21d87f16e2f46277c51319089427f0d5ae4/images/6.png?raw=true) 
 ![Screenshot 7](https://github.com/anandhu2311c/storify_/blob/1a54f21d87f16e2f46277c51319089427f0d5ae4/images/7.png?raw=true) 

---

### 🚀 How It Works

1. **Record Your Dream**  
   Hit the mic, speak your dream fragments — no typing needed.

2. **Transcribe with Whisper**  
   Audio is transcribed using Whisper via Hugging Face.

3. **Generate Story with OpenAI**  
   The transcription is sent to OpenAI to craft a full-length story in your selected style.

4. **Sentiment + Emotion Analysis**  
   We detect emotions and symbols to give deeper insights.

5. **Save & Revisit**  
   View, save, and revisit your stories anytime in the journal.

---

### ⚙️ Backend Setup

1. **Install Dependencies**
```bash
pip install -r requirements.txt
````

2. **Start the FastAPI Server using Uvicorn**

```bash
uvicorn app.main:app --reload
```

The backend will run at `http://localhost:8000`.

Make sure `.env` contains your **OpenAI API key**:

```
OPENAI_API_KEY=your-openai-key-here
```

---

### 📌 Frontend Setup

```bash
# Clone the repository
git clone https://github.com/anandhu2311c/storify_.git
cd storify_

# Install dependencies
npm install

# Run the frontend
npm run dev
```

