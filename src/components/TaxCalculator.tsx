import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, PiggyBank, FileText, Euro, Settings, Check, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Chart from './Chart';
import RealtimeChart from './charts/RealtimeChart';
import EditableValue from '@/components/ui/EditableValue';
import DynamicInfoBox from '@/components/ui/DynamicInfoBox';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeUpdates, useFieldUpdates } from '@/hooks/use-realtime-updates';
import {
  CAPITAL_GAINS_TAX_RATE_PERCENT,
  GOVERNMENT_PARAMETERS_2024,
} from '@/data/governmentParameters';

interface TaxCalculatorProps {
  language: 'de' | 'en';
}

interface TaxCalculation {
  year: number;
  ruerupContribution: number;
  ruerupTaxSavings: number;
  ruerupNetCost: number;
  ruerupValue: number;
  etfContribution: number;
  etfTaxes: number;
  etfNetValue: number;
  ruerupAdvantage: number;
}

const CAPITAL_GAINS_TAX_DECIMAL = CAPITAL_GAINS_TAX_RATE_PERCENT / 100;
const DEFAULT_VORABPAUSCHALE = GOVERNMENT_PARAMETERS_2024.tax.vorabpauschaleBasiszins;
const DEFAULT_RUERUP_MAX = GOVERNMENT_PARAMETERS_2024.tax.ruerupMaxContribution;
const DEFAULT_RUERUP_DEDUCTIBLE_RATE = GOVERNMENT_PARAMETERS_2024.tax.ruerupDeductibleRate;
const DEFAULT_TAXABLE_PORTION = GOVERNMENT_PARAMETERS_2024.tax.taxablePortionRetirement;

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ language }) => {
  const [settings, setSettings] = useState({
    annualIncome: 65000,
    monthlyContribution: 500,
    investmentPeriod: 30,
    taxRate: 0.35,
    ruerupReturn: 0.065,
    etfReturn: 0.07,
    etfTaxRate: CAPITAL_GAINS_TAX_DECIMAL,
    vorabpauschale: DEFAULT_VORABPAUSCHALE,
  });

  // Real-time updates hooks
  const { updateValue, isUpdating, lastUpdate } = useRealtimeUpdates();
  const { editingField, editValue, startEditing, saveEdit, cancelEdit, changedValues } = useFieldUpdates();
  
  // Toast notifications
  const { toast } = useToast();
  const showSuccess = (title: string, description?: string) => {
    toast({ title, description, variant: 'default' });
  };
  const showError = (title: string, description?: string) => {
    toast({ title, description, variant: 'destructive' });
  };
  const showWarning = (title: string, description?: string) => {
    toast({ title, description, variant: 'default' });
  };
  
  // Loading and error states
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Handle field updates with real-time sync
  const handleFieldUpdate = useCallback(async (field: string, value: number) => {
    try {
      setIsCalculating(true);
      setCalculationError(null);
      
      setSettings(prev => ({ ...prev, [field]: value }));
      await updateValue(field, value);
      
      showSuccess('Wert aktualisiert', `${field} wurde erfolgreich geändert`);
    } catch (error) {
      setCalculationError(`Fehler beim Aktualisieren von ${field}`);
      showError('Aktualisierung fehlgeschlagen', `${field} konnte nicht aktualisiert werden`);
    } finally {
      setIsCalculating(false);
    }
  }, [updateValue, showSuccess, showError]);

  // Handle editable value save
  const handleEditableSave = useCallback(async (field: string, value: number) => {
    try {
      setIsCalculating(true);
      setCalculationError(null);
      
      await saveEdit(field, value);
      // Trigger recalculation if needed
      if (['monthlyContribution', 'expectedReturn', 'currentAge'].includes(field)) {
        setSettings(prev => ({ ...prev, [field]: value }));
      }
      
      showSuccess('Änderung gespeichert', `${field} wurde erfolgreich gespeichert`);
    } catch (error) {
      setCalculationError(`Fehler beim Speichern von ${field}`);
      showError('Speichern fehlgeschlagen', `${field} konnte nicht gespeichert werden`);
    } finally {
      setIsCalculating(false);
    }
  }, [saveEdit, showSuccess, showError]);

  // Maximaler Rürup-Beitrag 2024 (Sonderausgabenabzug)
  const maxRuerupContribution = DEFAULT_RUERUP_MAX;

  // Convert calculations to chart data format
  const convertToChartData = useCallback((yearlyResults: any[]) => {
    return yearlyResults.map((result, index) => ({
      year: new Date().getFullYear() + index,
      age: settings.currentAge + index,
      portfolioValue: result.totalValue || 0,
      contribution: result.contribution || 0,
      fees: result.fees || 0,
      isPayoutPhase: (settings.currentAge + index) >= settings.retirementAge
    }));
  }, [settings.currentAge, settings.retirementAge]);

const DEFAULT_TAXABLE_PORTION_PERCENT_LABEL = `${Math.round(DEFAULT_TAXABLE_PORTION * 100)}%`;
const RUERUP_DEDUCTIBLE_PERCENT_LABEL = `${Math.round(DEFAULT_RUERUP_DEDUCTIBLE_RATE * 100)}%`;

// Enhanced calculation logic for Debeka vs ETF comparison
  const calculateDebekaScenario = () => {
    const maxDeduction = DEFAULT_RUERUP_MAX;
    const annualContribution = settings.monthlyContribution * 12;
    const deductibleAmount = Math.min(annualContribution, maxDeduction) * DEFAULT_RUERUP_DEDUCTIBLE_RATE;
    const annualTaxSavings = deductibleAmount * settings.taxRate;
    const effectiveAnnualContribution = annualContribution - annualTaxSavings;
    
    // Accumulation phase with compound interest
    const monthlyContribution = annualContribution / 12;
    const monthlyReturn = settings.ruerupReturn / 12;
    const totalMonths = settings.investmentPeriod * 12;
    
    let accumulatedValue = 0;
    for (let month = 0; month < totalMonths; month++) {
      accumulatedValue = (accumulatedValue + monthlyContribution) * (1 + monthlyReturn);
    }
    
    // Payout phase - taxed using the current taxable portion (Besteuerungsanteil)
    const taxablePortionRate = DEFAULT_TAXABLE_PORTION;
    const monthlyPension = accumulatedValue * 0.025 / 12; // 2.5% annual withdrawal
    const monthlyTaxOnPension = monthlyPension * taxablePortionRate * settings.taxRate;
    const netMonthlyPension = monthlyPension - monthlyTaxOnPension;
    
    return {
      totalContributions: annualContribution * settings.investmentPeriod,
      totalTaxSavings: annualTaxSavings * settings.investmentPeriod,
      effectiveTotalContributions: effectiveAnnualContribution * settings.investmentPeriod,
      accumulatedValue,
      monthlyPension,
      netMonthlyPension,
      annualNetPension: netMonthlyPension * 12,
      effectiveReturn: (accumulatedValue / (effectiveAnnualContribution * settings.investmentPeriod) - 1) * 100
    };
  };

  const calculateETFScenario = () => {
    const annualContribution = settings.monthlyContribution * 12;
    const monthlyContribution = annualContribution / 12;
    const monthlyReturn = settings.etfReturn / 12;
    const totalMonths = settings.investmentPeriod * 12;
    
    let accumulatedValue = 0;
    let totalDividends = 0;
    
    // Accumulation with annual tax on dividends and Vorabpauschale
    for (let month = 0; month < totalMonths; month++) {
      accumulatedValue = (accumulatedValue + monthlyContribution) * (1 + monthlyReturn);
      
      // Annual dividend tax (simplified - applied monthly)
      if (month % 12 === 11) {
        const annualDividends = accumulatedValue * 0.02; // 2% dividend yield
        const dividendTax = annualDividends * settings.etfTaxRate;
        totalDividends += annualDividends;
        accumulatedValue -= dividendTax;
        
        // Vorabpauschale (only if no dividends or dividends < Vorabpauschale)
        const basiszins = settings.vorabpauschale;
        const vorabpauschale = Math.max(0, accumulatedValue * basiszins * 0.7 - annualDividends);
        const vorabpauschaleeTax = vorabpauschale * settings.etfTaxRate;
        accumulatedValue -= vorabpauschaleeTax;
      }
    }
    
    // Final capital gains tax on sale
    const totalContributions = annualContribution * settings.investmentPeriod;
    const capitalGains = Math.max(0, accumulatedValue - totalContributions);
    const capitalGainsTax = capitalGains * settings.etfTaxRate;
    const netValue = accumulatedValue - capitalGainsTax;
    
    // Withdrawal phase (4% rule)
    const annualWithdrawal = netValue * 0.04;
    const monthlyWithdrawal = annualWithdrawal / 12;
    
    return {
      totalContributions,
      accumulatedValue,
      totalDividends,
      capitalGains,
      capitalGainsTax,
      netValue,
      monthlyWithdrawal,
      annualWithdrawal,
      effectiveReturn: (netValue / totalContributions - 1) * 100
    };
  };

  // Berechnungsfunktionen
  const calculateTaxSavings = (contribution: number, taxRate: number) => {
    // Sonderausgabenabzug gemäß BMF (2024: 96 % der Beiträge bis zum Höchstbetrag)
    const deductibleAmount =
      Math.min(contribution, maxRuerupContribution) * DEFAULT_RUERUP_DEDUCTIBLE_RATE;
    return deductibleAmount * taxRate;
  };

  const calculateETFTaxes = (value: number, gains: number, year: number) => {
    // Vorabpauschale: Basiszins (BMF) * 70 % der Wertsteigerung, gedeckelt auf den realen Gewinn
    const basiszins = settings.vorabpauschale;
    const vorabpauschaleBase = value * basiszins;
    const maxVorabpauschale = gains * 0.7;
    const vorabpauschale = Math.min(vorabpauschaleBase, maxVorabpauschale, gains);
    
    // Kapitalertragsteuer inkl. Solidaritätszuschlag
    const taxRate = settings.etfTaxRate;
    
    // Jährliche Vorabpauschale-Steuer
    const annualVorabpauschaleeTax = vorabpauschale * taxRate;
    
    // Bei Verkauf: Steuer auf Gewinne abzüglich bereits gezahlter Vorabpauschale
    const remainingGains = Math.max(0, gains - vorabpauschale * year);
    const finalCapitalGainsTax = remainingGains * taxRate;
    
    return annualVorabpauschaleeTax * year + finalCapitalGainsTax;
  };



  // Berechnungen
  const { totalTaxSavings, calculations } = useMemo(() => {
    const results = [];
    let ruerupValue = 0;
    let etfValue = 0;
    let totalSavings = 0;
    let totalETFContributions = 0;

    for (let year = 1; year <= settings.investmentPeriod; year++) {
      const annualContribution = settings.monthlyContribution * 12;
      const effectiveContribution = Math.min(annualContribution, maxRuerupContribution);
      
      // Rürup-Berechnung
      const yearlyTaxSaving = calculateTaxSavings(effectiveContribution, settings.taxRate);
      totalSavings += yearlyTaxSaving;
      ruerupValue = (ruerupValue + annualContribution) * (1 + settings.ruerupReturn);
      
      // ETF-Berechnung
      totalETFContributions += annualContribution;
      etfValue = (etfValue + annualContribution) * (1 + settings.etfReturn);
      const gains = etfValue - totalETFContributions;
      const etfTaxes = calculateETFTaxes(etfValue, gains, year);
      const etfNetValue = etfValue - etfTaxes;
      
      results.push({
        year,
        ruerupValue,
        etfValue,
        etfNetValue,
        ruerupTaxSavings: totalSavings,
        ruerupAdvantage: ruerupValue - etfNetValue,
        ruerupContributions: annualContribution * year,
        etfContributions: annualContribution * year
      });
    }

    return {
      totalTaxSavings: totalSavings,
      calculations: results
    };
  }, [settings, maxRuerupContribution]);

  const finalYear = calculations[calculations.length - 1];
  
  // Comparison metrics
  const advantageDebeka = finalYear ? finalYear.ruerupValue > finalYear.etfNetValue : false;
  const advantageAmount = finalYear ? Math.abs(finalYear.ruerupValue - finalYear.etfNetValue) : 0;
  const advantagePercentage = finalYear ? (advantageAmount / Math.min(finalYear.ruerupValue, finalYear.etfNetValue)) * 100 : 0;

  const texts = {
    de: {
      title: 'Steuerrechner: Rürup vs. ETF',
      description: 'Vergleichen Sie die Steuervorteile von Rürup-Renten mit normalen ETF-Investments',
      income: 'Jahreseinkommen',
      contribution: 'Monatlicher Beitrag',
      period: 'Anlagezeitraum (Jahre)',
      taxRate: 'Grenzsteuersatz',
      ruerupReturn: 'Rürup-Rendite p.a.',
      etfReturn: 'ETF-Rendite p.a.',
      maxContribution: `Max. Sonderausgaben 2024: 27.566€ (${RUERUP_DEDUCTIBLE_PERCENT_LABEL} absetzbar)`,
      taxSavings: 'Jährliche Steuerersparnis',
      totalSavings: 'Gesamte Steuerersparnis',
      finalValue: 'Endwert nach',
      advantage: 'Rürup-Vorteil',
      ruerup: 'Rürup-Rente',
      etf: 'ETF-Investment',
      comparison: 'Vergleich',
      details: 'Details',
      year: 'Jahr',
      value: 'Wert',
      netCost: 'Netto-Kosten',
      taxes: 'Steuern',
    },
    en: {
      title: 'Tax Calculator: Rürup vs. ETF',
      description: 'Compare tax advantages of Rürup pensions with regular ETF investments',
      income: 'Annual Income',
      contribution: 'Monthly Contribution',
      period: 'Investment Period (Years)',
      taxRate: 'Marginal Tax Rate',
      ruerupReturn: 'Rürup Return p.a.',
      etfReturn: 'ETF Return p.a.',
      maxContribution: `Max. Tax Deduction 2024: €27,566 (${RUERUP_DEDUCTIBLE_PERCENT_LABEL} deductible)`,
      taxSavings: 'Annual Tax Savings',
      totalSavings: 'Total Tax Savings',
      finalValue: 'Final Value after',
      advantage: 'Rürup Advantage',
      ruerup: 'Rürup Pension',
      etf: 'ETF Investment',
      comparison: 'Comparison',
      details: 'Details',
      year: 'Year',
      value: 'Value',
      netCost: 'Net Cost',
      taxes: 'Taxes',
    },
  };

  const t = texts[language];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Global Loading Overlay */}
        {isCalculating && (
          <LoadingSpinner 
            variant="overlay" 
            text="Berechnung wird durchgeführt..." 
            size="lg" 
          />
        )}
        
        {/* Error Alert */}
        {calculationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Berechnungsfehler</AlertTitle>
            <AlertDescription>{calculationError}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                <span className="text-lg sm:text-xl">{t.title}</span>
              </div>
              {(isUpdating || isCalculating) && (
                <Badge variant="secondary" className="animate-pulse w-fit">
                  <Settings className="w-3 h-3 mr-1 animate-spin" />
                  <span className="hidden sm:inline">
                    {isCalculating ? 'Berechnet...' : 'Aktualisierung...'}
                  </span>
                  <span className="sm:hidden">
                    {isCalculating ? 'Berechnet' : 'Update'}
                  </span>
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">{t.description}</CardDescription>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Einkommen */}
            <div className="space-y-2">
              <Label>{t.income}</Label>
              <Input
                type="number"
                value={settings.annualIncome}
                onChange={(e) => handleFieldUpdate('annualIncome', Number(e.target.value))}
                className="text-center font-mono"
              />
              <EditableValue
                value={settings.annualIncome}
                onSave={(value) => handleEditableSave('annualIncome', value)}
                format="currency"
                min={20000}
                max={150000}
                className="text-xs text-muted-foreground text-center"
              />
            </div>

            {/* Monatlicher Beitrag */}
            <div className="space-y-2">
              <Label>{t.contribution}</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.monthlyContribution]}
                  onValueChange={([value]) => handleFieldUpdate('monthlyContribution', value)}
                  max={2000}
                  min={50}
                  step={50}
                  className="w-full"
                />
                <EditableValue
                  value={settings.monthlyContribution}
                  onSave={(value) => handleEditableSave('monthlyContribution', value)}
                  format="currency"
                  min={50}
                  max={2000}
                  className="text-center font-mono text-sm"
                />
              </div>
            </div>

            {/* Anlagezeitraum */}
            <div className="space-y-2">
              <Label>{t.period}</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.investmentPeriod]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, investmentPeriod: value }))}
                  max={40}
                  min={10}
                  step={1}
                  className="w-full"
                />
                <div className="text-center font-mono text-sm">
                  {settings.investmentPeriod} Jahre
                </div>
              </div>
            </div>

            {/* Grenzsteuersatz */}
            <div className="space-y-2">
              <Label>{t.taxRate}</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.taxRate * 100]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, taxRate: value / 100 }))}
                  max={45}
                  min={14}
                  step={1}
                  className="w-full"
                />
                <div className="text-center font-mono text-sm">
                  {(settings.taxRate * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Rürup-Rendite */}
            <div className="space-y-2">
              <Label>{t.ruerupReturn}</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.ruerupReturn * 100]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, ruerupReturn: value / 100 }))}
                  max={10}
                  min={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-center font-mono text-sm">
                  {(settings.ruerupReturn * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* ETF-Rendite */}
            <div className="space-y-2">
              <Label>{t.etfReturn}</Label>
              <div className="space-y-2">
                <Slider
                  value={[settings.etfReturn * 100]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, etfReturn: value / 100 }))}
                  max={12}
                  min={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-center font-mono text-sm">
                  {(settings.etfReturn * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <DynamicInfoBox
          contentType="tax-optimization"
          contextData={{
            annualIncome: settings.annualIncome,
            monthlyContribution: settings.monthlyContribution,
            taxRate: settings.taxRate
          }}
          autoRefresh={true}
          refreshInterval={15000}
        />
        <DynamicInfoBox
          contentType="risk-assessment"
          contextData={{
            ruerupReturn: settings.ruerupReturn,
            etfReturn: settings.etfReturn,
            investmentPeriod: settings.investmentPeriod
          }}
          autoRefresh={true}
          refreshInterval={20000}
        />
        <DynamicInfoBox
          contentType="performance-alert"
          contextData={{
            ruerupValue: finalYear?.ruerupValue || 0,
            etfValue: finalYear?.etfNetValue || 0,
            taxSavings: totalTaxSavings
          }}
          autoRefresh={true}
          refreshInterval={10000}
        />
      </div>

      {/* Ergebnisse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <EditableValue
                value={maxRuerupContribution}
                onSave={(value) => handleEditableSave('maxRuerupContribution', value)}
                format="currency"
                className="text-2xl font-bold text-green-600"
                variant="highlight"
                size="lg"
              />
              <p className="text-sm text-muted-foreground">{t.maxContribution}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <EditableValue
                value={calculateTaxSavings(Math.min(settings.monthlyContribution * 12, maxRuerupContribution), settings.taxRate)}
                onSave={(value) => handleEditableSave('annualTaxSavings', value)}
                format="currency"
                className="text-2xl font-bold text-blue-600"
                variant="highlight"
                size="lg"
              />
              <p className="text-sm text-muted-foreground">{t.taxSavings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <EditableValue
                value={totalTaxSavings}
                onSave={(value) => handleEditableSave('totalTaxSavings', value)}
                format="currency"
                className="text-2xl font-bold text-purple-600"
                variant="highlight"
                size="lg"
              />
              <p className="text-sm text-muted-foreground">{t.totalSavings}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                finalYear?.ruerupAdvantage > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {finalYear ? formatCurrency(Math.abs(finalYear.ruerupAdvantage)) : '€0'}
              </div>
              <p className="text-sm text-muted-foreground">
                {finalYear?.ruerupAdvantage > 0 ? t.advantage : 'ETF-Vorteil'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts und Details */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">{t.comparison}</TabsTrigger>
          <TabsTrigger value="taxsavings">Steuerersparnis</TabsTrigger>
          <TabsTrigger value="details">{t.details}</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealtimeChart
              data={convertToChartData(calculations)}
              title="Rürup vs ETF - Vermögensentwicklung"
              type="line"
              isUpdating={isUpdating}
              lastUpdate={lastUpdate}
              highlightChanges={true}
              showAnimation={true}
            />
            <RealtimeChart
              data={convertToChartData(calculations)}
              title="Steuerersparnis Entwicklung"
              type="bar"
              isUpdating={isUpdating}
              lastUpdate={lastUpdate}
              highlightChanges={true}
              showAnimation={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="taxsavings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Jährliche Steuerersparnis */}
            <Card>
              <CardHeader>
                <CardTitle>Jährliche Steuerersparnis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={calculations.filter((_, index) => index % 2 === 1)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="ruerupTaxSavings" fill="#10b981" name="Steuerersparnis" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gesamtverteilung nach Laufzeit */}
            <Card>
              <CardHeader>
                <CardTitle>Gesamtverteilung nach {settings.investmentPeriod} Jahren</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Eingezahlte Beiträge', value: finalYear?.ruerupContributions || 0, fill: '#3b82f6' },
                        { name: 'Zinserträge', value: (finalYear?.ruerupValue || 0) - (finalYear?.ruerupContributions || 0), fill: '#10b981' },
                        { name: 'Steuerersparnis', value: totalTaxSavings, fill: '#f59e0b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Steuerersparnis-Übersicht */}
          <Card>
            <CardHeader>
              <CardTitle>Steuerersparnis-Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculateTaxSavings(Math.min(settings.monthlyContribution * 12, maxRuerupContribution), settings.taxRate))}
                  </div>
                  <p className="text-sm text-green-700">Jährliche Steuerersparnis</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(totalTaxSavings)}
                  </div>
                  <p className="text-sm text-blue-700">Gesamte Steuerersparnis</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {((calculateTaxSavings(Math.min(settings.monthlyContribution * 12, maxRuerupContribution), settings.taxRate) / (settings.monthlyContribution * 12)) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-purple-700">Effektive Steuerersparnis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {/* Detaillierte Steueraufschlüsselung */}
          <Card>
            <CardHeader>
              <CardTitle>Detaillierte Steueraufschlüsselung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rürup-Pension Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">Rürup-Pension (Basisrente)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded">
                      <span>Jährlicher Beitrag:</span>
                      <span className="font-mono">{formatCurrency(Math.min(settings.monthlyContribution * 12, maxRuerupContribution))}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Abzugsfähiger Betrag (${RUERUP_DEDUCTIBLE_PERCENT_LABEL} für 2024):</span>
                      <span className="font-mono">{formatCurrency(Math.min(settings.monthlyContribution * 12, maxRuerupContribution) * DEFAULT_RUERUP_DEDUCTIBLE_RATE)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-100 rounded">
                      <span>Jährliche Steuerersparnis:</span>
                      <span className="font-mono font-bold text-green-600">{formatCurrency(calculateTaxSavings(Math.min(settings.monthlyContribution * 12, maxRuerupContribution), settings.taxRate))}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded">
                      <span>Nachgelagerte Besteuerung:</span>
                      <span className="text-sm">{DEFAULT_TAXABLE_PORTION_PERCENT_LABEL} Besteuerungsanteil bei Rentenbeginn 2024+</span>
                    </div>
                  </div>
                </div>

                {/* ETF Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">ETF-Investment</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Jährlicher Beitrag:</span>
                      <span className="font-mono">{formatCurrency(settings.monthlyContribution * 12)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-orange-50 rounded">
                      <span>Vorabpauschale (jährlich):</span>
                      <span className="font-mono">{finalYear ? formatCurrency(calculateETFTaxes(finalYear.etfValue, finalYear.etfValue - finalYear.etfContributions, 1).vorabpauschaleTotal / settings.investmentPeriod) : '€0'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-100 rounded">
                      <span>Kapitalertragsteuer (Verkauf):</span>
                      <span className="font-mono">{finalYear ? formatCurrency(calculateETFTaxes(finalYear.etfValue, finalYear.etfValue - finalYear.etfContributions, 1).capitalGainsTax) : '€0'}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded">
                      <span>Taxation:</span>
                      <span className="text-sm">{DEFAULT_TAXABLE_PORTION_PERCENT_LABEL} taxable portion for retirement from 2024+</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Break-Even Analyse */}
          <Card>
            <CardHeader>
              <CardTitle>Break-Even Analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {finalYear ? Math.round((finalYear.ruerupValue / (finalYear.ruerupContributions + totalTaxSavings)) * 100) : 0}%
                    </div>
                    <p className="text-sm text-blue-700">Effektive Rürup-Rendite</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">
                      {finalYear ? Math.round((finalYear.etfNetValue / (finalYear.etfContributions)) * 100) : 0}%
                    </div>
                    <p className="text-sm text-red-700">Effektive ETF-Rendite</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {finalYear && finalYear.ruerupAdvantage > 0 ? 
                        Math.round((finalYear.ruerupAdvantage / finalYear.etfNetValue) * 100) : 0}%
                    </div>
                    <p className="text-sm text-purple-700">Relativer Vorteil</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Wichtige Hinweise:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Rürup-Renten: {DEFAULT_TAXABLE_PORTION_PERCENT_LABEL} steuerpflichtig bei Rentenbeginn 2024, steigt jährlich um 0,5 %-Punkte bis 100%</li>
                    <li>• ETF-Erträge unterliegen der Abgeltungsteuer (26,375%)</li>
                    <li>• Vorabpauschale wird jährlich auf unrealisierte Gewinne erhoben</li>
                    <li>• Steuerersparnis kann reinvestiert werden für zusätzliche Rendite</li>
                    <li>• Besteuerungsanteil steigt jährlich um 0,5% bis 100% (ab 2040)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jährliche Entwicklung */}
          <Card>
            <CardHeader>
              <CardTitle>Jährliche Entwicklung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">{t.year}</th>
                      <th className="text-right p-2">Rürup {t.value}</th>
                      <th className="text-right p-2">ETF {t.value}</th>
                      <th className="text-right p-2">{t.taxSavings}</th>
                      <th className="text-right p-2">Vorteil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.filter((_, index) => index % 5 === 4 || index === calculations.length - 1).map((calc) => (
                      <tr key={calc.year} className="border-b">
                        <td className="p-2">{calc.year}</td>
                        <td className="text-right p-2 font-mono">{formatCurrency(calc.ruerupValue)}</td>
                        <td className="text-right p-2 font-mono">{formatCurrency(calc.etfNetValue)}</td>
                        <td className="text-right p-2 font-mono text-green-600">{formatCurrency(calc.ruerupTaxSavings)}</td>
                        <td className={`text-right p-2 font-mono ${
                          calc.ruerupAdvantage > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.abs(calc.ruerupAdvantage))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default TaxCalculator;
