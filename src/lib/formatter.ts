/**
 * Helper utility to split and format essay / practical / applied questions
 * and answer guidelines into structured lines and paragraphs.
 */

export interface ParsedAppliedQuestion {
  firstLine: string;
  subLines: string[];
  hasSubItems: boolean;
  rawLines: string[];
}

export function parseAppliedQuestion(questionText: string): ParsedAppliedQuestion {
  if (!questionText) {
    return { firstLine: "", subLines: [], hasSubItems: false, rawLines: [] };
  }

  let text = questionText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Insert newline before lowercase sub-item letters: a), b), c), d), e) or a., b., c.
  text = text.replace(/([^\n])\s+([a-e][\.\)])\s+/g, (m, p1, p2) => p1 + "\n" + p2 + " ");

  // Insert newline before numbered items like 1., 2. when preceded by non-newline characters
  text = text.replace(/([^\n(:])\s+([1-9]\.\s+)/g, (m, p1, p2) => p1 + "\n" + p2);

  const rawLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) {
    return { firstLine: questionText, subLines: [], hasSubItems: false, rawLines: [questionText] };
  }

  // A question has sub-items if there are multiple lines and lines start with a), b), 1., -, + etc.
  const hasSubItemMarker = rawLines.slice(1).some((line) =>
    /^[a-e][\.\)]|^[1-9][\.\)]|^[\-\+\*•]/.test(line)
  ) || /^[a-e][\.\)]/.test(rawLines[0]);

  const hasSubItems = rawLines.length > 1 && hasSubItemMarker;

  let firstLine = rawLines[0] || "";
  // Strip obsolete prefix tags like "(Lý thuyết):" or "(Thực hành):" if present
  firstLine = firstLine.replace(/^\((?:Lý\s*thuyết|Thực\s*hành)(?:\s*-\s*[0-9]+(?:,[0-9]+)?\s*điểm)?\)\s*[:\-]?\s*/i, "");

  return {
    firstLine,
    subLines: rawLines.slice(1),
    hasSubItems,
    rawLines,
  };
}

export function formatAppliedQuestionLines(questionText: string): string[] {
  return parseAppliedQuestion(questionText).rawLines;
}

/**
 * Split essay / practical answer into structured, clean lines.
 * Handles sub-bullets (- , + , •, *), letters (a), b)), and numbered lists (1., 2.).
 */
export function formatAnswerLines(answerText: string): string[] {
  if (!answerText) return [];

  let text = answerText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Insert newline before sub-item letters: a), b), c), d), e)
  text = text.replace(/([^\n])\s+([a-eA-E][\.\)])\s+/g, (m, p1, p2) => p1 + "\n" + p2 + " ");

  // Insert newline before main dashes "- "
  text = text.replace(/([^\n])\s+([\-•])\s+/g, (m, p1) => p1 + "\n- ");

  // Insert newline before plus signs "+ "
  text = text.replace(/([^\n])\s+([\+])\s+/g, (m, p1) => p1 + "\n+ ");

  // Insert newline before numbered items like "1. ", "2. "
  text = text.replace(/([^\n(:])\s+([1-9]\.\s+)/g, (m, p1, p2) => p1 + "\n+ " + p2);
  text = text.replace(/([:;])\s*([1-9]\.\s+)/g, (m, p1, p2) => p1 + "\n+ " + p2);

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : [answerText];
}

