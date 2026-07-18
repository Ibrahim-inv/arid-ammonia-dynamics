// NH3 emission simulation model for poultry houses (arid-region focus)
// References (paraphrased): Sutton et al. 2013 (T-doubling); Reece et al. 1979 (pH spike);
// Henry's law solubility decline with T; microbial denaturation > 50°C.

export interface ModelInputs {
  T: number; // °C
  RH: number; // %
  pH: number; // 1..14
}

export interface ModelOutput {
  ppm: number;
  risk: "safe" | "warning" | "dangerous";
  factors: {
    fT: number; // temperature multiplier
    fRH: number; // RH modifier
    fpH: number; // pH multiplier
    microbial: number;
    henry: number; // solubility modifier
    aridSynergy: number;
  };
  explanation: string[];
  explanationAr: string[];
}

// Baseline emission at T=20, RH=50, pH=7 ≈ 5 ppm
const BASELINE = 5;

export function simulate({ T, RH, pH }: ModelInputs): ModelOutput {
  // Sutton et al.: doubles every 5°C above reference 20°C
  const fT = Math.pow(2, (T - 20) / 5);

  // Microbial activity envelope: suppressed <5°C and >50°C
  let microbial: number;
  if (T < 5) microbial = Math.max(0.05, ((T + 15) / 20) * 0.4);
  else if (T <= 35) microbial = 1;
  else if (T <= 50)
    microbial = 1 - (T - 35) / 30; // gradual decline
  else microbial = Math.max(0.1, 1 - ((T - 50) / 10) * 0.7); // protein denaturation

  // Henry's law: NH3 solubility ↓ as T ↑ → more gas-phase release at high T
  const henry = 1 + Math.max(0, T - 20) * 0.015;

  // RH non-linear: peak around 40-60%, drop above 80% (dissolution to NH4+)
  let fRH: number;
  if (RH < 20)
    fRH = 0.85 + (RH / 20) * 0.25; // dry: still high (no water trap)
  else if (RH <= 60)
    fRH = 1.1 + ((RH - 20) / 40) * 0.15; // optimum microbial
  else if (RH <= 80) fRH = 1.25 - ((RH - 60) / 20) * 0.35;
  else fRH = Math.max(0.3, 0.9 - ((RH - 80) / 20) * 0.6); // dissolution to NH4+

  // pH: acidic suppresses; >8 exponential spike (Reece 1979)
  let fpH: number;
  if (pH <= 7)
    fpH = Math.max(0.02, Math.pow(10, (pH - 7) * 0.6)); // strong suppression below 7
  else if (pH <= 8) fpH = 1 + (pH - 7) * 1.2;
  else fpH = (1 + (8 - 7) * 1.2) * Math.pow(2.4, pH - 8); // sharp exponential

  // Arid synergy: low RH + high T → trapping fails, max volatilization
  let aridSynergy = 1;
  if (RH < 20 && T > 45) {
    aridSynergy = 1 + (45 - RH) * 0.02 + (T - 45) * 0.05;
  }

  const ppmRaw = BASELINE * fT * fRH * fpH * microbial * henry * aridSynergy;
  const ppm = Math.max(0, Math.min(200, ppmRaw));

  const risk: ModelOutput["risk"] = ppm < 10 ? "safe" : ppm <= 25 ? "warning" : "dangerous";

  const factors = { fT, fRH, fpH, microbial, henry, aridSynergy };
  const explanation = buildExplanation({ T, RH, pH }, factors, ppm);
  const explanationAr = buildExplanationAr({ T, RH, pH }, factors, ppm);

  return {
    ppm,
    risk,
    factors,
    explanation,
    explanationAr,
  };
}

function buildExplanationAr(i: ModelInputs, f: ModelOutput["factors"], ppm: number): string[] {
  const out: string[] = [];
  if (i.T < 5)
    out.push(
      `عند ${i.T.toFixed(1)} °م، يُثبَّط نشاط إنزيم اليورياز الميكروبي إلى حد كبير؛ التطاير ضئيل.`,
    );
  else if (i.T > 50)
    out.push(
      `عند ${i.T.toFixed(1)} °م، يقلّل تمسّخ البروتين من النشاط الميكروبي، لكن فقدان الذوبانية وفق هنري يُبقي NH₃ في الطور الغازي.`,
    );
  else
    out.push(
      `وفق ساتون وآخرون (2013)، يتضاعف الانبعاث تقريباً كل 5 °م؛ معامل الحرارة الحالي = ×${f.fT.toFixed(2)}.`,
    );

  if (i.RH > 80)
    out.push(
      `الرطوبة ${i.RH.toFixed(0)}% — يذوب NH₃ الغازي في أغشية الماء المتكثفة، فيتحول التوازن نحو NH₄⁺ ويقل التركيز الجوي.`,
    );
  else if (i.RH < 20)
    out.push(
      `الرطوبة ${i.RH.toFixed(0)}% — غشاء الماء في الفرشة رقيق جداً لإذابة NH₃؛ التطاير دون كابح.`,
    );
  else
    out.push(
      `الرطوبة ${i.RH.toFixed(0)}% قريبة من المثلى للنشاط الميكروبي، مما يديم تحلل اليوريا.`,
    );

  if (i.pH <= 7)
    out.push(
      `pH الفرشة ${i.pH.toFixed(1)} (حمضي) — توازن NH₄⁺/NH₃ مقفل نحو NH₄⁺؛ الانبعاث مكبوت (ريس 1979).`,
    );
  else if (i.pH > 8)
    out.push(
      `عند pH ${i.pH.toFixed(1)} ينحرف التوازن بشدة نحو NH₃ الغازي — تطاير أسي (×${f.fpH.toFixed(1)}).`,
    );
  else out.push(`pH ${i.pH.toFixed(1)} قرب عتبة التحول؛ أي انجراف قاعدي بسيط سيرفع NH₃ بشكل كبير.`);

  if (f.aridSynergy > 1.05)
    out.push(
      `⚠ تم رصد تآزر قاحل: انخفاض الرطوبة (<20%) مع ارتفاع الحرارة (>45 °م) يُسقط المصيدة المائية — معامل التآزر ×${f.aridSynergy.toFixed(2)}.`,
    );

  if (ppm < 10)
    out.push(`المتوقَّع ${ppm.toFixed(1)} ppm — ضمن الحدود المهنية الآمنة للطيور والبشر.`);
  else if (ppm <= 25)
    out.push(
      `المتوقَّع ${ppm.toFixed(1)} ppm — عتبة التعرض المزمن؛ تهيج مخاطي وانخفاض في تحويل العلف.`,
    );
  else out.push(`المتوقَّع ${ppm.toFixed(1)} ppm — يتجاوز سقف 25 ppm؛ تدخل تهوية فوري مطلوب.`);

  return out;
}

function buildExplanation(i: ModelInputs, f: ModelOutput["factors"], ppm: number): string[] {
  const out: string[] = [];

  // Temperature
  if (i.T < 5) {
    out.push(
      `At ${i.T.toFixed(1)} °C, microbial urease activity is largely suppressed; volatilization is minimal.`,
    );
  } else if (i.T > 50) {
    out.push(
      `At ${i.T.toFixed(1)} °C, protein denaturation reduces microbial output, but Henry's-law solubility loss keeps NH₃ in the gas phase.`,
    );
  } else {
    out.push(
      `Per Sutton et al. (2013), emission roughly doubles every 5 °C; current Tᶠᵃᶜᵗᵒʳ = ×${f.fT.toFixed(2)}.`,
    );
  }

  // RH
  if (i.RH > 80) {
    out.push(
      `RH ${i.RH.toFixed(0)}% — gaseous NH₃ dissolves into condensed water films, shifting equilibrium toward NH₄⁺ and lowering atmospheric ppm.`,
    );
  } else if (i.RH < 20) {
    out.push(
      `RH ${i.RH.toFixed(0)}% — the litter water film is too thin to dissolve NH₃; volatilization proceeds unchecked.`,
    );
  } else {
    out.push(`RH ${i.RH.toFixed(0)}% sits near the microbial optimum, sustaining urea hydrolysis.`);
  }

  // pH
  if (i.pH <= 7) {
    out.push(
      `Litter pH ${i.pH.toFixed(1)} (acidic) — the NH₄⁺/NH₃ equilibrium is locked toward NH₄⁺; emission is suppressed (Reece et al. 1979).`,
    );
  } else if (i.pH > 8) {
    out.push(
      `At pH ${i.pH.toFixed(1)} the equilibrium shifts sharply to the gaseous NH₃ phase — exponential volatilization (×${f.fpH.toFixed(1)}).`,
    );
  } else {
    out.push(
      `pH ${i.pH.toFixed(1)} is near the transition threshold; small alkaline drift will dramatically raise NH₃.`,
    );
  }

  // Synergy
  if (f.aridSynergy > 1.05) {
    out.push(
      `⚠ Arid synergy detected: low RH (<20%) combined with high T (>45 °C) collapses the water trap — synergy factor ×${f.aridSynergy.toFixed(2)}.`,
    );
  }

  // Risk summary
  if (ppm < 10) {
    out.push(
      `Predicted ${ppm.toFixed(1)} ppm — within safe occupational limits for birds and humans.`,
    );
  } else if (ppm <= 25) {
    out.push(
      `Predicted ${ppm.toFixed(1)} ppm — chronic exposure threshold; mucosal irritation and reduced feed conversion expected.`,
    );
  } else {
    out.push(
      `Predicted ${ppm.toFixed(1)} ppm — above 25 ppm OSHA/poultry-welfare ceiling; immediate ventilation intervention required.`,
    );
  }

  return out;
}
