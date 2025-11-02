import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  grossIncome: number;
  expectedStatutoryPension: number;
  vistaPensionMonthly: number;
  fundSavingsPlanMonthly: number;
  yearsUntilRetirement: number;
  currentAge: number;
  projectedFundValue: number;
  freistellungsauftrag: number;
  fundReturnRate: number;
}

export async function exportDashboardToPDF(elementId: string, filename: string = 'rentenanalyse.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}

export function generateSimplePDFReport(data: ExportData): void {
  const pdf = new jsPDF();

  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // Blue
  pdf.text('Rentenanalyse Premium', 20, 20);

  // Date
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, 30);

  // Line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, 35, 190, 35);

  // Personal Information
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Persönliche Daten', 20, 45);

  pdf.setFontSize(11);
  pdf.setTextColor(60, 60, 60);
  let y = 55;

  const formatCurrency = (value: number) => `${value.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €`;

  // Data rows
  const rows = [
    ['Aktuelles Alter:', `${data.currentAge} Jahre`],
    ['Jahre bis zur Rente:', `${data.yearsUntilRetirement} Jahre`],
    ['Bruttoeinkommen (jährlich):', formatCurrency(data.grossIncome)],
    ['', ''],
    ['Rentenprognosen', ''],
    ['Gesetzliche Rente (monatlich):', formatCurrency(data.expectedStatutoryPension)],
    ['Vista Rente (monatlich):', formatCurrency(data.vistaPensionMonthly)],
    ['Gesamtrente (monatlich):', formatCurrency(data.expectedStatutoryPension + data.vistaPensionMonthly)],
    ['', ''],
    ['Fondssparplan', ''],
    ['Monatliche Sparrate:', formatCurrency(data.fundSavingsPlanMonthly)],
    ['Erwartete Rendite:', `${data.fundReturnRate}% p.a.`],
    ['Projektiertes Fondsvermögen:', formatCurrency(data.projectedFundValue)],
    ['', ''],
    ['Steuereinstellungen', ''],
    ['Freistellungsauftrag:', formatCurrency(data.freistellungsauftrag)],
  ];

  rows.forEach(([label, value]) => {
    if (label === '' && value === '') {
      y += 5;
      return;
    }

    if (value === '') {
      // Section header
      pdf.setFontSize(12);
      pdf.setTextColor(37, 99, 235);
      pdf.text(label, 20, y);
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      y += 8;
    } else {
      // Data row
      pdf.text(label, 20, y);
      pdf.text(value, 120, y);
      y += 7;
    }
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Erstellt mit Rentenrechner Premium | Alle Angaben ohne Gewähr', 20, 280);
  pdf.text('Diese Berechnung basiert auf vereinfachten Annahmen und ersetzt keine professionelle Beratung.', 20, 285);

  // Save
  const filename = `rentenanalyse_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
