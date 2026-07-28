# InterVue.AI - AI Interview Assistant

InterVue.AI is an enterprise-grade full-stack web application prototype designed to help candidates prepare for technical and behavioral job interviews. It parses resumes against target job descriptions, seeds relevant interview questions, hosts an interactive practice simulator with speech amplitude trackers and pacing heuristics, and outputs granular STAR-method analytics with ideal model answers.

---

## Technical Stack

*   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, React Router v7.
*   **Backend**: Node.js, Express.js, JWT Authentication, CORS Security, Express Rate-Limiters.
*   **Database**: MongoDB connected via Mongoose ODM.

---

## Project Folder Structure

```
smart-interview-assistant/
├── dist/                # Frontend production bundle
├── public/              # Static assets
├── src/                 # React frontend codebase
│   ├── components/      # UI Layout blocks (Navbar, Footer, ProtectedRoute)
│   ├── pages/           # Application views (Dashboard, Resume, Room, Results)
│   ├── App.jsx          # Entry point & router configuration
│   ├── api.js           # Central API fetch wrapper (HttpOnly handling & token refresh)
│   └── index.css        # Global CSS, scrollbar styles, and soundwave animations
├── server/              # Express backend server codebase
│   ├── config/          # Database configuration logic (db.js)
│   ├── controllers/     # MVC controller logic (auth, resume, interview controllers)
│   ├── middleware/      # JWT verifiers & error handlers
│   ├── models/          # Mongoose Schemas (User, Resume, Interview)
│   ├── routes/          # API Route routers mapping
│   ├── .env.example     # Environment template variables
│   └── index.js         # Express main entry point running rate-limiters
├── package.json         # Frontend configs & scripts
└── README.md            # Project release documentation
```

---

## Security Architecture

Our full-stack authentication system implements the following security patterns:

1.  **Strict Plaintext Password Rules**: Registration requires a minimum of 8 characters containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.
2.  **HttpOnly Refresh Cookies**: Access tokens are short-lived (15 minutes) and returned in the JSON payload, while refresh tokens (7 days) are set in a secure, `HttpOnly`, `SameSite=Strict` cookie (`jid`) to mitigate XSS and CSRF.
3.  **Timing-Attack Prevention**: A dummy password check runs on the login API if an email is not found in MongoDB. This ensures uniform processing duration to prevent username enumeration.
4.  **Rate Limiting**: Integrated `express-rate-limit` to restrict endpoints from brute-force attempts (100 total API requests / 15m; restricted to 10 register/login requests / 15m).
5.  **CORS Setup**: CORS configuration enforces credential cookie exchange (`credentials: true`) and restricts allowed origins to the Vite local dev server port.

---

## Getting Started

### Local Prerequisites
*   Node.js (v18+)
*   MongoDB local community instance (`mongod`) running on port `27017`

### Environment Configuration
1.  Navigate to `server/` folder and create a `.env` file based on `.env.example`:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/intervue-ai
    JWT_SECRET=supersecretjwtkeyforintervueai
    ```

### Installation & Launch

#### Step 1: Start Backend Server
```bash
cd server
npm install
npm start
```
*   Backend API runs at: `http://localhost:5000`
*   Health-check endpoint: `http://localhost:5000/api/health`

#### Step 2: Start Frontend Application
Open a separate terminal window:
```bash
npm install
npm run dev
```
*   Frontend server runs at: `http://localhost:5173/`

---

## API Documentation

### 1. Authentication (`/api/auth`)
*   `POST /register`: Registers user credentials, hashes password, sets HttpOnly refresh cookie, and returns access token.
*   `POST /login`: Authenticates credentials and issues tokens.
*   `POST /refresh`: Verifies the cookie refresh token and rotates access tokens.
*   `POST /logout`: Clears the cookie and database sessions.
*   `GET /profile`: Protected route returning the current candidate's profile.

### 2. Resumes (`/api/resumes`)
*   `POST /analyze`: Evaluates upload resume metadata and returns skills matches and target role insights.

### 3. Interviews (`/api/interviews`)
*   `POST /start`: Prepares questions matching the selected target role and starts the session.
*   `POST /:id/submit`: Evaluates spoken transcripts and returns STAR compliance metrics.
*   `GET /history`: Returns candidate dashboard past report logs.
