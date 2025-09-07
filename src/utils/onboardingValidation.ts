import { OnboardingData, ValidationErrors, MaritalStatus, OtherIncomeType } from '../types/onboarding';

type ValidationError = {
  field: string;
  message: string;
};

// Validation helper functions
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (value === undefined || value === null || value === '') {
    return { field: fieldName, message: `${fieldName} ist ein Pflichtfeld` };
  }
  return null;
};

export const validateNumber = (value: any, fieldName: string, min = 0, max?: number): ValidationError | null => {
  if (isNaN(value) || value < min) {
    return { field: fieldName, message: `${fieldName} muss eine gültige Zahl ≥ ${min} sein` };
  }
  if (max !== undefined && value > max) {
    return { field: fieldName, message: `${fieldName} darf nicht größer als ${max} sein` };
  }
  return null;
};

export const validateYear = (value: number, fieldName: string): ValidationError | null => {
  const currentYear = new Date().getFullYear();
  if (value < 1900 || value > currentYear) {
    return { field: fieldName, message: `${fieldName} muss zwischen 1900 und ${currentYear} liegen` };
  }
  return null;
};

export const validatePercentage = (value: number, fieldName: string, max = 100): ValidationError | null => {
  if (value < 0 || value > max) {
    return { field: fieldName, message: `${fieldName} muss zwischen 0 und ${max}% liegen` };
  }
  return null;
};

// Format helpers
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const parseCurrency = (value: string): number => {
  // Remove currency symbols, spaces, and convert comma to dot
  const cleaned = value.replace(/[€\s]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const parsePercentage = (value: string): number => {
  // Handle both comma and dot as decimal separator
  const cleaned = value.replace('%', '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

// Age calculation
export const calculateAge = (birthYear: number): number => {
  return new Date().getFullYear() - birthYear;
};

export const calculateBirthYear = (age: number): number => {
  return new Date().getFullYear() - age;
};

// Step validation functions
export const validatePersonalData = (data: Partial<OnboardingData>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.personal) return [{ field: 'personal', message: 'Persönliche Daten fehlen' }];
  
  const requiredError = validateRequired(data.personal.birthYear, 'Geburtsjahr');
  if (requiredError) errors.push(requiredError);
  
  if (data.personal.birthYear) {
    const yearError = validateYear(data.personal.birthYear, 'Geburtsjahr');
    if (yearError) errors.push(yearError);
  }
  
  const maritalError = validateRequired(data.personal.maritalStatus, 'Familienstand');
  if (maritalError) errors.push(maritalError);
  
  if (data.personal.children?.has && data.personal.children.count !== undefined) {
    const childrenError = validateNumber(data.personal.children.count, 'Anzahl Kinder', 0, 20);
    if (childrenError) errors.push(childrenError);
  }
  
  return errors;
};

export const validateIncomeData = (data: Partial<OnboardingData>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.income) return [{ field: 'income', message: 'Einkommensdaten fehlen' }];
  
  const isMarriedBoth = data.personal?.maritalStatus === 'verheiratet' && 
                       data.personal?.calcScope === 'beide_personen';
  
  if (isMarriedBoth) {
    // Validate dual person data
    const incomeData = data.income;
    
    // Person A
    const netMonthlyA = validateRequired(incomeData.netMonthly_A, 'Nettoeinkommen Person A');
    if (netMonthlyA) errors.push(netMonthlyA);
    
    if (incomeData.netMonthly_A !== undefined) {
      const amountErrorA = validateNumber(incomeData.netMonthly_A, 'Nettoeinkommen Person A', 0);
      if (amountErrorA) errors.push(amountErrorA);
    }
    
    // Person B
    const netMonthlyB = validateRequired(incomeData.netMonthly_B, 'Nettoeinkommen Person B');
    if (netMonthlyB) errors.push(netMonthlyB);
    
    if (incomeData.netMonthly_B !== undefined) {
      const amountErrorB = validateNumber(incomeData.netMonthly_B, 'Nettoeinkommen Person B', 0);
      if (amountErrorB) errors.push(amountErrorB);
    }
  } else {
    // Validate single person data
    const incomeData = data.income;
    
    const netMonthlyError = validateRequired(incomeData.netMonthly, 'Nettoeinkommen');
    if (netMonthlyError) errors.push(netMonthlyError);
    
    if (incomeData.netMonthly !== undefined) {
      const amountError = validateNumber(incomeData.netMonthly, 'Nettoeinkommen', 0);
      if (amountError) errors.push(amountError);
    }
  }
  
  return errors;
};

export const validateMortgageData = (data: Partial<OnboardingData>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.mortgage?.has) return errors;
  
  if (data.mortgage.remainingDebtNow !== undefined) {
    const debtError = validateNumber(data.mortgage.remainingDebtNow, 'Restschuld heute', 0);
    if (debtError) errors.push(debtError);
  }
  
  if (data.mortgage.fixationEndYear !== undefined) {
    const currentYear = new Date().getFullYear();
    const yearError = validateNumber(data.mortgage.fixationEndYear, 'Zinsbindungsende', currentYear, currentYear + 20);
    if (yearError) errors.push(yearError);
  }
  
  if (data.mortgage.remainingDebtAtFixationEnd !== undefined) {
    const endDebtError = validateNumber(data.mortgage.remainingDebtAtFixationEnd, 'Restschuld bei Zinsbindungsende', 0);
    if (endDebtError) errors.push(endDebtError);
  }
  
  if (data.mortgage.interestRate !== undefined) {
    const rateError = validatePercentage(data.mortgage.interestRate, 'Zinssatz', 20);
    if (rateError) errors.push(rateError);
  }
  
  return errors;
};

// Complete validation
export const validateOnboardingData = (data: Partial<OnboardingData>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  errors.push(...validatePersonalData(data));
  errors.push(...validateIncomeData(data));
  errors.push(...validateMortgageData(data));
  
  return errors;
};

// Check if step is complete
export const isStepValid = (stepId: string, data: Partial<OnboardingData>): boolean => {
  switch (stepId) {
    case 'personal':
      return validatePersonalData(data).length === 0;
    case 'income':
      return validateIncomeData(data).length === 0;
    case 'mortgage':
      return validateMortgageData(data).length === 0;
    default:
      return true;
  }
};