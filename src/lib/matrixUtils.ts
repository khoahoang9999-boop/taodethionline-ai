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

function adjustArraySum(arr: number[], target: number, allowedIndices?: number[]): number[] {
  const res = arr.map(v => Math.max(0, Math.round(Number(v) || 0)));
  if (res.length === 0) return res;
  const indices = allowedIndices && allowedIndices.length > 0
    ? allowedIndices
    : res.map((_, i) => i);
  let sum = res.reduce((a, b) => a + b, 0);
  let ptr = 0;
  let guard = 0;
  while (sum < target && guard < 200) {
    const idx = indices[ptr % indices.length];
    res[idx] += 1;
    sum += 1;
    ptr += 1;
    guard += 1;
  }
  ptr = indices.length - 1;
  while (sum > target && guard < 400) {
    const idx = indices[((ptr % indices.length) + indices.length) % indices.length];
    if (res[idx] > 0) {
      res[idx] -= 1;
      sum -= 1;
    }
    ptr -= 1;
    guard += 1;
  }
  return res;
}

/**
 * Normalizes all row percentages in a matrix so that total percentage is EXACTLY 100%,
 * and ensures Tin học question counts sum to 8 MCQ NB, 4 MCQ TH, 8 TF NB, 8 TF TH, 3 TL VD (16 NB, 12 TH, 3 VD).
 */
export function normalizeMatrixPercentages<T extends MatrixRowLike>(
  matrix: T[],
  isFinalExam: boolean = false
): T[] {
  if (!matrix || matrix.length === 0) return matrix;

  const isMath = matrix.some(
    r =>
      (Number(r.sa_nb) || 0) > 0 ||
      (Number(r.sa_th) || 0) > 0 ||
      (Number(r.sa_vd) || 0) > 0 ||
      String(r.topic || "").toLowerCase().includes("chương")
  );

  let normalizedRows = matrix.map(r => ({ ...r }));

  if (!isMath) {
    const mcqNbList = adjustArraySum(normalizedRows.map(r => Number(r.mcq_nb) || 0), 8);
    const mcqThList = adjustArraySum(normalizedRows.map(r => Number(r.mcq_th) || 0), 4);
    const tfNbList = adjustArraySum(normalizedRows.map(r => Number(r.tf_nb) || 0), 8);
    const tfThList = adjustArraySum(normalizedRows.map(r => Number(r.tf_th) || 0), 8);
    const tlVdList = adjustArraySum(normalizedRows.map(r => Number(r.tl_vd) || 0), 3);

    normalizedRows = normalizedRows.map((r, idx) => {
      const mcq_nb = mcqNbList[idx];
      const mcq_th = mcqThList[idx];
      const tf_nb = tfNbList[idx];
      const tf_th = tfThList[idx];
      const tl_vd = tlVdList[idx];
      const total_nb = mcq_nb + tf_nb;
      const total_th = mcq_th + tf_th;
      const total_vd = tl_vd;
      const totalPoints = Number((total_nb * 0.25 + total_th * 0.25 + total_vd * 1.0).toFixed(2));
      return {
        ...r,
        mcq_nb,
        mcq_th,
        mcq_vd: 0,
        tf_nb,
        tf_th,
        tf_vd: 0,
        tl_nb: 0,
        tl_th: 0,
        tl_vd,
        total_nb,
        total_th,
        total_vd,
        totalPoints
      };
    });
  }

  if (isFinalExam) {
    const firstHalfItems = normalizedRows.filter(r => r.halfGroup === "firstHalf");
    const secondHalfItems = normalizedRows.filter(r => r.halfGroup === "secondHalf");

    if (firstHalfItems.length > 0 && secondHalfItems.length > 0) {
      const firstHalfPerc = calculateBalancedPercentages(firstHalfItems.map(r => r.periods || 2), 30);
      const secondHalfPerc = calculateBalancedPercentages(secondHalfItems.map(r => r.periods || 2), 70);

      let firstIdx = 0;
      let secondIdx = 0;

      return normalizedRows.map(row => {
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

  const periodsList = normalizedRows.map(r => Number(r.periods) || 2);
  const balancedPerc = calculateBalancedPercentages(periodsList, 100);

  return normalizedRows.map((row, idx) => ({
    ...row,
    percentage: balancedPerc[idx]
  }));
}
