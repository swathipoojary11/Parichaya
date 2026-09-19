# PARICHAYA (AURA) — Database Schema

## Database: `AuraDB` (IndexedDB via `idb`)
**Version**: 1

---

## Object Stores

### 1. `users`
**Key Path**: `email` (unique)

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Primary key, user email |
| `name` | string | Display name |
| `passwordHash` | string | SHA-256 hashed password |
| `createdAt` | number | Unix timestamp |
| `theme` | string | `'dark'` or `'light'` |
| `xp` | number | Total experience points |
| `level` | number | Current level (calculated from XP) |

### 2. `profiles`
**Key Path**: `email`

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Foreign key → users |
| `targetRole` | string | Selected role (Full Stack, Frontend, etc.) |
| `education` | string | Highest education + specialization |
| `skills` | string[] | Array of technical skills |
| `standoutProject` | object | `{ description, metrics }` |
| `collaborationStory` | string | Teamwork / incident story |
| `updatedAt` | number | Unix timestamp |

### 3. `resumes`
**Key Path**: `id` (auto-increment)
**Indexes**: `email`

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-increment primary key |
| `email` | string | Foreign key → users |
| `resumeJSON` | object | Structured resume data |
| `pdfBlob` | Blob | Generated PDF binary |
| `source` | string | `'counselor'` or `'upload'` |
| `createdAt` | number | Unix timestamp |

### 4. `atsResults`
**Key Path**: `id` (auto-increment)
**Indexes**: `email`

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-increment primary key |
| `email` | string | Foreign key → users |
| `resumeId` | number | Foreign key → resumes |
| `jobDescription` | string | Target JD text |
| `overallScore` | number | 0-100 weighted score |
| `skillMatchScore` | number | 0-100 (30% weight) |
| `xyzScore` | number | 0-100 (30% weight) |
| `actionVerbScore` | number | 0-100 (20% weight) |
| `structureScore` | number | 0-100 (20% weight) |
| `matchedSkills` | string[] | Skills found in both resume & JD |
| `missingSkills` | string[] | Skills in JD but not resume |
| `suggestions` | object[] | `[{ bullet, original, rewrite }]` |
| `createdAt` | number | Unix timestamp |

### 5. `interviews`
**Key Path**: `id` (auto-increment)
**Indexes**: `email`

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-increment primary key |
| `email` | string | Foreign key → users |
| `attemptNumber` | number | 1, 2, 3... for comparison |
| `transcript` | object[] | `[{ role, content, timestamp }]` |
| `speechMetrics` | object | `{ avgWPM, fillerCount, fillers, pauseDurations }` |
| `evaluation` | object | `{ technicalScore, starScore, clarityScore, feedback }` |
| `createdAt` | number | Unix timestamp |

### 6. `gameProgress`
**Key Path**: `[email, gameId]` (compound key)

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Foreign key → users |
| `gameId` | string | Game identifier (e.g., `'xyz-builder'`, `'water-jug'`) |
| `highScore` | number | Best score achieved |
| `xpEarned` | number | Total XP earned in this game |
| `completedLevels` | number[] | Array of completed level IDs |
| `lastPlayedAt` | number | Unix timestamp |

---

## Indexes Summary

| Store | Index | Key Path | Unique |
|-------|-------|----------|--------|
| `resumes` | `by-email` | `email` | No |
| `atsResults` | `by-email` | `email` | No |
| `interviews` | `by-email` | `email` | No |
| `gameProgress` | (compound PK) | `[email, gameId]` | Yes |

## Migration Strategy
- Version 1: Initial schema (all 6 stores)
- Future versions: Use `idb` upgrade callback for additive migrations
