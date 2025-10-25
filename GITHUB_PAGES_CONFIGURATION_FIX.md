# GitHub Pages Configuration Fix - README.md Override Issue

**Date:** 2025-10-25
**Issue:** GitHub Pages is displaying README.md instead of the built React app
**Root Cause:** GitHub Pages settings misconfiguration

---

## The Problem

When you visit https://mariosbro82.github.io/app/, you see:
- ❌ "React + TypeScript + Vite" (README.md rendered as HTML)
- ✅ Should see: "Vista Pension Calculator" (the actual app)

This happens because GitHub Pages is configured incorrectly.

---

## Solution: Fix GitHub Pages Settings

### Step 1: Go to Repository Settings

1. Open your browser and go to:
   ```
   https://github.com/Mariosbro82/app/settings/pages
   ```

2. Or navigate manually:
   - Go to https://github.com/Mariosbro82/app
   - Click "Settings" tab (top right)
   - Click "Pages" in left sidebar

### Step 2: Check Current Configuration

Look for the "Build and deployment" section. You'll see:

**Source:** Should say "GitHub Actions"

If it says anything else (like "Deploy from a branch" or "gh-pages branch"), that's the problem!

### Step 3: Fix the Configuration

**If Source is set to "Deploy from a branch":**
1. Click the dropdown under "Source"
2. Select "**GitHub Actions**"
3. Save (GitHub saves automatically)

**Current Incorrect Setup:**
```
Source: Deploy from a branch
Branch: main / (root)  ← This serves README.md
```

**Correct Setup:**
```
Source: GitHub Actions  ← This uses our workflow
```

### Step 4: Wait for Redeployment

After changing to "GitHub Actions":
1. GitHub will automatically trigger a new deployment
2. Wait 2-3 minutes
3. Visit https://mariosbro82.github.io/app/
4. You should see the pension calculator!

---

## Alternative: If You Can't Access Settings

If you don't have access to repository settings, ask the repository owner to:

1. Go to https://github.com/Mariosbro82/app/settings/pages
2. Under "Source", select "**GitHub Actions**"
3. Save and wait for deployment

---

## How to Verify It's Fixed

### Test 1: Check the Title
```bash
curl -s https://mariosbro82.github.io/app/ | grep "<title>"

# Should show:
<title>Vista Pension Calculator - Professioneller Rentenrechner für Ihre Altersvorsorge</title>

# NOT:
<title>React + TypeScript + Vite</title>
```

### Test 2: Check in Browser
1. Visit https://mariosbro82.github.io/app/
2. You should see the onboarding screen or dashboard
3. NOT the README.md content

### Test 3: Check Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Should be clean (no red errors about missing files)

---

## Why This Happened

**The Workflow is Correct:**
- ✅ `.github/workflows/deploy.yml` properly builds and deploys `./dist`
- ✅ The workflow uses `actions/upload-pages-artifact@v3`
- ✅ The workflow deploys with `actions/deploy-pages@v4`

**But GitHub Pages Settings Override This:**
- ❌ If Pages is set to "Deploy from a branch"
- ❌ GitHub ignores the workflow
- ❌ Instead serves files from repository root
- ❌ README.md gets rendered as index page

**The Fix:**
- ✅ Set Pages source to "GitHub Actions"
- ✅ GitHub now uses our workflow
- ✅ Deploys `./dist` folder correctly
- ✅ Serves `dist/index.html` as homepage

---

## Technical Details

### What GitHub Pages Needs

GitHub Pages requires these settings to work with GitHub Actions:

1. **Workflow File:** ✅ We have `.github/workflows/deploy.yml`
2. **Permissions:** ✅ Workflow has `pages: write` permission
3. **Environment:** ✅ Workflow targets `github-pages` environment
4. **Settings:** ❌ **MUST be set to "GitHub Actions" source**

### Current Workflow (Correct)

```yaml
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'  # ← Uploads only dist folder

- name: Deploy to GitHub Pages
  uses: actions/deploy-pages@v4  # ← Deploys to Pages
```

This is **100% correct**. The only issue is the Pages settings.

---

## Screenshots Guide

### What You'll See (Incorrect)

When you go to Settings → Pages, if you see:

```
┌─────────────────────────────────────┐
│ Build and deployment                │
├─────────────────────────────────────┤
│ Source                              │
│ ┌─────────────────────────────────┐ │
│ │ Deploy from a branch         ▼ │ │  ← WRONG!
│ └─────────────────────────────────┘ │
│                                     │
│ Branch                              │
│ ┌──────┐ ┌──────┐                  │
│ │ main▼│ │ root▼│                  │
│ └──────┘ └──────┘                  │
└─────────────────────────────────────┘
```

### What It Should Be (Correct)

```
┌─────────────────────────────────────┐
│ Build and deployment                │
├─────────────────────────────────────┤
│ Source                              │
│ ┌─────────────────────────────────┐ │
│ │ GitHub Actions              ▼ │ │  ← CORRECT!
│ └─────────────────────────────────┘ │
│                                     │
│ No branch selection needed          │
│ (GitHub Actions handles deployment) │
└─────────────────────────────────────┘
```

---

## After Fixing

Once you change to "GitHub Actions", you'll see:

1. **Actions Tab** - New workflow run starts automatically
2. **Workflow Status** - "Deploy React App to GitHub Pages" shows running
3. **Deployment** - After 2-3 minutes, shows green checkmark
4. **Site** - https://mariosbro82.github.io/app/ shows pension calculator

---

## Troubleshooting

### "I changed the setting but still see README"

1. **Wait 5 minutes** - Deployment takes time
2. **Hard refresh** - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Clear cache** - F12 → Application → Clear Storage
4. **Try incognito** - Open private/incognito window

### "I don't see 'GitHub Actions' option"

This means:
- Repository might not have the workflow file
- Or workflow file is not in `main` branch
- Or you don't have permission to change Pages settings

**Solution:** Ask repository owner to:
1. Verify `.github/workflows/deploy.yml` exists in `main` branch
2. Enable GitHub Actions in Settings → Actions → General
3. Change Pages source to "GitHub Actions"

### "Workflow runs but site still shows README"

Check if workflow succeeded:
1. Go to https://github.com/Mariosbro82/app/actions
2. Click latest "Deploy React App to GitHub Pages" run
3. Look for red X or yellow warning
4. If failed, click to see error logs

---

## Summary

| Issue | Status |
|-------|--------|
| Code is fixed | ✅ Complete |
| Workflow is correct | ✅ Complete |
| Build succeeds locally | ✅ Complete |
| **Pages Settings** | ❌ **NEEDS FIX** |

**Action Required:** Change GitHub Pages source from "Deploy from a branch" to "**GitHub Actions**"

**Where:** https://github.com/Mariosbro82/app/settings/pages

**Time:** 2 minutes to change + 3 minutes for deployment = **5 minutes total**

---

## Quick Fix Checklist

- [ ] Go to https://github.com/Mariosbro82/app/settings/pages
- [ ] Under "Source", select "GitHub Actions"
- [ ] Wait 3 minutes for deployment
- [ ] Visit https://mariosbro82.github.io/app/
- [ ] See pension calculator (not README)
- [ ] Clear browser cache if needed

---

**Prepared by:** Claude Code AI Assistant
**Issue:** GitHub Pages serving README.md instead of built app
**Root Cause:** Pages source set to "Deploy from a branch" instead of "GitHub Actions"
**Fix:** Change Pages source to "GitHub Actions" in repository settings
**ETA:** 5 minutes after fixing settings
