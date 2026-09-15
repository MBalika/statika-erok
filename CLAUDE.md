# statika-erok

Next.js 16 (App Router, Turbopack) + React 19 + Tailwind CSS 4 projekt.
A forráskód a `src/` mappában van, a nyelv magyar (fájl- és változónevek is).

## Állandó szabály: projektállapot-frissítés zip fájlból

Ha a felhasználó feltölt egy `statika-erok-*.zip` (vagy nyilvánvalóan ezt a
projektet tartalmazó) csomagot, **azonnal, külön utasítás nélkül** végig kell
csinálni az alábbi folyamatot. Nem kell rákérdezni, és nem kell megvárni, hogy
a felhasználó leírja a lépéseket.

1. **Kicsomagolás** a scratchpad mappába (ne a repóba).
2. **Fájllista-ellenőrzés**: a csomag fájllistájának összevetése a repóéval
   (a `Claude outputs/` mappát és a `CLAUDE.md`-t figyelmen kívül hagyva).
   A hozzáadott és törölt fájlokat külön jelezni kell az összefoglalóban.
3. **Másolás felülírással**: a régi `src/` törlése, helyére a csomagbeli `src/`,
   majd a gyökérfájlok felülírása:
   `.gitignore`, `README.md`, `jsconfig.json`, `next.config.mjs`,
   `package.json`, `package-lock.json`, `postcss.config.mjs`.
   A `Claude outputs/` mappát és ezt a `CLAUDE.md`-t **nem** szabad törölni,
   ha a csomag nem tartalmazza őket.
4. **Build**: `npm ci && npm run build`. Hiba esetén nincs commit — a hibát
   jelenteni kell.
5. **Commit és push a `main` ágra**, magyar nyelvű commit üzenettel, amely
   röviden leírja a tényleges tartalmi változást (nem csak azt, hogy
   „frissítés zipből”).
6. **Összefoglaló** magyarul: mi változott ténylegesen (a diff alapján),
   a build eredménye, és a commit linkje.

## Hasznos tudnivalók

- Nincs beállítva lint vagy teszt szkript; a `npm run build` az egyetlen
  automatikus ellenőrzés.
- A `node_modules/` és a `.next/` a `.gitignore`-ban van.
- Az oldal teljesen statikusan generálódik (az útvonalak száma a modulok
  bővülésével változik), a build végén ennek hibátlanul le kell futnia.
