import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FundAllocation } from '../types/insurance';

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

  // Insurance Product Configuration
  selectedInsuranceProductId: string | null;
  insuranceMonthlyContribution: number;
  insuranceContractDuration: number; // in years
  insuranceFundAllocation: FundAllocation[];
  insuranceStartAge: number | null;

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
  updateInsuranceData: (data: Partial<PensionData>) => void;
  selectInsuranceProduct: (productId: string) => void;
  clearInsuranceSelection: () => void;
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
  selectedInsuranceProductId: null,
  insuranceMonthlyContribution: 300,
  insuranceContractDuration: 30,
  insuranceFundAllocation: [],
  insuranceStartAge: null,
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

      updateInsuranceData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      selectInsuranceProduct: (productId) =>
        set((state) => ({
          ...state,
          selectedInsuranceProductId: productId,
        })),

      clearInsuranceSelection: () =>
        set((state) => ({
          ...state,
          selectedInsuranceProductId: null,
          insuranceFundAllocation: [],
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
