/**
 * Utility functions for matrix calculations and percentage normalization.
 */

export interface MatrixRowLike {
  topic: string;
  content: string;
  periods?: number;
  percentage?: number;
  halfGroup?: "firstHalf" | "secondHalf" | string;
  [key: string]: any;
}

/**
 * Calculates balanced percentages for matrix rows based on `periods`
 * using the Largest Remainder Method (Hamilton/Hare-Niemeyer method).
 * Guarantees that the sum of percentages equals EXACTLY targetTotal (100.0% or 30.0%/70.0%).
 */
export function calculateBalancedPercentages(periodsList: number[], targetTotal: number = 100): number[] {
  if (!periodsList || periodsList.length === 0) return [];
  
  const totalPeriods = periodsList.reduce((a, b) => a + (Number(b) || 0), 0);
  if (totalPeriods <= 0) {
    const avg = Number((targetTotal / periodsList.length).toFixed(2));
    return periodsList.map(() => avg);
  }

  // Scale by 100 for 2 decimal places precision
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

/**
 * Normalizes all row percentages in a matrix so that total percentage is EXACTLY 100%.
 */
export function normalizeMatrixPercentages<T extends MatrixRowLike>(
  matrix: T[],
  isFinalExam: boolean = false
): T[] {
  if (!matrix || matrix.length === 0) return matrix;

  if (isFinalExam) {
    const firstHalfItems = matrix.filter(r => r.halfGroup === "firstHalf");
    const secondHalfItems = matrix.filter(r => r.halfGroup === "secondHalf");

    if (firstHalfItems.length > 0 && secondHalfItems.length > 0) {
      const firstHalfPerc = calculateBalancedPercentages(firstHalfItems.map(r => r.periods || 2), 30);
      const secondHalfPerc = calculateBalancedPercentages(secondHalfItems.map(r => r.periods || 2), 70);

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
  const balancedPerc = calculateBalancedPercentages(periodsList, 100);

  return matrix.map((row, idx) => ({
    ...row,
    percentage: balancedPerc[idx]
  }));
}
