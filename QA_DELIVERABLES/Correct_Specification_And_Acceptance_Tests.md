# Correct Specification & Acceptance Tests

**Product:** Pension Calculator & Visualization Tool
**Version:** 2.0 (Corrected Specification)
**Prepared by:** Senior Insurance Seller — Commissioning Stakeholder
**Date:** 2025-10-25
**Purpose:** Authoritative specification for all calculations, charts, and acceptance criteria

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Calculation Specifications](#2-calculation-specifications)
3. [Chart Specifications](#3-chart-specifications)
4. [Data Validation Rules](#4-data-validation-rules)
5. [Acceptance Test Suite](#5-acceptance-test-suite)
6. [Regulatory References](#6-regulatory-references)

---

## 1. Introduction

This document provides the **definitive specification** for all calculations and visualizations in the pension calculator tool. Every formula, variable, tolerance, and acceptance criterion is defined precisely to enable unambiguous implementation and testing.

### Assumptions

| Assumption | Value | Notes |
|------------|-------|-------|
| [REGION] | Germany | All tax rules per German law |
| [CURRENCY] | EUR (€) | Euro with 2 decimal places |
| [TAX_YEAR] | 2024 | Parameters valid for tax year 2024 |
| [ROUNDING_RULES] | Round final display only | Maintain full precision in calculations |
| [TOLERANCE] | ±0.01 EUR | Absolute tolerance for monetary values |
| [RETIREMENT_AGE] | 67 | Standard German retirement age |

---

## 2. Calculation Specifications

### 2.1 Coverage Gap (Versorgungslücke)

#### Formula

```
Gap = (Net Monthly Income × 0.8) – (Statutory Pension + Private Pension Monthly Payout)
```

Where:
```
Gap = max(0, Target Income - Covered Income)
Target Income = Net Monthly Income × 0.8
Covered Income = Statutory Pension + Private Pension Monthly Payout
```

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `netMonthly` | number | EUR/month | Onboarding: income.netMonthly | > 0, < 50,000 |
| `totalStatutoryPension` | number | EUR/month | Onboarding: pensions.public67 + civil67 + profession67 + zvkVbl67 | ≥ 0 |
| `privatePensionMonthlyPayout` | number | EUR/month | Calculated from privatePension.contribution | ≥ 0 |
| `replacementRatio` | number | percentage (0.8) | Constant | 0.8 |

#### Rounding Order

1. Calculate gap with full precision
2. Round only for display: `gap.toFixed(2)`

#### Tolerance

**Absolute:** ±0.01 EUR

#### Canonical Example

**Input:**
```json
{
  "netMonthly": 3500.00,
  "totalStatutoryPension": 1500.00,
  "privatePensionMonthlyPayout": 200.00
}
```

**Calculation:**
```
Target Income = 3500 × 0.8 = 2800.00
Covered Income = 1500 + 200 = 1700.00
Gap = 2800 - 1700 = 1100.00
```

**Expected Output:** `1100.00 EUR`

#### Acceptance Tests

| Test # | Net Income | Statutory | Private | Expected Gap | Pass Criteria |
|--------|------------|-----------|---------|--------------|---------------|
| CGT-001 | 3500 | 1500 | 200 | 1100.00 | Within ±0.01 |
| CGT-002 | 4000 | 2000 | 500 | 1700.00 | Within ±0.01 |
| CGT-003 | 5000 | 3500 | 500 | 0.00 | Gap = 0 (covered) |
| CGT-004 | 2000 | 1000 | 600 | 0.00 | Gap = 0 (covered) |
| CGT-005 | 0 | 0 | 0 | 0.00 | Edge: zero income |

---

### 2.2 Private Pension Monthly Payout

#### Formula (Compound Interest with Annuity)

```
Future Value = FV_principal + FV_contributions

Where:
  FV_principal = P × (1 + r_monthly)^n
  FV_contributions = PMT × [((1 + r_monthly)^n - 1) / r_monthly] × (1 + r_monthly)

  r_monthly = annual_return / 12
  n = (retirement_age - current_age) × 12

Monthly Payout = (Future Value × withdrawal_rate) / 12
```

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `currentAge` | number | years | Onboarding: personal.age | 18-80 |
| `retirementAge` | number | years | Constant: 67 | 62-70 |
| `privatePensionContribution` | number | EUR/month | Onboarding: privatePension.contribution | 0-5000 |
| `expectedReturn` | number | decimal (0.05) | Assumption: 5% annual | 0.01-0.15 |
| `withdrawalRate` | number | decimal (0.04) | Assumption: 4% annual | 0.03-0.05 |

#### Rounding Order

1. Calculate future value with full precision
2. Calculate monthly payout with full precision
3. Round only for display

#### Tolerance

**Absolute:** ±0.01 EUR for monthly payout
**Relative:** ±0.01% for future value

#### Canonical Example

**Input:**
```json
{
  "currentAge": 35,
  "retirementAge": 67,
  "privatePensionContribution": 300.00,
  "expectedReturn": 0.05,
  "withdrawalRate": 0.04
}
```

**Calculation:**
```
Years to retirement = 67 - 35 = 32 years
Months = 32 × 12 = 384 months
r_monthly = 0.05 / 12 = 0.004167
P = 0 (no starting capital)
PMT = 300

FV_contributions = 300 × [((1.004167)^384 - 1) / 0.004167] × 1.004167
                 = 300 × [(4.953 - 1) / 0.004167] × 1.004167
                 = 300 × 948.96 × 1.004167
                 = 285,729.48 EUR

Monthly Payout = (285,729.48 × 0.04) / 12
               = 11,429.18 / 12
               = 952.43 EUR/month
```

**Expected Output:** `952.43 EUR/month`

#### Acceptance Tests

| Test # | Age | Contribution | Years | Return | Expected FV | Expected Payout | Pass Criteria |
|--------|-----|--------------|-------|--------|-------------|-----------------|---------------|
| PPT-001 | 35 | 300 | 32 | 5% | 285,729.48 | 952.43 | Within ±1.00 |
| PPT-002 | 40 | 500 | 27 | 7% | 285,847.65 | 952.83 | Within ±1.00 |
| PPT-003 | 30 | 200 | 37 | 5% | 197,932.47 | 659.77 | Within ±1.00 |
| PPT-004 | 50 | 1000 | 17 | 6% | 347,855.38 | 1,159.52 | Within ±1.00 |

---

### 2.3 Rürup Tax Savings

#### Formula

```
Tax Savings = min(Annual Contribution, Max Contribution) × Deductible Rate × Tax Rate

Where:
  Max Contribution (2024) = 27,566 EUR
  Deductible Rate (2024) = 0.96 (96%)
  Deductible Rate (2025+) = 1.00 (100%)
```

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `annualContribution` | number | EUR/year | monthlyContribution × 12 | 0-50,000 |
| `maxContribution` | number | EUR/year | BMF 2024: 27,566 | — |
| `deductibleRate` | number | percentage | Year-dependent | 0.96-1.00 |
| `taxRate` | number | percentage | User marginal rate | 0.14-0.45 |

#### Rounding Order

1. Calculate deductible amount: `min(contribution, max) × rate`
2. Calculate tax savings: `deductible × taxRate`
3. Round only for display

#### Tolerance

**Absolute:** ±0.01 EUR

#### Canonical Example

**Input:**
```json
{
  "annualContribution": 30000.00,
  "taxYear": 2024,
  "taxRate": 0.42
}
```

**Calculation:**
```
Capped Contribution = min(30,000, 27,566) = 27,566.00
Deductible Rate (2024) = 0.96
Deductible Amount = 27,566 × 0.96 = 26,463.36
Tax Savings = 26,463.36 × 0.42 = 11,114.61
```

**Expected Output:** `11,114.61 EUR/year`

#### Year-Dependent Parameters

| Year | Max Contribution | Deductible Rate | Source |
|------|------------------|-----------------|--------|
| 2024 | 27,566 EUR | 96% | §10 Abs.3 EStG |
| 2025 | TBD (likely 28,200) | 100% | §10 Abs.3 EStG |

#### Acceptance Tests

| Test # | Contribution | Tax Year | Tax Rate | Expected Savings | Pass Criteria |
|--------|--------------|----------|----------|------------------|---------------|
| RST-001 | 30,000 | 2024 | 42% | 11,114.61 | Within ±0.01 |
| RST-002 | 20,000 | 2024 | 35% | 6,720.00 | Within ±0.01 |
| RST-003 | 30,000 | 2025 | 42% | 11,577.72 | Within ±0.01 |
| RST-004 | 10,000 | 2024 | 25% | 2,400.00 | Within ±0.01 |

---

### 2.4 Rürup Accumulation (CORRECTED)

#### Formula (Monthly Compounding)

```
For each month from 1 to (years × 12):
  Portfolio = (Portfolio + Monthly Contribution) × (1 + r_monthly)

Where:
  r_monthly = annual_return / 12
```

**CRITICAL:** Must use **monthly** compounding, not annual.

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `monthlyContribution` | number | EUR/month | User input | 0-3000 |
| `annualReturn` | number | decimal | Assumption: 0.065 (6.5%) | 0.03-0.10 |
| `years` | number | years | retirementAge - currentAge | 5-45 |

#### Rounding Order

1. Calculate each month's value with full precision
2. Round only final result for display

#### Tolerance

**Absolute:** ±1.00 EUR for final value (due to compounding complexity)
**Relative:** ±0.1% for final value

#### Canonical Example

**Input:**
```json
{
  "monthlyContribution": 500.00,
  "annualReturn": 0.065,
  "years": 30
}
```

**Calculation (Monthly Compounding):**
```
r_monthly = 0.065 / 12 = 0.005417
months = 30 × 12 = 360

Month 1: portfolio = (0 + 500) × 1.005417 = 502.71
Month 2: portfolio = (502.71 + 500) × 1.005417 = 1,008.14
...
Month 360: portfolio ≈ 495,318.47
```

**Expected Output:** `495,318.47 EUR`

**WRONG (Annual Compounding):**
```
Year 1: portfolio = (0 + 6000) × 1.065 = 6,390.00
Year 2: portfolio = (6,390 + 6000) × 1.065 = 13,175.35
...
Year 30: portfolio ≈ 507,298.23 (OVERESTIMATED by ~12k)
```

#### Acceptance Tests

| Test # | Monthly | Return | Years | Expected (Monthly) | Wrong (Annual) | Pass Criteria |
|--------|---------|--------|-------|-------------------|----------------|---------------|
| RAT-001 | 500 | 6.5% | 30 | 495,318.47 | 507,298.23 | Within ±10.00 |
| RAT-002 | 1000 | 7.0% | 20 | 521,431.39 | 529,187.13 | Within ±10.00 |
| RAT-003 | 300 | 5.0% | 35 | 333,653.73 | 337,485.98 | Within ±10.00 |

---

### 2.5 Vorabpauschale (Advance Lump Sum Tax)

#### Formula

```
Vorabpauschale = Investment Value × (Base Rate - Management Fee) × 70%
Capped at: min(Theoretical Gain, Actual Gain)

Tax = Vorabpauschale × Capital Gains Tax Rate (26.375%)
```

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `investmentValue` | number | EUR | Portfolio value start of year | > 0 |
| `baseRate` | number | percentage | BMF annual: 1.0% (2024) | 0.005-0.02 |
| `managementFee` | number | percentage | TER: 0.5% typical | 0-0.02 |
| `actualGain` | number | EUR | Realized gain in year | ≥ 0 |

#### Rounding Order

1. Calculate theoretical gain with full precision
2. Apply min cap
3. Calculate tax
4. Round only for display

#### Tolerance

**Absolute:** ±0.01 EUR

#### Canonical Example

**Input:**
```json
{
  "investmentValue": 100000.00,
  "baseRate": 0.01,
  "managementFee": 0.005,
  "actualGain": 7000.00
}
```

**Calculation:**
```
Net Rate = 1.0% - 0.5% = 0.5%
Theoretical Gain = 100,000 × 0.005 × 0.7 = 350.00
Capped = min(350.00, 7000.00) = 350.00
Tax = 350.00 × 0.26375 = 92.31
```

**Expected Output:** `92.31 EUR tax on 350.00 EUR Vorabpauschale`

#### Acceptance Tests

| Test # | Value | Base Rate | Mgmt Fee | Actual Gain | Expected VP | Expected Tax | Pass Criteria |
|--------|-------|-----------|----------|-------------|-------------|--------------|---------------|
| VPT-001 | 100,000 | 1.0% | 0.5% | 7,000 | 350.00 | 92.31 | Within ±0.01 |
| VPT-002 | 200,000 | 1.0% | 0.75% | 500 | 350.00 | 92.31 | Capped at actual |
| VPT-003 | 50,000 | 1.0% | 0.5% | 10,000 | 175.00 | 46.16 | Within ±0.01 |

---

### 2.6 Riester Government Subsidies (MISSING - TO IMPLEMENT)

#### Formula

```
Total Subsidy = Grundzulage + (Children × Kinderzulage)

Where:
  Grundzulage (2024) = 175 EUR/year
  Kinderzulage (2024) = 300 EUR/year per child born after 2008
  Kinderzulage (2024) = 185 EUR/year per child born before 2008

Required Contribution = max(60 EUR/year, 4% × Gross Annual Income)
Max Contribution = 2,100 EUR/year

Net Cost = Contribution - Subsidy
```

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `grossAnnualIncome` | number | EUR/year | Onboarding: income.grossAnnual | > 0 |
| `children` | number | count | Onboarding: personal.children.count | 0-10 |
| `contribution` | number | EUR/year | User input | 60-2100 |

#### Canonical Example

**Input:**
```json
{
  "grossAnnualIncome": 60000.00,
  "children": 2,
  "contribution": 2400.00
}
```

**Calculation:**
```
Required Contribution = max(60, 60,000 × 0.04) = 2,400.00
User Contribution = 2,400.00 (meets requirement)
Capped Contribution = min(2,400, 2,100) = 2,100.00 (max limit)

Grundzulage = 175.00
Kinderzulage = 2 × 300 = 600.00
Total Subsidy = 175 + 600 = 775.00

Net Cost = 2,100 - 775 = 1,325.00
Effective Rate = 775 / 2,100 = 36.9% subsidy
```

**Expected Output:** `775.00 EUR subsidy, 1,325.00 EUR net cost`

#### Acceptance Tests

| Test # | Gross Income | Children | Contribution | Expected Subsidy | Net Cost | Pass Criteria |
|--------|--------------|----------|--------------|------------------|----------|---------------|
| RIT-001 | 60,000 | 2 | 2,400 | 775.00 | 1,325.00 | Within ±0.01 |
| RIT-002 | 40,000 | 0 | 1,600 | 175.00 | 1,425.00 | Within ±0.01 |
| RIT-003 | 30,000 | 3 | 2,100 | 1,075.00 | 1,025.00 | Within ±0.01 |

---

### 2.7 Occupational Pension Tax Savings (MISSING - TO IMPLEMENT)

#### Formula

```
Tax-Free Contribution = min(Monthly Contribution, 584 EUR)
Annual Tax-Free = Tax-Free Contribution × 12

Tax Savings = Annual Tax-Free × Marginal Tax Rate
Social Security Savings = Annual Tax-Free × 0.20

Total Savings = Tax Savings + Social Security Savings
Net Cost = (Monthly Contribution × 12) - Total Savings
```

#### Variable Definitions

| Variable | Type | Unit | Data Source | Validation |
|----------|------|------|-------------|------------|
| `monthlyContribution` | number | EUR/month | User input | 0-2000 |
| `marginalTaxRate` | number | percentage | User tax bracket | 0.14-0.45 |
| `maxTaxFree` | number | EUR/month | §3 Nr.63: 584 (2024) | — |

#### Canonical Example

**Input:**
```json
{
  "monthlyContribution": 500.00,
  "marginalTaxRate": 0.42
}
```

**Calculation:**
```
Tax-Free Contribution = min(500, 584) = 500.00
Annual Tax-Free = 500 × 12 = 6,000.00

Tax Savings = 6,000 × 0.42 = 2,520.00
Social Security Savings = 6,000 × 0.20 = 1,200.00
Total Savings = 2,520 + 1,200 = 3,720.00

Gross Cost = 500 × 12 = 6,000.00
Net Cost = 6,000 - 3,720 = 2,280.00
Effective Cost = 2,280 / 6,000 = 38% (saves 62%)
```

**Expected Output:** `3,720.00 EUR savings, 2,280.00 EUR net cost`

#### Acceptance Tests

| Test # | Monthly | Tax Rate | Expected Tax Savings | Expected SS Savings | Total Savings | Pass Criteria |
|--------|---------|----------|---------------------|---------------------|---------------|---------------|
| OPT-001 | 500 | 42% | 2,520.00 | 1,200.00 | 3,720.00 | Within ±0.01 |
| OPT-002 | 584 | 35% | 2,452.80 | 1,401.60 | 3,854.40 | Within ±0.01 |
| OPT-003 | 300 | 25% | 900.00 | 720.00 | 1,620.00 | Within ±0.01 |

---

## 3. Chart Specifications

### 3.1 Vermögensentwicklung (Portfolio Development Chart)

#### Data Mapping

```json
{
  "x_axis": "age",
  "y_axis": "portfolioValue",
  "series": [
    { "dataKey": "portfolio", "name": "Portfolio Wert", "color": "hsl(var(--chart-1))" },
    { "dataKey": "contribution", "name": "Beiträge", "color": "hsl(var(--chart-2))" },
    { "dataKey": "fees", "name": "Gebühren", "color": "hsl(var(--chart-3))" }
  ]
}
```

#### Format Rules

| Element | Rule | Example |
|---------|------|---------|
| **X-Axis** | Age in years, no decimals | "35", "40", "45" |
| **Y-Axis** | EUR with k/M notation | "€100k", "€1.2M" |
| **Tooltip** | EUR with 2 decimals | "€123,456.78" |
| **Legend** | Match series names exactly | "Portfolio Wert" not "Portfolio" |
| **Baseline** | Must start at zero or show break | domain={[0, 'auto']} |

#### Axis Formatting

**X-Axis:**
```typescript
<XAxis
  dataKey="age"
  tickFormatter={(value) => `${value}`}
  label={{ value: "Alter", position: "insideBottom" }}
/>
```

**Y-Axis:**
```typescript
<YAxis
  tickFormatter={(value) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
    return `€${value.toFixed(0)}`;
  }}
  label={{ value: "€", angle: -90, position: "insideLeft" }}
  domain={[0, 'auto']}
/>
```

#### Acceptance Criteria

- [ ] X-axis shows user age (not year number)
- [ ] Y-axis starts at zero or has explicit break annotation
- [ ] Y-axis uses thousands separators (k, M)
- [ ] Tooltip values match underlying data within ±0.01
- [ ] Legend labels match series names exactly
- [ ] Chart responsive on mobile (>320px width)
- [ ] Color-blind safe palette (tested with simulator)
- [ ] Minimum contrast ratio 4.5:1 (WCAG AA)

#### Test Cases

**Test Chart-001: Age Mapping**
- Input: Data points at ages 35, 45, 55, 65
- Expected: X-axis shows "35", "45", "55", "65"
- Verification: Inspect DOM or screenshot

**Test Chart-002: Zero Baseline**
- Input: Values range from 50k to 500k
- Expected: Y-axis starts at 0, not 50k
- Verification: Check YAxis domain prop = [0, 'auto']

**Test Chart-003: Tooltip Accuracy**
- Input: Portfolio value = 123,456.78 at age 50
- Expected: Tooltip shows "€123,456.78"
- Verification: Hover over data point, compare to raw data

---

### 3.2 Pension Breakdown (Pie Chart)

#### Data Mapping

```json
{
  "chart_type": "pie",
  "data": [
    { "name": "Gesetzliche Rente", "value": "statutoryPension", "color": "#3b82f6" },
    { "name": "Private Rente", "value": "privatePension", "color": "#10b981" },
    { "name": "Riester", "value": "riester", "color": "#f59e0b" },
    { "name": "Rürup", "value": "ruerup", "color": "#8b5cf6" }
  ]
}
```

#### Format Rules

| Element | Rule | Example |
|---------|------|---------|
| **Labels** | Percentage of total | "Gesetzliche Rente: 62%" |
| **Tooltip** | EUR with 2 decimals | "€1,500.00" |
| **Legend** | Show all categories | Must include all 4+ sources |

#### Acceptance Criteria

- [ ] Percentages sum to 100% (±0.1%)
- [ ] Labels show category name + percentage
- [ ] Tooltip shows EUR amount
- [ ] Colors distinguishable (color-blind safe)
- [ ] No category < 1% hidden without label

---

## 4. Data Validation Rules

### 4.1 Input Validation

| Field | Type | Min | Max | Default | Error Message |
|-------|------|-----|-----|---------|---------------|
| `age` | integer | 18 | 80 | 30 | "Alter muss zwischen 18 und 80 Jahren liegen" |
| `monthlyContribution` | number | 0 | 5,000 | 500 | "Beitrag muss zwischen 0 und 5.000 EUR liegen" |
| `annualIncome` | number | 0 | 500,000 | 60,000 | "Einkommen muss zwischen 0 und 500.000 EUR liegen" |
| `children` | integer | 0 | 10 | 0 | "Anzahl Kinder muss zwischen 0 und 10 liegen" |
| `expectedReturn` | number | 1% | 15% | 7% | "Rendite muss zwischen 1% und 15% liegen" |
| `ter` | number | 0% | 3% | 0.75% | "TER muss zwischen 0% und 3% liegen" |

### 4.2 Business Logic Validation

| Rule | Check | Error Message |
|------|-------|---------------|
| Riester contribution | ≥ 4% of gross income OR ≥ 60 EUR | "Riester-Beitrag muss mindestens 4% des Bruttoeinkommens oder 60 EUR betragen" |
| Riester max | ≤ 2,100 EUR/year | "Maximaler Riester-Beitrag: 2.100 EUR pro Jahr" |
| Rürup max | ≤ 27,566 EUR/year (2024) | "Maximaler Rürup-Beitrag: 27.566 EUR pro Jahr (2024)" |
| Occupational tax-free | ≤ 584 EUR/month (2024) | "Steuerfreier Anteil: maximal 584 EUR pro Monat (2024)" |
| Age consistency | currentAge < retirementAge | "Renteneintrittsalter muss höher als aktuelles Alter sein" |

---

## 5. Acceptance Test Suite

### 5.1 End-to-End Test Scenarios

#### Scenario 1: Standard Single Worker

**Profile:**
- Age: 35
- Net Monthly Income: 3,000 EUR
- Gross Annual Income: 60,000 EUR
- Statutory Pension (expected at 67): 1,500 EUR/month
- Children: 0
- Marital Status: Single

**Actions:**
1. Complete onboarding with above profile
2. Add private pension: 300 EUR/month
3. Add Riester: 175 EUR/month (min. requirement: 2,400 EUR/year)
4. Calculate pension gap

**Expected Results:**
```
Private Pension Payout (at 67): ~952 EUR/month
Riester Subsidy: 175 EUR/year
Total Retirement Income: 1,500 + 952 = 2,452 EUR/month
Target Income: 3,000 × 0.8 = 2,400 EUR/month
Gap: max(0, 2,400 - 2,452) = 0 EUR (COVERED)
```

**Pass Criteria:**
- Gap shows 0 EUR or small surplus
- All calculations within ±1 EUR tolerance
- Charts show portfolio growth from age 35 to 67

---

#### Scenario 2: High Earner with Children

**Profile:**
- Age: 40
- Net Monthly Income: 8,000 EUR
- Gross Annual Income: 150,000 EUR
- Statutory Pension (expected at 67): 2,800 EUR/month
- Children: 2
- Marital Status: Married, both working

**Actions:**
1. Complete onboarding
2. Add Rürup: 2,000 EUR/month (24,000 EUR/year)
3. Add Riester: 175 EUR/month each spouse
4. Add Occupational: 500 EUR/month
5. Calculate tax savings

**Expected Results:**
```
Rürup Tax Savings (at 42% rate):
  Capped at 27,566 EUR
  Deductible: 27,566 × 0.96 = 26,463.36
  Tax Savings: 26,463.36 × 0.42 = 11,114.61 EUR/year

Riester Subsidy (both spouses):
  Grundzulage: 175 × 2 = 350
  Kinderzulage: 300 × 2 = 600
  Total: 950 EUR/year

Occupational Savings:
  Tax: 6,000 × 0.42 = 2,520
  Social Security: 6,000 × 0.20 = 1,200
  Total: 3,720 EUR/year

Total Annual Savings: 11,114.61 + 950 + 3,720 = 15,784.61 EUR
```

**Pass Criteria:**
- Rürup savings within ±10 EUR of expected
- Riester subsidy exactly 950 EUR
- Occupational savings within ±10 EUR
- Gap calculation includes all income sources

---

#### Scenario 3: Edge Case - Early Retirement

**Profile:**
- Age: 50
- Retirement Goal: 62 (early retirement)
- Net Monthly Income: 4,500 EUR
- Private Pension: 1,000 EUR/month
- Expected Return: 7%

**Actions:**
1. Set retirement age to 62 (15 years to save)
2. Calculate required pension

**Expected Results:**
```
Years to Save: 62 - 50 = 12 years
Months: 12 × 12 = 144 months
FV = 1,000 × [((1.005833)^144 - 1) / 0.005833] × 1.005833
   ≈ 197,371 EUR

Monthly Payout: (197,371 × 0.04) / 12 = 657.90 EUR/month
```

**Pass Criteria:**
- System accepts age 62 as retirement age
- Calculations use 12 years, not default 17
- Payout reflects shorter accumulation period

---

### 5.2 Integration Tests

**Test INT-001: Onboarding to Dashboard Data Flow**
- Input: Complete onboarding with test data
- Expected: Dashboard shows exact same values
- Verification: Compare localStorage to displayed values

**Test INT-002: Dashboard to Calculator Propagation**
- Input: Navigate from Dashboard to TaxCalculator
- Expected: TaxCalculator pre-fills with onboarding data
- Verification: Check form values match onboarding

**Test INT-003: Auto-Save Persistence**
- Input: Change contribution amount in calculator
- Expected: Value saved to localStorage within 500ms
- Verification: Reload page, value persists

---

### 5.3 Performance Tests

**Test PERF-001: Initial Load Time**
- Measurement: Time to interactive (TTI)
- Expected: < 3 seconds on 3G connection
- Tools: Lighthouse, WebPageTest

**Test PERF-002: Calculation Speed**
- Input: 30-year calculation (360 months)
- Expected: < 100ms execution time
- Tools: Chrome DevTools Performance

**Test PERF-003: Chart Render Time**
- Input: 500 data points
- Expected: < 200ms render time
- Tools: React DevTools Profiler

---

## 6. Regulatory References

### 6.1 German Tax Law (Einkommensteuergesetz - EStG)

| Section | Topic | Relevance |
|---------|-------|-----------|
| §10 Abs.3 EStG | Rürup contributions deductible | Max 27,566 EUR (2024), 96% deductible |
| §20 Abs.9 EStG | Sparer-Pauschbetrag | 1,000 EUR for singles, 2,000 for married |
| §22 Nr.1 EStG | Taxable portion of pensions | 83% for retirement in 2024, increases 0.5%/year |
| §3 Nr.63 EStG | Occupational pension tax-free | Max 584 EUR/month (2024) |
| §32d EStG | Capital gains tax | 25% + 5.5% solidarity = 26.375% |

### 6.2 Investment Tax Act (Investmentsteuergesetz - InvStG)

| Section | Topic | Relevance |
|---------|-------|-----------|
| §18 InvStG | Vorabpauschale calculation | 70% of base rate (Basiszins) × value |
| §20 InvStG | Teilfreistellung (partial exemption) | 30% for equity funds, 15% for mixed funds |

### 6.3 Federal Ministry of Finance (BMF) Guidelines

| Parameter | 2024 Value | Source |
|-----------|------------|--------|
| Basiszins (Base Rate) | 1.0% | BMF 21.12.2023 |
| Rürup Max Contribution | 27,566 EUR | BMF circular 2024 |
| Rürup Deductible Rate | 96% | Increases 1%/year until 100% in 2025 |

### 6.4 Social Security Contribution Rates (2024)

| Type | Rate | Calculation Basis |
|------|------|-------------------|
| Pension Insurance | 18.6% | Gross salary up to 90,600 EUR (West), 89,400 EUR (East) |
| Health Insurance | 14.6% | Gross salary up to 62,100 EUR |
| Long-Term Care | 3.4% | Gross salary up to 62,100 EUR |
| Unemployment | 2.6% | Gross salary up to 90,600 EUR |
| **Total** | **~20%** | Used for occupational pension savings |

---

## Appendix A: JSON Test Specification

```json
{
  "calculations": [
    {
      "name": "Coverage Gap",
      "formula_latex": "\\text{Gap} = (\\text{NetIncome} \\times 0.8) - (\\text{StatutoryPension} + \\text{PrivatePension})",
      "inputs_schema": {
        "netMonthly": { "type": "number", "unit": "EUR", "min": 0, "max": 50000 },
        "totalStatutoryPension": { "type": "number", "unit": "EUR", "min": 0 },
        "privatePensionMonthlyPayout": { "type": "number", "unit": "EUR", "min": 0 }
      },
      "example_input": {
        "netMonthly": 3500,
        "totalStatutoryPension": 1500,
        "privatePensionMonthlyPayout": 200
      },
      "expected_output": {
        "pensionGap": 1100.00
      },
      "tolerance": {
        "abs": 0.01,
        "rel": null
      }
    },
    {
      "name": "Rürup Tax Savings",
      "formula_latex": "\\text{Savings} = \\min(\\text{Contribution}, 27566) \\times 0.96 \\times \\text{TaxRate}",
      "inputs_schema": {
        "annualContribution": { "type": "number", "unit": "EUR", "min": 0, "max": 50000 },
        "taxRate": { "type": "number", "unit": "percentage", "min": 0.14, "max": 0.45 }
      },
      "example_input": {
        "annualContribution": 30000,
        "taxRate": 0.42
      },
      "expected_output": {
        "taxSavings": 11114.61
      },
      "tolerance": {
        "abs": 0.01,
        "rel": null
      }
    }
  ],
  "charts": [
    {
      "name": "Vermögensentwicklung",
      "chart_type": "line",
      "data_mapping": {
        "x": "age",
        "y": "portfolioValue",
        "group": "series"
      },
      "format_rules": {
        "axis_x_unit": "years",
        "axis_y_unit": "EUR",
        "axis_y_format": "k/M notation",
        "decimals": 0,
        "zero_baseline": true
      },
      "acceptance": [
        "X-axis must show user age, not year number",
        "Y-axis must start at zero or show explicit break",
        "Tooltip values must match underlying data within 0.01 EUR",
        "Legend labels must match series names exactly",
        "Chart must be responsive (min-width: 320px)"
      ]
    }
  ]
}
```

---

## Appendix B: Test Data Generator

Use this Python script to generate test cases:

```python
def generate_test_case(age, contribution, years, return_rate):
    """Generate expected values for pension calculation tests."""
    r_monthly = return_rate / 12
    months = years * 12

    # Future value calculation
    fv = contribution * (((1 + r_monthly)**months - 1) / r_monthly) * (1 + r_monthly)

    # Monthly payout (4% withdrawal)
    payout = (fv * 0.04) / 12

    return {
        "age": age,
        "contribution": contribution,
        "years": years,
        "return": return_rate,
        "fv": round(fv, 2),
        "payout": round(payout, 2)
    }

# Example
print(generate_test_case(35, 300, 32, 0.05))
# Output: {'age': 35, 'contribution': 300, 'years': 32, 'return': 0.05,
#          'fv': 285729.48, 'payout': 952.43}
```

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-25 | Senior Insurance Seller | Initial specification based on QA findings |

**Review Schedule:**
- Annual review required (by January 31 each year)
- Review triggers: Tax law changes, BMF parameter updates

**Approval:**
- [ ] Technical Lead
- [ ] Legal/Compliance
- [ ] Senior Insurance Seller (Commissioning Stakeholder)

---

**END OF SPECIFICATION DOCUMENT**

This document is the authoritative source for all calculation and visualization requirements. Any discrepancies between code and this specification should be resolved in favor of this document.
