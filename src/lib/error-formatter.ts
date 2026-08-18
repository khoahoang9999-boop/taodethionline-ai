export function getErrorMessage(err: any): string {
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
 * Utility to format all system errors and raw API exceptions
 * into short, friendly, easy-to-understand Vietnamese error messages.
 */
export function formatVietnameseError(err: any): string {
  const rawMsg = getErrorMessage(err);
  let msg = rawMsg.replace(/^(Error|Lỗi):\s*/i, "").trim();

  if (!msg) {
    return "Đã xảy ra lỗi không xác định. Vui lòng kiểm tra lại kết nối và thử lại.";
  }

  // Rate limits / Quota
  if (
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("Quota exceeded")
  ) {
    return "API Key đã hết hạn mức lượt gọi. Vui lòng thử lại sau hoặc kiểm tra Cài đặt API Key.";
  }

  // Invalid Key / Authorization
  if (
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("Unauthorized") ||
    msg.includes("UNAUTHENTICATED") ||
    msg.includes("authentication credentials") ||
    msg.includes("OAuth 2") ||
    msg.includes("401") ||
    msg.includes("403") ||
    msg.includes("invalid API key")
  ) {
    return "API Key không hợp lệ hoặc đã bị khóa. Vui lòng kiểm tra lại Key trong phần Cài đặt API Key.";
  }

  // Server Busy / Service Unavailable
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

  // Network Failure
  if (
    msg.includes("fetch failed") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("NetworkError") ||
    msg.includes("Failed to fetch")
  ) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra đường truyền internet và thử lại.";
  }

  // JSON Parsing Issue
  if (
    msg.includes("JSON") ||
    msg.includes("SyntaxError") ||
    msg.includes("parse") ||
    msg.includes("Unexpected token")
  ) {
    return "Dữ liệu trả về chưa hoàn chỉnh do đường truyền gián đoạn. Vui lòng thử lại.";
  }

  // Timeout
  if (msg.includes("TIMEOUT") || msg.includes("timed out") || msg.includes("deadline")) {
    return "Thời gian xử lý quá lâu. Vui lòng thử lại.";
  }

  // If already clean Vietnamese (contains diacritics)
  const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(msg);
  if (hasVietnamese && msg.length < 200) {
    return msg;
  }

  return `Lỗi hệ thống AI: ${msg.length > 150 ? msg.slice(0, 150) + "..." : msg}`;
}

