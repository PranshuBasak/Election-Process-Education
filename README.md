# 🗳️ Election Process Education

An AI-powered assistant designed to educate Indian citizens about the election process, voter registration, polling locations, and election timelines.

## 🚀 Overview

This project is a full-stack application consisting of:
- **Frontend**: A modern, responsive Next.js 16 application with a chat interface, interactive timelines, and educational modules.
- **Backend**: A FastAPI-based Python server that handles AI processing (via Google Gemini), data retrieval from official sources (ECI), and RAG (Retrieval-Augmented Generation).

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Components**: Shadcn UI
- **AI Integration**: Vercel AI SDK

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.13
- **AI Model**: Google Gemini 1.5 Pro / Flash
- **Caching**: In-memory TTL caching for API responses
- **Connectors**: ECI (Election Commission of India) API connectors

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- Google AI (Gemini) API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PranshuBasak/Election-Process-Education.git
   cd Election-Process-Education
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   ```

3. **Backend Setup**:
   ```bash
   # It is recommended to use a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running Locally

1. **Start the Backend Server**:
   ```bash
   # From the root directory
   $env:PYTHONPATH="."  # Windows PowerShell
   python -m uvicorn backend.main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`.

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 📂 Project Structure

```
├── app/                # Python application logic (Services, Models)
├── backend/            # FastAPI entry point and routers
├── src/                # Next.js frontend source
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   └── lib/            # Utilities and shared logic
├── public/             # Static assets
└── web/                # (Optional) Legacy Vite-based web interface
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
