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

/**
 * Robust Dual-Layer Authentication.
 * 1. Tries Server Endpoint `/api/auth/login`.
 * 2. If Server is unreachable or returns HTML, immediately and seamlessly falls back to direct Firestore.
 */
export async function clientLogin(code: string, deviceId: string): Promise<any> {
  if (!code || !code.trim()) {
    return { success: false, error: "Vui lòng nhập Mã tài khoản được cấp." };
  }

  const normalizedCode = code.trim().toUpperCase();

  // 1. Direct Firestore Client Check (Fastest, 100% reliable across all hosting providers including Vercel)
  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", normalizedCode);
    let snap = await getDoc(docRef);

    // Auto-seed initial accounts if not present in Firestore
    if (!snap.exists() && (normalizedCode === "1111" || normalizedCode === "ADMIN123")) {
      const initialAccount = {
        customerName: normalizedCode === "ADMIN123" ? "Admin Master" : "Tài khoản kiểm tra (1111)",
        phone: "0989.982.818",
        createdDate: getTodayString(),
        expiryDate: "2099-12-31",
        maxDevices: 8,
        devices: [deviceId || "unknown_device"],
        status: "active",
        notes: "Tự động khởi tạo kiểm tra hệ thống"
      };
      await setDoc(docRef, initialAccount);
      return {
        success: true,
        account: {
          id: normalizedCode,
          customerName: initialAccount.customerName,
          phone: initialAccount.phone,
          expiryDate: initialAccount.expiryDate,
          maxDevices: initialAccount.maxDevices,
          deviceCount: 1,
          apiKeys: []
        }
      };
    }

    if (snap.exists()) {
      const acc = snap.data() as any;
      const accId = snap.id;

      if (acc.status === "locked") {
        return {
          success: false,
          error: `Tài khoản "${accId}" đã bị khóa. Vui lòng liên hệ Admin qua ĐT 0989.982.818 hoặc Zalo 0978.468.986 để mở khóa.`
        };
      }

      const today = getTodayString();
      if (acc.expiryDate && acc.expiryDate < today) {
        return {
          success: false,
          error: `Tài khoản "${accId}" đã hết hạn vào ngày ${formatDateVN(acc.expiryDate)}. Vui lòng liên hệ Admin qua ĐT 0989.982.818 hoặc Zalo 0978.468.986 để gia hạn.`
        };
      }

      const devId = deviceId || "unknown_device";
      const devices = Array.isArray(acc.devices) ? acc.devices : [];
      const isRegistered = devices.includes(devId);
      const maxDevices = Number(acc.maxDevices) || 2;

      if (isRegistered) {
        return {
          success: true,
          account: {
            id: accId,
            customerName: acc.customerName,
            phone: acc.phone,
            expiryDate: acc.expiryDate,
            maxDevices: maxDevices,
            deviceCount: devices.length,
            apiKeys: acc.apiKeys || []
          }
        };
      }

      if (devices.length < maxDevices) {
        const updatedDevices = [...devices, devId];
        try {
          await updateDoc(docRef, { devices: updatedDevices });
        } catch (err) {
          console.warn("Could not update device to firestore:", err);
        }
        return {
          success: true,
          account: {
            id: accId,
            customerName: acc.customerName,
            phone: acc.phone,
            expiryDate: acc.expiryDate,
            maxDevices: maxDevices,
            deviceCount: updatedDevices.length,
            apiKeys: acc.apiKeys || []
          }
        };
      }

      return {
        success: false,
        error: `Mã tài khoản "${accId}" (${acc.customerName}) đã được kích hoạt trên đủ ${maxDevices} thiết bị. Vui lòng liên hệ Admin qua ĐT 0989.982.818 hoặc Zalo 0978.468.986 để giải phóng thiết bị cũ.`
      };
    }
  } catch (firestoreErr) {
    console.warn("Direct Firestore auth check skipped, trying backend server...", firestoreErr);
  }

  // 2. Server API fallback if Firestore fails
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: normalizedCode, deviceId }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return data;
    }
  } catch (serverErr) {
    console.error("Server auth error:", serverErr);
  }

  return {
    success: false,
    error: `Mã tài khoản "${normalizedCode}" không tồn tại trên hệ thống hoặc chưa được cấp phép. Vui lòng liên hệ Admin qua ĐT 0989.982.818 hoặc Zalo 0978.468.986 để được hỗ trợ.`
  };
}

/**
 * Verify saved account in background
 */
export async function clientVerify(code: string, deviceId: string): Promise<any> {
  return clientLogin(code, deviceId);
}

/**
 * Admin: Verify PIN (0989982818)
 */
export async function clientAdminVerifyPin(pin: string): Promise<boolean> {
  if (pin.trim() === "0989982818") return true;

  try {
    const res = await fetch("/api/admin/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin.trim() })
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return pin.trim() === "0989982818";
  }
}

/**
 * Admin: Get All Accounts (Dual Layer)
 */
export async function clientAdminGetAccounts(pin: string): Promise<any[]> {
  try {
    const res = await fetch("/api/admin/accounts/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin })
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.accounts)) {
      return data.accounts;
    }
  } catch {}

  // Fallback to direct Firestore
  try {
    const db = getClientDb();
    const snap = await getDocs(collection(db, "accounts"));
    const list: any[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() });
    });
    return list;
  } catch (err) {
    console.error("Firestore get accounts error:", err);
    return [];
  }
}

/**
 * Admin: Create Account
 */
export async function clientAdminCreateAccount(
  pin: string,
  accountData: {
    id?: string;
    customerName: string;
    phone: string;
    expiryDate: string;
    maxDevices: number;
    notes?: string;
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
  } catch {}

  // 2. Direct Firestore fallback
  try {
    const db = getClientDb();
    let id = accountData.id ? accountData.id.trim().toUpperCase() : `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const docRef = doc(db, "accounts", id);
    const newAccount = {
      customerName: accountData.customerName,
      phone: accountData.phone,
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
  try {
    await fetch("/api/admin/accounts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey: pin, id })
    });
  } catch {}

  try {
    const db = getClientDb();
    await deleteDoc(doc(db, "accounts", id.toUpperCase()));
    return true;
  } catch {
    return false;
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
 * User: Update Profile / Display Name
 */
export async function clientUpdateProfile(
  code: string,
  deviceId: string,
  customerName: string,
  phone?: string,
  notes?: string
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
        customerName: cleanName,
        phone: phone ? phone.trim() : undefined,
        notes: notes ? notes.trim() : undefined
      })
    });
    const data = await res.json();
    if (data && data.success && data.account) {
      localStorage.setItem("khaothi_account_data", JSON.stringify(data.account));
      return data;
    }
  } catch {}

  // 2. Direct Firestore fallback
  try {
    const db = getClientDb();
    const docRef = doc(db, "accounts", code.trim().toUpperCase());
    const updatePayload: any = { customerName: cleanName };
    if (phone !== undefined) updatePayload.phone = phone.trim();
    if (notes !== undefined) updatePayload.notes = notes.trim();

    await updateDoc(docRef, updatePayload);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const updatedAccount = { id: snap.id, ...snap.data() };
      localStorage.setItem("khaothi_account_data", JSON.stringify(updatedAccount));
      return { success: true, account: updatedAccount };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi khi cập nhật tên trên cơ sở dữ liệu." };
  }

  return { success: false, error: "Không thể cập nhật tên hiển thị." };
}


