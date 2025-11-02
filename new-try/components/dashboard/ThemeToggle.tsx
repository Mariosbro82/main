import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isDarkMode
          ? 'bg-gray-700 text-yellow-400'
          : 'bg-gray-200 text-gray-700'
      }`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.div>
      <span className="text-sm font-medium">
        {isDarkMode ? 'Dunkel' : 'Hell'}
      </span>
    </motion.button>
  );
}
