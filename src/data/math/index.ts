import { TextbookGrade } from "../textbooks";
import { MATH_TEXTBOOK_GRADE_6 } from "./mathGrade6";
import { MATH_TEXTBOOK_GRADE_7 } from "./mathGrade7";
import { MATH_TEXTBOOK_GRADE_8 } from "./mathGrade8";
import { MATH_TEXTBOOK_GRADE_9 } from "./mathGrade9";

export {
  MATH_TEXTBOOK_GRADE_6,
  MATH_TEXTBOOK_GRADE_7,
  MATH_TEXTBOOK_GRADE_8,
  MATH_TEXTBOOK_GRADE_9
};

export const ALL_MATH_TEXTBOOKS: Record<string, TextbookGrade> = {
  "6": MATH_TEXTBOOK_GRADE_6,
  "7": MATH_TEXTBOOK_GRADE_7,
  "8": MATH_TEXTBOOK_GRADE_8,
  "9": MATH_TEXTBOOK_GRADE_9
};

export function getMathTextbookByGrade(grade: string): TextbookGrade {
  return ALL_MATH_TEXTBOOKS[grade] || MATH_TEXTBOOK_GRADE_6;
}
