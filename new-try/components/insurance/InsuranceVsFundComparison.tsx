import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Zap,
  Lock,
  Unlock,
  ThumbsUp,
  ThumbsDown,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { InsuranceProduct } from '../../types/insurance';

interface InsuranceVsFundComparisonProps {
  product: InsuranceProduct;
  monthlyContribution: number;
  years: number;
  isDarkMode?: boolean;
}

export default function InsuranceVsFundComparison({
  product,
  monthlyContribution,
  years,
  isDarkMode = false
}: InsuranceVsFundComparisonProps) {
  const [assumedReturn, setAssumedReturn] = useState<number>(6.0);

  // Theme colors
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  // Calculate comparison
  const comparison = calculateComparison(product, monthlyContribution, years, assumedReturn);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare chart data
  const chartData = [
    {
      name: 'Beiträge',
      Fonds: comparison.fundInvestment.totalContributions,
      Versicherung: comparison.insurance.totalContributions,
    },
    {
      name: 'Kosten',
      Fonds: comparison.fundInvestment.totalCosts,
      Versicherung: comparison.insurance.totalCosts,
    },
    {
      name: 'Erwarteter Wert',
      Fonds: comparison.fundInvestment.expectedValue,
      Versicherung: comparison.insurance.expectedValue,
    },
    {
      name: 'Garantie',
      Fonds: comparison.fundInvestment.guarantee,
      Versicherung: comparison.insurance.guaranteedValue,
    },
    {
      name: 'Netto-Auszahlung',
      Fonds: comparison.fundInvestment.netPayout,
      Versicherung: comparison.insurance.netPayout,
    },
  ];

  // Radar chart for feature comparison
  const featureData = [
    {
      feature: 'Rendite',
      Fonds: comparison.fundInvestment.expectedValue / comparison.insurance.expectedValue * 100,
      Versicherung: 100,
    },
    {
      feature: 'Sicherheit',
      Fonds: 20,
      Versicherung: product.guaranteeLevel,
    },
    {
      feature: 'Flexibilität',
      Fonds: 100,
      Versicherung: product.features.entnahmenMoeglich ? 70 : 40,
    },
    {
      feature: 'Kosten',
      Fonds: 100,
      Versicherung: Math.max(0, 100 - ((product.costs.effectiveCostRatio || 0) * 20)),
    },
    {
      feature: 'Steuervorteile',
      Fonds: 50,
      Versicherung: years >= 12 ? 100 : 50,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${textColor}`}>
            Versicherung vs. ETF-Sparplan
          </h2>
          <p className={`text-sm ${textSecondary} mt-1`}>
            Vergleiche fondsgebundene Rentenversicherung mit direkter Fondsanlage
          </p>
        </div>
      </div>

      {/* Return Assumption Slider */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <label className={`block text-sm font-medium ${textColor} mb-3`}>
          Angenommene jährliche Rendite
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="3"
            max="10"
            step="0.5"
            value={assumedReturn}
            onChange={(e) => setAssumedReturn(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className={`text-lg font-bold ${textColor} min-w-[80px] text-right`}>
            {assumedReturn.toFixed(1)}% p.a.
          </span>
        </div>
        <p className={`text-xs ${textSecondary} mt-2`}>
          Historische Durchschnittsrendite MSCI World: ~8% p.a. (langfristig)
        </p>
      </div>

      {/* Quick Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Investment */}
        <ComparisonCard
          title="ETF-Sparplan"
          subtitle="Direktanlage ohne Versicherungsmantel"
          icon={Zap}
          iconColor="text-blue-500"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          expectedValue={comparison.fundInvestment.expectedValue}
          netPayout={comparison.fundInvestment.netPayout}
          guarantee={comparison.fundInvestment.guarantee}
          costs={comparison.fundInvestment.totalCosts}
          flexibility={comparison.fundInvestment.flexibility}
          deathBenefit={comparison.fundInvestment.deathBenefit}
          isDarkMode={isDarkMode}
          type="fund"
        />

        {/* Insurance */}
        <ComparisonCard
          title="Fondsgebundene RV"
          subtitle={product.productName}
          icon={Shield}
          iconColor="text-green-500"
          iconBg="bg-green-100 dark:bg-green-900/30"
          expectedValue={comparison.insurance.expectedValue}
          netPayout={comparison.insurance.netPayout}
          guarantee={comparison.insurance.guarantee}
          costs={comparison.insurance.totalCosts}
          flexibility={comparison.insurance.flexibility}
          deathBenefit={comparison.insurance.deathBenefit}
          isDarkMode={isDarkMode}
          type="insurance"
        />
      </div>

      {/* Detailed Comparison Bar Chart */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          Detaillierter Vergleich
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis
              dataKey="name"
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Bar dataKey="Fonds" fill="#3b82f6" name="ETF-Sparplan" />
            <Bar dataKey="Versicherung" fill="#10b981" name="Versicherung" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Radar Chart */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          Merkmalsvergleich
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={featureData}>
            <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <PolarAngleAxis
              dataKey="feature"
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
            />
            <Radar
              name="ETF-Sparplan"
              dataKey="Fonds"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Radar
              name="Versicherung"
              dataKey="Versicherung"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Differences Analysis */}
      <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          Unterschiede im Detail
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DifferenceItem
            label="Kostendifferenz"
            value={comparison.differences.costDifference}
            info="Höhere Kosten bei Versicherung"
            isNegative={comparison.differences.costDifference > 0}
            isDarkMode={isDarkMode}
          />
          <DifferenceItem
            label="Steuerersparnis"
            value={comparison.differences.taxSavings}
            info="Vorteil durch 12-Jahres-Regel"
            isNegative={false}
            isDarkMode={isDarkMode}
          />
          <DifferenceItem
            label="Garantievorteil"
            value={comparison.differences.guaranteeBenefit}
            info="Gesicherte Mindestleistung"
            isNegative={false}
            isDarkMode={isDarkMode}
          />
          <DifferenceItem
            label="Netto-Differenz"
            value={comparison.differences.netDifference}
            info="Gesamtunterschied nach Steuern"
            isNegative={comparison.differences.netDifference < 0}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className={`${cardBg} rounded-lg border-2 ${
        comparison.recommendation.type === 'fund'
          ? 'border-blue-500/50'
          : comparison.recommendation.type === 'insurance'
          ? 'border-green-500/50'
          : 'border-purple-500/50'
      } p-6`}>
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            comparison.recommendation.type === 'fund'
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : comparison.recommendation.type === 'insurance'
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-purple-100 dark:bg-purple-900/30'
          }`}>
            {comparison.recommendation.type === 'fund' ? (
              <Zap className={`w-6 h-6 text-blue-600 dark:text-blue-400`} />
            ) : comparison.recommendation.type === 'insurance' ? (
              <Shield className={`w-6 h-6 text-green-600 dark:text-green-400`} />
            ) : (
              <TrendingUp className={`w-6 h-6 text-purple-600 dark:text-purple-400`} />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`text-lg font-semibold ${textColor} mb-2`}>
              Empfehlung: {
                comparison.recommendation.type === 'fund'
                  ? 'ETF-Sparplan'
                  : comparison.recommendation.type === 'insurance'
                  ? 'Fondsgebundene Rentenversicherung'
                  : 'Kombinationsstrategie'
              }
            </h4>
            <p className={`text-sm ${textSecondary} mb-4`}>
              {comparison.recommendation.reason}
            </p>

            {comparison.recommendation.type === 'combination' && comparison.recommendation.combinationRatio && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h5 className={`font-semibold ${textColor} mb-2`}>
                  Empfohlene Aufteilung
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${textSecondary}`}>ETF-Sparplan</p>
                    <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>
                      {comparison.recommendation.combinationRatio.fundPercent}%
                    </p>
                    <p className={`text-sm ${textSecondary}`}>
                      {formatCurrency(monthlyContribution * (comparison.recommendation.combinationRatio.fundPercent / 100))}/Monat
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${textSecondary}`}>Versicherung</p>
                    <p className={`text-2xl font-bold text-green-600 dark:text-green-400`}>
                      {comparison.recommendation.combinationRatio.insurancePercent}%
                    </p>
                    <p className={`text-sm ${textSecondary}`}>
                      {formatCurrency(monthlyContribution * (comparison.recommendation.combinationRatio.insurancePercent / 100))}/Monat
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Score Display */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className={`text-sm ${textSecondary}`}>ETF-Sparplan Score</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${comparison.recommendation.score.fund}%` }}
                  />
                </div>
                <span className={`text-xs ${textSecondary}`}>
                  {comparison.recommendation.score.fund}/100
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className={`text-sm ${textSecondary}`}>Versicherung Score</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${comparison.recommendation.score.insurance}%` }}
                  />
                </div>
                <span className={`text-xs ${textSecondary}`}>
                  {comparison.recommendation.score.insurance}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro/Con Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Pros/Cons */}
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-blue-600" />
            ETF-Sparplan
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className={`text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                <ThumbsUp className="w-4 h-4 text-green-500" />
                Vorteile
              </h4>
              <ul className={`text-sm ${textSecondary} space-y-1`}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Niedrige Kosten (TER oft unter 0.5%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Maximale Flexibilität (jederzeit verkaufbar)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Volle Marktrendite ohne Garantiekosten</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Keine Abschlusskosten</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                <ThumbsDown className="w-4 h-4 text-red-500" />
                Nachteile
              </h4>
              <ul className={`text-sm ${textSecondary} space-y-1`}>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Keine Garantie (Kapitalmarktrisiko)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Keine Steuervorteile (25% Abgeltungssteuer)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Kein automatischer Todesfallschutz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Insurance Pros/Cons */}
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
            <Shield className="w-5 h-5 text-green-600" />
            Fondsgebundene RV
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className={`text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                <ThumbsUp className="w-4 h-4 text-green-500" />
                Vorteile
              </h4>
              <ul className={`text-sm ${textSecondary} space-y-1`}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{product.guaranteeLevel}% Garantie (Kapitalschutz)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Steuervorteile bei 12+ Jahren Laufzeit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Integrierter Todesfallschutz</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Planungssicherheit für Rente</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold ${textColor} mb-2 flex items-center gap-2`}>
                <ThumbsDown className="w-4 h-4 text-red-500" />
                Nachteile
              </h4>
              <ul className={`text-sm ${textSecondary} space-y-1`}>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Höhere Kosten ({product.costs.effectiveCostRatio?.toFixed(2)}% p.a.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Abschlusskosten ({product.costs.abschlusskosten}%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Weniger Flexibilität (Mindestlaufzeit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Garantie kostet Rendite</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

interface ComparisonCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  expectedValue: number;
  netPayout: number;
  guarantee: number;
  costs: number;
  flexibility: 'high' | 'medium' | 'low';
  deathBenefit: number;
  isDarkMode: boolean;
  type: 'fund' | 'insurance';
}

function ComparisonCard(props: ComparisonCardProps) {
  const { title, subtitle, icon: Icon, iconColor, iconBg, expectedValue, netPayout, guarantee, costs, flexibility, deathBenefit, isDarkMode, type } = props;
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const flexibilityColor = flexibility === 'high' ? 'text-green-500' : flexibility === 'medium' ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
          <p className={`text-sm ${textSecondary}`}>{subtitle}</p>
        </div>
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className={`text-xs ${textSecondary}`}>Erwarteter Wert</p>
          <p className={`text-2xl font-bold ${textColor}`}>
            {formatCurrency(expectedValue)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className={`text-xs ${textSecondary}`}>Netto-Auszahlung</p>
            <p className={`text-sm font-semibold ${textColor}`}>
              {formatCurrency(netPayout)}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textSecondary}`}>Garantie</p>
            <p className={`text-sm font-semibold ${textColor}`}>
              {guarantee > 0 ? formatCurrency(guarantee) : 'Keine'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className={`text-xs ${textSecondary}`}>Gesamtkosten</p>
            <p className={`text-sm font-semibold ${textColor}`}>
              {formatCurrency(costs)}
            </p>
          </div>
          <div>
            <p className={`text-xs ${textSecondary}`}>Flexibilität</p>
            <p className={`text-sm font-semibold ${flexibilityColor} capitalize`}>
              {flexibility === 'high' ? 'Hoch' : flexibility === 'medium' ? 'Mittel' : 'Niedrig'}
            </p>
          </div>
        </div>

        <div>
          <p className={`text-xs ${textSecondary}`}>Todesfallleistung</p>
          <p className={`text-sm font-semibold ${textColor}`}>
            {deathBenefit > 0 ? formatCurrency(deathBenefit) : 'Standard'}
          </p>
        </div>
      </div>
    </div>
  );
}

interface DifferenceItemProps {
  label: string;
  value: number;
  info: string;
  isNegative: boolean;
  isDarkMode: boolean;
}

function DifferenceItem({ label, value, info, isNegative, isDarkMode }: DifferenceItemProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(val));
  };

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <p className={`text-sm font-medium ${textColor} mb-1`}>{label}</p>
      <p className={`text-2xl font-bold ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
        {isNegative ? '-' : '+'}{formatCurrency(value)}
      </p>
      <p className={`text-xs ${textSecondary} mt-1`}>{info}</p>
    </div>
  );
}

// Calculation Functions

function calculateComparison(
  product: InsuranceProduct,
  monthlyContribution: number,
  years: number,
  assumedReturn: number
) {
  const totalMonths = years * 12;
  const totalContributions = monthlyContribution * totalMonths;

  // FUND INVESTMENT
  const fundCostRatio = 0.002; // 0.2% TER for ETF
  const fundNetReturn = assumedReturn / 100 - fundCostRatio;
  const fundFV = calculateFutureValue(monthlyContribution, fundNetReturn, years);
  const fundCosts = totalContributions * fundCostRatio * years;
  const fundTax = (fundFV - totalContributions) * 0.26375; // 25% + Soli
  const fundNetPayout = fundFV - fundTax;

  // INSURANCE
  const insuranceNetReturn = assumedReturn / 100 - (product.costs.effectiveCostRatio || 0) / 100;
  const insuranceFV = calculateFutureValue(monthlyContribution, insuranceNetReturn, years);
  const insuranceCosts = totalContributions * (product.costs.abschlusskosten / 100) +
    (totalContributions * 0.6) * ((product.costs.effectiveCostRatio || 0) / 100) * years;

  // Tax with 12-year rule
  const insuranceGain = insuranceFV - totalContributions;
  const insuranceTax = years >= 12
    ? insuranceGain * 0.5 * 0.26375
    : insuranceGain * 0.26375;
  const insuranceNetPayout = insuranceFV - insuranceTax;

  const guaranteedValue = totalContributions * (product.guaranteeLevel / 100);

  // Calculate scores
  const fundScore = Math.min(100, (
    (fundNetPayout / totalContributions) * 20 + // Return weight
    30 + // Flexibility bonus
    15 + // Low cost bonus
    0 // No guarantee penalty
  ));

  const insuranceScore = Math.min(100, (
    (insuranceNetPayout / totalContributions) * 20 + // Return weight
    (product.guaranteeLevel / 2) + // Guarantee bonus
    (years >= 12 ? 15 : 5) + // Tax advantage
    10 // Death benefit bonus
  ));

  // Recommendation logic
  const scoreDiff = Math.abs(fundScore - insuranceScore);
  let recommendationType: 'fund' | 'insurance' | 'combination';
  let recommendationReason: string;
  let combinationRatio: { fundPercent: number; insurancePercent: number } | undefined;

  if (scoreDiff < 15) {
    recommendationType = 'combination';
    recommendationReason = 'Beide Optionen haben ähnliche Vor- und Nachteile. Eine Kombination aus 60% ETF (für Rendite) und 40% Versicherung (für Sicherheit) bietet das beste Gleichgewicht.';
    combinationRatio = { fundPercent: 60, insurancePercent: 40 };
  } else if (fundScore > insuranceScore) {
    recommendationType = 'fund';
    recommendationReason = 'Der ETF-Sparplan bietet aufgrund niedrigerer Kosten und höherer Flexibilität die bessere Gesamtrendite. Ideal für risikotolerante Anleger mit langem Anlagehorizont.';
  } else {
    recommendationType = 'insurance';
    recommendationReason = `Die fondsgebundene Rentenversicherung bietet mit ${product.guaranteeLevel}% Garantie mehr Sicherheit und ${years >= 12 ? 'Steuervorteile' : 'integriertem Todesfallschutz'}. Ideal für sicherheitsorientierte Anleger.`;
  }

  return {
    monthlyContribution,
    years,
    assumedReturn,

    fundInvestment: {
      totalContributions,
      totalCosts: fundCosts,
      expectedValue: fundFV,
      taxAmount: fundTax,
      netPayout: fundNetPayout,
      guarantee: 0,
      deathBenefit: fundFV, // Market value only
      flexibility: 'high' as const,
    },

    insurance: {
      totalContributions,
      totalCosts: insuranceCosts,
      guaranteedValue,
      expectedValue: insuranceFV,
      taxAmount: insuranceTax,
      netPayout: insuranceNetPayout,
      guarantee: guaranteedValue,
      deathBenefit: Math.max(insuranceFV * product.deathBenefit.duringAccumulation, totalContributions * 1.1),
      flexibility: (product.features.entnahmenMoeglich ? 'medium' : 'low') as const,
    },

    differences: {
      costDifference: insuranceCosts - fundCosts,
      taxSavings: fundTax - insuranceTax,
      guaranteeBenefit: guaranteedValue,
      netDifference: insuranceNetPayout - fundNetPayout,
    },

    recommendation: {
      type: recommendationType,
      score: {
        fund: Math.round(fundScore),
        insurance: Math.round(insuranceScore),
      },
      reason: recommendationReason,
      combinationRatio,
    },
  };
}

function calculateFutureValue(monthlyContribution: number, annualNetReturn: number, years: number): number {
  const monthlyRate = annualNetReturn / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    return monthlyContribution * totalMonths;
  }

  return monthlyContribution *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);
}
