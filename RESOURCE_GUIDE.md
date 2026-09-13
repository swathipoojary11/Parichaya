# AURA — Resource Guide & Dataset Specifications

**Version:** 1.0.0  
**Storage Path:** `/data` (Static JSON Datasets)  
**Purpose:** Provides deterministic evaluation rubrics, DSA problem pattern mappings, and industry skill templates for ATS audit matching and interview evaluation.

---

## 1. Overview of Static Datasets

AURA relies on curated static datasets stored in the local `/data` directory. These files operate completely offline and supply the core rules for:
1. ATS Skill Gap Detection & Remediation.
2. LeetCode DSA Quest Generation.
3. Video/Voice Interview STAR & Speech Cadence Scoring.

```
/data
 ├── dsa_patterns.json       # 10+ LeetCode patterns mapped to technical skills
 ├── interview_rubrics.json  # STAR methodology criteria, WPM cadence, filler words
 └── role_skill_maps.json    # Frontend, Backend, Fullstack, AI/ML role competency baselines
```

---

## 2. Dataset Breakdown

### 2.1 LeetCode DSA Patterns (`/data/dsa_patterns.json`)
Maps identified ATS missing technical skills directly to algorithm patterns and curated LeetCode problems:

| Pattern ID | Pattern Name | Mapped ATS Skill Gaps | Sample Recommended Problem |
| :--- | :--- | :--- | :--- |
| `two_pointers` | Two Pointers | Arrays, Strings, Sorting | *3Sum* (Medium) |
| `sliding_window` | Sliding Window | WebSockets, Data Streams, Buffers | *Longest Substring Without Repeating Chars* |
| `fast_slow_pointers` | Fast & Slow Pointers | Linked Lists, Cycle Detection | *Linked List Cycle* (Easy) |
| `monotonic_stack` | Monotonic Stack | Stacks, Parsing, AST Trees | *Daily Temperatures* (Medium) |
| `top_k_elements` | Top K Elements (Heaps) | Heaps, Priority Queues, Ranking | *Top K Frequent Elements* (Medium) |
| `binary_search` | Modified Binary Search | Search Algorithms, Indexing | *Search in Rotated Sorted Array* |
| `graph_bfs_dfs` | Graph Traversal (BFS/DFS) | Trees, Graphs, DOM Traversal | *Number of Islands* (Medium) |

---

### 2.2 Interview Evaluation Rubrics (`/data/interview_rubrics.json`)

#### STAR Methodology Weights:
- **Situation (20%):** Context and background setup.
- **Task (20%):** Clear problem / constraint formulation.
- **Action (35%):** Specific personal tech contributions and decisions.
- **Result (25%):** Concrete quantifiable business & technical metrics.

#### Speech Pacing & Cadence Benchmarks:
- **Optimal Range:** 130 – 160 Words Per Minute (WPM).
- **Too Slow Warning:** Below 110 WPM.
- **Too Fast Warning:** Above 180 WPM.

#### Filler Word Tracking:
- **Tracked Tokens:** `um`, `uh`, `like`, `you know`, `basically`, `actually`, `right`, `honestly`.
- **Target Threshold:** Less than 3 occurrences per 5-minute interview answer.

---

### 2.3 Role Skill Maps (`/data/role_skill_maps.json`)
Defines baseline required skills across major engineering paths (Frontend, Backend, Fullstack, AI/ML). Used by the ATS Audit Engine to calculate the **Readiness Score (0–100%)**.

```javascript
Readiness Score = (Matched Core Skills / Target Core Skills) * 60% 
                + (Matched Advanced Skills / Target Advanced Skills) * 40%
```

---

## 3. Integration with Gamified Quest Engine

When an ATS audit identifies missing competency keywords (e.g. missing `WebSockets`), the Quest Controller executes the following mapping logic:
1. Queries `role_skill_maps.json` to verify skill severity.
2. Queries `dsa_patterns.json` for matching algorithm patterns (e.g., `sliding_window`).
3. Generates a new `quest` record in **IndexedDB** with assigned **XP rewards** (e.g., +100 XP) and LeetCode problem links.
