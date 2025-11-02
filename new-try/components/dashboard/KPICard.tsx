import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  darkMode?: boolean;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  trend,
  darkMode = false,
}: KPICardProps) {
  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedTextColor = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`${bgColor} rounded-2xl shadow-lg p-6 border ${
        darkMode ? 'border-gray-700' : 'border-gray-100'
      } hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${darkMode ? 'bg-gray-700' : iconBgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : iconColor}`} />
        </div>
        {trend && (
          <div
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              trend.isPositive
                ? darkMode
                  ? 'bg-green-900/50 text-green-300'
                  : 'bg-green-100 text-green-700'
                : darkMode
                ? 'bg-red-900/50 text-red-300'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value.toFixed(1)}%
          </div>
        )}
      </div>

      <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>{title}</h3>

      <p className={`text-3xl font-bold ${textColor} mb-1`}>
        {typeof value === 'number' ? value.toLocaleString('de-DE') : value}
      </p>

      {subtitle && <p className={`text-sm ${mutedTextColor}`}>{subtitle}</p>}
    </motion.div>
  );
}
