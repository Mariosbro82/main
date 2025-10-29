/**
 * Pension vs Fund Savings Simulation
 * Calculates wealth development over time for both products
 */

import {
  TaxSettings,
  InvestmentData,
  PensionData,
  calculateFundTax,
  calculatePensionTax,
  calculateFinalSaleTax,
  DEFAULT_TAX_SETTINGS
} from './germanTaxCalculations';

export interface SimulationParams {
  currentAge: number;
  retirementAge: number;
  finalAge: number;
  monthlySavings: number;
  
  // Fund parameters
  expectedReturnPa: number;
  frontLoad: number;
  annualMgmtFee: number;
  
  // Tax settings
  taxSettings: TaxSettings;
  
  // Pension parameters (from existing data)
  pensionContribution?: number;
  pensionGuarantee?: number;
}

export interface YearlyData {
  age: number;
  year: number;
  
  // Fund savings
  fundGrossValue: number;
  fundNetValue: number;
  fundTaxPaid: number;
  fundVorabpauschale: number;
  fundAllowanceUsed: number;
  
  // Pension
  pensionValue: number;
  pensionTaxPaid: number;
  
  // Contributions
  totalContributions: number;
}

export interface SimulationResult {
  yearlyData: YearlyData[];
  summary: {
    at67: {
      fundNetValue: number;
      pensionValue: number;
      fundTotalTax: number;
      pensionTotalTax: number;
    };
    at85: {
      fundNetValue: number;
      pensionValue: number;
      fundTotalTax: number;
      pensionTotalTax: number;
    };
  };
}

/**
 * Calculate compound growth with monthly contributions
 */
function calculateCompoundGrowth(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  
  // Future value of existing principal
  const principalFV = principal * Math.pow(1 + monthlyRate, months);
  
  // Future value of monthly contributions (annuity)
  const contributionsFV = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  return principalFV + contributionsFV;
}

/**
 * Simulate fund savings with German tax implications
 */
function simulateFundSavings(
  params: SimulationParams
): YearlyData[] {
  const yearlyData: YearlyData[] = [];
  let currentValue = 0;
  let totalContributions = 0;
  let totalTaxPaid = 0;
  let totalVorabpauschale = 0;
  let cumulativeAllowanceUsed = 0;
  
  // Apply front load to first contribution
  const effectiveMonthlyContribution = params.monthlySavings * (1 - params.frontLoad / 100);
  
  for (let year = 0; year <= params.finalAge - params.currentAge; year++) {
    const age = params.currentAge + year;
    
    // Add yearly contributions (12 months)
    const yearlyContribution = params.monthlySavings * 12;
    const effectiveYearlyContribution = year === 0 ? 
      effectiveMonthlyContribution * 12 : yearlyContribution;
    
    totalContributions += yearlyContribution;
    
    // Calculate gross value with growth
    const previousValue = currentValue;
    currentValue = calculateCompoundGrowth(
      previousValue + effectiveYearlyContribution,
      0, // Already added contribution
      params.expectedReturnPa - params.annualMgmtFee, // Net return after management fees
      1 // One year
    );
    
    // Calculate taxes during accumulation phase
    let yearlyTax = 0;
    let vorabpauschale = 0;
    let allowanceUsed = 0;
    
    if (age < params.retirementAge) {
      // During accumulation: pay Vorabpauschale
      const investmentData: InvestmentData = {
        initialValue: totalContributions - yearlyContribution,
        currentValue: currentValue,
        yearlyContributions: effectiveYearlyContribution,
        managementFee: params.annualMgmtFee,
        frontLoad: params.frontLoad
      };
      
      const taxResult = calculateFundTax(
        investmentData,
        params.taxSettings,
        cumulativeAllowanceUsed
      );
      
      yearlyTax = taxResult.totalTax;
      vorabpauschale = taxResult.vorabpauschale;
      allowanceUsed = taxResult.allowanceUsed;
      cumulativeAllowanceUsed += allowanceUsed;
      totalVorabpauschale += vorabpauschale;
    }
    
    totalTaxPaid += yearlyTax;
    const netValue = currentValue - totalTaxPaid;
    
    yearlyData.push({
      age,
      year,
      fundGrossValue: currentValue,
      fundNetValue: netValue,
      fundTaxPaid: totalTaxPaid,
      fundVorabpauschale: totalVorabpauschale,
      fundAllowanceUsed: cumulativeAllowanceUsed,
      pensionValue: 0, // Will be calculated separately
      pensionTaxPaid: 0,
      totalContributions
    });
  }
  
  return yearlyData;
}

/**
 * Simulate pension payments and taxes
 */
function simulatePensionPayments(
  params: SimulationParams,
  yearlyData: YearlyData[]
): void {
  if (!params.pensionContribution || !params.pensionGuarantee) {
    return; // No pension data available
  }
  
  // Calculate total pension contributions until retirement
  const contributionYears = params.retirementAge - params.currentAge;
  const totalPensionContributions = params.pensionContribution * 12 * contributionYears;
  
  // Estimate pension value growth (conservative 2-3% annually)
  const pensionGrowthRate = 2.5;
  let pensionValue = 0;
  let totalPensionTax = 0;
  
  yearlyData.forEach((data, index) => {
    if (data.age < params.retirementAge) {
      // Accumulation phase: build pension value
      const yearlyPensionContribution = params.pensionContribution! * 12;
      pensionValue = calculateCompoundGrowth(
        pensionValue,
        params.pensionContribution!,
        pensionGrowthRate,
        1
      );
      data.pensionValue = pensionValue;
    } else {
      // Payment phase: receive pension and pay taxes
      const monthlyPension = params.pensionGuarantee!;
      const pensionData: PensionData = {
        monthlyPension,
        totalContributions: totalPensionContributions,
        guaranteedPension: monthlyPension,
        age: data.age
      };
      
      const taxResult = calculatePensionTax(pensionData, params.taxSettings);
      const yearlyPensionTax = taxResult.totalTax;
      totalPensionTax += yearlyPensionTax;
      
      // Pension value is the net present value of remaining payments
      const remainingYears = params.finalAge - data.age;
      const annualPension = monthlyPension * 12;
      const netAnnualPension = annualPension - yearlyPensionTax;
      
      // Simple present value calculation (could be more sophisticated)
      data.pensionValue = netAnnualPension * remainingYears;
      data.pensionTaxPaid = totalPensionTax;
    }
  });
}

/**
 * Run complete simulation for both products
 */
export function runPensionComparison(params: SimulationParams): SimulationResult {
  // Simulate fund savings
  const yearlyData = simulateFundSavings(params);
  
  // Add pension simulation
  simulatePensionPayments(params, yearlyData);
  
  // Calculate final sale tax for fund at retirement ages
  const dataAt67 = yearlyData.find(d => d.age === 67);
  const dataAt85 = yearlyData.find(d => d.age === 85);
  
  let fundNetAt67 = dataAt67?.fundNetValue || 0;
  let fundNetAt85 = dataAt85?.fundNetValue || 0;
  
  // Apply final sale tax if selling at these ages
  if (dataAt67) {
    const totalGains = dataAt67.fundGrossValue - dataAt67.totalContributions;
    const finalTaxResult = calculateFinalSaleTax(
      totalGains,
      dataAt67.fundVorabpauschale,
      params.taxSettings,
      dataAt67.fundAllowanceUsed
    );
    fundNetAt67 = dataAt67.fundGrossValue - dataAt67.fundTaxPaid - finalTaxResult.finalTax;
  }
  
  if (dataAt85) {
    const totalGains = dataAt85.fundGrossValue - dataAt85.totalContributions;
    const finalTaxResult = calculateFinalSaleTax(
      totalGains,
      dataAt85.fundVorabpauschale,
      params.taxSettings,
      dataAt85.fundAllowanceUsed
    );
    fundNetAt85 = dataAt85.fundGrossValue - dataAt85.fundTaxPaid - finalTaxResult.finalTax;
  }
  
  return {
    yearlyData,
    summary: {
      at67: {
        fundNetValue: fundNetAt67,
        pensionValue: dataAt67?.pensionValue || 0,
        fundTotalTax: dataAt67?.fundTaxPaid || 0,
        pensionTotalTax: dataAt67?.pensionTaxPaid || 0
      },
      at85: {
        fundNetValue: fundNetAt85,
        pensionValue: dataAt85?.pensionValue || 0,
        fundTotalTax: dataAt85?.fundTaxPaid || 0,
        pensionTotalTax: dataAt85?.pensionTaxPaid || 0
      }
    }
  };
}

/**
 * Create default simulation parameters
 */
export function createDefaultSimulationParams(
  overrides: Partial<SimulationParams> = {}
): SimulationParams {
  return {
    currentAge: 30,
    retirementAge: 67,
    finalAge: 85,
    monthlySavings: 300,
    expectedReturnPa: 7,
    frontLoad: 0,
    annualMgmtFee: 0.5,
    taxSettings: DEFAULT_TAX_SETTINGS,
    ...overrides
  };
}