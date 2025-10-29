import type { InsertPrivatePensionPlan } from "@shared/schema";

export interface SimulationPoint {
  year: number;
  month: number;
  age: number;
  contribution: number;
  portfolioValue: number;
  fees: number;
  taxes: number;
  isPayoutPhase: boolean;
  payout?: number;
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

export function calculatePrivatePension(plan: InsertPrivatePensionPlan): SimulationResults {
  const {
    currentAge,
    startAge,
    monthlyContribution,
    startInvestment,
    termYears,
    targetMaturityValue,
    payoutStartAge,
    payoutEndAge,
    payoutMode,
    annuityRate,
    safeWithdrawalRate,
    policyFeeAnnualPct,
    policyFixedAnnual,
    taxRatePayout,
    expectedReturn,
    ter,
    volatility
  } = plan;

  const monthlyReturn = (expectedReturn || 0.075) / 12;
  const monthlyTer = (ter || 0.0075) / 12;
  const monthlyPolicyFee = (policyFeeAnnualPct || 0.004) / 12;
  const monthlyFixedFee = (policyFixedAnnual || 0) / 12;

  // Use the provided current age from form data
  const userCurrentAge = currentAge || 30;
  const totalContributionMonths = termYears * 12;
  const payoutStartMonth = (payoutStartAge - userCurrentAge) * 12;
  const payoutEndMonth = (payoutEndAge - userCurrentAge) * 12;

  let portfolioValue = startInvestment || 0;
  let totalContributions = startInvestment || 0;
  let totalFees = 0;
  let totalTaxes = 0;

  const seriesAnspar: SimulationPoint[] = [];
  const seriesPayout: SimulationPoint[] = [];

  // Accumulation phase
  for (let month = 0; month < payoutStartMonth; month++) {
    const year = Math.floor(month / 12);
    const ageAtThisPoint = userCurrentAge + year;
    
    // Add monthly contribution during contribution period
    const contribution = month < totalContributionMonths ? (monthlyContribution || 0) : 0;
    portfolioValue += contribution;
    totalContributions += contribution;

    // Apply investment returns
    const grossReturn = portfolioValue * monthlyReturn;
    portfolioValue += grossReturn;

    // Deduct fees
    const terFee = portfolioValue * monthlyTer;
    const policyFee = portfolioValue * monthlyPolicyFee + monthlyFixedFee;
    const totalMonthlyFees = terFee + policyFee;
    
    portfolioValue -= totalMonthlyFees;
    totalFees += totalMonthlyFees;

    seriesAnspar.push({
      year,
      month: month % 12,
      age: ageAtThisPoint,
      contribution,
      portfolioValue,
      fees: totalMonthlyFees,
      taxes: 0, // No taxes during accumulation for private pension
      isPayoutPhase: false
    });
  }

  const maturityValue = portfolioValue;

  // Payout phase
  for (let month = payoutStartMonth; month < payoutEndMonth && portfolioValue > 0; month++) {
    const year = Math.floor(month / 12);
    const ageAtThisPoint = userCurrentAge + year;
    
    // Calculate payout based on mode
    let payout = 0;
    if (payoutMode === "annuity") {
      // Simple annuity calculation
      const remainingMonths = payoutEndMonth - month;
      payout = (portfolioValue * (annuityRate || 0.04)) / 12;
    } else {
      // Flexible withdrawal
      payout = portfolioValue * (safeWithdrawalRate || 0.04) / 12;
    }

    // Apply investment returns on remaining portfolio
    const grossReturn = portfolioValue * monthlyReturn;
    portfolioValue += grossReturn;

    // Deduct payout
    portfolioValue -= payout;

    // Calculate taxes on payout (correct for private pension plans)
    // For private pension plans (NOT Rürup), only the earnings portion is taxable
    // Rürup would be different: 83% taxable for retirement in 2024, 83.5% for 2025
    const contributionPortion = totalContributions / maturityValue;
    const earningsPortion = 1 - contributionPortion;
    const taxableAmount = payout * earningsPortion; // Only earnings are taxable for private pension
    const monthlyTax = taxableAmount * (taxRatePayout || 0.25);
    totalTaxes += monthlyTax;

    // Deduct fees
    const terFee = portfolioValue * monthlyTer;
    const policyFee = portfolioValue * monthlyPolicyFee + monthlyFixedFee;
    const totalMonthlyFees = terFee + policyFee;
    
    portfolioValue -= totalMonthlyFees;
    totalFees += totalMonthlyFees;

    seriesPayout.push({
      year,
      month: month % 12,
      age: ageAtThisPoint,
      contribution: 0,
      portfolioValue: Math.max(0, portfolioValue),
      fees: totalMonthlyFees,
      taxes: monthlyTax,
      isPayoutPhase: true,
      payout: payout - monthlyTax
    });
  }

  // Calculate KPIs
  const projectedValue = maturityValue;
  const targetGap = targetMaturityValue ? projectedValue - targetMaturityValue : 0;
  
  // Correct monthly pension calculation based on remaining portfolio and life expectancy
  const payoutYears = (payoutEndAge - payoutStartAge);
  const monthlyPension = payoutMode === "annuity" 
    ? (projectedValue * (annuityRate || 0.04)) / 12 
    : projectedValue * (safeWithdrawalRate || 0.04) / 12;
  
  const capitalGains = projectedValue - totalContributions;
  const totalCosts = totalFees + totalTaxes; // Include taxes in total costs
  const netReturn = projectedValue - totalCosts; // Net return should subtract all costs

  return {
    seriesAnspar,
    seriesPayout,
    kpis: {
      projectedValue,
      targetGap,
      monthlyPension,
      totalFees,
      totalContributions,
      capitalGains,
      totalCosts,
      netReturn,
      totalTaxes
    }
  };
}
