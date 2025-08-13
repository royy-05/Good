ThinkTube AI
AI-powered YouTube video analysis that turns any link into clear summaries, topics, and actionable insights—within seconds. 
thinktube-ai.vercel.app

Live App: https://thinktube-ai.vercel.app/

✨ Features
One-click analysis: Paste a YouTube URL and get results fast.
Content summary: Concise overview with key points & highlighted timestamps. 
thinktube-ai.vercel.app
Topic extraction: Auto-detects themes and subjects discussed. 
thinktube-ai.vercel.app

Sentiment analysis: Understand the emotional tone to gauge engagement. 
thinktube-ai.vercel.app

AI assistant presets: Quick actions like Summarize Video, Main Topics, and Key Points. 
thinktube-ai.vercel.app

🧱 Tech Stack
Frontend: React + Next.js (deployed on Vercel)
APIs: YouTube Data API v3 for metadata/transcripts, LLM provider for analysis (OpenAI or Gemini)
Runtime: Edge/Serverless functions with in-memory rate limitin
Styling/UI: Modern, responsive UI (utility-first CSS)

If you’re using a different stack/provider, update this section accordingly.

📦 Getting Started
Prerequisites
Node.js 18+

A YouTube Data API v3 key
An LLM API key (OpenAI or Gemini)

1) Clone & Install
bash
Copy
Edit
git clone https://github.com/royy-05>/thinktube-ai.git
cd thinktube-ai
npm install
2) Configure Environment
Create a .env.local file in the project root:

bash
Copy
Edit
# YouTube
YOUTUBE_API_KEY=your_youtube_api_key

# Choose ONE of the following (or support both in code)
OPENAI_API_KEY=your_openai_key
# or
GEMINI_API_KEY=your_gemini_key

# Optional tuning
MAX_DESCRIPTION_LENGTH=10000
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
Notes
• YOUTUBE_API_KEY must have YouTube Data API v3 enabled in Google Cloud.
• If using Gemini, ensure the corresponding SDK is configured in your API route.
• Values above mirror sensible defaults; adjust to match your implementation.

3) Run Dev Server
bash
Copy
Edit
npm run dev
Open http://localhost:3000

4) Build & Deploy
bash
Copy
Edit
npm run build
npm run start
Deploy to Vercel (recommended) or your preferred platform.

🧠 How It Works (High-Level)
bash
Copy
Edit
YouTube URL → Fetch metadata/transcript → LLM prompts
            → Summaries / Topics / Sentiment → Render UI cards & sections
API routes handle:

Validating the YouTube URL

Fetching video details/transcripts (where available)

Prompting the LLM for summaries, topics, and sentiment

Returning structured JSON for the UI

Basic rate limiting prevents abuse on serverless deployments.

🗂️ Project Structure (example)
bash
Copy
Edit
/
├─ app/ or pages/
│  ├─ page.tsx / index.tsx         # Landing / Analyzer UI
│  └─ api/
│     └─ analyze/route.ts or .js   # Serverless/Edge function for analysis
├─ components/                      # UI components
├─ lib/                             # YouTube/LLM helpers, parsing, prompts
├─ styles/                          # Global styles
└─ README.md
Adjust to match your actual file layout.

🔐 Security & Privacy
Keys are stored in server-side environment variables.
Requests are rate-limited.
No user credentials are required to use the analyzer.

✅ Usage
Click Analyze Video.
Paste a YouTube URL.
Choose a preset (Summarize Video, Main Topics, Key Points) or read the generated sections.

🧰 Troubleshooting
“API key not valid” / 400 errors
Make sure the correct key is in .env.local, YouTube Data API v3 is enabled, and you restarted the dev server after changes.
403 / quota exceeded
Check your YouTube API quota in Google Cloud. Consider caching or batching requests.
No transcript available
Some videos lack transcripts or block access. Fallback to metadata-based summaries or ask the user for a different link.
Rate limit triggered
Reduce rapid sequential requests or increase the RATE_LIMIT_* values responsibly.

🛣️ Roadmap
 Multilingual summaries
 Per-section timestamps & jump links
 Export to PDF/Notion
 Channel-level analytics
 Fine-tuned prompt controls

🤝 Contributing
Fork the repo
Create a feature branch: git checkout -b feat/my-feature
Commit: git commit -m "feat: add X"
Push: git push origin feat/my-feature
Open a Pull Request

📄 License
MIT — see LICENSE for details.

🙌 Acknowledgements
YouTube Data API v3
OpenAI / Google Gemini (LLM analysis)
Vercel (hosting)
