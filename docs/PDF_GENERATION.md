# PDF Report Generation Feature

## Overview

The pension calculator now includes a comprehensive PDF report generation feature that captures all calculations, graphs, and data in a professional, detailed report format.

## Features

### 1. **Comprehensive Data Collection**
The PDF report includes:
- All input parameters (age, contributions, duration, etc.)
- Cost and tax settings
- Complete simulation results with KPIs
- Financial breakdown (contributions, gains, fees, taxes)
- Performance metrics (ROI, effective annual return, cost ratio)

### 2. **Visual Graphs**
- Automatically captures ALL charts displayed in the application
- High-quality image rendering (2x scale for clarity)
- Proper pagination to ensure charts fit well on pages

### 3. **Multi-Language Support**
- Fully supports both German (DE) and English (EN)
- All labels, descriptions, and formatting adapt to the selected language

### 4. **Comparison Data**
- If comparison scenarios are active, they are included in the PDF
- Shows conservative, current, and aggressive strategy comparisons
- Includes KPIs for each scenario

## Technical Implementation

### File Structure
```
src/
  services/
    pdf-generator.ts          # Main PDF generation service
  pages/
    home.tsx                  # Updated to use the new PDF service
```

### Key Components

#### PDFGenerator Class
Located in `src/services/pdf-generator.ts`

**Features:**
- Object-oriented design for clean, maintainable code
- Automatic page breaks and pagination
- Consistent formatting and styling
- Comprehensive error handling

**Methods:**
- `addHeader()` - Adds report title and creation date
- `addInputParameters()` - Includes all user input data
- `addCostSettings()` - Lists all cost and tax configurations
- `addSimulationResults()` - Displays calculated KPIs and metrics
- `addAllCharts()` - Captures and embeds all chart visualizations
- `addComparisonData()` - Includes comparison scenarios if available
- `addFooter()` - Adds disclaimer and legal text
- `generate()` - Orchestrates the entire PDF creation
- `save()` - Saves the PDF to the user's device

### Usage

The PDF is generated when the user clicks the "PDF Export" button in the application:

```typescript
// In home.tsx
const exportToPDF = async () => {
  await generatePensionPDF({
    language,
    formData: form.getValues(),
    simulationResults,
    costSettings,
    comparisonData: comparisonScenarios
  });
};
```

## PDF Report Structure

1. **Header**
   - Title: "Rentenrechner Detailbericht" / "Pension Calculator Detailed Report"
   - Creation date

2. **Section 1: Input Parameters**
   - Personal Information (age, start age)
   - Investment Parameters (duration, contributions, initial capital)
   - Payout Phase (retirement age, payout mode, rates)

3. **Section 2: Cost & Tax Settings**
   - Expected return
   - Fund TER
   - Policy fees
   - Tax rates
   - Volatility
   - Rebalancing status

4. **Section 3: Simulation Results**
   - Main Results (projected value, monthly pension, target gap)
   - Financial Breakdown (contributions, gains, fees, taxes, net return)
   - Performance Metrics (effective annual return, cost ratio, ROI)

5. **Section 4: Graphical Representation**
   - All charts from the application
   - Portfolio value over time
   - Fees and costs visualization
   - Tax impact charts
   - Comparison charts (if available)

6. **Section 5: Strategy Comparison** (if applicable)
   - Conservative scenario KPIs
   - Current scenario KPIs
   - Aggressive scenario KPIs

7. **Footer**
   - Legal disclaimer
   - Important notes about simulations

## Formatting

- **Currency:** Formatted in EUR with German locale (e.g., "1.234,56 €")
- **Percentages:** Displayed with 2 decimal places (e.g., "6.50%")
- **Charts:** High-resolution PNG images embedded in the PDF
- **Pagination:** Automatic page breaks to prevent content cutoff
- **Colors:** Professional color scheme (blue headers, readable text)

## Dependencies

- `jspdf` (v3.0.2) - PDF creation library
- `html2canvas` (v1.4.1) - Chart to image conversion

## Future Enhancements

Potential improvements for future versions:
- Add data tables with yearly breakdown
- Include projection charts for different scenarios
- Add more detailed tax calculations
- Support for multiple currency formats
- Export to other formats (Excel, CSV)
- Email delivery option
- Custom branding/logo support

## Troubleshooting

### PDF not generating
- Ensure simulation results are available
- Check browser console for errors
- Verify all charts are rendered before exporting

### Charts missing in PDF
- Make sure charts have the `.chart-container` class
- Check that html2canvas can access the chart elements
- Verify no CORS issues with chart images

### Formatting issues
- Ensure proper language setting
- Check that all data is available in the correct format
- Verify number formatting for the selected locale

## License

This feature is part of the pension calculator application.
