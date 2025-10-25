# QA Deliverables Package

**Product:** Pension Calculator & Visualization Tool
**QA Date:** 2025-10-25
**Prepared by:** Senior Insurance Seller — Commissioning Stakeholder
**Investment:** $100,000
**Status:** ⚠️ **NOT PRODUCTION-READY** — Critical fixes required

---

## Package Contents

This folder contains the complete Quality Assurance deliverables for the pension calculator tool review:

### 📄 1. Executive_QA_Report.md
**Purpose:** One-page executive summary for stakeholders
**Contents:**
- Overall assessment and rating (6.5/10)
- Pass/fail status by area
- Top 10 risks ranked by severity
- Coverage & defects heatmap
- Timeline for fixes
- Investment quality assessment

**Key Finding:** 2 critical calculation errors must be fixed before any customer use.

---

### 📋 2. defects.csv
**Purpose:** Machine-readable defect log
**Format:** CSV with 9 columns
**Contents:** 10 issues with complete reproduction steps

**Columns:**
- `id`: Issue identifier (ISS-001 through ISS-010)
- `severity`: Blocker / High / Medium / Low
- `category`: Calculation / Data / Visualization / Testing
- `summary`: One-line description
- `expected`: Expected behavior with specific numbers
- `actual`: Actual behavior observed
- `impact`: Business and user impact
- `fix`: Precise fix recommendation
- `retest_steps`: How to verify the fix

**Critical Issues (Severity: Blocker):**
- ISS-001: Rürup calculator annual compounding error (~€12k over 30 years)
- ISS-002: ETF tax accumulation logic flawed

---

### 📖 3. Correct_Specification_And_Acceptance_Tests.md
**Purpose:** Authoritative specification for all calculations and charts
**Contents:**
- Complete formula specifications with LaTeX notation
- Variable definitions with data sources
- Rounding rules and tolerances
- Canonical examples with worked calculations
- Acceptance test suites
- Chart specifications with format rules
- Regulatory references (German tax law)

**Sections:**
1. **Calculation Specifications** (10 formulas documented)
   - Coverage gap
   - Private pension payout
   - Rürup tax savings
   - Rürup accumulation (CORRECTED)
   - Vorabpauschale
   - Riester subsidies (TO IMPLEMENT)
   - Occupational pension (TO IMPLEMENT)

2. **Chart Specifications** (2 charts documented)
   - Vermögensentwicklung (portfolio development)
   - Pension breakdown (pie chart)

3. **Data Validation Rules**
   - Input validation (min/max, types)
   - Business logic validation

4. **Acceptance Test Suite**
   - 3 end-to-end scenarios
   - Integration tests
   - Performance tests

5. **Regulatory References**
   - German tax law (EStG)
   - Investment tax act (InvStG)
   - BMF guidelines
   - Social security rates

---

## How to Use These Deliverables

### For Developers:

1. **Start with Critical Issues**
   - Open `defects.csv`
   - Filter by severity = "Blocker"
   - Implement ISS-001 and ISS-002 first

2. **Reference Specifications**
   - Open `Correct_Specification_And_Acceptance_Tests.md`
   - Find the relevant calculation section
   - Implement using the exact formulas provided
   - Use the canonical examples to verify

3. **Verify Fixes**
   - Run the retest steps from `defects.csv`
   - Use the acceptance tests from the specification
   - Ensure all calculations within ±0.01 EUR tolerance

4. **Track Progress**
   - Update `defects.csv` with fix status
   - Mark issues as "FIXED" or "VERIFIED"
   - Rerun affected test cases

### For Stakeholders:

1. **Review Executive Report**
   - Open `Executive_QA_Report.md`
   - Focus on "Top 10 Risks" section
   - Review timeline for fixes

2. **Understand Financial Impact**
   - ISS-001: €12,000 overestimation per customer
   - ISS-003: Missing €175-975/year in Riester subsidies
   - ISS-004: Missing ~€3,720/year in occupational savings

3. **Decision Points**
   - **DO NOT LAUNCH** until ISS-001 and ISS-002 fixed
   - Consider delaying launch until Riester (ISS-003) implemented
   - Plan for annual parameter updates (ISS-006)

### For QA/Testing:

1. **Create Test Cases**
   - Use scenarios from `Correct_Specification_And_Acceptance_Tests.md` Section 5
   - Implement automated tests for each calculation
   - Target 80%+ code coverage

2. **Verify Fixes**
   - After developer completes fix, run retest steps
   - Compare actual vs. expected within tolerance
   - Sign off only if all tests pass

3. **Regression Testing**
   - After any calculation change, rerun ALL test cases
   - Verify no existing functionality broken
   - Update test baselines if specification changes

---

## Critical Findings Summary

### 🔴 BLOCKER Issues (Fix before ANY customer use)

**ISS-001: Rürup Compounding Error**
- **Location:** `src/components/TaxCalculator.tsx` line 323
- **Error:** Uses annual compounding instead of monthly
- **Impact:** Overstates Rürup benefits by ~€12,000 over 30 years (2.4%)
- **Fix Time:** 2-3 hours
- **Fix:** Change loop to monthly compounding

**ISS-002: ETF Tax Logic Error**
- **Location:** `src/components/TaxCalculator.tsx` lines 286-304
- **Error:** Multiplies Vorabpauschale by year count
- **Impact:** Overstates ETF tax burden, makes ETFs appear worse
- **Fix Time:** 3-4 hours
- **Fix:** Loop through years, calculate VP for each year's value

### 🟡 HIGH Priority (Fix before production)

**ISS-003: Missing Riester Calculator**
- **Impact:** Cannot calculate €175-975/year in government subsidies
- **Fix Time:** 1-2 days
- **Fix:** Implement `calculateRiesterBenefit()` function

**ISS-004: Missing Occupational Calculator**
- **Impact:** Missing ~€3,720/year in tax & social security savings
- **Fix Time:** 1 day
- **Fix:** Implement `calculateOccupationalPension()` function

---

## Regulatory Compliance

All calculations must comply with German tax law (Stand 2024):

| Law | Parameter | Value | Status |
|-----|-----------|-------|--------|
| §10 Abs.3 EStG | Rürup max contribution | €27,566 | ✅ Correct |
| §10 Abs.3 EStG | Rürup deductible rate | 96% (2024) | ✅ Correct |
| §20 Abs.9 EStG | Sparer-Pauschbetrag | €1,000 single | ✅ Correct |
| §22 Nr.1 EStG | Taxable portion | 83% (2024) | ✅ Correct |
| §3 Nr.63 EStG | Occupational tax-free | €584/month | ✅ Correct |
| §32d EStG | Capital gains tax | 26.375% | ✅ Correct |
| §18 InvStG | Vorabpauschale | 70% of Basiszins | ✅ Correct |

**Note:** Parameters will change for 2025 (Rürup deductible → 100%)

---

## Testing Checklist

Before approving for production, verify:

### Calculations
- [ ] ISS-001 fixed: Rürup uses monthly compounding
- [ ] ISS-002 fixed: ETF tax calculated year-by-year
- [ ] ISS-003 fixed: Riester subsidies calculated
- [ ] ISS-004 fixed: Occupational tax savings calculated
- [ ] ISS-005 fixed: Pension gap includes all income
- [ ] All test cases pass within ±0.01 EUR tolerance

### Data
- [ ] Onboarding data propagates to all calculators
- [ ] Input validation prevents invalid values
- [ ] Edge cases handled (zero, negative, null)
- [ ] Auto-save works with 500ms debounce

### Visualizations
- [ ] Charts show correct age on x-axis
- [ ] Y-axis starts at zero or shows break
- [ ] Tooltips match underlying data
- [ ] Legend labels correct

### UX
- [ ] All tabs functional
- [ ] Loading states work
- [ ] Error messages clear
- [ ] Keyboard navigation works

### Performance
- [ ] Initial load < 3 seconds
- [ ] Calculations < 100ms
- [ ] No memory leaks

---

## Next Steps

### Immediate (Week 1)
1. Developer fixes ISS-001 (Rürup compounding)
2. Developer fixes ISS-002 (ETF tax logic)
3. QA verifies fixes with test cases
4. Stakeholder approval for continued development

### Short-Term (Weeks 2-3)
5. Implement Riester calculator (ISS-003)
6. Implement occupational pension calculator (ISS-004)
7. Fix pension gap consistency (ISS-005)
8. Add unit tests (ISS-008)

### Medium-Term (Month 2)
9. Add year-based parameters (ISS-006)
10. Improve fee calculation (ISS-007)
11. Add input validation (ISS-009)
12. Accessibility audit
13. Performance optimization

### Before Launch
14. Full regression testing
15. User acceptance testing
16. Legal/compliance review
17. Documentation finalization

---

## Contact & Questions

**Prepared by:** Senior Insurance Seller — Commissioning Stakeholder
**Investment:** $100,000
**Review Date:** 2025-10-25

**For Questions:**
- Technical issues: Refer to specific ISS-### in defects.csv
- Formula clarifications: See Correct_Specification section
- Business decisions: Contact commissioning stakeholder

**Code Repository:**
- GitHub: Mariosbro82/app
- Commit: 9da6034
- Branch: main

---

## Converting to PDF

To convert these Markdown files to PDF format:

### Option 1: Pandoc (Recommended)
```bash
pandoc Executive_QA_Report.md -o Executive_QA_Report.pdf \
  --pdf-engine=xelatex \
  --variable geometry:margin=1in \
  --toc \
  --highlight-style=tango

pandoc Correct_Specification_And_Acceptance_Tests.md -o Correct_Specification.pdf \
  --pdf-engine=xelatex \
  --variable geometry:margin=1in \
  --toc \
  --number-sections \
  --highlight-style=tango
```

### Option 2: Online Converters
- https://www.markdowntopdf.com/
- https://md2pdf.netlify.app/
- Ensure "preserve formatting" and "table of contents" options enabled

### Option 3: VS Code Extension
- Install "Markdown PDF" extension
- Right-click on .md file → "Markdown PDF: Export (pdf)"

---

## File Checksums (for Verification)

To verify file integrity after transfer:

```bash
md5sum Executive_QA_Report.md
md5sum defects.csv
md5sum Correct_Specification_And_Acceptance_Tests.md
```

---

**End of Package Documentation**

All files in this folder represent the comprehensive QA review of the pension calculator tool. Use them as the authoritative source for fixes, specifications, and acceptance criteria.
