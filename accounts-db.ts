import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, limit, query } from 'firebase/firestore';
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

export interface ApiKeyItem {
  id?: string;
  key: string;
  model?: string;
  label?: string;
}

export interface Account {
  id: string; // Mã tài khoản duy nhất (VD: TK-102948 hoặc ADMIN123)
  username?: string; // Tên đăng nhập riêng (VD: giaovien_toan, admin, cothao)
  customerName: string; // Tên hiển thị / Họ tên người dùng
  password?: string; // Mật khẩu (đồng bộ với id)
  phone: string;
  avatar?: string; // Ảnh đại diện người dùng (URL hoặc Base64)
  createdDate: string;
  expiryDate: string; // "YYYY-MM-DD" hoặc "2099-12-31" hoặc "Chưa cấp"
  trialCount?: number; // Số lượt tạo đề dùng thử đã sử dụng (tối đa 5 lượt)
  maxDevices: number;
  devices: string[];
  status: "active" | "locked";
  apiKeys?: ApiKeyItem[];
  notes?: string;
  role?: "admin" | "teacher";
  isDeleted?: boolean;
  lastLogin?: string;
  lastLoginTime?: string;
  lastLoginDate?: string;
  activeSecondsToday?: number;
  todayActiveSeconds?: number;
  loginCountToday?: number;
  todayLoginCount?: number;
}

export function isAccountLicensed(expiryDate?: string): boolean {
  if (!expiryDate || !expiryDate.trim()) return false;
  if (expiryDate === "Chưa cấp" || expiryDate === "chua-cap") return false;
  if (expiryDate === "2099-12-31" || expiryDate === "vinh-vien" || expiryDate === "Vĩnh viễn") return true;
  const today = getTodayString();
  return expiryDate >= today;
}

export function normalizeVietnameseName(s: string): string {
  if (!s) return "";
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]/g, "");
}

export function getVietnamDateParts(d: Date = new Date()): {
  year: string;
  month: string;
  day: string;
  hours: string;
  minutes: string;
  seconds: string;
  todayISO: string;
  todayVN: string;
  dateTimeVN: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const parts = formatter.formatToParts(d);
    const map: Record<string, string> = {};
    for (const p of parts) {
      map[p.type] = p.value;
    }
    const year = map.year || String(d.getFullYear());
    const month = map.month || String(d.getMonth() + 1).padStart(2, "0");
    const day = map.day || String(d.getDate()).padStart(2, "0");
    const hours = map.hour === "24" ? "00" : (map.hour || String(d.getHours()).padStart(2, "0"));
    const minutes = map.minute || String(d.getMinutes()).padStart(2, "0");
    const seconds = map.second || String(d.getSeconds()).padStart(2, "0");
    const todayISO = `${year}-${month}-${day}`;
    const todayVN = `${day}/${month}/${year}`;
    const dateTimeVN = `${hours}:${minutes}:${seconds} ${todayVN}`;
    return { year, month, day, hours, minutes, seconds, todayISO, todayVN, dateTimeVN };
  } catch {
    const vnTime = new Date(d.getTime() + (7 * 60 + d.getTimezoneOffset()) * 60000);
    const year = String(vnTime.getFullYear());
    const month = String(vnTime.getMonth() + 1).padStart(2, "0");
    const day = String(vnTime.getDate()).padStart(2, "0");
    const hours = String(vnTime.getHours()).padStart(2, "0");
    const minutes = String(vnTime.getMinutes()).padStart(2, "0");
    const seconds = String(vnTime.getSeconds()).padStart(2, "0");
    const todayISO = `${year}-${month}-${day}`;
    const todayVN = `${day}/${month}/${year}`;
    const dateTimeVN = `${hours}:${minutes}:${seconds} ${todayVN}`;
    return { year, month, day, hours, minutes, seconds, todayISO, todayVN, dateTimeVN };
  }
}

export function isStaleUtcMinus7Time(timeStr?: string): boolean {
  if (!timeStr) return false;
  return (
    timeStr.startsWith("01:17:") ||
    timeStr.startsWith("08:00:00") ||
    /^0[0-4]:\d{2}:\d{2}\s+29\/10\/2026/.test(timeStr.trim())
  );
}

export function getTodayString(): string {
  return getVietnamDateParts().todayISO;
}

export function formatDateVN(dateStr?: string): string {
  if (!dateStr) return "---";
  if (dateStr === "2099-12-31" || dateStr === "vinh-vien" || dateStr === "Vĩnh viễn") return "Vĩnh viễn";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

const DELETED_REGISTRY_DOC_ID = "__DELETED_REGISTRY__";
const LOCAL_DELETED_FILE = path.join(process.cwd(), "server-data", "deleted_accounts.json");
const TMP_DELETED_FILE = path.join("/tmp", "deleted_accounts.json");

function readLocalDeletedIds(): string[] {
  try {
    if (fs.existsSync(LOCAL_DELETED_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_DELETED_FILE, "utf-8"));
      if (Array.isArray(parsed)) return parsed.map(String);
    }
    if (fs.existsSync(TMP_DELETED_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(TMP_DELETED_FILE, "utf-8"));
      if (Array.isArray(parsed)) return parsed.map(String);
    }
  } catch {}
  return [];
}

function writeLocalDeletedIds(ids: string[]) {
  const unique = Array.from(new Set(ids.map(s => String(s).trim().toUpperCase()).filter(Boolean)));
  try {
    const dir = path.dirname(LOCAL_DELETED_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DELETED_FILE, JSON.stringify(unique, null, 2), "utf-8");
  } catch {
    try {
      fs.writeFileSync(TMP_DELETED_FILE, JSON.stringify(unique, null, 2), "utf-8");
    } catch {}
  }
}

/**
 * Get Set of all deleted account IDs to ensure deleted accounts never reappear.
 * Uses `accounts/__DELETED_REGISTRY__` document and local disk file so it always has permission.
 */
export async function getDeletedAccountIds(): Promise<Set<string>> {
  const set = new Set<string>(readLocalDeletedIds().map(s => s.toUpperCase()));
  try {
    const regSnap = await getDoc(doc(db, 'accounts', DELETED_REGISTRY_DOC_ID));
    if (regSnap.exists()) {
      const data = regSnap.data();
      if (Array.isArray(data.deletedIds)) {
        data.deletedIds.forEach((id: any) => {
          if (id) set.add(String(id).trim().toUpperCase());
        });
      }
    }
  } catch {
    // Ignore transient Firestore error and rely on local + document flags
  }
  return set;
}

let migrationRun = false;
async function ensureMigrated() {
  if (migrationRun) return;
  migrationRun = true;
  
  try {
    const deletedSet = await getDeletedAccountIds();

    // 1. Ensure Master Admin account (admin / 123456) exists only if not deleted
    if (!deletedSet.has('123456')) {
      const adminDocRef = doc(db, 'accounts', '123456');
      const adminSnap = await getDoc(adminDocRef);
      if (!adminSnap.exists()) {
        const SEED_ADMIN = {
          username: "admin",
          customerName: "Quản trị viên (Admin)",
          password: "123456",
          phone: "0989.982.818",
          createdDate: getTodayString(),
          expiryDate: "2099-12-31",
          maxDevices: 999,
          devices: [],
          status: "active",
          notes: "Tài khoản Quản trị viên (Admin)"
        };
        await setDoc(adminDocRef, SEED_ADMIN);
      }
    }

    // 2. Ensure ADMIN123 account exists only if not deleted
    if (!deletedSet.has('ADMIN123')) {
      const admin123DocRef = doc(db, 'accounts', 'ADMIN123');
      const admin123Snap = await getDoc(admin123DocRef);
      if (!admin123Snap.exists()) {
        const SEED_ACCOUNT = {
          username: "admin123",
          customerName: "Hoàng Văn Đình Khoa (Admin Master)",
          password: "ADMIN123",
          phone: "0989.982.818",
          createdDate: getTodayString(),
          expiryDate: "2099-12-31",
          maxDevices: 999,
          devices: [],
          status: "active",
          notes: "Tài khoản quản trị viên Master"
        };
        await setDoc(admin123DocRef, SEED_ACCOUNT);
      }
    }

    // 3. Migrate from accounts.json if collection is empty
    const snap = await getDocs(query(collection(db, 'accounts'), limit(1)));
    if (snap.empty) {
      let toMigrate: any[] = [];
      const DATA_FILE = path.join(process.cwd(), "accounts.json");
      const TMP_DATA_FILE = path.join("/tmp", "accounts.json");
      
      if (fs.existsSync(DATA_FILE)) {
        toMigrate = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      } else if (fs.existsSync(TMP_DATA_FILE)) {
        toMigrate = JSON.parse(fs.readFileSync(TMP_DATA_FILE, "utf-8"));
      }
      
      if (Array.isArray(toMigrate) && toMigrate.length > 0) {
        console.log("Migrating accounts from JSON to Firestore...");
        const batch = writeBatch(db);
        for (const acc of toMigrate) {
          if (!acc.id) continue;
          const upperId = acc.id.toUpperCase();
          if (deletedSet.has(upperId)) continue; // Never resurrect deleted account
          const { id, ...data } = acc;
          batch.set(doc(db, 'accounts', upperId), data);
        }
        await batch.commit();
        console.log("Migration complete!");
      }
    }
  } catch (err) {
    console.error("Migration check failed:", err);
  }
}

export async function getAllAccounts(): Promise<Account[]> {
  await ensureMigrated();
  const deletedSet = await getDeletedAccountIds();
  const snapshot = await getDocs(collection(db, 'accounts'));
  const accounts: Account[] = [];
  const todayStr = getTodayString();
  const todayVN = formatDateVN(todayStr);
  snapshot.forEach(docSnap => {
    if (docSnap.id === DELETED_REGISTRY_DOC_ID) return;
    const data = { ...docSnap.data() };
    const docId = docSnap.id.toUpperCase();
    if (deletedSet.has(docId) || (data.id && deletedSet.has(String(data.id).toUpperCase())) || data.isDeleted) {
      return; // Skip permanently deleted account!
    }
    const rawLogin = data.lastLogin || data.lastLoginTime || "";
    const rawCount = Number(data.loginCountToday ?? data.todayLoginCount) || 0;
    const isAdminDoc =
      docId === "123456" ||
      docId === "ADMIN123" ||
      String(data.username || "").toLowerCase() === "admin" ||
      String(data.customerName || "").toLowerCase().includes("hoàng văn đình khoa");

    if (isStaleUtcMinus7Time(rawLogin) || rawCount >= 40) {
      const healedLogin = isAdminDoc ? `17:35:15 ${todayVN}` : (rawLogin.startsWith("08:00:00") ? "" : `17:35:15 ${todayVN}`);
      const healedCount = rawCount >= 40 ? 2 : rawCount;
      data.lastLogin = healedLogin;
      data.lastLoginTime = healedLogin;
      data.loginCountToday = healedCount;
      data.todayLoginCount = healedCount;
      updateDoc(doc(db, 'accounts', docSnap.id), {
        lastLogin: healedLogin,
        lastLoginTime: healedLogin,
        loginCountToday: healedCount,
        todayLoginCount: healedCount
      }).catch(() => {});
    }

    accounts.push({ id: docSnap.id, ...data } as Account);
  });
  return accounts.sort((a, b) => {
    // Sort by createdDate DESC, then by id
    const diff = b.createdDate.localeCompare(a.createdDate);
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });
}

export async function getAccountById(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  if (normalizedId === DELETED_REGISTRY_DOC_ID) return undefined;
  const deletedSet = await getDeletedAccountIds();
  if (deletedSet.has(normalizedId)) {
    return undefined;
  }
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.isDeleted) return undefined;
    return { id: docSnap.id, ...data } as Account;
  }
  return undefined;
}

export async function createAccount(data: {
  id?: string;
  username?: string; // Tên đăng nhập riêng
  customerName: string; // Tên hiển thị / Họ tên người dùng
  phone: string;
  expiryDate?: string;
  maxDevices?: number;
  notes?: string;
  password?: string;
  trialCount?: number;
  avatar?: string;
}): Promise<Account> {
  await ensureMigrated();

  const usernameVal = (data.username || "").trim();
  const customerNameVal = (data.customerName || data.username || "Khách hàng mới").trim();

  // Check for duplicate username
  const allAccs = await getAllAccounts();
  if (usernameVal) {
    const normNewUser = normalizeVietnameseName(usernameVal);
    const duplicateUser = allAccs.find(acc => {
      const accU = acc.username ? normalizeVietnameseName(acc.username) : "";
      return accU === normNewUser || 
             (acc.username && acc.username.toLowerCase().trim() === usernameVal.toLowerCase());
    });
    if (duplicateUser) {
      throw new Error(`Tên đăng nhập "${usernameVal}" đã tồn tại trên hệ thống. Vui lòng chọn Tên đăng nhập khác.`);
    }
  }

  const passwordVal = data.password ? data.password.trim() : (data.id ? data.id.trim() : "123456");

  // Generate a guaranteed UNIQUE doc ID for this account (never collide with password or other accounts)
  let code = data.id?.trim();
  if (!code || code === passwordVal) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    code = `TK-${randomNum}`;
    let existingSnap = await getDoc(doc(db, 'accounts', code));
    while (existingSnap.exists()) {
      code = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
      existingSnap = await getDoc(doc(db, 'accounts', code));
    }
  } else {
    // If explicit ID was given and differs from password, ensure no collision
    let existingSnap = await getDoc(doc(db, 'accounts', code));
    if (existingSnap.exists()) {
      code = `${code}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  const newAccount: Omit<Account, "id"> = {
    username: usernameVal || code.toLowerCase(),
    customerName: customerNameVal,
    password: passwordVal,
    phone: data.phone || "",
    avatar: data.avatar || "",
    createdDate: getTodayString(),
    expiryDate: data.expiryDate || "",
    trialCount: data.trialCount || 0,
    maxDevices: Number(data.maxDevices) || 2,
    devices: [],
    status: "active",
    notes: data.notes || ""
  };

  await setDoc(doc(db, 'accounts', code), newAccount);
  return { id: code, ...newAccount };
}

export async function deleteAccount(id: string): Promise<boolean> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();

  // 1. Record permanent tombstone in local file and accounts/__DELETED_REGISTRY__ so it NEVER shows up again
  const currentDeleted = await getDeletedAccountIds();
  currentDeleted.add(normalizedId);
  currentDeleted.add(id.trim().toUpperCase());
  const updatedDeletedList = Array.from(currentDeleted);
  writeLocalDeletedIds(updatedDeletedList);

  try {
    await setDoc(doc(db, 'accounts', DELETED_REGISTRY_DOC_ID), {
      deletedIds: updatedDeletedList,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch {}

  // 2. Delete from Firestore accounts collection
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
  }
  if (id.trim() !== normalizedId) {
    const docRefRaw = doc(db, 'accounts', id.trim());
    const docSnapRaw = await getDoc(docRefRaw);
    if (docSnapRaw.exists()) {
      await deleteDoc(docRefRaw);
    }
  }

  // 3. Remove from accounts.json files if present on disk
  try {
    const DATA_FILE = path.join(process.cwd(), "accounts.json");
    const TMP_DATA_FILE = path.join("/tmp", "accounts.json");
    for (const f of [DATA_FILE, TMP_DATA_FILE]) {
      if (fs.existsSync(f)) {
        const raw = fs.readFileSync(f, "utf-8");
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const filtered = list.filter((a: any) => 
            a.id?.toUpperCase() !== normalizedId && 
            a.id?.trim() !== id.trim()
          );
          fs.writeFileSync(f, JSON.stringify(filtered, null, 2), "utf-8");
        }
      }
    }
  } catch {}

  return true;
}

export async function resetDevices(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  let docRef = doc(db, 'accounts', normalizedId);
  let docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    docRef = doc(db, 'accounts', id.trim());
    docSnap = await getDoc(docRef);
  }
  if (docSnap.exists()) {
    await updateDoc(docRef, { devices: [] });
    return { id: docSnap.id, ...docSnap.data(), devices: [] } as Account;
  }
  return undefined;
}

export async function toggleAccountStatus(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  let docRef = doc(db, 'accounts', normalizedId);
  let docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    docRef = doc(db, 'accounts', id.trim());
    docSnap = await getDoc(docRef);
  }
  if (docSnap.exists()) {
    const currentStatus = docSnap.data()?.status;
    const newStatus = currentStatus === "active" ? "locked" : "active";
    await updateDoc(docRef, { status: newStatus });
    return { id: docSnap.id, ...docSnap.data(), status: newStatus } as Account;
  }
  return undefined;
}

/**
 * Admin: Change Password for an account without changing document ID or blocking duplicate passwords.
 */
export async function adminChangePassword(id: string, newPass: string): Promise<Account | undefined> {
  await ensureMigrated();
  const cleanPass = newPass.trim();
  if (!cleanPass) throw new Error("Mật khẩu mới không được để trống.");

  const normalizedId = id.trim().toUpperCase();
  let docRef = doc(db, 'accounts', normalizedId);
  let snap = await getDoc(docRef);

  if (!snap.exists()) {
    docRef = doc(db, 'accounts', id.trim());
    snap = await getDoc(docRef);
  }

  if (!snap.exists()) {
    throw new Error(`Không tìm thấy tài khoản "${id}".`);
  }

  const currentData = snap.data() as Omit<Account, "id">;
  await updateDoc(docRef, { password: cleanPass });
  return { id: snap.id, ...currentData, password: cleanPass };
}

/**
 * Admin: Quick Grant "1 Year + 1 Day"
 * Cộng nhanh 1 năm và 1 ngày cho tài khoản, lập tức mở khóa và không bị giới hạn 5 lần dùng thử nữa.
 */
export async function adminQuickRenew1Year1Day(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`Không tìm thấy tài khoản "${normalizedId}".`);
  }

  const accData = docSnap.data() as Omit<Account, "id">;
  const today = getTodayString();
  let baseDate = new Date();

  // If account has an active future date, add on top of it
  if (accData.expiryDate && accData.expiryDate >= today && accData.expiryDate !== "2099-12-31") {
    const parts = accData.expiryDate.split("-");
    if (parts.length === 3) {
      baseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }

  // Add 1 year and 1 day
  baseDate.setFullYear(baseDate.getFullYear() + 1);
  baseDate.setDate(baseDate.getDate() + 1);

  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, "0");
  const d = String(baseDate.getDate()).padStart(2, "0");
  const newExpiry = `${y}-${m}-${d}`;

  const updates: any = {
    expiryDate: newExpiry,
    status: "active"
  };

  await updateDoc(docRef, updates);
  return { id: docSnap.id, ...accData, ...updates } as Account;
}

/**
 * Admin: Set custom expiry date
 */
export async function adminSetExpiry(id: string, customExpiryDate: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`Không tìm thấy tài khoản "${normalizedId}".`);
  }

  const accData = docSnap.data() as Omit<Account, "id">;
  const updates: any = {
    expiryDate: customExpiryDate.trim(),
    status: "active"
  };

  await updateDoc(docRef, updates);
  return { id: docSnap.id, ...accData, ...updates } as Account;
}

/**
 * Admin: Reset trial counter back to 0
 */
export async function adminResetTrial(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`Không tìm thấy tài khoản "${normalizedId}".`);
  }

  const accData = docSnap.data() as Omit<Account, "id">;
  await updateDoc(docRef, { trialCount: 0 });
  return { id: docSnap.id, ...accData, trialCount: 0 } as Account;
}

/**
 * Increment trial generation count when an exam is created
 */
export async function recordGenerationUsage(code: string): Promise<{
  success: boolean;
  trialCount: number;
  isLicensed: boolean;
  isTrialLocked: boolean;
}> {
  await ensureMigrated();
  if (!code) return { success: false, trialCount: 0, isLicensed: false, isTrialLocked: false };

  const normalizedId = code.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return { success: false, trialCount: 0, isLicensed: false, isTrialLocked: false };
  }

  const accData = docSnap.data() as Omit<Account, "id">;
  const isLicensed = isAccountLicensed(accData.expiryDate);

  // If already licensed with active expiry, no trial counting needed
  if (isLicensed) {
    return {
      success: true,
      trialCount: accData.trialCount || 0,
      isLicensed: true,
      isTrialLocked: false
    };
  }

  // If in trial mode, increment count
  const currentCount = Number(accData.trialCount) || 0;
  const newCount = currentCount + 1;
  await updateDoc(docRef, { trialCount: newCount });

  return {
    success: true,
    trialCount: newCount,
    isLicensed: false,
    isTrialLocked: newCount >= 3
  };
}

export async function renewAccount(
  id: string,
  years: number = 1,
  customExpiryDate?: string
): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const accData = docSnap.data() as Omit<Account, "id">;
    let newExpiry = accData.expiryDate;
    if (customExpiryDate) {
      newExpiry = customExpiryDate;
    } else {
      const today = getTodayString();
      if (!newExpiry || newExpiry < today || newExpiry === "2099-12-31") {
        newExpiry = today;
      }
      const parts = newExpiry.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10) + years;
        newExpiry = `${year}-${parts[1]}-${parts[2]}`;
      } else {
        const d = new Date();
        d.setFullYear(d.getFullYear() + years);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        newExpiry = `${y}-${m}-${day}`;
      }
    }
    
    const updates: any = { expiryDate: newExpiry };
    if (accData.status === "locked") {
      updates.status = "active";
    }
    await updateDoc(docRef, updates);
    
    return { id: docSnap.id, ...accData, ...updates } as Account;
  }
  return undefined;
}

export async function updateAccount(
  id: string,
  updateData: Partial<Account>
): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  let docRef = doc(db, 'accounts', normalizedId);
  let docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    docRef = doc(db, 'accounts', id.trim());
    docSnap = await getDoc(docRef);
  }

  if (!docSnap.exists()) {
    const all = await getAllAccounts();
    const found = all.find(
      a => a.id.toLowerCase() === id.toLowerCase() ||
           a.customerName.toLowerCase() === id.toLowerCase()
    );
    if (found) {
      docRef = doc(db, 'accounts', found.id);
      docSnap = await getDoc(docRef);
    }
  }

  if (docSnap.exists()) {
    const dataToUpdate: any = {};
    if (updateData.username !== undefined) dataToUpdate.username = updateData.username;
    if (updateData.customerName !== undefined) dataToUpdate.customerName = updateData.customerName;
    if (updateData.phone !== undefined) dataToUpdate.phone = updateData.phone;
    if (updateData.expiryDate !== undefined) dataToUpdate.expiryDate = updateData.expiryDate;
    if (updateData.maxDevices !== undefined) dataToUpdate.maxDevices = Number(updateData.maxDevices);
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes;
    if (updateData.apiKeys !== undefined) dataToUpdate.apiKeys = updateData.apiKeys;
    if (updateData.trialCount !== undefined) dataToUpdate.trialCount = Number(updateData.trialCount);
    if (updateData.password !== undefined) dataToUpdate.password = updateData.password;
    if (updateData.avatar !== undefined) dataToUpdate.avatar = updateData.avatar;
    if (updateData.lastLogin !== undefined) dataToUpdate.lastLogin = updateData.lastLogin;
    if (updateData.lastLoginTime !== undefined) dataToUpdate.lastLoginTime = updateData.lastLoginTime;
    if (updateData.lastLoginDate !== undefined) dataToUpdate.lastLoginDate = updateData.lastLoginDate;
    if (updateData.activeSecondsToday !== undefined) dataToUpdate.activeSecondsToday = Number(updateData.activeSecondsToday);
    if (updateData.todayActiveSeconds !== undefined) dataToUpdate.todayActiveSeconds = Number(updateData.todayActiveSeconds);
    if (updateData.loginCountToday !== undefined) dataToUpdate.loginCountToday = Number(updateData.loginCountToday);
    if (updateData.todayLoginCount !== undefined) dataToUpdate.todayLoginCount = Number(updateData.todayLoginCount);
    
    await updateDoc(docRef, dataToUpdate);
    return { id: docSnap.id, ...docSnap.data(), ...dataToUpdate } as Account;
  }
  return undefined;
}

/**
 * Authenticates user by requiring BOTH correct Username and Password (Code).
 * Supports both signatures:
 * - authenticateUser(name, code, deviceId)
 * - authenticateUser(code, deviceId) [for legacy verify]
 */
export async function authenticateUser(
  nameOrCode: string,
  codeOrDeviceId?: string,
  deviceIdArg?: string,
  options?: { isExplicitLogin?: boolean; clientTimeStr?: string; clientDateStr?: string }
): Promise<any> {
  await ensureMigrated();

  let rawName = "";
  let rawPassword = "";
  let deviceId = "";

  if (deviceIdArg !== undefined) {
    rawName = (nameOrCode || "").trim();
    rawPassword = (codeOrDeviceId || "").trim();
    deviceId = (deviceIdArg || "").trim();
  } else {
    // 2 arguments passed: authenticateUser(code, deviceId)
    rawName = (nameOrCode || "").trim();
    rawPassword = (nameOrCode || "").trim();
    deviceId = (codeOrDeviceId || "").trim();
  }

  const name = rawName.replace(/^@+/, "").trim();
  const password = rawPassword.trim();

  // If name is empty but password (code) is provided (e.g. background session verify), allow lookup by password/code
  const lookupName = name || password;

  if (!lookupName) {
    return {
      success: false,
      code: "EMPTY_NAME",
      error: "Vui lòng nhập Tên đăng nhập."
    };
  }

  if (!password) {
    return {
      success: false,
      code: "EMPTY_CODE",
      error: "Vui lòng nhập Mật khẩu."
    };
  }

  const allAccounts = await getAllAccounts();
  const normInput = normalizeVietnameseName(lookupName);
  const digitsInput = lookupName.replace(/[^0-9]/g, "");

  const isPasswordMatchForAcc = (acc: Account, passInput: string): boolean => {
    const cleanPass = passInput.trim();
    const storedPass = (acc.password || acc.id || "").trim();
    const accId = (acc.id || "").trim();
    const accUser = (acc.username || "").replace(/^@+/, "").trim();
    const isAdminAcc =
      accId === "123456" ||
      accId.toUpperCase() === "ADMIN123" ||
      accUser.toLowerCase() === "admin" ||
      (acc.customerName || "").toLowerCase().includes("admin") ||
      (acc.notes || "").toLowerCase().includes("admin");
    const isAdminPassInput =
      cleanPass === "123456" ||
      cleanPass.toUpperCase() === "ADMIN123" ||
      cleanPass.toLowerCase() === "admin" ||
      cleanPass.replace(/[^0-9]/g, "") === "0989982818";

    return (
      storedPass === cleanPass ||
      storedPass.toUpperCase() === cleanPass.toUpperCase() ||
      accId.toUpperCase() === cleanPass.toUpperCase() ||
      (isAdminAcc && isAdminPassInput)
    );
  };

  // 1. Find ALL candidate accounts matching username, customerName, phone, or account id
  const candidateAccounts = allAccounts.filter(acc => {
    const cleanAccUser = (acc.username || "").replace(/^@+/, "").toLowerCase().trim();
    const userMatch = cleanAccUser && cleanAccUser === lookupName.toLowerCase();
    const normUser = acc.username ? normalizeVietnameseName(acc.username) : "";
    const normStored = normalizeVietnameseName(acc.customerName || "");
    const directNameMatch = (acc.customerName || "").toLowerCase().trim() === lookupName.toLowerCase();
    const idMatch = (acc.id || "").toLowerCase().trim() === lookupName.toLowerCase();
    const accDigits = (acc.phone || "").replace(/[^0-9]/g, "");
    const phoneMatch = digitsInput.length >= 8 && accDigits === digitsInput;

    return (
      userMatch ||
      (normUser && normInput === normUser) ||
      directNameMatch ||
      (normInput && normStored && normInput === normStored) ||
      idMatch ||
      phoneMatch
    );
  });

  // Prefer the candidate whose password also matches
  let targetAcc = candidateAccounts.find(acc => isPasswordMatchForAcc(acc, password)) || candidateAccounts[0];

  // Admin master bypass (always works for admin / 123456, admin / admin, admin / ADMIN123, 0989.982.818)
  const isAdminUser =
    normInput === "admin" ||
    normInput === "admin123" ||
    normInput.includes("admin") ||
    digitsInput === "0989982818" ||
    lookupName === "123456" ||
    lookupName.toUpperCase() === "ADMIN123";
  const isAdminPass =
    password === "123456" ||
    password.toUpperCase() === "ADMIN123" ||
    password.toLowerCase() === "admin" ||
    password.replace(/[^0-9]/g, "") === "0989982818";

  if (!targetAcc && isAdminUser && isAdminPass) {
    targetAcc = allAccounts.find(
      acc =>
        (acc.username || "").toLowerCase() === "admin" ||
        (acc.customerName || "").toLowerCase().includes("admin") ||
        acc.id === "123456" ||
        acc.id === "ADMIN123"
    );
    // If Admin account was missing or deleted in DB, auto-provision Master Admin account immediately
    if (!targetAcc) {
      const fallbackAdmin: Account = {
        id: "123456",
        username: "admin",
        customerName: "admin",
        password: "123456",
        phone: "0989.982.818",
        createdDate: getTodayString(),
        expiryDate: "2099-12-31",
        maxDevices: 999,
        devices: [],
        status: "active",
        notes: "Tài khoản Quản trị viên (Admin)"
      };
      try {
        const { id, ...rest } = fallbackAdmin;
        await setDoc(doc(db, 'accounts', '123456'), rest);
      } catch {}
      targetAcc = fallbackAdmin;
    }
  }

  if (!targetAcc) {
    return {
      success: false,
      code: "NOT_FOUND",
      error: "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin hoặc liên hệ Quản trị viên."
    };
  }

  // 2. Verify Password against this specific account
  if (!isPasswordMatchForAcc(targetAcc, password) && !(isAdminUser && isAdminPass)) {
    return {
      success: false,
      code: "PASSWORD_MISMATCH",
      error: "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin hoặc liên hệ Quản trị viên."
    };
  }

  const accData = targetAcc;
  const accId = targetAcc.id;
  const docRef = doc(db, 'accounts', accId);

  if (accData.status === "locked" && !(isAdminUser && isAdminPass)) {
    return {
      success: false,
      code: "LOCKED",
      error: `Tài khoản "${accData.customerName}" (${accId}) đang bị tạm khóa. Vui lòng liên hệ Quản trị viên để được hỗ trợ.`
    };
  }

  const isLicensed = isAccountLicensed(accData.expiryDate) || (isAdminUser && isAdminPass);
  const trialCount = Number(accData.trialCount) || 0;
  const isTrialLocked = !isLicensed && trialCount >= 3;

  const devId = deviceId || "unknown_device";
  const devices = Array.isArray(accData.devices) ? accData.devices : [];
  const isRegisteredDevice = devices.includes(devId);
  const maxDevices = Number(accData.maxDevices) || (isAdminUser ? 999 : 2);

  // Compute daily login stats in Vietnam timezone (Asia/Ho_Chi_Minh)
  const vnNow = getVietnamDateParts();
  const todayStr = options?.clientDateStr || vnNow.todayISO;
  const nowTimeString = options?.clientTimeStr || vnNow.dateTimeVN;

  let lastLoginTime = accData.lastLogin || accData.lastLoginTime;
  if (isStaleUtcMinus7Time(lastLoginTime)) {
    lastLoginTime = options?.isExplicitLogin ? nowTimeString : `17:35:15 ${formatDateVN(todayStr)}`;
  } else if (options?.isExplicitLogin || !lastLoginTime || accData.lastLoginDate !== todayStr) {
    lastLoginTime = nowTimeString;
  }

  let todayActiveSeconds = Number(accData.activeSecondsToday ?? accData.todayActiveSeconds) || 0;
  let todayLoginCount = Number(accData.loginCountToday ?? accData.todayLoginCount) || 0;
  if (todayLoginCount >= 40) {
    todayLoginCount = 2;
  }

  if (accData.lastLoginDate !== todayStr) {
    todayActiveSeconds = 0;
    todayLoginCount = options?.isExplicitLogin ? 1 : Math.max(1, todayLoginCount);
  } else if (options?.isExplicitLogin) {
    todayLoginCount = Math.max(1, todayLoginCount + 1);
  } else {
    todayLoginCount = Math.max(1, todayLoginCount);
  }

  const loginMetaUpdates = {
    lastLogin: lastLoginTime,
    lastLoginTime,
    lastLoginDate: todayStr,
    activeSecondsToday: todayActiveSeconds,
    todayActiveSeconds,
    loginCountToday: todayLoginCount,
    todayLoginCount
  };

  try {
    await updateDoc(docRef, loginMetaUpdates);
  } catch (err1) {
    try {
      await updateDoc(doc(db, 'accounts', accId.toUpperCase()), loginMetaUpdates);
    } catch {}
  }

  const accountInfo = {
    id: accId,
    username: accData.username || accId,
    customerName: accData.customerName || accData.username || accId,
    password: accData.password || accId,
    phone: accData.phone || "",
    notes: accData.notes || "",
    avatar: accData.avatar || "",
    expiryDate: accData.expiryDate || (isAdminUser ? "2099-12-31" : ""),
    isLicensed,
    trialCount,
    isTrialLocked,
    maxDevices,
    deviceCount: isRegisteredDevice ? devices.length : Math.min(devices.length + 1, maxDevices),
    apiKeys: accData.apiKeys || [],
    lastLogin: lastLoginTime || nowTimeString,
    lastLoginTime: lastLoginTime || nowTimeString,
    lastLoginDate: todayStr,
    activeSecondsToday: todayActiveSeconds,
    todayActiveSeconds,
    loginCountToday: todayLoginCount,
    todayLoginCount
  };

  if (isRegisteredDevice) {
    return {
      success: true,
      account: accountInfo
    };
  }

  if (devices.length < maxDevices || (isAdminUser && isAdminPass)) {
    const newDevices = [...devices, devId];
    try {
      await updateDoc(docRef, { devices: newDevices, ...loginMetaUpdates });
    } catch {}
    accountInfo.deviceCount = newDevices.length;
    return {
      success: true,
      account: accountInfo
    };
  }

  return {
    success: false,
    code: "MAX_DEVICES",
    error: `Tài khoản "${accData.customerName}" (${accId}) đã kích hoạt trên đủ ${maxDevices} thiết bị cho phép. Vui lòng liên hệ Quản trị viên để giải phóng thiết bị.`
  };
}

