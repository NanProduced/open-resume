import type { Snapshot, HistoryConfig, ResumeId } from "lib/history/types";
import {
  INDEXEDDB_DB_NAME,
  INDEXEDDB_VERSION,
  INDEXEDDB_STORE_NAME,
  INDEXEDDB_CONFIG_STORE,
  DEFAULT_HISTORY_CONFIG,
} from "lib/history/types";

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXEDDB_DB_NAME, INDEXEDDB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(INDEXEDDB_STORE_NAME)) {
        const snapshotStore = db.createObjectStore(INDEXEDDB_STORE_NAME, {
          keyPath: "id",
        });
        snapshotStore.createIndex("resumeId", "resumeId", { unique: false });
        snapshotStore.createIndex("timestamp", "timestamp", { unique: false });
        snapshotStore.createIndex("lastAccessedAt", "lastAccessedAt", {
          unique: false,
        });
        snapshotStore.createIndex("resumeId-timestamp", ["resumeId", "timestamp"], {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(INDEXEDDB_CONFIG_STORE)) {
        db.createObjectStore(INDEXEDDB_CONFIG_STORE, { keyPath: "resumeId" });
      }
    };
  });

  return dbPromise;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const saveSnapshot = async (
  snapshot: Omit<Snapshot, "id" | "createdAt" | "lastAccessedAt">
): Promise<Snapshot> => {
  const db = await openDB();
  const now = Date.now();

  const newSnapshot: Snapshot = {
    ...snapshot,
    id: generateId(),
    createdAt: now,
    lastAccessedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME);

    const request = store.add(newSnapshot);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newSnapshot);
  });
};

export const saveSnapshotIdle = (
  snapshot: Omit<Snapshot, "id" | "createdAt" | "lastAccessedAt">
): Promise<Snapshot> => {
  return new Promise((resolve, reject) => {
    const save = () => {
      saveSnapshot(snapshot).then(resolve).catch(reject);
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(save);
    } else {
      setTimeout(save, 0);
    }
  });
};

export const getSnapshot = async (id: string): Promise<Snapshot | undefined> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME);

    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const snapshot = request.result as Snapshot | undefined;
      if (snapshot) {
        snapshot.lastAccessedAt = Date.now();
        store.put(snapshot);
      }
      resolve(snapshot);
    };
  });
};

export const getAllSnapshotsByResumeId = async (
  resumeId: ResumeId
): Promise<Snapshot[]> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_STORE_NAME, "readonly");
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME);
    const index = store.index("resumeId-timestamp");

    const range = IDBKeyRange.bound([resumeId, 0], [resumeId, Infinity]);
    const request = index.getAll(range);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const snapshots = (request.result as Snapshot[]).sort(
        (a, b) => b.timestamp - a.timestamp
      );
      resolve(snapshots);
    };
  });
};

export const getSnapshotsCount = async (resumeId: ResumeId): Promise<number> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_STORE_NAME, "readonly");
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME);
    const index = store.index("resumeId");

    const request = index.count(IDBKeyRange.only(resumeId));

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const deleteSnapshot = async (id: string): Promise<void> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME);

    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteOldestSnapshots = async (
  resumeId: ResumeId,
  count: number
): Promise<string[]> => {
  const allSnapshots = await getAllSnapshotsByResumeId(resumeId);
  const toDelete = allSnapshots
    .sort((a, b) => {
      if (a.isAutoGenerated && !b.isAutoGenerated) return -1;
      if (!a.isAutoGenerated && b.isAutoGenerated) return 1;
      return a.lastAccessedAt - b.lastAccessedAt;
    })
    .slice(0, count);

  const deletedIds: string[] = [];
  for (const snapshot of toDelete) {
    await deleteSnapshot(snapshot.id);
    deletedIds.push(snapshot.id);
  }

  return deletedIds;
};

export const updateSnapshotTag = async (
  id: string,
  tag: string | null
): Promise<Snapshot | undefined> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_STORE_NAME, "readwrite");
    const store = transaction.objectStore(INDEXEDDB_STORE_NAME);

    const getRequest = store.get(id);

    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const snapshot = getRequest.result as Snapshot | undefined;
      if (!snapshot) {
        resolve(undefined);
        return;
      }

      snapshot.tag = tag;
      snapshot.lastAccessedAt = Date.now();

      const putRequest = store.put(snapshot);
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve(snapshot);
    };
  });
};

export const getHistoryConfig = async (
  resumeId: ResumeId
): Promise<HistoryConfig> => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_CONFIG_STORE, "readonly");
    const store = transaction.objectStore(INDEXEDDB_CONFIG_STORE);

    const request = store.get(resumeId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const config = request.result as HistoryConfig | undefined;
      resolve(config || { ...DEFAULT_HISTORY_CONFIG, resumeId });
    };
  });
};

export const saveHistoryConfig = async (
  config: Partial<HistoryConfig> & { resumeId: ResumeId }
): Promise<HistoryConfig> => {
  const db = await openDB();
  const existingConfig = await getHistoryConfig(config.resumeId);
  const newConfig: HistoryConfig = {
    ...existingConfig,
    ...config,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(INDEXEDDB_CONFIG_STORE, "readwrite");
    const store = transaction.objectStore(INDEXEDDB_CONFIG_STORE);

    const request = store.put(newConfig);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newConfig);
  });
};

export const cleanupOldSnapshots = async (
  resumeId: ResumeId,
  maxSnapshots: number
): Promise<string[]> => {
  const count = await getSnapshotsCount(resumeId);
  if (count <= maxSnapshots) return [];

  const toDelete = count - maxSnapshots;
  return deleteOldestSnapshots(resumeId, toDelete);
};
