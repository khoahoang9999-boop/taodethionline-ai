import { CustomLessonConfig, ScopeConfigData } from "../components/ScopeConfigModal";
import { ALL_TEXTBOOKS, Lesson } from "../data/textbooks";
import { ALL_MATH_TEXTBOOKS } from "../data/math";

export interface SavedPpctRecord {
  id: string;
  name: string;
  subject: string;
  grade: string;
  period: string;
  schoolYear?: string;
  userCode?: string;
  isPermanent: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  scopeConfig: ScopeConfigData;
}

const LOCAL_STORAGE_KEY = "TO_KTT_SAVED_PPCT_LIST_V2";

export function getLocalSavedPpctList(): SavedPpctRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading saved PPCT from localStorage:", e);
  }
  return [];
}

export function saveToLocalStorage(records: SavedPpctRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Error saving PPCT to localStorage:", e);
  }
}

/**
 * Loads PPCT records: first loads local fast, then syncs with Firestore backend.
 */
export async function fetchAllSavedPpct(params?: { subject?: string; grade?: string; userCode?: string }): Promise<SavedPpctRecord[]> {
  let localList = getLocalSavedPpctList();

  try {
    const res = await fetch("/api/ppct/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params || {}),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.ppctList)) {
        // Merge cloud records with local records
        const map = new Map<string, SavedPpctRecord>();
        localList.forEach(item => map.set(item.id, item));
        data.ppctList.forEach((item: SavedPpctRecord) => map.set(item.id, item));
        
        const merged = Array.from(map.values()).sort((a, b) => 
          (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "")
        );
        saveToLocalStorage(merged);
        localList = merged;
      }
    }
  } catch (err) {
    console.warn("Could not sync PPCT with server, using local storage:", err);
  }

  let filtered = localList;
  if (params?.subject) {
    filtered = filtered.filter(x => x.subject === params.subject);
  }
  if (params?.grade) {
    filtered = filtered.filter(x => String(x.grade) === String(params.grade));
  }
  return filtered;
}

export type PartialSavedPpctRecord = Omit<SavedPpctRecord, "isPermanent" | "createdAt" | "updatedAt"> & {
  isPermanent?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Saves a PPCT permanently (LocalStorage + Firestore).
 */
export async function savePpctPermanently(record: PartialSavedPpctRecord): Promise<SavedPpctRecord> {
  const now = new Date().toISOString();
  const fullRecord: SavedPpctRecord = {
    ...record,
    id: record.id || `ppct_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    isPermanent: true,
    createdAt: record.createdAt || now,
    updatedAt: now,
  };

  // 1. Save locally
  const current = getLocalSavedPpctList();
  const idx = current.findIndex(x => x.id === fullRecord.id);
  if (idx >= 0) {
    current[idx] = fullRecord;
  } else {
    current.unshift(fullRecord);
  }
  saveToLocalStorage(current);

  // 2. Sync to Server/Firestore
  try {
    await fetch("/api/ppct/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ record: fullRecord }),
    });
  } catch (e) {
    console.warn("Background cloud sync for PPCT failed, saved locally:", e);
  }

  return fullRecord;
}

/**
 * Deletes a PPCT record from LocalStorage and Firestore.
 */
export async function deleteSavedPpct(id: string): Promise<boolean> {
  const current = getLocalSavedPpctList().filter(x => x.id !== id);
  saveToLocalStorage(current);

  try {
    await fetch("/api/ppct/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  } catch (e) {
    console.warn("Background cloud delete for PPCT failed:", e);
  }
  return true;
}

/**
 * Retrieves all catalog lessons for a subject and grade (Toán học, Tin học)
 * Across all topics and chapters so teachers can pick any lesson for any term.
 */
export function getAllSubjectCatalogLessons(subject: string, grade: string): {
  topicId: string;
  topicName: string;
  lessons: Lesson[];
}[] {
  if (subject?.toLowerCase().trim().includes("toán")) {
    const tb = ALL_MATH_TEXTBOOKS[grade] || ALL_MATH_TEXTBOOKS["6"];
    if (tb && Array.isArray(tb.topics)) {
      return tb.topics.map(t => ({
        topicId: t.id,
        topicName: t.name,
        lessons: t.lessons || []
      }));
    }
  } else if (subject === "Tin học") {
    const tb = ALL_TEXTBOOKS[grade] || ALL_TEXTBOOKS["6"];
    if (tb && Array.isArray(tb.topics)) {
      return tb.topics.map(t => ({
        topicId: t.id,
        topicName: t.name,
        lessons: t.lessons || []
      }));
    }
  }
  return [];
}

/**
 * Export PPCT as JSON file
 */
export function exportPpctAsJson(record: SavedPpctRecord) {
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PPCT_${record.subject}_Lop${record.grade}_${record.period.replace(/\s+/g, "_")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
