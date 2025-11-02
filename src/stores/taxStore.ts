import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TAX_SETTINGS, TaxSettings } from '@/utils/germanTaxCalculations';

interface TaxStore {
  taxSettings: TaxSettings;
  updateTaxSettings: (settings: Partial<TaxSettings>) => void;
  resetTaxSettings: () => void;
}

/**
 * Global tax settings store
 * Synchronizes tax parameters across all modules (calculator, comparison, etc.)
 */
export const useTaxStore = create<TaxStore>()(
  persist(
    (set) => ({
      taxSettings: DEFAULT_TAX_SETTINGS,
      
      updateTaxSettings: (settings) =>
        set((state) => ({
          taxSettings: { ...state.taxSettings, ...settings },
        })),
      
      resetTaxSettings: () =>
        set({ taxSettings: DEFAULT_TAX_SETTINGS }),
    }),
    {
      name: 'tax-settings-storage',
    }
  )
);
