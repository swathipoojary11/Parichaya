# Workflow

## 1. User Journey
1. **Onboarding**: User creates a local account (saved in IndexedDB).
2. **Intake (`/counselor`)**: 
   - Option A: Upload resume. System parses and verifies claims against evidence.
   - Option B: Interactive interview with Cat AI to assess skills.
3. **Assessment (`/ats`)**: The system analyzes skills against industry standards.
4. **Dashboard (`/dashboard`)**: Central hub showing current level, active missions, and progress.
5. **Arena (`/arena`)**:
   - DSA Practice
   - Soft Skills Assessment
6. **Interview Prep (`/interview`)**: Voice-based mock interviews with the Cat AI Coach.
7. **Adaptive Loop**: AI creates "Missions" dynamically based on areas of weakness.

## 2. Data Flow
- User Input -> React State -> Local Ollama Inference -> State Update -> IndexedDB Persistence
