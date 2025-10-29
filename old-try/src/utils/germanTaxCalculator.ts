/**
 * German Income Tax Calculator (2024)
 * Based on official BMF (Bundesministerium der Finanzen) formulas
 *
 * Sources:
 * - §32a EStG (Einkommensteuertarif)
 * - BMF Programmablaufplan 2024
 * - §3 SolzG 1995 (Solidaritätszuschlag)
 */

export interface TaxCalculationInput {
  /** Annual gross income in EUR */
  annualGrossIncome: number;

  /** Marital status */
  maritalStatus: 'single' | 'married';

  /** Church tax applicable (8% or 9% depending on state) */
  churchTaxRate?: number;

  /** Special expenses (Sonderausgaben) like pension contributions */
  specialExpenses?: number;

  /** Extraordinary expenses (Außergewöhnliche Belastungen) */
  extraordinaryExpenses?: number;

  /** Children count for tax relief */
  children?: number;
}

export interface TaxCalculationResult {
  /** Taxable income after deductions */
  taxableIncome: number;

  /** Basic income tax (before solidarity surcharge and church tax) */
  incomeTax: number;

  /** Solidarity surcharge (Solidaritätszuschlag) */
  solidaritySurcharge: number;

  /** Church tax if applicable */
  churchTax: number;

  /** Total tax burden */
  totalTax: number;

  /** Net income after all taxes */
  netIncome: number;

  /** Average tax rate (%) */
  averageTaxRate: number;

  /** Marginal tax rate (%) */
  marginalTaxRate: number;

  /** Tax bracket name */
  taxBracket: string;

  /** Breakdown by component */
  breakdown: {
    grossIncome: number;
    specialExpenses: number;
    extraordinaryExpenses: number;
    childRelief: number;
    taxableIncome: number;
    incomeTax: number;
    solidaritySurcharge: number;
    churchTax: number;
    totalTax: number;
    netIncome: number;
  };
}

/**
 * 2024 German Tax Brackets (for single taxpayers)
 */
const TAX_BRACKETS_2024 = {
  basicAllowance: 11_604, // Grundfreibetrag
  progressionZone1End: 17_005,
  progressionZone2End: 66_760,
  topTaxZoneStart: 277_826,
  splittingFactor: 2, // Splitting-Verfahren for married couples
};

/**
 * Calculate income tax according to German tax formula 2024
 * BMF Programmablaufplan implementation
 */
function calculateIncomeTax(taxableIncome: number, maritalStatus: 'single' | 'married'): number {
  // Apply income splitting for married couples
  const zvE = maritalStatus === 'married' ? taxableIncome / 2 : taxableIncome;

  let tax = 0;

  // No tax below basic allowance (Grundfreibetrag)
  if (zvE <= TAX_BRACKETS_2024.basicAllowance) {
    tax = 0;
  }
  // First progression zone: 14% to 24%
  else if (zvE <= TAX_BRACKETS_2024.progressionZone1End) {
    const y = (zvE - TAX_BRACKETS_2024.basicAllowance) / 10000;
    tax = (922.98 * y + 1400) * y;
  }
  // Second progression zone: 24% to 42%
  else if (zvE <= TAX_BRACKETS_2024.progressionZone2End) {
    const y = (zvE - 17005) / 10000;
    tax = (181.19 * y + 2397) * y + 1025.38;
  }
  // Proportional zone: 42%
  else if (zvE <= TAX_BRACKETS_2024.topTaxZoneStart) {
    tax = 0.42 * zvE - 10602.13;
  }
  // Top tax rate: 45% (Reichensteuer)
  else {
    tax = 0.45 * zvE - 18936.88;
  }

  // Round to full EUR
  tax = Math.floor(tax);

  // Apply splitting factor for married couples
  if (maritalStatus === 'married') {
    tax = tax * 2;
  }

  return Math.max(0, tax);
}

/**
 * Calculate solidarity surcharge (Solidaritätszuschlag)
 * 5.5% of income tax, with allowance
 */
function calculateSolidaritySurcharge(incomeTax: number, maritalStatus: 'single' | 'married'): number {
  // Solidarity surcharge allowance (Freigrenze)
  const allowance = maritalStatus === 'married' ? 36936 : 18472;

  if (incomeTax <= allowance) {
    return 0;
  }

  // Milderungszone (gradual phase-in)
  const milderungszoneEnd = maritalStatus === 'married' ? 33963 : 16931.5;
  const milderungszoneStart = allowance;

  if (incomeTax < milderungszoneEnd) {
    // Gradual increase in milderungszone
    const surcharge = ((incomeTax - milderungszoneStart) * 0.119);
    return Math.floor(surcharge);
  }

  // Full solidarity surcharge: 5.5%
  return Math.floor(incomeTax * 0.055);
}

/**
 * Calculate church tax (Kirchensteuer)
 * Typically 8% or 9% of income tax (depends on federal state)
 */
function calculateChurchTax(incomeTax: number, solidaritySurcharge: number, rate: number = 0.09): number {
  if (rate === 0) return 0;

  // Church tax is based on income tax minus solidarity surcharge
  const churchTaxBase = incomeTax - solidaritySurcharge;

  return Math.floor(churchTaxBase * rate);
}

/**
 * Calculate child relief (Kinderfreibetrag)
 * Alternative to Kindergeld (child benefit)
 */
function calculateChildRelief(children: number): number {
  // 2024: 6384 EUR per child (3192 EUR per parent)
  // Plus care allowance (Betreuungsfreibetrag): 2928 EUR per child
  const reliefPerChild = 6384 + 2928; // 9312 EUR total
  return children * reliefPerChild;
}

/**
 * Determine tax bracket name
 */
function getTaxBracketName(taxableIncome: number, maritalStatus: 'single' | 'married'): string {
  const income = maritalStatus === 'married' ? taxableIncome / 2 : taxableIncome;

  if (income <= TAX_BRACKETS_2024.basicAllowance) {
    return 'Grundfreibetrag (0%)';
  } else if (income <= TAX_BRACKETS_2024.progressionZone1End) {
    return 'Progressionszone 1 (14-24%)';
  } else if (income <= TAX_BRACKETS_2024.progressionZone2End) {
    return 'Progressionszone 2 (24-42%)';
  } else if (income <= TAX_BRACKETS_2024.topTaxZoneStart) {
    return 'Proportionalzone (42%)';
  } else {
    return 'Reichensteuer (45%)';
  }
}

/**
 * Calculate marginal tax rate (Grenzsteuersatz)
 */
function calculateMarginalTaxRate(taxableIncome: number, maritalStatus: 'single' | 'married'): number {
  const income = maritalStatus === 'married' ? taxableIncome / 2 : taxableIncome;

  if (income <= TAX_BRACKETS_2024.basicAllowance) {
    return 0;
  } else if (income <= TAX_BRACKETS_2024.progressionZone1End) {
    const y = (income - TAX_BRACKETS_2024.basicAllowance) / 10000;
    return (1845.96 * y + 1400) / 100;
  } else if (income <= TAX_BRACKETS_2024.progressionZone2End) {
    const y = (income - 17005) / 10000;
    return (362.38 * y + 2397) / 100;
  } else if (income <= TAX_BRACKETS_2024.topTaxZoneStart) {
    return 42;
  } else {
    return 45;
  }
}

/**
 * Main tax calculation function
 */
export function calculateGermanTax(input: TaxCalculationInput): TaxCalculationResult {
  const {
    annualGrossIncome,
    maritalStatus,
    churchTaxRate = 0,
    specialExpenses = 0,
    extraordinaryExpenses = 0,
    children = 0,
  } = input;

  // Calculate child relief
  const childRelief = calculateChildRelief(children);

  // Calculate taxable income
  // Note: In reality, there are many more deductions, but we simplify here
  const taxableIncome = Math.max(
    0,
    annualGrossIncome - specialExpenses - extraordinaryExpenses - childRelief
  );

  // Calculate income tax
  const incomeTax = calculateIncomeTax(taxableIncome, maritalStatus);

  // Calculate solidarity surcharge
  const solidaritySurcharge = calculateSolidaritySurcharge(incomeTax, maritalStatus);

  // Calculate church tax if applicable
  const churchTax = calculateChurchTax(incomeTax, solidaritySurcharge, churchTaxRate);

  // Total tax burden
  const totalTax = incomeTax + solidaritySurcharge + churchTax;

  // Net income
  const netIncome = annualGrossIncome - totalTax;

  // Average tax rate
  const averageTaxRate = annualGrossIncome > 0 ? (totalTax / annualGrossIncome) * 100 : 0;

  // Marginal tax rate
  const marginalTaxRate = calculateMarginalTaxRate(taxableIncome, maritalStatus);

  // Tax bracket
  const taxBracket = getTaxBracketName(taxableIncome, maritalStatus);

  return {
    taxableIncome,
    incomeTax,
    solidaritySurcharge,
    churchTax,
    totalTax,
    netIncome,
    averageTaxRate,
    marginalTaxRate,
    taxBracket,
    breakdown: {
      grossIncome: annualGrossIncome,
      specialExpenses,
      extraordinaryExpenses,
      childRelief,
      taxableIncome,
      incomeTax,
      solidaritySurcharge,
      churchTax,
      totalTax,
      netIncome,
    },
  };
}

/**
 * Calculate tax savings from pension contributions
 */
export function calculatePensionTaxSavings(
  grossIncome: number,
  pensionContribution: number,
  maritalStatus: 'single' | 'married',
  children: number = 0
): {
  taxWithoutPension: number;
  taxWithPension: number;
  savings: number;
  savingsRate: number;
} {
  // Without pension contribution
  const withoutPension = calculateGermanTax({
    annualGrossIncome: grossIncome,
    maritalStatus,
    children,
    specialExpenses: 0,
  });

  // With pension contribution as special expense
  const withPension = calculateGermanTax({
    annualGrossIncome: grossIncome,
    maritalStatus,
    children,
    specialExpenses: pensionContribution,
  });

  const savings = withoutPension.totalTax - withPension.totalTax;
  const savingsRate = pensionContribution > 0 ? (savings / pensionContribution) * 100 : 0;

  return {
    taxWithoutPension: withoutPension.totalTax,
    taxWithPension: withPension.totalTax,
    savings,
    savingsRate,
  };
}
