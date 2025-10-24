# Government Data Inputs Needed

This project hard-codes several German tax and pension parameters.  
To keep the calculators accurate we should replace these literals with data pulled from official sources (Bundesfinanzministerium, Deutsche Rentenversicherung, Bundesanzeiger, etc.). The list below documents every value that needs to be fetched or refreshed regularly.

## Income & Income-Tax Parameters

| Data item | Where it is used | Current value(s) | Required source | Refresh cadence | Notes |
| --- | --- | --- | --- | --- | --- |
| Grundfreibetrag, Steuerstufen und Tarife des §32a EStG | Future income tax comparisons (planned) | Not modelled | BMF Einkommensteuertabellen | Jährlich | Needed for net ↔ brutto checks and progression effects. |
| Solidaritätszuschlag-Schwellen und Satz | `germanTaxCalculations.ts` (implicit 5.5 % on top of 25 %) | Hard-coded 5.5 % | BMF | Bei Gesetzesänderungen | Should depend on taxable amount thresholds. |
| Kirchensteuersätze je Bundesland (8 %/9 %) | `DEFAULT_TAX_SETTINGS` | Default `hasChurchTax: false`, `churchTaxRate: 8` | Länderfinanzbehörden | Bei Änderung | UI needs dropdown + dataset for federal differences. |
| Arbeitgeber-/Arbeitnehmeranteile zur Sozialversicherung | Not yet modelled | Missing | Bundesanzeiger (Sozialversicherungs-Rechengrößenverordnung) | Jährlich | Required if we add gross-net conversions or payroll comparisons. |

## Retirement Savings & Pension Taxation

| Data item | Where it is used | Current value(s) | Required source | Refresh cadence | Notes |
| --- | --- | --- | --- | --- | --- |
| Basisrente (Rürup) Maximalbetrag & abzugsfähiger Prozentsatz | `TaxCalculator.tsx` (`maxRuerupContribution = 27 566`, `deductiblePercentage = 0.96`) | Hard-coded 2024 figures | BMF Bekanntmachung „Höchstbetrag für Altersvorsorgeaufwendungen“ | Jährlich | Needs planned rise to 100 % ab 2025. |
| Besteuerungsanteil Tabelle (Rentenbeginnjahr → % steuerpflichtig) | `TaxCalculator.tsx` (`taxablePortionRate = 0.83`) & `calculatePension.ts` comments | Single 83 % constant | §22 Nr.1 EStG / DRV Tabelle | Jährlich | Provide table 2020–2040 to calculate only once based on retirement year. |
| Ertragsanteil Tabelle (Alter bei Rentenbeginn) | `germanTaxCalculations.ts:getErtragsanteil()` (partial lookup) | Simplified if/else for ages ≥60 | Anlage 9 EStG | Bei Gesetzesänderung | Replace with full official table. |
| Beitragsbemessungsgrenzen & Höchstbeträge für bAV (§3 Nr.63 EStG) | `RetirementStep.tsx` tooltip (584 €/Monat) | Hard-coded 2024 monthly cap | Sozialversicherungs-Rechengrößenverordnung | Jährlich | Should feed validation + copy. |
| Aktueller Rentenwert (West/Ost), Zugangsfaktor, Rentenartfaktor | Not modelled | Missing | Deutsche Rentenversicherung | Halbjährlich | Needed if we simulate statutory pension accrual from earnings. |
| Nachhaltigkeitsfaktor & Rentenanpassungssatz | Not modelled | Missing | Deutsche Rentenversicherung | Jährlich | Important for projections. |

## Capital Gains & Investment Taxation

| Data item | Where it is used | Current value(s) | Required source | Refresh cadence | Notes |
| --- | --- | --- | --- | --- | --- |
| Basiszins für Vorabpauschale (§18 InvStG) | `TaxCalculator.tsx: basiszins = 0.01/0.02`, `FundSavingsPlanComparison.tsx` | Hard-coded 1 % or 2 % | Bundesanzeiger (BMF Bekanntmachung) | Jährlich | Needs automatic fetch each January. |
| Teilfreistellungs-Sätze (15 %, 30 %, 60 %) | `DEFAULT_TAX_SETTINGS.partialExemption` | Fixed 15 % | §20 Abs.3 InvStG | Bei Gesetzesänderung | Should vary by fund type (equity, Immobilien, Misch). |
| Sparer-Pauschbetrag | `DEFAULT_TAX_SETTINGS.allowance = 1 000` | Fixed 1 000 € | §20 Abs.9 EStG | Bei Gesetzesänderung | Also require 2 000 € for Ehegatten / `calcScope`. |
| Kapitalertragsteuer + Solidaritätszuschlag + KiSt | `getEffectiveTaxRate()` | 25 % + 5.5 % | BMF | Bei Änderung | Should combine from separate datasets rather than single literal. |
| Vorabpauschale Freibetragsverrechnung | `calculateFundTax()` | Simplified (no tracking across funds) | BMF FAQ/Beispiele | Bei Änderung | Need official rule set for multiple funds & partial allowance usage. |

## Demographic & Economic Assumptions

| Data item | Where it is used | Current value(s) | Required source | Refresh cadence | Notes |
| --- | --- | --- | --- | --- | --- |
| Lebenserwartung / Sterbetafeln | Not yet modelled | Missing | Statistisches Bundesamt („Sterbetafel“), DAV | Alle 2 Jahre | Would improve payout-phase modelling and annuity factors. |
| Inflationsrate / Rentenanpassung | Not yet modelled | Missing | Destatis, Deutsche Rentenversicherung | Jährlich | Needed for real-value reporting. |
| Lohnsteigerungs- und Beitragsentwicklung | Not yet modelled | Missing | Destatis / Bundesbank | Jährlich | Drives future contribution projections. |

## Deployment & Compliance References

| Data item | Where referenced | Current status | Source needed | Notes |
| --- | --- | --- | --- | --- |
| Datenschutzhinweise (Rechtstexte) | `src/pages/datenschutz.tsx`, `CookieBanner` | Placeholder addresses & text | Bundesregierung / Mustertexte (z.B. BMWK) | Replace with actual company policy once real data use defined. |
| Impressum Angaben | `src/pages/impressum.tsx` | Placeholder | Handelsregisterauszug | Update when real entity identified. |

## Next Steps

1. **Create a data ingestion layer** that loads these parameters from JSON fetched during build (or bundled via CMS) instead of in-code constants.  
2. **Automate annual updates**: set reminders around German fiscal year (Jan/Jul) to refresh tax, pension, and social-security values.  
3. **Document assumptions** alongside each dataset to keep auditors and partners informed.  
4. **Add unit tests** that fail when dataset years are stale (e.g. assert the „Steuerjahr“ matches the current calendar year).  

Once these datasets are in place we can unlock more accurate calculators and avoid manual re-deployments whenever government figures change.
