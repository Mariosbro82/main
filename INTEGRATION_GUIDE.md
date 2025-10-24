# Integration Guide - Neue Pension Features

## Übersicht der neuen Components

### 1. FlexiblePayoutSimulator
**Datei:** `/src/components/FlexiblePayoutSimulator.tsx`

**Features:**
- Flexible Entnahmephase-Simulation
- Halbeinkünfteverfahren ab 62 Jahren (Toggle)
- Freistellungsauftrag (editierbar, Standard: 1.000€)
- Teilfreistellung 15% auf Erträge
- Graphische Darstellung der Vermögensentwicklung
- Monatliche Netto-Auszahlung nach Steuern

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  portfolioValue: number;
  currentAge: number;
  payoutStartAge: number;
  payoutEndAge: number;
  language?: 'de' | 'en';
}
```

### 2. AllPensionComparison
**Datei:** `/src/components/AllPensionComparison.tsx`

**Features:**
- Dual-Chart System mit Apple-Style Toggle
- Chart 1: Netto-Einkommen + Vista Rente + Gesetzliche Rente
- Chart 2 (nach Toggle): Alle Rentenarten (Gesetzliche, Riester, Private fondgebunden)
- Farb-Overlapping für verschiedene Einkommensströme
- Numerische Zusammenfassung (Tabelle unten)
- Versorgungsquote Berechnung

**Props:**
```typescript
{
  language?: 'de' | 'en';
  currentAge: number;
  netMonthlyIncome: number;
  retirementAge?: number;
  privatePensionMonthly?: number;
}
```

### 3. FundSavingsPlanComparison
**Datei:** `/src/components/FundSavingsPlanComparison.tsx`

**Features:**
- Vergleich Fondsparrplan vs. Private Rentenversicherung (fondgebunden)
- Korrekte Steuerberechnung:
  - Fondsparrplan: 25% Kapitalertragssteuer jährlich auf Vorabpauschale
  - Private Rente: Keine laufende Besteuerung, Steuervorteile
- Beide Darstellungsformen:
  - Flächendiagramm (Area Chart)
  - Liniendiagramm (Line Chart)
- Werte mit 67 und 85 Jahren
- Einstellbar: Rendite, Ausgabeaufschlag, Verwaltungsgebühr

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  monthlyContribution: number;
  currentAge: number;
  retirementAge: number;
  language?: 'de' | 'en';
}
```

---

## Integration in home.tsx

### Schritt 1: Imports hinzufügen

Am Anfang von `home.tsx` nach den anderen Imports:

```typescript
// Neue Pension Components
import { FlexiblePayoutSimulator } from '@/components/FlexiblePayoutSimulator';
import { AllPensionComparison } from '@/components/AllPensionComparison';
import { FundSavingsPlanComparison } from '@/components/FundSavingsPlanComparison';
```

### Schritt 2: State für Modals hinzufügen

Im Home Component nach den anderen useState Definitionen:

```typescript
const [showFlexiblePayout, setShowFlexiblePayout] = useState(false);
const [showAllPensionComparison, setShowAllPensionComparison] = useState(false);
const [showFundComparison, setShowFundComparison] = useState(false);
```

### Schritt 3: Buttons zur "Private Rente" Sektion hinzufügen

Suchen Sie nach dem "Kosten & Steuern" Bereich (ca. Zeile 1285) und fügen Sie nach diesem Bereich einen neuen Button-Bereich hinzu:

```typescript
{/* Neue Features Buttons */}
<section className="animate-slide-in-up mt-8">
  <div className="apple-card p-8">
    <div className="flex items-center space-x-3 mb-6">
      <TrendingUp className="w-6 h-6 text-primary" />
      <h3 className="text-xl font-semibold text-card-foreground tracking-tight">
        {language === 'de' ? 'Erweiterte Analysen' : 'Advanced Analysis'}
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Flexible Entnahmephase */}
      <Button
        onClick={() => setShowFlexiblePayout(true)}
        variant="outline"
        className="h-auto p-6 flex flex-col items-start space-y-2 hover:bg-accent"
      >
        <Calculator className="w-8 h-8 text-primary mb-2" />
        <h4 className="font-semibold text-left">
          {language === 'de' ? 'Flexible Entnahmephase' : 'Flexible Payout Phase'}
        </h4>
        <p className="text-sm text-muted-foreground text-left">
          {language === 'de'
            ? 'Simulieren Sie Ihre Auszahlungsphase mit Steueroptimierung'
            : 'Simulate your payout phase with tax optimization'}
        </p>
      </Button>

      {/* Alle Rentenarten Vergleich */}
      <Button
        onClick={() => setShowAllPensionComparison(true)}
        variant="outline"
        className="h-auto p-6 flex flex-col items-start space-y-2 hover:bg-accent"
      >
        <Shield className="w-8 h-8 text-green-600 mb-2" />
        <h4 className="font-semibold text-left">
          {language === 'de' ? 'Alle Rentenarten' : 'All Pension Types'}
        </h4>
        <p className="text-sm text-muted-foreground text-left">
          {language === 'de'
            ? 'Vergleich aller Altersvorsorge-Optionen'
            : 'Compare all pension options'}
        </p>
      </Button>

      {/* Fondsparrplan Vergleich */}
      <Button
        onClick={() => setShowFundComparison(true)}
        variant="outline"
        className="h-auto p-6 flex flex-col items-start space-y-2 hover:bg-accent"
      >
        <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
        <h4 className="font-semibold text-left">
          {language === 'de' ? 'vs. Fondsparrplan' : 'vs. Fund Savings'}
        </h4>
        <p className="text-sm text-muted-foreground text-left">
          {language === 'de'
            ? 'Vergleich mit Fondsparrplan inkl. Steuern'
            : 'Compare with fund savings plan incl. taxes'}
        </p>
      </Button>
    </div>
  </div>
</section>
```

### Schritt 4: Modal Components am Ende der "Private Rente" Sektion hinzufügen

Kurz vor dem schließenden `</div>` der "Private Rente" Sektion (activeTab === "private-pension"):

```typescript
{/* Neue Modal Components */}
<FlexiblePayoutSimulator
  isOpen={showFlexiblePayout}
  onClose={() => setShowFlexiblePayout(false)}
  portfolioValue={simulationResults?.kpis.projectedValue || 0}
  currentAge={form.getValues('currentAge')}
  payoutStartAge={form.getValues('payoutStartAge')}
  payoutEndAge={form.getValues('payoutEndAge')}
  language={language}
/>

<FundSavingsPlanComparison
  isOpen={showFundComparison}
  onClose={() => setShowFundComparison(false)}
  monthlyContribution={form.getValues('monthlyContribution')}
  currentAge={form.getValues('currentAge')}
  retirementAge={form.getValues('payoutStartAge')}
  language={language}
/>
```

### Schritt 5: AllPensionComparison als neue Tab-Option (optional)

Falls Sie es als separaten Tab hinzufügen möchten, fügen Sie in der Tab-Liste hinzu:

```typescript
{ id: "all-pensions-comparison", label: language === 'de' ? 'Alle Rentenarten' : 'All Pensions' }
```

Und dann den Tab Content:

```typescript
{activeTab === "all-pensions-comparison" && (
  <FadeIn delay={0.3}>
    <div className="max-w-7xl mx-auto px-6 py-8">
      <AllPensionComparison
        language={language}
        currentAge={form.getValues('currentAge')}
        netMonthlyIncome={data.income?.netMonthly || 3000}
        retirementAge={form.getValues('payoutStartAge')}
        privatePensionMonthly={simulationResults?.kpis.monthlyPension || 0}
      />
    </div>
  </FadeIn>
)}
```

---

## Steuer-Einstellungen in Kosten & Steuern Bereich

Fügen Sie nach dem bestehenden "Steuersatz Auszahlung" Feld zwei neue Optionen hinzu:

```typescript
{/* Freistellungsauftrag */}
<div className="space-y-3 p-4 bg-accent/30 rounded-xl hover:bg-accent/40 transition-colors">
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground font-medium">
      {language === 'de' ? 'Freistellungsauftrag' : 'Tax Allowance'}
    </span>
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={() => setShowCostSettings(true)}
    >
      <Settings className="w-3 h-3" />
    </Button>
  </div>
  {showCostSettings ? (
    <Input
      type="number"
      step="100"
      value={taxAllowance}
      onChange={(e) => setTaxAllowance(Number(e.target.value))}
      className="text-lg font-bold h-10 text-center"
      placeholder="1000"
    />
  ) : (
    <div className="text-xl font-bold text-foreground">{taxAllowance}€</div>
  )}
  <p className="text-xs text-muted-foreground">
    {language === 'de' ? 'Standard: 1.000€ (Single) / 2.000€ (Verheiratet)' : 'Default: €1,000 (Single) / €2,000 (Married)'}
  </p>
</div>

{/* Halbeinkünfteverfahren ab 62 */}
<div className="space-y-3 p-4 bg-accent/30 rounded-xl hover:bg-accent/40 transition-colors">
  <span className="text-sm text-muted-foreground font-medium">
    {language === 'de' ? 'Halbeinkünfteverfahren ab 62' : 'Half-Income Taxation from 62'}
  </span>
  <div className="flex items-center space-x-2">
    <Switch
      checked={useHalfIncomeTaxation}
      onCheckedChange={setUseHalfIncomeTaxation}
    />
    <span className="text-sm">
      {useHalfIncomeTaxation ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Inaktiv' : 'Inactive')}
    </span>
  </div>
  <p className="text-xs text-muted-foreground">
    {language === 'de' ? 'Nur 50% der Einkünfte sind steuerpflichtig' : 'Only 50% of income is taxable'}
  </p>
</div>

{/* Teilfreistellung Info */}
<div className="col-span-full p-4 bg-blue-50 border border-blue-200 rounded-xl">
  <div className="flex items-start space-x-3">
    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
    <div>
      <h4 className="text-sm font-semibold text-blue-900 mb-1">
        {language === 'de' ? 'Teilfreistellung 15%' : 'Partial Exemption 15%'}
      </h4>
      <p className="text-xs text-blue-800">
        {language === 'de'
          ? 'Bei fondsgebundenen Versicherungen werden 15% der Erträge von der Steuer freigestellt'
          : '15% of gains from fund-based insurance products are tax-exempt'}
      </p>
      {simulationResults && (
        <p className="text-xs text-blue-900 font-medium mt-2">
          {language === 'de' ? 'Nach Steuern bei Entnahmebeginn: ' : 'After tax at payout start: '}
          <span className="font-bold">{formatCurrency(simulationResults.kpis.monthlyPension * 0.85)}/Monat</span>
        </p>
      )}
    </div>
  </div>
</div>
```

### State für neue Tax-Einstellungen hinzufügen:

```typescript
const [taxAllowance, setTaxAllowance] = useState(1000);
const [useHalfIncomeTaxation, setUseHalfIncomeTaxation] = useState(false);
```

---

## Verwendete Steuer-Berechnungen

Alle neuen Components nutzen die erweiterten Steuerfunktionen aus `/src/utils/germanTaxCalculations.ts`:

- `applyHalfIncomeTaxation()` - Halbeinkünfteverfahren ab 62
- `applyPartialExemption()` - Teilfreistellung 15%
- `calculatePayoutTax()` - Komplette Steuerberechnung inkl. Freistellungsauftrag
- `calculateMonthlyPayoutAfterTax()` - Monatliche Netto-Auszahlung

---

## Testing

Nach Integration testen Sie:

1. **Flexible Entnahmephase Simulator:**
   - Öffnen Sie Modal über Button
   - Ändern Sie jährlichen Entnahmebetrag
   - Aktivieren Sie Halbeinkünfteverfahren (Toggle)
   - Ändern Sie Freistellungsauftrag über Settings
   - Prüfen Sie Chart und Tabelle

2. **Alle Rentenarten Vergleich:**
   - Prüfen Sie Initial-Chart (Netto + Vista + Gesetzliche)
   - Klicken Sie auf Apple-Toggle (Grau → Grün)
   - Chart sollte zu allen Rentenarten wechseln
   - Prüfen Sie numerische Zusammenfassung

3. **Fondsparrplan Vergleich:**
   - Öffnen Sie Modal
   - Ändern Sie Parameter über Settings
   - Wechseln Sie zwischen Area und Line Chart
   - Prüfen Sie Steuerdifferenz (Vorabpauschale bei Fond vs. keine laufende Steuer bei Versicherung)

---

## Wichtige Hinweise

1. **Onboarding Store:** Die Components greifen auf den Onboarding Store zu für gesetzliche Rente, Riester, etc.
2. **Reactive Updates:** Alle Components reagieren auf Änderungen in den Props
3. **Responsive Design:** Alle Components sind responsive (Mobile, Tablet, Desktop)
4. **Accessibility:** Apple-Style Toggle ist keyboard-accessible
5. **i18n Ready:** Alle Texte sind in DE/EN verfügbar

---

## Dependencies Check

Stellen Sie sicher, dass folgende Components/Utilities vorhanden sind:

- ✅ `/src/components/ui/dialog.tsx`
- ✅ `/src/components/ui/switch.tsx`
- ✅ `/src/components/ui/card.tsx`
- ✅ `/src/components/ui/button.tsx`
- ✅ `/src/components/ui/input.tsx`
- ✅ `/src/components/ui/label.tsx`
- ✅ `/src/components/ui/tabs.tsx`
- ✅ `/src/utils/germanTaxCalculations.ts`
- ✅ `/src/stores/onboardingStore.ts`
- ✅ `recharts` library

Alle Dependencies sind bereits vorhanden!
