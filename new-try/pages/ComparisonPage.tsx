import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calculator, Settings, X } from 'lucide-react';
import { usePensionStore } from '../stores/pensionStore';

export default function ComparisonPage() {
  const {
    birthYear,
    grossIncome,
    expectedStatutoryPension,
    vistaPensionMonthly,
    lifeInsuranceMonthly,
    fundSavingsPlanMonthly,
    freistellungsauftrag,
    updateTaxSettings,
    updateWithdrawalSettings,
    annualWithdrawalAmount,
    fundReturnRate,
    fundSalesCharge,
    fundAnnualManagementFee,
    updateFundSettings,
  } = usePensionStore();

  const [chartMode, setChartMode] = useState<1 | 2>(1);
  const [showWithdrawalSimulator, setShowWithdrawalSimulator] = useState(false);
  const [showTaxSettings, setShowTaxSettings] = useState(false);
  const [showFundSettings, setShowFundSettings] = useState(false);
  const [localFreistellungsauftrag, setLocalFreistellungsauftrag] = useState(freistellungsauftrag);
  const [localWithdrawalAmount, setLocalWithdrawalAmount] = useState(annualWithdrawalAmount);
  const [localFundReturn, setLocalFundReturn] = useState(fundReturnRate);
  const [localFundSalesCharge, setLocalFundSalesCharge] = useState(fundSalesCharge);
  const [localFundManagementFee, setLocalFundManagementFee] = useState(fundAnnualManagementFee);

  // Calculate retirement age (use 67 as standard)
  const retirementAge = 67;
  const currentYear = new Date().getFullYear();
  const currentAge = birthYear ? currentYear - birthYear : 30;
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

  // Calculate monthly net income (simplified tax calculation)
  const calculateNetIncome = (gross: number): number => {
    const taxRate = gross > 50000 ? 0.30 : gross > 30000 ? 0.25 : 0.20;
    return gross * (1 - taxRate) / 12;
  };

  // Calculate pension with half-income method (Halbeinkünfteverfahren) from age 62
  const calculatePensionTax = (monthlyPension: number, age: number): number => {
    if (age >= 62) {
      // Half-income method: 50% of pension is taxable
      const taxablePortion = monthlyPension * 0.5;
      const taxRate = 0.25; // Simplified
      return monthlyPension - (taxablePortion * taxRate);
    } else {
      // Full taxation before 62
      const taxRate = 0.25;
      return monthlyPension * (1 - taxRate);
    }
  };

  // Calculate fund savings with tax treatment
  const calculateFundValue = (years: number): number => {
    const monthlyContribution = fundSavingsPlanMonthly;
    const monthlyRate = (localFundReturn / 100) / 12;
    const salesChargeDeduction = 1 - (localFundSalesCharge / 100);
    const effectiveMonthlyContribution = monthlyContribution * salesChargeDeduction;
    const managementFeeMonthly = localFundManagementFee / 100 / 12;
    const effectiveRate = monthlyRate - managementFeeMonthly;
    
    // Future value of annuity
    const months = years * 12;
    if (effectiveRate === 0) return effectiveMonthlyContribution * months;
    return effectiveMonthlyContribution * (Math.pow(1 + effectiveRate, months) - 1) / effectiveRate;
  };

  // Calculate capital gains tax on fund withdrawals
  const calculateFundWithdrawalAfterTax = (totalValue: number, contributions: number): number => {
    const capitalGains = totalValue - contributions;
    const taxableGains = Math.max(0, capitalGains - freistellungsauftrag);
    const capitalGainsTax = taxableGains * 0.25; // 25% Abgeltungssteuer
    return totalValue - capitalGainsTax;
  };

  // Generate chart data for retirement projection
  const generateChartData = () => {
    const data = [];
    const startAge = Math.max(currentAge, 60);
    const endAge = 90;

    for (let age = startAge; age <= endAge; age++) {
      const year = currentYear + (age - currentAge);
      const netIncome = age < retirementAge ? calculateNetIncome(grossIncome) : 0;
      const statutoryPensionNet = age >= retirementAge ? calculatePensionTax(expectedStatutoryPension, age) : 0;
      const vistaPensionNet = age >= retirementAge ? calculatePensionTax(vistaPensionMonthly, age) : 0;
      const lifeInsuranceNet = age >= retirementAge ? lifeInsuranceMonthly : 0;
      
      // Fund value accumulation until retirement, then withdrawals
      const yearsInvested = Math.min(yearsUntilRetirement, age - currentAge);
      const fundValue = yearsInvested > 0 ? calculateFundValue(yearsInvested) : 0;

      data.push({
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

    return data;
  };

  const chartData = generateChartData();

  // Calculate flexible withdrawal simulation
  const calculateFlexibleWithdrawal = () => {
    if (!annualWithdrawalAmount) return { monthlyNet: 0, annualNet: 0, annualTax: 0 };
    
    const totalFundValue = calculateFundValue(yearsUntilRetirement);
    const totalContributions = fundSavingsPlanMonthly * yearsUntilRetirement * 12;
    const capitalGains = totalFundValue - totalContributions;
    
    // Pro-rata capital gains on withdrawal
    const withdrawalRatio = annualWithdrawalAmount / totalFundValue;
    const gainsInWithdrawal = capitalGains * withdrawalRatio;
    const taxableGains = Math.max(0, gainsInWithdrawal - freistellungsauftrag);
    const annualTax = taxableGains * 0.25;
    const annualNet = annualWithdrawalAmount - annualTax;
    const monthlyNet = annualNet / 12;

    return { monthlyNet, annualNet, annualTax };
  };

  const withdrawalData = calculateFlexibleWithdrawal();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Ihre Rentenanalyse
          </h1>
          <p className="text-gray-600">
            Vergleichen Sie verschiedene Szenarien und optimieren Sie Ihre Altersvorsorge
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTaxSettings(true)}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Steuereinstellungen</h3>
            <p className="text-sm text-gray-600">
              Freistellungsauftrag: {freistellungsauftrag.toLocaleString('de-DE')} €
            </p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Entnahmerechner</h3>
            <p className="text-sm text-gray-600">
              Simulieren Sie flexible Entnahmen aus Ihren Fonds
            </p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fondseinstellungen</h3>
            <p className="text-sm text-gray-600">
              Rendite: {fundReturnRate}% | Ausgabeaufschlag: {fundSalesCharge}%
            </p>
          </motion.button>
        </div>

        {/* Chart Mode Toggle - Apple Style */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Einkommensverlauf</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Ansicht wechseln:</span>
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
                {chartMode === 1 ? 'Basis' : 'Detailliert'}
              </span>
            </div>
          </div>

          {/* Chart 1: Basic View - Net Income + Vista + Statutory Pension */}
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
                <XAxis dataKey="age" label={{ value: 'Alter', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Monatlich (€)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => value.toLocaleString('de-DE') + ' €'}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="netIncome" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="url(#colorIncome)" 
                  name="Nettoeinkommen"
                />
                <Area 
                  type="monotone" 
                  dataKey="statutoryPension" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="url(#colorPension)" 
                  name="Gesetzliche Rente"
                />
                <Area 
                  type="monotone" 
                  dataKey="vistaPension" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="url(#colorPension)" 
                  name="Vista Rente"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Chart 2: Detailed View - All Income Streams */}
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
                <XAxis dataKey="age" label={{ value: 'Alter', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Monatlich (€)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => value.toLocaleString('de-DE') + ' €'}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="netIncome" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="url(#colorIncome2)" 
                  name="Nettoeinkommen"
                />
                <Area 
                  type="monotone" 
                  dataKey="statutoryPension" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="url(#colorStatutory)" 
                  name="Gesetzliche Rente"
                />
                <Area 
                  type="monotone" 
                  dataKey="vistaPension" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="url(#colorVista)" 
                  name="Vista Rente"
                />
                <Area 
                  type="monotone" 
                  dataKey="lifeInsurance" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="url(#colorInsurance)" 
                  name="Lebensversicherung"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Fund Savings Plan Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fondssparplan Entwicklung</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" label={{ value: 'Alter', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Fondswert (€)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => value.toLocaleString('de-DE') + ' €'}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="fundValue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={false}
                name="Fondsvermögen"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tax Settings Modal */}
        <AnimatePresence>
          {showTaxSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowTaxSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Steuereinstellungen</h3>
                  <button
                    onClick={() => setShowTaxSettings(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Freistellungsauftrag (€)
                    </label>
                    <input
                      type="number"
                      value={localFreistellungsauftrag}
                      onChange={(e) => setLocalFreistellungsauftrag(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Standardwert: 1.000 € (ledig) / 2.000 € (verheiratet)
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Halbeinkünfteverfahren</h4>
                    <p className="text-sm text-blue-700">
                      Ab Alter 62 wird die Hälfte Ihrer Renteneinkünfte steuerfrei gestellt.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      updateTaxSettings(localFreistellungsauftrag);
                      setShowTaxSettings(false);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Speichern
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Withdrawal Simulator Modal */}
        <AnimatePresence>
          {showWithdrawalSimulator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowWithdrawalSimulator(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Flexibler Entnahmerechner</h3>
                  <button
                    onClick={() => setShowWithdrawalSimulator(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jährliche Entnahme (€)
                    </label>
                    <input
                      type="number"
                      value={localWithdrawalAmount}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setLocalWithdrawalAmount(val);
                        updateWithdrawalSettings(val);
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Monatlich (netto)</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {withdrawalData.monthlyNet.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Jährlich (netto)</p>
                      <p className="text-2xl font-bold text-green-600">
                        {withdrawalData.annualNet.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Steuern</p>
                      <p className="text-2xl font-bold text-red-600">
                        {withdrawalData.annualTax.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">Steuerbehandlung</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 25% Abgeltungssteuer auf Kursgewinne</li>
                      <li>• Freistellungsauftrag: {freistellungsauftrag.toLocaleString('de-DE')} €</li>
                      <li>• 15% Teilfreistellung bei Aktienfonds</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fund Settings Modal */}
        <AnimatePresence>
          {showFundSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowFundSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Fondseinstellungen</h3>
                  <button
                    onClick={() => setShowFundSettings(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Erwartete Rendite (% p.a.)
                    </label>
                    <input
                      type="number"
                      value={localFundReturn}
                      onChange={(e) => setLocalFundReturn(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ausgabeaufschlag (%)
                    </label>
                    <input
                      type="number"
                      value={localFundSalesCharge}
                      onChange={(e) => setLocalFundSalesCharge(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jährliche Verwaltungsgebühr (%)
                    </label>
                    <input
                      type="number"
                      value={localFundManagementFee}
                      onChange={(e) => setLocalFundManagementFee(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    onClick={() => {
                      updateFundSettings({
                        fundReturnRate: localFundReturn,
                        fundSalesCharge: localFundSalesCharge,
                        fundAnnualManagementFee: localFundManagementFee,
                      });
                      setShowFundSettings(false);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Speichern
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
