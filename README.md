# StudyGenius – AI Study Assistant 

The ultimate AI study tool with:

# Demo Student Accounts

| Email | Password |
|-------|----------|
| student1@study.com | pass123 |
| student2@study.com | pass123 |
| student3@study.com | pass123 |
| student4@study.com | pass123 |
| student5@study.com | pass123 |

> Any of these emails + the password `pass123` will log you in.  
> The app remembers your session until you click **Logout**.

## 🚀 How to Run Locally

1. Download `index.html`, `styles.css`, `script.js`, `README.md`.
2. Place them in the same folder.
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
4. No server, no build step – it runs entirely in the browser.

## 🔌 Backend API Alignment

The app makes two POST requests to your live backend:

| Feature | Endpoint | Field | Expected response |
|---------|----------|-------|-------------------|
| Quiz Generation | `/upload` | `pdf` (file) | `{ questions: [ { question, options, correctIndex } ] }` |
| Summary Generation | `/summarize` | `pdf` (file) | `{ summary: "text..." }` |

If the API is unavailable or returns an error, the quiz falls back to the built‑in 20‑question demo – **the app never breaks**.

To change the API base URL, edit these two lines in `script.js`:

```javascript
const API_URL = "https://studygenius-ai-mmek.onrender.com/upload";
const SUMMARY_API = "https://studygenius-ai-mmek.onrender.com/summarize";
