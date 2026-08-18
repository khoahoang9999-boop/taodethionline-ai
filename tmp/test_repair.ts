function repairJson(raw: string): any {
  if (!raw || !raw.trim()) return null;
  let text = raw.trim();

  // Strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  // Replace smart quotes
  text = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  // Direct parse attempt
  try {
    return JSON.parse(text);
  } catch {}

  // Sanitize control characters (unescaped newlines / tabs inside JSON strings)
  let sanitized = text.replace(/[\u0000-\u001F]+/g, (m) => {
    if (m === "\n") return "\\n";
    if (m === "\r") return "\\r";
    if (m === "\t") return "\\t";
    return " ";
  });

  try {
    return JSON.parse(sanitized);
  } catch {}

  // Remove trailing commas before } or ]
  sanitized = sanitized.replace(/,\s*([}\]])/g, "$1");
  try {
    return JSON.parse(sanitized);
  } catch {}

  // Auto-close truncated JSON (if response was cut off near token limit)
  let openBrackets = 0;
  let openBraces = 0;
  let inStr = false;
  let esc = false;

  for (let i = 0; i < sanitized.length; i++) {
    const c = sanitized[i];
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

  let repaired = sanitized;
  if (inStr) repaired += '"';
  repaired = repaired.replace(/,\s*$/, "");
  while (openBrackets > 0) {
    repaired += "]";
    openBrackets--;
  }
  while (openBraces > 0) {
    repaired += "}";
    openBraces--;
  }

  try {
    return JSON.parse(repaired);
  } catch {}

  return null;
}

const input1 = '{"title": "Test", "items": [{"id": 1, "name": "Item 1\nwith newline"';
console.log("REPAIRED 1:", repairJson(input1));

const input2 = '{"title": "Test", "items": [{"id": 1, "name": "Item 1"},],}';
console.log("REPAIRED 2:", repairJson(input2));
