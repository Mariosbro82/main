import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Euro, TrendingUp, PiggyBank, Calendar, Download, FileText } from 'lucide-react';
import { usePensionStore } from '../stores/pensionStore';
import { useTheme } from '../contexts/ThemeContext';
import KPICard from '../components/dashboard/KPICard';
import FinancialChartWithTimePeriods, { DataPoint } from '../components/charts/FinancialChartWithTimePeriods';
import HistoricalPerformanceTable, { PerformanceData } from '../components/charts/HistoricalPerformanceTable';
import ThemeToggle from '../components/dashboard/ThemeToggle';

export default function DashboardPage() {
  const { isDarkMode } = useTheme();
  const {
    birthYear,
    grossIncome,
    expectedStatutoryPension,
    vistaPensionMonthly,
    fundSavingsPlanMonthly,
    fundReturnRate,
  } = usePensionStore();

  // Calculate current age and years to retirement
  const currentYear = new Date().getFullYear();
  const currentAge = birthYear ? currentYear - birthYear : 30;
  const retirementAge = 67;
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

  // Generate sample fund performance data for the chart
  const fundPerformanceData: DataPoint[] = useMemo(() => {
    const data: DataPoint[] = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10);

    let currentValue = 100; // Start at 100€
    const monthlyReturn = fundReturnRate / 12 / 100;
    const volatility = 0.15; // 15% volatility

    for (let i = 0; i < 120; i++) { // 10 years of monthly data
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);

      // Simulate realistic market movements with trend and volatility
      const randomFactor = (Math.random() - 0.5) * volatility;
      currentValue = currentValue * (1 + monthlyReturn + randomFactor);

      // Add monthly contributions
      currentValue += fundSavingsPlanMonthly;

      data.push({
        date: date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' }),
        value: currentValue,
        timestamp: date.getTime(),
      });
    }

    return data;
  }, [fundReturnRate, fundSavingsPlanMonthly]);

  // Historical performance data for table
  const performanceTableData: PerformanceData[] = [
    { period: '1 Jahr', value: 84.30 },
    { period: '3 Jahre', value: 49.14 },
    { period: '5 Jahre', value: 13.07 },
    { period: 'Seit Jahresbeginn', value: 9.93 },
    { period: 'Laufzeit', value: 3.87 },
    { period: 'Auflegung (22.04.2016)', value: 133.38 },
    { period: 'p.a. seit Auflegung', value: 9.30 },
  ];

  // Calculate total monthly pension
  const totalMonthlyPension = expectedStatutoryPension + vistaPensionMonthly;

  // Calculate projected fund value at retirement
  const projectedFundValue = useMemo(() => {
    if (yearsUntilRetirement === 0) return fundSavingsPlanMonthly;
    const monthlyRate = fundReturnRate / 100 / 12;
    const months = yearsUntilRetirement * 12;
    return fundSavingsPlanMonthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }, [fundSavingsPlanMonthly, fundReturnRate, yearsUntilRetirement]);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  // Export functions
  const exportToPDF = async () => {
    const { generateSimplePDFReport } = await import('../utils/pdfExport');
    generateSimplePDFReport({
      grossIncome,
      expectedStatutoryPension,
      vistaPensionMonthly,
      fundSavingsPlanMonthly,
      yearsUntilRetirement,
      currentAge,
      projectedFundValue,
      freistellungsauftrag,
      fundReturnRate,
    });
  };

  const exportToCSV = () => {
    // Create CSV data
    const csvData = [
      ['Metrik', 'Wert'],
      ['Bruttoeinkommen (jährlich)', `${grossIncome.toLocaleString('de-DE')} €`],
      ['Gesetzliche Rente (monatlich)', `${expectedStatutoryPension.toLocaleString('de-DE')} €`],
      ['Vista Rente (monatlich)', `${vistaPensionMonthly.toLocaleString('de-DE')} €`],
      ['Fondssparplan (monatlich)', `${fundSavingsPlanMonthly.toLocaleString('de-DE')} €`],
      ['Jahre bis zur Rente', yearsUntilRetirement.toString()],
      ['Projektiertes Fondsvermögen', `${projectedFundValue.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €`],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rentenanalyse_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className={`min-h-screen ${bgColor} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className={`text-4xl font-bold ${textColor} mb-2`}>
              Premium Dashboard
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Umfassende Übersicht Ihrer Altersvorsorge
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Export Buttons */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-lg transition-colors`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">CSV</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-lg transition-colors`}
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">PDF</span>
            </motion.button>

            <ThemeToggle />
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <KPICard
            title="Aktuelles Bruttoeinkommen"
            value={`${grossIncome.toLocaleString('de-DE')} €`}
            subtitle="pro Jahr"
            icon={Euro}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            darkMode={isDarkMode}
            trend={{ value: 5.2, isPositive: true }}
          />

          <KPICard
            title="Prognostizierte Gesamtrente"
            value={`${totalMonthlyPension.toLocaleString('de-DE')} €`}
            subtitle="pro Monat ab 67"
            icon={TrendingUp}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            darkMode={isDarkMode}
          />

          <KPICard
            title="Monatliche Sparrate"
            value={`${fundSavingsPlanMonthly.toLocaleString('de-DE')} €`}
            subtitle="in Fonds"
            icon={PiggyBank}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-100"
            darkMode={isDarkMode}
          />

          <KPICard
            title="Jahre bis zur Rente"
            value={yearsUntilRetirement}
            subtitle={`Mit ${currentAge} Jahren`}
            icon={Calendar}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
            darkMode={isDarkMode}
          />
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Chart - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <FinancialChartWithTimePeriods
              title="Fondssparplan Entwicklung"
              data={fundPerformanceData}
              color={isDarkMode ? '#10b981' : '#10b981'}
              darkMode={isDarkMode}
              formatValue={(value) => `${value.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €`}
            />
          </motion.div>

          {/* Performance Table - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HistoricalPerformanceTable
              title="Historische Performance"
              subtitle="Basierend auf Backtesting"
              data={performanceTableData}
              darkMode={isDarkMode}
            />
          </motion.div>
        </div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Projected Fund Value Card */}
          <div className={`${cardBg} rounded-2xl shadow-lg p-6 border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
              Projektiertes Fondsvermögen bei Renteneintritt
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-green-600">
                {projectedFundValue.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Bei einer Rendite von {fundReturnRate}% p.a. und monatlicher Sparrate von {fundSavingsPlanMonthly.toLocaleString('de-DE')} €
            </p>
          </div>

          {/* Pension Income Card */}
          <div className={`${cardBg} rounded-2xl shadow-lg p-6 border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
              Monatliche Renteneinkünfte
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Gesetzliche Rente
                </span>
                <span className={`text-lg font-semibold ${textColor}`}>
                  {expectedStatutoryPension.toLocaleString('de-DE')} €
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Vista Rente
                </span>
                <span className={`text-lg font-semibold ${textColor}`}>
                  {vistaPensionMonthly.toLocaleString('de-DE')} €
                </span>
              </div>
              <div className={`pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${textColor}`}>
                    Gesamt
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalMonthlyPension.toLocaleString('de-DE')} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
