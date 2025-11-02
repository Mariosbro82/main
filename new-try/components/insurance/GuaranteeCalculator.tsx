import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Zap,
  DollarSign,
  Info,
  Heart,
  Calculator,
  AlertCircle
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import { InsuranceProduct } from '../../types/insurance';
import {
  calculateGuaranteeScenarios,
  generateYearlyProjections
} from '../../utils/guaranteeCalculator';

interface GuaranteeCalculatorProps {
  product: InsuranceProduct;
  isDarkMode?: boolean;
}

export default function GuaranteeCalculator({ product, isDarkMode = false }: GuaranteeCalculatorProps) {
  const [monthlyContribution, setMonthlyContribution] = useState<number>(300);
  const [contributionPeriod, setContributionPeriod] = useState<number>(30);

  // Theme colors
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-50';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  // Calculate scenarios
  const calculation = useMemo(() => {
    return calculateGuaranteeScenarios({
      monthlyContribution,
      contributionPeriod,
      product,
    });
  }, [monthlyContribution, contributionPeriod, product]);

  // Generate chart data
  const chartData = useMemo(() => {
    return generateYearlyProjections(calculation);
  }, [calculation]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${textColor}`}>
            Garantie-Rechner
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            Berechne deine Rentenversicherung in 3 Szenarien
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Contribution */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Monatlicher Beitrag
            </label>
            <div className="relative">
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min={product.minContribution}
                max={product.maxContribution}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <span className={`absolute right-4 top-3 ${textSecondary}`}>€</span>
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>
              Min: {formatCurrency(product.minContribution)} • Max: {formatCurrency(product.maxContribution)}
            </p>
          </div>

          {/* Contribution Period */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Laufzeit
            </label>
            <div className="relative">
              <input
                type="number"
                value={contributionPeriod}
                onChange={(e) => setContributionPeriod(Number(e.target.value))}
                min={product.minContractDuration}
                max={50}
                className={`w-full px-4 py-3 ${inputBg} border ${borderColor} rounded-lg ${textColor} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <span className={`absolute right-4 top-3 ${textSecondary}`}>Jahre</span>
            </div>
            <p className={`text-xs ${textSecondary} mt-1`}>
              Mindestlaufzeit: {product.minContractDuration} Jahre
            </p>
          </div>
        </div>

        {/* Quick Summary */}
        <div className={`mt-6 pt-6 border-t ${borderColor} grid grid-cols-3 gap-4`}>
          <div>
            <p className={`text-sm ${textSecondary}`}>Gesamtbeiträge</p>
            <p className={`text-lg font-bold ${textColor}`}>
              {formatCurrency(calculation.totalContributions)}
            </p>
          </div>
          <div>
            <p className={`text-sm ${textSecondary}`}>Garantierte Auszahlung</p>
            <p className={`text-lg font-bold text-green-600 dark:text-green-400`}>
              {formatCurrency(calculation.guaranteed.amount)}
            </p>
          </div>
          <div>
            <p className={`text-sm ${textSecondary}`}>Erwartete Auszahlung</p>
            <p className={`text-lg font-bold text-blue-600 dark:text-blue-400`}>
              {formatCurrency(calculation.expected.amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guaranteed Scenario */}
        <ScenarioCard
          title="Garantiert"
          subtitle={`${product.guaranteeLevel}% Garantie`}
          icon={Shield}
          iconColor="text-green-500"
          iconBg="bg-green-100 dark:bg-green-900/30"
          amount={calculation.guaranteed.amount}
          returnPercent={calculation.guaranteed.returnPercent}
          assumptions="Garantierte Mindestleistung"
          isDarkMode={isDarkMode}
          highlight="guarantee"
        />

        {/* Expected Scenario */}
        <ScenarioCard
          title="Erwartet"
          subtitle="Realistisch"
          icon={TrendingUp}
          iconColor="text-blue-500"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          amount={calculation.expected.amount}
          returnPercent={calculation.expected.returnPercent}
          assumptions={calculation.expected.assumptions}
          isDarkMode={isDarkMode}
          highlight="expected"
        />

        {/* Optimistic Scenario */}
        <ScenarioCard
          title="Optimistisch"
          subtitle="Beste Entwicklung"
          icon={Zap}
          iconColor="text-purple-500"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          amount={calculation.optimistic.amount}
          returnPercent={calculation.optimistic.returnPercent}
          assumptions={calculation.optimistic.assumptions}
          isDarkMode={isDarkMode}
          highlight="optimistic"
        />
      </div>

      {/* Chart */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          Entwicklung über {contributionPeriod} Jahre
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="guaranteedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis
              dataKey="year"
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              label={{ value: 'Jahre', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Wert (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                color: isDarkMode ? '#f3f4f6' : '#111827',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="contributions"
              stroke="#6b7280"
              fill="transparent"
              strokeDasharray="5 5"
              name="Eingezahlte Beiträge"
            />
            <Area
              type="monotone"
              dataKey="guaranteed"
              stroke="#10b981"
              fill="url(#guaranteedGradient)"
              strokeWidth={2}
              name="Garantiert"
            />
            <Area
              type="monotone"
              dataKey="expected"
              stroke="#3b82f6"
              fill="url(#expectedGradient)"
              strokeWidth={2}
              name="Erwartet"
            />
            <Area
              type="monotone"
              dataKey="optimistic"
              stroke="#8b5cf6"
              fill="url(#optimisticGradient)"
              strokeWidth={2}
              name="Optimistisch"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Costs Breakdown */}
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className={`w-5 h-5 ${textColor}`} />
            <h3 className={`text-lg font-semibold ${textColor}`}>
              Kostenübersicht
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${textSecondary}`}>Abschlusskosten</span>
              <span className={`font-medium ${textColor}`}>
                {product.costs.abschlusskosten.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${textSecondary}`}>Verwaltung (jährlich)</span>
              <span className={`font-medium ${textColor}`}>
                {product.costs.verwaltungskosten.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${textSecondary}`}>Fondskosten (TER)</span>
              <span className={`font-medium ${textColor}`}>
                {product.costs.fondskosten.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${textSecondary}`}>Garantiekosten</span>
              <span className={`font-medium ${textColor}`}>
                {product.costs.garantiekosten.toFixed(2)}%
              </span>
            </div>
            <div className={`pt-3 border-t ${borderColor} flex justify-between items-center`}>
              <span className={`font-semibold ${textColor}`}>Gesamtkostenquote</span>
              <span className={`font-bold text-lg ${textColor}`}>
                {product.costs.effectiveCostRatio?.toFixed(2)}% p.a.
              </span>
            </div>
          </div>
        </div>

        {/* Death Benefit */}
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className={`w-5 h-5 ${textColor}`} />
            <h3 className={`text-lg font-semibold ${textColor}`}>
              Todesfallschutz
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className={`text-sm ${textSecondary} mb-1`}>
                Nach {(contributionPeriod / 2).toFixed(0)} Jahren
              </p>
              <p className={`text-2xl font-bold ${textColor}`}>
                {formatCurrency(calculation.deathBenefit.atHalfway)}
              </p>
            </div>
            <div>
              <p className={`text-sm ${textSecondary} mb-1`}>
                Nach {contributionPeriod} Jahren
              </p>
              <p className={`text-2xl font-bold ${textColor}`}>
                {formatCurrency(calculation.deathBenefit.atEnd)}
              </p>
            </div>
            <div className={`mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg`}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className={`text-xs ${textSecondary}`}>
                  Im Todesfall erhalten Ihre Hinterbliebenen mindestens{' '}
                  {(product.deathBenefit.duringAccumulation * 100).toFixed(0)}% des
                  Vertragsguthabens
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Advantage Info */}
      {contributionPeriod >= 12 && (
        <div className={`${cardBg} rounded-lg border-2 border-green-500/30 p-6`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className={`font-semibold ${textColor} mb-1`}>
                Steuerlicher Vorteil durch 12-Jahres-Regel
              </h4>
              <p className={`text-sm ${textSecondary}`}>
                Bei einer Laufzeit von {contributionPeriod} Jahren profitierst du von der
                12-Jahres-Regel. Nur 50% der Erträge werden mit deinem persönlichen Steuersatz
                versteuert - das kann zu erheblichen Steuervorteilen führen!
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs ${textSecondary}`}>Nach Steuern (erwartet)</p>
                  <p className={`text-lg font-bold text-green-600 dark:text-green-400`}>
                    {formatCurrency(calculation.expected.afterTax)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${textSecondary}`}>Nach Steuern (optimistisch)</p>
                  <p className={`text-lg font-bold text-green-600 dark:text-green-400`}>
                    {formatCurrency(calculation.optimistic.afterTax)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Scenario Card Component
interface ScenarioCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  amount: number;
  returnPercent: number;
  assumptions: string;
  isDarkMode: boolean;
  highlight: 'guarantee' | 'expected' | 'optimistic';
}

function ScenarioCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  amount,
  returnPercent,
  assumptions,
  isDarkMode,
  highlight,
}: ScenarioCardProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const borderHighlight =
    highlight === 'guarantee' ? 'border-green-500' :
    highlight === 'expected' ? 'border-blue-500' : 'border-purple-500';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`${cardBg} rounded-lg border-2 ${borderHighlight} p-6 shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
          <p className={`text-sm ${textSecondary}`}>{subtitle}</p>
        </div>
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mb-4">
        <p className={`text-3xl font-bold ${textColor}`}>
          {formatCurrency(amount)}
        </p>
        <p className={`text-sm ${returnPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium mt-1`}>
          {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}% Rendite
        </p>
      </div>

      <p className={`text-xs ${textSecondary}`}>{assumptions}</p>
    </motion.div>
  );
}
