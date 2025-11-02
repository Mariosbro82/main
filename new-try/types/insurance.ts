// Insurance Product Types for Fond Gebundene Rentenversicherung

export type GuaranteeLevel = 0 | 50 | 80 | 90 | 100;
export type GuaranteeType = 'nominal' | 'real';
export type PayoutOption = 'lumpSum' | 'partialAnnuity' | 'fullAnnuity' | 'withdrawalPlan';
export type FundCategory = 'Aktien' | 'Renten' | 'Mischfonds' | 'Immobilien' | 'Geldmarkt';
export type Region = 'Global' | 'Europa' | 'USA' | 'Asien' | 'Deutschland' | 'Emerging Markets';

// Fund Information
export interface Fund {
  isin: string;
  name: string;
  category: FundCategory;
  region: Region;
  ter: number; // Total Expense Ratio (%)
  historicalReturn: number; // Average return (%)
  volatility: number; // Risk level (%)
  morningstarRating?: 1 | 2 | 3 | 4 | 5;
  description: string;
}

// Insurance Product Costs
export interface InsuranceCosts {
  abschlusskosten: number; // Acquisition costs (% of total contributions)
  vertriebskosten: number; // Distribution costs (%)
  verwaltungskosten: number; // Annual admin costs (% p.a.)
  fondskosten: number; // Fund costs TER (% p.a.)
  garantiekosten: number; // Guarantee costs (% p.a.)
  risikokosten: number; // Death benefit costs (% p.a.)
  effectiveCostRatio?: number; // Total effective cost ratio
}

// Product Features
export interface ProductFeatures {
  zuzahlungenMoeglich: boolean;
  minZuzahlung?: number;
  maxZuzahlungProJahr?: number;

  entnahmenMoeglich: boolean;
  minEntnahme?: number;
  maxEntnahmePercent?: number;

  beitragsfreistellungMoeglich: boolean;
  minBeitragsfreistellungMonate?: number;

  dynamikMoeglich: boolean;
  dynamikProzent?: number;

  fondswechselMoeglich: boolean;
  fondswechselFreiProJahr?: number;
  fondswechselKosten?: number;
}

// Payout Options Configuration
export interface PayoutOptionsConfig {
  einmalkapital: boolean;
  teilverrentung: boolean;
  vollverrentung: boolean;
  auszahlplan: boolean;

  rentengarantiezeit?: number; // Years
  hinterbliebenenabsicherung?: boolean;
  hinterbliebenenProzent?: number; // % of pension for spouse
}

// Provider Ratings
export interface ProviderRatings {
  morningstar?: 1 | 2 | 3 | 4 | 5;
  mapReport?: 'exzellent' | 'sehr gut' | 'gut' | 'befriedigend';
  finanzkraft?: 'AAA' | 'AA+' | 'AA' | 'AA-' | 'A+' | 'A' | 'A-' | 'BBB+';
  assekurataRating?: 'A++' | 'A+' | 'A' | 'B++' | 'B+';
}

// Main Insurance Product Interface
export interface InsuranceProduct {
  // Basic Information
  id: string;
  provider: string; // "Allianz", "AXA", "Generali", etc.
  productName: string;
  productCode: string;
  description: string;

  // Guarantees
  guaranteeLevel: GuaranteeLevel;
  guaranteeType: GuaranteeType;

  // Costs
  costs: InsuranceCosts;

  // Available Funds
  availableFunds: Fund[];
  defaultFundAllocation?: FundAllocation[];

  // Features
  features: ProductFeatures;

  // Payout Options
  payoutOptions: PayoutOptionsConfig;

  // Death Benefit
  deathBenefit: {
    duringAccumulation: number; // Multiplier (e.g., 1.1 = 110%)
    options: {
      basic: boolean; // 100% of contributions
      enhanced: boolean; // 110% of contributions
      premium: boolean; // Contributions + fund value + 10%
    };
  };

  // Ratings
  ratings: ProviderRatings;

  // Additional Info
  minContribution: number;
  maxContribution: number;
  minContractDuration: number;
  minRetirementAge: number;
  maxEntryAge: number;

  // Marketing
  highlights: string[];
  bestFor: string[]; // ["Sicherheitsorientiert", "Flexibel", "Kostenoptimiert"]
}

// Fund Allocation
export interface FundAllocation {
  fund: Fund;
  percentage: number; // 0-100
}

// Guarantee Calculation Result
export interface GuaranteeCalculation {
  // Input
  monthlyContribution: number;
  contributionPeriod: number;
  guaranteeLevel: GuaranteeLevel;
  product: InsuranceProduct;

  // Output - Amounts
  totalContributions: number;
  totalCosts: number;

  // Scenarios
  guaranteed: {
    amount: number;
    afterCosts: number;
    returnPercent: number;
  };

  expected: {
    amount: number;
    afterTax: number;
    returnPercent: number;
    assumptions: string;
  };

  optimistic: {
    amount: number;
    afterTax: number;
    returnPercent: number;
    assumptions: string;
  };

  // Death Benefit
  deathBenefit: {
    atHalfway: number;
    atEnd: number;
  };
}

// Insurance Tax Calculation (12-Year Rule)
export interface InsuranceTaxCalculation {
  // Input
  contractDuration: number;
  ageAtPayout: number;
  totalContributions: number;
  finalValue: number;

  // Calculation
  capitalGain: number;
  meets12YearRule: boolean;
  meetsAgeRequirement: boolean;

  // Tax
  taxRule: '12-Jahre-Regel' | 'Standard-Abgeltungssteuer';
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  effectiveTaxRate: number; // Actual tax rate on total gain

  // Net Payout
  netPayout: number;

  // Comparison with Pure Funds
  comparison: {
    fundTax: number; // 25% Abgeltungssteuer
    insuranceTax: number;
    taxSavings: number;
    savingsPercent: number;
  };
}

// Insurance vs Fund Comparison
export interface InsuranceVsFundComparison {
  // Inputs
  monthlyContribution: number;
  years: number;
  assumedReturn: number;

  // Fund Investment
  fundInvestment: {
    totalContributions: number;
    totalCosts: number;
    expectedValue: number;
    taxAmount: number;
    netPayout: number;
    guarantee: number; // 0
    deathBenefit: number;
    flexibility: 'high' | 'medium' | 'low';
  };

  // Insurance
  insurance: {
    totalContributions: number;
    totalCosts: number;
    guaranteedValue: number;
    expectedValue: number;
    taxAmount: number;
    netPayout: number;
    guarantee: number;
    deathBenefit: number;
    flexibility: 'high' | 'medium' | 'low';
  };

  // Analysis
  differences: {
    costDifference: number;
    taxSavings: number;
    guaranteeBenefit: number;
    netDifference: number;
  };

  // Recommendation
  recommendation: {
    type: 'fund' | 'insurance' | 'combination';
    score: {
      fund: number; // 0-100
      insurance: number; // 0-100
    };
    reason: string;
    combinationRatio?: {
      fundPercent: number;
      insurancePercent: number;
    };
  };
}

// Insurance Cost Breakdown
export interface InsuranceCostBreakdown {
  // One-time Costs
  oneTimeCosts: {
    abschlusskosten: CostItem;
    ausgabeaufschlag: CostItem;
    total: number;
  };

  // Recurring Annual Costs
  recurringCosts: {
    verwaltungskosten: CostItem;
    fondskosten: CostItem;
    garantiekosten: CostItem;
    risikokosten: CostItem;
    totalPerYear: number;
  };

  // Total Over Contract Period
  totalCosts: {
    overEntirePeriod: number;
    asPercentageOfContributions: number;
    reductionInReturnPerYear: number;
  };

  // Effective Cost Ratio
  effectiveCostRatio: number;
}

export interface CostItem {
  amount: number;
  percentage: number;
  description: string;
}

// Provider Information
export interface InsuranceProvider {
  id: string;
  name: string;
  logo?: string;
  ratings: ProviderRatings;
  products: InsuranceProduct[];
  uniqueFeatures: string[];
  marketPosition: string;
  website?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

// Customer Profile for Product Recommendation
export interface CustomerProfile {
  age: number;
  maritalStatus: 'single' | 'married';
  riskTolerance: 'low' | 'medium' | 'high';
  savingsGoal: number;
  monthlyBudget: number;
  priorities: {
    security: number; // 1-10
    flexibility: number; // 1-10
    returns: number; // 1-10
    costs: number; // 1-10 (higher = more cost-sensitive)
  };
}

// Product Recommendation Result
export interface ProductRecommendation {
  product: InsuranceProduct;
  score: number; // 0-100
  matchReasons: string[];
  warnings: string[];
  projectedValue: number;
  monthlyRecommendedContribution: number;
}
