// IndexedDB wrapper using `idb` for AuraDB
import { openDB } from 'idb';

const DB_NAME = 'AuraDB';
const DB_VERSION = 8;

let dbPromise = null;

function getDB() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Helper to ensure by-email index exists on a store
        const ensureEmailIndex = (store) => {
          if (!store.indexNames.contains('by-email')) {
            store.createIndex('by-email', 'email');
          }
        };

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }
        // Profiles store
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'email' });
        }
        // Resumes store
        if (!db.objectStoreNames.contains('resumes')) {
          const resumeStore = db.createObjectStore('resumes', { keyPath: 'id', autoIncrement: true });
          resumeStore.createIndex('by-email', 'email');
        } else {
          ensureEmailIndex(transaction.objectStore('resumes'));
        }
        // ATS Results store
        if (!db.objectStoreNames.contains('atsResults')) {
          const atsStore = db.createObjectStore('atsResults', { keyPath: 'id', autoIncrement: true });
          atsStore.createIndex('by-email', 'email');
        } else {
          ensureEmailIndex(transaction.objectStore('atsResults'));
        }
        // Interviews store
        if (!db.objectStoreNames.contains('interviews')) {
          const intStore = db.createObjectStore('interviews', { keyPath: 'id', autoIncrement: true });
          intStore.createIndex('by-email', 'email');
        } else {
          ensureEmailIndex(transaction.objectStore('interviews'));
        }
        // Game Progress store
        if (!db.objectStoreNames.contains('gameProgress')) {
          db.createObjectStore('gameProgress', { keyPath: ['email', 'gameId'] });
        }
        // Evidence Graph store (Skill -> Evidence -> Source -> Confidence)
        if (!db.objectStoreNames.contains('evidenceGraph')) {
          const evStore = db.createObjectStore('evidenceGraph', { keyPath: 'id', autoIncrement: true });
          evStore.createIndex('by-email', 'email');
          evStore.createIndex('by-skill', 'skill');
        } else {
          ensureEmailIndex(transaction.objectStore('evidenceGraph'));
        }
        // Learning Missions store
        if (!db.objectStoreNames.contains('missions')) {
          const mStore = db.createObjectStore('missions', { keyPath: 'id' });
          mStore.createIndex('by-email', 'email');
          mStore.createIndex('by-status', 'status');
        } else {
          ensureEmailIndex(transaction.objectStore('missions'));
        }
        // DSA Progress store
        if (!db.objectStoreNames.contains('dsaProgress')) {
          const dsaStore = db.createObjectStore('dsaProgress', { keyPath: ['email', 'problemId'] });
          dsaStore.createIndex('by-email', 'email');
        } else {
          ensureEmailIndex(transaction.objectStore('dsaProgress'));
        }
        // Soft Skill Assessments store
        if (!db.objectStoreNames.contains('softSkillProgress')) {
          const ssStore = db.createObjectStore('softSkillProgress', { keyPath: 'id', autoIncrement: true });
          ssStore.createIndex('by-email', 'email');
        } else {
          ensureEmailIndex(transaction.objectStore('softSkillProgress'));
        }
        // Role Profiles & Career Targets
        if (!db.objectStoreNames.contains('roleProfiles')) {
          db.createObjectStore('roleProfiles', { keyPath: 'email' });
        }
        // Job Descriptions & Analyses
        if (!db.objectStoreNames.contains('jobDescriptions')) {
          const jdStore = db.createObjectStore('jobDescriptions', { keyPath: 'id', autoIncrement: true });
          jdStore.createIndex('by-email', 'email');
        } else {
          ensureEmailIndex(transaction.objectStore('jobDescriptions'));
        }
        // Job Applications Tracker
        if (!db.objectStoreNames.contains('jobApplications')) {
          const jaStore = db.createObjectStore('jobApplications', { keyPath: 'id', autoIncrement: true });
          jaStore.createIndex('by-email', 'email');
          jaStore.createIndex('by-status', 'status');
        } else {
          ensureEmailIndex(transaction.objectStore('jobApplications'));
        }
      },
    });
  }
  return dbPromise;
}

// ============== Safe IndexedDB Helper ==============
async function safeGetByEmail(storeName, email) {
  const db = await getDB();
  if (!db) return [];
  try {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    if (store.indexNames.contains('by-email')) {
      return await store.index('by-email').getAll(email);
    } else {
      const all = await store.getAll();
      return all.filter(item => item && item.email === email);
    }
  } catch (err) {
    console.warn(`Fallback querying ${storeName} by email:`, err);
    try {
      const all = await db.getAll(storeName);
      return all.filter(item => item && item.email === email);
    } catch {
      return [];
    }
  }
}

// ============== Users ==============
export async function createUser(email, name, passwordHash) {
  const db = await getDB();
  const existing = await db.get('users', email);
  if (existing) throw new Error('User already exists');
  const user = {
    email,
    name,
    passwordHash,
    createdAt: Date.now(),
    theme: 'dark',
    xp: 0,
    level: 1,
    targetRole: 'Full Stack Developer',
    streakDays: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10)
  };
  await db.put('users', user);
  return user;
}

export async function getUser(email) {
  const db = await getDB();
  return db.get('users', email);
}

export async function updateUser(email, updates) {
  const db = await getDB();
  const user = await db.get('users', email);
  if (!user) throw new Error('User not found');
  const updated = { ...user, ...updates };
  await db.put('users', updated);
  return updated;
}

export async function addXP(email, amount) {
  const db = await getDB();
  const user = await db.get('users', email);
  if (!user) return;
  user.xp = (user.xp || 0) + amount;
  user.level = Math.floor(user.xp / 500) + 1;
  await db.put('users', user);
  return user;
}

// ============== Profiles ==============
export async function saveProfile(email, profileData) {
  const db = await getDB();
  await db.put('profiles', { email, ...profileData, updatedAt: Date.now() });
}

export async function getProfile(email) {
  const db = await getDB();
  return db.get('profiles', email);
}

// ============== Resumes ==============
export async function saveResume(email, resumeJSON, source = 'counselor') {
  const db = await getDB();
  return db.add('resumes', { email, resumeJSON, source, createdAt: Date.now() });
}

export async function getResumes(email) {
  return safeGetByEmail('resumes', email);
}

// ============== ATS Results ==============
export async function saveATSResult(email, result) {
  const db = await getDB();
  return db.add('atsResults', { email, ...result, createdAt: Date.now() });
}

export async function getATSResults(email) {
  return safeGetByEmail('atsResults', email);
}

// ============== Interviews ==============
export async function saveInterview(email, interviewData) {
  const db = await getDB();
  return db.add('interviews', { email, ...interviewData, createdAt: Date.now() });
}

export async function getInterviews(email) {
  return safeGetByEmail('interviews', email);
}

// ============== Game Progress ==============
export async function saveGameProgress(email, gameId, progressData) {
  const db = await getDB();
  await db.put('gameProgress', { email, gameId, ...progressData, lastPlayedAt: Date.now() });
}

export async function getGameProgress(email, gameId) {
  const db = await getDB();
  return db.get('gameProgress', [email, gameId]);
}

// ============== Evidence Graph ==============
// Skill -> Evidence -> Source -> Confidence
export async function addEvidence(email, skill, evidence, source, confidence = 'High') {
  const db = await getDB();
  const entry = {
    email,
    skill,
    evidence,
    source, // e.g. "GitHub repository", "Course certificate", "Live assessment", "User claim"
    confidence, // 'High', 'Medium', 'Needs Verification'
    status: confidence === 'High' ? 'Strong' : confidence === 'Medium' ? 'Intermediate' : 'Developing',
    createdAt: Date.now()
  };
  return db.add('evidenceGraph', entry);
}

export async function getEvidenceGraph(email) {
  return safeGetByEmail('evidenceGraph', email);
}

// ============== Learning Missions Engine ==============
export async function createMission(email, mission) {
  const db = await getDB();
  const entry = {
    id: mission.id || `mission_${Date.now()}`,
    email,
    title: mission.title,
    category: mission.category, // 'DSA', 'Technical Challenge', 'Soft Skills', 'Resume Optimization'
    skillGap: mission.skillGap,
    difficulty: mission.difficulty || 'Intermediate',
    xpBounty: mission.xpBounty || 120,
    status: 'ACTIVE', // 'ACTIVE', 'COMPLETED', 'SKIPPED'
    taskDescription: mission.taskDescription,
    targetUrl: mission.targetUrl || '/arena',
    createdAt: Date.now()
  };
  await db.put('missions', entry);
  return entry;
}

export async function getMissions(email) {
  return safeGetByEmail('missions', email);
}

export async function completeMission(email, missionId) {
  const db = await getDB();
  const mission = await db.get('missions', missionId);
  if (mission && mission.email === email) {
    mission.status = 'COMPLETED';
    mission.completedAt = Date.now();
    await db.put('missions', mission);
    await addXP(email, mission.xpBounty || 100);
    return mission;
  }
}

// ============== DSA Progress ==============
export async function recordDSASubmission(email, problemId, data) {
  const db = await getDB();
  const entry = {
    email,
    problemId,
    solved: data.solved || false,
    attempts: (data.attempts || 1),
    topic: data.topic,
    difficulty: data.difficulty,
    lastSubmittedAt: Date.now()
  };
  await db.put('dsaProgress', entry);
  return entry;
}

export async function getDSAProgress(email) {
  return safeGetByEmail('dsaProgress', email);
}

// ============== Soft Skills Assessments ==============
export async function recordSoftSkillResult(email, result) {
  const db = await getDB();
  const entry = {
    email,
    overallScore: result.overallScore,
    clarityScore: result.clarityScore,
    grammarScore: result.grammarScore,
    vocabularyScore: result.vocabularyScore,
    professionalismScore: result.professionalismScore,
    communicationScore: result.communicationScore,
    weakestAreas: result.weakestAreas || [],
    completedAt: Date.now()
  };
  return db.add('softSkillProgress', entry);
}

export async function getSoftSkillHistory(email) {
  return safeGetByEmail('softSkillProgress', email);
}

// ============== Role Profiles ==============
export async function saveRoleProfile(email, profile) {
  const db = await getDB();
  await db.put('roleProfiles', { email, ...profile, updatedAt: Date.now() });
}

export async function getRoleProfile(email) {
  const db = await getDB();
  return db.get('roleProfiles', email);
}

// ============== Job Descriptions & Applications ==============
export async function saveJobDescription(email, jobData) {
  const db = await getDB();
  const entry = {
    email,
    sourceUrl: jobData.sourceUrl || '',
    sourceDomain: jobData.sourceDomain || '',
    jobTitle: jobData.jobTitle || 'Extracted Job',
    company: jobData.company || 'Company',
    location: jobData.location || '',
    description: jobData.description || '',
    extractedData: jobData.extractedData || {},
    matchScore: jobData.matchScore || 0,
    scoreBreakdown: jobData.scoreBreakdown || {},
    createdAt: Date.now()
  };
  return db.add('jobDescriptions', entry);
}

export async function getJobDescriptions(email) {
  return safeGetByEmail('jobDescriptions', email);
}

export async function saveJobApplication(email, appData) {
  const db = await getDB();
  const entry = {
    email,
    jobTitle: appData.jobTitle,
    company: appData.company,
    sourceUrl: appData.sourceUrl || '',
    status: appData.status || 'Saved', // 'Saved', 'Analyzed', 'Preparing', 'Ready', 'Applied', 'Interview', 'Offer', 'Rejected'
    matchScore: appData.matchScore || 0,
    updatedAt: Date.now()
  };
  return db.add('jobApplications', entry);
}

export async function getJobApplications(email) {
  return safeGetByEmail('jobApplications', email);
}

// ============== DB Inspector (Dev) ==============
export async function inspectDB() {
  const db = await getDB();
  const stores = [
    'users', 'profiles', 'resumes', 'atsResults', 'interviews',
    'gameProgress', 'evidenceGraph', 'missions', 'dsaProgress',
    'softSkillProgress', 'roleProfiles', 'jobDescriptions', 'jobApplications'
  ];
  const result = {};
  for (const store of stores) {
    if (db.objectStoreNames.contains(store)) {
      result[store] = await db.getAll(store);
    }
  }
  return result;
}
