import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGeneratorOptions {
  language: 'de' | 'en';
  formData: any;
  simulationResults: any;
  costSettings: any;
  comparisonData?: any[];
}

export class PDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private yPosition: number;
  private language: 'de' | 'en';
  private margin = 20;
  private lineHeight = 6;

  constructor(private options: PDFGeneratorOptions) {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = this.margin;
    this.language = options.language;
  }

  private t(de: string, en: string): string {
    return this.language === 'de' ? de : en;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  private checkPageBreak(requiredSpace: number = 20): void {
    if (this.yPosition + requiredSpace > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.yPosition = this.margin;
    }
  }

  private addHeader(): void {
    // Title
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(0, 102, 204);
    this.pdf.text(
      this.t('Rentenrechner Detailbericht', 'Pension Calculator Detailed Report'),
      this.margin,
      this.yPosition
    );
    this.yPosition += 12;

    // Subtitle
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(
      `${this.t('Erstellt am:', 'Created on:')} ${new Date().toLocaleDateString(this.language === 'de' ? 'de-DE' : 'en-US')}`,
      this.margin,
      this.yPosition
    );
    this.yPosition += 15;

    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
    this.yPosition += 10;
  }

  private addSectionTitle(title: string): void {
    this.checkPageBreak(15);
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(title, this.margin, this.yPosition);
    this.yPosition += 10;
  }

  private addSubSectionTitle(title: string): void {
    this.checkPageBreak(12);
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(50, 50, 50);
    this.pdf.text(title, this.margin, this.yPosition);
    this.yPosition += 8;
  }

  private addKeyValue(key: string, value: string, indent: number = 0): void {
    this.checkPageBreak(8);
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);

    const xPos = this.margin + indent;
    this.pdf.text(key, xPos, this.yPosition);

    // Right align the value
    const valueWidth = this.pdf.getTextWidth(value);
    this.pdf.setTextColor(0, 102, 204);
    this.pdf.text(value, this.pageWidth - this.margin - valueWidth, this.yPosition);

    this.yPosition += this.lineHeight;
  }

  private addInputParameters(): void {
    this.addSectionTitle(this.t('1. Eingabeparameter', '1. Input Parameters'));

    const formData = this.options.formData;

    // Personal Information
    this.addSubSectionTitle(this.t('Persönliche Daten', 'Personal Information'));
    this.addKeyValue(
      this.t('Aktuelles Alter:', 'Current Age:'),
      `${formData.currentAge} ${this.t('Jahre', 'years')}`
    );
    this.addKeyValue(
      this.t('Startalter:', 'Start Age:'),
      `${formData.startAge} ${this.t('Jahre', 'years')}`
    );
    this.yPosition += 5;

    // Investment Parameters
    this.addSubSectionTitle(this.t('Anlage-Parameter', 'Investment Parameters'));
    this.addKeyValue(
      this.t('Laufzeit:', 'Duration:'),
      `${formData.termYears} ${this.t('Jahre', 'years')}`
    );
    this.addKeyValue(
      this.t('Monatlicher Beitrag:', 'Monthly Contribution:'),
      this.formatCurrency(formData.monthlyContribution)
    );
    this.addKeyValue(
      this.t('Startkapital:', 'Initial Capital:'),
      this.formatCurrency(formData.startInvestment)
    );
    if (formData.targetMaturityValue) {
      this.addKeyValue(
        this.t('Zielwert bei Rentenbeginn:', 'Target Value at Retirement:'),
        this.formatCurrency(formData.targetMaturityValue)
      );
    }
    this.yPosition += 5;

    // Payout Phase
    this.addSubSectionTitle(this.t('Auszahlungsphase', 'Payout Phase'));
    this.addKeyValue(
      this.t('Rentenbeginn:', 'Retirement Start:'),
      `${formData.payoutStartAge} ${this.t('Jahre', 'years')}`
    );
    this.addKeyValue(
      this.t('Rentenende:', 'Retirement End:'),
      `${formData.payoutEndAge} ${this.t('Jahre', 'years')}`
    );
    this.addKeyValue(
      this.t('Auszahlungsmodus:', 'Payout Mode:'),
      formData.payoutMode === 'annuity'
        ? this.t('Lebenslange Rente', 'Lifetime Annuity')
        : this.t('Flexible Entnahme', 'Flexible Withdrawal')
    );
    if (formData.payoutMode === 'annuity' && formData.annuityRate) {
      this.addKeyValue(
        this.t('Rentenfaktor:', 'Annuity Rate:'),
        this.formatPercent(formData.annuityRate)
      );
    }
    if (formData.payoutMode === 'flex' && formData.safeWithdrawalRate) {
      this.addKeyValue(
        this.t('Entnahmerate:', 'Withdrawal Rate:'),
        this.formatPercent(formData.safeWithdrawalRate)
      );
    }
    this.yPosition += 10;
  }

  private addCostSettings(): void {
    this.addSectionTitle(this.t('2. Kosten & Steuereinstellungen', '2. Cost & Tax Settings'));

    const costSettings = this.options.costSettings;

    this.addKeyValue(
      this.t('Erwartete Rendite (p.a.):', 'Expected Return (p.a.):'),
      this.formatPercent(costSettings.expectedReturn)
    );
    this.addKeyValue(
      this.t('TER Fonds (p.a.):', 'Fund TER (p.a.):'),
      this.formatPercent(costSettings.ter)
    );
    this.addKeyValue(
      this.t('Policenkosten (p.a.):', 'Policy Fee (p.a.):'),
      this.formatPercent(costSettings.policyFeeAnnualPct)
    );
    this.addKeyValue(
      this.t('Fixe Policenkosten:', 'Fixed Policy Fee:'),
      this.formatCurrency(costSettings.policyFixedAnnual || 0)
    );
    this.addKeyValue(
      this.t('Steuersatz Auszahlung:', 'Tax Rate Payout:'),
      this.formatPercent(costSettings.taxRatePayout)
    );
    this.addKeyValue(
      this.t('Volatilität:', 'Volatility:'),
      this.formatPercent(costSettings.volatility)
    );
    this.addKeyValue(
      this.t('Rebalancing:', 'Rebalancing:'),
      costSettings.rebalancingEnabled ? this.t('Aktiviert', 'Enabled') : this.t('Deaktiviert', 'Disabled')
    );
    this.yPosition += 10;
  }

  private addSimulationResults(): void {
    this.addSectionTitle(this.t('3. Simulationsergebnisse', '3. Simulation Results'));

    const kpis = this.options.simulationResults.kpis;

    // Main Results
    this.addSubSectionTitle(this.t('Hauptergebnisse', 'Main Results'));
    this.addKeyValue(
      this.t('Prognostizierter Wert bei Rentenbeginn:', 'Projected Value at Retirement:'),
      this.formatCurrency(kpis.projectedValue)
    );
    this.addKeyValue(
      this.t('Monatliche Rente:', 'Monthly Pension:'),
      this.formatCurrency(kpis.monthlyPension)
    );
    if (kpis.targetGap !== undefined && kpis.targetGap !== 0) {
      const gapText = kpis.targetGap > 0
        ? this.t('Über Ziel', 'Above Target')
        : this.t('Unter Ziel', 'Below Target');
      this.addKeyValue(
        this.t('Abstand zum Zielwert:', 'Gap to Target:'),
        `${this.formatCurrency(Math.abs(kpis.targetGap))} (${gapText})`
      );
    }
    this.yPosition += 5;

    // Financial Breakdown
    this.addSubSectionTitle(this.t('Finanzielle Aufschlüsselung', 'Financial Breakdown'));
    this.addKeyValue(
      this.t('Gesamte Einzahlungen:', 'Total Contributions:'),
      this.formatCurrency(kpis.totalContributions)
    );
    this.addKeyValue(
      this.t('Kapitalgewinne:', 'Capital Gains:'),
      this.formatCurrency(kpis.capitalGains)
    );
    this.addKeyValue(
      this.t('Gesamtkosten (Gebühren):', 'Total Costs (Fees):'),
      this.formatCurrency(kpis.totalFees)
    );
    if (kpis.totalTaxes !== undefined) {
      this.addKeyValue(
        this.t('Gesamte Steuern:', 'Total Taxes:'),
        this.formatCurrency(kpis.totalTaxes)
      );
    }
    this.addKeyValue(
      this.t('Gesamtkosten (Gebühren + Steuern):', 'Total Costs (Fees + Taxes):'),
      this.formatCurrency(kpis.totalCosts)
    );
    this.addKeyValue(
      this.t('Nettoertrag:', 'Net Return:'),
      this.formatCurrency(kpis.netReturn)
    );
    this.yPosition += 5;

    // Performance Metrics
    this.addSubSectionTitle(this.t('Performance-Kennzahlen', 'Performance Metrics'));

    // Calculate effective annual return
    const years = this.options.formData.termYears;
    const totalInvested = kpis.totalContributions;
    const finalValue = kpis.projectedValue;
    const effectiveReturn = ((finalValue / totalInvested) ** (1 / years) - 1);

    this.addKeyValue(
      this.t('Effektive Jahresrendite:', 'Effective Annual Return:'),
      this.formatPercent(effectiveReturn)
    );

    const costRatio = (kpis.totalCosts / kpis.projectedValue);
    this.addKeyValue(
      this.t('Kostenquote:', 'Cost Ratio:'),
      this.formatPercent(costRatio)
    );

    const returnOnInvestment = ((finalValue - totalInvested) / totalInvested);
    this.addKeyValue(
      this.t('Gesamtrendite (ROI):', 'Total Return (ROI):'),
      this.formatPercent(returnOnInvestment)
    );

    this.yPosition += 10;
  }

  private async addChart(selector: string, title: string): Promise<void> {
    try {
      const chartElement = document.querySelector(selector) as HTMLElement;
      if (!chartElement) {
        console.warn(`Chart not found: ${selector}`);
        return;
      }

      this.checkPageBreak(80);

      // Add chart title
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(50, 50, 50);
      this.pdf.text(title, this.margin, this.yPosition);
      this.yPosition += 8;

      // Capture chart
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - (2 * this.margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if image fits on current page
      if (this.yPosition + imgHeight > this.pageHeight - this.margin) {
        this.pdf.addPage();
        this.yPosition = this.margin;

        // Re-add title on new page
        this.pdf.setFontSize(12);
        this.pdf.setTextColor(50, 50, 50);
        this.pdf.text(title, this.margin, this.yPosition);
        this.yPosition += 8;
      }

      this.pdf.addImage(imgData, 'PNG', this.margin, this.yPosition, imgWidth, imgHeight);
      this.yPosition += imgHeight + 15;
    } catch (error) {
      console.error(`Failed to add chart ${selector}:`, error);
    }
  }

  private async addAllCharts(): Promise<void> {
    this.addSectionTitle(this.t('4. Grafische Darstellung', '4. Graphical Representation'));

    // Get all chart containers
    const chartContainers = document.querySelectorAll('.chart-container');

    for (let i = 0; i < chartContainers.length; i++) {
      const chartContainer = chartContainers[i] as HTMLElement;
      const chartTitle = this.t(
        `Grafik ${i + 1}`,
        `Chart ${i + 1}`
      );

      try {
        this.checkPageBreak(80);

        // Add chart title
        this.pdf.setFontSize(12);
        this.pdf.setTextColor(50, 50, 50);
        this.pdf.text(chartTitle, this.margin, this.yPosition);
        this.yPosition += 8;

        // Capture chart
        const canvas = await html2canvas(chartContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = this.pageWidth - (2 * this.margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if image fits on current page
        if (this.yPosition + imgHeight > this.pageHeight - this.margin) {
          this.pdf.addPage();
          this.yPosition = this.margin;

          // Re-add title on new page
          this.pdf.setFontSize(12);
          this.pdf.setTextColor(50, 50, 50);
          this.pdf.text(chartTitle, this.margin, this.yPosition);
          this.yPosition += 8;
        }

        this.pdf.addImage(imgData, 'PNG', this.margin, this.yPosition, imgWidth, imgHeight);
        this.yPosition += imgHeight + 15;
      } catch (error) {
        console.warn(`Chart ${i + 1} capture failed:`, error);
      }
    }
  }

  private addComparisonData(): void {
    if (!this.options.comparisonData || this.options.comparisonData.length === 0) {
      return;
    }

    this.addSectionTitle(this.t('5. Strategievergleich', '5. Strategy Comparison'));

    this.options.comparisonData.forEach((scenario, index) => {
      const labels = [
        this.t('Konservativ', 'Conservative'),
        this.t('Aktuell', 'Current'),
        this.t('Aggressiv', 'Aggressive')
      ];

      this.addSubSectionTitle(`${labels[index] || `Scenario ${index + 1}`}`);

      if (scenario.kpis) {
        this.addKeyValue(
          this.t('Prognostizierter Wert:', 'Projected Value:'),
          this.formatCurrency(scenario.kpis.projectedValue),
          5
        );
        this.addKeyValue(
          this.t('Monatliche Rente:', 'Monthly Pension:'),
          this.formatCurrency(scenario.kpis.monthlyPension),
          5
        );
        this.addKeyValue(
          this.t('Gesamtkosten:', 'Total Costs:'),
          this.formatCurrency(scenario.kpis.totalCosts),
          5
        );
        this.addKeyValue(
          this.t('Nettoertrag:', 'Net Return:'),
          this.formatCurrency(scenario.kpis.netReturn),
          5
        );
        this.yPosition += 5;
      }
    });

    this.yPosition += 10;
  }

  private addFooter(): void {
    // Add disclaimer
    this.checkPageBreak(30);

    this.pdf.setFontSize(8);
    this.pdf.setTextColor(150, 150, 150);

    const disclaimer = this.t(
      'Dieser Bericht dient ausschließlich zu Informationszwecken und stellt keine Finanzberatung dar. ' +
      'Die dargestellten Werte basieren auf Simulationen und können von tatsächlichen Ergebnissen abweichen. ' +
      'Vergangene Performance ist kein Indikator für zukünftige Ergebnisse.',
      'This report is for informational purposes only and does not constitute financial advice. ' +
      'The values shown are based on simulations and may differ from actual results. ' +
      'Past performance is not indicative of future results.'
    );

    const lines = this.pdf.splitTextToSize(disclaimer, this.pageWidth - (2 * this.margin));
    this.pdf.text(lines, this.margin, this.yPosition);
  }

  public async generate(): Promise<jsPDF> {
    try {
      // Add all sections
      this.addHeader();
      this.addInputParameters();
      this.addCostSettings();
      this.addSimulationResults();
      await this.addAllCharts();
      this.addComparisonData();
      this.addFooter();

      return this.pdf;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  public async save(filename?: string): Promise<void> {
    const pdf = await this.generate();
    const defaultFilename = `pension-report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename || defaultFilename);
  }
}

// Helper function to export PDF
export async function generatePensionPDF(options: PDFGeneratorOptions): Promise<void> {
  const generator = new PDFGenerator(options);
  await generator.save();
}
