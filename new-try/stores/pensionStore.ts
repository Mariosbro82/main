import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PensionData {
  // Personal Data
  birthYear: number | null;
  maritalStatus: 'single' | 'married' | null;
  numberOfChildren: number;
  
  // Income Data
  grossIncome: number;
  
  // Pension Data
  expectedStatutoryPension: number;
  vistaPensionMonthly: number;
  
  // Insurance & Assets
  lifeInsuranceMonthly: number;
  fundSavingsPlanMonthly: number;
  
  // Mortgage/Property
  hasMortgage: boolean;
  mortgageBalance: number;
  monthlyMortgagePayment: number;
  
  // Tax Settings
  freistellungsauftrag: number; // Default 1000€
  
  // Withdrawal Settings
  annualWithdrawalAmount: number;
  
  // Fund Comparison Settings
  fundReturnRate: number;
  fundSalesCharge: number;
  fundAnnualManagementFee: number;
  
  // UI State
  isOnboardingComplete: boolean;
}

interface PensionStore extends PensionData {
  updatePersonalData: (data: Partial<PensionData>) => void;
  updateIncomeData: (data: Partial<PensionData>) => void;
  updatePensionData: (data: Partial<PensionData>) => void;
  updateAssetsData: (data: Partial<PensionData>) => void;
  updateTaxSettings: (freistellungsauftrag: number) => void;
  updateWithdrawalSettings: (amount: number) => void;
  updateFundSettings: (data: Partial<PensionData>) => void;
  completeOnboarding: () => void;
  resetAllData: () => void;
}

const initialState: PensionData = {
  birthYear: null,
  maritalStatus: null,
  numberOfChildren: 0,
  grossIncome: 0,
  expectedStatutoryPension: 0,
  vistaPensionMonthly: 0,
  lifeInsuranceMonthly: 0,
  fundSavingsPlanMonthly: 0,
  hasMortgage: false,
  mortgageBalance: 0,
  monthlyMortgagePayment: 0,
  freistellungsauftrag: 1000, // Default per requirements
  annualWithdrawalAmount: 0,
  fundReturnRate: 5,
  fundSalesCharge: 5,
  fundAnnualManagementFee: 1.5,
  isOnboardingComplete: false,
};

export const usePensionStore = create<PensionStore>()(
  persist(
    (set) => ({
      ...initialState,

      updatePersonalData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updateIncomeData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updatePensionData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updateAssetsData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updateTaxSettings: (freistellungsauftrag) =>
        set((state) => ({
          ...state,
          freistellungsauftrag,
        })),

      updateWithdrawalSettings: (amount) =>
        set((state) => ({
          ...state,
          annualWithdrawalAmount: amount,
        })),

      updateFundSettings: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      completeOnboarding: () =>
        set((state) => ({
          ...state,
          isOnboardingComplete: true,
        })),

      resetAllData: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: 'pension-store',
    }
  )
);
