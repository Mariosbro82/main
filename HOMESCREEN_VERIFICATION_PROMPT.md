# Homescreen Verification Prompt

## Overview
Verify the homescreen (route `/`) meets all quality standards for production deployment.

---

## A & C. No Placeholders Check

Scan the entire homescreen and confirm **ZERO instances** of:

### Text Placeholders
- ❌ "Lorem ipsum", "Placeholder", "[Insert X]", "TODO", "Example text"
- ❌ Hardcoded dummy data: "John Doe", "123 Main St", "example@email.com"
- ❌ Development artifacts: "Test", "Sample", "Demo"

### Rendering Errors
- ❌ "undefined", "null", "NaN" visible in UI
- ❌ "0" or "0€" where real calculated values should appear
- ❌ Empty brackets/braces: `[]`, `{}`, `{{}}` visible on screen

### Translation Issues
- ❌ Translation keys rendered instead of text (e.g., "dashboard.title")
- ❌ Missing German translations showing English fallbacks unexpectedly

---

## B. Onboarding Data Accuracy Check

Cross-reference **ALL displayed data** against onboarding inputs:

### Personal Information
- ✅ Current age matches onboarding response
- ✅ Retirement age matches onboarding selection
- ✅ Name/greeting uses actual user name from onboarding (if collected)
- ✅ Occupation/employment status reflects onboarding choices

### Financial Data
- ✅ Monthly contributions display exact values entered in onboarding
- ✅ Starting capital/current savings match onboarding input
- ✅ Target retirement amounts align with onboarding goals
- ✅ Expected monthly pension calculations use onboarding parameters

### Timeline & Calculations
- ✅ Years until retirement computed correctly from onboarding age data
- ✅ Investment period reflects difference between current age and retirement age
- ✅ Contribution totals calculated from monthly amount × months until retirement

### Investment Strategy
- ✅ Risk profile/investment recommendations match stated risk tolerance from onboarding
- ✅ Asset allocation percentages align with selected risk level
- ✅ Return rate assumptions match risk profile chosen in onboarding

### Empty State Handling
- ✅ If onboarding **NOT completed**: Show proper German CTA message
  - "Bitte schließen Sie das Onboarding ab, um personalisierte Auswertungen zu sehen."
  - "Onboarding starten" button visible and functional
- ✅ If onboarding **IS completed**: Show personalized data (NOT generic defaults)

---

## D. Visual Quality & Polish Check

Assess overall design and user experience:

### Layout & Spacing
- ✅ Clean spacing between elements (no cramped or excessive gaps)
- ✅ Aligned components (cards, buttons, text properly aligned)
- ✅ No overlapping elements or content cutoff
- ✅ Consistent padding/margins throughout

### Typography
- ✅ Consistent font family across all text
- ✅ Proper hierarchy: clear distinction between headings, body text, captions
- ✅ Readable font sizes (minimum 14px for body text)
- ✅ Appropriate line height for readability

### Colors & Contrast
- ✅ Cohesive color scheme matching brand identity
- ✅ Sufficient contrast ratio for text (WCAG AA compliance: 4.5:1 minimum)
- ✅ Consistent use of primary, secondary, accent colors
- ✅ Proper use of muted/foreground colors for hierarchy

### Icons & Graphics
- ✅ All icons render correctly (no broken icon references)
- ✅ Icons appropriately sized and colored
- ✅ Icons semantically match their associated content
- ✅ SVG icons crisp at all screen sizes

### Charts & Data Visualization
- ✅ Charts render smoothly without flicker
- ✅ Proper legends with readable labels
- ✅ Axis labels clearly visible and formatted
- ✅ Tooltips display on hover with correct data
- ✅ Color coding consistent and meaningful

### Responsiveness
Test at multiple breakpoints:
- ✅ **Mobile (375px)**: Single column layout, readable text, no horizontal scroll
- ✅ **Tablet (768px)**: Appropriate grid layout, comfortable spacing
- ✅ **Desktop (1440px)**: Optimal use of space, not overly stretched

### Animations & Transitions
- ✅ Smooth fade-in/slide-in animations on page load
- ✅ No janky animations or stuttering
- ✅ No layout shift/content jump during load
- ✅ Hover states provide clear visual feedback
- ✅ Animations enhance UX (not distracting or excessive)

### Loading States
- ✅ Proper loading indicators while data fetches
- ✅ No flash of empty content before data loads
- ✅ Loading spinners centered and appropriate size
- ✅ No "Loading..." text stuck on screen after load completes

### Empty States
- ✅ Well-designed empty state cards with meaningful messages
- ✅ Clear call-to-action buttons when no data available
- ✅ Helpful guidance text explaining next steps
- ✅ Appropriate icons/illustrations for empty states

### Accessibility
- ✅ Semantic HTML elements used correctly
- ✅ Keyboard navigation works (Tab, Enter, Escape)
- ✅ Focus indicators visible on interactive elements
- ✅ Screen reader friendly (proper ARIA labels)
- ✅ Sufficient color contrast for all text

---

## Additional Verification Steps

### 1. Developer Console Check
Open browser DevTools Console and confirm:
- ✅ **Zero errors** (no red messages)
- ✅ **Zero warnings** related to React, rendering, or data fetching
- ✅ No deprecation notices for production code

### 2. Network Tab Check
Open browser DevTools Network tab and verify:
- ✅ All API requests succeed (status 200)
- ✅ No 404 errors (missing resources)
- ✅ No 500 errors (server failures)
- ✅ Reasonable load times for all requests

### 3. Quick Actions Functionality
Test all three Quick Action cards:
- ✅ "Private Rente berechnen" navigates to `/calculator`
- ✅ "Optionen vergleichen" navigates to `/calculator`
- ✅ "Alle Rentenarten ansehen" navigates to `/calculator`
- ✅ Hover states work on all cards
- ✅ Click/tap interaction provides feedback

### 4. Metric Cards Formatting
Verify all metric cards format values correctly:
- ✅ Currency values show Euro symbol: `€` (e.g., "45.000 €")
- ✅ Percentages show percent symbol: `%` (e.g., "7,5 %")
- ✅ Ages display as whole numbers with context (e.g., "67 Jahre")
- ✅ Large numbers use proper thousand separators (e.g., "1.250.000 €")
- ✅ No scientific notation (e.g., NOT "1.5e6")

### 5. Personalized Greeting
If user name available from onboarding:
- ✅ Greeting displays user's name correctly
- ✅ Proper German grammar (e.g., "Hallo, [Name]!")
- ✅ No awkward spacing or punctuation

---

## Pass Criteria Summary

The homescreen passes verification if **ALL** of the following are true:

### ✅ No Placeholders
- Zero placeholder text anywhere on screen
- No dummy data, lorem ipsum, or development artifacts
- No rendering errors (undefined, null, NaN visible)

### ✅ Accurate to Onboarding
- All displayed data accurately reflects onboarding inputs
- Calculations use parameters from onboarding (not generic defaults)
- Empty state shows when onboarding incomplete

### ✅ Visual Quality
- Professional, polished appearance with cohesive design
- Responsive across mobile, tablet, and desktop
- Smooth animations and proper loading states
- Accessible and keyboard-navigable

### ✅ Technical Health
- Zero console errors or warnings
- All network requests succeed
- Links navigate correctly
- Values formatted properly with currency/percentage symbols

---

## Test Execution

1. **Navigate to** `http://localhost:5173/` (or production URL)
2. **Open DevTools** (F12 or Cmd+Opt+I)
3. **Execute checks** in order: Placeholders → Data Accuracy → Visual Quality → Technical
4. **Document failures** with screenshots and specific descriptions
5. **Retest after fixes** until all criteria pass

---

## Expected Behavior Scenarios

### Scenario 1: Onboarding NOT Completed
**Expected:**
- Empty state card displayed
- German message: "Bitte schließen Sie das Onboarding ab, um personalisierte Auswertungen zu sehen."
- "Onboarding starten" button present and clickable
- Quick Actions section visible with three cards
- NO personalized data or metric cards shown

### Scenario 2: Onboarding Completed
**Expected:**
- Personalized greeting (if name collected)
- 4-6 metric cards showing:
  - Current savings/capital
  - Monthly contributions
  - Expected retirement value
  - Years until retirement
  - Projected monthly pension
  - Coverage gap (optional)
- Charts displaying growth projections with real data
- Quick Actions section with three cards
- All values calculated from onboarding inputs

---

**Version:** 1.0
**Last Updated:** 2025-10-24
**Purpose:** Production homescreen quality assurance
