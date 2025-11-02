import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingDown,
  AlertTriangle,
  Info,
  PieChart as PieChartIcon,
  Calculator
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { InsuranceProduct, InsuranceCostBreakdown, CostItem } from '../../types/insurance';

interface CostTransparencyProps {
  product: InsuranceProduct;
  monthlyContribution: number;
  years: number;
  isDarkMode?: boolean;
}

export default function CostTransparency({
  product,
  monthlyContribution,
  years,
  isDarkMode = false
}: CostTransparencyProps) {
  // Theme colors
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  // Calculate cost breakdown
  const costBreakdown = calculateCostBreakdown(product, monthlyContribution, years);

  // Prepare pie chart data
  const pieData = [
    {
      name: 'Abschlusskosten',
      value: costBreakdown.oneTimeCosts.abschlusskosten.amount,
      color: '#ef4444',
    },
    {
      name: 'Verwaltung',
      value: costBreakdown.recurringCosts.verwaltungskosten.amount,
      color: '#f59e0b',
    },
    {
      name: 'Fonds (TER)',
      value: costBreakdown.recurringCosts.fondskosten.amount,
      color: '#eab308',
    },
    {
      name: 'Garantie',
      value: costBreakdown.recurringCosts.garantiekosten.amount,
      color: '#3b82f6',
    },
    {
      name: 'Risiko',
      value: costBreakdown.recurringCosts.risikokosten.amount,
      color: '#8b5cf6',
    },
  ];

  // Year-by-year cost accumulation
  const yearlyData = Array.from({ length: Math.min(years, 30) }, (_, i) => {
    const year = i + 1;
    const contributions = monthlyContribution * 12 * year;
    const acquisitionCost = contributions * (product.costs.abschlusskosten / 100);
    const annualRecurringCostRate =
      product.costs.verwaltungskosten +
      product.costs.fondskosten +
      product.costs.garantiekosten +
      product.costs.risikokosten;
    const avgPortfolio = contributions * 0.6;
    const recurringCosts = avgPortfolio * (annualRecurringCostRate / 100) * year;

    return {
      year,
      totalCosts: acquisitionCost + recurringCosts,
      percentage: ((acquisitionCost + recurringCosts) / contributions) * 100,
    };
  });

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
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${textColor}`}>
            Kostenanalyse
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            Vollständige Transparenz über alle Kosten und Gebühren
          </p>
        </div>
      </div>

      {/* Warning if costs are high */}
      {costBreakdown.effectiveCostRatio > 2.0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBg} border-2 border-orange-500/50 rounded-lg p-4`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className={`font-semibold ${textColor}`}>
                Hohe Kostenquote
              </h4>
              <p className={`text-sm ${textSecondary} mt-1`}>
                Mit {costBreakdown.effectiveCostRatio.toFixed(2)}% p.a. liegt die Kostenquote über
                dem Durchschnitt. Dies kann deine Rendite erheblich reduzieren.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CostSummaryCard
          title="Gesamtkosten"
          value={costBreakdown.totalCosts.overEntirePeriod}
          subtitle={`über ${years} Jahre`}
          icon={Calculator}
          iconColor="text-red-500"
          iconBg="bg-red-100 dark:bg-red-900/30"
          isDarkMode={isDarkMode}
        />
        <CostSummaryCard
          title="Kostenanteil"
          value={costBreakdown.totalCosts.asPercentageOfContributions}
          subtitle="der Beiträge"
          icon={TrendingDown}
          iconColor="text-orange-500"
          iconBg="bg-orange-100 dark:bg-orange-900/30"
          isDarkMode={isDarkMode}
          isPercentage
        />
        <CostSummaryCard
          title="Renditeeinbuße"
          value={costBreakdown.totalCosts.reductionInReturnPerYear}
          subtitle="pro Jahr"
          icon={TrendingDown}
          iconColor="text-yellow-500"
          iconBg="bg-yellow-100 dark:bg-yellow-900/30"
          isDarkMode={isDarkMode}
          isPercentage
        />
      </div>

      {/* Detailed Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* One-Time Costs */}
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            Einmalige Kosten
          </h3>
          <div className="space-y-3">
            <CostRow
              item={costBreakdown.oneTimeCosts.abschlusskosten}
              isDarkMode={isDarkMode}
            />
            {costBreakdown.oneTimeCosts.ausgabeaufschlag && (
              <CostRow
                item={costBreakdown.oneTimeCosts.ausgabeaufschlag}
                isDarkMode={isDarkMode}
              />
            )}
            <div className={`pt-3 border-t ${borderColor}`}>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${textColor}`}>Gesamt einmalig</span>
                <span className={`font-bold text-lg ${textColor}`}>
                  {formatCurrency(costBreakdown.oneTimeCosts.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Costs */}
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            Laufende Kosten (jährlich)
          </h3>
          <div className="space-y-3">
            <CostRow
              item={costBreakdown.recurringCosts.verwaltungskosten}
              isDarkMode={isDarkMode}
            />
            <CostRow
              item={costBreakdown.recurringCosts.fondskosten}
              isDarkMode={isDarkMode}
            />
            <CostRow
              item={costBreakdown.recurringCosts.garantiekosten}
              isDarkMode={isDarkMode}
            />
            <CostRow
              item={costBreakdown.recurringCosts.risikokosten}
              isDarkMode={isDarkMode}
            />
            <div className={`pt-3 border-t ${borderColor}`}>
              <div className="flex justify-between items-center">
                <span className={`font-semibold ${textColor}`}>
                  Gesamt pro Jahr (Ø)
                </span>
                <span className={`font-bold text-lg ${textColor}`}>
                  {formatCurrency(costBreakdown.recurringCosts.totalPerYear)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Distribution Pie Chart */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          Kostenverteilung
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Accumulation Over Time */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          Kostenentwicklung über die Zeit
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData}>
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
              label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="totalCosts" fill="#f59e0b" name="Kumulierte Kosten" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Transparency Info */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <div className="flex items-start gap-3">
          <Info className={`w-5 h-5 ${textColor} mt-0.5`} />
          <div className="flex-1">
            <h4 className={`font-semibold ${textColor} mb-2`}>
              Wichtige Hinweise zur Kostenberechnung
            </h4>
            <ul className={`text-sm ${textSecondary} space-y-2`}>
              <li>
                • Abschlusskosten werden i.d.R. in den ersten 5 Jahren verrechnet (Zillmerung)
              </li>
              <li>
                • Fondskosten (TER) werden täglich vom Fondsvermögen abgezogen
              </li>
              <li>
                • Garantiekosten fallen nur bei Produkten mit Garantie an
              </li>
              <li>
                • Die Gesamtkostenquote (ECR) gibt die durchschnittliche Belastung pro Jahr an
              </li>
              <li>
                • Höhere Kosten reduzieren die Rendite und damit das Endkapital erheblich
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cost Comparison Table */}
      <div className={`${cardBg} rounded-lg border ${borderColor} overflow-hidden`}>
        <div className="p-6">
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            Auswirkung der Kosten auf das Endkapital
          </h3>
        </div>
        <table className="w-full">
          <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase`}>
                Szenario
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${textSecondary} uppercase`}>
                Ohne Kosten
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${textSecondary} uppercase`}>
                Mit Kosten
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${textSecondary} uppercase`}>
                Differenz
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {calculateCostImpact(monthlyContribution, years, product).map((row, i) => (
              <tr key={i}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${textColor}`}>
                  {row.scenario}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${textColor}`}>
                  {formatCurrency(row.withoutCosts)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${textColor}`}>
                  {formatCurrency(row.withCosts)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400 font-semibold`}>
                  -{formatCurrency(row.difference)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper Components

interface CostSummaryCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  isDarkMode: boolean;
  isPercentage?: boolean;
}

function CostSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBg,
  isDarkMode,
  isPercentage = false
}: CostSummaryCardProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-sm font-medium ${textSecondary}`}>{title}</p>
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>
        {isPercentage ? `${value.toFixed(2)}%` : formatCurrency(value)}
      </p>
      <p className={`text-xs ${textSecondary} mt-1`}>{subtitle}</p>
    </div>
  );
}

interface CostRowProps {
  item: CostItem;
  isDarkMode: boolean;
}

function CostRow({ item, isDarkMode }: CostRowProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm ${textColor}`}>{item.description}</span>
        <span className={`text-sm font-semibold ${textColor}`}>
          {formatCurrency(item.amount)}
        </span>
      </div>
      <p className={`text-xs ${textSecondary}`}>{item.percentage.toFixed(2)}%</p>
    </div>
  );
}

// Utility Functions

function calculateCostBreakdown(
  product: InsuranceProduct,
  monthlyContribution: number,
  years: number
): InsuranceCostBreakdown {
  const totalContributions = monthlyContribution * 12 * years;

  // One-time costs
  const abschlusskosten: CostItem = {
    amount: totalContributions * (product.costs.abschlusskosten / 100),
    percentage: product.costs.abschlusskosten,
    description: 'Abschluss- und Vertriebskosten',
  };

  // Recurring costs (simplified calculation based on average portfolio)
  const avgPortfolio = totalContributions * 0.6;

  const verwaltungskosten: CostItem = {
    amount: avgPortfolio * (product.costs.verwaltungskosten / 100) * years,
    percentage: product.costs.verwaltungskosten,
    description: 'Verwaltungskosten',
  };

  const fondskosten: CostItem = {
    amount: avgPortfolio * (product.costs.fondskosten / 100) * years,
    percentage: product.costs.fondskosten,
    description: 'Fondskosten (TER)',
  };

  const garantiekosten: CostItem = {
    amount: avgPortfolio * (product.costs.garantiekosten / 100) * years,
    percentage: product.costs.garantiekosten,
    description: 'Garantiekosten',
  };

  const risikokosten: CostItem = {
    amount: avgPortfolio * (product.costs.risikokosten / 100) * years,
    percentage: product.costs.risikokosten,
    description: 'Risikokosten (Todesfallschutz)',
  };

  const totalOneTime = abschlusskosten.amount;
  const totalRecurring = verwaltungskosten.amount + fondskosten.amount + garantiekosten.amount + risikokosten.amount;
  const totalAllCosts = totalOneTime + totalRecurring;

  return {
    oneTimeCosts: {
      abschlusskosten,
      ausgabeaufschlag: {
        amount: 0,
        percentage: 0,
        description: 'Ausgabeaufschlag',
      },
      total: totalOneTime,
    },
    recurringCosts: {
      verwaltungskosten,
      fondskosten,
      garantiekosten,
      risikokosten,
      totalPerYear: totalRecurring / years,
    },
    totalCosts: {
      overEntirePeriod: totalAllCosts,
      asPercentageOfContributions: (totalAllCosts / totalContributions) * 100,
      reductionInReturnPerYear:
        product.costs.verwaltungskosten +
        product.costs.fondskosten +
        product.costs.garantiekosten +
        product.costs.risikokosten,
    },
    effectiveCostRatio: product.costs.effectiveCostRatio || 0,
  };
}

function calculateCostImpact(
  monthlyContribution: number,
  years: number,
  product: InsuranceProduct
): Array<{ scenario: string; withoutCosts: number; withCosts: number; difference: number }> {
  const totalMonths = years * 12;

  // Simplified future value calculation
  const calculateFV = (rate: number, withCosts: boolean) => {
    const netRate = withCosts
      ? rate - (product.costs.effectiveCostRatio || 0) / 100
      : rate;
    const monthlyRate = netRate / 12;

    if (monthlyRate === 0) return monthlyContribution * totalMonths;

    return monthlyContribution *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);
  };

  const scenarios = [
    { name: '4% Rendite', rate: 0.04 },
    { name: '6% Rendite', rate: 0.06 },
    { name: '8% Rendite', rate: 0.08 },
  ];

  return scenarios.map(({ name, rate }) => {
    const withoutCosts = calculateFV(rate, false);
    const withCosts = calculateFV(rate, true);
    return {
      scenario: name,
      withoutCosts,
      withCosts,
      difference: withoutCosts - withCosts,
    };
  });
}
