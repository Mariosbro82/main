import { PDFDocument, PDFForm, PDFTextField, PDFDropdown, PDFCheckBox, rgb, StandardFonts } from 'pdf-lib';

export interface PensionFormData {
  language?: 'de' | 'en';
}

/**
 * Creates an interactive, calculating PDF form for the pension calculator.
 * Users can fill out the form directly in Adobe Reader/Acrobat and it will
 * automatically calculate results using embedded JavaScript.
 */
export class InteractivePensionForm {
  private doc!: PDFDocument;
  private form!: PDFForm;
  private language: 'de' | 'en';
  private yPosition = 750;
  private readonly pageWidth = 595; // A4 width in points
  private readonly leftMargin = 50;
  private readonly labelWidth = 250;
  private readonly fieldWidth = 150;
  private readonly fieldHeight = 20;
  private readonly lineSpacing = 30;
  private readonly sectionSpacing = 40;

  constructor(options: PensionFormData = {}) {
    this.language = options.language || 'de';
  }

  private t(de: string, en: string): string {
    return this.language === 'de' ? de : en;
  }

  /**
   * Initialize the PDF document
   */
  private async initialize(): Promise<void> {
    this.doc = await PDFDocument.create();
    this.form = this.doc.getForm();

    // Add first page
    this.doc.addPage([this.pageWidth, 842]); // A4 size
  }

  /**
   * Add a section header
   */
  private async addSectionHeader(title: string): Promise<void> {
    const page = this.doc.getPages()[this.doc.getPageCount() - 1];
    const font = await this.doc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(title, {
      x: this.leftMargin,
      y: this.yPosition,
      size: 14,
      font,
      color: rgb(0, 0.4, 0.8),
    });

    this.yPosition -= this.sectionSpacing;
  }

  /**
   * Add a text field with label
   */
  private addTextField(
    name: string,
    label: string,
    defaultValue: string = '',
    readonly: boolean = false
  ): PDFTextField {
    const page = this.doc.getPages()[this.doc.getPageCount() - 1];
    const font = this.doc.getForm().getDefaultFont();

    // Draw label
    page.drawText(label, {
      x: this.leftMargin,
      y: this.yPosition + 5,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // Create text field
    const textField = this.form.createTextField(name);
    textField.addToPage(page, {
      x: this.leftMargin + this.labelWidth,
      y: this.yPosition,
      width: this.fieldWidth,
      height: this.fieldHeight,
      borderColor: rgb(0.7, 0.7, 0.7),
      backgroundColor: readonly ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1),
    });

    if (defaultValue) {
      textField.setText(defaultValue);
    }

    if (readonly) {
      textField.enableReadOnly();
    }

    this.yPosition -= this.lineSpacing;
    return textField;
  }

  /**
   * Add a dropdown field with label
   */
  private addDropdown(
    name: string,
    label: string,
    options: string[],
    defaultValue?: string
  ): PDFDropdown {
    const page = this.doc.getPages()[this.doc.getPageCount() - 1];

    // Draw label
    page.drawText(label, {
      x: this.leftMargin,
      y: this.yPosition + 5,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // Create dropdown
    const dropdown = this.form.createDropdown(name);
    dropdown.addOptions(options);
    dropdown.addToPage(page, {
      x: this.leftMargin + this.labelWidth,
      y: this.yPosition,
      width: this.fieldWidth,
      height: this.fieldHeight,
      borderColor: rgb(0.7, 0.7, 0.7),
      backgroundColor: rgb(1, 1, 1),
    });

    if (defaultValue) {
      dropdown.select(defaultValue);
    }

    this.yPosition -= this.lineSpacing;
    return dropdown;
  }

  /**
   * Check if we need a new page
   */
  private checkNewPage(): void {
    if (this.yPosition < 100) {
      this.doc.addPage([this.pageWidth, 842]);
      this.yPosition = 750;
    }
  }

  /**
   * Create the complete interactive PDF form
   */
  public async create(): Promise<Uint8Array> {
    await this.initialize();

    // Add title
    const page = this.doc.getPages()[0];
    const titleFont = await this.doc.embedFont(StandardFonts.HelveticaBold);
    page.drawText(
      this.t('Rentenrechner - Interaktives Formular', 'Pension Calculator - Interactive Form'),
      {
        x: this.leftMargin,
        y: this.yPosition,
        size: 18,
        font: titleFont,
        color: rgb(0, 0.4, 0.8),
      }
    );
    this.yPosition -= 15;

    page.drawText(
      this.t(
        'Füllen Sie die Felder aus - Ergebnisse werden automatisch berechnet',
        'Fill in the fields - Results are calculated automatically'
      ),
      {
        x: this.leftMargin,
        y: this.yPosition,
        size: 10,
        color: rgb(0.5, 0.5, 0.5),
      }
    );
    this.yPosition -= this.sectionSpacing;

    // ============= SECTION 1: Personal Information =============
    await this.addSectionHeader(this.t('1. Persönliche Daten', '1. Personal Information'));
    this.checkNewPage();

    this.addTextField(
      'currentAge',
      this.t('Aktuelles Alter (Jahre):', 'Current Age (years):'),
      '30'
    );
    this.addTextField(
      'startAge',
      this.t('Startalter für Einzahlungen (Jahre):', 'Start Age for Contributions (years):'),
      '30'
    );

    this.yPosition -= 10;

    // ============= SECTION 2: Investment Parameters =============
    await this.addSectionHeader(this.t('2. Anlage-Parameter', '2. Investment Parameters'));
    this.checkNewPage();

    this.addTextField(
      'termYears',
      this.t('Laufzeit (Jahre):', 'Duration (years):'),
      '30'
    );
    this.addTextField(
      'monthlyContribution',
      this.t('Monatlicher Beitrag (€):', 'Monthly Contribution (€):'),
      '500'
    );
    this.addTextField(
      'startInvestment',
      this.t('Startkapital (€):', 'Initial Capital (€):'),
      '10000'
    );
    this.addTextField(
      'targetMaturityValue',
      this.t('Zielwert bei Rentenbeginn (€, optional):', 'Target Value at Retirement (€, optional):'),
      ''
    );

    this.yPosition -= 10;

    // ============= SECTION 3: Payout Phase =============
    await this.addSectionHeader(this.t('3. Auszahlungsphase', '3. Payout Phase'));
    this.checkNewPage();

    this.addTextField(
      'payoutStartAge',
      this.t('Rentenbeginn (Alter):', 'Retirement Start (age):'),
      '67'
    );
    this.addTextField(
      'payoutEndAge',
      this.t('Rentenende (Alter):', 'Retirement End (age):'),
      '85'
    );

    this.addDropdown(
      'payoutMode',
      this.t('Auszahlungsmodus:', 'Payout Mode:'),
      [
        this.t('Lebenslange Rente', 'Lifetime Annuity'),
        this.t('Flexible Entnahme', 'Flexible Withdrawal')
      ],
      this.t('Lebenslange Rente', 'Lifetime Annuity')
    );

    this.addTextField(
      'annuityRate',
      this.t('Rentenfaktor (%, z.B. 3.5):', 'Annuity Rate (%, e.g. 3.5):'),
      '3.5'
    );
    this.addTextField(
      'safeWithdrawalRate',
      this.t('Entnahmerate (%, z.B. 4.0):', 'Withdrawal Rate (%, e.g. 4.0):'),
      '4.0'
    );

    this.yPosition -= 10;

    // ============= SECTION 4: Cost & Tax Settings =============
    await this.addSectionHeader(this.t('4. Kosten & Steuereinstellungen', '4. Cost & Tax Settings'));
    this.checkNewPage();

    this.addTextField(
      'expectedReturn',
      this.t('Erwartete Rendite p.a. (%, z.B. 6.5):', 'Expected Return p.a. (%, e.g. 6.5):'),
      '6.5'
    );
    this.addTextField(
      'ter',
      this.t('TER Fonds p.a. (%, z.B. 0.8):', 'Fund TER p.a. (%, e.g. 0.8):'),
      '0.8'
    );
    this.addTextField(
      'policyFeeAnnualPct',
      this.t('Policenkosten p.a. (%, z.B. 0.4):', 'Policy Fee p.a. (%, e.g. 0.4):'),
      '0.4'
    );
    this.addTextField(
      'policyFixedAnnual',
      this.t('Fixe Policenkosten (€):', 'Fixed Policy Fee (€):'),
      '0'
    );
    this.addTextField(
      'taxRatePayout',
      this.t('Steuersatz Auszahlung (%, z.B. 17):', 'Tax Rate Payout (%, e.g. 17):'),
      '17'
    );
    this.addTextField(
      'volatility',
      this.t('Volatilität (%, z.B. 18):', 'Volatility (%, e.g. 18):'),
      '18'
    );

    this.yPosition -= 10;

    // Check if we need a new page for results
    if (this.yPosition < 300) {
      this.doc.addPage([this.pageWidth, 842]);
      this.yPosition = 750;
    }

    // ============= SECTION 5: CALCULATED RESULTS =============
    await this.addSectionHeader(
      this.t('5. Berechnete Ergebnisse (automatisch)', '5. Calculated Results (automatic)')
    );
    this.checkNewPage();

    // These fields will be calculated automatically
    this.addTextField(
      'calc_projectedValue',
      this.t('Prognostizierter Wert bei Rentenbeginn (€):', 'Projected Value at Retirement (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_monthlyPension',
      this.t('Monatliche Rente (€):', 'Monthly Pension (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_targetGap',
      this.t('Abstand zum Zielwert (€):', 'Gap to Target (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_totalContributions',
      this.t('Gesamte Einzahlungen (€):', 'Total Contributions (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_capitalGains',
      this.t('Kapitalgewinne (€):', 'Capital Gains (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_totalFees',
      this.t('Gesamtkosten Gebühren (€):', 'Total Costs Fees (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_totalTaxes',
      this.t('Gesamte Steuern (€):', 'Total Taxes (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_totalCosts',
      this.t('Gesamtkosten (Gebühren + Steuern) (€):', 'Total Costs (Fees + Taxes) (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_netReturn',
      this.t('Nettoertrag (€):', 'Net Return (€):'),
      '',
      true
    );
    this.addTextField(
      'calc_effectiveReturn',
      this.t('Effektive Jahresrendite (%):', 'Effective Annual Return (%):'),
      '',
      true
    );
    this.addTextField(
      'calc_costRatio',
      this.t('Kostenquote (%):', 'Cost Ratio (%):'),
      '',
      true
    );
    this.addTextField(
      'calc_roi',
      this.t('Gesamtrendite - ROI (%):', 'Total Return - ROI (%):'),
      '',
      true
    );

    // ============= ADD CALCULATION JAVASCRIPT =============
    await this.addCalculationJavaScript();

    // Add footer
    const lastPage = this.doc.getPages()[this.doc.getPageCount() - 1];
    const footerText = this.t(
      'Hinweis: Öffnen Sie dieses PDF mit Adobe Acrobat Reader für beste Ergebnisse. ' +
      'Die Berechnungen aktualisieren sich automatisch beim Ändern der Eingabefelder.',
      'Note: Open this PDF with Adobe Acrobat Reader for best results. ' +
      'Calculations update automatically when you change input fields.'
    );

    lastPage.drawText(footerText, {
      x: this.leftMargin,
      y: 50,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
      maxWidth: this.pageWidth - (2 * this.leftMargin),
    });

    // Save and return
    return await this.doc.save();
  }

  /**
   * Add embedded JavaScript for automatic calculations
   */
  private async addCalculationJavaScript(): Promise<void> {
    const calculationScript = `
      // Pension Calculator - Automatic Calculation Script

      function getFieldValue(fieldName, defaultValue) {
        var field = this.getField(fieldName);
        if (!field || !field.value || field.value === "") return defaultValue || 0;
        var val = parseFloat(String(field.value).replace(/,/g, '.'));
        return isNaN(val) ? (defaultValue || 0) : val;
      }

      function setFieldValue(fieldName, value) {
        var field = this.getField(fieldName);
        if (field) {
          field.value = value;
        }
      }

      function formatNumber(num, decimals) {
        if (isNaN(num)) return "0.00";
        return num.toFixed(decimals || 2);
      }

      function calculatePension() {
        try {
          // Get input values
          var currentAge = getFieldValue("currentAge", 30);
          var startAge = getFieldValue("startAge", 30);
          var termYears = getFieldValue("termYears", 30);
          var monthlyContribution = getFieldValue("monthlyContribution", 500);
          var startInvestment = getFieldValue("startInvestment", 10000);
          var targetMaturityValue = getFieldValue("targetMaturityValue", 0);
          var payoutStartAge = getFieldValue("payoutStartAge", 67);
          var payoutEndAge = getFieldValue("payoutEndAge", 85);
          var annuityRate = getFieldValue("annuityRate", 3.5) / 100;
          var safeWithdrawalRate = getFieldValue("safeWithdrawalRate", 4.0) / 100;
          var expectedReturn = getFieldValue("expectedReturn", 6.5) / 100;
          var ter = getFieldValue("ter", 0.8) / 100;
          var policyFeeAnnualPct = getFieldValue("policyFeeAnnualPct", 0.4) / 100;
          var policyFixedAnnual = getFieldValue("policyFixedAnnual", 0);
          var taxRatePayout = getFieldValue("taxRatePayout", 17) / 100;
          var volatility = getFieldValue("volatility", 18) / 100;

          // Calculate monthly rate
          var monthlyRate = expectedReturn / 12;
          var monthlyFeeRate = (ter + policyFeeAnnualPct) / 12;
          var netMonthlyRate = monthlyRate - monthlyFeeRate;

          // Accumulation phase calculation
          var months = termYears * 12;
          var portfolioValue = startInvestment;
          var totalContributions = startInvestment;
          var totalFees = 0;

          // Compound growth for accumulation
          for (var m = 0; m < months; m++) {
            portfolioValue = portfolioValue * (1 + netMonthlyRate) + monthlyContribution;
            totalContributions += monthlyContribution;
            totalFees += portfolioValue * monthlyFeeRate + (policyFixedAnnual / 12);
          }

          var projectedValue = portfolioValue;
          var capitalGains = projectedValue - totalContributions;

          // Monthly pension calculation
          var monthlyPension = 0;
          var payoutMode = this.getField("payoutMode");
          var isAnnuity = payoutMode && String(payoutMode.value).indexOf("Rente") >= 0 || String(payoutMode.value).indexOf("Annuity") >= 0;

          if (isAnnuity) {
            monthlyPension = projectedValue * (annuityRate / 12);
          } else {
            monthlyPension = projectedValue * (safeWithdrawalRate / 12);
          }

          // Tax calculation during payout
          var payoutYears = payoutEndAge - payoutStartAge;
          var totalTaxes = monthlyPension * 12 * payoutYears * taxRatePayout;

          // Total costs
          var totalCosts = totalFees + totalTaxes;
          var netReturn = projectedValue - totalCosts;

          // Performance metrics
          var effectiveReturn = 0;
          if (termYears > 0 && totalContributions > 0) {
            effectiveReturn = (Math.pow(projectedValue / totalContributions, 1 / termYears) - 1) * 100;
          }

          var costRatio = (totalCosts / projectedValue) * 100;
          var roi = ((projectedValue - totalContributions) / totalContributions) * 100;

          // Target gap
          var targetGap = targetMaturityValue > 0 ? projectedValue - targetMaturityValue : 0;

          // Set calculated values
          setFieldValue("calc_projectedValue", formatNumber(projectedValue, 2));
          setFieldValue("calc_monthlyPension", formatNumber(monthlyPension, 2));
          setFieldValue("calc_targetGap", formatNumber(targetGap, 2));
          setFieldValue("calc_totalContributions", formatNumber(totalContributions, 2));
          setFieldValue("calc_capitalGains", formatNumber(capitalGains, 2));
          setFieldValue("calc_totalFees", formatNumber(totalFees, 2));
          setFieldValue("calc_totalTaxes", formatNumber(totalTaxes, 2));
          setFieldValue("calc_totalCosts", formatNumber(totalCosts, 2));
          setFieldValue("calc_netReturn", formatNumber(netReturn, 2));
          setFieldValue("calc_effectiveReturn", formatNumber(effectiveReturn, 2));
          setFieldValue("calc_costRatio", formatNumber(costRatio, 2));
          setFieldValue("calc_roi", formatNumber(roi, 2));

        } catch(e) {
          console.println("Calculation error: " + e.message);
        }
      }

      // Attach calculation to all input fields
      var inputFields = [
        "currentAge", "startAge", "termYears", "monthlyContribution",
        "startInvestment", "targetMaturityValue", "payoutStartAge",
        "payoutEndAge", "payoutMode", "annuityRate", "safeWithdrawalRate",
        "expectedReturn", "ter", "policyFeeAnnualPct", "policyFixedAnnual",
        "taxRatePayout", "volatility"
      ];

      for (var i = 0; i < inputFields.length; i++) {
        var field = this.getField(inputFields[i]);
        if (field) {
          field.setAction("Calculate", "calculatePension();");
        }
      }

      // Run initial calculation
      calculatePension();
    `;

    // Add the JavaScript to the PDF
    this.doc.context.obj({
      Type: 'JavaScript',
      S: 'JavaScript',
      JS: calculationScript,
    });
  }
}

/**
 * Generate and download an interactive PDF form
 */
export async function generateInteractivePensionForm(
  options: PensionFormData = {}
): Promise<Uint8Array> {
  const form = new InteractivePensionForm(options);
  return await form.create();
}
