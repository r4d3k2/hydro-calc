# 🌱 Hydro kalkulačka

Kalkulačka dávkování pro hydroponickou věž 15 L s hnojivy BioNova Hydro Supermix + BN-Zym a úpravou pH.
Zadáš naměřené EC/pH a dostaneš konkrétní doporučení kolik přidat.

## Spuštění lokálně

Otevři `index.html` přímo v prohlížeči — žádný server ani build krok není potřeba.

## Nasazení na GitHub Pages

1. Nahraj repozitář na GitHub.
2. Jdi do **Settings → Pages**.
3. Nastav **Source: Deploy from a branch**, větev **main**, složka **/ (root)**.
4. Klikni **Save**.
5. Aplikace bude za chvíli dostupná na `https://<user>.github.io/<repo>/`.

## Kalibrace koeficientů

Výchozí hodnoty jsou nastaveny pro kohoutkovou vodu s pH ~8 a hnojivo BioNova Hydro Supermix.
Pokud dávkování v praxi nesedí (přidáš X ml a EC/pH se změní jinak, než kalkulačka předpokládá),
uprav koeficienty v sekci **⚙️ Kalibrace**:

- **EC koeficient** (výchozí 0.75) — o kolik mS/cm zvedne 1 ml hnojiva v 1 L vody
- **BN-Zym dávka** (výchozí 0.5 ml/L) — kolik ml BN-Zym na 1 L vody (oficiální rozsah BioNova: 0,5–1,0 ml/L)
- **pH koeficient** (výchozí 1.125) — o kolik sníží 1 kapka pH- pH v 1 L vody

Všechna nastavení se ukládají automaticky v prohlížeči (localStorage).
