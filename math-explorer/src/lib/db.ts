import { GameSession } from "@/types/game";

const DB_NAME = "neuromath_db";
const STORE_NAME = "sessions";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function initDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "sessionId" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      // Clean up the cached promise if connection fails
      dbPromise = null;
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

export async function addSession(session: GameSession): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(session);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSessions(): Promise<GameSession[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as GameSession[]);
    request.onerror = () => reject(request.error);
  });
}

export async function migrateFromLocalStorage(): Promise<void> {
  const LOCAL_STORAGE_KEY = "neuromath_sessions";
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return;

  try {
    const sessions: GameSession[] = JSON.parse(raw);
    if (!Array.isArray(sessions) || sessions.length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
    }

    const db = await initDB();

    // We'll execute the migration inside a transaction
    // If any operation fails, the transaction aborts?
    // Manual Promise handling is tricky with transaction scope.
    // Ideally, we open a transaction and do all puts.

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        transaction.oncomplete = () => {
             localStorage.removeItem(LOCAL_STORAGE_KEY);
             console.log(`Migrated ${sessions.length} sessions to IndexedDB.`);
             resolve();
        };

        transaction.onerror = () => {
            console.error("Migration transaction failed", transaction.error);
            reject(transaction.error);
        };

        sessions.forEach(session => {
            store.put(session);
        });
    });

  } catch (error) {
    console.error("Migration failed:", error);
  }
}

export function _resetDBPromise() {
  dbPromise = null;
}
