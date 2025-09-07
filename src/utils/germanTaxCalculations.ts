/**
 * German Tax Calculations for Investment Products
 * Includes Kapitalertragssteuer, Vorabpauschale, and Ertragsanteil calculations
 */

export interface TaxSettings {
  capitalGainsTaxRate: number; // 25% + Soli (26.375%)
  churchTaxRate: number; // 8-9% additional
  allowance: number; // Sparer-Pauschbetrag
  baseRate: number; // Basiszins für Vorabpauschale
  hasChurchTax: boolean;
}

export interface InvestmentData {
  initialValue: number;
  currentValue: number;
  yearlyContributions: number;
  managementFee: number;
  frontLoad: number;
}

export interface PensionData {
  monthlyPension: number;
  totalContributions: number;
  guaranteedPension: number;
  age: number;
}

/**
 * Calculate effective tax rate including church tax
 */
export function getEffectiveTaxRate(settings: TaxSettings): number {
  const baseTaxRate = settings.capitalGainsTaxRate;
  if (settings.hasChurchTax) {
    return baseTaxRate + (baseTaxRate * settings.churchTaxRate / 100);
  }
  return baseTaxRate;
}

/**
 * Calculate Vorabpauschale (advance lump sum) for fund investments
 * This is a German tax concept where investors pay tax on theoretical gains
 */
export function calculateVorabpauschale(
  investmentValue: number,
  baseRate: number,
  managementFee: number,
  actualGain: number
): number {
  // Vorabpauschale = Investment Value * (Base Rate - Management Fee) * 0.7
  const theoreticalGain = investmentValue * (baseRate - managementFee) / 100 * 0.7;
  
  // Vorabpauschale cannot exceed actual gains
  return Math.max(0, Math.min(theoreticalGain, actualGain));
}

/**
 * Calculate taxable amount after applying Sparer-Pauschbetrag (allowance)
 */
export function applyAllowance(taxableAmount: number, allowance: number, usedAllowance: number = 0): {
  taxableAfterAllowance: number;
  allowanceUsed: number;
  remainingAllowance: number;
} {
  const availableAllowance = Math.max(0, allowance - usedAllowance);
  const allowanceUsed = Math.min(taxableAmount, availableAllowance);
  const taxableAfterAllowance = Math.max(0, taxableAmount - allowanceUsed);
  
  return {
    taxableAfterAllowance,
    allowanceUsed,
    remainingAllowance: availableAllowance - allowanceUsed
  };
}

/**
 * Calculate annual tax for fund investments including Vorabpauschale
 */
export function calculateFundTax(
  investmentData: InvestmentData,
  settings: TaxSettings,
  usedAllowance: number = 0
): {
  vorabpauschale: number;
  taxOnVorabpauschale: number;
  allowanceUsed: number;
  remainingAllowance: number;
  totalTax: number;
} {
  const actualGain = Math.max(0, investmentData.currentValue - investmentData.initialValue - investmentData.yearlyContributions);
  
  // Calculate Vorabpauschale
  const vorabpauschale = calculateVorabpauschale(
    investmentData.currentValue,
    settings.baseRate,
    investmentData.managementFee,
    actualGain
  );
  
  // Apply allowance to Vorabpauschale
  const allowanceResult = applyAllowance(vorabpauschale, settings.allowance, usedAllowance);
  
  // Calculate tax on remaining amount after allowance
  const effectiveTaxRate = getEffectiveTaxRate(settings);
  const taxOnVorabpauschale = allowanceResult.taxableAfterAllowance * effectiveTaxRate / 100;
  
  return {
    vorabpauschale,
    taxOnVorabpauschale,
    allowanceUsed: allowanceResult.allowanceUsed,
    remainingAllowance: allowanceResult.remainingAllowance,
    totalTax: taxOnVorabpauschale
  };
}

/**
 * Calculate Ertragsanteil for pension payments
 * The taxable portion of pension payments based on age when payments start
 */
export function getErtragsanteil(ageAtPaymentStart: number): number {
  // Simplified Ertragsanteil table (2024)
  if (ageAtPaymentStart >= 67) return 17; // 17% taxable
  if (ageAtPaymentStart >= 65) return 18; // 18% taxable
  if (ageAtPaymentStart >= 63) return 19; // 19% taxable
  if (ageAtPaymentStart >= 60) return 22; // 22% taxable
  return 25; // 25% taxable for younger ages
}

/**
 * Calculate annual tax on pension payments
 */
export function calculatePensionTax(
  pensionData: PensionData,
  settings: TaxSettings,
  personalTaxRate: number = 25 // Assuming 25% personal tax rate
): {
  ertragsanteil: number;
  taxableAmount: number;
  totalTax: number;
} {
  const ertragsanteil = getErtragsanteil(pensionData.age);
  const annualPension = pensionData.monthlyPension * 12;
  const taxableAmount = annualPension * ertragsanteil / 100;
  
  // Pension payments are taxed at personal tax rate, not capital gains rate
  const totalTax = taxableAmount * personalTaxRate / 100;
  
  return {
    ertragsanteil,
    taxableAmount,
    totalTax
  };
}

/**
 * Calculate final tax when selling fund investments
 */
export function calculateFinalSaleTax(
  totalGains: number,
  vorabpauschaleAlreadyPaid: number,
  settings: TaxSettings,
  usedAllowance: number = 0
): {
  remainingTaxableGains: number;
  allowanceUsed: number;
  finalTax: number;
} {
  // Remaining taxable gains after deducting already taxed Vorabpauschale
  const remainingTaxableGains = Math.max(0, totalGains - vorabpauschaleAlreadyPaid);
  
  // Apply remaining allowance
  const allowanceResult = applyAllowance(remainingTaxableGains, settings.allowance, usedAllowance);
  
  // Calculate final tax
  const effectiveTaxRate = getEffectiveTaxRate(settings);
  const finalTax = allowanceResult.taxableAfterAllowance * effectiveTaxRate / 100;
  
  return {
    remainingTaxableGains,
    allowanceUsed: allowanceResult.allowanceUsed,
    finalTax
  };
}

/**
 * Default German tax settings for 2024
 */
export const DEFAULT_TAX_SETTINGS: TaxSettings = {
  capitalGainsTaxRate: 26.375, // 25% + 5.5% Solidaritätszuschlag
  churchTaxRate: 8, // Average church tax rate
  allowance: 1000, // Single person allowance
  baseRate: 2.0, // Current base rate
  hasChurchTax: false
};