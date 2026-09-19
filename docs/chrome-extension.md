# PARICHAYA AURA — Chrome Extension Architecture & Usage Guide

## Overview
The **Parichaya AURA Chrome Extension** is an authenticated companion client for the Parichaya Web Application. It runs as a Manifest V3 extension featuring Chrome Side Panel integration, DOM job description auto-extraction, and direct server-side ATS auditing against the user's active canonical resume.

---

## Key Features & Workflow

### 1. Single Canonical User Identity
- The extension does **NOT** maintain a separate database or login system.
- It authenticates directly against the Parichaya backend (`http://localhost:3000/api/me`).
- All analyzed jobs, ATS scores, skill evidence, XP, and missions persist under the same user account.

### 2. Active Canonical Resume Integration
- Uses the user's **Active Resume** (e.g., `Software_Engineer_Resume_v3.pdf`).
- The user is never prompted to re-upload their resume inside the extension if an active resume already exists on Parichaya.

### 3. Modular Job Extraction Adapters (`chrome-extension/content.js`)
The extension utilizes a modular adapter architecture to parse job postings:
- **`LinkedInAdapter`**: Extracts title, company, and description from LinkedIn job pages.
- **`IndeedAdapter`**: Extracts title, company, and description from Indeed job pages.
- **`GreenhouseAdapter`**: Extracts title, company, and description from Greenhouse job portals.
- **`GenericJobAdapter`**: General DOM fallback for arbitrary career pages and job boards.
- **Manual Fallback**: Allows users to paste raw job descriptions if automatic DOM parsing fails.

### 4. Direct Server-Side ATS Audit (`/api/jobs/analyze`)
- Extracted job details are transmitted to the Parichaya backend `/api/jobs/analyze`.
- The backend evaluates the job against the active resume using Parichaya's transparent ATS scoring engine (30% Required Skills, 20% Experience, 15% Projects/X-Y-Z formula, 15% Keywords, 10% Role Alignment, 5% Education, 5% Parsability).
- Returns **PARICHAYA Match Score** (e.g., `80/100`), Strong Matches (`✓`), Needs Work (`△`), and evidence graph recommendations.

### 5. Deep Linking & Skill Missions
- `[View Full ATS Audit]`: Opens `http://localhost:3000/ats` in the browser with full detailed breakdown.
- `[Start Preparation]`: Opens `http://localhost:3000/roadmap` for personalized 4-week skill bridge learning.
- `[Practice Interview]`: Opens `http://localhost:3000/interview` for AI voice mock interviews.

---

## How to Install the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `parichaya/chrome-extension` directory.
5. Pin the **Parichaya AURA** extension to your browser toolbar.
6. Open any job posting on LinkedIn, Indeed, Greenhouse, or a company career page, and click the extension icon or open Chrome Side Panel!
