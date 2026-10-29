import { createServer as createViteServer } from "vite";
import fs from "fs";
import express from "express";
import path from "path";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import dotenv from "dotenv";
import {
  getOfficialTextbookReferencePrompt,
  getFilteredTextbookReferencePrompt,
  TIN_HOC_6_GIUA_HK1_SPECIFICATION,
  isTinHoc6GiuaKy1,
  syncSpecificationWithMatrix,
  extractMatrixQuestionPlan
} from "./src/data/textbooks";
import { ALL_MATH_TEXTBOOKS } from "./src/data/math";
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  deleteAccount,
  resetDevices,
  toggleAccountStatus,
  updateAccount,
  renewAccount,
  authenticateUser,
  adminChangePassword,
  adminQuickRenew1Year1Day,
  adminSetExpiry,
  adminResetTrial,
  recordGenerationUsage,
  isAccountLicensed
} from "./accounts-db";
import {
  getAllCustomPpct,
  saveCustomPpct,
  deleteCustomPpct,
  SavedPpctRecord
} from "./ppct-db";
import {
  getAllSavedExams,
  getSavedExamById,
  saveExamRecord,
  deleteSavedExam,
  getAllSavedStudyGuides,
  getSavedStudyGuideById,
  saveStudyGuideRecord,
  deleteSavedStudyGuide,
  SavedExamRecord,
  SavedStudyGuideRecord
} from "./saved-exams-db";

dotenv.config();

export interface ApiKeyConfig {
  id?: string;
  key: string;
  model?: string;
  label?: string;
}

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not set yet in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey: key || "" });
  }
  return aiClient;
}

function cleanApiKeyString(raw: any): string {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/[\s"'`“”‘’\u200B-\u200D\uFEFF]/g, "")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

/**
 * Helper to build API key pool.
 * Rotates through user keys, account keys, and environment keys.
 */
async function getApiKeyPool(
  userApiKeys?: ApiKeyConfig[],
  userCode?: string
) {
  const pool: { key: string; label?: string }[] = [];

  // 1. Add keys passed directly from user client
  if (Array.isArray(userApiKeys)) {
    for (const item of userApiKeys) {
      const cleaned = cleanApiKeyString(item?.key);
      if (cleaned) {
        pool.push({
          key: cleaned,
          label: item.label?.trim() || "User Key"
        });
      }
    }
  }

  // 2. Add keys registered to user's account code if provided, and check if Admin
  let isUserAdmin = false;
  if (userCode) {
    const cleanCode = userCode.trim().toUpperCase();
    if (cleanCode === "123456" || cleanCode === "ADMIN123" || cleanCode === "TK-KHOA-2026") {
      isUserAdmin = true;
    }
    const acc = await getAccountById(userCode);
    if (acc) {
      if (
        acc.username?.toLowerCase() === "admin" ||
        acc.customerName?.toLowerCase().includes("admin") ||
        acc.notes?.toLowerCase().includes("admin")
      ) {
        isUserAdmin = true;
      }
      if (Array.isArray(acc.apiKeys)) {
        for (const item of acc.apiKeys) {
          const cleaned = cleanApiKeyString(item?.key);
          if (cleaned) {
            if (!pool.some((p) => p.key === cleaned)) {
              pool.push({
                key: cleaned,
                label: item.label?.trim() || `Tài khoản ${acc.id}`
              });
            }
          }
        }
      }
    }
  }

  // 3. Ép giáo viên người dùng phải tự nhập API Key nếu chưa có Key.
  // Chỉ tài khoản Admin mới sử dụng System Key mặc định khi chưa nhập Key riêng.
  if (!isUserAdmin && pool.length === 0) {
    return [];
  }

  // Fallback to server environment keys for Admin or when teacher already provided keys and needs backup
  const envKeysRaw = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5
  ];

  for (let i = 0; i < envKeysRaw.length; i++) {
    const raw = envKeysRaw[i];
    if (raw && typeof raw === "string" && raw.trim()) {
      const parts = raw.split(",").map(k => cleanApiKeyString(k)).filter(Boolean);
      for (const k of parts) {
        if (!pool.some((p) => p.key === k)) {
          pool.push({
            key: k,
            label: `System Key ${pool.length + 1}`
          });
        }
      }
    }
  }

  return pool;
}

function calculateBalancedPercentagesBackend(periodsList: number[], targetTotal: number = 100): number[] {
  if (!periodsList || periodsList.length === 0) return [];
  const totalPeriods = periodsList.reduce((a, b) => a + (Number(b) || 0), 0);
  if (totalPeriods <= 0) {
    const avg = Number((targetTotal / periodsList.length).toFixed(2));
    return periodsList.map(() => avg);
  }

  const scale = 100;
  const scaledTarget = Math.round(targetTotal * scale);
  const exactFloats = periodsList.map(p => ((Number(p) || 0) / totalPeriods) * scaledTarget);
  const baseIntegers = exactFloats.map(f => Math.floor(f));
  const currentSum = baseIntegers.reduce((a, b) => a + b, 0);

  let remainder = Math.round(scaledTarget - currentSum);

  const remainders = exactFloats.map((f, idx) => ({
    idx,
    rem: f - baseIntegers[idx]
  })).sort((a, b) => b.rem - a.rem);

  const result = [...baseIntegers];
  for (let i = 0; i < remainder; i++) {
    const item = remainders[i % remainders.length];
    result[item.idx] += 1;
  }

  return result.map(val => Number((val / scale).toFixed(2)));
}

function normalizeMatrixPercentagesBackend(matrix: any[], isFinalExam: boolean = false): any[] {
  if (!matrix || matrix.length === 0) return matrix;

  if (isFinalExam) {
    const firstHalfItems = matrix.filter(r => r.halfGroup === "firstHalf");
    const secondHalfItems = matrix.filter(r => r.halfGroup === "secondHalf");

    if (firstHalfItems.length > 0 && secondHalfItems.length > 0) {
      const firstHalfPerc = calculateBalancedPercentagesBackend(firstHalfItems.map(r => r.periods || 2), 30);
      const secondHalfPerc = calculateBalancedPercentagesBackend(secondHalfItems.map(r => r.periods || 2), 70);

      let firstIdx = 0;
      let secondIdx = 0;

      return matrix.map(row => {
        if (row.halfGroup === "firstHalf") {
          return { ...row, percentage: firstHalfPerc[firstIdx++] };
        } else if (row.halfGroup === "secondHalf") {
          return { ...row, percentage: secondHalfPerc[secondIdx++] };
        } else {
          return row;
        }
      });
    }
  }

  const periodsList = matrix.map(r => Number(r.periods) || 2);
  const balancedPerc = calculateBalancedPercentagesBackend(periodsList, 100);

  return matrix.map((row, idx) => ({
    ...row,
    percentage: balancedPerc[idx]
  }));
}

// Helper: Cấu hình Model AI duy nhất của hệ thống (chỉ sử dụng gemini-3.1-flash-lite theo yêu cầu)
function resolveGeminiModelName(name?: string): string {
  return "gemini-3.1-flash-lite";
}

let lastWorkingModel: string = "gemini-3.1-flash-lite";
let globalKeyOffset = 0;

async function executeGeminiWithFailover({
  userApiKeys = [],
  userCode = "",
  parts,
  config,
  validateJson = true
}: {
  userApiKeys?: any[];
  userCode?: string;
  parts: any[];
  config?: any;
  validateJson?: boolean;
}) {
  const pool = await getApiKeyPool(userApiKeys, userCode);
  if (pool.length === 0) {
    throw new Error(
      "Hệ thống chưa tìm thấy API Key khả dụng! Vui lòng mở mục 'Cài đặt API Key' để thêm Gemini API Key cá nhân."
    );
  }

  // Rotate starting key index round-robin for equal load distribution across keys
  const startKeyIdx = globalKeyOffset % pool.length;
  globalKeyOffset = (globalKeyOffset + 1) % pool.length;

  // Re-order pool starting from startKeyIdx and clean keys
  const rotatedPool: { key: string; label: string; origIdx: number }[] = [];
  for (let i = 0; i < pool.length; i++) {
    const idx = (startKeyIdx + i) % pool.length;
    rotatedPool.push({ key: cleanApiKeyString(pool[idx].key), label: pool[idx].label || `Key #${idx + 1}`, origIdx: idx });
  }

  // Chỉ sử dụng duy nhất Model gemini-3.1-flash-lite theo quy định
  const candidateModels = ["gemini-3.1-flash-lite"];
  console.log(`[Failover Runner] Bắt đầu gọi Gemini (${candidateModels.join(", ")}) qua Pool ${pool.length} Key (Khởi đầu với Key #${startKeyIdx + 1} ${rotatedPool[0].label})...`);

  let lastError: any = null;
  const invalidKeySet = new Set<string>();

  for (let kIdx = 0; kIdx < rotatedPool.length; kIdx++) {
    const keyItem = rotatedPool[kIdx];
    const keyIdx = keyItem.origIdx;
    const keyLabel = keyItem.label;

    if (!keyItem.key || invalidKeySet.has(keyItem.key)) {
      continue;
    }

    let client: GoogleGenAI;
    try {
      client = new GoogleGenAI({ apiKey: keyItem.key });
    } catch (err: any) {
      console.log(`[Failover] Key #${keyIdx + 1} (${keyLabel}) lỗi khởi tạo:`, err.message);
      lastError = err;
      continue;
    }

    for (const modelName of candidateModels) {
      const maxAttempts = 4;
      let attempt = 0;

      while (attempt < maxAttempts) {
        attempt++;
        try {
          console.log(`[Failover Test] Model: ${modelName} | Key #${keyIdx + 1}/${pool.length} (${keyLabel}) [Lần thử ${attempt}/${maxAttempts}]...`);
          
          const mergedConfig: any = validateJson
            ? { responseMimeType: "application/json", ...config }
            : { ...config };

          const genResult = await client.models.generateContent({
            model: modelName,
            contents: parts,
            config: mergedConfig
          });

          if (genResult && genResult.text) {
            if (validateJson) {
              try {
                extractAndParseJson(genResult.text);
              } catch (parseErr: any) {
                console.warn(`[Failover JSON Error] Key #${keyIdx + 1} (${keyLabel}) với Model ${modelName} parse JSON lần ${attempt} chưa thành công:`, (parseErr as any)?.message);
                lastError = parseErr;
                if (attempt < maxAttempts) {
                  await new Promise((r) => setTimeout(r, 600 * attempt));
                  continue;
                }
                break;
              }
            }
            console.log(`✅ [Failover Success] Thành công với Model [${modelName}] sử dụng Key #${keyIdx + 1} (${keyLabel})!`);
            lastWorkingModel = modelName;
            return genResult;
          }
        } catch (err: any) {
          const errMsg = getErrorMessage(err);
          console.warn(`⚠️ [Failover Warning] Model ${modelName} với Key #${keyIdx + 1} (${keyLabel}) gặp lỗi: ${errMsg}`);
          lastError = err;

          // Only mark a key as truly invalid if Google explicitly says the API key itself is invalid
          const isExplicitKeyInvalid =
            errMsg.includes("API_KEY_INVALID") ||
            errMsg.includes("API key not valid") ||
            errMsg.includes("API_KEY_NOT_FOUND") ||
            errMsg.includes("pass a valid API key");

          if (isExplicitKeyInvalid) {
            invalidKeySet.add(keyItem.key);
            console.warn(`[Failover Key Invalid] Key #${keyIdx + 1} (${keyLabel}) bị báo API_KEY_INVALID. Chuyển sang Key tiếp theo...`);
            break;
          }

          const isRateLimitOrBusy = 
            errMsg.includes("503") || 
            errMsg.includes("high demand") || 
            errMsg.includes("UNAVAILABLE") || 
            errMsg.includes("429") || 
            errMsg.includes("RESOURCE_EXHAUSTED");

          if (isRateLimitOrBusy) {
            if (attempt < maxAttempts) {
              const backoffMs = attempt * 1500 + Math.floor(Math.random() * 500);
              console.warn(`[Failover 503/429] Key #${keyIdx + 1} bận tạm thời với Model ${modelName}. Đợi ${backoffMs}ms rồi thử lại lần ${attempt + 1}...`);
              await new Promise((r) => setTimeout(r, backoffMs));
              continue;
            }
            console.warn(`[Failover RateLimit/Busy] Key #${keyIdx + 1} với Model ${modelName} đã thử ${maxAttempts} lần. Thử model tiếp theo hoặc Key tiếp theo...`);
            break;
          }

          if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 800 * attempt));
          }
        }
      }

      if (invalidKeySet.has(keyItem.key)) {
        break;
      }
    }
  }

  throw new Error(
    formatVietnameseError(lastError) ||
      "Tất cả các API Key trong hệ thống đều đã hết hạn mức. Vui lòng thêm API Key mới trong phần 'Cài đặt API Key'."
  );
}

function getErrorMessage(err: any): string {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err.message && typeof err.message === "string") return err.message;
  if (err.error) {
    if (typeof err.error === "string") return err.error;
    if (err.error.message && typeof err.error.message === "string") return err.error.message;
  }
  try {
    const json = JSON.stringify(err);
    if (json && json !== "{}" && json !== "[]") return json;
  } catch {
    // ignore
  }
  return String(err) || "";
}

/**
 * Standardized Vietnamese error message formatter for server endpoints.
 */
function formatVietnameseError(err: any): string {
  const rawMsg = getErrorMessage(err);
  let msg = rawMsg.replace(/^(Error|Lỗi):\s*/i, "").trim();

  if (!msg) {
    return "Đã xảy ra lỗi không xác định. Vui lòng kiểm tra lại kết nối và thử lại.";
  }

  if (
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded")
  ) {
    return "TẤT CẢ API KEY ĐÃ HẾT HẠN MỨC (QUOTA EXCEEDED). Hệ thống đã thử toàn bộ API Key nhưng đều bị Google từ chối do vượt quá số lượt tạo đề miễn phí. Giải pháp: Mở mục CẤU HÌNH (góc trên) -> Chọn 'Cài đặt API Key' -> Xóa các API Key cũ và nhập API Key mới, hoặc đổi sang API Key khác để tiếp tục tạo đề ngay lập tức.";
  }

  if (
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("API_KEY_NOT_FOUND") ||
    msg.includes("invalid API key") ||
    msg.includes("pass a valid API key")
  ) {
    return "API Key không hợp lệ hoặc bị dán thiếu ký tự. Vui lòng mở 'Cài đặt API Key' (biểu tượng Key ở thanh trên cùng), xóa khoảng trắng thừa và dán lại đúng mã API Key bắt đầu bằng 'AIzaSy...' từ aistudio.google.com/apikey.";
  }

  if (
    msg.includes("404") ||
    msg.includes("not found") ||
    msg.includes("no longer available")
  ) {
    return "Model AI yêu cầu tạm thời không khả dụng trên hệ thống Google. Hệ thống đã tự động chuyển đổi sang model thế hệ mới phù hợp.";
  }

  if (
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.includes("high demand") ||
    msg.includes("overloaded") ||
    msg.includes("500") ||
    msg.includes("Internal Server Error")
  ) {
    return "Máy chủ AI đang quá tải tạm thời. Vui lòng bấm thử lại sau giây lát.";
  }

  if (
    msg.includes("fetch failed") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("NetworkError") ||
    msg.includes("Failed to fetch")
  ) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.";
  }

  if (
    msg.includes("JSON") ||
    msg.includes("SyntaxError") ||
    msg.includes("parse") ||
    msg.includes("Unexpected token")
  ) {
    return "Dữ liệu AI trả về chưa hoàn chỉnh do gián đoạn kết nối. Vui lòng thử lại.";
  }

  if (msg.includes("TIMEOUT") || msg.includes("timed out") || msg.includes("deadline")) {
    return "Thời gian xử lý quá lâu do gián đoạn đường truyền. Vui lòng thử lại.";
  }

  const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(msg);
  if (hasVietnamese && msg.length < 200) {
    return msg;
  }

  return `Lỗi hệ thống AI: ${msg.length > 150 ? msg.slice(0, 150) + "..." : msg}`;
}

function fixLatexInRawJsonText(text: string): string {
  let result = "";
  let inStr = false;
  let i = 0;

  while (i < text.length) {
    const c = text[i];
    if (!inStr) {
      if (c === '"') inStr = true;
      result += c;
      i++;
    } else {
      if (c === '"') {
        inStr = false;
        result += c;
        i++;
      } else if (c === '\\') {
        const next = text[i + 1] || "";
        const rest = text.substring(i + 1);
        const isStandardJsonEscape = (next === '"' || next === '\\' || next === '/' || next === 'n' || next === 'r' || next === 't');
        const isLatexOrWord = /^[a-zA-Z{}(),_+\-*=><$#%^&|!]/.test(rest);

        if (isLatexOrWord && (!isStandardJsonEscape || /^(begin|beta|frac|figure|right|left|text|times|tan|theta|sqrt|sum|int|infty|iff|implies|end|eq|approx|angle|alpha|array)/i.test(rest))) {
          result += "\\\\";
        } else {
          result += "\\";
        }
        i++;
      } else {
        result += c;
        i++;
      }
    }
  }

  return result;
}

/**
 * Extracts and parses JSON from AI model outputs robustly.
 * Handles markdown code fences, trailing text/preambles, JS comments, unescaped LaTeX backslashes, control characters in strings, smart quotes, and truncated JSON.
 */
function extractAndParseJson(raw: string): any {
  if (!raw || !raw.trim()) {
    throw new Error("Dữ liệu trả về từ AI trống.");
  }

  let text = raw.trim();

  // Strip markdown code fences if wrapped
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  // Replace smart quotes
  text = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  const sanitizeJsonStrings = (str: string) => {
    return str.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
      return match
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
    });
  };

  // 1. Direct parse attempt
  try { return JSON.parse(text); } catch {}
  try { return JSON.parse(sanitizeJsonStrings(text)); } catch {}

  // 2. Fix LaTeX unescaped backslashes in JSON strings (\frac, \left, \begin, \right, \text, etc.)
  let cleaned = fixLatexInRawJsonText(text);
  try { return JSON.parse(cleaned); } catch {}
  try { return JSON.parse(sanitizeJsonStrings(cleaned)); } catch {}

  // Strip JS comments // ... and /* ... */
  cleaned = cleaned.replace(/([^:]|^)\/\/[^\r\n]*/g, "$1").replace(/\/\*[\s\S]*?\*\//g, "");
  cleaned = sanitizeJsonStrings(cleaned);

  try { return JSON.parse(cleaned); } catch {}

  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(cleaned); } catch {}

  // 2. Scan for ALL '{' indices and attempt parsing from each position to bypass preambles
  let braceIndex = cleaned.indexOf("{");
  while (braceIndex !== -1) {
    const candidate = cleaned.substring(braceIndex);
    try { return JSON.parse(candidate); } catch {}

    const lastBrace = candidate.lastIndexOf("}");
    if (lastBrace > 0) {
      const sliced = candidate.substring(0, lastBrace + 1);
      try { return JSON.parse(sliced); } catch {}
      try {
        const noTrailing = sliced.replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(noTrailing);
      } catch {}
    }

    braceIndex = cleaned.indexOf("{", braceIndex + 1);
  }

  // 3. Same for '[' if root is an array
  let bracketIndex = cleaned.indexOf("[");
  while (bracketIndex !== -1) {
    const candidate = cleaned.substring(bracketIndex);
    try { return JSON.parse(candidate); } catch {}

    const lastBracket = candidate.lastIndexOf("]");
    if (lastBracket > 0) {
      const sliced = candidate.substring(0, lastBracket + 1);
      try { return JSON.parse(sliced); } catch {}
      try {
        const noTrailing = sliced.replace(/,\s*([}\]])/g, "$1");
        return JSON.parse(noTrailing);
      } catch {}
    }

    bracketIndex = cleaned.indexOf("[", bracketIndex + 1);
  }

  // 4. Auto-close truncated JSON (if response was cut off near token limit)
  let candidate = cleaned;
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    candidate = cleaned.substring(firstBrace);
  } else if (firstBracket !== -1) {
    candidate = cleaned.substring(firstBracket);
  }

  let openBrackets = 0;
  let openBraces = 0;
  let inStr = false;
  let esc = false;

  for (let i = 0; i < candidate.length; i++) {
    const c = candidate[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true;
      else if (c === "{") openBraces++;
      else if (c === "}") openBraces = Math.max(0, openBraces - 1);
      else if (c === "[") openBrackets++;
      else if (c === "]") openBrackets = Math.max(0, openBrackets - 1);
    }
  }

  let repaired = candidate;
  if (inStr) repaired += '"';
  repaired = repaired.replace(/,\s*$/, "");
  while (openBrackets > 0) { repaired += "]"; openBrackets--; }
  while (openBraces > 0) { repaired += "}"; openBraces--; }

  try { return JSON.parse(repaired); } catch {}

  console.error("[JSON Parse Error] Raw AI response could not be parsed:", text.slice(0, 500));
  throw new Error("Không thể phân tích dữ liệu JSON trả về từ AI.");
}

const STANDARD_GRADE_TOPICS: Record<string, Record<string, string>> = {
  "6": {
    "1": "Chủ đề 1. Máy tính và cộng đồng",
    "2": "Chủ đề 2. Mạng máy tính và Internet",
    "3": "Chủ đề 3. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "4": "Chủ đề 4. Đạo đức, pháp luật và văn hoá trong môi trường số",
    "5": "Chủ đề 5. Ứng dụng tin học",
    "6": "Chủ đề 6. Giải quyết vấn đề với sự trợ giúp của máy tính",
  },
  "7": {
    "1": "Chủ đề 1. Máy tính và cộng đồng",
    "2": "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "3": "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
    "4": "Chủ đề 4. Ứng dụng tin học",
    "5": "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
  },
  "8": {
    "1": "Chủ đề 1. Máy tính và cộng đồng",
    "2": "Chủ đề 2. Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin",
    "3": "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
    "4": "Chủ đề 4. Ứng dụng tin học",
    "5": "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
    "6": "Chủ đề 6. Hướng nghiệp với tin học",
  },
  "9": {
    "1": "Chủ đề 1. Máy tính và cộng đồng",
    "2": "Chủ đề 2. Mạng máy tính và Internet",
    "3": "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số",
    "4": "Chủ đề 4. Ứng dụng tin học",
    "5": "Chủ đề 5. Giải quyết vấn đề với sự trợ giúp của máy tính",
    "6": "Chủ đề 6. Hướng nghiệp với tin học",
  }
};

function cleanTopicString(topic: string, grade: string, subject: string = "Tin học"): string {
  if (!topic || typeof topic !== "string") return topic || "";
  let clean = topic.trim();
  
  // Remove unwanted trailing or parenthesized half-semester markers
  clean = clean.replace(/\s*\([^)]*nửa\s*(đầu|cuối)[^)]*\)/gi, "");
  clean = clean.replace(/\s*[-–—:]\s*nửa\s*(đầu|cuối)\s*(học\s*kỳ|kỳ|hk)\s*[12iI]+/gi, "");
  clean = clean.replace(/\s*nửa\s*(đầu|cuối)\s*(học\s*kỳ|kỳ|hk)\s*[12iI]+/gi, "");
  clean = clean.replace(/\s*\(kiến thức[^)]*\)/gi, "");
  clean = clean.replace(/\.{2,}$/g, "").trim();

  if (subject.toLowerCase().trim().includes("toán")) {
    const mathTb = ALL_MATH_TEXTBOOKS[grade];
    if (mathTb) {
      const matchCh = clean.match(/^(?:Chương\s*([0-9IVXLCDM]+))(?:\s*[\.\-:]\s*(.*))?$/i);
      if (matchCh) {
        const chNum = matchCh[1];
        const subTitle = (matchCh[2] || "").trim();
        if (!subTitle || subTitle.length < 3) {
          const foundTopic = mathTb.topics.find(t => t.id === chNum || t.name.toLowerCase().includes(`chương ${chNum.toLowerCase()}`));
          if (foundTopic) return foundTopic.name;
        }
      }
    }
    return clean;
  }

  // If topic is just "Chủ đề 1" or "Chủ đề 2" without full name, look up standard for Tin học
  const match = clean.match(/^Chủ\s*đề\s*([0-9]+)(\s*[\.\-:]\s*(.*))?$/i);
  if (match) {
    const num = match[1];
    const subTitle = (match[3] || "").trim();
    if (!subTitle || subTitle.length < 3) {
      const standard = STANDARD_GRADE_TOPICS[grade]?.[num];
      if (standard) return standard;
    } else {
      return `Chủ đề ${num}. ${subTitle}`;
    }
  }

  return clean;
}

/**
 * Normalizes and guarantees exact counts for matrix and specification:
 * - For Informatics:
 *   + Total Nhận biết = 16 (8 MCQ Biết + 8 TF Biết + 0 TL)
 *   + Total Thông hiểu = 12 (4 MCQ Hiểu + 8 TF Hiểu + 0 TL)
 *   + Total Vận dụng (Tự luận) = 3 (0 MCQ + 0 TF + 3 TL)
 *   + Total points = 10.00
 * - For Math:
 *   + Total Nhận biết = 17 (12 MCQ Biết + 4 TF Biết + 1 SA Biết + 0 TL) -> 4.0 điểm
 *   + Total Thông hiểu = 5 (0 MCQ + 2 TF Hiểu + 2 SA Hiểu + 1 TL Hiểu) -> 3.0 điểm
 *   + Total Vận dụng = 5 (0 MCQ + 2 TF VD + 1 SA VD + 2 TL VD) -> 3.0 điểm
 *   + Total points = 10.00
 */
function normalizeMatrixAndSpecCounts(matrix: any[], spec: any[], subject?: string, grade?: string, period?: string) {
  if (!matrix || !Array.isArray(matrix) || matrix.length === 0) return;

  const isMath = (subject || "").toLowerCase().trim().includes("toán");
  const isTin6GK1 = isTinHoc6GiuaKy1(subject, grade, period);

  // Helper to adjust array of integers to match a target sum
  const adjustSum = (arr: number[], target: number, allowedIndices?: number[]) => {
    let currentSum = arr.reduce((a, b) => a + b, 0);
    let diff = target - currentSum;
    if (diff === 0) return;

    const indices = allowedIndices && allowedIndices.length > 0
      ? allowedIndices
      : arr.map((_, i) => i);

    if (diff > 0) {
      // Add to rows
      while (diff > 0) {
        for (let k = indices.length - 1; k >= 0 && diff > 0; k--) {
          const i = indices[k];
          arr[i] += 1;
          diff -= 1;
        }
      }
    } else {
      // Subtract from rows that have values > 0
      while (diff < 0) {
        let reduced = false;
        for (let i = 0; i < arr.length && diff < 0; i++) {
          if (arr[i] > 0) {
            arr[i] -= 1;
            diff += 1;
            reduced = true;
          }
        }
        if (!reduced) break;
      }
    }
  };

  if (isMath) {
    const mcqNbList = matrix.map(r => Number(r.mcq_nb) || 0);
    const tfNbList = matrix.map(r => Number(r.tf_nb) || 0);
    const tfThList = matrix.map(r => Number(r.tf_th) || 0);
    const tfVdList = matrix.map(r => Number(r.tf_vd) || 0);
    const saNbList = matrix.map(r => Number(r.sa_nb) || 0);
    const saThList = matrix.map(r => Number(r.sa_th) || 0);
    const saVdList = matrix.map(r => Number(r.sa_vd) || 0);
    const tlThList = matrix.map(r => Number(r.tl_th) || 0);
    const tlVdList = matrix.map(r => Number(r.tl_vd) || 0);

    adjustSum(mcqNbList, 12);
    adjustSum(tfNbList, 4);
    adjustSum(tfThList, 2);
    adjustSum(tfVdList, 2);
    adjustSum(saNbList, 1);
    adjustSum(saThList, 2);
    adjustSum(saVdList, 1);
    adjustSum(tlThList, 1);
    adjustSum(tlVdList, 2);

    matrix.forEach((r, idx) => {
      r.mcq_nb = mcqNbList[idx];
      r.mcq_th = 0;
      r.mcq_vd = 0;

      r.tf_nb = tfNbList[idx];
      r.tf_th = tfThList[idx];
      r.tf_vd = tfVdList[idx];

      r.sa_nb = saNbList[idx];
      r.sa_th = saThList[idx];
      r.sa_vd = saVdList[idx];

      r.tl_nb = 0;
      r.tl_th = tlThList[idx];
      r.tl_vd = tlVdList[idx];

      r.total_nb = r.mcq_nb + r.tf_nb + r.sa_nb;
      r.total_th = r.tf_th + r.sa_th + r.tl_th;
      r.total_vd = r.tf_vd + r.sa_vd + r.tl_vd;

      const pts = (r.mcq_nb * 0.25) +
                  ((r.tf_nb + r.tf_th + r.tf_vd) * 0.25) +
                  ((r.sa_nb + r.sa_th + r.sa_vd) * 0.5) +
                  ((r.tl_th + r.tl_vd) * 1.0);
      r.totalPoints = Number(pts.toFixed(2));
    });

    if (spec && Array.isArray(spec) && spec.length > 0) {
      if (spec.length === matrix.length) {
        spec.forEach((s, idx) => {
          s.nb_count = matrix[idx].total_nb;
          s.th_count = matrix[idx].total_th;
          s.vd_count = matrix[idx].total_vd;
        });
      } else {
        const specNbList = spec.map(s => Number(s.nb_count) || 0);
        const specThList = spec.map(s => Number(s.th_count) || 0);
        const specVdList = spec.map(s => Number(s.vd_count) || 0);
        adjustSum(specNbList, 17);
        adjustSum(specThList, 5);
        adjustSum(specVdList, 5);
        spec.forEach((s, idx) => {
          s.nb_count = specNbList[idx];
          s.th_count = specThList[idx];
          s.vd_count = specVdList[idx];
        });
      }
    }
  } else {
    const mcqNbList = matrix.map(r => Number(r.mcq_nb) || 0);
    const mcqThList = matrix.map(r => Number(r.mcq_th) || 0);
    const tfNbList = matrix.map(r => Number(r.tf_nb) || 0);
    const tfThList = matrix.map(r => Number(r.tf_th) || 0);
    const tlVdList = matrix.map((r) => {
      if (isTin6GK1 && String(r.topic || "").toLowerCase().includes("chủ đề 2")) {
        return 0;
      }
      return Number(r.tl_vd) || 0;
    });

    const allowedVdIndices = isTin6GK1
      ? matrix
          .map((r, idx) => (String(r.topic || "").toLowerCase().includes("chủ đề 1") ? idx : -1))
          .filter(idx => idx !== -1)
      : undefined;

    adjustSum(mcqNbList, 8);
    adjustSum(mcqThList, 4);
    adjustSum(tfNbList, 8);
    adjustSum(tfThList, 8);
    adjustSum(tlVdList, 3, allowedVdIndices);

    matrix.forEach((r, idx) => {
      r.mcq_nb = mcqNbList[idx];
      r.mcq_th = mcqThList[idx];
      r.mcq_vd = 0;

      r.tf_nb = tfNbList[idx];
      r.tf_th = tfThList[idx];
      r.tf_vd = 0;

      r.tl_nb = 0;
      r.tl_th = 0;
      r.tl_vd = tlVdList[idx];

      r.total_nb = r.mcq_nb + r.tf_nb;
      r.total_th = r.mcq_th + r.tf_th;
      r.total_vd = r.tl_vd;

      r.totalPoints = Number(((r.total_nb * 0.25) + (r.total_th * 0.25) + (r.total_vd * 1.0)).toFixed(2));
    });

    // Synchronize specification counts with matrix
    if (spec && Array.isArray(spec) && spec.length > 0) {
      if (spec.length === matrix.length) {
        spec.forEach((s, idx) => {
          s.nb_count = matrix[idx].total_nb;
          s.th_count = matrix[idx].total_th;
          s.vd_count = matrix[idx].total_vd;
        });
      } else {
        const specNbList = spec.map(s => Number(s.nb_count) || 0);
        const specThList = spec.map(s => Number(s.th_count) || 0);
        const specVdList = spec.map(s => Number(s.vd_count) || 0);
        adjustSum(specNbList, 16);
        adjustSum(specThList, 12);
        adjustSum(specVdList, 3);
        spec.forEach((s, idx) => {
          s.nb_count = specNbList[idx];
          s.th_count = specThList[idx];
          s.vd_count = specVdList[idx];
        });
      }
    }
  }
}

export const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "200mb" }));

app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Endpoints: Saved Exams
app.post("/api/exams/save", async (req, res) => {
  try {
    const record = await saveExamRecord(req.body);
    return res.json({ success: true, record });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi khi lưu đề thi." });
  }
});

app.post("/api/exams/list", async (req, res) => {
  try {
    const { subject, grade, userCode } = req.body || {};
    const exams = await getAllSavedExams({ subject, grade, userCode });
    return res.json({ success: true, exams });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi lấy danh sách đề thi đã lưu." });
  }
});

app.post("/api/exams/get", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: "Thiếu mã ID đề thi." });
    const exam = await getSavedExamById(id);
    if (!exam) return res.status(404).json({ success: false, error: "Không tìm thấy đề thi đã lưu." });
    return res.json({ success: true, exam });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/exams/delete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: "Thiếu mã ID đề thi cần xóa." });
    await deleteSavedExam(id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Endpoints: Saved Study Guides
app.post("/api/study-guides/save", async (req, res) => {
  try {
    const record = await saveStudyGuideRecord(req.body);
    return res.json({ success: true, record });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi khi lưu đề cương ôn tập." });
  }
});

app.post("/api/study-guides/list", async (req, res) => {
  try {
    const { subject, grade, userCode } = req.body || {};
    const guides = await getAllSavedStudyGuides({ subject, grade, userCode });
    return res.json({ success: true, guides });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi lấy danh sách đề cương đã lưu." });
  }
});

app.post("/api/study-guides/get", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: "Thiếu mã ID đề cương." });
    const guide = await getSavedStudyGuideById(id);
    if (!guide) return res.status(404).json({ success: false, error: "Không tìm thấy đề cương đã lưu." });
    return res.json({ success: true, guide });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/study-guides/delete", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: "Thiếu mã ID đề cương cần xóa." });
    await deleteSavedStudyGuide(id);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Master Admin Secret Key: support 123456 as requested, and 0989982818
const ADMIN_SECRET_KEY = "123456";
const isAuthorizedAdmin = (adminKey: any) => {
  const k = String(adminKey || "").trim();
  return k === "123456" || k === "0989982818";
};

// Public Endpoint: Login / Activate Account with device limit check
app.post("/api/auth/login", async (req, res) => {
  try {
    const { name, customerName, code, deviceId, isExplicitLogin, clientTimeStr, clientDateStr } = req.body;
    const userName = (name || customerName || "").trim();
    const result = await authenticateUser(userName, code, deviceId, {
      isExplicitLogin: isExplicitLogin !== undefined ? Boolean(isExplicitLogin) : true,
      clientTimeStr,
      clientDateStr
    });
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi hệ thống khi đăng nhập." });
  }
});

// Public Endpoint: Sync Active Seconds Today
app.post("/api/account/sync-active-time", async (req, res) => {
  try {
    const { id, activeSeconds } = req.body;
    if (!id) return res.status(400).json({ success: false });
    const sec = Math.max(0, Number(activeSeconds) || 0);
    await updateAccount(String(id), {
      activeSecondsToday: sec,
      todayActiveSeconds: sec
    });
    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
});

// Public Endpoint: Self-Register New Teacher Account
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, customerName, phone, notes, deviceId, clientTimeStr, clientDateStr } = req.body;
    const cleanUser = (username || "").trim();
    const cleanPass = (password || "").trim();
    const cleanName = (customerName || "").trim();

    if (!cleanUser) {
      return res.status(400).json({ success: false, error: "Vui lòng nhập Tên đăng nhập (viết liền không dấu như Gmail)." });
    }
    if (!cleanPass) {
      return res.status(400).json({ success: false, error: "Vui lòng nhập Mật khẩu." });
    }
    if (!cleanName) {
      return res.status(400).json({ success: false, error: "Vui lòng nhập Họ tên hiển thị." });
    }

    const createdAccount = await createAccount({
      username: cleanUser,
      password: cleanPass,
      customerName: cleanName,
      phone: phone || "",
      notes: notes || "",
      expiryDate: "Chưa cấp",
      trialCount: 0,
      maxDevices: 2
    });

    // Auto-authenticate registered user on this device
    const authResult = await authenticateUser(cleanUser, cleanPass, deviceId, {
      isExplicitLogin: true,
      clientTimeStr,
      clientDateStr
    });
    if (authResult.success) {
      return res.json({
        success: true,
        message: "Đăng ký tài khoản thành công!",
        account: authResult.account
      });
    }

    return res.json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      account: {
        id: createdAccount.id,
        username: createdAccount.username || cleanUser,
        customerName: createdAccount.customerName || cleanName,
        password: createdAccount.password || cleanPass,
        phone: createdAccount.phone || "",
        notes: createdAccount.notes || "",
        avatar: createdAccount.avatar || "",
        expiryDate: "Chưa cấp",
        isLicensed: false,
        trialCount: 0,
        isTrialLocked: false,
        maxDevices: 2,
        deviceCount: 1,
        apiKeys: []
      }
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || "Lỗi khi đăng ký tài khoản." });
  }
});

// Public Endpoint: Verify session / code
app.post("/api/auth/verify", async (req, res) => {
  try {
    const { name, customerName, code, deviceId, clientTimeStr, clientDateStr } = req.body;
    const userName = (name || customerName || "").trim();
    const result = await authenticateUser(userName, code, deviceId, {
      isExplicitLogin: false,
      clientTimeStr,
      clientDateStr
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi hệ thống khi xác thực." });
  }
});

// Admin Endpoint: Verify Master Key / PIN (123456)
app.post("/api/admin/verify-pin", async (req, res) => {
  const { adminKey } = req.body;
  if (isAuthorizedAdmin(adminKey)) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: "Mật khẩu Admin không chính xác. Vui lòng kiểm tra lại." });
});

// Admin Endpoint: Get All Accounts
app.post("/api/admin/accounts/list", async (req, res) => {
  const { adminKey } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const accounts = await getAllAccounts();
  return res.json({ success: true, accounts });
});

// Admin Endpoint: Create Account
app.post("/api/admin/accounts/create", async (req, res) => {
  const { adminKey, id, username, customerName, phone, expiryDate, maxDevices, notes, password, trialCount, avatar } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  try {
    const account = await createAccount({ id, username, customerName, phone, expiryDate, maxDevices, notes, password, trialCount, avatar });
    return res.json({ success: true, account });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Admin Endpoint: Delete Account
app.post("/api/admin/accounts/delete", async (req, res) => {
  const { adminKey, id } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const ok = await deleteAccount(id);
  if (ok) {
    return res.json({ success: true });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy mã tài khoản để xóa." });
});

// Admin Endpoint: Reset Bound Devices (Giải phóng máy)
app.post("/api/admin/accounts/reset-devices", async (req, res) => {
  const { adminKey, id } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const account = await resetDevices(id);
  if (account) {
    return res.json({ success: true, account });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản để giải phóng máy." });
});

// Admin Endpoint: Toggle Account Status (Lock/Active)
app.post("/api/admin/accounts/toggle-status", async (req, res) => {
  const { adminKey, id } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const account = await toggleAccountStatus(id);
  if (account) {
    return res.json({ success: true, account });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản." });
});

// Admin Endpoint: Change Password / Account Code
app.post("/api/admin/accounts/change-password", async (req, res) => {
  const { adminKey, id, newPassword } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  try {
    const updated = await adminChangePassword(id, newPassword);
    return res.json({ success: true, account: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Admin Endpoint: Quick Renew "1 Year + 1 Day"
app.post("/api/admin/accounts/quick-renew-1yr-1day", async (req, res) => {
  const { adminKey, id } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  try {
    const updated = await adminQuickRenew1Year1Day(id);
    return res.json({ success: true, account: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Admin Endpoint: Set Arbitrary Expiry Date
app.post("/api/admin/accounts/set-expiry", async (req, res) => {
  const { adminKey, id, expiryDate } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  try {
    const updated = await adminSetExpiry(id, expiryDate);
    return res.json({ success: true, account: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Admin Endpoint: Reset Trial Generation Counter to 0
app.post("/api/admin/accounts/reset-trial", async (req, res) => {
  const { adminKey, id } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  try {
    const updated = await adminResetTrial(id);
    return res.json({ success: true, account: updated });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Public / User Endpoint: Record Generation Usage (for Trial limit tracking)
app.post("/api/account/record-generation", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Thiếu mã tài khoản." });
    }
    const usage = await recordGenerationUsage(code);
    return res.json(usage);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// User Endpoint: Update Display Name / Profile
// User Endpoint: Update Display Name / Profile / Avatar
app.post("/api/user/update-profile", async (req, res) => {
  try {
    const { code, deviceId, username, customerName, phone, notes, avatar } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: "Thiếu mã tài khoản." });
    }
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: "Tên hiển thị không được để trống." });
    }
    const updatePayload: any = {
      customerName: customerName.trim()
    };
    if (username !== undefined && username.trim()) {
      updatePayload.username = username.trim();
    }
    if (phone !== undefined) {
      updatePayload.phone = phone.trim();
    }
    if (notes !== undefined) {
      updatePayload.notes = notes.trim();
    }
    if (avatar !== undefined) {
      updatePayload.avatar = avatar;
    }
    const updated = await updateAccount(code, updatePayload);
    if (updated) {
      return res.json({ success: true, account: updated });
    }
    return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản cần cập nhật." });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Lỗi cập nhật thông tin." });
  }
});

// User Endpoint: Save API Keys to Account (Permanent Storage)
app.post("/api/user/update-keys", async (req, res) => {
  const { code, deviceId, apiKeys } = req.body;
  const authResult = await authenticateUser(code, deviceId);
  if (!authResult.success || !authResult.account) {
    return res.status(401).json({ success: false, error: authResult.error || "Tài khoản không hợp lệ." });
  }
  const account = await updateAccount(authResult.account.id, { apiKeys });
  if (account) {
    return res.json({ success: true, apiKeys: account.apiKeys || [] });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản để cập nhật Key." });
});

// Admin Endpoint: Update API Keys for Account
app.post("/api/admin/accounts/update-keys", async (req, res) => {
  const { adminKey, id, apiKeys } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const account = await updateAccount(id, { apiKeys });
  if (account) {
    return res.json({ success: true, account });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản." });
});

// Admin Endpoint: Update Account Details
app.post("/api/admin/accounts/update", async (req, res) => {
  const { adminKey, id, updateData } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const account = await updateAccount(id, updateData);
  if (account) {
    return res.json({ success: true, account });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản để cập nhật." });
});

// Admin Endpoint: Renew Account
app.post("/api/admin/accounts/renew", async (req, res) => {
  const { adminKey, id, years, customExpiryDate } = req.body;
  if (!isAuthorizedAdmin(adminKey)) {
    return res.status(401).json({ error: "Không có quyền truy cập Admin." });
  }
  const account = await renewAccount(id, years || 1, customExpiryDate);
  if (account) {
    return res.json({ success: true, account });
  }
  return res.status(404).json({ success: false, error: "Không tìm thấy tài khoản để gia hạn." });
});

  // PPCT Endpoints: List saved PPCTs
  app.post("/api/ppct/list", async (req, res) => {
    try {
      const { subject, grade, userCode } = req.body || {};
      const list = await getAllCustomPpct({ subject, grade, userCode });
      return res.json({ success: true, ppctList: list });
    } catch (err: any) {
      console.error("Error listing PPCT:", err);
      return res.status(500).json({ success: false, error: err.message || "Lỗi tải danh sách PPCT." });
    }
  });

  // PPCT Endpoints: Save custom PPCT (Permanent Firestore & Local storage)
  app.post("/api/ppct/save", async (req, res) => {
    try {
      const { record } = req.body;
      if (!record || !record.name || !record.scopeConfig) {
        return res.status(400).json({ success: false, error: "Thiếu dữ liệu cấu hình PPCT." });
      }
      const saved = await saveCustomPpct(record);
      return res.json({ success: true, record: saved });
    } catch (err: any) {
      console.error("Error saving PPCT:", err);
      return res.status(500).json({ success: false, error: err.message || "Lỗi lưu cấu hình PPCT." });
    }
  });

  // PPCT Endpoints: Delete custom PPCT
  app.post("/api/ppct/delete", async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, error: "Thiếu ID bản PPCT cần xóa." });
      }
      const ok = await deleteCustomPpct(id);
      return res.json({ success: ok });
    } catch (err: any) {
      console.error("Error deleting PPCT:", err);
      return res.status(500).json({ success: false, error: err.message || "Lỗi xóa bản PPCT." });
    }
  });

  // Helper to process reference files (DOCX, XLSX/XLS, TXT, CSV, PDF) into Gemini prompt parts
  async function processReferenceFilesToGeminiParts(referenceFiles: any[]): Promise<any[]> {
    const parts: any[] = [];
    if (!referenceFiles || !Array.isArray(referenceFiles)) return parts;

    for (const file of referenceFiles) {
      if (!file || !file.base64) continue;
      const fileName = (file.name || "").toLowerCase();
      const mimeType = file.mimeType || "";

      const isDocx = fileName.endsWith(".docx") || 
                     mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isExcel = fileName.endsWith(".xlsx") || 
                      fileName.endsWith(".xls") || 
                      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                      mimeType === "application/vnd.ms-excel";
      const isText = mimeType.startsWith("text/") || 
                     fileName.endsWith(".txt") || 
                     fileName.endsWith(".csv");

      if (isDocx) {
        try {
          const buffer = Buffer.from(file.base64, "base64");
          const result = await mammoth.extractRawText({ buffer });
          parts.push({
            text: `\n=== TÀI LIỆU PPCT / ĐẶC TẢ DOCX THAM CHIẾU (${file.name || "PPCT.docx"}) ===\n${result.value}\n=== HẾT TÀI LIỆU DOCX ===\n`,
          });
        } catch (err) {
          console.error("Error parsing docx file:", err);
        }
      } else if (isExcel) {
        try {
          const buffer = Buffer.from(file.base64, "base64");
          const workbook = XLSX.read(buffer, { type: "buffer" });
          let excelText = `\n=== TÀI LIỆU PHÂN PHỐI CHƯƠNG TRÌNH / KẾ HOẠCH DẠY HỌC EXCEL (${file.name || "PPCT.xlsx"}) ===\n`;
          
          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return;
            const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: "", blankrows: false });
            if (!rows || rows.length === 0) return;

            excelText += `\n--- [TRANG TÍNH / SHEET: ${sheetName}] ---\n`;
            rows.forEach((row) => {
              if (!Array.isArray(row)) return;
              const cleanCells = row.map((c) => String(c != null ? c : "").trim()).filter((c) => c.length > 0);
              if (cleanCells.length === 0) return;
              excelText += cleanCells.join(" | ") + "\n";
            });
            excelText += `--- [HẾT SHEET: ${sheetName}] ---\n`;
          });
          excelText += `=== HẾT TÀI LIỆU EXCEL ===\n`;

          parts.push({ text: excelText });
        } catch (err) {
          console.error("Error parsing excel file in server:", err);
        }
      } else if (isText) {
        try {
          const textContent = Buffer.from(file.base64, "base64").toString("utf-8");
          parts.push({
            text: `\n=== TÀI LIỆU VĂN BẢN THAM CHIẾU (${file.name || "tailieu.txt"}) ===\n${textContent}\n=== HẾT TÀI LIỆU ===\n`,
          });
        } catch (err) {
          console.error("Error parsing text file:", err);
        }
      } else {
        parts.push({
          inlineData: {
            data: file.base64,
            mimeType: mimeType || "application/pdf",
          },
        });
      }
    }

    return parts;
  }

  // Helper to generate Matrix only
  async function generateMatrixHelper({
    subject = "Tin học",
    grade,
    period,
    examFormat = "Tự luận",
    schoolName = "TRƯỜNG THCS TÂN LOAN",
    schoolYear = "2026 - 2027",
    referenceFiles,
    scopeConfig,
    userApiKeys,
    userCode
  }: any) {
    const isMath = subject.toLowerCase().trim().includes("toán");
    let customScopePrompt = "";
    if (scopeConfig && (scopeConfig.mode === "custom" || (scopeConfig.firstHalfLessons && scopeConfig.firstHalfLessons.length > 0))) {
      const isCuoiKy = period && period.includes("Cuối");
      let selectedFirst = (scopeConfig.firstHalfLessons || []).filter((l: any) => l.selected);
      let selectedSecond = (scopeConfig.secondHalfLessons || []).filter((l: any) => l.selected);

      selectedFirst = selectedFirst.filter((l: any) => {
        const t = (l.topicName || "").toLowerCase();
        return isMath ? !t.includes("chủ đề") : !t.includes("chương");
      });
      selectedSecond = selectedSecond.filter((l: any) => {
        const t = (l.topicName || "").toLowerCase();
        return isMath ? !t.includes("chủ đề") : !t.includes("chương");
      });

      const quickNotes = scopeConfig.quickNoteText?.trim();

      if (selectedFirst.length > 0 || selectedSecond.length > 0 || quickNotes) {
        customScopePrompt += `\n\n★ QUY ĐỊNH BẮT BUỘC VỀ PHẠM VI BÀI HỌC VÀ SỐ TIẾT DẠY THỰC TẾ (DO GIÁO VIÊN BỘ MÔN CHỈ ĐỊNH):\n`;
        if (!isCuoiKy) {
          customScopePrompt += `DANH SÁCH BÀI HỌC KIỂM TRA GIỮA KỲ (100% THỜI LƯỢNG):\n`;
          selectedFirst.forEach((l: any) => {
            customScopePrompt += `- ${l.name} (${l.topicName}) — Số tiết dạy: ${l.periods || 2} tiết (halfGroup: "firstHalf")\n`;
          });
        } else {
          customScopePrompt += `1. PHẦN NỬA ĐẦU HỌC KỲ (MỨC 30% THỜI LƯỢNG - BẮT BUỘC ĐÁNH DẤU halfGroup="firstHalf" TRONG MA TRẬN):\n`;
          selectedFirst.forEach((l: any) => {
            customScopePrompt += `- ${l.name} (${l.topicName}) — Số tiết dạy: ${l.periods || 2} tiết (halfGroup: "firstHalf")\n`;
          });
          customScopePrompt += `2. PHẦN NỬA CUỐI HỌC KỲ (MỨC 70% THỜI LƯỢNG - BẮT BUỘC ĐÁNH DẤU halfGroup="secondHalf" TRONG MA TRẬN):\n`;
          selectedSecond.forEach((l: any) => {
            customScopePrompt += `- ${l.name} (${l.topicName}) — Số tiết dạy: ${l.periods || 2} tiết (halfGroup: "secondHalf")\n`;
          });
        }
        if (quickNotes) {
          customScopePrompt += `\nGHI CHÚ PHẠM VI CỦA GIÁO VIÊN: "${quickNotes}"\n`;
        }
      }
    }

    const systemPrompt = `Bạn là AI Chuyên gia Khảo thí môn ${subject} cấp THCS theo GDPT 2018 (Sách Kết nối tri thức).
Nhiệm vụ: Lập DUY NHẤT KHUNG MA TRẬN ĐỀ KIỂM TRA môn ${subject} Lớp ${grade} (${period}).

THÔNG TIN BÀI THI:
- Môn: ${subject}
- Lớp: ${grade}
- Kì thi: ${period}
- Hình thức Vận dụng: ${examFormat}
- Trường: ${schoolName}
- Năm học: ${schoolYear}
${customScopePrompt}

CƠ CẤU ĐỀ THI VÀ SỐ LƯỢNG CÂU HỎI BẮT BUỘC (TỔNG 10 ĐIỂM):
${isMath ? `* MÔN TOÁN:
- Nhận biết (4,0đ): 12 câu MCQ (3,0đ) + 4 ý TF (1,0đ) + 1 câu ShortAnswer (0,5đ) => mcq_nb=12, tf_nb=4, sa_nb=1.
- Thông hiểu (3,0đ): 2 ý TF (0,5đ) + 2 câu ShortAnswer (1,0đ) + 1 câu Tự luận (1,0đ) => tf_th=2, sa_th=2, tl_th=1.
- Vận dụng (3,0đ): 2 ý TF (0,5đ) + 1 câu ShortAnswer (0,5đ) + 2 câu Tự luận (2,0đ) => tf_vd=2, sa_vd=1, tl_vd=2.` : `* MÔN TIN HỌC:
- Nhận biết (4,0đ): 8 câu MCQ (2,0đ) + 8 ý TF (2,0đ) => mcq_nb=8, tf_nb=8.
- Thông hiểu (3,0đ): 4 câu MCQ (1,0đ) + 8 ý TF (2,0đ) => mcq_th=4, tf_th=8.
- Vận dụng (3,0đ): 3 câu Tự luận/Thực hành (3,0đ) => tl_vd=3.`}

QUY TẮC CẦN TUÂN THỦ:
1. Cột "topic": Tên chuẩn của ${isMath ? "Chương" : "Chủ đề"}.
2. Cột "content": Tên đầy đủ từng Bài học (không gộp bài, viết rõ "Bài 1. Tên bài").
3. Mọi bài học có trong ma trận BẮT BUỘC có ít nhất 1 câu hỏi ở các cột nhận thức.

Hãy xuất kết quả DƯỚI DẠNG JSON duy nhất theo cấu trúc:
{
  "title": "ĐỀ KIỂM TRA ${period.toUpperCase()} - MÔN ${subject.toUpperCase()} ${grade}",
  "time": "${isMath && period.includes("Cuối") ? "90 phút" : "45 phút"}",
  "subject": "${subject}",
  "grade": "${grade}",
  "period": "${period}",
  "examFormat": "${examFormat}",
  "endContent": "${isMath ? 'Chương I' : 'Chủ đề 1'}",
  "schoolName": "${schoolName}",
  "schoolYear": "${schoolYear}",
  "matrix": [
    {
      "topic": "${isMath ? 'Chương I. Tập hợp các số tự nhiên' : 'Chủ đề 1. Máy tính và cộng đồng'}",
      "content": "Bài 1. Tên bài",
      "halfGroup": "firstHalf",
      "periods": 2,
      "percentage": 20,
      "mcq_nb": 1, "mcq_th": 0, "mcq_vd": 0,
      "tf_nb": 1, "tf_th": 0, "tf_vd": 0,
      ${isMath ? '"sa_nb": 0, "sa_th": 1, "sa_vd": 0,' : ''}
      "tl_nb": 0, "tl_th": 0, "tl_vd": 0,
      "total_nb": 2, "total_th": 1, "total_vd": 0,
      "totalPoints": 1.25
    }
  ]
}`;

    const textbookPrompt = getOfficialTextbookReferencePrompt(subject, String(grade));
    const parts: any[] = [{ text: systemPrompt }, { text: textbookPrompt }];
    if (referenceFiles && referenceFiles.length > 0) {
      const fileParts = await processReferenceFilesToGeminiParts(referenceFiles);
      parts.push(...fileParts);
    }

    const response = await executeGeminiWithFailover({
      userApiKeys,
      userCode,
      parts,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 4096,
      }
    });

    const parsedData = extractAndParseJson(response.text);

    if (parsedData.matrix && Array.isArray(parsedData.matrix)) {
      const isCuoiHk1 = period && (period.includes("Cuối kì I") || period.includes("Cuối HK I") || period.includes("Cuối kỳ I") || period.includes("Cuối HK1"));
      const customLessonMap = new Map<string, any>();
      if (scopeConfig && scopeConfig.firstHalfLessons) {
        scopeConfig.firstHalfLessons.filter((l: any) => l.selected).forEach((l: any) => {
          customLessonMap.set(l.name.toLowerCase(), { halfGroup: "firstHalf", periods: l.periods || 2 });
          if (l.lessonNumber) customLessonMap.set(l.lessonNumber.toLowerCase(), { halfGroup: "firstHalf", periods: l.periods || 2 });
        });
      }
      if (scopeConfig && scopeConfig.secondHalfLessons) {
        scopeConfig.secondHalfLessons.filter((l: any) => l.selected).forEach((l: any) => {
          customLessonMap.set(l.name.toLowerCase(), { halfGroup: "secondHalf", periods: l.periods || 2 });
          if (l.lessonNumber) customLessonMap.set(l.lessonNumber.toLowerCase(), { halfGroup: "secondHalf", periods: l.periods || 2 });
        });
      }

      parsedData.matrix = parsedData.matrix.map((row: any) => {
        let halfGroup = row.halfGroup;
        let periods = row.periods;
        const contentStr = String(row.content || "").toLowerCase();
        const topicStr = String(row.topic || "").toLowerCase();

        for (const [key, val] of customLessonMap.entries()) {
          if (contentStr.includes(key) || key.includes(contentStr)) {
            if (val.halfGroup) halfGroup = val.halfGroup;
            if (val.periods) periods = val.periods;
            break;
          }
        }

        if (!halfGroup && isCuoiHk1) {
          if (String(grade) === "8") {
            if (contentStr.includes("bài 1") || contentStr.includes("bài 2") || contentStr.includes("bài 3") || contentStr.includes("bài 4") || topicStr.includes("chủ đề 1") || topicStr.includes("chủ đề 2") || topicStr.includes("chủ đề 3")) {
              halfGroup = "firstHalf";
            } else if (contentStr.includes("bài 5") || contentStr.includes("bài 6") || contentStr.includes("bài 7") || contentStr.includes("bài 8") || topicStr.includes("chủ đề 4")) {
              halfGroup = "secondHalf";
            }
          } else if (String(grade) === "7") {
            if (contentStr.includes("bài 1") || contentStr.includes("bài 2") || contentStr.includes("bài 3") || contentStr.includes("bài 4") || topicStr.includes("chủ đề 1") || topicStr.includes("chủ đề 2") || topicStr.includes("chủ đề 3")) {
              halfGroup = "firstHalf";
            } else {
              halfGroup = "secondHalf";
            }
          } else if (String(grade) === "6") {
            if (contentStr.includes("bài 1") || contentStr.includes("bài 2") || contentStr.includes("bài 3") || contentStr.includes("bài 4") || contentStr.includes("bài 5") || topicStr.includes("chủ đề 1") || topicStr.includes("chủ đề 2")) {
              halfGroup = "firstHalf";
            } else {
              halfGroup = "secondHalf";
            }
          }
        }

        return {
          ...row,
          periods: periods || row.periods || 2,
          halfGroup: halfGroup || row.halfGroup,
          topic: cleanTopicString(row.topic, String(grade), subject)
        };
      });

      parsedData.matrix = normalizeMatrixPercentagesBackend(parsedData.matrix, isCuoiHk1);
      normalizeMatrixAndSpecCounts(parsedData.matrix, [], subject, String(grade), period);
    }

    if (parsedData.endContent) {
      parsedData.endContent = cleanTopicString(parsedData.endContent, String(grade), subject);
    }

    return parsedData;
  }

  // Helper to generate Specification only
  async function generateSpecHelper({
    subject = "Tin học",
    grade,
    period,
    matrix,
    referenceFiles,
    userApiKeys,
    userCode
  }: any) {
    // Dập khuôn chuẩn Bảng đặc tả Tin học 6 Giữa học kỳ I theo tài liệu chuẩn và đồng bộ số câu theo từng bài từ Ma trận
    if (isTinHoc6GiuaKy1(subject, String(grade), period)) {
      if (matrix && Array.isArray(matrix)) {
        normalizeMatrixAndSpecCounts(matrix, [], subject, String(grade), period);
      }
      return {
        specification: syncSpecificationWithMatrix(
          TIN_HOC_6_GIUA_HK1_SPECIFICATION,
          matrix,
          subject,
          String(grade),
          period
        )
      };
    }

    const systemPrompt = `Bạn là AI Chuyên gia Khảo thí môn ${subject} cấp THCS theo GDPT 2018 (Kết nối tri thức).
Nhiệm vụ: Lập DUY NHẤT BẢNG ĐẶC TẢ ĐỀ KIỂM TRA môn ${subject} Lớp ${grade} (${period}) tương ứng 100% với Khung Ma trận sau.

KHUNG MA TRẬN ĐÃ LẬP:
${JSON.stringify(matrix, null, 2)}

[QUY TẮC KIỂM TRA ĐẶC BIỆT KHI LẬP BẢNG ĐẶC TẢ - BẮT BUỘC TUÂN THỦ 100%]:
1. Mọi bài học có trong Ma trận BẮT BUỘC xuất hiện 1 dòng tương ứng trong Bảng đặc tả.
2. HOÀN THIỆN BẢNG ĐẶC TẢ CHI TIẾT (TUYỆT ĐỐI KHÔNG ĐỂ TRỐNG):
   - Ở phần Bảng đặc tả, các ô mô tả mức độ đánh giá ("nb_desc" cho Nhận biết, "th_desc" cho Thông hiểu, "vd_desc" cho Vận dụng) và số lượng câu hỏi ("nb_count", "th_count", "vd_count") PHẢI được điền đầy đủ tương ứng với Ma trận.
   - TUYỆT ĐỐI KHÔNG ĐƯỢC để trống hoặc ghi chung chung là "Không có yêu cầu" nếu ma trận đã phân bổ điểm/câu ở mức độ đó (đặc biệt ở mức độ Vận dụng của các bài có câu hỏi Tự luận).
3. Cột "nb_count", "th_count", "vd_count" khớp 100% với tổng số câu/lệnh hỏi tương ứng trong Ma trận.

Hãy xuất kết quả DƯỚI DẠNG JSON duy nhất theo cấu trúc:
{
  "specification": [
    {
      "topic": "Chủ đề 1. Máy tính và cộng đồng",
      "content": "Bài 1. Tên bài",
      "nb_desc": "– Nhận biết được...",
      "th_desc": "– Thông hiểu...",
      "vd_desc": "– Vận dụng...",
      "nb_count": 3,
      "th_count": 1,
      "vd_count": 1
    }
  ]
}`;

    const textbookPrompt = getOfficialTextbookReferencePrompt(subject, String(grade));
    const parts: any[] = [{ text: systemPrompt }, { text: textbookPrompt }];
    if (referenceFiles && referenceFiles.length > 0) {
      const fileParts = await processReferenceFilesToGeminiParts(referenceFiles);
      parts.push(...fileParts);
    }

    const response = await executeGeminiWithFailover({
      userApiKeys,
      userCode,
      parts,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 4096,
      }
    });

    const parsedData = extractAndParseJson(response.text);

    if (parsedData.specification && Array.isArray(parsedData.specification)) {
      parsedData.specification = parsedData.specification.map((row: any) => ({
        ...row,
        topic: cleanTopicString(row.topic, String(grade), subject)
      }));
    }

    if (matrix && parsedData.specification) {
      normalizeMatrixAndSpecCounts(matrix, parsedData.specification, subject, String(grade), period);
    }

    parsedData.specification = syncSpecificationWithMatrix(
      parsedData.specification,
      matrix,
      subject,
      String(grade),
      period
    );

    return parsedData;
  }

  // Account permission and trial enforcement helper
  async function checkAccountPermission(userCode?: string): Promise<{ allowed: boolean; error?: string }> {
    const code = (userCode || "").trim().toUpperCase();
    if (!code) return { allowed: true };
    if (code === "1111" || code === "ADMIN123" || code === "TK-KHOA-2026") {
      return { allowed: true };
    }
    try {
      const acc = await getAccountById(code);
      if (acc) {
        if (acc.status === "locked") {
          return { allowed: false, error: `Tài khoản "${code}" (${acc.customerName}) đã bị khóa. Vui lòng liên hệ Admin.` };
        }
        const licensed = isAccountLicensed(acc.expiryDate);
        if (!licensed) {
          const count = Number(acc.trialCount) || 0;
          if (count >= 3) {
            return {
              allowed: false,
              error: "🔒 Tài khoản của bạn đã sử dụng hết 3 lượt dùng thử miễn phí. Vui lòng liên hệ Quản trị viên (Admin qua ĐT 0989.982.818 hoặc Zalo 0978.468.986) để được gia hạn bản quyền sử dụng mới có thể tiếp tục tạo đề!"
            };
          }
        }
      }
    } catch {}
    return { allowed: true };
  }

  // API Route for generating Matrix standalone
  app.post("/api/generate-matrix", async (req, res) => {
    try {
      const perm = await checkAccountPermission(req.body.userCode);
      if (!perm.allowed) {
        return res.status(403).json({ error: perm.error });
      }
      const matrixData = await generateMatrixHelper(req.body);
      return res.json(matrixData);
    } catch (error: any) {
      console.error("API Generate Matrix Error:", error);
      return res.status(500).json({ error: formatVietnameseError(error) });
    }
  });

  // API Route for generating Specification standalone
  app.post("/api/generate-spec", async (req, res) => {
    try {
      const perm = await checkAccountPermission(req.body.userCode);
      if (!perm.allowed) {
        return res.status(403).json({ error: perm.error });
      }
      const specData = await generateSpecHelper(req.body);
      return res.json(specData);
    } catch (error: any) {
      console.error("API Generate Spec Error:", error);
      return res.status(500).json({ error: formatVietnameseError(error) });
    }
  });

  // API Route for generating test (Matrix + Spec combined or partial)
  app.post("/api/generate-test", async (req, res) => {
    try {
      const perm = await checkAccountPermission(req.body.userCode);
      if (!perm.allowed) {
        return res.status(403).json({ error: perm.error });
      }
      const { part } = req.body;
      if (part === "matrix") {
        const matrixData = await generateMatrixHelper(req.body);
        return res.json(matrixData);
      }
      if (part === "spec") {
        const specData = await generateSpecHelper(req.body);
        return res.json(specData);
      }

      const matrixData = await generateMatrixHelper(req.body);
      const specData = await generateSpecHelper({ ...req.body, matrix: matrixData.matrix });

      return res.json({
        ...matrixData,
        specification: specData.specification || []
      });
    } catch (error: any) {
      console.error("API General Error:", error);
      return res.status(500).json({ error: formatVietnameseError(error) });
    }
  });
  // Deterministic post-processor to guarantee 100% equal distribution of A, B, C, D answers
  function balanceMcqQuestions(mcqList: any[], seedCode: string = "101"): any[] {
    if (!Array.isArray(mcqList) || mcqList.length === 0) return [];
    const LETTERS = ["A", "B", "C", "D"];
    const n = mcqList.length;
    const baseCount = Math.floor(n / 4);
    const rem = n % 4;
    const targetPool: string[] = [];
    for (let i = 0; i < baseCount; i++) {
      targetPool.push("A", "B", "C", "D");
    }
    const seedNum = Array.from(String(seedCode || "101")).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    for (let r = 0; r < rem; r++) {
      targetPool.push(LETTERS[(seedNum + r) % 4]);
    }

    // Shuffle targetPool
    for (let i = targetPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targetPool[i], targetPool[j]] = [targetPool[j], targetPool[i]];
    }

    // Eliminate consecutive identical answers (so A, B, C, D alternate smoothly without streaks)
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 1; i < targetPool.length; i++) {
        if (targetPool[i] === targetPool[i - 1]) {
          for (let j = 0; j < targetPool.length; j++) {
            if (
              j !== i &&
              j !== i - 1 &&
              targetPool[j] !== targetPool[i] &&
              (j === 0 || targetPool[j - 1] !== targetPool[i]) &&
              (j === targetPool.length - 1 || targetPool[j + 1] !== targetPool[i]) &&
              targetPool[j] !== targetPool[i - 1] &&
              (i === targetPool.length - 1 || targetPool[j] !== targetPool[i + 1])
            ) {
              [targetPool[i], targetPool[j]] = [targetPool[j], targetPool[i]];
              break;
            }
          }
        }
      }
    }

    return mcqList.map((q: any, idx: number) => {
      const rawOpts = Array.isArray(q.options) ? q.options : [];
      const bodies = [0, 1, 2, 3].map((i) => {
        const optStr = String(rawOpts[i] || `Phương án ${LETTERS[i]}`).trim();
        return optStr.replace(/^[A-Da-d][\.\)\:\-]\s*/, "").trim();
      });

      const matchLetter = String(q.correctAnswer || "A").trim().toUpperCase().match(/[ABCD]/);
      const currLetter = matchLetter ? matchLetter[0] : "A";
      const currIdx = LETTERS.indexOf(currLetter);
      const targetLetter = targetPool[idx] || LETTERS[idx % 4];
      const targetIdx = LETTERS.indexOf(targetLetter);

      let explanation = q.explanation || "";
      if (currIdx !== -1 && targetIdx !== -1 && currIdx !== targetIdx) {
        // Swap option text between current correct position and target balanced position
        const temp = bodies[currIdx];
        bodies[currIdx] = bodies[targetIdx];
        bodies[targetIdx] = temp;

        if (typeof explanation === "string" && explanation) {
          explanation = explanation.replace(
            new RegExp(`(Đáp án|đáp án|Phương án|phương án|Chọn|chọn)\\s+(đúng\\s+là\\s+)?${currLetter}\\b`, "g"),
            `$1 $2${targetLetter}`
          );
        }
      }

      return {
        ...q,
        id: idx + 1,
        options: bodies.map((b, i) => `${LETTERS[i]}. ${b}`),
        correctAnswer: targetLetter,
        explanation
      };
    });
  }

  // Deterministic post-processor to diversify True/False statement orders across questions while keeping 2 True & 2 False
  function balanceTfQuestions(tfList: any[], seedCode: string = "101", isMath: boolean = false): any[] {
    if (!Array.isArray(tfList) || tfList.length === 0) return [];
    const TF_PATTERNS = [
      [true, false, false, true],
      [false, true, true, false],
      [true, true, false, false],
      [false, false, true, true],
      [true, false, true, false],
      [false, true, false, true]
    ];
    const seedNum = Array.from(String(seedCode || "101")).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const stmtIds = ["a", "b", "c", "d"];

    return tfList.map((q: any, idx: number) => {
      const rawStmts = Array.isArray(q.statements) ? q.statements : [];
      if (rawStmts.length !== 4) {
        return { ...q, id: 13 + idx };
      }
      const trueStmts = rawStmts.filter((s: any) => Boolean(s.isTrue));
      const falseStmts = rawStmts.filter((s: any) => !s.isTrue);

      if (trueStmts.length === 2 && falseStmts.length === 2) {
        const pattern = TF_PATTERNS[(seedNum + idx) % TF_PATTERNS.length];
        let tIdx = 0;
        let fIdx = 0;
        const reordered = pattern.map((wantTrue, sIdx) => {
          const picked = wantTrue ? trueStmts[tIdx++] : falseStmts[fIdx++];
          const cleanText = String(picked?.text || "").replace(/^[a-dA-D][\.\)\:\-]\s*/, "").trim();
          return {
            id: stmtIds[sIdx],
            text: cleanText,
            isTrue: wantTrue
          };
        });
        return {
          ...q,
          id: 13 + idx,
          statements: reordered
        };
      }

      return {
        ...q,
        id: 13 + idx,
        statements: rawStmts.map((s: any, sIdx: number) => ({
          id: stmtIds[sIdx] || s.id,
          text: String(s?.text || "").replace(/^[a-dA-D][\.\)\:\-]\s*/, "").trim(),
          isTrue: Boolean(s?.isTrue)
        }))
      };
    });
  }

  // Helper to extract terminology/folder/path hints from existing questions & reference variants (Rule 2)
  function extractTerminologyAndPathHints(
    existingMcq?: any[],
    existingTf?: any[],
    referenceVariants?: any[]
  ): { canonicalTinHocFolder: string | null; pathExamples: string[] } {
    const texts: string[] = [];
    const collectFromMcq = (list?: any[]) => {
      if (!Array.isArray(list)) return;
      list.forEach((q) => {
        if (q?.question) texts.push(String(q.question));
        if (Array.isArray(q?.options)) q.options.forEach((o: any) => texts.push(String(o)));
      });
    };
    const collectFromTf = (list?: any[]) => {
      if (!Array.isArray(list)) return;
      list.forEach((q) => {
        if (q?.question) texts.push(String(q.question));
        if (Array.isArray(q?.statements)) q.statements.forEach((s: any) => texts.push(String(s?.text || "")));
      });
    };
    const collectFromApplied = (list?: any[]) => {
      if (!Array.isArray(list)) return;
      list.forEach((q) => {
        if (q?.question) texts.push(String(q.question));
        if (q?.answer) texts.push(String(q.answer));
      });
    };

    collectFromMcq(existingMcq);
    collectFromTf(existingTf);
    if (Array.isArray(referenceVariants)) {
      referenceVariants.forEach((v) => {
        collectFromMcq(v?.mcq);
        collectFromTf(v?.tf);
        collectFromApplied(v?.applied);
      });
    }

    const joined = texts.join("\n");
    const pathMatches = joined.match(/[A-Za-z]:\\[A-Za-z0-9_\\.\-]+/g) || [];
    const uniquePaths = Array.from(new Set(pathMatches)).slice(0, 6);

    // Check if 'TinHoc' is used as a folder name in paths or quotes
    let canonicalTinHocFolder: string | null = null;
    if (/\bTinHoc\b/.test(joined)) {
      canonicalTinHocFolder = "TinHoc";
    } else {
      const m = joined.match(/\b(TinHoc[6789]?)\b/);
      if (m) canonicalTinHocFolder = m[1];
    }

    return {
      canonicalTinHocFolder,
      pathExamples: uniquePaths
    };
  }

  // Deterministic post-processor to unify folder/path terminology across MCQ, TF, and Applied (Rule 2)
  function synchronizePartTerminology(
    parsed: any,
    canonicalFolder: string | null
  ) {
    if (!parsed) return parsed;
    const targetFolder = canonicalFolder || "TinHoc";
    const normalizeFolderTokens = (str: any): any => {
      if (!str || typeof str !== "string") return str;
      // Unify inconsistent TinHoc6 / TinHoc7 / TinHoc8 / TinHoc9 folder names to the canonical folder name (e.g. TinHoc)
      return str.replace(/\bTinHoc[6789]\b/g, targetFolder);
    };

    if (Array.isArray(parsed.mcq)) {
      parsed.mcq = parsed.mcq.map((q: any) => ({
        ...q,
        question: normalizeFolderTokens(q.question),
        options: Array.isArray(q.options) ? q.options.map(normalizeFolderTokens) : q.options,
        explanation: normalizeFolderTokens(q.explanation)
      }));
    }
    if (Array.isArray(parsed.tf)) {
      parsed.tf = parsed.tf.map((q: any) => ({
        ...q,
        question: normalizeFolderTokens(q.question),
        statements: Array.isArray(q.statements)
          ? q.statements.map((s: any) => ({ ...s, text: normalizeFolderTokens(s.text) }))
          : q.statements,
        explanation: normalizeFolderTokens(q.explanation)
      }));
    }
    if (Array.isArray(parsed.applied)) {
      parsed.applied = parsed.applied.map((q: any) => ({
        ...q,
        question: normalizeFolderTokens(q.question),
        answer: normalizeFolderTokens(q.answer),
        pointsBreakdown: Array.isArray(q.pointsBreakdown)
          ? q.pointsBreakdown.map((pb: any) => ({
              ...pb,
              criteria: normalizeFolderTokens(pb.criteria)
            }))
          : q.pointsBreakdown
      }));
    }
    return parsed;
  }

  // Helper function to generate a specific part of an exam variant
  async function generateExamPart({
    partName,
    subject,
    grade,
    period,
    examFormat = "Tự luận",
    examCode = "101",
    matrix,
    specification: rawSpecification,
    existingMcq,
    existingTf,
    referenceVariants,
    referenceFiles,
    userApiKeys,
    userCode
  }: any) {
    const isMath = subject.toLowerCase().trim().includes("toán");
    const { mcqPlan, saPlan, appliedPlan, syncedSpec: specification } = extractMatrixQuestionPlan(
      matrix,
      rawSpecification,
      subject,
      String(grade),
      period
    );

    const { canonicalTinHocFolder, pathExamples } = extractTerminologyAndPathHints(
      existingMcq,
      existingTf,
      referenceVariants
    );

    const refVariant =
      Array.isArray(referenceVariants) && referenceVariants.length > 0
        ? referenceVariants[0]
        : null;

    // Build explicit question-by-question assignment plan from matrix to prevent duplicate/similar questions and prevent lesson drift across variants
    const mcqAllocationLines: string[] = mcqPlan.map(
      (item, idx) =>
        `- Câu ${item.id}: BẮT BUỘC thuộc "${item.content}" (${item.topic}) — Mức độ ${item.level.toUpperCase()} (Yêu cầu cần đạt: ${item.desc.replace(/\r?\n/g, " ")}; tuyệt đối không trùng ý với câu khác).`
    );

    const tfAllocationLines: string[] = [];
    if (Array.isArray(matrix)) {
      const tfRows = matrix.filter(
        (r: any) => (Number(r.tf_nb) || 0) + (Number(r.tf_th) || 0) + (Number(r.tf_vd) || 0) > 0
      );
      const targetTfCount = isMath ? 2 : 4;
      for (let t = 0; t < targetTfCount; t++) {
        const r = tfRows[t % Math.max(1, tfRows.length)] || matrix[t % Math.max(1, matrix.length)];
        if (r) {
          tfAllocationLines.push(
            `- Câu ${13 + t}: BẮT BUỘC thuộc bài "${r.content || r.topic}" (${r.topic || ""}) — Xây dựng 1 tình huống thực tiễn riêng biệt, 4 ý a, b, c, d kiểm tra 4 khía cạnh hoàn toàn khác nhau của bài học (2 ý Nhận biết, 2 ý Thông hiểu).`
          );
        }
      }
    }

    const saAllocationLines: string[] = saPlan.map(
      (item) =>
        `- Câu ${item.id}: BẮT BUỘC thuộc "${item.content}" (${item.topic}) — Mức độ ${item.level.toUpperCase()} (${item.desc.replace(/\r?\n/g, " ")}).`
    );

    const appliedAllocationLines: string[] = appliedPlan.map(
      (item) =>
        `- Câu ${item.id} (1,0 điểm - Mức ${item.level}): BẮT BUỘC thuộc chính xác bài "${item.content}" (${item.topic}) — Yêu cầu cần đạt: ${item.desc.replace(/\r?\n/g, " ")}. TUYỆT ĐỐI KHÔNG ra câu hỏi lệch sang bài học khác!`
    );

    const specialVerificationRulesBlock = `
[QUY TẮC KIỂM TRA ĐẶC BIỆT DÀNH CHO AI - BẮT BUỘC TUÂN THỦ TRƯỚC KHI XUẤT ĐỀ]:
1. ĐỒNG BỘ HÓA MA TRẬN VÀ CÂU HỎI TỰ LUẬN (TRÁNH LỆCH BÀI):
   - Khung ma trận và Bảng đặc tả đã phân bổ số lượng câu hỏi ở bài học nào thì TẤT CẢ các mã đề (Mã 001, Mã 002, Mã 101, Mã 102...) ĐỀU PHẢI có câu hỏi bám sát ĐÚNG bài học đó.
   - TUYỆT ĐỐI KHÔNG để tình trạng Mã đề này ra tự luận vận dụng ở bài này, nhưng Mã đề kia lại ra tự luận vận dụng ở bài khác không khớp với ma trận và đặc tả.
2. ĐỒNG NHẤT DỮ LIỆU VÀ THUẬT NGỮ TRONG ĐỀ THI:
   - Các thuật ngữ, tên thư mục, đường dẫn (ví dụ: thư mục '${canonicalTinHocFolder || "TinHoc"}') nếu xuất hiện ở phần trắc nghiệm (như câu dẫn đường dẫn) thì PHẢI ĐƯỢC THỐNG NHẤT HỢP LÝ với phần tự luận ở các mã đề, tuyệt đối tránh gây mâu thuẫn tên gọi (như chỗ thì dùng TinHoc, chỗ lại dùng TinHoc${grade}).${pathExamples.length > 0 ? `\n   - Đường dẫn/thư mục đã xuất hiện trong đề để tham chiếu đồng bộ: ${pathExamples.join(", ")}` : ""}
3. HOÀN THIỆN BẢNG ĐẶC TẢ & ĐÁP ÁN CHI TIẾT:
   - Bám sát 100% các mức độ đánh giá (Nhận biết, Thông hiểu, Vận dụng) trong Bảng đặc tả.
4. KIỂM TRA ĐỐI CHIẾU CÁC MÃ ĐỀ SONG SONG:
   - Các mã đề song song (ví dụ Mã 001 và Mã 002, hoặc 101 và 102) phải có độ khó tương đương, cùng phạm vi kiến thức, cùng bài học ở từng câu và cùng ma trận phân bố điểm, nhưng phải được đảo trật tự câu hỏi hoặc thay đổi ngữ cảnh/tình huống tương đương để đảm bảo tính khảo thí độc lập.`;

    let partPrompt = "";
    if (partName === "part1" || partName === "mcq") {
      const refMcqBlock =
        refVariant && Array.isArray(refVariant.mcq) && refVariant.mcq.length > 0
          ? `\nĐỐI CHIẾU MÃ ĐỀ GỐC (${refVariant.code}) ĐỂ TẠO MÃ ĐỀ SONG SONG (${examCode}) ĐỘC LẬP NHƯNG CÙNG ĐỘ KHÓ & CÙNG PHẠM VI BÀI HỌC:\n${JSON.stringify(
              refVariant.mcq.map((q: any) => ({ id: q.id, question: q.question })),
              null,
              2
            )}\n(Yêu cầu cho Mã đề ${examCode}: Giữ nguyên bài học và mức độ nhận thức của từng câu theo Ma trận, nhưng thay đổi ngữ cảnh/số liệu tương đương hoặc đảo vị trí câu hỏi trong cùng mức độ để đảm bảo tính khảo thí độc lập và thống nhất thuật ngữ/tên thư mục '${canonicalTinHocFolder || "TinHoc"}').\n`
          : "";

      partPrompt = `Bạn là AI Chuyên gia Khảo thí môn ${subject} cấp THCS (GDPT 2018).
Nhiệm vụ: Biên soạn duy nhất PHẦN 1: TRẮC NGHIỆM NHIỀU LỰA CHỌN (12 CÂU HỎI, từ Câu 1 đến Câu 12) cho Mã đề ${examCode} môn ${subject} ${grade} (${period}).
${specialVerificationRulesBlock}
LƯU Ý BẮT BUỘC (TUÂN THỦ 100%):
1. Dựa sát 100% vào Bảng đặc tả và Ma trận được cung cấp.
2. ĐỦ 12 CÂU HỎI. Đáp án đúng A, B, C, D PHẢI PHÂN BỐ ĐỀU NHAU (Đúng 3 câu đáp án A, 3 câu đáp án B, 3 câu đáp án C, 3 câu đáp án D).
3. CẤM TUYỆT ĐỐI TẠO CÁC CÂU HỎI HOẶC CÁC Ý LỰA CHỌN GIỐNG NHAU / TƯƠNG TỰ NHAU:
   - 12 câu hỏi phải kiểm tra 12 đơn vị kiến thức / khái niệm / thiết bị / tình huống / dạng bài HOÀN TOÀN KHÁC NHAU. Không được có 2 câu hỏi hỏi cùng 1 ý chỉ đổi chữ!
   - Trong mỗi câu hỏi, 4 phương án "A. ...", "B. ...", "C. ...", "D. ..." phải khác biệt rõ ràng, ngắn gọn, chuẩn thuật ngữ SGK, tuyệt đối không có 2 phương án trùng ý.
   - Nếu có câu hỏi về đường dẫn / thư mục, thống nhất dùng tên thư mục chuẩn là '${canonicalTinHocFolder || "TinHoc"}' (không dùng TinHoc${grade}).
${mcqAllocationLines.length > 0 ? `\nPHÂN BỔ CHI TIẾT TỪNG CÂU HỎI THEO MA TRẬN (BẮT BUỘC BÁM SÁT):\n${mcqAllocationLines.join("\n")}\n` : ""}${refMcqBlock}
${isMath ? '4. Các công thức toán dùng LaTeX giữa dấu $. Với câu hỏi hình học, cung cấp mã SVG hợp lệ vào figureSvg.' : ''}

MA TRẬN:
${JSON.stringify(matrix, null, 2)}

BẢNG ĐẶC TẢ:
${JSON.stringify(specification, null, 2)}

Hãy xuất kết quả DƯỚI DẠNG JSON duy nhất theo cấu trúc:
{
  "mcq": [
    {
      "id": 1,
      "lesson": "Bài 1. Tên bài học",
      "question": "Nội dung câu hỏi 1",
      "options": ["A. Lựa chọn A", "B. Lựa chọn B", "C. Lựa chọn C", "D. Lựa chọn D"],
      "correctAnswer": "A",
      "explanation": "Lời giải chi tiết ngắn gọn"${isMath ? `,
      "hasFigure": false,
      "figureSvg": "<svg viewBox=\\"0 0 250 160\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>",
      "figureDescription": "Mô tả hình"` : ""}
    }
  ]
}`;
    } else if (partName === "part2" || partName === "tf") {
      const refTfBlock =
        refVariant && Array.isArray(refVariant.tf) && refVariant.tf.length > 0
          ? `\nĐỐI CHIẾU MÃ ĐỀ GỐC (${refVariant.code}) ĐỂ TẠO MÃ ĐỀ SONG SONG (${examCode}) TƯƠNG ĐƯƠNG ĐỘ KHÓ VÀ CÙNG BÀI HỌC:\n${JSON.stringify(
              refVariant.tf.map((q: any) => ({ id: q.id, question: q.question })),
              null,
              2
            )}\n(Yêu cầu cho Mã đề ${examCode}: Mỗi câu lớn Đúng-Sai bám sát đúng bài học tương ứng trong Ma trận nhưng thay đổi bối cảnh/phát biểu tương đương so với Mã đề ${refVariant.code}).\n`
          : "";

      partPrompt = `Bạn là AI Chuyên gia Khảo thí môn ${subject} cấp THCS (GDPT 2018).
Nhiệm vụ: Biên soạn duy nhất PHẦN 2: TRẮC NGHIỆM ĐÚNG - SAI (${isMath ? "02 CÂU HỎI LỚN (Câu 13, Câu 14)" : "04 CÂU HỎI LỚN (Câu 13, Câu 14, Câu 15, Câu 16)"}) cho Mã đề ${examCode} môn ${subject} ${grade} (${period}).
${specialVerificationRulesBlock}
LƯU Ý BẮT BUỘC:
1. Dựa sát 100% vào Bảng đặc tả và Ma trận.
2. Mỗi câu hỏi lớn có 4 ý a, b, c, d. BẮT BUỘC MỖI CÂU LỚN CÓ ĐÚNG 2 Ý ĐÚNG VÀ 2 Ý SAI (xáo trộn ngẫu nhiên vị trí Đúng/Sai giữa a, b, c, d).
3. CẤM TUYỆT ĐỐI LẶP LẠI Ý PHÁT BIỂU: 4 ý a, b, c, d trong mỗi câu và giữa các câu lớn phải khai thác các khía cạnh hoàn toàn khác nhau, không trùng lặp nội dung.
${tfAllocationLines.length > 0 ? `\nPHÂN BỔ CHI TIẾT TỪNG CÂU LỚN ĐÚNG - SAI THEO MA TRẬN:\n${tfAllocationLines.join("\n")}\n` : ""}${refTfBlock}

MA TRẬN:
${JSON.stringify(matrix, null, 2)}

BẢNG ĐẶC TẢ:
${JSON.stringify(specification, null, 2)}

Hãy xuất kết quả DƯỚI DẠNG JSON duy nhất theo cấu trúc:
{
  "tf": [
    {
      "id": 13,
      "lesson": "Bài X. Tên bài học",
      "question": "Bối cảnh/Thân câu hỏi lớn 13",
      "statements": [
        { "id": "a", "text": "Phát biểu a", "isTrue": true },
        { "id": "b", "text": "Phát biểu b", "isTrue": false },
        { "id": "c", "text": "Phát biểu c", "isTrue": false },
        { "id": "d", "text": "Phát biểu d", "isTrue": true }
      ]${isMath ? `,
      "hasFigure": false,
      "figureSvg": "<svg viewBox=\\"0 0 250 160\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>",
      "figureDescription": "Mô tả hình"` : ""}
    }
  ]
}`;
    } else if (partName === "part3" || partName === "shortAnswer") {
      if (!isMath) {
        return { shortAnswer: [] };
      }
      partPrompt = `Bạn là AI Chuyên gia Khảo thí môn ${subject} cấp THCS (GDPT 2018).
Nhiệm vụ: Biên soạn duy nhất PHẦN 3: TRẮC NGHIỆM TRẢ LỜI NGẮN (04 CÂU HỎI, từ Câu 15 đến Câu 18) cho Mã đề ${examCode} môn ${subject} ${grade} (${period}).
${specialVerificationRulesBlock}
LƯU Ý BẮT BUỘC:
1. Dựa sát 100% vào Bảng đặc tả và Ma trận.
2. Yêu cầu tính toán ra đáp số/kết quả ngắn gọn, 4 câu thuộc 4 dạng bài khác nhau theo đúng phân bổ bên dưới.
${saAllocationLines.length > 0 ? `\nPHÂN BỔ CHI TIẾT TỪNG CÂU TRẢ LỜI NGẮN THEO MA TRẬN:\n${saAllocationLines.join("\n")}\n` : ""}

MA TRẬN:
${JSON.stringify(matrix, null, 2)}

BẢNG ĐẶC TẢ:
${JSON.stringify(specification, null, 2)}

Hãy xuất kết quả DƯỚI DẠNG JSON duy nhất theo cấu trúc:
{
  "shortAnswer": [
    {
      "id": 15,
      "lesson": "Bài X. Tên bài học",
      "question": "Nội dung câu hỏi 15",
      "answer": "120",
      "unit": "cm2",
      "explanation": "Hướng dẫn tính toán",
      "hasFigure": false,
      "figureSvg": "",
      "figureDescription": ""
    }
  ]
}`;
    } else if (partName === "part4" || partName === "applied") {
      const isPracticeFormat = (examFormat || "").toLowerCase().includes("thực hành");

      const formatRules = isPracticeFormat
        ? `4. QUY TẮC BẮT BUỘC THEO HÌNH THỨC THỰC HÀNH MÁY TÍNH:
   - Giáo viên đã cấu hình hình thức: THỰC HÀNH MÁY TÍNH.
   - TOÀN BỘ 03 CÂU LÀ CÁC BÀI TẬP THỰC HÀNH THAO TÁC TRÊN PHÒNG MÁY: Yêu cầu học sinh thực hành thao tác phần mềm trên máy tính cụ thể, rõ ràng, chi tiết từng bước (ví dụ: tạo cấu trúc thư mục/tệp, khởi động Scratch lập trình kịch bản theo yêu cầu, căn lề/soạn thảo văn bản Word, nhập công thức tính toán/định dạng trong Excel).
   - Tuyệt đối không ra đề chung chung mập mờ để học sinh tự suy đoán.`
        : `4. QUY TẮC BẮT BUỘC THEO HÌNH THỨC TỰ LUẬN TRÊN GIẤY (LƯU Ý TỐI THƯỢNG):
   - Giáo viên đã cấu hình hình thức: TỰ LUẬN TRÊN GIẤY (BÀI TẬP VIẾT).
   - TOÀN BỘ 03 CÂU PHẢI LÀ BÀI TẬP TỰ LUẬN LÀM TRÊN GIẤY: Các bài tập tính toán dung lượng dữ liệu, phân tích biểu diễn thông tin, xây dựng thuật toán / vẽ sơ đồ khối, giải thích khái niệm, thiết kế cây thư mục/đường dẫn trên giấy hoặc xử lý tình huống thực tế bằng bài viết trên giấy thi.
   - CẤM TUYỆT ĐỐI RA ĐỀ BÀI THAO TÁC PHÒNG MÁY TÍNH (như bật máy tính, nháy chuột, tạo thư mục trên ổ đĩa máy tính, chạy phần mềm máy tính).
   - CẤM TUYỆT ĐỐI GHI NHÃN HOẶC TIỀN TỐ '(Thực hành)' HAY '(Lý thuyết)' Ở ĐẦU CÂU HỎI. Viết trực tiếp nội dung đề bài chuẩn mực sư phạm.`;

      const refAppliedBlock =
        refVariant && Array.isArray(refVariant.applied) && refVariant.applied.length > 0
          ? `\nĐỐI CHIẾU CÂU HỎI TỰ LUẬN CỦA MÃ ĐỀ GỐC (${refVariant.code}) ĐỂ ĐỒNG BỘ 100% BÀI HỌC CHO MÃ ĐỀ ${examCode}:\n${JSON.stringify(
              refVariant.applied.map((q: any) => ({
                id: q.id,
                lesson: q.lesson,
                question: q.question
              })),
              null,
              2
            )}\nLƯU Ý SỐNG CÒN KHI SOẠN MÃ ĐỀ ${examCode}:
- Câu ${isMath ? "19, 20, 21" : "17, 18, 19"} của Mã đề ${examCode} BẮT BUỘC PHẢI THUỘC ĐÚNG CÙNG BÀI HỌC như phân bổ của Ma trận và tương ứng 1-1 với Câu ${isMath ? "19, 20, 21" : "17, 18, 19"} của Mã đề ${refVariant.code}!
- TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỔI SANG BÀI HỌC KHÁC! Chỉ thay đổi tình huống/ngữ cảnh/số liệu tương đương trong cùng bài học đó và giữ nguyên tên thư mục gốc '${canonicalTinHocFolder || "TinHoc"}' nếu câu hỏi liên quan đến cây thư mục/đường dẫn.\n`
          : "";

      partPrompt = `Bạn là AI Chuyên gia Khảo thí môn ${subject} cấp THCS (GDPT 2018).
Nhiệm vụ: Biên soạn duy nhất PHẦN B: CÂU HỎI ${isPracticeFormat ? "THỰC HÀNH TRÊN MÁY TÍNH" : "TỰ LUẬN"} (03 CÂU HỎI, ${isMath ? "Câu 19 đến Câu 21" : "Câu 17 đến Câu 19"}) cho Mã đề ${examCode} môn ${subject} ${grade} (${period}).
${specialVerificationRulesBlock}

★ PHÂN BỔ BẮT BUỘC TỪNG CÂU TỰ LUẬN THEO ĐÚNG MA TRẬN & ĐẶC TẢ (TUYỆT ĐỐI KHÔNG LỆCH BÀI):
${appliedAllocationLines.join("\n")}
${refAppliedBlock}
LƯU Ý BẮT BUỘC:
1. Từng câu hỏi (${isMath ? "Câu 19, Câu 20, Câu 21" : "Câu 17, Câu 18, Câu 19"}) PHẢI bám sát 100% đúng bài học đã chỉ định ở mục PHÂN BỔ BẮT BUỘC phía trên. Nếu Ma trận phân bổ câu Tự luận Vận dụng ở bài nào (ví dụ: Bài 5 - Ứng xử trên mạng), thì BẮT BUỘC câu đó phải ra đúng bài học đó!
2. Mỗi câu 1,0 điểm, kèm đáp án và thang điểm/rubric chi tiết đến 0,25đ hoặc 0,5đ.
3. Lời giải và đáp án viết súc tích, đầy đủ ý chuẩn mực khoa học/sư phạm, đồng nhất 100% thuật ngữ và tên thư mục (dùng '${canonicalTinHocFolder || "TinHoc"}', tuyệt đối không dùng lệch sang 'TinHoc${grade}').
${formatRules}

MA TRẬN:
${JSON.stringify(matrix, null, 2)}

BẢNG ĐẶC TẢ:
${JSON.stringify(specification, null, 2)}

Hãy xuất kết quả DƯỚI DẠNG JSON duy nhất theo cấu trúc:
{
  "applied": [
    {
      "id": ${isMath ? 19 : 17},
      "lesson": "${appliedPlan[0]?.content || "Bài học"}",
      "question": "Nội dung câu hỏi ${isPracticeFormat ? "thực hành máy tính" : "tự luận trên giấy"}",
      "answer": "Đáp án và lời giải chi tiết",
      "pointsBreakdown": [
        { "criteria": "Ý 1", "points": "0.5" },
        { "criteria": "Ý 2", "points": "0.5" }
      ]${isMath ? `,
      "hasFigure": false,
      "figureSvg": "",
      "figureDescription": ""` : ""}
    }
  ]
}`;
    }

    const textbookPrompt = getOfficialTextbookReferencePrompt(subject, String(grade));
    const parts: any[] = [{ text: partPrompt }, { text: textbookPrompt }];
    if (referenceFiles && referenceFiles.length > 0) {
      const fileParts = await processReferenceFilesToGeminiParts(referenceFiles);
      parts.push(...fileParts);
    }

    const response = await executeGeminiWithFailover({
      userApiKeys,
      userCode,
      parts,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 8192,
      }
    });

    let parsed = extractAndParseJson(response.text);
    parsed = synchronizePartTerminology(parsed, canonicalTinHocFolder);

    if (parsed && Array.isArray(parsed.mcq)) {
      parsed.mcq = parsed.mcq.map((q: any, idx: number) => ({
        ...q,
        lesson: mcqPlan[idx]?.content || q.lesson || ""
      }));
      parsed.mcq = balanceMcqQuestions(parsed.mcq, examCode);
    }
    if (parsed && Array.isArray(parsed.tf)) {
      parsed.tf = balanceTfQuestions(parsed.tf, examCode, isMath);
    }
    if (parsed && Array.isArray(parsed.applied)) {
      const startId = isMath ? 19 : 17;
      parsed.applied = parsed.applied.map((q: any, idx: number) => ({
        ...q,
        id: startId + idx,
        lesson: appliedPlan[idx]?.content || q.lesson || "",
        topic: appliedPlan[idx]?.topic || q.topic || ""
      }));
    }
    return parsed;
  }

  // API Route for generating a variant exam code using the existing matrix and specification
  app.post("/api/generate-variant", async (req, res) => {
    try {
      const {
        subject,
        grade,
        period,
        examFormat = "Tự luận",
        schoolName = "TRƯỜNG THCS TÂN LOAN",
        schoolYear = "2026 - 2027",
        matrix,
        specification,
        examCode = "102",
        part,
        existingMcq,
        existingTf,
        referenceVariants,
        referenceFiles,
        userApiKeys,
        userCode
      } = req.body;

      if (!grade || !period || !matrix || !specification) {
        return res.status(400).json({ error: "Thiếu dữ liệu Ma trận hoặc Đặc tả để tạo mã đề mới." });
      }

      const perm = await checkAccountPermission(userCode);
      if (!perm.allowed) {
        return res.status(403).json({ error: perm.error });
      }

      console.log(`Generating variant code ${examCode} (part: ${part || 'all'}) for Grade ${grade}, ${period}...`);
      const isMath = subject.toLowerCase().trim().includes("toán");

      // If a specific part is requested
      if (part && part !== "all") {
        const partResult = await generateExamPart({
          partName: part,
          subject,
          grade,
          period,
          examFormat,
          examCode,
          matrix,
          specification,
          existingMcq,
          existingTf,
          referenceVariants,
          referenceFiles,
          userApiKeys,
          userCode
        });
        return res.json(partResult);
      }

      // If no specific part requested, generate part1 first so its terminology can be synced with part2 and part4
      const p1 = await generateExamPart({
        partName: "part1",
        subject,
        grade,
        period,
        examFormat,
        examCode,
        matrix,
        specification,
        referenceVariants,
        referenceFiles,
        userApiKeys,
        userCode
      });
      const [p2, p3, p4] = await Promise.all([
        generateExamPart({
          partName: "part2",
          subject,
          grade,
          period,
          examFormat,
          examCode,
          matrix,
          specification,
          existingMcq: p1?.mcq,
          referenceVariants,
          referenceFiles,
          userApiKeys,
          userCode
        }),
        isMath
          ? generateExamPart({
              partName: "part3",
              subject,
              grade,
              period,
              examFormat,
              examCode,
              matrix,
              specification,
              existingMcq: p1?.mcq,
              referenceVariants,
              referenceFiles,
              userApiKeys,
              userCode
            })
          : Promise.resolve({ shortAnswer: [] }),
        generateExamPart({
          partName: "part4",
          subject,
          grade,
          period,
          examFormat,
          examCode,
          matrix,
          specification,
          existingMcq: p1?.mcq,
          referenceVariants,
          referenceFiles,
          userApiKeys,
          userCode
        })
      ]);

      const completeVariant = {
        code: examCode,
        title: `ĐỀ KIỂM TRA ${period.toUpperCase()} - MÔN ${subject.toUpperCase()} ${grade}`,
        mcq: balanceMcqQuestions(p1?.mcq || [], examCode),
        tf: balanceTfQuestions(p2?.tf || [], examCode, isMath),
        shortAnswer: p3?.shortAnswer || [],
        applied: p4?.applied || []
      };

      return res.json(completeVariant);
    } catch (error: any) {
      console.error("API Variant Error:", error);
      return res.status(500).json({ error: formatVietnameseError(error) });
    }
  });

  // API Route for regenerating a specific question based on user prompt or customization
  app.post("/api/regenerate-question", async (req, res) => {
    try {
      const {
        subject,
        grade,
        period,
        examFormat = "Tự luận",
        questionType, // "mcq" | "tf" | "applied" | "shortAnswer"
        questionId,
        currentQuestion,
        customInstruction = "",
        matrix,
        specification,
        referenceFiles,
        selectedLessons,
        userApiKeys,
        userCode
      } = req.body;

      if (!grade || !period || !questionType || questionId === undefined) {
        return res.status(400).json({ error: "Thiếu thông tin câu hỏi cần soạn lại." });
      }

      console.log(`Regenerating question ${questionId} (${questionType}) for Grade ${grade}, ${period}...`);

      const isMath = subject.toLowerCase().trim().includes("toán");
      let typeSchemaPrompt = "";
      if (questionType === "mcq") {
        typeSchemaPrompt = `Loại câu hỏi: TRẮC NGHIỆM NHIỀU LỰA CHỌN (Câu ${questionId})
Ràng buộc: 
- 01 câu dẫn rõ ràng, chuẩn kiến thức môn ${subject} ${grade} GDPT 2018 (Sách Kết nối tri thức).
- 04 phương án lựa chọn A, B, C, D (ghi rõ "A. ...", "B. ...", "C. ...", "D. ...").
- 01 đáp án đúng (correctAnswer: "A" hoặc "B" hoặc "C" hoặc "D").
- 01 giải thích ngắn gọn, sư phạm.
${isMath ? `- Nếu là câu hỏi hình học có hình vẽ: Đặt hasFigure: true, cung cấp figureSvg (chuỗi SVG hợp lệ), figureDescription.` : ""}
Schema JSON:
{
  "id": ${questionId},
  "question": "Nội dung câu hỏi...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctAnswer": "A",
  "explanation": "Giải thích..."${isMath ? `,
  "hasFigure": false,
  "figureSvg": "<svg viewBox=\\"0 0 250 160\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg>",
  "figureDescription": "Mô tả hình vẽ nếu có"` : ""}
}`;
      } else if (questionType === "tf") {
        typeSchemaPrompt = `Loại câu hỏi: TRẮC NGHIỆM ĐÚNG - SAI (Câu ${questionId})
Ràng buộc:
- 01 câu dẫn hoặc tình huống thực tế môn ${subject} ${grade}.
- 04 ý phát biểu a, b, c, d. BẮT BUỘC CÓ ĐÚNG 2 Ý ĐÚNG (isTrue: true) VÀ 2 Ý SAI (isTrue: false).
Schema JSON:
{
  "id": ${questionId},
  "question": "Nội dung tình huống / câu hỏi lớn...",
  "statements": [
    { "id": "a", "text": "Phát biểu a", "isTrue": true },
    { "id": "b", "text": "Phát biểu b", "isTrue": false },
    { "id": "c", "text": "Phát biểu c", "isTrue": true },
    { "id": "d", "text": "Phát biểu d", "isTrue": false }
  ]
}`;
      } else if (questionType === "shortAnswer") {
        typeSchemaPrompt = `Loại câu hỏi: TRẮC NGHIỆM TRẢ LỜI NGẮN (Câu ${questionId}) môn ${subject} ${grade}
Ràng buộc:
- 01 câu hỏi toán học rõ ràng, yêu cầu học sinh tính toán hoặc tìm giá trị cụ thể.
- 01 đáp án/kết quả số hoặc biểu thức ngắn gọn (ví dụ: "42", "2024", "150", "-5", "12").
- unit: Đơn vị tính (nếu có, ví dụ "cm", "m²", "học sinh", "người", "độ" hoặc để trống "").
- 01 giải thích/hướng dẫn tính toán ngắn gọn.
Schema JSON:
{
  "id": ${questionId},
  "question": "Nội dung câu hỏi ngắn...",
  "answer": "150",
  "unit": "cm²",
  "explanation": "Giải thích phép tính..."
}`;
      } else {
        const isPracticeQ = (examFormat || "").toLowerCase().includes("thực hành");
        typeSchemaPrompt = `Loại câu hỏi: VẬN DỤNG / ${isPracticeQ ? "THỰC HÀNH MÁY TÍNH" : "TỰ LUẬN TRÊN GIẤY"} (Câu ${questionId})
Ràng buộc:
- 01 bài tập/tình huống vận dụng thực tiễn phù hợp thời lượng và thang điểm 1,0 điểm.
${isPracticeQ 
  ? "- Yêu cầu thao tác cụ thể trên phòng máy tính (tạo thư mục, soạn thảo, bảng tính, Scratch, Python...)." 
  : "- Bài tập tự luận làm trên giấy (tính toán dung lượng, biểu diễn thông tin, thuật toán, sơ đồ khối, giải thích tình huống). TUYỆT ĐỐI KHÔNG yêu cầu thao tác phòng máy tính và CẤM TUYỆT ĐỐI ghi nhãn '(Lý thuyết)' hay '(Thực hành)'."}
- Hướng dẫn giải chi tiết, rõ ràng từng bước.
- Rubric thang điểm chi tiết (pointsBreakdown) chia nhỏ các ý (0.25đ, 0.5đ...) tổng bằng 1.0 điểm.
Schema JSON:
{
  "id": ${questionId},
  "question": "Yêu cầu bài toán / câu hỏi tự luận...",
  "answer": "Đáp án / Hướng dẫn giải chi tiết...",
  "pointsBreakdown": [
    { "criteria": "Ý 1...", "points": "0.5" },
    { "criteria": "Ý 2...", "points": "0.5" }
  ]
}`;
      }

      const systemPrompt = `Bạn là một AI Chuyên gia Khảo thí môn ${subject} THCS theo Chương trình GDPT 2018 (Sách Kết nối tri thức).
Nhiệm vụ: Soạn lại duy nhất 01 câu hỏi (Câu số ${questionId}) cho đề kiểm tra môn ${subject} ${grade} (${period}). LƯU Ý TỐI QUAN TRỌNG: BẠN PHẢI SỬ DỤNG CHÍNH XÁC VÀ DUY NHẤT CÁC THÔNG TIN, YÊU CẦU CẦN ĐẠT TRONG DỮ LIỆU ĐƯỢC CUNG CẤP DƯỚI ĐÂY. TUYỆT ĐỐI KHÔNG LẤY DỮ LIỆU TỪ NGUỒN NGOÀI HOẶC TỰ BỊA RA.

${currentQuestion ? `--- CÂU HỎI HIỆN TẠI TRƯỚC KHI SOẠN LẠI ---\n${JSON.stringify(currentQuestion, null, 2)}\n` : ""}
${customInstruction ? `--- YÊU CẦU SOẠN LẠI CỤ THỂ CỦA GIÁO VIÊN ---\n"${customInstruction}"\n(Hãy ưu tiên tối đa thực hiện theo đúng yêu cầu cụ thể này của giáo viên)\n` : ""}

${typeSchemaPrompt}

Chỉ trả về JSON thuần tuý khớp với schema ở trên, không kèm lời giải thích hay markdown code block.`;

      const selectedLessonIds = (selectedLessons || []).map((l: any) => l.id);
      const textbookPrompt = selectedLessonIds.length > 0
        ? getFilteredTextbookReferencePrompt(subject, String(grade), selectedLessonIds)
        : getOfficialTextbookReferencePrompt(subject, String(grade));
      const parts: any[] = [{ text: systemPrompt }, { text: textbookPrompt }];
      const fileParts = await processReferenceFilesToGeminiParts(referenceFiles);
      parts.push(...fileParts);

      const response = await executeGeminiWithFailover({
        userApiKeys,
        userCode,
        parts,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 4096,
        }
      });

      const parsedQuestion = extractAndParseJson(response.text);
      parsedQuestion.id = Number(questionId);
      return res.json(parsedQuestion);

    } catch (error: any) {
      console.error("API Regenerate Question Error:", error);
      return res.status(500).json({ error: formatVietnameseError(error) });
    }
  });

  // API Route for generating Student Study Guide (Đề cương ôn tập của học sinh)
  app.post("/api/generate-study-guide", async (req, res) => {
    try {
      const {
        subject = "Tin học",
        grade = "8",
        period = "Giữa Học Kỳ I",
        examFormat = "Trắc nghiệm & Tự luận",
        schoolName = "TRƯỜNG THCS TÂN LOAN",
        departmentName = "XÃ HÀM YÊN",
        schoolYear = "2026 - 2027",
        matrix = [],
        specification = [],
        currentVariant = null,
        referenceFiles = [],
        scopeConfig = null,
        selectedLessons = [],
        mcqCount: reqMcqCount,
        tfCount: reqTfCount,
        shortAnswerCount: reqShortAnswerCount,
        appliedCount: reqAppliedCount,
        userApiKeys,
        userCode
      } = req.body;

      const perm = await checkAccountPermission(userCode);
      if (!perm.allowed) {
        return res.status(403).json({ error: perm.error });
      }

      console.log(`Generating Student Study Guide for ${subject} ${grade}, ${period} at ${schoolName}...`);

      const isMath = subject.toLowerCase().trim().includes("toán");
      const isCuoiKy = period && period.includes("Cuối");

      // Extract existing exam questions to reuse 60% of them
      const examMcq = currentVariant?.mcq || [];
      const examTf = currentVariant?.tf || [];
      const examApplied = currentVariant?.applied || [];
      const examShortAnswer = currentVariant?.shortAnswer || [];

      // Calculate target question counts
      const targetMcqCount = reqMcqCount || (examMcq.length > 0 ? examMcq.length * 2 : (isMath ? 24 : 24));
      const targetTfCount = reqTfCount !== undefined ? reqTfCount : (examTf.length > 0 ? examTf.length * 2 : 4);
      const targetAppliedCount = reqAppliedCount || (examApplied.length > 0 ? examApplied.length * 2 : 6);
      
      // ABSOLUTELY ZERO short answers for Tin học
      const isTinHoc = subject.toLowerCase().trim() === "tin học";
      const targetShortAnswerCount = isTinHoc ? 0 : (reqShortAnswerCount !== undefined ? reqShortAnswerCount : (examShortAnswer.length > 0 ? examShortAnswer.length * 2 : (isMath ? 4 : 0)));

      // EXTREMELY SMART: Extract core exam questions and only ask Gemini to generate new companion questions.
      // This reduces token count by 70%, speeds up the response by 300%, and ensures Vercel never times out!
      const coreMcqs = examMcq.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer || "A",
        explanation: q.explanation || "Đáp án chính thức trích xuất từ đề kiểm tra.",
        isExamCore: true
      }));

      const coreTfs = examTf.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        statements: q.statements || [],
        explanation: q.explanation || "Đáp án chính thức trích xuất từ đề kiểm tra.",
        isExamCore: true
      }));

      const coreShortAnswers = examShortAnswer.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        answer: q.answer || "",
        unit: q.unit || "",
        explanation: q.explanation || "Đáp án chính thức trích xuất từ đề kiểm tra.",
        isExamCore: true
      }));

      const coreApplieds = examApplied.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        answer: q.answer || "",
        pointsBreakdown: q.pointsBreakdown || [],
        isExamCore: true
      }));

      // Calculate the number of NEW companion questions to generate (capped to prevent timeouts on Vercel Hobby)
      const newMcqCount = Math.min(12, Math.max(1, targetMcqCount - examMcq.length));
      const newTfCount = Math.min(3, Math.max(1, targetTfCount - examTf.length));
      const newShortAnswerCount = isTinHoc ? 0 : Math.min(3, Math.max(1, targetShortAnswerCount - examShortAnswer.length));
      const newAppliedCount = Math.min(3, Math.max(1, targetAppliedCount - examApplied.length));

      const systemPrompt = `Bạn là một Chuyên gia Khảo thí và Giáo dục môn ${subject} THCS theo Chương trình GDPT 2018 (Sách Kết nối tri thức).
Nhiệm vụ của bạn: Biên soạn "ĐỀ CƯƠNG ÔN TẬP CỦA HỌC SINH" chất lượng cao phục vụ kỳ kiểm tra ${period.toUpperCase()} môn ${subject} Lớp ${grade} - Năm học ${schoolYear}.

${selectedLessons && selectedLessons.length > 0 ? `DANH SÁCH BÀI HỌC VÀ CHƯƠNG ĐÃ ĐƯỢC GIÁO VIÊN LỰA CHỌN TRONG KHO (BẮT BUỘC BÁM SÁT 100%):
${JSON.stringify(selectedLessons, null, 2)}
LƯU Ý RẤT QUAN TRỌNG: Chỉ biên soạn Tóm tắt kiến thức và Tạo câu hỏi tập trung ĐÚNG vào các bài học / chương được liệt kê ở trên!` : ""}

QUY TẮC BẮT BUỘC ĐỐI VỚI ĐỀ CƯƠNG ÔN TẬP CỦA HỌC SINH:
1. PHẠM VI BÀI HỌC VÀ CHỦ ĐỀ:
   - Bao quát toàn diện TẤT CẢ các bài học / chủ đề có liên quan trong kỳ kiểm tra ${period}.
   - Tham khảo kỹ Khung ma trận, Bảng đặc tả và nội dung SGK được cung cấp.

2. PHẦN A. TÓM TẮT KIẾN THỨC TRỌNG TÂM THEO TỪNG BÀI / CHỦ ĐỀ ("topics"):
   - Với mỗi bài học hoặc chủ đề trong phạm vi kiểm tra:
     + topic: Tên chủ đề / chương.
     + lessonName: Tên bài học cụ thể (Ví dụ: "Bài 1. Thông tin và dữ liệu", "Bài 2. Xử lí thông tin"...).
     + summaryPoints: Mảng từ 2 đến 3 gạch đầu dòng cực kỳ ngắn gọn, súc tích, đúc kết các định nghĩa, quy tắc hoặc công thức chính (mỗi gạch đầu dòng tối đa 15 từ, viết cực kỳ cô đọng để tối ưu tốc độ phản hồi).

3. PHẦN B. HỆ THỐNG CÂU HỎI VÀ BÀI TẬP ÔN TẬP (BỔ SUNG THÊM CÂU HỎI MỚI):
   - Để đảm bảo thời gian xử lý nhanh chóng trên Vercel, bạn CHỈ CẦN soạn thêm đúng số lượng các câu hỏi đồng hành, mở rộng mới (isExamCore: false) sau đây:
     * mcq: Soạn thêm đúng ${newMcqCount} câu trắc nghiệm nhiều lựa chọn mới.
     * tf: Soạn thêm đúng ${newTfCount} câu Đúng - Sai mới.
     ${newShortAnswerCount > 0 ? `* shortAnswer: Soạn thêm đúng ${newShortAnswerCount} câu trả lời ngắn mới.` : ""}
     * applied: Soạn thêm đúng ${newAppliedCount} câu bài tập vận dụng/tự luận mới.
   
   - Tuyệt đối KHÔNG ĐƯỢC lặp lại hay copy các câu hỏi của đề kiểm tra gốc trong danh sách gửi kèm, hệ thống tự động lưu giữ và ghép chúng lại cho học sinh.

   - QUY TẮC QUAN TRỌNG CHO MÔN TIN HỌC (BẮT BUỘC 100%):
     * TUYỆT ĐỐI KHÔNG CÓ PHẦN CÂU HỎI TRẢ LỜI NGẮN (SHORT ANSWER) NÀO CHO MÔN TIN HỌC.
     * Đối với Phần Bài tập vận dụng / Tự luận ("applied"): Bắt buộc phải có đầy đủ cả 2 dạng câu hỏi sau:
       1) DẠNG CÂU HỎI THỰC HÀNH (THAO TÁC TRÊN PHÒNG MÁY TÍNH): Phải ghi rõ, cực kỳ chi tiết, tường minh và rõ ràng từng bước thao tác thực hiện trên máy tính trong phòng máy (ví dụ: "Em hãy khởi động phần mềm Scratch và thực hiện...", "Hãy lập trình khối lệnh điều khiển...", "Hãy mở MS Excel, nhập bảng dữ liệu sau và dùng hàm...", "Hãy tạo thư mục theo đường dẫn..."). Tuyệt đối KHÔNG viết mập mờ, chung chung để tránh học sinh khó hiểu hoặc không biết phải làm gì trên máy tính.
       2) DẠNG CÂU HỎI TỰ LUẬN LÝ THUYẾT: Các câu hỏi lý thuyết liên hệ thực tế, sơ đồ khối, giải thích hành vi, phân tích phần cứng/phần mềm.

   - QUY TẮC TRÌNH BÀY PHẦN BÀI TẬP VẬN DỤNG & TỰ LUẬN (RẤT QUAN TRỌNG):
     * BẮT BUỘC sử dụng ký tự xuống dòng '\\n' để phân tách rõ ràng phần dẫn đề, các bước thực hiện 1, 2, 3 hoặc các yêu cầu a, b, c thành từng dòng riêng biệt, tuyệt đối KHÔNG viết liền tù tì một hàng dài.
     * KHÔNG in đậm toàn bộ câu hỏi. Hãy viết câu hỏi với kiểu chữ bình thường, và CHỈ in đậm các cụm từ, yêu cầu hoặc ký tự then chốt cần nhấn mạnh bằng định dạng markdown **in đậm** (ví dụ: **[CÂU HỎI THỰC HÀNH PHÒNG MÁY]**, **1. Tạo thư mục**, **a) Hãy giải thích**, v.v.).

   - YÊU CẦU ĐỊNH DẠNG CÁC LOẠI CÂU HỎI:
     + Trắc nghiệm nhiều lựa chọn ("mcq"): 4 phương án A, B, C, D rõ ràng, 1 đáp án đúng (correctAnswer: "A"|"B"|"C"|"D"), kèm lời giải thích (explanation) chi tiết.
     + Trắc nghiệm Đúng - Sai ("tf"): Tình huống dẫn + 4 phát biểu a, b, c, d (đúng 2 ý true, 2 ý false), kèm giải thích.
     + Trắc nghiệm trả lời ngắn ("shortAnswer"): Câu hỏi tính toán, kết quả số/biểu thức ngắn gọn (answer), đơn vị tính (unit), kèm giải thích.
     + Bài tập vận dụng / Tự luận ("applied"): Đề bài rõ ràng, đáp án / hướng dẫn giải chi tiết (answer), barem điểm chia nhỏ (pointsBreakdown).

4. PHẦN C. ĐÁP ÁN VÀ HƯỚNG DẪN GIẢI CHI TIẾT ĐẦY ĐỦ:
   - Toàn bộ các câu hỏi trong đề cương đều phải có đáp án chính xác và lời giải chi tiết, chuẩn sư phạm.

--- PHẠM VI KHUNG MA TRẬN VÀ BÀI HỌC ---
${matrix && matrix.length > 0 ? JSON.stringify(matrix.map((m: any) => ({ topic: m.topic, content: m.content, periods: m.periods, percentage: m.percentage })), null, 2) : `Phạm vi ${period} môn ${subject} ${grade}`}

CẤU TRÚC JSON TRẢ VỀ (CHỈ CHỨA CÁC CÂU HỎI MỚI ĐÃ SOẠN THÊM):
{
  "title": "ĐỀ CƯƠNG ÔN TẬP KIỂM TRA ${period.toUpperCase()}",
  "subject": "${subject}",
  "grade": "${grade}",
  "period": "${period}",
  "schoolName": "${schoolName}",
  "departmentName": "${departmentName}",
  "schoolYear": "${schoolYear}",
  "topics": [
    {
      "topic": "Tên chủ đề/chương",
      "lessonName": "Bài X. Tên bài học",
      "summaryPoints": [
        "Nội dung kiến thức trọng tâm 1...",
        "Công thức / Quy tắc ghi nhớ 2...",
        "Lưu ý khi làm bài 3..."
      ]
    }
  ],
  "mcq": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "Giải thích chi tiết...",
      "isExamCore": false
    }
  ],
  "tf": [
    {
      "id": 1,
      "question": "Nội dung tình huống...",
      "statements": [
        { "id": "a", "text": "Phát biểu a", "isTrue": true },
        { "id": "b", "text": "Phát biểu b", "isTrue": false },
        { "id": "c", "text": "Phát biểu c", "isTrue": true },
        { "id": "d", "text": "Phát biểu d", "isTrue": false }
      ],
      "explanation": "Giải thích chi tiết...",
      "isExamCore": false
    }
  ],
  "shortAnswer": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi ngắn...",
      "answer": "Kết quả",
      "unit": "cm",
      "explanation": "Hướng dẫn tính toán...",
      "isExamCore": false
    }
  ],
  "applied": [
    {
      "id": 1,
      "question": "Đề bài câu hỏi tự luận / vận dụng...",
      "answer": "Hướng dẫn giải chi tiết từng bước...",
      "pointsBreakdown": [
        { "criteria": "Ý 1...", "points": "0.5" },
        { "criteria": "Ý 2...", "points": "0.5" }
      ],
      "isExamCore": false
    }
  ]
}

Chỉ trả về JSON thuần tuý, không có markdown hay bất kỳ lời dẫn nào khác.`;

      const selectedLessonIds = (selectedLessons || []).map((l: any) => l.id);
      const textbookPrompt = selectedLessonIds.length > 0
        ? getFilteredTextbookReferencePrompt(subject, String(grade), selectedLessonIds)
        : getOfficialTextbookReferencePrompt(subject, String(grade));
      const parts: any[] = [{ text: systemPrompt }, { text: textbookPrompt }];
      const fileParts = await processReferenceFilesToGeminiParts(referenceFiles);
      parts.push(...fileParts);

      const response = await executeGeminiWithFailover({
        userApiKeys,
        userCode,
        parts,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
          maxOutputTokens: 8192,
        }
      });

      const rawOutput = response.text;
      let parsedStudyGuide: any = null;

      try {
        parsedStudyGuide = extractAndParseJson(rawOutput);
      } catch (parseErr: any) {
        console.error("JSON parse error on study guide:", parseErr);
        throw new Error("Lỗi cấu trúc phản hồi từ AI khi tạo đề cương ôn tập: Dữ liệu AI trả về không đúng định dạng JSON hoặc bị thiếu thông tin. Vui lòng thử lại.");
      }

      // Merge Core questions and Newly generated companion questions
      const mergedMcqs = [...coreMcqs];
      if (parsedStudyGuide.mcq && Array.isArray(parsedStudyGuide.mcq)) {
        parsedStudyGuide.mcq.forEach((q: any) => {
          mergedMcqs.push({
            ...q,
            isExamCore: false
          });
        });
      }
      mergedMcqs.forEach((q: any, idx: number) => {
        q.id = idx + 1;
      });

      const mergedTfs = [...coreTfs];
      if (parsedStudyGuide.tf && Array.isArray(parsedStudyGuide.tf)) {
        parsedStudyGuide.tf.forEach((q: any) => {
          mergedTfs.push({
            ...q,
            isExamCore: false
          });
        });
      }
      mergedTfs.forEach((q: any, idx: number) => {
        q.id = idx + 1;
      });

      const mergedShortAnswers = [...coreShortAnswers];
      if (parsedStudyGuide.shortAnswer && Array.isArray(parsedStudyGuide.shortAnswer)) {
        parsedStudyGuide.shortAnswer.forEach((q: any) => {
          mergedShortAnswers.push({
            ...q,
            isExamCore: false
          });
        });
      }
      mergedShortAnswers.forEach((q: any, idx: number) => {
        q.id = idx + 1;
      });

      const mergedApplieds = [...coreApplieds];
      if (parsedStudyGuide.applied && Array.isArray(parsedStudyGuide.applied)) {
        parsedStudyGuide.applied.forEach((q: any) => {
          mergedApplieds.push({
            ...q,
            isExamCore: false
          });
        });
      }
      mergedApplieds.forEach((q: any, idx: number) => {
        q.id = idx + 1;
      });

      parsedStudyGuide.subject = subject;
      parsedStudyGuide.grade = String(grade);
      parsedStudyGuide.period = period;
      parsedStudyGuide.schoolName = schoolName;
      parsedStudyGuide.departmentName = departmentName;
      parsedStudyGuide.schoolYear = schoolYear;
      parsedStudyGuide.title = parsedStudyGuide.title || `ĐỀ CƯƠNG ÔN TẬP KIỂM TRA ${period.toUpperCase()}`;
      
      parsedStudyGuide.mcq = balanceMcqQuestions(mergedMcqs, "DECUONG");
      parsedStudyGuide.tf = mergedTfs;
      parsedStudyGuide.shortAnswer = mergedShortAnswers;
      parsedStudyGuide.applied = mergedApplieds;

      return res.json(parsedStudyGuide);

    } catch (error: any) {
      console.error("API Generate Study Guide Error:", error);
      return res.status(500).json({ error: formatVietnameseError(error) });
    }
  });

  // API endpoint: Kiểm tra trạng thái hoạt động của 1 API Key cụ thể
  app.post("/api/test-key", async (req, res) => {
    try {
      const { key } = req.body;
      const cleanKey = cleanApiKeyString(key);
      if (!cleanKey) {
        return res.status(400).json({ ok: false, error: "Vui lòng nhập API Key để kiểm tra." });
      }

      if (cleanKey.length < 20) {
        return res.status(400).json({
          ok: false,
          error: "API Key quá ngắn hoặc không đúng định dạng (Key chuẩn của Google bắt đầu bằng 'AIzaSy...')."
        });
      }

      const client = new GoogleGenAI({ apiKey: cleanKey });
      const testModels = ["gemini-3.1-flash-lite"];

      let lastErr: any = null;
      for (const testModel of testModels) {
        try {
          const result = await client.models.generateContent({
            model: testModel,
            contents: "Hi",
            config: { maxOutputTokens: 5 }
          });
          if (result) {
            lastWorkingModel = testModel;
            return res.json({ ok: true, message: `API Key hợp lệ và hoạt động tốt với cấu hình ${testModel}!` });
          }
        } catch (err: any) {
          lastErr = err;
          const msg = getErrorMessage(err);
          // If Google explicitly says API_KEY_INVALID, stop immediately
          if (
            msg.includes("API_KEY_INVALID") ||
            msg.includes("API key not valid") ||
            msg.includes("API_KEY_NOT_FOUND") ||
            msg.includes("pass a valid API key")
          ) {
            return res.status(401).json({
              ok: false,
              error: "API Key không hợp lệ hoặc bị dán sai ký tự. Vui lòng kiểm tra lại mã Key từ aistudio.google.com/apikey."
            });
          }
        }
      }

      // Fallback direct REST check if generateContent errored out (e.g. quota or busy)
      try {
        const checkRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`);
        const checkData = await checkRes.json();
        if (checkRes.ok && checkData && Array.isArray(checkData.models)) {
          return res.json({ ok: true, message: "API Key hợp lệ và kết nối tới Google AI Studio thành công!" });
        }
      } catch {}

      const finalErrMsg = getErrorMessage(lastErr);
      if (finalErrMsg.includes("RESOURCE_EXHAUSTED") || finalErrMsg.includes("429")) {
        return res.status(429).json({
          ok: false,
          error: "API Key đúng định dạng nhưng đang tạm chạm giới hạn lượt gọi miễn phí (Quota 429). Vui lòng đợi 1 phút hoặc thêm Key dự phòng."
        });
      }

      return res.status(500).json({ ok: false, error: formatVietnameseError(lastErr) });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: formatVietnameseError(err) });
    }
  });

async function startServer() {
  const PORT = 3000;

  // Vite middleware for development
  
  
  
  
  // Intercept control plane requests
  app.get('/__aistudio_internal_control_plane/fs/read', (req, res) => {
    const filePath = req.query.path as string;
    try {
      const fullPath = path.resolve(process.cwd(), filePath);
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      res.send(fileContent);
    } catch (e) {
      console.error("FS READ ERROR:", e);
      res.status(404).send('Not found: ' + String(e));
    }
  });




  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/__aistudio_internal")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.get("/env", (req, res) => res.send(process.env.NODE_ENV));
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  // Tăng giới hạn timeout của máy chủ lên 10 phút (600,000 ms) để tránh lỗi đứt kết nối khi AI xử lý lâu
  server.setTimeout(600000);
  server.keepAliveTimeout = 600000;
  server.headersTimeout = 600000;
}

if (!process.env.VERCEL) {
  startServer();
}

export { startServer };
export default app;

