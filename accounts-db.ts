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
  id: string; // Mã tài khoản
  customerName: string;
  phone: string;
  createdDate: string;
  expiryDate: string;
  maxDevices: number;
  devices: string[];
  status: "active" | "locked";
  notes?: string;
  apiKeys?: ApiKeyItem[];
}

export function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

let migrationRun = false;
async function ensureMigrated() {
  if (migrationRun) return;
  migrationRun = true;
  
  try {
    const snap = await getDocs(query(collection(db, 'accounts'), limit(1)));
    if (!snap.empty) return; // Already has data, no migration needed
    
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
        const { id, ...data } = acc;
        batch.set(doc(db, 'accounts', id.toUpperCase()), data);
      }
      await batch.commit();
      console.log("Migration complete!");
    } else {
      console.log("No existing accounts found, creating master admin account.");
      const SEED_ACCOUNT = {
        customerName: "Hoàng Văn Đình Khoa (Admin Master)",
        phone: "0989.982.818",
        createdDate: getTodayString(),
        expiryDate: "2099-12-31",
        maxDevices: 999,
        devices: [],
        status: "active",
        notes: "Tài khoản quản trị viên Master"
      };
      const SEED_TEST = {
        customerName: "Tài khoản kiểm tra (1111)",
        phone: "0989.982.818",
        createdDate: getTodayString(),
        expiryDate: "2099-12-31",
        maxDevices: 999,
        devices: [],
        status: "active",
        notes: "Mã tài khoản kiểm tra hệ thống"
      };
      await setDoc(doc(db, 'accounts', 'ADMIN123'), SEED_ACCOUNT);
      await setDoc(doc(db, 'accounts', '1111'), SEED_TEST);
    }
  } catch (err) {
    console.error("Migration check failed:", err);
  }
}

export async function getAllAccounts(): Promise<Account[]> {
  await ensureMigrated();
  const snapshot = await getDocs(collection(db, 'accounts'));
  const accounts: Account[] = [];
  snapshot.forEach(doc => {
    accounts.push({ id: doc.id, ...doc.data() } as Account);
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
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Account;
  }
  return undefined;
}

export async function createAccount(data: {
  id?: string;
  customerName: string;
  phone: string;
  expiryDate?: string;
  maxDevices?: number;
  notes?: string;
}): Promise<Account> {
  await ensureMigrated();
  let code = data.id?.trim().toUpperCase();
  if (!code) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    code = `TK-TINHOC-${randomNum}`;
  }

  const docRef = doc(db, 'accounts', code);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    throw new Error(`Mã tài khoản "${code}" đã tồn tại trong danh sách. Không thể tạo trùng mã!`);
  }

  const newAccount: Omit<Account, "id"> = {
    customerName: data.customerName || "Khách hàng mới",
    phone: data.phone || "",
    createdDate: getTodayString(),
    expiryDate: data.expiryDate || "2027-12-31",
    maxDevices: Number(data.maxDevices) || 2,
    devices: [],
    status: "active",
    notes: data.notes || ""
  };

  await setDoc(docRef, newAccount);
  return { id: code, ...newAccount };
}

export async function deleteAccount(id: string): Promise<boolean> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await deleteDoc(docRef);
    return true;
  }
  return false;
}

export async function resetDevices(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { devices: [] });
    return { id: docSnap.id, ...docSnap.data(), devices: [] } as Account;
  }
  return undefined;
}

export async function toggleAccountStatus(id: string): Promise<Account | undefined> {
  await ensureMigrated();
  const normalizedId = id.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const currentStatus = docSnap.data()?.status;
    const newStatus = currentStatus === "active" ? "locked" : "active";
    await updateDoc(docRef, { status: newStatus });
    return { id: docSnap.id, ...docSnap.data(), status: newStatus } as Account;
  }
  return undefined;
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
  const docRef = doc(db, 'accounts', normalizedId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const dataToUpdate: any = {};
    if (updateData.customerName !== undefined) dataToUpdate.customerName = updateData.customerName;
    if (updateData.phone !== undefined) dataToUpdate.phone = updateData.phone;
    if (updateData.expiryDate !== undefined) dataToUpdate.expiryDate = updateData.expiryDate;
    if (updateData.maxDevices !== undefined) dataToUpdate.maxDevices = Number(updateData.maxDevices);
    if (updateData.notes !== undefined) dataToUpdate.notes = updateData.notes;
    if (updateData.apiKeys !== undefined) dataToUpdate.apiKeys = updateData.apiKeys;
    
    await updateDoc(docRef, dataToUpdate);
    return { id: docSnap.id, ...docSnap.data(), ...dataToUpdate } as Account;
  }
  return undefined;
}

export async function authenticateUser(code: string, deviceId: string): Promise<any> {
  await ensureMigrated();
  if (!code || !code.trim()) {
    return {
      success: false,
      code: "EMPTY_CODE",
      error: "Vui lòng nhập mã tài khoản được cấp."
    };
  }

  const normalizedCode = code.trim().toUpperCase();
  const docRef = doc(db, 'accounts', normalizedCode);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return {
      success: false,
      code: "NOT_FOUND",
      error: `Mã tài khoản "${normalizedCode}" không tồn tại trên hệ thống (hoặc đã bị xóa). Vui lòng liên hệ Admin 0989.982.818 để được cấp lại.`
    };
  }

  const accData = docSnap.data() as Omit<Account, "id">;
  const accId = docSnap.id;

  if (accData.status === "locked") {
    return {
      success: false,
      code: "LOCKED",
      error: `Tài khoản "${accId}" đã bị khóa, không thể xuất file được! Vui lòng liên hệ Admin 0989.982.818 để được hỗ trợ mở khóa.`
    };
  }

  const today = getTodayString();
  if (accData.expiryDate && accData.expiryDate < today) {
    return {
      success: false,
      code: "EXPIRED",
      error: `Tài khoản "${accId}" đã hết hạn sử dụng vào ngày ${formatDateVN(accData.expiryDate)}. Vui lòng liên hệ Admin 0989.982.818 để gia hạn.`
    };
  }

  const devId = deviceId || "unknown_device";
  const devices = accData.devices || [];
  const isRegisteredDevice = devices.includes(devId);

  if (isRegisteredDevice) {
    return {
      success: true,
      account: {
        id: accId,
        customerName: accData.customerName,
        phone: accData.phone,
        expiryDate: accData.expiryDate,
        maxDevices: accData.maxDevices,
        deviceCount: devices.length,
        apiKeys: accData.apiKeys || []
      }
    };
  }

  if (devices.length < accData.maxDevices) {
    const newDevices = [...devices, devId];
    await updateDoc(docRef, { devices: newDevices });
    return {
      success: true,
      account: {
        id: accId,
        customerName: accData.customerName,
        phone: accData.phone,
        expiryDate: accData.expiryDate,
        maxDevices: accData.maxDevices,
        deviceCount: newDevices.length,
        apiKeys: accData.apiKeys || []
      }
    };
  }

  return {
    success: false,
    code: "MAX_DEVICES",
    error: `Rất tiếc! Mã tài khoản "${accId}" (${accData.customerName}) đã được kích hoạt trên đủ ${accData.maxDevices} thiết bị. Sang máy khác không sử dụng được!\n\nVui lòng liên hệ Admin 0989.982.818 hoặc Zalo 0978.468.986 để giải phóng máy cũ.`
  };
}
