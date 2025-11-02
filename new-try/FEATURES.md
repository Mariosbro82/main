# Rentenrechner Premium - Feature Documentation

## Version 3.0 - November 2025

This document provides a comprehensive overview of all features implemented in the premium pension calculator application.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [New Premium Features](#new-premium-features)
4. [Technical Stack](#technical-stack)
5. [User Experience](#user-experience)
6. [Data Management](#data-management)
7. [Future Enhancements](#future-enhancements)

---

## Overview

The Rentenrechner Premium is a comprehensive German pension calculator designed for financial coaches and their clients. It provides detailed retirement income projections, tax calculations, and investment portfolio analysis.

### Target Audience
- Financial coaches in Germany
- Clients aged 30-65 planning for retirement
- Individuals seeking comprehensive pension analysis

### Key Objectives
1. Provide transparent income projections from today until end of life
2. Compare different retirement income streams
3. Simulate various withdrawal strategies
4. Optimize tax efficiency

---

## Core Features

### 1. Single-Page Onboarding (iPhone-Style)

**Description**: Streamlined data entry experience with all questions visible on one page.

**Key Elements**:
- ✅ **Personal Data**: Birth year, marital status, number of children
- ✅ **Income Information**: Annual gross income
- ✅ **Pension Details**: Expected statutory pension, Vista pension
- ✅ **Insurance & Investments**: Life insurance, fund savings plan
- ✅ **Mortgage Information**: Optional property debt details

**Features**:
- Auto-save with 500ms debounce
- Real-time validation with German error messages
- Smooth animations with Framer Motion
- Color-coded sections with icons
- Responsive design

**Technical Implementation**:
- Component: `OnboardingQuestionsPage.tsx`
- Store: `pensionStore.ts` (Zustand with persistence)
- Validation: Real-time with error display

### 2. Interactive Comparison Dashboard

**Description**: Two-mode chart visualization system for comparing income streams.

**Chart Modes**:

**Mode 1 - Basic View**:
- Net employment income until retirement
- Statutory pension (gesetzliche Rente)
- Vista pension
- Stacked area chart visualization

**Mode 2 - Detailed View**:
- All income streams from Mode 1
- Life insurance payouts
- Fund withdrawals
- Color-coded layers

**Features**:
- Apple-style toggle switch (gray/green)
- Responsive Recharts implementation
- German number formatting (de-DE)
- Interactive tooltips
- Age-based X-axis (60-90 years)

**Technical Implementation**:
- Component: `ComparisonPage.tsx`
- Chart Library: Recharts 2.15.4
- Animation: Framer Motion transitions

---

## New Premium Features

### 3. Premium Dashboard with KPIs

**Description**: Executive-level overview with key performance indicators and interactive charts.

**KPI Cards** (4 total):
1. **Current Gross Income**
   - Annual income display
   - Trend indicator (+5.2%)
   - Blue gradient theme

2. **Projected Total Pension**
   - Monthly pension at age 67
   - Combines all income streams
   - Green gradient theme

3. **Monthly Savings Rate**
   - Fund contribution tracking
   - Indigo gradient theme

4. **Years to Retirement**
   - Countdown display
   - Current age reference
   - Orange gradient theme

**Features**:
- Hover animations (scale + lift effect)
- Dark/light mode support
- Gradient backgrounds
- Icon badges

**Technical Implementation**:
- Component: `DashboardPage.tsx`
- KPI Component: `KPICard.tsx`
- Theme: Context-based dark mode

### 4. Financial Chart with Time Periods

**Description**: Stock market-style interactive chart with period selectors, similar to Yahoo Finance/Dow Jones displays.

**Time Periods**:
- 1T (1 Tag)
- 1W (1 Woche)
- 1M (1 Monat)
- 3M (3 Monate)
- 6M (6 Monate)
- YTD (Jahr bis heute)
- 1J, 2J, 5J, 10J (Jahre)
- ALLE (Complete history)

**Features**:
- Interactive period selector buttons
- Performance indicators (trending up/down arrows)
- Percentage change display
- Stats footer (opening, high, low)
- Smooth line chart animations
- German date formatting

**Technical Implementation**:
- Component: `FinancialChartWithTimePeriods.tsx`
- Data Structure: `DataPoint[]` with timestamps
- Filtering: Client-side date-based filtering

### 5. Historical Performance Table

**Description**: Professional fund performance table similar to Debeka Global Shares display.

**Data Displayed**:
- 1 Year performance
- 3 Year performance
- 5 Year performance
- Year-to-date (YTD)
- Since inception
- Annualized return

**Features**:
- Trend indicators (green/red arrows)
- Percentage formatting
- Staggered animation on load
- Informational disclaimer footer
- Dark mode support

**Technical Implementation**:
- Component: `HistoricalPerformanceTable.tsx`
- Data Structure: `PerformanceData[]`
- Animation: Motion with delay per row

### 6. Dark Mode Support

**Description**: Full dark/light theme toggle with system preference detection.

**Features**:
- System preference detection on first load
- LocalStorage persistence
- Smooth transitions (300ms)
- All components support both modes
- Professional color schemes:
  - **Light Mode**: Blue-50 gradient background
  - **Dark Mode**: Gray-900 background

**Color Palettes**:

**Light Mode**:
- Background: `gradient from-blue-50 via-white to-indigo-50`
- Cards: `bg-white`
- Text: `text-gray-900`
- Borders: `border-gray-200`

**Dark Mode**:
- Background: `bg-gray-900`
- Cards: `bg-gray-800`
- Text: `text-white`
- Borders: `border-gray-700`

**Technical Implementation**:
- Context: `ThemeContext.tsx`
- Hook: `useTheme()`
- Toggle Component: `ThemeToggle.tsx`
- Tailwind Config: `darkMode: 'class'`

### 7. Tax Calculation System

**Description**: Advanced German tax calculations for accurate net income projections.

**Tax Rules Implemented**:

**A. Halbeinkünfteverfahren (Half-Income Method)**
- Applies from age 62
- 50% of pension income becomes tax-free
- Simplified 25% tax rate on taxable portion
- Applied to all pension streams

**B. Freistellungsauftrag (Tax-Free Allowance)**
- Default: 1,000€ (single) / 2,000€ (married)
- User-adjustable via settings modal
- Deducted from capital gains before taxation

**C. Abgeltungssteuer (Capital Gains Tax)**
- Flat 25% rate on capital gains
- Applied to fund withdrawals
- Pro-rata calculation for partial withdrawals

**D. Teilfreistellung (Partial Exemption)**
- 15% exemption for equity funds
- Reduces taxable capital gains
- Mentioned in withdrawal simulator

**Tax Settings Modal**:
- Input field for Freistellungsauftrag
- Information card explaining rules
- Gradient save button
- Smooth modal animations

**Technical Implementation**:
- Functions: `calculatePensionTax()`, `calculateFundWithdrawalAfterTax()`
- Store: Tax settings persisted in Zustand
- UI: Modal with AnimatePresence

### 8. Flexible Withdrawal Simulator

**Description**: Interactive tool for calculating net fund withdrawals with tax impact.

**Features**:
- Annual withdrawal amount input
- Real-time calculations:
  - Monthly net amount (after tax)
  - Annual net amount
  - Total tax paid
- Color-coded result cards:
  - Blue: Monthly net
  - Green: Annual net
  - Red: Tax amount
- Tax treatment information box

**Calculation Method**:
1. Calculate total fund value at retirement
2. Determine capital gains (value - contributions)
3. Pro-rate gains to withdrawal amount
4. Apply Freistellungsauftrag exemption
5. Calculate 25% tax on remaining gains
6. Display net amounts

**Technical Implementation**:
- Component: Modal in `ComparisonPage.tsx`
- Function: `calculateFlexibleWithdrawal()`
- UI: Gradient cards with large numbers

### 9. Fund Settings Configuration

**Description**: Customizable investment parameters for accurate projections.

**Adjustable Parameters**:
1. **Expected Return Rate** (% p.a.)
   - Default: 5%
   - Impacts growth projections

2. **Sales Charge** (Ausgabeaufschlag in %)
   - Default: 5%
   - One-time deduction on contributions

3. **Annual Management Fee** (% p.a.)
   - Default: 1.5%
   - Reduces effective return rate

**Features**:
- Number inputs with step controls
- Real-time chart recalculation
- Persistent storage in Zustand
- Modal interface with gradient save button

**Calculation Impact**:
```typescript
effectiveContribution = monthly * (1 - salesCharge / 100)
effectiveRate = (returnRate / 100 / 12) - (managementFee / 100 / 12)
futureValue = effectiveContribution * (Math.pow(1 + effectiveRate, months) - 1) / effectiveRate
```

**Technical Implementation**:
- Component: Modal in `ComparisonPage.tsx`
- Function: `calculateFundValue()`
- Store: `fundReturnRate`, `fundSalesCharge`, `fundAnnualManagementFee`

### 10. Data Export Functionality

**Description**: Export analysis results to CSV and PDF formats.

**CSV Export**:
- Includes all key metrics
- German formatting (de-DE)
- Automatic filename with date
- Downloads directly to browser

**CSV Contents**:
- Gross income
- Pension amounts (statutory + Vista)
- Monthly savings rate
- Years to retirement
- Projected fund value

**PDF Export** (Planned):
- Full dashboard snapshot
- Charts and tables
- Professional formatting
- Company branding support

**Technical Implementation**:
- CSV: Native Blob API
- PDF: jsPDF + html2canvas (to be implemented)
- Component: Export buttons in `DashboardPage.tsx`

### 11. Smooth Page Transitions

**Description**: Professional navigation experience with animated page changes.

**Features**:
- Fade + slide transitions
- AnimatePresence for smooth exits
- 300ms duration
- Three pages: Onboarding, Dashboard, Comparison
- Navigation bar with active state

**Animation Patterns**:
```typescript
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 20 }}
transition={{ duration: 0.3 }}
```

**Technical Implementation**:
- Library: Framer Motion
- Component: `App.tsx` with AnimatePresence
- Mode: `wait` (prevents overlap)

---

## Technical Stack

### Frontend Framework
- **React** 18.3.1
- **TypeScript** 5.6.3
- **Vite** 5.4.19 (ultra-fast HMR)

### UI & Styling
- **Tailwind CSS** 3.4.1
- **Framer Motion** 11.18.2 (animations)
- **Lucide React** 0.462.0 (icons)

### Charts & Visualization
- **Recharts** 2.15.4
- Area charts, line charts
- Responsive containers
- Custom tooltips

### State Management
- **Zustand** 4.5.7
- Persist middleware
- LocalStorage key: `pension-store`
- TypeScript-first API

### Date & Time
- **date-fns** 4.1.0
- German locale support
- Date formatting utilities

### Export Libraries
- **jsPDF** (for PDF generation)
- **html2canvas** (for DOM to image)

---

## User Experience

### Design Principles

1. **Clarity First**
   - Clear labeling in German
   - No jargon
   - Tooltips for complex concepts

2. **Visual Hierarchy**
   - Color-coded sections
   - Icon badges for context
   - Large numbers for KPIs

3. **Smooth Interactions**
   - Hover states (scale + shadow)
   - Click feedback (scale down)
   - Page transitions (fade + slide)

4. **Accessibility**
   - High contrast ratios
   - Keyboard navigation
   - Screen reader support (aria-labels)

5. **Responsiveness**
   - Mobile-first approach
   - Breakpoints: sm, md, lg, xl
   - Touch-friendly buttons

### Color Palette

**Primary Colors**:
- Blue: `hsl(217, 91%, 60%)` - Main actions
- Indigo: `hsl(243, 75%, 59%)` - Gradients
- Green: `hsl(142, 76%, 45%)` - Success/positive
- Orange: `hsl(32, 95%, 44%)` - Warnings
- Red: `hsl(0, 84%, 60%)` - Errors/negatives

**Neutral Colors**:
- Gray-50 to Gray-900 spectrum
- White and Black

**Gradients**:
- Blue to Indigo: Headers, buttons
- Card backgrounds: Blue-50 to Indigo-50

### Typography
- **Font Family**: Inter Variable, SF Pro Display, system-ui
- **Headings**: Bold, 2xl-4xl
- **Body**: Regular, sm-base
- **Numbers**: Tabular nums for alignment

---

## Data Management

### LocalStorage Persistence

**Key**: `pension-store`

**Stored Data**:
```typescript
{
  birthYear: number | null;
  maritalStatus: 'single' | 'married' | null;
  numberOfChildren: number;
  grossIncome: number;
  expectedStatutoryPension: number;
  vistaPensionMonthly: number;
  lifeInsuranceMonthly: number;
  fundSavingsPlanMonthly: number;
  hasMortgage: boolean;
  mortgageBalance: number;
  monthlyMortgagePayment: number;
  freistellungsauftrag: number;
  annualWithdrawalAmount: number;
  fundReturnRate: number;
  fundSalesCharge: number;
  fundAnnualManagementFee: number;
  isOnboardingComplete: boolean;
}
```

### Data Flow

```
User Input (Onboarding)
    ↓
Zustand Store (with persist middleware)
    ↓
LocalStorage (automatic)
    ↓
Dashboard & Comparison Pages (reactive)
    ↓
Charts Recalculate (real-time)
```

### Data Validation

**Rules**:
- Birth year: 1940-2010
- Gross income: > 0
- Marital status: Required
- All numbers: ≥ 0

**Error Handling**:
- Real-time validation
- German error messages
- Red border + text for errors
- Submit blocked until valid

---

## Future Enhancements

### Phase 2 Features (Planned)

1. **Vorabpauschale Calculation**
   - § 18 InvStG compliance
   - Base rate integration
   - Automatic BMF API updates

2. **Inflation Adjustment**
   - Real vs. nominal Euro toggle
   - Historical inflation data
   - Future projections

3. **Multi-Scenario Comparison**
   - Side-by-side analysis
   - A/B testing for strategies
   - Scenario duplication

4. **PDF Report Generation**
   - Complete with charts
   - Professional formatting
   - Branding customization

5. **Mobile App**
   - React Native version
   - Offline capability
   - Push notifications

6. **AI-Powered Recommendations**
   - Personalized advice
   - Risk assessment
   - Gap analysis

### Technical Improvements

1. **Testing Suite**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - 80%+ coverage

2. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Bundle size reduction

3. **Internationalization**
   - English version
   - French version
   - i18n library integration

4. **Backend Integration**
   - User accounts
   - Cloud sync
   - Multi-device support

---

## Getting Started

### Installation

```bash
cd /Users/fabianharnisch/app/new-try
npm install
```

### Development

```bash
npm run dev
```

Access at: http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

---

## Support & Documentation

### File Structure

```
new-try/
├── components/
│   ├── charts/
│   │   ├── FinancialChartWithTimePeriods.tsx
│   │   └── HistoricalPerformanceTable.tsx
│   └── dashboard/
│       ├── KPICard.tsx
│       └── ThemeToggle.tsx
├── contexts/
│   └── ThemeContext.tsx
├── pages/
│   ├── OnboardingQuestionsPage.tsx
│   ├── ComparisonPage.tsx
│   └── DashboardPage.tsx
├── stores/
│   └── pensionStore.ts
├── App.tsx
├── main.tsx
└── package.json
```

### Key Files
- **App.tsx**: Main application with routing
- **pensionStore.ts**: Zustand store with all state
- **ThemeContext.tsx**: Dark mode provider
- **DashboardPage.tsx**: Premium dashboard with KPIs
- **ComparisonPage.tsx**: Chart comparison view
- **OnboardingQuestionsPage.tsx**: Data entry form

---

## Changelog

### Version 3.0 (November 2025)
- ✅ Added Premium Dashboard with KPIs
- ✅ Implemented Financial Chart with Time Periods
- ✅ Created Historical Performance Table
- ✅ Added Dark Mode support
- ✅ Implemented CSV Export
- ✅ Added Theme Toggle component
- ✅ Enhanced all pages with dark mode
- ✅ Added smooth page transitions
- ✅ Improved responsive design

### Version 2.0 (January 2025)
- ✅ Single-page onboarding
- ✅ Tax calculation system
- ✅ Withdrawal simulator
- ✅ Fund settings configuration
- ✅ Comparison charts

### Version 1.0 (2024)
- ✅ Basic pension calculator
- ✅ Multi-step wizard
- ✅ Simple charts

---

**Last Updated**: November 2, 2025
**Version**: 3.0
**Status**: Production Ready
**License**: Proprietary
**Author**: Financial Planning Team
