import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface PerformanceData {
  period: string;
  value: number;
  isPositive?: boolean;
}

interface HistoricalPerformanceTableProps {
  title?: string;
  subtitle?: string;
  data: PerformanceData[];
  darkMode?: boolean;
}

export default function HistoricalPerformanceTable({
  title = 'Historische Wertentwicklung',
  subtitle,
  data,
  darkMode = false,
}: HistoricalPerformanceTableProps) {
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedTextColor = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`${bgColor} rounded-2xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className={`text-xl font-bold ${textColor} mb-1`}>{title}</h3>
        {subtitle && <p className={`text-sm ${mutedTextColor}`}>{subtitle}</p>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                Zeitraum
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium ${mutedTextColor} uppercase tracking-wider`}>
                Performance
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${borderColor}`}>
            {data.map((item, index) => {
              const isPositive = item.isPositive ?? item.value >= 0;
              return (
                <motion.tr
                  key={item.period}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={hoverBg}
                >
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${textColor}`}>
                    {item.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.value > 0 ? '+' : ''}
                        {item.value.toFixed(2)} %
                      </span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'} border-t ${borderColor}`}>
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            <strong>Beachten Sie bitte:</strong> Historische Wertentwicklungen sind keine
            zuverlässigen Indikatoren für die zukünftige Wertentwicklung. Die Wertentwicklung
            des Portfolios wurde durch Backtesting-Verfahren ermittelt. Hierbei wird die
            Wertentwicklung des Startportfolios anhand historischer Daten nachgebildet.
          </p>
        </div>
      </div>
    </div>
  );
}
