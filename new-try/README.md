# Rentenrechner Premium 3.0

> Professional German Pension Calculator with Interactive Dashboards, Dark Mode, and Advanced Analytics

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## ✨ Features

### Core Functionality
- 📊 **Interactive Financial Charts** - Stock market-style visualizations with time-period selectors
- 📈 **Historical Performance Tables** - Professional fund performance displays
- 🎨 **Dark Mode Support** - Beautiful light and dark themes
- 💼 **Premium Dashboard** - Executive KPIs with real-time metrics
- 📥 **Export Capabilities** - CSV and PDF report generation
- 🔄 **Smooth Animations** - Framer Motion page transitions
- 🎯 **Tax Calculations** - German tax rules (Halbeinkünfteverfahren, Abgeltungssteuer)
- 💰 **Withdrawal Simulator** - Flexible fund withdrawal calculator

### Technical Highlights
- ⚡ **Vite** - Lightning-fast development server
- 🎭 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Modern utility-first styling
- 📦 **Zustand** - Lightweight state management with persistence
- 📊 **Recharts** - Responsive chart library
- 🎬 **Framer Motion** - Smooth animations

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Installation

```bash
# Navigate to project
cd /Users/fabianharnisch/app/new-try

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Structure

```
new-try/
├── components/
│   ├── charts/
│   │   ├── FinancialChartWithTimePeriods.tsx  # Time-period chart
│   │   └── HistoricalPerformanceTable.tsx     # Performance table
│   └── dashboard/
│       ├── KPICard.tsx                         # KPI display card
│       └── ThemeToggle.tsx                     # Dark mode toggle
├── contexts/
│   └── ThemeContext.tsx                        # Theme provider
├── pages/
│   ├── DashboardPage.tsx                       # Main dashboard
│   ├── ComparisonPage.tsx                      # Chart comparison
│   └── OnboardingQuestionsPage.tsx             # Data entry
├── stores/
│   └── pensionStore.ts                         # Zustand store
├── utils/
│   └── pdfExport.ts                            # PDF generation
├── App.tsx                                      # Root component
├── main.tsx                                     # Entry point
└── package.json
```

---

## 🎯 Usage Guide

### 1. Onboarding

Fill in your personal data:
- Birth year and family status
- Annual gross income
- Expected pensions (statutory, Vista)
- Investment details (life insurance, funds)
- Optional: Mortgage information

**Auto-save**: Data is automatically saved every 500ms

### 2. Dashboard

View your comprehensive financial overview:
- **4 KPI Cards**: Income, Pension, Savings, Years to Retirement
- **Interactive Chart**: Fund performance with time periods (1T to ALL)
- **Performance Table**: Historical returns
- **Export**: Download CSV or PDF reports

### 3. Comparison

Analyze different income scenarios:
- **Basic View**: Net income + statutory + Vista pension
- **Detailed View**: All income streams including life insurance
- **Fund Chart**: Projected fund value growth
- **Simulators**: Tax settings, withdrawal calculator, fund settings

### 4. Dark Mode

Toggle between light and dark themes:
- Click the theme toggle in any page header
- Preference is saved automatically
- System preference detected on first visit

---

## 🎨 Theme Colors

### Light Mode
- Background: Blue-50 gradient
- Cards: White
- Text: Gray-900
- Accents: Blue-600

### Dark Mode
- Background: Gray-900
- Cards: Gray-800
- Text: White
- Accents: Blue-500

---

## 📊 Data Management

### Local Storage

All data is stored locally in your browser:
- **Key**: `pension-store`
- **Format**: JSON
- **Persistence**: Automatic via Zustand middleware

### Data Structure

```typescript
{
  // Personal
  birthYear: number;
  maritalStatus: 'single' | 'married';
  numberOfChildren: number;

  // Income
  grossIncome: number;

  // Pensions
  expectedStatutoryPension: number;
  vistaPensionMonthly: number;

  // Assets
  lifeInsuranceMonthly: number;
  fundSavingsPlanMonthly: number;

  // Settings
  freistellungsauftrag: number;
  fundReturnRate: number;
  fundSalesCharge: number;
  fundAnnualManagementFee: number;
}
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_APP_TITLE=Rentenrechner Premium
VITE_DEFAULT_THEME=light
```

### Tailwind Config

Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      // Add your brand colors
    }
  }
}
```

---

## 📱 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Edge    | 90+            |
| Safari  | 14+            |
| Firefox | 88+            |

**Note**: Requires modern browser with ES2020+ support. No IE11 support.

---

## 🧪 Testing

### Manual Testing

```bash
# Run dev server
npm run dev

# Open browser and test:
# - Onboarding form validation
# - Dashboard KPIs
# - Chart interactions
# - Dark mode toggle
# - PDF/CSV export
# - Page transitions
```

### Future: Automated Testing

```bash
# Unit tests (planned)
npm run test

# E2E tests (planned)
npm run test:e2e
```

---

## 📦 Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | React DOM rendering |
| zustand | ^4.5.7 | State management |
| recharts | ^2.15.4 | Charts library |
| framer-motion | ^11.18.2 | Animations |
| lucide-react | ^0.462.0 | Icons |
| jspdf | latest | PDF generation |
| html2canvas | latest | DOM to image |
| date-fns | ^4.1.0 | Date utilities |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^5.4.19 | Build tool |
| typescript | ^5.6.3 | Type checking |
| tailwindcss | ^3.4.1 | CSS framework |

---

## 📖 Documentation

- **[FEATURES.md](./FEATURES.md)** - Complete feature documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[important.md](./important.md)** - Original German requirements

---

## 🚦 Roadmap

### Version 3.1 (Next)
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Advanced PDF export with charts
- [ ] Mobile app optimization

### Version 3.2 (Future)
- [ ] Multi-scenario comparison
- [ ] Inflation adjustment
- [ ] Vorabpauschale calculation
- [ ] Backend integration
- [ ] Multi-language support

---

## 🤝 Contributing

This is a proprietary project. For issues or suggestions:

1. Test the feature thoroughly
2. Document the issue with screenshots
3. Provide steps to reproduce
4. Contact the development team

---

## 📄 License

Proprietary - All Rights Reserved

Copyright © 2025 Pension Calculator Team

---

## 💬 Support

### Common Issues

**Dark mode not working?**
- Clear browser cache
- Check localStorage permissions
- Verify Tailwind config

**Charts not loading?**
- Ensure data is entered in onboarding
- Check browser console for errors
- Verify Recharts is installed

**Export not working?**
- Check popup blockers
- Ensure sufficient localStorage space
- Try different browser

### Contact

For technical support, contact the development team.

---

## 🌟 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind Labs** - For utility-first CSS
- **Recharts Team** - For beautiful charts
- **Framer** - For smooth animations
- **Financial Coaches** - For feature requirements

---

**Made with ❤️ for financial planning professionals**

**Version**: 3.0.0
**Last Updated**: November 2, 2025
**Status**: ✅ Production Ready
