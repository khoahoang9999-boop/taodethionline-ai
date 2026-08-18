import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, limit, query, where } from 'firebase/firestore';
import firebaseConfigRaw from './firebase-applet-config.json';
import path from 'path';
import fs from 'fs';

const fallbackConfig = {
  projectId: "rare-badge-mhh41",
  appId: "1:754399523784:web:d1caa174e2dba8031d46fd",
  apiKey: "AIzaSyA0SjTDrIT-ck-rFZ8vfr7YDEEppzq_ngI",
  authDomain: "rare-badge-mhh41.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-remixtokimtra168-5cfdad5b-1f57-4e8f-b230-705f8ed45eda",
  storageBucket: "rare-badge-mhh41.firebasestorage.app",
  messagingSenderId: "754399523784",
  measurementId: "",
  oAuthClientId: "754399523784-cgrmjhhjppelctas081dp4nrf74tfmea.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const firebaseConfig = (firebaseConfigRaw && (firebaseConfigRaw as any).projectId) ? firebaseConfigRaw : fallbackConfig;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || "ai-studio-remixtokimtra168-5cfdad5b-1f57-4e8f-b230-705f8ed45eda");

export interface CustomLessonItem {
  id: string;
  lessonNumber: string;
  name: string;
  topicId: string;
  topicName: string;
  periods: number;
  selected: boolean;
  halfGroup: "firstHalf" | "secondHalf";
}

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
  scopeConfig: {
    mode: "custom" | "default";
    firstHalfLessons: CustomLessonItem[];
    secondHalfLessons: CustomLessonItem[];
    quickNoteText?: string;
  };
}

const LOCAL_PPCT_FILE = path.join(process.cwd(), "server-data", "custom_ppct.json");
const TMP_PPCT_FILE = path.join("/tmp", "custom_ppct.json");

function ensureLocalDir() {
  const dir = path.dirname(LOCAL_PPCT_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

function readLocalPpct(): SavedPpctRecord[] {
  try {
    if (fs.existsSync(LOCAL_PPCT_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_PPCT_FILE, "utf-8"));
    }
    if (fs.existsSync(TMP_PPCT_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_PPCT_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading local PPCT fallback:", e);
  }
  return [];
}

function writeLocalPpct(items: SavedPpctRecord[]) {
  try {
    ensureLocalDir();
    fs.writeFileSync(LOCAL_PPCT_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_PPCT_FILE, JSON.stringify(items, null, 2), "utf-8");
    } catch {}
  }
}

export async function getAllCustomPpct(filter?: { subject?: string; grade?: string; userCode?: string }): Promise<SavedPpctRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, 'custom_ppct'));
    const records: SavedPpctRecord[] = [];
    snapshot.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() } as SavedPpctRecord);
    });

    // Merge with local fallback if Firestore has fewer items or empty
    const local = readLocalPpct();
    const map = new Map<string, SavedPpctRecord>();
    local.forEach(item => map.set(item.id, item));
    records.forEach(item => map.set(item.id, item));

    let results = Array.from(map.values());
    if (filter?.subject) {
      results = results.filter(r => r.subject === filter.subject);
    }
    if (filter?.grade) {
      results = results.filter(r => String(r.grade) === String(filter.grade));
    }
    if (filter?.userCode) {
      results = results.filter(r => !r.userCode || r.userCode === filter.userCode);
    }

    return results.sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));
  } catch (err) {
    console.error("Firestore get custom_ppct error, using local storage:", err);
    let local = readLocalPpct();
    if (filter?.subject) local = local.filter(r => r.subject === filter.subject);
    if (filter?.grade) local = local.filter(r => String(r.grade) === String(filter.grade));
    return local.sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));
  }
}

export async function saveCustomPpct(record: SavedPpctRecord): Promise<SavedPpctRecord> {
  const id = record.id || `ppct_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const fullRecord: SavedPpctRecord = {
    ...record,
    id,
    isPermanent: true,
    createdAt: record.createdAt || now,
    updatedAt: now,
  };

  // 1. Write to local fallback
  try {
    const local = readLocalPpct();
    const idx = local.findIndex(x => x.id === id);
    if (idx >= 0) {
      local[idx] = fullRecord;
    } else {
      local.unshift(fullRecord);
    }
    writeLocalPpct(local);
  } catch (e) {
    console.error("Failed to write local PPCT file:", e);
  }

  // 2. Write to Firestore
  try {
    const docRef = doc(db, 'custom_ppct', id);
    const { id: _, ...dataWithoutId } = fullRecord;
    await setDoc(docRef, dataWithoutId, { merge: true });
  } catch (err) {
    console.error("Failed to write PPCT to Firestore:", err);
  }

  return fullRecord;
}

export async function deleteCustomPpct(id: string): Promise<boolean> {
  // 1. Remove from local
  try {
    const local = readLocalPpct().filter(x => x.id !== id);
    writeLocalPpct(local);
  } catch (e) {}

  // 2. Remove from Firestore
  try {
    const docRef = doc(db, 'custom_ppct', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Failed to delete PPCT from Firestore:", err);
    return true;
  }
}
