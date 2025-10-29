// Centralised snapshot of German tax and pension parameters (stand 2024).
// Values should be refreshed annually from the official sources noted below.

export interface GovernmentTaxParameters {
  year: number;
  sparerPauschbetragSingle: number;
  sparerPauschbetragMarried: number;
  capitalGainsTaxBaseRate: number; // decimal
  solidaritySurchargeRate: number; // decimal
  churchTaxDefaultRate: number; // decimal
  vorabpauschaleBasiszins: number; // decimal
  ruerupMaxContribution: number;
  ruerupDeductibleRate: number; // decimal
  taxablePortionRetirement: number; // decimal for 2024
  partialExemptionEquityFunds: number; // decimal
}

export interface GovernmentPensionParameters {
  year: number;
  occupationalPensionMonthlyExemption: number;
}

export interface GovernmentParameters {
  tax: GovernmentTaxParameters;
  pension: GovernmentPensionParameters;
  metadata: {
    lastUpdated: string;
    sources: Record<string, string>;
  };
}

export const GOVERNMENT_PARAMETERS_2024: GovernmentParameters = {
  tax: {
    year: 2024,
    sparerPauschbetragSingle: 1_000,
    sparerPauschbetragMarried: 2_000,
    capitalGainsTaxBaseRate: 0.25,
    solidaritySurchargeRate: 0.055,
    churchTaxDefaultRate: 0.08,
    vorabpauschaleBasiszins: 0.01, // 1.0% BMF-Mitteilung 2024
    ruerupMaxContribution: 27_566,
    ruerupDeductibleRate: 0.96,
    taxablePortionRetirement: 0.83,
    partialExemptionEquityFunds: 0.15,
  },
  pension: {
    year: 2024,
    occupationalPensionMonthlyExemption: 584,
  },
  metadata: {
    lastUpdated: '2024-11-01',
    sources: {
      sparerPauschbetrag: '§20 Abs.9 EStG',
      capitalGainsTax: '§32d EStG / BMF',
      solidaritySurcharge: '§4 SolzG 1995',
      vorabpauschaleBasiszins: 'BMF-Schreiben vom 21.12.2023',
      ruerup: 'BMF Bekanntmachung Höchstbetrag Altersvorsorgeaufwendungen 2024',
      taxablePortionRetirement: '§22 Nr.1 S.3 Buchst. a Doppelbuchst. aa EStG',
      partialExemption: '§20 Abs.3 InvStG',
      occupationalPension: 'BBG 2024 / §3 Nr.63 EStG',
    },
  },
};

export const CAPITAL_GAINS_TAX_RATE_PERCENT =
  (GOVERNMENT_PARAMETERS_2024.tax.capitalGainsTaxBaseRate +
    GOVERNMENT_PARAMETERS_2024.tax.capitalGainsTaxBaseRate *
      GOVERNMENT_PARAMETERS_2024.tax.solidaritySurchargeRate) *
  100;

export const PARTIAL_EXEMPTION_PERCENT =
  GOVERNMENT_PARAMETERS_2024.tax.partialExemptionEquityFunds;
