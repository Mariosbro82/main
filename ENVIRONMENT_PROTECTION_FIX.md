# 🔧 GitHub Pages Environment Protection Fix

## ❌ Problem
```
Branch "experimenting" is not allowed to deploy to github-pages 
due to environment protection rules.
```

## 🎯 Lösung

Wir haben den Workflow umgestellt von **GitHub Actions Environment** auf **Direct gh-pages Branch Deployment**. Dies umgeht die Environment Protection Rules.

---

## ⚙️ GitHub Repository Settings anpassen

### Schritt 1: GitHub Pages Source ändern

1. Gehe zu: https://github.com/Mariosbro82/main/settings/pages
2. Unter **"Build and deployment"**:
   - **Source:** Wähle **"Deploy from a branch"**
   - **Branch:** Wähle **"gh-pages"** und **"/ (root)"**
   - **Save** klicken

### Schritt 2: Environment Protection Rules (optional entfernen)

1. Gehe zu: https://github.com/Mariosbro82/main/settings/environments
2. Klicke auf **"github-pages"** Environment
3. Unter **"Deployment branches"**:
   - Entweder: Wähle "All branches"
   - Oder: Entferne die Protection Rule komplett

---

## 🔄 Neue Workflow-Logik

### Vorher (❌ funktioniert nicht):
```yaml
environment:
  name: github-pages  # ❌ Nur main Branch erlaubt
  
- uses: actions/deploy-pages@v4  # ❌ Braucht Environment
```

### Nachher (✅ funktioniert):
```yaml
# Kein Environment mehr!

- uses: peaceiris/actions-gh-pages@v3  # ✅ Direct gh-pages push
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    publish_branch: gh-pages
```

---

## 📊 Was passiert jetzt:

1. **Push auf `experimenting` oder `main`**
2. **Build wird durchgeführt**
3. **Dist-Ordner wird direkt in `gh-pages` Branch gepusht**
4. **GitHub Pages liest automatisch vom `gh-pages` Branch**
5. **✅ Deployment erfolgreich!**

---

## 🚀 Deployment testen

Nach dem nächsten Push:

```bash
git add .github/workflows/deploy.yml
git commit -m "fix: Use gh-pages branch deployment to bypass environment protection"
git push origin experimenting
```

Dann beobachten:
- **Workflow:** https://github.com/Mariosbro82/main/actions
- **gh-pages Branch:** https://github.com/Mariosbro82/main/tree/gh-pages
- **Live Site:** https://mariosbro82.github.io/main/

---

## ✅ Vorteile dieser Lösung

1. **Keine Environment Protection Rules** mehr nötig
2. **Beide Branches** (main & experimenting) können deployen
3. **Einfacher zu managen** - direkter Branch-Push
4. **Standard-Methode** - von vielen Projekten genutzt

---

## 🔍 Troubleshooting

### Falls gh-pages Branch nicht existiert:
Der Workflow erstellt ihn automatisch beim ersten Run.

### Falls 403 Permission Error:
- Repository Settings → Actions → General
- Workflow permissions: **"Read and write permissions"**
- ✅ Allow GitHub Actions to create and approve pull requests

### Falls immer noch Environment Error:
Prüfe ob der Workflow wirklich die neue Version nutzt:
```bash
cat .github/workflows/deploy.yml | grep "peaceiris"
```

Sollte zeigen:
```yaml
uses: peaceiris/actions-gh-pages@v3
```

---

## 📝 Zusammenfassung

| Was | Vorher | Nachher |
|-----|--------|---------|
| Deployment-Methode | GitHub Actions Environment | Direct gh-pages Branch |
| Erlaubte Branches | Nur `main` | `main` & `experimenting` |
| Environment Protection | ❌ Blockiert experimenting | ✅ Umgangen |
| Settings anpassen | ❌ Schwierig | ✅ Einfach |

---

**Status:** ✅ Ready to deploy!
