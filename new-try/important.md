# Neue Rentenplattform – Verbindlicher Anforderungskatalog

Dieses Dokument ist die einzige gültige Referenz für den Funktionsumfang der neuen Renten- und Investmentanalyse. Alle Implementierungs- und Testentscheidungen müssen sich an den folgenden Punkten orientieren.

## 1. Zielbild & Nutzer:innen
- Finanz-Coaches in Deutschland, die Mandant:innen zwischen 30 und 65 beraten.
- Kernfrage: „Wie sieht meine Einkommens- und Liquiditätssituation vom heutigen Tag bis Lebensende aus?“
- Fokus auf Transparenz für Vorsorgeprodukte (gesetzliche Rente, betriebliche/Private Vorsorge, Fonds, Immobilien).

## 2. Must-have Funktionalitäten
### 2.1 Single-Page Onboarding (iPhone-Setup-Anmutung)
- Eine Seite, alle Eingaben sichtbar.
- Pflichtfelder: Geburtsjahr, Familienstand (`ledig`/`verheiratet`), Anzahl Kinder, Bruttojahreseinkommen.
- Weitere Felder: erwartete gesetzliche Rente (monatlich), Vista-Rente (monatlich), Lebensversicherung (monatlich), Fonds-Sparplan (monatlich), Immobilien-Hypothek (Checkbox + Restschuld + Monatsrate).
- Auto-Save mit 500 ms Debounce in den Zustandsspeicher (Zustand + LocalStorage).
- Validierung: Geburtsjahr 1940–2010, Bruttoeinkommen > 0, Familienstand gesetzt; Fehleranzeigen in deutscher Sprache.
- CTA unten: „Analyse starten“; löst `completeOnboarding()` aus und führt zur Vergleichsseite.

### 2.2 Vergleichs- & Analysebereich
- Zwei Ansichten per Apple-Style Toggle (grau → grün beim Aktivieren).
  1. **Basisansicht**: Nettoerwerbseinkommen bis Rente + gesetzliche Rente + Vista-Rente.
  2. **Detailansicht**: Alle Einnahmequellen (gesetzlich, Vista, Lebensversicherung, Fondsentnahmen) gestapelt.
- Diagrammtyp: responsive AreaCharts (Recharts) mit Jahr/Alter auf der X-Achse (60–90 Jahre). Tooltip & Legende auf Deutsch, Beträge in `de-DE`-Format mit €.
- Separates Diagramm als LineChart für Fonds-Endwerte unter Berücksichtigung der eingestellten Rendite und Kosten.
- Drei Aktionskarten oben: Steuereinstellungen (Freistellungsauftrag), Entnahmerechner, Fondseinstellungen – jeweils mit Modal.

### 2.3 Steuerlogik
- **Halbeinkünfteverfahren**: ab Alter 62 wird nur 50 % der Renteneinkünfte besteuert (vereinfachter Steuersatz 25 %).
- **Freistellungsauftrag**: default 1 000 € bei „ledig“, 2 000 € bei „verheiratet“; Modal erlaubt Anpassung (Eingabefeld, Validierung ≥ 0).
- **Kapitalertragsteuer**: 25 % Abgeltungssteuer auf Kapitalerträge nach Abzug des Freistellungsauftrags.
- Steuertexte und Tooltips vollständig auf Deutsch, inkl. Kurzbeschreibung der Regel.

### 2.4 Entnahmerechner
- Modal mit Input für jährliche Entnahme aus dem Fondsvermögen (Standardwert 0 €).
- Sofortige Berechnung: monatlicher Nettobetrag, jährlicher Nettobetrag, abgeführte Steuer pro Jahr.
- Darstellung in farbcodierten Cards (Blau = monatlich, Grün = jährlich, Rot = Steuer).
- Info-Box (gelb) erklärt 15 % Teilfreistellung für Aktienfonds und verweist auf Freistellungsauftrag.

### 2.5 Fondseinstellungen
- Modal mit drei Reglern/Eingaben: erwartete Rendite (% p.a.), Ausgabeaufschlag (%), laufende Verwaltungskosten (% p.a.).
- Änderungen wirken unmittelbar auf Diagramme und Entnahmerechner.
- Standardwerte: Rendite 5 %, Ausgabeaufschlag 5 %, Verwaltungskosten 1,5 %.
- Einstellungen persistent im Zustandsspeicher.

## 3. UX & Styling Leitplanken
- Vite + React + TypeScript + Tailwind CSS.
- Schrift: Inter; Farbpalette laut Design Tokens: Primär Blau (`hsl(217,91%,60%)`), Indigo (`243,75%,59%`), Grün (`142,76%,45%`), Orange (`32,95%,44%`), Rot (`0,84%,60%`).
- Komponenten mit sanften Schatten, Radius 0,5–1 rem, Animationen (Framer Motion) 200–300 ms.
- Alle Texte, Buttons, Tooltips und Fehlermeldungen ausschließlich deutschsprachig.

## 4. Datenhaltung & Architektur
- State-Management: Zustand 4.x mit `persist` Middleware (`localStorage` Key: `pension-store`).
- Typisierung: strikte TypeScript-Interfaces (`PensionData`).
- `OnboardingQuestionsPage` → `pensionStore` → `ComparisonPage` (einziger Datenfluss).
- Keine Backend- oder API-Abhängigkeiten; reine Client-App.

## 5. Ausschlüsse (Nice-to-have, aber nicht Teil dieses Scopes)
- Kein Rürup-/Basisrenten-Produkt.
- Keine PDF- oder CSV-Exporte.
- Keine Mehrszenario-Vergleiche; nur ein Datensatz gleichzeitig.
- Keine progressive Einkommensteuer, Kirchensteuer oder Solidaritätszuschlag (vereinfachte Sätze zulässig).
- Keine automatischen Marktdaten (z. B. Basiszins Vorabpauschale) – manuelle Eingabe in zukünftiger Phase.

## 6. Qualitätskriterien & Abnahme
- Pages: `OnboardingQuestionsPage.tsx`, `ComparisonPage.tsx`.
- Stores & Services: `stores/pensionStore.ts`, `services/onboardingStorage.ts` (legacy) nur falls benötigt.
- Charts/Steuerberechnungen müssen reaktiv auf Eingaben reagieren (keine manuellen Refreshes).
- Responsives Layout (Desktop primär, Tablet funktional).
- Lighthouse Zielwerte: Performance ≥ 75, Accessibility ≥ 90, Best Practices ≥ 90.
- QA prüft anhand dieses Dokuments; Abnahme erfolgt nur, wenn alle Must-haves umgesetzt sind und keine No-Gos verletzt werden.

## 7. Offene Themen für Phase 2
- Vorabpauschale nach § 18 InvStG über kompletten Zeithorizont simulieren.
- Inflationsanpassung (heutige vs. reale Euro).
- Szenarioduplikation (A/B-Vergleich).
- Exportfunktionen (PDF, CSV) und Mandantenfreigaben.
- Automatische Aktualisierung des Basiszinses via BMF-API.

_Stand: 29. Januar 2025 · Verantwortlich: Produktteam Rentenplattform_
