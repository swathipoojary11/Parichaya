# AURA — IndexedDB Data Model & Storage Specifications

**Database Name:** `aura_db`  
**Database Version:** `1`  
**Storage Mechanism:** Client-Side IndexedDB (Zero Cloud Persistence)  
**Wrapper Pattern:** Native Promise-Based Async IndexedDB Utility (`/lib/db.js`)  

---

## 1. Database Overview & Core Rules

All application state, user history, generated resumes, job audit reports, video/voice interview transcripts, evaluation cards, and quest progress are persisted locally in the user's browser using **IndexedDB**.

### Key Rules:
1. **Zero External Sync:** No record is transmitted to any cloud database or telemetry service.
2. **Auto-Increment Primary Keys:** Every store uses `id` as an auto-incrementing integer key path.
3. **Structured JSON Storage:** Complex nested objects (like structured resume sections, transcript histories, and STAR feedback metrics) are stored as native JSON objects.
4. **Index Optimization:** Indexes are defined on frequently queried fields (`profileId`, `createdAt`, `status`, `category`) to ensure sub-millisecond retrieval.

---

## 2. Object Stores Schema & Specifications

```
                           +------------------------+
                           |     aura_db (v1)       |
                           +-----------+------------+
                                       |
     +-----------------+---------------+----------------+------------------+
     |                 |               |                |                  |
     v                 v               v                v                  v
+----+----+      +-----+---+      +----+-----+    +-----+-----+     +------+-----+
| profiles|      | resumes |      | job_desc |    | sessions  |     | user_stats |
+---------+      +---------+      +----------+    +-----------+     +------------+
                       |               |                |
                       +-------+-------+                v
                               |               +--------+-------+
                               v               | session_feed   |
                         +-----+----+          +----------------+
                         |  quests  |
                         +----------+
```

---

### 2.1 Store: `profiles`
Stores the active candidate profile, target career track, level, total XP, and active streak stats.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_email` (`email`, unique: true)
  - `by_createdAt` (`createdAt`, unique: false)

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1, // Number (Primary Key)
  fullName: "Alex Rivera",
  email: "alex@example.com",
  targetRole: "Full Stack Engineer",
  level: "Placement Novice", // Level 1: "Placement Novice" | Level 2: "Tech Apprentice" | Level 3: "Job-Ready Slayer"
  xp: 450, // Number (Cumulative XP)
  readinessScore: 68, // Number (0 - 100%)
  streakCount: 4, // Number (Active consecutive days)
  lastActiveDate: "2026-09-13",
  createdAt: "2026-09-13T10:00:00.000Z",
  updatedAt: "2026-09-13T16:00:00.000Z"
}
```

---

### 2.2 Store: `resumes`
Stores candidate resumes — both synthesized from AI Counselor intake and raw text extracted from uploaded PDFs.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_profileId` (`profileId`, unique: false)
  - `by_sourceType` (`sourceType`, unique: false) // 'intake' | 'upload'
  - `by_createdAt` (`createdAt`, unique: false)

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1,
  profileId: 1,
  sourceType: "intake", // "intake" | "upload"
  fileName: "Alex_Rivera_Resume.pdf", // Optional
  rawText: "Full Stack Engineer with 2 years of React and Node.js experience...",
  structuredData: {
    contact: {
      fullName: "Alex Rivera",
      email: "alex@example.com",
      phone: "+1-555-0199",
      linkedin: "linkedin.com/in/alexrivera",
      github: "github.com/alexrivera"
    },
    summary: "Passionate Full Stack Engineer focused on high-performance web applications...",
    education: [
      {
        institution: "Sahyadri College of Engineering",
        degree: "B.E. Computer Science",
        gradYear: "2026",
        gpa: "3.8/4.0"
      }
    ],
    experience: [
      {
        company: "Tech Start Corp",
        role: "Software Engineering Intern",
        duration: "Jun 2025 - Aug 2025",
        bullets: [
          "Optimized API response latency by 35% by implementing Redis caching.",
          "Engineered responsive React dashboards used by 10,000+ daily active users."
        ]
      }
    ],
    projects: [
      {
        title: "AURA — AI Career Suite",
        techStack: ["Next.js", "Tailwind CSS", "IndexedDB", "Ollama"],
        bullets: [
          "Architected 100% on-device speech processing engine over WebSockets."
        ]
      }
    ],
    skills: {
      languages: ["JavaScript", "Python", "SQL", "HTML/CSS"],
      frameworks: ["React", "Next.js", "Node.js", "Express"],
      tools: ["Git", "Docker", "IndexedDB", "VS Code"]
    }
  },
  createdAt: "2026-09-13T10:30:00.000Z"
}
```

---

### 2.3 Store: `job_descriptions`
Stores target Job Descriptions (JDs) ingested for ATS auditing.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_profileId` (`profileId`, unique: false)
  - `by_createdAt` (`createdAt`, unique: false)

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1,
  profileId: 1,
  roleTitle: "Frontend Developer",
  companyName: "Acme Innovations",
  rawText: "We are seeking a Frontend Developer proficient in React, Tailwind CSS, and WebSockets...",
  extractedSkills: {
    required: ["React", "JavaScript", "Tailwind CSS", "REST APIs"],
    preferred: ["WebSockets", "IndexedDB", "Jest"],
    softSkills: ["Communication", "Problem Solving", "Agile"]
  },
  createdAt: "2026-09-13T11:00:00.000Z"
}
```

---

### 2.4 Store: `mock_sessions`
Stores metadata and live telemetry logs for Video/Voice mock interview practice sessions.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_profileId` (`profileId`, unique: false)
  - `by_sessionType` (`sessionType`, unique: false) // 'behavioral' | 'technical' | 'hr'
  - `by_createdAt` (`createdAt`, unique: false)

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1,
  profileId: 1,
  jobDescriptionId: 1,
  sessionType: "technical", // "behavioral" | "technical" | "hr"
  videoEnabled: true,
  audioEnabled: true,
  durationSeconds: 420, // 7 minutes
  transcriptLog: [
    {
      speaker: "interviewer",
      text: "Can you explain how you handle state management in a Next.js client component?",
      timestamp: "00:05"
    },
    {
      speaker: "candidate",
      text: "Um, I usually use React useState for component state and Context API or Zustand when state needs to be shared across routes...",
      timestamp: "00:15",
      wpm: 142,
      fillerWordsDetected: ["um"]
    }
  ],
  telemetrySummary: {
    averageWpm: 145, // Target: 130 - 160 WPM
    totalFillerWords: 6,
    fillerWordsBreakdown: { um: 4, like: 2 },
    clarityScore: 82
  },
  status: "completed", // "in_progress" | "completed"
  createdAt: "2026-09-13T14:00:00.000Z"
}
```

---

### 2.5 Store: `session_feedback`
Stores post-session AI evaluation reports generated by Qwen2.5 3B.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_sessionId` (`sessionId`, unique: true)
  - `by_profileId` (`profileId`, unique: false)
  - `by_createdAt` (`createdAt`, unique: false)

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1,
  sessionId: 1,
  profileId: 1,
  overallScore: 85, // 0 - 100
  starScores: {
    situation: 88,
    task: 82,
    action: 86,
    result: 84
  },
  dimensionScores: {
    relevance: 90,
    clarity: 82,
    confidence: 80,
    technicalDepth: 88
  },
  strengths: [
    "Clear explanation of React state boundaries.",
    "Strong technical terminology and STAR methodology structure."
  ],
  improvements: [
    "Reduce filler word frequency (um used 4 times).",
    "Elaborate more on quantifiable results achieved in previous projects."
  ],
  actionableTips: [
    "Pause for 2 seconds before answering instead of using 'um'.",
    "Include exact percentage metrics when describing performance optimizations."
  ],
  createdAt: "2026-09-13T14:10:00.000Z"
}
```

---

### 2.6 Store: `quests`
Stores gamified remediation tasks unlocked based on ATS skill gaps and interview recommendations.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_profileId` (`profileId`, unique: false)
  - `by_status` (`status`, unique: false) // 'pending' | 'completed'
  - `by_category` (`category`, unique: false) // 'dsa' | 'resume' | 'interview'

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1,
  profileId: 1,
  skillGap: "WebSockets",
  title: "Master Real-Time Event Patterns",
  description: "Learn sliding window / event buffer patterns for high-frequency WebSocket data.",
  xpReward: 100,
  category: "dsa", // "dsa" | "resume" | "interview"
  leetCodePattern: "Sliding Window",
  recommendedProblems: [
    { name: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" }
  ],
  status: "pending", // "pending" | "completed"
  completedAt: null,
  createdAt: "2026-09-13T11:15:00.000Z"
}
```

---

### 2.7 Store: `user_stats`
Stores historical snapshots of candidate readiness scores for tracking improvement over time.

- **Key Path:** `id` (autoIncrement: true)
- **Indexes:**
  - `by_profileId` (`profileId`, unique: false)
  - `by_date` (`date`, unique: false)

#### Record Structure (JavaScript Schema):
```javascript
{
  id: 1,
  profileId: 1,
  date: "2026-09-13",
  readinessScore: 68,
  atsScore: 72,
  interviewScore: 85,
  questsCompletedCount: 3,
  xpEarnedToday: 250
}
```

---

## 3. Database Utility Contract (`/lib/db.js`)

The native IndexedDB utility wrapper exposes clear promise-based CRUD methods:

```javascript
// Database initialization contract
export function initDB() { /* Opens aura_db v1, creates stores & indexes if needed */ }

// Generic CRUD Operations
export function addItem(storeName, item) { /* Returns Promise<id> */ }
export function getItem(storeName, id) { /* Returns Promise<Object> */ }
export function getAllItems(storeName) { /* Returns Promise<Array> */ }
export function updateItem(storeName, item) { /* Returns Promise<id> */ }
export function deleteItem(storeName, id) { /* Returns Promise<void> */ }

// Index Query Operations
export function getItemsByIndex(storeName, indexName, queryValue) { /* Returns Promise<Array> */ }
```
