import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import firebaseConfigRaw from "../../firebase-applet-config.json";

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

function getClientDb() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(
    app,
    (firebaseConfig as any).firestoreDatabaseId ||
      "ai-studio-remixtokimtra178-eea5e342-e96f-47b5-9bae-cee722f798ff"
  );
}

function getTodayString(): string {
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
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Sanitize username to continuous unaccented lowercase alphanumeric string like Gmail usernames
 * E.g. "Hoàng Văn Khoa 123" -> "hoangvankhoa123"
 */
export function sanitizeUsername(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, "");
}

/**
 * Robust Dual-Layer Authentication.
 * 1. Checks user name and password (account code).
 * 2. Directly talks to Firestore or Server Endpoint `/api/auth/login`.
 */
export async function clientLogin(
  nameOrCode: string,
  codeOrDeviceId?: string,
  deviceIdArg?: string
): Promise<any> {
  let rawName = "";
  let rawCode = "";
  let deviceId = "";

  if (deviceIdArg !== undefined) {
    rawName = (nameOrCode || "").trim();
    rawCode = (codeOrDeviceId || "").trim();
    deviceId = (deviceIdArg || "").trim();
  } else {
    rawName = (nameOrCode || "").trim();
    rawCode = (nameOrCode || "").trim();
    deviceId = (codeOrDeviceId || "").trim();
  }

  const name = rawName.replace(/^@+/, "").trim();
  const code = rawCode.trim();
  const lookupName = name || code;

  if (!lookupName) {
    return { success: false, error: "Vui lòng nhập Tên đăng nhập." };
  }

  if (!code) {
    return { success: false, error: "Vui lòng nhập Mật khẩu." };
  }

  let serverErrorMsg: string | null = null;

  // 1. Try Server Endpoint First (Unified robust auth logic)
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: lookupName, customerName: lookupName, code, password: code, deviceId }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (data && data.success) {
        return data;
      }
      if (data && data.error) {
        serverErrorMsg = data.error;
        // Only return immediately on explicit lock/device limit errors; for NOT_FOUND or PASSWORD_MISMATCH, also verify against client Firestore
        if (data.code === "LOCKED" || data.code === "MAX_DEVICES") {
          return data;
        }
      }
    }
  } catch (serverErr) {
    console.warn("Server auth endpoint unavailable, falling back to direct Firestore...", serverErr);
  }

  // 2. Direct Firestore Client Fallback
  const normInput = normalizeVietnameseName(lookupName);
  const digitsInput = lookupName.replace(/[^0-9]/g, "");
  const isAdminUser =
    normInput === "admin" ||
    normInput === "admin123" ||
    normInput.includes("admin") ||
    digitsInput === "0989982818" ||
    lookupName === "123456" ||
    lookupName.toUpperCase() === "ADMIN123";
  const isAdminPass =
    code === "123456" ||
    code.toUpperCase() === "ADMIN123" ||
    code.toLowerCase() === "admin" ||
    code.replace(/[^0-9]/g, "") === "0989982818";

  try {
    const db = getClientDb();
    const snap = await getDocs(collection(db, "accounts"));

    let localDeletedIds = new Set<string>();
    try {
      const rawDel = localStorage.getItem("khaothi_deleted_account_ids");
      if (rawDel) {
        const arr = JSON.parse(rawDel);
        if (Array.isArray(arr)) arr.forEach((id) => localDeletedIds.add(String(id).toUpperCase()));
      }
    } catch {}

    snap.forEach((d) => {
      if (d.id === "__DELETED_REGISTRY__") {
        const regData = d.data();
        if (Array.isArray(regData.deletedIds)) {
          regData.deletedIds.forEach((id: any) => localDeletedIds.add(String(id).toUpperCase()));
        }
      }
    });

    const isDocPasswordMatch = (docId: string, data: any): boolean => {
      const storedPass = (data.password || docId || "").trim();
      const accUser = (data.username || "").replace(/^@+/, "").trim();
      const isAccAdmin =
        docId === "123456" ||
        docId.toUpperCase() === "ADMIN123" ||
        accUser.toLowerCase() === "admin" ||
        (data.customerName || "").toLowerCase().includes("admin") ||
        (data.notes || "").toLowerCase().includes("admin");
      return (
        storedPass === code ||
        storedPass.toUpperCase() === code.toUpperCase() ||
        docId.toUpperCase() === code.toUpperCase() ||
        (isAccAdmin && isAdminPass)
      );
    };

    const candidateDocs: any[] = [];
    snap.forEach((d) => {
      if (d.id === "__DELETED_REGISTRY__") return;
      const data = d.data();
      const isAccAdmin = d.id === "123456" || d.id.toUpperCase() === "ADMIN123" || (data.username || "").toLowerCase() === "admin";
      if (!isAccAdmin && (data.isDeleted === true || localDeletedIds.has(d.id.toUpperCase()))) return;

      const cleanUser = (data.username || "").replace(/^@+/, "").toLowerCase().trim();
      const normStored = normalizeVietnameseName(data.customerName || "");
      const normUsername = normalizeVietnameseName(data.username || "");
      const directMatch = (data.customerName || "").toLowerCase().trim() === lookupName.toLowerCase();
      const usernameMatch = cleanUser && cleanUser === lookupName.toLowerCase();
      const idMatch = d.id.toLowerCase().trim() === lookupName.toLowerCase();
      const accDigits = (data.phone || "").replace(/[^0-9]/g, "");
      const phoneMatch = digitsInput.length >= 8 && accDigits === digitsInput;

      if (
        usernameMatch ||
        directMatch ||
        (normInput && normUsername && normInput === normUsername) ||
        (normInput && normStored && normInput === normStored) ||
        idMatch ||
        phoneMatch
      ) {
        candidateDocs.push(d);
      }
    });

    let matchingDoc: any =
      candidateDocs.find((d) => isDocPasswordMatch(d.id, d.data())) || candidateDocs[0] || null;

    if (!matchingDoc && isAdminUser && isAdminPass) {
      snap.forEach((d) => {
        if (matchingDoc || d.id === "__DELETED_REGISTRY__") return;
        const data = d.data();
        if ((data.username || "").toLowerCase() === "admin" || (data.customerName || "").toLowerCase().includes("admin") || d.id === "123456" || d.id === "ADMIN123") {
          matchingDoc = d;
        }
      });
    }

    if (matchingDoc) {
      const acc = matchingDoc.data();
      const accId = matchingDoc.id;

      if (!isDocPasswordMatch(accId, acc) && !(isAdminUser && isAdminPass)) {
        return {
          success: false,
          error: "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin hoặc liên hệ Quản trị viên."
        };
      }

      if (acc.status === "locked" && !(isAdminUser && isAdminPass)) {
        return {
          success: false,
          error: `Tài khoản "${acc.customerName}" đang bị tạm khóa. Vui lòng liên hệ Quản trị viên để được hỗ trợ.`
        };
      }

      const isLicensed = isAccountLicensed(acc.expiryDate) || (isAdminUser && isAdminPass);
      const trialCount = Number(acc.trialCount) || 0;
      const isTrialLocked = !isLicensed && trialCount >= 5;

      const devId = deviceId || "unknown_device";
      const devices = Array.isArray(acc.devices) ? acc.devices : [];
      const isRegistered = devices.includes(devId);
      const maxDevices = Number(acc.maxDevices) || (isAdminUser ? 999 : 2);

      const accountPayload = {
        id: accId,
        username: acc.username || accId,
        customerName: acc.customerName || acc.username || accId,
        password: acc.password || accId,
        phone: acc.phone || "",
        notes: acc.notes || "",
        avatar: acc.avatar || "",
        expiryDate: acc.expiryDate || (isAdminUser ? "2099-12-31" : ""),
        isLicensed,
        trialCount,
        isTrialLocked,
        maxDevices: maxDevices,
        deviceCount: isRegistered ? devices.length : Math.min(devices.length + 1, maxDevices),
        apiKeys: acc.apiKeys || []
      };

      if (isRegistered) {
        return {
          success: true,
          account: accountPayload
        };
      }

      if (devices.length < maxDevices || (isAdminUser && isAdminPass)) {
        const updatedDevices = [...devices, devId];
        try {
          await updateDoc(doc(db, "accounts", accId), { devices: updatedDevices });
        } catch (err) {
          console.warn("Could not update device to firestore:", err);
        }
        accountPayload.deviceCount = updatedDevices.length;
        return {
          success: true,
          account: accountPayload
        };
      }

      return {
        success: false,
        error: `Tài khoản "${acc.customerName}" đã kích hoạt trên đủ ${maxDevices} thiết bị cho phép. Vui lòng liên hệ Quản trị viên để giải phóng thiết bị.`
      };
    }
  } catch (firestoreErr) {
    console.error("Firestore auth check error:", firestoreErr);
  }

  // Emergency fallback if Admin logs in with valid credentials when Firestore is unreachable or empty
  if (isAdminUser && isAdminPass) {
    return {
      success: true,
      account: {
        id: "123456",
        username: "admin",
        customerName: "admin",
        password: "123456",
        phone: "0989.982.818",
        notes: "Tài khoản Quản trị viên (Admin)",
        avatar: "",
        expiryDate: "2099-12-31",
        isLicensed: true,
        trialCount: 0,
        isTrialLocked: false,
        maxDevices: 999,
        deviceCount: 1,
        apiKeys: []
      }
    };
  }

  return {
    success: false,
    error: serverErrorMsg || "Tên đăng nhập hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin hoặc liên hệ Quản trị viên."
  };
}

/**
 * Verify saved account in background
 */
export async function clientVerify(code: string, deviceId: string, name?: string): Promise<any> {
  return clientLogin(name || code || "", code, deviceId);
}

/**
 * Admin: Verify PIN (123456 or 0989982818)
 */
export async function clientAdminVerifyPin(pin: string): Promise<boolean> {
  const clean = pin.trim();
  if (clean === "123456" || clean === "0989982818") return true;

  try {
    const res = await fetch("/api/admin/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: clean })
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return clean === "123456" || clean === "0989982818";
  }
}

/**
 * Admin: Get All Accounts (Dual Layer, filtered from deleted blacklist)
 */
export async function clientAdminGetAccounts(pin: string): Promise<any[]> {
  const getDeletedSet = () => {
    try {
      const raw = localStorage.getItem("khaothi_deleted_account_ids");
      if (raw) return new Set<string>(JSON.parse(raw).map((s: string) => String(s).toUpperCase()));
    } catch {}
    return new Set<string>();
  };

  const deletedSet = getDeletedSet();
  let accounts: any[] = [];

  try {
    const res = await fetch("/api/admin/accounts/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin })
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.accounts)) {
      accounts = data.accounts;
    }
  } catch {}

  // Fallback to direct Firestore
  if (accounts.length === 0) {
    try {
      const db = getClientDb();
      const snap = await getDocs(collection(db, "accounts"));
      snap.forEach((d) => {
        if (d.id === "__DELETED_REGISTRY__") {
          const regData = d.data();
          if (Array.isArray(regData.deletedIds)) {
            regData.deletedIds.forEach((id: any) => deletedSet.add(String(id).toUpperCase()));
          }
          return;
        }
        accounts.push({ id: d.id, ...d.data() });
      });
    } catch (err) {
      console.warn("Firestore get accounts fallback warning:", err);
    }
  }

  return accounts.filter((a: any) => {
    const idUpper = (a.id || "").toUpperCase();
    return idUpper !== "__DELETED_REGISTRY__" && !deletedSet.has(idUpper) && !a.isDeleted;
  });
}

/**
 * Admin: Create Account
 */
export async function clientAdminCreateAccount(
  pin: string,
  accountData: {
    id?: string;
    username?: string;
    customerName: string;
    phone: string;
    expiryDate: string;
    maxDevices: number;
    notes?: string;
    password?: string;
    avatar?: string;
  }
): Promise<{ success: boolean; account?: any; error?: string }> {
  // 1. Try Server
  try {
    const res = await fetch("/api/admin/accounts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, ...accountData })
    });
    const data = await res.json();
    if (data && data.success) return data;
    if (data && data.error) return { success: false, error: data.error };
  } catch {}

  // 2. Direct Firestore fallback
  try {
    const db = getClientDb();
    const cleanPassword = (accountData.password || accountData.id || "123456").trim();
    let id = accountData.id && accountData.id.trim() !== cleanPassword
      ? accountData.id.trim().toUpperCase()
      : `TK-${Math.floor(100000 + Math.random() * 900000)}`;
    const docRef = doc(db, "accounts", id);
    const newAccount = {
      username: (accountData.username || id.toLowerCase()).trim(),
      customerName: accountData.customerName,
      password: cleanPassword,
      phone: accountData.phone,
      avatar: accountData.avatar || "",
      createdDate: getTodayString(),
      expiryDate: accountData.expiryDate,
      maxDevices: accountData.maxDevices || 2,
      devices: [],
      status: "active",
      notes: accountData.notes || ""
    };
    await setDoc(docRef, newAccount);
    return { success: true, account: { id, ...newAccount } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi tạo tài khoản trên Firestore" };
  }
}

/**
 * Admin: Delete Account
 */
export async function clientAdminDeleteAccount(pin: string, id: string): Promise<boolean> {
  const normId = id.trim().toUpperCase();

  // Save to client-side deleted blacklist permanently
  try {
    const existingRaw = localStorage.getItem("khaothi_deleted_account_ids");
    const set = existingRaw ? new Set(JSON.parse(existingRaw)) : new Set<string>();
    set.add(normId);
    set.add(id.trim());
    localStorage.setItem("khaothi_deleted_account_ids", JSON.stringify(Array.from(set)));
  } catch {}

  let serverOk = false;
  try {
    const res = await fetch("/api/admin/accounts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id })
    });
    const d = await res.json();
    if (d && d.success) serverOk = true;
  } catch {}

  try {
    const db = getClientDb();
    // Record tombstone in accounts/__DELETED_REGISTRY__
    const regRef = doc(db, "accounts", "__DELETED_REGISTRY__");
    const regSnap = await getDoc(regRef);
    const existingIds: string[] = regSnap.exists() && Array.isArray(regSnap.data()?.deletedIds)
      ? regSnap.data().deletedIds
      : [];
    const mergedIds = Array.from(new Set([...existingIds, normId]));
    await setDoc(regRef, {
      deletedIds: mergedIds,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    await deleteDoc(doc(db, "accounts", normId));
    return true;
  } catch {
    return serverOk;
  }
}

/**
 * Admin: Reset Devices
 */
export async function clientAdminResetDevices(pin: string, id: string): Promise<boolean> {
  try {
    await fetch("/api/admin/accounts/reset-devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id })
    });
  } catch {}

  try {
    const db = getClientDb();
    await updateDoc(doc(db, "accounts", id.toUpperCase()), { devices: [] });
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin: Toggle Status
 */
export async function clientAdminToggleStatus(pin: string, id: string, currentStatus?: string): Promise<boolean> {
  try {
    await fetch("/api/admin/accounts/toggle-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id })
    });
  } catch {}

  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const nextStatus = data.status === "active" ? "locked" : "active";
      await updateDoc(docRef, { status: nextStatus });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Admin: Renew Account
 */
export async function clientAdminRenewAccount(
  pin: string,
  id: string,
  years: number = 1,
  customExpiryDate?: string
): Promise<{ success: boolean; account?: any; error?: string }> {
  try {
    const res = await fetch("/api/admin/accounts/renew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id, years, customExpiryDate })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: "Không tìm thấy tài khoản" };

    const acc = snap.data();
    let newExpiry = customExpiryDate;
    if (!newExpiry) {
      const curr = acc.expiryDate && acc.expiryDate > getTodayString() ? new Date(acc.expiryDate) : new Date();
      curr.setFullYear(curr.getFullYear() + years);
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, "0");
      const d = String(curr.getDate()).padStart(2, "0");
      newExpiry = `${y}-${m}-${d}`;
    }

    await updateDoc(docRef, { expiryDate: newExpiry });
    return { success: true, account: { id, ...acc, expiryDate: newExpiry } };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Admin: Update Account
 */
export async function clientAdminUpdateAccount(
  pin: string,
  id: string,
  updateData: any
): Promise<{ success: boolean; account?: any; error?: string }> {
  try {
    const res = await fetch("/api/admin/accounts/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id, updateData })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    await updateDoc(docRef, updateData);
    const snap = await getDoc(docRef);
    return { success: true, account: { id, ...snap.data() } };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Admin / User: Update API Keys
 */
export async function clientAdminUpdateKeys(
  pin: string,
  id: string,
  apiKeys: any[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/accounts/update-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id, apiKeys })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    await updateDoc(docRef, { apiKeys });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi cập nhật API Key" };
  }
}

/**
 * User: Update Profile / Display Name / Avatar
 */
export async function clientUpdateProfile(
  code: string,
  deviceId: string,
  customerName: string,
  phone?: string,
  notes?: string,
  avatar?: string,
  username?: string
): Promise<{ success: boolean; account?: any; error?: string }> {
  const cleanName = customerName.trim();
  if (!cleanName) {
    return { success: false, error: "Tên hiển thị không được để trống." };
  }

  // 1. Try Server Endpoint
  try {
    const res = await fetch("/api/user/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code.trim(),
        deviceId,
        username: username !== undefined ? username.trim() : undefined,
        customerName: cleanName,
        phone: phone ? phone.trim() : undefined,
        notes: notes ? notes.trim() : undefined,
        avatar: avatar !== undefined ? avatar : undefined
      })
    });
    const data = await res.json();
    if (data && data.success && data.account) {
      localStorage.setItem("khaothi_account_data", JSON.stringify(data.account));
      if (avatar) localStorage.setItem("khaothi_account_avatar", avatar);
      return data;
    }
  } catch {}

  // 2. Direct Firestore fallback
  try {
    const db = getClientDb();
    let docRef = doc(db, "accounts", code.trim());
    let snap = await getDoc(docRef);
    if (!snap.exists()) {
      docRef = doc(db, "accounts", code.trim().toUpperCase());
      snap = await getDoc(docRef);
    }
    const updatePayload: any = { customerName: cleanName };
    if (username !== undefined && username.trim()) updatePayload.username = username.trim();
    if (phone !== undefined) updatePayload.phone = phone.trim();
    if (notes !== undefined) updatePayload.notes = notes.trim();
    if (avatar !== undefined) updatePayload.avatar = avatar;

    if (snap.exists()) {
      await updateDoc(docRef, updatePayload);
      const updatedSnap = await getDoc(docRef);
      const updatedAccount = { id: updatedSnap.id, ...updatedSnap.data() };
      localStorage.setItem("khaothi_account_data", JSON.stringify(updatedAccount));
      if (avatar) localStorage.setItem("khaothi_account_avatar", avatar);
      return { success: true, account: updatedAccount };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi khi cập nhật tên trên cơ sở dữ liệu." };
  }

  return { success: false, error: "Không thể cập nhật tên hiển thị." };
}

/**
 * Admin: Change Password / Account Code
 */
export async function clientAdminChangePassword(
  pin: string,
  id: string,
  newPassword: string
): Promise<{ success: boolean; account?: any; error?: string }> {
  // 1. Try server
  try {
    const res = await fetch("/api/admin/accounts/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id, newPassword })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  // 2. Direct Firestore
  try {
    const db = getClientDb();
    const cleanPass = newPassword.trim();
    const normalizedId = id.toUpperCase();
    let docRef = doc(db, "accounts", normalizedId);
    let snap = await getDoc(docRef);
    if (!snap.exists()) {
      docRef = doc(db, "accounts", id.trim());
      snap = await getDoc(docRef);
    }
    if (!snap.exists()) return { success: false, error: "Không tìm thấy tài khoản" };

    const data = snap.data();
    await updateDoc(docRef, { password: cleanPass });
    return { success: true, account: { id: snap.id, ...data, password: cleanPass } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi đổi mật khẩu." };
  }
}

/**
 * Admin: Quick Renew "1 Year + 1 Day"
 */
export async function clientAdminQuickRenew1Year1Day(
  pin: string,
  id: string
): Promise<{ success: boolean; account?: any; error?: string }> {
  // 1. Try server
  try {
    const res = await fetch("/api/admin/accounts/quick-renew-1yr-1day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  // 2. Direct Firestore
  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: "Không tìm thấy tài khoản" };

    const acc = snap.data();
    const today = getTodayString();
    let baseDate = new Date();

    if (acc.expiryDate && acc.expiryDate >= today && acc.expiryDate !== "2099-12-31") {
      const parts = acc.expiryDate.split("-");
      if (parts.length === 3) {
        baseDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }

    baseDate.setFullYear(baseDate.getFullYear() + 1);
    baseDate.setDate(baseDate.getDate() + 1);

    const y = baseDate.getFullYear();
    const m = String(baseDate.getMonth() + 1).padStart(2, "0");
    const d = String(baseDate.getDate()).padStart(2, "0");
    const newExpiry = `${y}-${m}-${d}`;

    await updateDoc(docRef, { expiryDate: newExpiry, status: "active" });
    return { success: true, account: { id: snap.id, ...acc, expiryDate: newExpiry, status: "active" } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi cấp ngày sử dụng." };
  }
}

/**
 * Admin: Set Arbitrary Expiry Date
 */
export async function clientAdminSetExpiry(
  pin: string,
  id: string,
  expiryDate: string
): Promise<{ success: boolean; account?: any; error?: string }> {
  // 1. Try server
  try {
    const res = await fetch("/api/admin/accounts/set-expiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id, expiryDate })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  // 2. Direct Firestore
  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    await updateDoc(docRef, { expiryDate: expiryDate.trim(), status: "active" });
    const snap = await getDoc(docRef);
    return { success: true, account: { id: snap.id, ...snap.data() } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi lưu ngày hết hạn." };
  }
}

/**
 * Admin: Reset Trial generation counter to 0
 */
export async function clientAdminResetTrial(
  pin: string,
  id: string
): Promise<{ success: boolean; account?: any; error?: string }> {
  // 1. Try server
  try {
    const res = await fetch("/api/admin/accounts/reset-trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  // 2. Direct Firestore
  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", id.toUpperCase());
    await updateDoc(docRef, { trialCount: 0 });
    const snap = await getDoc(docRef);
    return { success: true, account: { id: snap.id, ...snap.data(), trialCount: 0 } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi đặt lại lượt dùng thử." };
  }
}

/**
 * Record generation usage (increments trial count if not licensed)
 */
export async function clientRecordGeneration(
  code: string
): Promise<{ success: boolean; trialCount?: number; isLicensed?: boolean; isTrialLocked?: boolean }> {
  if (!code) return { success: false };

  // 1. Try server
  try {
    const res = await fetch("/api/account/record-generation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    if (data && data.success) return data;
  } catch {}

  // 2. Direct Firestore
  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", code.toUpperCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false };

    const data = snap.data();
    const isLicensed = isAccountLicensed(data.expiryDate);
    if (isLicensed) {
      return { success: true, isLicensed: true, trialCount: data.trialCount || 0, isTrialLocked: false };
    }

    const currentCount = Number(data.trialCount) || 0;
    const newCount = currentCount + 1;
    await updateDoc(docRef, { trialCount: newCount });
    return { success: true, isLicensed: false, trialCount: newCount, isTrialLocked: newCount >= 5 };
  } catch (err) {
    console.warn("Could not record generation usage:", err);
    return { success: false };
  }
}



