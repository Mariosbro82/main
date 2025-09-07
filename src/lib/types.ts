export interface TooltipCorrection {
  [key: string]: string;
}

export const tooltipCorrections: TooltipCorrection = {
  "Privte Rente (fondgebunden)": "Korrektur: Private Rente (fondsgebunden)",

  "Maximalne": "Korrektur: Maximale",
  "Fond Leistung": "Korrektur: Fonds-Leistung",
  "fondgebunden": "Korrektur: fondsgebunden",
  "Vermögensentwickelung": "Korrektur: Vermögensentwicklung",

};

export interface FormData {
  currentAge: number;
  startAge: number;
  termYears: number;
  monthlyContribution: number;
  startInvestment: number;
  targetMaturityValue?: number | null;
  payoutStartAge: number;
  payoutEndAge: number;
  payoutMode: "annuity" | "flex";
  annuityRate: number;
  safeWithdrawalRate?: number;
}

export type TabType = "private-pension" | "funds" | "fund-performance" | "comparison" | "custom-comparison";

export interface SimulationPoint {
  year: number;
  month: number;
  age: number;
  portfolioValue: number;
  contribution: number;
  fees: number;
  taxes: number;
  payout?: number;
  isPayoutPhase: boolean;
}

export interface SimulationResults {
  seriesAnspar: SimulationPoint[];
  seriesPayout: SimulationPoint[];
  kpis: {
    projectedValue: number;
    targetGap: number;
    monthlyPension: number;
    totalFees: number;
    totalContributions: number;
    capitalGains: number;
    totalCosts: number;
    netReturn: number;
    totalTaxes: number;
  };
}
