# CLAUDE.md — Hydro kalkulačka

Tento soubor obsahuje trvalé instrukce pro Claude Code pro projekt `hydro-calc`.

## O projektu

Hydroponická kalkulačka pro výpočet dávkování hnojiv. Statická aplikace, jeden soubor `index.html` s vloženým JavaScriptem a CSS. Žádný backend, žádné externí databáze, žádné přihlašování.

Cílová skupina: hydroponičtí pěstitelé. Provoz: mobil i desktop (responsivně).

## Pracovní pravidla — KRITICKÉ

### Větve

**Pracuj VÝHRADNĚ na větvi `main`. Nevytvářej nové větve. Necommituj do feature větví.**

Důvod: projekt je propojený s Vercelem, který deployuje pouze z `main`. Práce v jiných větvích se na živou URL nedostane a vznikají zbytečné konflikty.

Pokud z nějakého technického důvodu vytvořit větev považuješ za nutné, **zeptej se nejdřív** uživatele a vysvětli proč.

### Commity a push

Po každé smysluplné změně proveď commit + push na main:

git add .
git commit -m "popis změny v češtině"
git push

Commit message piš v češtině, krátce a věcně (např. "přidán převod kapek na ml", "oprava výpočtu pH").

### Worktrees

**Nevytvářej `git worktree`**. Jeden pracovní adresář stačí. Worktrees zanechávají problémové duplicitní složky, které se obtížně mažou.

## Technická omezení

- **Stack:** Vanilla HTML + JavaScript + CSS. Vite jako build tool. Bez Reactu, bez frameworku.
- **Žádné nové npm balíčky** bez výslovného souhlasu uživatele.
- **Vše v jednom souboru `index.html`**, pokud to jde — uživatel si přeje jednoduchost.
- **Žádný backend**, žádné API klíče, žádné databáze. Pouze `localStorage` pro persistenci, pokud je třeba.
- **Žádné externí CDN** kromě těch, které už v projektu jsou.

## Styl kódu

- Komentáře v češtině, smí být i anglicky pokud jde o čistě technický popis.
- Proměnné a funkce v angličtině (`calculatePh`, `mlPerLiter`).
- Indent 2 mezery.
- Žádné `console.log` v finálním kódu (jen při ladění, vždy odstraň před commitem).

## Před začátkem práce

Vždy nejdřív zkontroluj, jestli je lokální `main` aktuální:

git pull

Pokud `git pull` ohlásí `Already up to date.`, můžeš začít. Pokud stáhne změny, prohlédni si je (`git log -3`), aby ses orientoval ve stavu projektu.

## Co dělat NEMÁŠ

- Nevytvářej README.md, LICENSE, .gitignore změny, GitHub Actions, ani jiné meta-soubory bez výslovného pokynu.
- Nepřejmenovávej existující soubory bez souhlasu.
- Nepřidávej testovací knihovny (Jest, Vitest, atd.) — tento projekt testy nemá a nepotřebuje je.
- Nepiš dokumentaci do JSDoc komentářů, pokud o to uživatel nepožádá.
- Neměň `package.json` nebo `vite.config.js` bez vysvětlení důvodu a potvrzení od uživatele.

## Komunikace s uživatelem

Uživatel (Radovan) komunikuje stručně, česky. Když si nejsi něčím jistý, **zeptej se**, nepokoušej se "domyslet". Pokud máš na výběr mezi dvěma přístupy, krátce nabídni oba a nech ho rozhodnout.

Pokud uvidíš v kódu problém, který uživatel neřešil (např. potenciální bug v jiné části kalkulačky), upozorni na něj, ale neoprav ho bez souhlasu.

## Deployment

GitHub `main` → Vercel automatický deploy → `hydro-calc-mu.vercel.app`.

Po každém pushi se Vercel aktivuje sám během ~30 vteřin. Není třeba dělat nic navíc.
