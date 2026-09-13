/**
 * Client-Side IndexedDB Utility Module
 * Database Name: aura_db (Version 1)
 */

const DB_NAME = "aura_db";
const DB_VERSION = 1;

/**
 * Initializes and upgrades the IndexedDB database structure.
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this environment."));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Profiles Store
      if (!db.objectStoreNames.contains("profiles")) {
        const profileStore = db.createObjectStore("profiles", { keyPath: "id", autoIncrement: true });
        profileStore.createIndex("by_email", "email", { unique: true });
        profileStore.createIndex("by_createdAt", "createdAt", { unique: false });
      }

      // 2. Resumes Store
      if (!db.objectStoreNames.contains("resumes")) {
        const resumeStore = db.createObjectStore("resumes", { keyPath: "id", autoIncrement: true });
        resumeStore.createIndex("by_profileId", "profileId", { unique: false });
        resumeStore.createIndex("by_sourceType", "sourceType", { unique: false });
        resumeStore.createIndex("by_createdAt", "createdAt", { unique: false });
      }

      // 3. Job Descriptions Store
      if (!db.objectStoreNames.contains("job_descriptions")) {
        const jdStore = db.createObjectStore("job_descriptions", { keyPath: "id", autoIncrement: true });
        jdStore.createIndex("by_profileId", "profileId", { unique: false });
        jdStore.createIndex("by_createdAt", "createdAt", { unique: false });
      }

      // 4. Mock Sessions Store
      if (!db.objectStoreNames.contains("mock_sessions")) {
        const sessionStore = db.createObjectStore("mock_sessions", { keyPath: "id", autoIncrement: true });
        sessionStore.createIndex("by_profileId", "profileId", { unique: false });
        sessionStore.createIndex("by_sessionType", "sessionType", { unique: false });
        sessionStore.createIndex("by_createdAt", "createdAt", { unique: false });
      }

      // 5. Session Feedback Store
      if (!db.objectStoreNames.contains("session_feedback")) {
        const feedbackStore = db.createObjectStore("session_feedback", { keyPath: "id", autoIncrement: true });
        feedbackStore.createIndex("by_sessionId", "sessionId", { unique: true });
        feedbackStore.createIndex("by_profileId", "profileId", { unique: false });
        feedbackStore.createIndex("by_createdAt", "createdAt", { unique: false });
      }

      // 6. Quests Store
      if (!db.objectStoreNames.contains("quests")) {
        const questStore = db.createObjectStore("quests", { keyPath: "id", autoIncrement: true });
        questStore.createIndex("by_profileId", "profileId", { unique: false });
        questStore.createIndex("by_status", "status", { unique: false });
        questStore.createIndex("by_category", "category", { unique: false });
      }

      // 7. User Stats Store
      if (!db.objectStoreNames.contains("user_stats")) {
        const statsStore = db.createObjectStore("user_stats", { keyPath: "id", autoIncrement: true });
        statsStore.createIndex("by_profileId", "profileId", { unique: false });
        statsStore.createIndex("by_date", "date", { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

/** Add an item to an object store */
export async function addItem(storeName, item) {
  if (typeof window === "undefined") return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.add(item);
    req.onsuccess = () => {
      notifyDbChange(storeName);
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Get an item by ID from an object store */
export async function getItem(storeName, id) {
  if (typeof window === "undefined") return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Get all items from an object store */
export async function getAllItems(storeName) {
  if (typeof window === "undefined") return [];
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Update an item in an object store */
export async function updateItem(storeName, item) {
  if (typeof window === "undefined") return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => {
      notifyDbChange(storeName);
      resolve(req.result);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Delete an item by ID from an object store */
export async function deleteItem(storeName, id) {
  if (typeof window === "undefined") return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => {
      notifyDbChange(storeName);
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

/** Broadcast IndexedDB changes to active client listeners */
export function notifyDbChange(storeName = "all") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aura-db-changed", { detail: { storeName, timestamp: Date.now() } }));
  }
}

/** Get existing user profile or initialize dynamic initial profile */
export async function getOrCreateProfile() {
  const fallbackProfile = {
    fullName: "Placement Candidate",
    email: "candidate@parichaya.edu",
    targetRole: "Full Stack Engineer",
    experienceLevel: "Entry Level / College Graduate",
    readinessScore: 68,
    skillLevel: "Placement Novice",
    totalXp: 250,
    strengths: ["JavaScript (ES6+)", "React.js", "REST APIs"],
    weaknesses: ["Arrays & Dynamic Programming", "STAR Storytelling", "Behavioral Articulation"],
    createdAt: new Date().toISOString()
  };

  if (typeof window === "undefined") return fallbackProfile;

  try {
    const profiles = await getAllItems("profiles");
    if (profiles && profiles.length > 0) {
      return profiles[profiles.length - 1];
    }
    const id = await addItem("profiles", fallbackProfile);
    return { ...fallbackProfile, id };
  } catch (e) {
    return fallbackProfile;
  }
}
