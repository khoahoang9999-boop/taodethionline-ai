/**
 * Generate a device ID based on hardware/OS characteristics.
 * This helps identify the same physical machine even across different browsers.
 */

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("KhaoThi,TinHocGDPT", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("KhaoThi,TinHocGDPT", 4, 17);
    return canvas.toDataURL();
  } catch (e) {
    return "";
  }
}

function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      // @ts-ignore
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        // @ts-ignore
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch (e) {}
  return "unknown_gpu";
}

export function getDeviceId(): string {
  try {
    // 1. Collect stable hardware/OS indicators that don't change across browsers on the same PC
    // Removing screenRes because it changes heavily based on browser zoom levels!
    const colorDepth = window.screen.colorDepth;
    const cores = navigator.hardwareConcurrency || "unknown";
    // @ts-ignore
    const ram = navigator.deviceMemory || "unknown";
    
    // 2. Extract OS from UserAgent
    let osInfo = "unknown_os";
    const ua = navigator.userAgent;
    if (ua.includes("Windows NT 10.0")) osInfo = "Win10/11";
    else if (ua.includes("Windows NT 6.3")) osInfo = "Win8.1";
    else if (ua.includes("Windows NT 6.2")) osInfo = "Win8";
    else if (ua.includes("Windows NT 6.1")) osInfo = "Win7";
    else if (ua.includes("Mac OS X")) {
      const match = ua.match(/Mac OS X ([0-9_]+)/);
      if (match) osInfo = `Mac_${match[1]}`;
    }
    else if (ua.includes("Linux")) osInfo = "Linux";
    
    // 3. Collect timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown_tz";
    
    // 4. Advanced: GPU & Canvas Fingerprinting
    const gpu = getWebGLFingerprint();
    const canvasData = getCanvasFingerprint();

    // 5. Combine into a raw fingerprint string
    const rawFingerprint = `${osInfo}_${cores}_${ram}_${colorDepth}_${timezone}_${gpu}_${canvasData}`;
    
    // 6. Hash the string to a short ID
    let hash = 0;
    for (let i = 0; i < rawFingerprint.length; i++) {
      const char = rawFingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    const fingerprintId = `pc_${Math.abs(hash).toString(36)}`;
    
    // We still save to localStorage so it stays perfectly stable within the same browser
    const STORAGE_KEY = "khaothi_tinhoc_device_id";
    // Overwrite any old random IDs with the stable fingerprint ID so cross-browser matches
    localStorage.setItem(STORAGE_KEY, fingerprintId);
    
    return fingerprintId;
  } catch {
    // Fallback for strict privacy modes
    return `dev_session_${Date.now()}`;
  }
}
