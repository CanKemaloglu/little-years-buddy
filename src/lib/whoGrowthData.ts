// WHO Child Growth Standards - LMS Data (0-60 months)
// Source: WHO Multicentre Growth Reference Study Group
// L (power in Box-Cox transformation), M (median), S (coefficient of variation)

interface LMSData {
  ageMonths: number;
  L: number;
  M: number;
  S: number;
}

// Weight-for-age (0-60 months) - Boys
export const weightForAgeBoys: LMSData[] = [
  { ageMonths: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
  { ageMonths: 1, L: 0.2297, M: 4.4709, S: 0.13395 },
  { ageMonths: 2, L: 0.197, M: 5.5675, S: 0.12385 },
  { ageMonths: 3, L: 0.1738, M: 6.3762, S: 0.11727 },
  { ageMonths: 4, L: 0.1553, M: 7.0023, S: 0.11316 },
  { ageMonths: 5, L: 0.1395, M: 7.5105, S: 0.1108 },
  { ageMonths: 6, L: 0.1257, M: 7.934, S: 0.10958 },
  { ageMonths: 7, L: 0.1134, M: 8.297, S: 0.10902 },
  { ageMonths: 8, L: 0.1021, M: 8.6151, S: 0.10882 },
  { ageMonths: 9, L: 0.0917, M: 8.9014, S: 0.10881 },
  { ageMonths: 10, L: 0.082, M: 9.1649, S: 0.10891 },
  { ageMonths: 11, L: 0.0730, M: 9.4122, S: 0.10906 },
  { ageMonths: 12, L: 0.0644, M: 9.6479, S: 0.10925 },
  { ageMonths: 15, L: 0.0430, M: 10.3002, S: 0.10949 },
  { ageMonths: 18, L: 0.0250, M: 10.9000, S: 0.10980 },
  { ageMonths: 21, L: 0.0100, M: 11.4700, S: 0.11010 },
  { ageMonths: 24, L: -0.0050, M: 12.0200, S: 0.11040 },
  { ageMonths: 30, L: -0.0300, M: 13.0500, S: 0.11100 },
  { ageMonths: 36, L: -0.0500, M: 14.0000, S: 0.11160 },
  { ageMonths: 42, L: -0.0650, M: 14.9500, S: 0.11230 },
  { ageMonths: 48, L: -0.0800, M: 15.9000, S: 0.11300 },
  { ageMonths: 54, L: -0.0900, M: 16.8500, S: 0.11370 },
  { ageMonths: 60, L: -0.1000, M: 17.8000, S: 0.11440 },
];

// Weight-for-age (0-60 months) - Girls
export const weightForAgeGirls: LMSData[] = [
  { ageMonths: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
  { ageMonths: 1, L: 0.1714, M: 4.1873, S: 0.13724 },
  { ageMonths: 2, L: 0.0962, M: 5.1282, S: 0.12960 },
  { ageMonths: 3, L: 0.0402, M: 5.8458, S: 0.12619 },
  { ageMonths: 4, L: -0.0050, M: 6.4237, S: 0.12402 },
  { ageMonths: 5, L: -0.0430, M: 6.8985, S: 0.12274 },
  { ageMonths: 6, L: -0.0760, M: 7.297, S: 0.12204 },
  { ageMonths: 7, L: -0.1050, M: 7.6422, S: 0.12178 },
  { ageMonths: 8, L: -0.1310, M: 7.9487, S: 0.12181 },
  { ageMonths: 9, L: -0.1550, M: 8.2254, S: 0.12199 },
  { ageMonths: 10, L: -0.1770, M: 8.4800, S: 0.12223 },
  { ageMonths: 11, L: -0.1970, M: 8.7192, S: 0.12247 },
  { ageMonths: 12, L: -0.2160, M: 8.9481, S: 0.12268 },
  { ageMonths: 15, L: -0.2600, M: 9.5200, S: 0.12310 },
  { ageMonths: 18, L: -0.3000, M: 10.0700, S: 0.12350 },
  { ageMonths: 21, L: -0.3350, M: 10.6000, S: 0.12400 },
  { ageMonths: 24, L: -0.3650, M: 11.1200, S: 0.12450 },
  { ageMonths: 30, L: -0.4100, M: 12.1000, S: 0.12550 },
  { ageMonths: 36, L: -0.4450, M: 13.0500, S: 0.12660 },
  { ageMonths: 42, L: -0.4700, M: 14.0000, S: 0.12780 },
  { ageMonths: 48, L: -0.4900, M: 14.9500, S: 0.12900 },
  { ageMonths: 54, L: -0.5050, M: 15.9000, S: 0.13030 },
  { ageMonths: 60, L: -0.5150, M: 16.8500, S: 0.13160 },
];

// Length/Height-for-age (0-60 months) - Boys
export const heightForAgeBoys: LMSData[] = [
  { ageMonths: 0, L: 1, M: 49.8842, S: 0.03795 },
  { ageMonths: 1, L: 1, M: 54.7244, S: 0.03557 },
  { ageMonths: 2, L: 1, M: 58.4249, S: 0.03424 },
  { ageMonths: 3, L: 1, M: 61.4292, S: 0.03328 },
  { ageMonths: 4, L: 1, M: 63.886, S: 0.03257 },
  { ageMonths: 5, L: 1, M: 65.9026, S: 0.03204 },
  { ageMonths: 6, L: 1, M: 67.6236, S: 0.03165 },
  { ageMonths: 7, L: 1, M: 69.1645, S: 0.03139 },
  { ageMonths: 8, L: 1, M: 70.5994, S: 0.03124 },
  { ageMonths: 9, L: 1, M: 71.9687, S: 0.03117 },
  { ageMonths: 10, L: 1, M: 73.2812, S: 0.03118 },
  { ageMonths: 11, L: 1, M: 74.5388, S: 0.03125 },
  { ageMonths: 12, L: 1, M: 75.7488, S: 0.03137 },
  { ageMonths: 15, L: 1, M: 79.0000, S: 0.03175 },
  { ageMonths: 18, L: 1, M: 82.0000, S: 0.03220 },
  { ageMonths: 21, L: 1, M: 84.7000, S: 0.03265 },
  { ageMonths: 24, L: 1, M: 87.1000, S: 0.03310 },
  { ageMonths: 30, L: 1, M: 91.3000, S: 0.03390 },
  { ageMonths: 36, L: 1, M: 95.1000, S: 0.03460 },
  { ageMonths: 42, L: 1, M: 98.6000, S: 0.03520 },
  { ageMonths: 48, L: 1, M: 102.0000, S: 0.03570 },
  { ageMonths: 54, L: 1, M: 105.1000, S: 0.03620 },
  { ageMonths: 60, L: 1, M: 108.0000, S: 0.03660 },
];

// Length/Height-for-age (0-60 months) - Girls
export const heightForAgeGirls: LMSData[] = [
  { ageMonths: 0, L: 1, M: 49.1477, S: 0.0379 },
  { ageMonths: 1, L: 1, M: 53.6872, S: 0.0364 },
  { ageMonths: 2, L: 1, M: 57.0673, S: 0.0352 },
  { ageMonths: 3, L: 1, M: 59.8029, S: 0.0342 },
  { ageMonths: 4, L: 1, M: 62.0899, S: 0.0335 },
  { ageMonths: 5, L: 1, M: 64.0301, S: 0.0329 },
  { ageMonths: 6, L: 1, M: 65.7311, S: 0.0324 },
  { ageMonths: 7, L: 1, M: 67.2873, S: 0.0321 },
  { ageMonths: 8, L: 1, M: 68.7498, S: 0.0318 },
  { ageMonths: 9, L: 1, M: 70.1435, S: 0.0316 },
  { ageMonths: 10, L: 1, M: 71.4818, S: 0.0315 },
  { ageMonths: 11, L: 1, M: 72.771, S: 0.0314 },
  { ageMonths: 12, L: 1, M: 74.015, S: 0.0314 },
  { ageMonths: 15, L: 1, M: 77.2000, S: 0.0316 },
  { ageMonths: 18, L: 1, M: 80.1000, S: 0.0319 },
  { ageMonths: 21, L: 1, M: 82.8000, S: 0.0323 },
  { ageMonths: 24, L: 1, M: 85.2000, S: 0.0328 },
  { ageMonths: 30, L: 1, M: 89.5000, S: 0.0339 },
  { ageMonths: 36, L: 1, M: 93.4000, S: 0.0351 },
  { ageMonths: 42, L: 1, M: 96.9000, S: 0.0362 },
  { ageMonths: 48, L: 1, M: 100.3000, S: 0.0373 },
  { ageMonths: 54, L: 1, M: 103.5000, S: 0.0384 },
  { ageMonths: 60, L: 1, M: 106.5000, S: 0.0394 },
];

// Head circumference-for-age (0-60 months) - Boys
export const headCircumferenceForAgeBoys: LMSData[] = [
  { ageMonths: 0, L: 1, M: 34.4618, S: 0.03686 },
  { ageMonths: 1, L: 1, M: 37.2759, S: 0.03133 },
  { ageMonths: 2, L: 1, M: 39.1285, S: 0.02997 },
  { ageMonths: 3, L: 1, M: 40.5135, S: 0.02918 },
  { ageMonths: 4, L: 1, M: 41.6317, S: 0.02868 },
  { ageMonths: 5, L: 1, M: 42.5576, S: 0.02837 },
  { ageMonths: 6, L: 1, M: 43.3306, S: 0.02817 },
  { ageMonths: 7, L: 1, M: 43.9803, S: 0.02804 },
  { ageMonths: 8, L: 1, M: 44.53, S: 0.02796 },
  { ageMonths: 9, L: 1, M: 45.0000, S: 0.02792 },
  { ageMonths: 10, L: 1, M: 45.4051, S: 0.0279 },
  { ageMonths: 11, L: 1, M: 45.7573, S: 0.0279 },
  { ageMonths: 12, L: 1, M: 46.0661, S: 0.02791 },
  { ageMonths: 15, L: 1, M: 46.7500, S: 0.02800 },
  { ageMonths: 18, L: 1, M: 47.3000, S: 0.02810 },
  { ageMonths: 21, L: 1, M: 47.7500, S: 0.02820 },
  { ageMonths: 24, L: 1, M: 48.1000, S: 0.02830 },
  { ageMonths: 30, L: 1, M: 48.7000, S: 0.02850 },
  { ageMonths: 36, L: 1, M: 49.2000, S: 0.02870 },
  { ageMonths: 42, L: 1, M: 49.6000, S: 0.02890 },
  { ageMonths: 48, L: 1, M: 49.9500, S: 0.02910 },
  { ageMonths: 54, L: 1, M: 50.2500, S: 0.02930 },
  { ageMonths: 60, L: 1, M: 50.5000, S: 0.02950 },
];

// Head circumference-for-age (0-60 months) - Girls
export const headCircumferenceForAgeGirls: LMSData[] = [
  { ageMonths: 0, L: 1, M: 33.8787, S: 0.03496 },
  { ageMonths: 1, L: 1, M: 36.5463, S: 0.03148 },
  { ageMonths: 2, L: 1, M: 38.2521, S: 0.03008 },
  { ageMonths: 3, L: 1, M: 39.5328, S: 0.02922 },
  { ageMonths: 4, L: 1, M: 40.5817, S: 0.02866 },
  { ageMonths: 5, L: 1, M: 41.459, S: 0.02826 },
  { ageMonths: 6, L: 1, M: 42.1995, S: 0.02798 },
  { ageMonths: 7, L: 1, M: 42.829, S: 0.02778 },
  { ageMonths: 8, L: 1, M: 43.3671, S: 0.02763 },
  { ageMonths: 9, L: 1, M: 43.83, S: 0.02752 },
  { ageMonths: 10, L: 1, M: 44.2319, S: 0.02744 },
  { ageMonths: 11, L: 1, M: 44.5844, S: 0.02738 },
  { ageMonths: 12, L: 1, M: 44.8965, S: 0.02734 },
  { ageMonths: 15, L: 1, M: 45.5500, S: 0.02730 },
  { ageMonths: 18, L: 1, M: 46.0500, S: 0.02730 },
  { ageMonths: 21, L: 1, M: 46.4500, S: 0.02730 },
  { ageMonths: 24, L: 1, M: 46.8000, S: 0.02730 },
  { ageMonths: 30, L: 1, M: 47.4000, S: 0.02740 },
  { ageMonths: 36, L: 1, M: 47.9000, S: 0.02750 },
  { ageMonths: 42, L: 1, M: 48.3000, S: 0.02760 },
  { ageMonths: 48, L: 1, M: 48.6500, S: 0.02770 },
  { ageMonths: 54, L: 1, M: 48.9500, S: 0.02780 },
  { ageMonths: 60, L: 1, M: 49.2000, S: 0.02790 },
];

// Interpolate LMS values for a specific age
function interpolateLMS(data: LMSData[], ageMonths: number): LMSData {
  if (ageMonths <= data[0].ageMonths) return data[0];
  if (ageMonths >= data[data.length - 1].ageMonths) return data[data.length - 1];
  
  let lowerIndex = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].ageMonths <= ageMonths && data[i + 1].ageMonths >= ageMonths) {
      lowerIndex = i;
      break;
    }
  }
  
  const lower = data[lowerIndex];
  const upper = data[lowerIndex + 1];
  const ratio = (ageMonths - lower.ageMonths) / (upper.ageMonths - lower.ageMonths);
  
  return {
    ageMonths,
    L: lower.L + (upper.L - lower.L) * ratio,
    M: lower.M + (upper.M - lower.M) * ratio,
    S: lower.S + (upper.S - lower.S) * ratio,
  };
}

// Calculate Z-score using LMS method
function calculateZScore(value: number, L: number, M: number, S: number): number {
  if (L === 0) {
    return Math.log(value / M) / S;
  }
  return (Math.pow(value / M, L) - 1) / (L * S);
}

// Convert Z-score to percentile
function zScoreToPercentile(z: number): number {
  // Approximation of the cumulative distribution function
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  
  const percentile = 0.5 * (1.0 + sign * y);
  return Math.round(percentile * 100 * 10) / 10;
}

export interface PercentileResult {
  value: number;
  percentile: number;
  zScore: number;
  interpretation: 'very-low' | 'low' | 'normal' | 'high' | 'very-high';
  interpretationText: string;
}

export type Gender = 'male' | 'female' | 'neutral';

// Get interpretation based on percentile
function getInterpretation(percentile: number): { interpretation: PercentileResult['interpretation']; text: string } {
  if (percentile < 3) {
    return { interpretation: 'very-low', text: 'Çok düşük (<%3)' };
  } else if (percentile < 15) {
    return { interpretation: 'low', text: 'Düşük (3-15%)' };
  } else if (percentile <= 85) {
    return { interpretation: 'normal', text: 'Normal (15-85%)' };
  } else if (percentile <= 97) {
    return { interpretation: 'high', text: 'Yüksek (85-97%)' };
  } else {
    return { interpretation: 'very-high', text: 'Çok yüksek (>%97)' };
  }
}

// Calculate weight percentile
export function calculateWeightPercentile(
  weightKg: number,
  ageMonths: number,
  gender: Gender
): PercentileResult | null {
  if (ageMonths < 0 || ageMonths > 60) return null;
  
  const isMale = gender === 'male';
  const data = isMale ? weightForAgeBoys : weightForAgeGirls;
  const lms = interpolateLMS(data, ageMonths);
  
  const zScore = calculateZScore(weightKg, lms.L, lms.M, lms.S);
  const percentile = zScoreToPercentile(zScore);
  const { interpretation, text } = getInterpretation(percentile);
  
  return {
    value: weightKg,
    percentile,
    zScore: Math.round(zScore * 100) / 100,
    interpretation,
    interpretationText: text,
  };
}

// Calculate height percentile
export function calculateHeightPercentile(
  heightCm: number,
  ageMonths: number,
  gender: Gender
): PercentileResult | null {
  if (ageMonths < 0 || ageMonths > 60) return null;
  
  const isMale = gender === 'male';
  const data = isMale ? heightForAgeBoys : heightForAgeGirls;
  const lms = interpolateLMS(data, ageMonths);
  
  const zScore = calculateZScore(heightCm, lms.L, lms.M, lms.S);
  const percentile = zScoreToPercentile(zScore);
  const { interpretation, text } = getInterpretation(percentile);
  
  return {
    value: heightCm,
    percentile,
    zScore: Math.round(zScore * 100) / 100,
    interpretation,
    interpretationText: text,
  };
}

// Calculate head circumference percentile
export function calculateHeadCircumferencePercentile(
  headCm: number,
  ageMonths: number,
  gender: Gender
): PercentileResult | null {
  if (ageMonths < 0 || ageMonths > 60) return null;
  
  const isMale = gender === 'male';
  const data = isMale ? headCircumferenceForAgeBoys : headCircumferenceForAgeGirls;
  const lms = interpolateLMS(data, ageMonths);
  
  const zScore = calculateZScore(headCm, lms.L, lms.M, lms.S);
  const percentile = zScoreToPercentile(zScore);
  const { interpretation, text } = getInterpretation(percentile);
  
  return {
    value: headCm,
    percentile,
    zScore: Math.round(zScore * 100) / 100,
    interpretation,
    interpretationText: text,
  };
}

// Generate percentile curve data for charts
export function generatePercentileCurves(
  type: 'weight' | 'height' | 'headCircumference',
  gender: Gender,
  maxAgeMonths: number = 60
): { ageMonths: number; p3: number; p15: number; p50: number; p85: number; p97: number }[] {
  const isMale = gender === 'male';
  let data: LMSData[];
  
  switch (type) {
    case 'weight':
      data = isMale ? weightForAgeBoys : weightForAgeGirls;
      break;
    case 'height':
      data = isMale ? heightForAgeBoys : heightForAgeGirls;
      break;
    case 'headCircumference':
      data = isMale ? headCircumferenceForAgeBoys : headCircumferenceForAgeGirls;
      break;
  }
  
  const result: { ageMonths: number; p3: number; p15: number; p50: number; p85: number; p97: number }[] = [];
  
  // Z-scores for percentiles
  const z3 = -1.88;
  const z15 = -1.04;
  const z50 = 0;
  const z85 = 1.04;
  const z97 = 1.88;
  
  for (let age = 0; age <= Math.min(maxAgeMonths, 60); age += 3) {
    const lms = interpolateLMS(data, age);
    
    const calculateValue = (z: number) => {
      if (lms.L === 0) {
        return lms.M * Math.exp(lms.S * z);
      }
      return lms.M * Math.pow(1 + lms.L * lms.S * z, 1 / lms.L);
    };
    
    result.push({
      ageMonths: age,
      p3: Math.round(calculateValue(z3) * 10) / 10,
      p15: Math.round(calculateValue(z15) * 10) / 10,
      p50: Math.round(calculateValue(z50) * 10) / 10,
      p85: Math.round(calculateValue(z85) * 10) / 10,
      p97: Math.round(calculateValue(z97) * 10) / 10,
    });
  }
  
  return result;
}
