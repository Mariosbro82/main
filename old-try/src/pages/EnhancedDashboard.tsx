import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calculator, Settings, X, DollarSign, PieChart, Wallet, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { formatCurrency } from '@/lib/utils';

interface EnhancedDashboardProps {
  language?: 'de' | 'en';
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ language = 'de' }) => {
  console.log('EnhancedDashboard rendering...');
  
  const onboardingData = useOnboardingStore((state) => state.data);
  const isCompleted = useOnboardingStore((state) => state.isCompleted);

  console.log('Onboarding completed:', isCompleted);
  console.log('Onboarding data:', onboardingData);

  // Use demo data if onboarding is not completed
  const demoData = {
    personal: { birthYear: 1985, maritalStatus: 'single' as const },
    income: { grossAnnual: 60000, netMonthly: 3500 },
    pensions: { public67: 1800 },
    privatePension: { contribution: 300 },
    lifeInsurance: { sum: 50000 },
    funds: { balance: 500 },
    riester: { amount: 0 },
    ruerup: { amount: 0 },
    occupationalPension: { amount: 0 },
  };

  const data = isCompleted ? onboardingData : demoData;
  console.log('Using data:', data);

  const [chartMode, setChartMode] = useState<1 | 2>(1);
  const [showWithdrawalSimulator, setShowWithdrawalSimulator] = useState(false);
  const [showTaxSettings, setShowTaxSettings] = useState(false);
  const [showFundSettings, setShowFundSettings] = useState(false);
  
  const [freistellungsauftrag, setFreistellungsauftrag] = useState(1000);
  const [localFreistellungsauftrag, setLocalFreistellungsauftrag] = useState(1000);
  const [annualWithdrawalAmount, setAnnualWithdrawalAmount] = useState(0);
  const [localWithdrawalAmount, setLocalWithdrawalAmount] = useState(0);
  
  const [fundReturnRate, setFundReturnRate] = useState(5);
  const [fundSalesCharge, setFundSalesCharge] = useState(5);
  const [fundAnnualManagementFee, setFundAnnualManagementFee] = useState(1.5);
  const [localFundReturn, setLocalFundReturn] = useState(5);
  const [localFundSalesCharge, setLocalFundSalesCharge] = useState(5);
  const [localFundManagementFee, setLocalFundManagementFee] = useState(1.5);

  // Calculate retirement age
  const currentYear = new Date().getFullYear();
  const birthYear = data.personal?.birthYear || 1980;
  const currentAge = currentYear - birthYear;
  const retirementAge = 67;
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

  // Calculate monthly net income
  const calculateNetIncome = (gross: number): number => {
    const taxRate = gross > 50000 ? 0.30 : gross > 30000 ? 0.25 : 0.20;
    return gross * (1 - taxRate) / 12;
  };

  // Calculate pension with half-income method from age 62
  const calculatePensionTax = (monthlyPension: number, age: number): number => {
    if (age >= 62) {
      const taxablePortion = monthlyPension * 0.5;
      const taxRate = 0.25;
      return monthlyPension - (taxablePortion * taxRate);
    } else {
      const taxRate = 0.25;
      return monthlyPension * (1 - taxRate);
    }
  };

  // Calculate fund value
  const calculateFundValue = (years: number): number => {
    const monthlyContribution = data.funds?.balance || 0; // Using balance as proxy for monthly contribution
    const monthlyRate = (localFundReturn / 100) / 12;
    const salesChargeDeduction = 1 - (localFundSalesCharge / 100);
    const effectiveMonthlyContribution = monthlyContribution * salesChargeDeduction;
    const managementFeeMonthly = localFundManagementFee / 100 / 12;
    const effectiveRate = monthlyRate - managementFeeMonthly;
    
    const months = years * 12;
    if (effectiveRate === 0) return effectiveMonthlyContribution * months;
    return effectiveMonthlyContribution * (Math.pow(1 + effectiveRate, months) - 1) / effectiveRate;
  };

  // Generate chart data
  const generateChartData = () => {
    const chartDataArray = [];
    const startAge = Math.max(currentAge, 60);
    const endAge = 90;
    const grossIncome = data.income?.grossAnnual || 0;
    const expectedStatutoryPension = data.pensions?.public67 || 0;
    const vistaPensionMonthly = data.privatePension?.contribution || 0;
    const lifeInsuranceMonthly = (data.lifeInsurance?.sum || 0) / 12; // Convert annual to monthly estimate

    for (let age = startAge; age <= endAge; age++) {
      const year = currentYear + (age - currentAge);
      const netIncome = age < retirementAge ? calculateNetIncome(grossIncome) : 0;
      const statutoryPensionNet = age >= retirementAge ? calculatePensionTax(expectedStatutoryPension, age) : 0;
      const vistaPensionNet = age >= retirementAge ? calculatePensionTax(vistaPensionMonthly, age) : 0;
      const lifeInsuranceNet = age >= retirementAge ? lifeInsuranceMonthly : 0;
      
      const yearsInvested = Math.min(yearsUntilRetirement, age - currentAge);
      const fundValue = yearsInvested > 0 ? calculateFundValue(yearsInvested) : 0;

      chartDataArray.push({
        age,
        year,
        netIncome: Math.round(netIncome),
        statutoryPension: Math.round(statutoryPensionNet),
        vistaPension: Math.round(vistaPensionNet),
        lifeInsurance: Math.round(lifeInsuranceNet),
        fundValue: Math.round(fundValue),
        total: Math.round(netIncome + statutoryPensionNet + vistaPensionNet + lifeInsuranceNet),
      });
    }

    return chartDataArray;
  };

  const chartData = useMemo(() => generateChartData(), [data, localFundReturn, localFundSalesCharge, localFundManagementFee]);

  // Calculate flexible withdrawal
  const calculateFlexibleWithdrawal = () => {
    if (!annualWithdrawalAmount) return { monthlyNet: 0, annualNet: 0, annualTax: 0 };
    
    const totalFundValue = calculateFundValue(yearsUntilRetirement);
    const fundMonthly = onboardingData.funds?.balance || 0; // Using balance as proxy
    const totalContributions = fundMonthly * yearsUntilRetirement * 12;
    const capitalGains = totalFundValue - totalContributions;
    
    const withdrawalRatio = annualWithdrawalAmount / totalFundValue;
    const gainsInWithdrawal = capitalGains * withdrawalRatio;
    const taxableGains = Math.max(0, gainsInWithdrawal - freistellungsauftrag);
    const annualTax = taxableGains * 0.25;
    const annualNet = annualWithdrawalAmount - annualTax;
    const monthlyNet = annualNet / 12;

    return { monthlyNet, annualNet, annualTax };
  };

  const withdrawalData = calculateFlexibleWithdrawal();

  // Get KPI data
  const grossIncome = data.income?.grossAnnual || 0;
  const expectedPension = data.pensions?.public67 || 0;
  const vistaPension = data.privatePension?.contribution || 0;
  const monthlyContribution = (data.riester?.amount || 0) + 
                             (data.ruerup?.amount || 0) +
                             (data.occupationalPension?.amount || 0);

  const texts = {
    de: {
      title: 'Ihre Rentenanalyse',
      subtitle: 'Umfassender Überblick über Ihre Altersvorsorge',
      kpiCurrentIncome: 'Aktuelles Bruttoeinkommen',
      kpiProjectedPension: 'Prognostizierte Rente',
      kpiMonthlyContribution: 'Monatliche Sparrate',
      kpiYearsToRetirement: 'Jahre bis zur Rente',
      quickActions: 'Schnellzugriff',
      taxSettings: 'Steuereinstellungen',
      taxSettingsDesc: `Freistellungsauftrag: ${freistellungsauftrag.toLocaleString('de-DE')} €`,
      withdrawalCalc: 'Entnahmerechner',
      withdrawalCalcDesc: 'Simulieren Sie flexible Entnahmen',
      fundSettings: 'Fondseinstellungen',
      fundSettingsDesc: `Rendite: ${fundReturnRate}% | Ausgabeaufschlag: ${fundSalesCharge}%`,
      chartTitle: 'Einkommensverlauf',
      chartToggle: 'Ansicht wechseln:',
      chartMode1: 'Basis',
      chartMode2: 'Detailliert',
      fundChartTitle: 'Fondssparplan Entwicklung',
      netIncome: 'Nettoeinkommen',
      statutoryPension: 'Gesetzliche Rente',
      vistaPension: 'Vista Rente',
      lifeInsurance: 'Lebensversicherung',
      fundValue: 'Fondsvermögen',
    },
    en: {
      title: 'Your Pension Analysis',
      subtitle: 'Comprehensive overview of your retirement planning',
      kpiCurrentIncome: 'Current Gross Income',
      kpiProjectedPension: 'Projected Pension',
      kpiMonthlyContribution: 'Monthly Savings',
      kpiYearsToRetirement: 'Years to Retirement',
      quickActions: 'Quick Actions',
      taxSettings: 'Tax Settings',
      taxSettingsDesc: `Tax-free allowance: ${freistellungsauftrag.toLocaleString('en-US')} €`,
      withdrawalCalc: 'Withdrawal Calculator',
      withdrawalCalcDesc: 'Simulate flexible withdrawals',
      fundSettings: 'Fund Settings',
      fundSettingsDesc: `Return: ${fundReturnRate}% | Sales charge: ${fundSalesCharge}%`,
      chartTitle: 'Income Projection',
      chartToggle: 'Switch view:',
      chartMode1: 'Basic',
      chartMode2: 'Detailed',
      fundChartTitle: 'Fund Savings Plan Development',
      netIncome: 'Net Income',
      statutoryPension: 'Statutory Pension',
      vistaPension: 'Vista Pension',
      lifeInsurance: 'Life Insurance',
      fundValue: 'Fund Value',
    },
  };

  const t = texts[language];

  // Note: Component now shows demo data if onboarding is not completed
  // Users can click "Zum Onboarding" button in the header to complete their profile

  // DEBUG: Test if component renders at all
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced Dashboard Test</h1>
        <p className="text-lg text-gray-700 mb-2">Component is rendering!</p>
        <p className="text-sm text-gray-600">Language: {language}</p>
        <p className="text-sm text-gray-600">Is Completed: {String(isCompleted)}</p>
        <p className="text-sm text-gray-600">Birth Year: {data.personal?.birthYear || 'N/A'}</p>
        <p className="text-sm text-gray-600">Gross Income: {data.income?.grossAnnual || 'N/A'}</p>
      </div>
    </div>
  );

  // ORIGINAL CODE BELOW - will not execute due to return above
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-medium">{t.kpiCurrentIncome}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(grossIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">{language === 'de' ? 'pro Jahr' : 'per year'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm font-medium">{t.kpiProjectedPension}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency((expectedPension + vistaPension) * 12)}</div>
              <p className="text-xs text-muted-foreground mt-1">{language === 'de' ? 'pro Jahr' : 'per year'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-sm font-medium">{t.kpiMonthlyContribution}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(monthlyContribution)}</div>
              <p className="text-xs text-muted-foreground mt-1">{language === 'de' ? 'pro Monat' : 'per month'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-sm font-medium">{t.kpiYearsToRetirement}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{yearsUntilRetirement}</div>
              <p className="text-xs text-muted-foreground mt-1">{language === 'de' ? 'Jahre' : 'years'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTaxSettings(true)}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.taxSettings}</h3>
            <p className="text-sm text-gray-600">{t.taxSettingsDesc}</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWithdrawalSimulator(true)}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.withdrawalCalc}</h3>
            <p className="text-sm text-gray-600">{t.withdrawalCalcDesc}</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFundSettings(true)}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.fundSettings}</h3>
            <p className="text-sm text-gray-600">{t.fundSettingsDesc}</p>
          </motion.button>
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t.chartTitle}</CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{t.chartToggle}</span>
                <button
                  onClick={() => setChartMode(chartMode === 1 ? 2 : 1)}
                  className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors ${
                    chartMode === 2 ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-6 h-6 transform transition-transform bg-white rounded-full shadow ${
                      chartMode === 2 ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {chartMode === 1 ? t.chartMode1 : t.chartMode2}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartMode === 1 && (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorPension" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="age" label={{ value: language === 'de' ? 'Alter' : 'Age', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: language === 'de' ? 'Monatlich (€)' : 'Monthly (€)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => value.toLocaleString(language === 'de' ? 'de-DE' : 'en-US') + ' €'}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="netIncome" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="url(#colorIncome)" 
                    name={t.netIncome}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="statutoryPension" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="url(#colorPension)" 
                    name={t.statutoryPension}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vistaPension" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="url(#colorPension)" 
                    name={t.vistaPension}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartMode === 2 && (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorStatutory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorVista" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorInsurance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="age" label={{ value: language === 'de' ? 'Alter' : 'Age', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: language === 'de' ? 'Monatlich (€)' : 'Monthly (€)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => value.toLocaleString(language === 'de' ? 'de-DE' : 'en-US') + ' €'}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="netIncome" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="url(#colorIncome2)" 
                    name={t.netIncome}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="statutoryPension" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="url(#colorStatutory)" 
                    name={t.statutoryPension}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vistaPension" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="url(#colorVista)" 
                    name={t.vistaPension}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lifeInsurance" 
                    stackId="1"
                    stroke="#f59e0b" 
                    fill="url(#colorInsurance)" 
                    name={t.lifeInsurance}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Fund Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t.fundChartTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="age" label={{ value: language === 'de' ? 'Alter' : 'Age', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: language === 'de' ? 'Fondswert (€)' : 'Fund Value (€)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => value.toLocaleString(language === 'de' ? 'de-DE' : 'en-US') + ' €'}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="fundValue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={false}
                  name={t.fundValue}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Modals */}
        <AnimatePresence>
          {showTaxSettings && (
            <TaxSettingsModal 
              language={language}
              freistellungsauftrag={localFreistellungsauftrag}
              setFreistellungsauftrag={setLocalFreistellungsauftrag}
              onSave={() => {
                setFreistellungsauftrag(localFreistellungsauftrag);
                setShowTaxSettings(false);
              }}
              onClose={() => setShowTaxSettings(false)}
            />
          )}
          
          {showWithdrawalSimulator && (
            <WithdrawalSimulatorModal
              language={language}
              withdrawalAmount={localWithdrawalAmount}
              setWithdrawalAmount={(val: number) => {
                setLocalWithdrawalAmount(val);
                setAnnualWithdrawalAmount(val);
              }}
              withdrawalData={withdrawalData}
              freistellungsauftrag={freistellungsauftrag}
              onClose={() => setShowWithdrawalSimulator(false)}
            />
          )}
          
          {showFundSettings && (
            <FundSettingsModal
              language={language}
              fundReturn={localFundReturn}
              setFundReturn={setLocalFundReturn}
              fundSalesCharge={localFundSalesCharge}
              setFundSalesCharge={setLocalFundSalesCharge}
              fundManagementFee={localFundManagementFee}
              setFundManagementFee={setLocalFundManagementFee}
              onSave={() => {
                setFundReturnRate(localFundReturn);
                setFundSalesCharge(localFundSalesCharge);
                setFundAnnualManagementFee(localFundManagementFee);
                setShowFundSettings(false);
              }}
              onClose={() => setShowFundSettings(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Modal Components
const TaxSettingsModal = ({ language, freistellungsauftrag, setFreistellungsauftrag, onSave, onClose }: any) => {
  const texts = language === 'de' ? {
    title: 'Steuereinstellungen',
    label: 'Freistellungsauftrag (€)',
    hint: 'Standardwert: 1.000 € (ledig) / 2.000 € (verheiratet)',
    infoTitle: 'Halbeinkünfteverfahren',
    infoText: 'Ab Alter 62 wird die Hälfte Ihrer Renteneinkünfte steuerfrei gestellt.',
    save: 'Speichern',
  } : {
    title: 'Tax Settings',
    label: 'Tax-free Allowance (€)',
    hint: 'Default: 1,000 € (single) / 2,000 € (married)',
    infoTitle: 'Half-Income Method',
    infoText: 'From age 62, half of your pension income is tax-free.',
    save: 'Save',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{texts.title}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.label}
            </label>
            <input
              type="number"
              value={freistellungsauftrag}
              onChange={(e) => setFreistellungsauftrag(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">{texts.hint}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{texts.infoTitle}</h4>
            <p className="text-sm text-blue-700">{texts.infoText}</p>
          </div>

          <Button onClick={onSave} className="w-full">{texts.save}</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const WithdrawalSimulatorModal = ({ language, withdrawalAmount, setWithdrawalAmount, withdrawalData, freistellungsauftrag, onClose }: any) => {
  const texts = language === 'de' ? {
    title: 'Flexibler Entnahmerechner',
    label: 'Jährliche Entnahme (€)',
    monthlyNet: 'Monatlich (netto)',
    annualNet: 'Jährlich (netto)',
    taxes: 'Steuern',
    taxTitle: 'Steuerbehandlung',
    taxRules: [
      '25% Abgeltungssteuer auf Kursgewinne',
      `Freistellungsauftrag: ${freistellungsauftrag.toLocaleString('de-DE')} €`,
      '15% Teilfreistellung bei Aktienfonds',
    ],
  } : {
    title: 'Flexible Withdrawal Calculator',
    label: 'Annual Withdrawal (€)',
    monthlyNet: 'Monthly (net)',
    annualNet: 'Annual (net)',
    taxes: 'Taxes',
    taxTitle: 'Tax Treatment',
    taxRules: [
      '25% capital gains tax on profits',
      `Tax-free allowance: ${freistellungsauftrag.toLocaleString('en-US')} €`,
      '15% partial exemption for equity funds',
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{texts.title}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.label}
            </label>
            <input
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">{texts.monthlyNet}</p>
              <p className="text-2xl font-bold text-blue-600">
                {withdrawalData.monthlyNet.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 0 })} €
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">{texts.annualNet}</p>
              <p className="text-2xl font-bold text-green-600">
                {withdrawalData.annualNet.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 0 })} €
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">{texts.taxes}</p>
              <p className="text-2xl font-bold text-red-600">
                {withdrawalData.annualTax.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 0 })} €
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">{texts.taxTitle}</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {texts.taxRules.map((rule, idx) => <li key={idx}>• {rule}</li>)}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FundSettingsModal = ({ language, fundReturn, setFundReturn, fundSalesCharge, setFundSalesCharge, fundManagementFee, setFundManagementFee, onSave, onClose }: any) => {
  const texts = language === 'de' ? {
    title: 'Fondseinstellungen',
    returnLabel: 'Erwartete Rendite (% p.a.)',
    salesChargeLabel: 'Ausgabeaufschlag (%)',
    managementFeeLabel: 'Jährliche Verwaltungsgebühr (%)',
    save: 'Speichern',
  } : {
    title: 'Fund Settings',
    returnLabel: 'Expected Return (% p.a.)',
    salesChargeLabel: 'Sales Charge (%)',
    managementFeeLabel: 'Annual Management Fee (%)',
    save: 'Save',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{texts.title}</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.returnLabel}
            </label>
            <input
              type="number"
              value={fundReturn}
              onChange={(e) => setFundReturn(parseFloat(e.target.value) || 0)}
              step="0.1"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.salesChargeLabel}
            </label>
            <input
              type="number"
              value={fundSalesCharge}
              onChange={(e) => setFundSalesCharge(parseFloat(e.target.value) || 0)}
              step="0.1"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.managementFeeLabel}
            </label>
            <input
              type="number"
              value={fundManagementFee}
              onChange={(e) => setFundManagementFee(parseFloat(e.target.value) || 0)}
              step="0.1"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <Button onClick={onSave} className="w-full">{texts.save}</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedDashboard;
