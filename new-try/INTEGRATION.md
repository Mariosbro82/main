# Onboarding System - Standalone

A clean, self-contained onboarding wizard for collecting pension and financial data.

## Features

- 7-step wizard workflow
- Form validation
- LocalStorage persistence  
- Zustand state management
- TypeScript types
- Responsive UI with Tailwind CSS

## Quick Start

```bash
# Install dependencies (will be added to package.json)
npm install zustand lucide-react

# Import and use
import OnboardingWizard from './components/onboarding/OnboardingWizard';
```

## Integration

This onboarding system is ready to be integrated into any React application. All `@/` path aliases are configured in `tsconfig.json`.

## Removed Dependencies

All references to the old application have been removed:
- No routing dependencies (wouter)
- No server-side code
- No API calls
- No external page references

## Structure

- `components/onboarding/` - Main wizard and step components
- `components/ui/` - Reusable UI components (Button, Card, Input, etc.)
- `stores/onboardingStore.ts` - Zustand store
- `types/onboarding.ts` - TypeScript definitions
- `services/onboardingStorage.ts` - LocalStorage service
- `utils/onboardingValidation.ts` - Validation logic
- `lib/utils.ts` - Utility functions
- `hooks/` - React hooks

## Next Steps

Build your new application and import this onboarding as needed.
