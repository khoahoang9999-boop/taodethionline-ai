import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import firebaseConfigRaw from './firebase-applet-config.json';
import path from 'path';
import fs from 'fs';

const fallbackConfig = {
  projectId: "gen-lang-client-0372527457",
  appId: "1:322834438638:web:ac246430184ac7423fd6ff",
  apiKey: "AIzaSyDpaU8wZ0oZBPn4cV5xF4Td68XCkUPbOcA",
  authDomain: "gen-lang-client-0372527457.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-remixtokimtra178-eea5e342-e96f-47b5-9bae-cee722f798ff",
  storageBucket: "gen-lang-client-0372527457.firebasestorage.app",
  messagingSenderId: "322834438638",
  measurementId: "",
  oAuthClientId: "322834438638-rto8fhg7vgj6sm5lglquu7em2tlnafps.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const firebaseConfig = (firebaseConfigRaw && (firebaseConfigRaw as any).projectId) ? firebaseConfigRaw : fallbackConfig;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || "ai-studio-remixtokimtra178-eea5e342-e96f-47b5-9bae-cee722f798ff");

export interface SavedExamRecord {
  id: string;
  title: string;
  subject: string;
  grade: string;
  period: string;
  schoolName: string;
  departmentName?: string;
  examFormat: string;
  schoolYear: string;
  time?: string;
  userCode?: string;
  userDisplayName?: string;
  createdAt: string;
  updatedAt: string;
  matrix: any[];
  specification: any[];
  examVariants: any[];
  code?: string;
  endContent?: string;
}

export interface SavedStudyGuideRecord {
  id: string;
  title: string;
  subject: string;
  grade: string;
  period: string;
  schoolName: string;
  departmentName?: string;
  schoolYear: string;
  userCode?: string;
  userDisplayName?: string;
  createdAt: string;
  updatedAt: string;
  topics: any[];
  mcq: any[];
  tf: any[];
  shortAnswer: any[];
  applied: any[];
}

const LOCAL_EXAMS_FILE = path.join(process.cwd(), "server-data", "saved_exams.json");
const TMP_EXAMS_FILE = path.join("/tmp", "saved_exams.json");

const LOCAL_GUIDES_FILE = path.join(process.cwd(), "server-data", "saved_study_guides.json");
const TMP_GUIDES_FILE = path.join("/tmp", "saved_study_guides.json");

function ensureLocalDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

// ---------------- EXAMS STORAGE ----------------

function readLocalExams(): SavedExamRecord[] {
  try {
    if (fs.existsSync(LOCAL_EXAMS_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_EXAMS_FILE, "utf-8"));
    }
    if (fs.existsSync(TMP_EXAMS_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_EXAMS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading local exams fallback:", e);
  }
  return [];
}

function writeLocalExams(items: SavedExamRecord[]) {
  try {
    ensureLocalDir(LOCAL_EXAMS_FILE);
    fs.writeFileSync(LOCAL_EXAMS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_EXAMS_FILE, JSON.stringify(items, null, 2), "utf-8");
    } catch {}
  }
}

export async function getAllSavedExams(filter?: { subject?: string; grade?: string; userCode?: string }): Promise<SavedExamRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, 'saved_exams'));
    const records: SavedExamRecord[] = [];
    snapshot.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() } as SavedExamRecord);
    });

    const local = readLocalExams();
    const map = new Map<string, SavedExamRecord>();
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
    console.error("Firestore get saved_exams error, using local storage:", err);
    let local = readLocalExams();
    if (filter?.subject) local = local.filter(r => r.subject === filter.subject);
    if (filter?.grade) local = local.filter(r => String(r.grade) === String(filter.grade));
    if (filter?.userCode) local = local.filter(r => !r.userCode || r.userCode === filter.userCode);
    return local.sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));
  }
}

export async function getSavedExamById(id: string): Promise<SavedExamRecord | null> {
  try {
    const docRef = doc(db, 'saved_exams', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SavedExamRecord;
    }
  } catch (e) {}

  const local = readLocalExams();
  return local.find(x => x.id === id) || null;
}

export async function saveExamRecord(record: SavedExamRecord): Promise<SavedExamRecord> {
  const id = record.id || `exam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const fullRecord: SavedExamRecord = {
    ...record,
    id,
    createdAt: record.createdAt || now,
    updatedAt: now,
  };

  try {
    const local = readLocalExams();
    const idx = local.findIndex(x => x.id === id);
    if (idx >= 0) {
      local[idx] = fullRecord;
    } else {
      local.unshift(fullRecord);
    }
    writeLocalExams(local);
  } catch (e) {
    console.error("Failed to write local exam file:", e);
  }

  try {
    const docRef = doc(db, 'saved_exams', id);
    const { id: _, ...dataWithoutId } = fullRecord;
    await setDoc(docRef, dataWithoutId, { merge: true });
  } catch (err) {
    console.error("Failed to write exam to Firestore:", err);
  }

  return fullRecord;
}

export async function deleteSavedExam(id: string): Promise<boolean> {
  try {
    const local = readLocalExams().filter(x => x.id !== id);
    writeLocalExams(local);
  } catch (e) {}

  try {
    const docRef = doc(db, 'saved_exams', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Failed to delete exam from Firestore:", err);
    return true;
  }
}

// ---------------- STUDY GUIDES STORAGE ----------------

function readLocalGuides(): SavedStudyGuideRecord[] {
  try {
    if (fs.existsSync(LOCAL_GUIDES_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_GUIDES_FILE, "utf-8"));
    }
    if (fs.existsSync(TMP_GUIDES_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_GUIDES_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading local study guides fallback:", e);
  }
  return [];
}

function writeLocalGuides(items: SavedStudyGuideRecord[]) {
  try {
    ensureLocalDir(LOCAL_GUIDES_FILE);
    fs.writeFileSync(LOCAL_GUIDES_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_GUIDES_FILE, JSON.stringify(items, null, 2), "utf-8");
    } catch {}
  }
}

export async function getAllSavedStudyGuides(filter?: { subject?: string; grade?: string; userCode?: string }): Promise<SavedStudyGuideRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, 'saved_study_guides'));
    const records: SavedStudyGuideRecord[] = [];
    snapshot.forEach(doc => {
      records.push({ id: doc.id, ...doc.data() } as SavedStudyGuideRecord);
    });

    const local = readLocalGuides();
    const map = new Map<string, SavedStudyGuideRecord>();
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
    console.error("Firestore get saved_study_guides error, using local storage:", err);
    let local = readLocalGuides();
    if (filter?.subject) local = local.filter(r => r.subject === filter.subject);
    if (filter?.grade) local = local.filter(r => String(r.grade) === String(filter.grade));
    if (filter?.userCode) local = local.filter(r => !r.userCode || r.userCode === filter.userCode);
    return local.sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));
  }
}

export async function getSavedStudyGuideById(id: string): Promise<SavedStudyGuideRecord | null> {
  try {
    const docRef = doc(db, 'saved_study_guides', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SavedStudyGuideRecord;
    }
  } catch (e) {}

  const local = readLocalGuides();
  return local.find(x => x.id === id) || null;
}

export async function saveStudyGuideRecord(record: SavedStudyGuideRecord): Promise<SavedStudyGuideRecord> {
  const id = record.id || `guide_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const fullRecord: SavedStudyGuideRecord = {
    ...record,
    id,
    createdAt: record.createdAt || now,
    updatedAt: now,
  };

  try {
    const local = readLocalGuides();
    const idx = local.findIndex(x => x.id === id);
    if (idx >= 0) {
      local[idx] = fullRecord;
    } else {
      local.unshift(fullRecord);
    }
    writeLocalGuides(local);
  } catch (e) {
    console.error("Failed to write local study guide file:", e);
  }

  try {
    const docRef = doc(db, 'saved_study_guides', id);
    const { id: _, ...dataWithoutId } = fullRecord;
    await setDoc(docRef, dataWithoutId, { merge: true });
  } catch (err) {
    console.error("Failed to write study guide to Firestore:", err);
  }

  return fullRecord;
}

export async function deleteSavedStudyGuide(id: string): Promise<boolean> {
  try {
    const local = readLocalGuides().filter(x => x.id !== id);
    writeLocalGuides(local);
  } catch (e) {}

  try {
    const docRef = doc(db, 'saved_study_guides', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Failed to delete study guide from Firestore:", err);
    return true;
  }
}
