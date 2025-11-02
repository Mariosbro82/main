# Fond Gebundene Rentenversicherung - Product Requirements

## Perspektive: Versicherungsmanager
**Datum**: 2. November 2025
**Ziel**: Tool-Erweiterung für den Verkauf von fond gebundenen Rentenversicherungen

---

## Executive Summary

Um mit diesem Tool eine **fond gebundene Rentenversicherung** verkaufen zu können, benötigen wir **10 wesentliche Erweiterungen**:

1. ✅ **Produktkonfigurator** - Auswahl und Anpassung von Versicherungsprodukten
2. ✅ **Garantie-Rechner** - Berechnung von Mindestleistungen und Garantien
3. ✅ **Versicherungskosten-Transparenz** - Detaillierte Kostenaufschlüsselung
4. ✅ **Steueroptimierung für Versicherungen** - 12-Jahres-Regel, Halbeinkünfteverfahren
5. ✅ **Vergleichsrechner** - Versicherung vs. reiner Fondssparplan
6. ✅ **Todesfallschutz-Modul** - Hinterbliebenenabsicherung
7. ✅ **Auszahlungsoptionen** - Einmalzahlung vs. Verrentung
8. ✅ **Flexibilitäts-Features** - Zuzahlungen, Beitragsfreistellung, Entnahmen
9. ✅ **Gesetzeskonforme Illustration** - VVG-konforme Produktinformationen
10. ✅ **Anbieter-Vergleich** - Multi-Provider-Kalkulation

---

## 1. Produktkonfigurator

### Warum notwendig?

Als Versicherungsmanager muss ich **verschiedene Produkte** anbieten können:
- Unterschiedliche Anbieter (Allianz, AXA, Generali, etc.)
- Verschiedene Garantievarianten (0%, 50%, 80%, 100%)
- Unterschiedliche Kostenstrukturen
- Verschiedene Fondsportfolios

### Was muss implementiert werden?

#### A. Produkt-Bibliothek

```typescript
interface InsuranceProduct {
  // Grunddaten
  provider: string; // "Allianz", "AXA", "Generali"
  productName: string; // "FondsRente Plus", "Comfort Invest"
  productCode: string; // Interne Produktnummer

  // Garantien
  guaranteeLevel: 0 | 50 | 80 | 100; // Prozent der Beiträge garantiert
  guaranteeType: 'nominal' | 'real'; // Nominal oder inflationsbereinigt

  // Kosten (alle in Prozent)
  costs: {
    abschlusskosten: number; // z.B. 4% der Summe aller Beiträge
    vertriebskosten: number; // z.B. 2.5%
    verwaltungskosten: number; // z.B. 0.8% p.a.
    fondskosten: number; // z.B. 1.2% p.a. (TER)
    garantiekosten: number; // z.B. 0.3% p.a.
    risikokosten: number; // Für Todesfallschutz
  };

  // Fondsauswahl
  availableFunds: Fund[];
  defaultFundAllocation: FundAllocation[];

  // Flexibilität
  features: {
    zuzahlungenMoeglich: boolean;
    entnahmenMoeglich: boolean;
    beitragsfreistellungMoeglich: boolean;
    dynamikMoeglich: boolean;
    fondswechselMoeglich: boolean;
  };

  // Auszahlung
  payoutOptions: {
    einmalkapital: boolean;
    teilverrentung: boolean;
    vollverrentung: boolean;
    auszahlplan: boolean;
  };

  // Ratings & Qualität
  ratings: {
    morningstar?: number; // 1-5 Sterne
    mapReport?: 'exzellent' | 'sehr gut' | 'gut';
    finanzkraft?: 'AAA' | 'AA' | 'A';
  };
}

interface Fund {
  isin: string;
  name: string;
  category: 'Aktien' | 'Renten' | 'Mischfonds' | 'Immobilien';
  region: 'Global' | 'Europa' | 'USA' | 'Asien' | 'Deutschland';
  ter: number; // Total Expense Ratio
  historicalReturn: number; // Durchschnittliche Rendite
  volatility: number; // Schwankungsbreite
}
```

#### B. Produkt-Auswahl UI

**Seite**: `ProductSelectionPage.tsx`

**Features**:
- Filtermöglichkeiten (Anbieter, Garantie, Kosten)
- Vergleichstabelle (3-5 Produkte nebeneinander)
- Detailansicht pro Produkt
- Favoriten-System
- Empfehlungs-Algorithmus basierend auf Kundenprofil

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Filter: [Anbieter ▼] [Garantie ▼] [Kosten ▼]          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Produkt 1]    [Produkt 2]    [Produkt 3]             │
│  Allianz        AXA            Generali                 │
│  FondsRente     Comfort        InvestFlex              │
│  ★★★★★          ★★★★☆          ★★★★☆                   │
│                                                          │
│  Garantie: 80%  Garantie: 50%  Garantie: 100%          │
│  Kosten: 1.2%   Kosten: 0.9%   Kosten: 1.5%            │
│                                                          │
│  [Details]      [Details]      [Details]                │
│  [Auswählen]    [Auswählen]    [Auswählen]             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Garantie-Rechner

### Warum notwendig?

**Kernargument für Versicherungen**: Garantierte Mindestleistung!

Kunden müssen **sofort sehen**:
- Was ist garantiert? (Euro-Betrag)
- Was ist die erwartete Leistung? (mit Überschüssen)
- Was ist im Best Case möglich?

### Was muss implementiert werden?

#### A. Garantie-Berechnung

```typescript
interface GuaranteeCalculation {
  // Eingaben
  monthlyContribution: number;
  contributionPeriod: number; // Jahre
  guaranteeLevel: number; // 0%, 50%, 80%, 100%

  // Berechnungen
  totalContributions: number;
  guaranteedAmount: number; // Mindestleistung
  expectedAmount: number; // Mit Überschüssen (z.B. 3% p.a.)
  optimisticAmount: number; // Best Case (z.B. 6% p.a.)

  // Kosten
  totalCosts: number;
  effectiveGuarantee: number; // Nach Kosten

  // Bei Tod
  deathBenefit: {
    duringContribution: number; // Z.B. 110% der Beiträge
    afterRetirement: number; // Restkapital
  };
}

function calculateGuarantee(params: GuaranteeCalculation): GuaranteeResult {
  const { monthlyContribution, contributionPeriod, guaranteeLevel } = params;

  // Summe der Beiträge
  const totalContributions = monthlyContribution * 12 * contributionPeriod;

  // Garantierter Betrag (abhängig vom Garantielevel)
  const guaranteedAmount = totalContributions * (guaranteeLevel / 100);

  // Kosten abziehen (z.B. 5% Abschlusskosten)
  const costs = totalContributions * 0.05;
  const effectiveGuarantee = guaranteedAmount - costs;

  // Erwartete Leistung (mit Überschüssen)
  const expectedReturn = 0.03; // 3% p.a. Überschussbeteiligung
  const months = contributionPeriod * 12;
  const expectedAmount = calculateCompoundInterest(
    monthlyContribution,
    expectedReturn / 12,
    months
  );

  // Optimistische Leistung
  const optimisticReturn = 0.06; // 6% p.a.
  const optimisticAmount = calculateCompoundInterest(
    monthlyContribution,
    optimisticReturn / 12,
    months
  );

  return {
    totalContributions,
    guaranteedAmount: effectiveGuarantee,
    expectedAmount,
    optimisticAmount,
    totalCosts: costs,
    returnOnGuarantee: (effectiveGuarantee / totalContributions - 1) * 100,
  };
}
```

#### B. Garantie-Visualisierung

**Component**: `GuaranteeVisualization.tsx`

**3-Säulen-Darstellung**:
```
Garantiert      Erwartet        Best Case
  85.000€       145.000€        195.000€

  [████]         [████████]      [████████████]

  ✓ Sicher      ⚡ Wahrscheinlich  🚀 Möglich
```

**Mit Ampel-System**:
- 🟢 Grün = Garantiert (100% sicher)
- 🟡 Gelb = Erwartet (basierend auf Überschüssen)
- 🔵 Blau = Optimistisch (Best Case)

---

## 3. Versicherungskosten-Transparenz

### Warum notwendig?

**Regulatorische Anforderung**: Seit 2014 müssen **alle Kosten transparent** dargestellt werden.

**Verkaufsargument**: Zeige ehrlich, wo Kosten anfallen - schafft Vertrauen!

### Was muss implementiert werden?

#### A. Kosten-Aufschlüsselung

```typescript
interface CostBreakdown {
  // Einmalige Kosten
  oneTimeCosts: {
    abschlusskosten: {
      amount: number;
      percentage: number;
      description: 'Beratung, Vertrag, Antragsbearbeitung';
    };
    ausgabeaufschlag: {
      amount: number;
      percentage: number;
      description: 'Einmaliger Aufschlag bei Fondsanlage';
    };
  };

  // Laufende Kosten (jährlich)
  recurringCosts: {
    verwaltungskosten: {
      amountPerYear: number;
      percentage: number;
      description: 'Verwaltung des Vertrags';
    };
    fondskosten: {
      amountPerYear: number;
      percentage: number; // TER
      description: 'Kosten der Fonds (Management, Depot)';
    };
    garantiekosten: {
      amountPerYear: number;
      percentage: number;
      description: 'Kosten für Beitragsgarantie';
    };
    risikokosten: {
      amountPerYear: number;
      percentage: number;
      description: 'Kosten für Todesfallschutz';
    };
  };

  // Gesamt
  totalCosts: {
    overContractPeriod: number;
    asPercentageOfContributions: number;
    reductionInReturn: number; // Rendite-Reduzierung in %
  };

  // Effektivkosten
  effectiveCostRatio: number; // Alle Kosten als % der Beiträge
}
```

#### B. Kosten-Visualisierung

**Component**: `CostTransparencyCard.tsx`

**Kreisdiagramm**:
```
         Gesamtkosten über Laufzeit

            18.500€ (7,4% der Beiträge)

    Abschluss    ████ 35%  6.475€
    Verwaltung   ███  25%  4.625€
    Fonds        ███  25%  4.625€
    Garantie     ██   15%  2.775€
```

**Kostenvergleich-Tabelle**:
```
┌──────────────────────┬───────────┬──────────────┐
│ Kostenart            │ Pro Jahr  │ Über 30 Jahre│
├──────────────────────┼───────────┼──────────────┤
│ Abschlusskosten      │ 810€      │ 6.475€       │
│ Verwaltungskosten    │ 240€      │ 4.625€       │
│ Fondskosten (TER)    │ 360€      │ 4.625€       │
│ Garantiekosten       │ 120€      │ 2.775€       │
├──────────────────────┼───────────┼──────────────┤
│ GESAMT               │ 1.530€    │ 18.500€      │
└──────────────────────┴───────────┴──────────────┘
```

---

## 4. Steueroptimierung für Versicherungen

### Warum notwendig?

**Killer-Argument**: Versicherungen haben **massive Steuervorteile**!

**12-Jahres-Regel** + **Halbeinkünfteverfahren** = Nur 12,5% Steuer auf Erträge!

### Was muss implementiert werden?

#### A. Versicherungs-Steuerberechnung

```typescript
interface InsuranceTaxCalculation {
  // Bedingungen
  contractDuration: number; // Jahre
  ageAtPayout: number; // Alter bei Auszahlung

  // Beträge
  totalContributions: number;
  finalValue: number;
  capitalGain: number;

  // Steuerberechnung
  taxRule: '12-Jahre-Regel' | 'Standard';
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  netPayout: number;

  // Vergleich
  comparisonWithFunds: {
    fundTax: number; // 25% Abgeltungssteuer
    insuranceTax: number; // 12,5% bei 12-Jahres-Regel
    taxAdvantage: number; // Ersparnis in Euro
  };
}

function calculateInsuranceTax(params: InsuranceTaxParams): InsuranceTaxCalculation {
  const { contractDuration, ageAtPayout, totalContributions, finalValue } = params;

  const capitalGain = finalValue - totalContributions;

  // Prüfe 12-Jahres-Regel
  const meets12YearRule = contractDuration >= 12 && ageAtPayout >= 62;

  if (meets12YearRule) {
    // Halbeinkünfteverfahren: Nur 50% des Gewinns sind steuerpflichtig
    const taxableAmount = capitalGain * 0.5;

    // Abgeltungssteuer 25% auf die 50%
    const taxRate = 0.25;
    const taxAmount = taxableAmount * taxRate;

    // Effektiver Steuersatz: 12,5% auf den Gesamtgewinn!
    const effectiveTaxRate = (taxAmount / capitalGain) * 100;

    return {
      taxRule: '12-Jahre-Regel',
      taxableAmount,
      taxRate: effectiveTaxRate,
      taxAmount,
      netPayout: finalValue - taxAmount,
      comparisonWithFunds: {
        fundTax: capitalGain * 0.25, // 25% auf alles
        insuranceTax: taxAmount, // 12,5% effektiv
        taxAdvantage: (capitalGain * 0.25) - taxAmount, // Ersparnis!
      },
    };
  } else {
    // Standard: Volle Abgeltungssteuer
    const taxAmount = capitalGain * 0.25;

    return {
      taxRule: 'Standard',
      taxableAmount: capitalGain,
      taxRate: 25,
      taxAmount,
      netPayout: finalValue - taxAmount,
      comparisonWithFunds: {
        fundTax: taxAmount,
        insuranceTax: taxAmount,
        taxAdvantage: 0,
      },
    };
  }
}
```

#### B. Steuervorteil-Visualisierung

**Component**: `TaxAdvantageCard.tsx`

**Vergleich**:
```
┌────────────────────────────────────────────────┐
│  💰 Ihr Steuervorteil mit Versicherung         │
├────────────────────────────────────────────────┤
│                                                 │
│  Reiner Fonds:                                 │
│  Kapitalgewinn: 100.000€                       │
│  Steuer (25%):  25.000€  ❌                    │
│  Netto:         75.000€                        │
│                                                 │
│  ────────────────────────────────────          │
│                                                 │
│  Versicherung (12-Jahre-Regel):                │
│  Kapitalgewinn: 100.000€                       │
│  Steuer (12,5%): 12.500€  ✅                   │
│  Netto:          87.500€                       │
│                                                 │
│  💎 Ihre Steuerersparnis: 12.500€              │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 5. Vergleichsrechner: Versicherung vs. Fondssparplan

### Warum notwendig?

Kunden fragen **IMMER**: "Warum soll ich eine Versicherung nehmen statt direkt in Fonds zu investieren?"

**Zeige die Unterschiede transparent**!

### Was muss implementiert werden?

#### A. Side-by-Side Vergleich

```typescript
interface ComparisonResult {
  // Szenarien
  fundInvestment: {
    finalValue: number;
    totalCosts: number;
    taxAmount: number;
    netPayout: number;
    guarantee: 0; // Keine Garantie!
    deathBenefit: number; // Nur aktueller Wert
  };

  insurance: {
    guaranteedValue: number; // Mindestleistung
    expectedValue: number; // Mit Überschüssen
    totalCosts: number;
    taxAmount: number;
    netPayout: number;
    guarantee: number; // In Euro
    deathBenefit: number; // Erhöhte Leistung
  };

  // Unterschiede
  differences: {
    costDifference: number; // Versicherung meist teurer
    taxSavings: number; // Versicherung oft besser
    guaranteeBenefit: number; // Sicherheit hat einen Wert
    flexibilityDifference: string; // Fonds flexibler

    // Scoring
    recommendationScore: {
      fund: number; // 0-100
      insurance: number; // 0-100
      recommendation: 'fund' | 'insurance' | 'combination';
      reason: string;
    };
  };
}
```

#### B. Vergleichs-Visualisierung

**Component**: `InsuranceVsFundComparison.tsx`

**Tabelle**:
```
┌─────────────────────┬──────────────┬───────────────┐
│                     │ Fondssparplan│ Versicherung  │
├─────────────────────┼──────────────┼───────────────┤
│ Monatsbeitrag       │ 500€         │ 500€          │
│ Laufzeit            │ 30 Jahre     │ 30 Jahre      │
│                     │              │               │
│ Eingezahlt          │ 180.000€     │ 180.000€      │
│ Kosten              │ -9.000€      │ -18.500€      │
│ Entwert (erwartet)  │ 350.000€     │ 310.000€      │
│                     │              │               │
│ Garantie            │ ❌ 0€        │ ✅ 144.000€   │
│ Steuer              │ -42.500€     │ -16.250€      │
│ Netto-Auszahlung    │ 307.500€     │ 293.750€      │
│                     │              │               │
│ Todesfallschutz     │ Aktueller    │ +10% Bonus    │
│                     │ Wert         │               │
│                     │              │               │
│ Flexibilität        │ ✅ Hoch      │ ⚠️ Mittel     │
│ Sicherheit          │ ⚠️ Niedrig   │ ✅ Hoch       │
│                     │              │               │
│ 🎯 Empfehlung       │ Für Sie: Kombination         │
│                     │ 70% Fonds + 30% Versicherung │
└─────────────────────┴──────────────┴───────────────┘
```

---

## 6. Todesfallschutz-Modul

### Warum notwendig?

**Emotionales Verkaufsargument**: "Was passiert, wenn mir etwas zustößt?"

Versicherung bietet **Hinterbliebenenabsicherung** - Fonds nicht!

### Was muss implementiert werden?

#### A. Todesfallschutz-Berechnung

```typescript
interface DeathBenefitCalculation {
  // Während Ansparphase
  duringContribution: {
    currentContributions: number;
    deathBenefitMultiplier: number; // z.B. 1.1 (110%)
    guaranteedPayout: number;

    // Varianten
    options: {
      basic: number; // 100% der Beiträge
      enhanced: number; // 110% der Beiträge
      premium: number; // Beiträge + Fondswert + 10%
    };
  };

  // Nach Rentenbeginn
  afterRetirement: {
    remainingCapital: number;
    pensionGuarantee: number; // Rentengarantiezeit
    spouseProtection: {
      percentage: number; // z.B. 60% der Rente
      duration: 'lebenslang' | 'befristet';
    };
  };

  // Kosten für Todesfallschutz
  cost: {
    monthlyPremium: number;
    totalCostOverPeriod: number;
    asPercentageOfContribution: number;
  };
}
```

#### B. Hinterbliebenen-Schutz Visualisierung

**Component**: `SurvivorProtectionCard.tsx`

```
┌──────────────────────────────────────────────┐
│  👨‍👩‍👧‍👦 Schutz für Ihre Familie                │
├──────────────────────────────────────────────┤
│                                               │
│  Während der Ansparphase:                    │
│  ────────────────────────────                │
│  Bei Tod nach 15 Jahren:                     │
│  ✓ Eingezahlte Beiträge:   90.000€          │
│  ✓ Bonus (10%):            9.000€           │
│  ✓ Aktueller Fondswert:    135.000€         │
│  ═══════════════════════════════════         │
│  💰 Auszahlung:            234.000€          │
│                                               │
│  Nach Rentenbeginn:                          │
│  ────────────────────────────                │
│  ✓ Restkapital:            185.000€          │
│  ✓ Ehepartner erhält:      60% der Rente     │
│  ✓ Rentengarantiezeit:     10 Jahre          │
│                                               │
│  📊 Mehrkosten: 35€/Monat (7% des Beitrags) │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 7. Auszahlungsoptionen

### Warum notwendig?

**Flexibilität ist Verkaufsargument**: "Sie entscheiden zum Schluss, wie Sie Ihr Geld erhalten!"

### Was muss implementiert werden?

#### A. Auszahlungs-Optionen

```typescript
interface PayoutOptions {
  // Option 1: Einmalkapital
  lumpSum: {
    amount: number;
    taxAmount: number;
    netAmount: number;
    advantages: string[];
    disadvantages: string[];
  };

  // Option 2: Teilverrentung
  partialAnnuity: {
    capitalPart: number; // Sofort als Kapital
    monthlyPension: number; // Monatliche Rente
    duration: 'lebenslang' | number; // Jahre
    advantages: string[];
    disadvantages: string[];
  };

  // Option 3: Vollverrentung
  fullAnnuity: {
    monthlyPension: number;
    guaranteedYears: number;
    spouseProtection: boolean;
    taxAdvantage: number; // Ertragsanteilbesteuerung
    advantages: string[];
    disadvantages: string[];
  };

  // Option 4: Auszahlplan
  withdrawalPlan: {
    customMonthlyAmount: number;
    duration: number; // Wie lange reicht das Geld
    taxPerYear: number;
    advantages: string[];
    disadvantages: string[];
  };
}

function calculatePayoutOptions(
  capital: number,
  age: number,
  gender: 'male' | 'female'
): PayoutOptions {
  // Option 3: Vollverrentung berechnen
  const monthlyPension = calculateLifelongPension(capital, age, gender);

  // Ertragsanteilbesteuerung (nur ein kleiner Teil ist steuerpflichtig!)
  const ertragsanteil = getErtragsanteil(age); // z.B. 18% bei Alter 67
  const taxablePortion = monthlyPension * 12 * ertragsanteil;
  const yearlyTax = taxablePortion * 0.25; // Abgeltungssteuer
  const monthlyTaxAdvantage = yearlyTax / 12;

  return {
    // ... andere Optionen

    fullAnnuity: {
      monthlyPension,
      guaranteedYears: 10,
      spouseProtection: true,
      taxAdvantage: monthlyTaxAdvantage,
      advantages: [
        'Lebenslange Zahlungen - Sie können nicht überleben',
        'Nur 18% der Rente ist steuerpflichtig (Ertragsanteil)',
        'Planungssicherheit',
        'Hinterbliebenenabsicherung möglich',
      ],
      disadvantages: [
        'Kein Zugriff auf Restkapital',
        'Bei frühem Tod verlieren Erben',
        'Weniger Flexibilität',
      ],
    },
  };
}
```

#### B. Auszahlungs-Simulator

**Component**: `PayoutSimulator.tsx`

**Interactive Sliders**:
```
┌───────────────────────────────────────────────┐
│  💰 Auszahlungs-Simulator                     │
├───────────────────────────────────────────────┤
│                                                │
│  Ihr Kapital: 250.000€                        │
│                                                │
│  Option wählen:                               │
│  ○ Einmalkapital (250.000€ sofort)           │
│  ○ Teilverrentung                             │
│  ● Vollverrentung (lebenslang)                │
│  ○ Auszahlplan                                │
│                                                │
│  ────────────────────────────────────         │
│                                                │
│  📊 Ihre monatliche Rente: 1.125€            │
│                                                │
│  ✓ Lebenslang garantiert                     │
│  ✓ Nur 203€ steuerpflichtig (18%)            │
│  ✓ Netto nach Steuer: ~1.075€/Monat         │
│  ✓ 10 Jahre Rentengarantiezeit               │
│                                                │
│  Vergleich zum Auszahlplan:                   │
│  Mit 1.125€/Monat würde Kapital              │
│  nur 18,5 Jahre reichen - aber Sie           │
│  erhalten es LEBENSLANG! ✨                   │
│                                                │
└───────────────────────────────────────────────┘
```

---

## 8. Flexibilitäts-Features

### Warum notwendig?

**Einwand-Behandlung**: "Was wenn sich meine Situation ändert?"

**Zeige Flexibilität**!

### Was muss implementiert werden?

#### A. Flexibilitäts-Optionen

```typescript
interface FlexibilityFeatures {
  // Zuzahlungen
  additionalPayments: {
    allowed: boolean;
    minAmount: number;
    maxAmountPerYear: number;
    costs: number; // Prozent
    impactOnGuarantee: 'yes' | 'no';
  };

  // Entnahmen
  withdrawals: {
    allowed: boolean;
    minAmount: number;
    maxPercentageOfValue: number;
    costs: number;
    impactOnGuarantee: 'reduces' | 'maintains';
    taxImplications: string;
  };

  // Beitragsfreistellung
  contributionHoliday: {
    allowed: boolean;
    minDuration: number; // Monate
    maxDuration: number;
    impactOnContract: string;
    costs: number;
  };

  // Dynamik
  dynamicIncrease: {
    allowed: boolean;
    percentage: number; // z.B. 3% jährlich
    skipAllowed: boolean;
    impactOnGuarantee: 'increases' | 'maintains';
  };

  // Fondswechsel
  fundSwitch: {
    allowed: boolean;
    freeSwit chesPerYear: number;
    costPerSwitch: number;
    impactOnGuarantee: 'yes' | 'no';
  };
}
```

#### B. Flexibilitäts-Dashboard

**Component**: `FlexibilityDashboard.tsx`

```
┌────────────────────────────────────────────────┐
│  🔄 Ihre Flexibilitäts-Optionen                │
├────────────────────────────────────────────────┤
│                                                 │
│  ✅ Zuzahlungen:                               │
│     Min: 500€ | Max: 10.000€/Jahr             │
│     Kosten: 2% | Garantie: Erhöht sich       │
│                                                 │
│  ✅ Entnahmen:                                 │
│     Ab: 1.000€ | Max: 30% des Werts           │
│     Kosten: 50€ | Garantie: Wird reduziert    │
│                                                 │
│  ✅ Beitragsfreistellung:                      │
│     Jederzeit möglich                          │
│     Kosten: Keine                              │
│     Vertrag läuft weiter mit reduzierter       │
│     Leistung                                    │
│                                                 │
│  ✅ Dynamik (automatische Erhöhung):           │
│     3% jährlich                                 │
│     Kann jederzeit übersprungen werden         │
│                                                 │
│  ✅ Fondswechsel:                              │
│     4x pro Jahr kostenlos                      │
│     Danach: 25€ pro Wechsel                    │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 9. Gesetzeskonforme Illustration

### Warum notwendig?

**Gesetzliche Pflicht** (VVG § 7): Standardisierte Produktinformation!

**Verkaufs-Tool**: Professional = Vertrauen!

### Was muss implementiert werden?

#### A. VVG-Konforme Dokumente

```typescript
interface VVGIllustration {
  // Deckblatt
  coverPage: {
    productName: string;
    provider: string;
    customerName: string;
    date: string;
    illustrationNumber: string;
  };

  // Produktinformationen
  productInfo: {
    type: 'Fond gebundene Rentenversicherung';
    guaranteeLevel: number;
    contractDuration: number;
    monthlyContribution: number;
    fundSelection: string[];
  };

  // Kosten (gesetzlich vorgeschrieben)
  costDisclosure: {
    // Effektivkosten
    effectiveCostRatio: number; // Alle Kosten in % der Beiträge

    // Detaillierte Aufschlüsselung
    breakdown: {
      abschlusskosten: CostItem;
      verwaltungskosten: CostItem;
      fondskosten: CostItem;
      garantiekosten?: CostItem;
      risikokosten?: CostItem;
    };

    // Reduktion der Rendite
    returnReduction: number; // In % p.a.
  };

  // Wertentwicklung (3 Szenarien)
  performanceScenarios: {
    guaranteed: ScenarioData;
    expected: ScenarioData; // Mit Überschüssen
    optimistic: ScenarioData;
  };

  // Wichtige Hinweise
  disclosures: {
    risiken: string[];
    kosten: string[];
    garantien: string[];
    steuerlicheHinweise: string[];
  };
}

interface ScenarioData {
  assumptions: {
    return: number; // % p.a.
    costs: number;
  };
  progression: YearlyValue[]; // Jahr für Jahr
  finalValue: number;
  netPayout: number; // Nach Steuern
}
```

#### B. PDF-Generator für Illustration

**Function**: `generateVVGIllustration()`

**Output**: Mehrseitiges PDF mit:
1. **Deckblatt** - Kundenname, Produkt, Datum
2. **Produktübersicht** - Was ist versichert?
3. **Kostenaufstellung** - Alle Kosten transparent
4. **Wertentwicklung** - Tabelle mit 3 Szenarien
5. **Grafiken** - Visuelle Darstellung
6. **Hinweise** - Risiken, Garantien, Steuern
7. **Unterschrift** - Kunde bestätigt Erhalt

---

## 10. Anbieter-Vergleich

### Warum notwendig?

**Beratungspflicht**: Ich muss dem Kunden **mehrere Angebote** zeigen!

**Verkaufs-Tool**: Transparenz schafft Vertrauen!

### Was muss implementiert werden?

#### A. Multi-Provider-Vergleich

```typescript
interface ProviderComparison {
  providers: Provider[];
  comparisonCriteria: {
    costs: number; // Gewichtung 30%
    guarantee: number; // Gewichtung 20%
    flexibility: number; // Gewichtung 20%
    ratings: number; // Gewichtung 15%
    returns: number; // Gewichtung 15%
  };

  results: ProviderResult[];
  recommendation: {
    topChoice: Provider;
    score: number;
    reasons: string[];
  };
}

interface Provider {
  name: string;
  logo: string;

  // Ratings
  ratings: {
    financial: 'AAA' | 'AA' | 'A' | 'BBB';
    morningstar: 1 | 2 | 3 | 4 | 5;
    mapReport: 'exzellent' | 'sehr gut' | 'gut' | 'befriedigend';
  };

  // Produkte
  products: InsuranceProduct[];

  // Besonderheiten
  uniqueFeatures: string[];
  marketPosition: string;
}
```

#### B. Anbieter-Vergleichstabelle

**Component**: `ProviderComparisonTable.tsx`

```
┌────────────────┬─────────┬─────────┬──────────┬─────────┐
│                │ Allianz │   AXA   │ Generali │  Zurich │
├────────────────┼─────────┼─────────┼──────────┼─────────┤
│ Rating         │ ★★★★★   │ ★★★★☆   │ ★★★★☆    │ ★★★★☆   │
│ Finanzkraft    │ AAA     │ AA      │ AA       │ AA      │
│                │         │         │          │         │
│ Gesamtkosten   │ 1.35%   │ 0.95%✅ │ 1.55%    │ 1.25%   │
│ Garantie       │ 80%     │ 50%     │ 100%✅   │ 80%     │
│ Flexibilität   │ ★★★★★✅ │ ★★★★☆   │ ★★★☆☆    │ ★★★★☆   │
│                │         │         │          │         │
│ Fondssauswahl  │ 150+    │ 80      │ 200+✅   │ 120     │
│ Zuzahlungen    │ ✅ Ja   │ ✅ Ja   │ ⚠️ Nein  │ ✅ Ja   │
│ Entnahmen      │ ✅ Ja   │ ✅ Ja   │ ✅ Ja    │ ✅ Ja   │
│                │         │         │          │         │
│ Erw. Rendite   │ 5.8%    │ 6.2%✅  │ 5.5%     │ 5.9%    │
│ Steueropt.     │ ✅ Ja   │ ✅ Ja   │ ✅ Ja    │ ✅ Ja   │
│                │         │         │          │         │
│ 🎯 Gesamt      │ 92/100  │ 88/100  │ 85/100   │ 87/100  │
│                │ 🥇BEST  │         │          │         │
├────────────────┴─────────┴─────────┴──────────┴─────────┤
│ 💡 Empfehlung: Allianz FondsRente Plus                  │
│    + Bestes Gesamtpaket                                  │
│    + Höchste Flexibilität                               │
│    + Top-Ratings                                         │
│    - Etwas höhere Kosten (aber: beste Leistung)        │
└──────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Basis-Features (4 Wochen)

**Woche 1-2**: Produktkonfigurator
- [ ] Produkt-Datenmodell
- [ ] Produkt-Bibliothek (5 Hauptanbieter)
- [ ] Produkt-Auswahl UI
- [ ] Filter- und Vergleichsfunktionen

**Woche 3-4**: Garantie & Kosten
- [ ] Garantie-Rechner
- [ ] 3-Szenarien-Visualisierung
- [ ] Kosten-Transparenz-Modul
- [ ] Kosten-Visualisierungen

### Phase 2: Steuer & Vergleich (3 Wochen)

**Woche 5-6**: Steueroptimierung
- [ ] 12-Jahres-Regel Berechnung
- [ ] Halbeinkünfteverfahren
- [ ] Steuervorteil-Visualisierung
- [ ] Vergleich mit Fondssparplan

**Woche 7**: Vergleichsrechner
- [ ] Side-by-Side Vergleich
- [ ] Empfehlungs-Algorithmus
- [ ] Interactive Vergleichstabelle

### Phase 3: Absicherung & Flexibilität (3 Wochen)

**Woche 8-9**: Todesfallschutz
- [ ] Hinterbliebenen-Berechnung
- [ ] Schutz-Varianten
- [ ] Visualisierungen

**Woche 10**: Flexibilität
- [ ] Zuzahlungen/Entnahmen
- [ ] Beitragsfreistellung
- [ ] Dynamik-Optionen

### Phase 4: Auszahlung & Compliance (3 Wochen)

**Woche 11**: Auszahlungsoptionen
- [ ] 4 Auszahlungsvarianten
- [ ] Auszahlungs-Simulator
- [ ] Ertragsanteil-Besteuerung

**Woche 12-13**: VVG-Illustration
- [ ] PDF-Generator
- [ ] Gesetzeskonforme Vorlagen
- [ ] Automatische Befüllung

### Phase 5: Anbieter-Vergleich & Polish (2 Wochen)

**Woche 14**: Multi-Provider
- [ ] Anbieter-Datenbank
- [ ] Vergleichslogik
- [ ] Ranking-System

**Woche 15**: Testing & Launch
- [ ] End-to-End Tests
- [ ] User Acceptance Testing
- [ ] Launch!

---

## Business Impact

### ROI-Kalkulation

**Investition**: ~15 Wochen Entwicklung = ~100.000€

**Return**:
- **Mehr Abschlüsse**: +30% durch bessere Visualisierung
- **Höhere Provisionen**: Versicherungen haben höhere Margen als reine Fonds
- **Zeit-Ersparnis**: 50% weniger Zeit pro Beratung durch Automatisierung
- **Compliance**: Gesetzeskonforme Dokumentation automatisch
- **Wettbewerbsvorteil**: Professionellstes Tool am Markt

**Payback**: 3-6 Monate bei 20 Beratern

---

## Fazit

Mit diesen **10 Erweiterungen** wird aus dem aktuellen Pension Calculator ein **vollwertiges Versicherungs-Verkaufstool**.

**Kernvorteile**:
1. ✅ **Produktvielfalt** - Mehrere Anbieter vergleichbar
2. ✅ **Transparenz** - Alle Kosten und Garantien sichtbar
3. ✅ **Steueroptimierung** - Massive Steuervorteile zeigen
4. ✅ **Absicherung** - Todesfallschutz emotional verkaufen
5. ✅ **Flexibilität** - Einwände behandeln
6. ✅ **Compliance** - Gesetzeskonform
7. ✅ **Professionalität** - Vertrauen schaffen
8. ✅ **Effizienz** - Schnellere Beratung
9. ✅ **Vergleichbarkeit** - Objektive Empfehlung
10. ✅ **Verkaufserfolg** - Höhere Abschlussquote

**Nächster Schritt**: Entscheidung treffen und Phase 1 starten!

---

**Autor**: Versicherungsmanager Perspektive
**Version**: 1.0
**Status**: Bereit zur Umsetzung
**Datum**: 2. November 2025
