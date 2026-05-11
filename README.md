# 🌱 Hydro kalkulačka

Kalkulačka dávkování pro hydroponickou věž 15 L s hnojivy BioNova Hydro Supermix + BN-Zym a úpravou pH.
Zadáš naměřené EC/pH a dostaneš konkrétní doporučení kolik přidat.

## Spuštění lokálně

```bash
npm install
npm run dev
```

Otevři `http://localhost:5173` v prohlížeči.

## Sestavení pro produkci

```bash
npm run build
```

Výstup je ve složce `dist/`.

## Nasazení na GitHub Pages

1. Sestav aplikaci: `npm run build`
2. Ujisti se, že máš v `vite.config.js` nastavené `base` na název repozitáře:
   ```js
   export default defineConfig({ base: '/nazev-repozitare/', ... })
   ```
3. Nahraj složku `dist/` na větev `gh-pages` (nebo použij balík `gh-pages`)
4. Na GitHubu: **Settings → Pages → Deploy from branch → gh-pages → / (root) → Save**
5. Aplikace bude dostupná na `https://<user>.github.io/<repo>/`

## Kalibrace koeficientů

Výchozí hodnoty jsou nastaveny pro kohoutkovou vodu s pH ~8 a hnojivo BioNova Hydro Supermix.
Pokud dávkování v praxi nesedí (přidáš X ml a EC/pH se změní jinak, než kalkulačka předpokládá),
uprav koeficienty v sekci **⚙️ Kalibrace**:

- **EC koeficient** (výchozí 3.0) — o kolik mS/cm zvedne 1 ml hnojiva v 1 L vody
- **pH koeficient** (výchozí 1.125) — o kolik sníží 1 kapka pH- pH v 1 L vody

Všechna nastavení se ukládají automaticky v prohlížeči (localStorage).
