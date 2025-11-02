import { InsuranceProduct, GuaranteeCalculation } from '../types/insurance';

interface CalculationInput {
  monthlyContribution: number;
  contributionPeriod: number; // in years
  product: InsuranceProduct;
}

/**
 * Calculate guarantee scenarios for insurance product
 */
export function calculateGuaranteeScenarios(input: CalculationInput): GuaranteeCalculation {
  const { monthlyContribution, contributionPeriod, product } = input;

  // Total contributions
  const totalMonths = contributionPeriod * 12;
  const totalContributions = monthlyContribution * totalMonths;

  // Calculate costs
  const costs = calculateTotalCosts(input);

  // Net contributions after acquisition costs
  const netContributions = totalContributions * (1 - product.costs.abschlusskosten / 100);

  // Annual recurring costs
  const annualCostRate =
    product.costs.verwaltungskosten +
    product.costs.fondskosten +
    product.costs.garantiekosten +
    product.costs.risikokosten;

  // GUARANTEED SCENARIO
  const guaranteedAmount = totalContributions * (product.guaranteeLevel / 100);
  const guaranteedAfterCosts = guaranteedAmount; // Guarantee is typically net of costs
  const guaranteedReturn = ((guaranteedAfterCosts - totalContributions) / totalContributions) * 100;

  // EXPECTED SCENARIO (6% gross return assumption)
  const expectedGrossReturn = 0.06;
  const expectedNetReturn = expectedGrossReturn - (annualCostRate / 100);
  const expectedFutureValue = calculateFutureValue(
    monthlyContribution,
    expectedNetReturn,
    contributionPeriod
  );
  const expectedAfterCosts = expectedFutureValue * (1 - product.costs.abschlusskosten / 100);
  const expectedReturn = ((expectedAfterCosts - totalContributions) / totalContributions) * 100;

  // OPTIMISTIC SCENARIO (8% gross return assumption)
  const optimisticGrossReturn = 0.08;
  const optimisticNetReturn = optimisticGrossReturn - (annualCostRate / 100);
  const optimisticFutureValue = calculateFutureValue(
    monthlyContribution,
    optimisticNetReturn,
    contributionPeriod
  );
  const optimisticAfterCosts = optimisticFutureValue * (1 - product.costs.abschlusskosten / 100);
  const optimisticReturn = ((optimisticAfterCosts - totalContributions) / totalContributions) * 100;

  // Death benefit calculations
  const halfwayValue = calculateFutureValue(
    monthlyContribution,
    expectedNetReturn,
    contributionPeriod / 2
  );
  const halfwayContributions = monthlyContribution * (contributionPeriod / 2) * 12;

  return {
    monthlyContribution,
    contributionPeriod,
    guaranteeLevel: product.guaranteeLevel,
    product,

    totalContributions,
    totalCosts: costs.total,

    guaranteed: {
      amount: guaranteedAmount,
      afterCosts: guaranteedAfterCosts,
      returnPercent: guaranteedReturn,
    },

    expected: {
      amount: expectedFutureValue,
      afterTax: calculateAfterTax(expectedFutureValue, totalContributions, contributionPeriod),
      returnPercent: expectedReturn,
      assumptions: '6% Rendite p.a. (nach Kosten: ' + (expectedNetReturn * 100).toFixed(2) + '% p.a.)',
    },

    optimistic: {
      amount: optimisticFutureValue,
      afterTax: calculateAfterTax(optimisticFutureValue, totalContributions, contributionPeriod),
      returnPercent: optimisticReturn,
      assumptions: '8% Rendite p.a. (nach Kosten: ' + (optimisticNetReturn * 100).toFixed(2) + '% p.a.)',
    },

    deathBenefit: {
      atHalfway: Math.max(
        halfwayValue * product.deathBenefit.duringAccumulation,
        halfwayContributions * 1.1
      ),
      atEnd: Math.max(
        expectedFutureValue * product.deathBenefit.duringAccumulation,
        totalContributions * 1.1
      ),
    },
  };
}

/**
 * Calculate future value of monthly contributions with compound interest
 */
function calculateFutureValue(
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
): number {
  const monthlyRate = annualReturnRate / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    return monthlyContribution * totalMonths;
  }

  // Future value of annuity formula
  const futureValue = monthlyContribution *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);

  return futureValue;
}

/**
 * Calculate total costs over contract period
 */
function calculateTotalCosts(input: CalculationInput): {
  acquisition: number;
  recurring: number;
  total: number;
} {
  const { monthlyContribution, contributionPeriod, product } = input;
  const totalContributions = monthlyContribution * contributionPeriod * 12;

  // Acquisition costs (one-time, % of total contributions)
  const acquisitionCosts = totalContributions * (product.costs.abschlusskosten / 100);

  // Recurring costs (annual, applied to average portfolio value)
  // Simplified: assume average portfolio value is ~50% of final value
  const estimatedAvgPortfolio = totalContributions * 0.6; // Conservative estimate
  const annualRecurringCostRate =
    product.costs.verwaltungskosten +
    product.costs.fondskosten +
    product.costs.garantiekosten +
    product.costs.risikokosten;

  const recurringCosts = estimatedAvgPortfolio * (annualRecurringCostRate / 100) * contributionPeriod;

  return {
    acquisition: acquisitionCosts,
    recurring: recurringCosts,
    total: acquisitionCosts + recurringCosts,
  };
}

/**
 * Calculate after-tax payout using 12-year rule
 */
function calculateAfterTax(
  finalValue: number,
  totalContributions: number,
  years: number
): number {
  const capitalGain = finalValue - totalContributions;

  // 12-year rule: If contract is held for 12+ years and payout at 62+,
  // only 50% of gains are taxed at personal rate (~26.375% avg)
  if (years >= 12) {
    const taxableGain = capitalGain * 0.5;
    const taxRate = 0.26375; // Average German tax rate on half of gains
    const tax = taxableGain * taxRate;
    return finalValue - tax;
  } else {
    // Standard capital gains tax (Abgeltungssteuer)
    const tax = capitalGain * 0.26375; // 25% + Soli
    return finalValue - tax;
  }
}

/**
 * Generate year-by-year projections for charting
 */
export function generateYearlyProjections(
  calculation: GuaranteeCalculation
): Array<{
  year: number;
  contributions: number;
  guaranteed: number;
  expected: number;
  optimistic: number;
}> {
  const { monthlyContribution, contributionPeriod, product } = calculation;
  const projections: Array<{
    year: number;
    contributions: number;
    guaranteed: number;
    expected: number;
    optimistic: number;
  }> = [];

  // Calculate net return rates
  const annualCostRate =
    product.costs.verwaltungskosten +
    product.costs.fondskosten +
    product.costs.garantiekosten +
    product.costs.risikokosten;

  const expectedNetReturn = 0.06 - (annualCostRate / 100);
  const optimisticNetReturn = 0.08 - (annualCostRate / 100);

  // Generate projections for each year
  for (let year = 0; year <= contributionPeriod; year++) {
    const contributions = monthlyContribution * year * 12;

    // Guaranteed grows linearly with guarantee level
    const guaranteed = contributions * (product.guaranteeLevel / 100);

    // Expected scenario
    const expected = year === 0 ? 0 : calculateFutureValue(
      monthlyContribution,
      expectedNetReturn,
      year
    );

    // Optimistic scenario
    const optimistic = year === 0 ? 0 : calculateFutureValue(
      monthlyContribution,
      optimisticNetReturn,
      year
    );

    projections.push({
      year,
      contributions,
      guaranteed,
      expected,
      optimistic,
    });
  }

  return projections;
}

/**
 * Calculate effective cost ratio (reduction in return)
 */
export function calculateEffectiveCostRatio(product: InsuranceProduct): number {
  return (
    product.costs.verwaltungskosten +
    product.costs.fondskosten +
    product.costs.garantiekosten +
    product.costs.risikokosten
  );
}

/**
 * Compare guarantee scenarios between products
 */
export function compareProducts(
  products: InsuranceProduct[],
  monthlyContribution: number,
  years: number
): Array<{
  product: InsuranceProduct;
  calculation: GuaranteeCalculation;
}> {
  return products.map(product => ({
    product,
    calculation: calculateGuaranteeScenarios({
      monthlyContribution,
      contributionPeriod: years,
      product,
    }),
  }));
}
