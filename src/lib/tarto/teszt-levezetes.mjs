/**
 * A levezetés-réteg tesztje: minden sablonra és néhány kézi szerkezetre
 * a levezetés (egyensúlyi egyenletek) és a motor (merevségi módszer)
 * reakcióinak egyeznie kell; minden KaTeX-képletnek le kell fordulnia.
 *   node teszt-levezetes.mjs
 */
import katex from "katex";
import { elemez } from "./index.js";
import { levezetes, igenybevetelSzoveg } from "./levezetes.js";
import { SABLONOK, alapParameterek } from "./sablonok.js";

const MACROK = {
  "\\vect": "\\underline{#1}",
  "\\Fx": "\\textstyle\\sum F_{ix}\\!\\rightarrow\\,:\\ ",
  "\\Fy": "\\textstyle\\sum F_{iy}\\!\\uparrow\\,:\\ ",
  "\\Fz": "\\textstyle\\sum F_{iz}\\!\\nearrow\\,:\\ ",
  "\\Fle": "\\textstyle\\sum F_{i}\\!\\downarrow\\,:\\ ",
  "\\Mp": "\\textstyle\\sum M_{i#1}\\!\\curvearrowleft\\,:\\ ",
  "\\Mj": "\\textstyle\\sum M_{i#1}\\!\\curvearrowright\\,:\\ ",
  "\\ekv": "\\;\\dot{=}\\;",
};

let jo = 0, rossz = 0; const hibak = [];
const igaz = (nev, f) => { if (f) jo++; else { rossz++; hibak.push(nev); } };
const kozel = (nev, a, b, t = 1e-6) => igaz(`${nev}: ${a} ≠ ${b}`, Math.abs(a - b) <= Math.max(t, Math.abs(b) * t));

function katexOk(nev, s) {
  try { katex.renderToString(s, { throwOnError: true, strict: false, trust: true, macros: { ...MACROK } }); jo++; }
  catch (e) { rossz++; hibak.push(`${nev} KaTeX: ${e.message.slice(0, 120)}  ←  ${s.slice(0, 160)}`); }
}

function ellenoriz(nev, modell, opts = {}) {
  const e = elemez(modell);
  if (!e.ok) { if (opts.hibaVart) { jo++; return; } rossz++; hibak.push(`${nev}: a motor nem oldotta meg: ${e.hibak.join("; ")}`); return; }
  const lv = levezetes(modell, e);
  igaz(`${nev}: teljes levezetés`, e.merleg.tipus === "hatarozott" ? lv.teljes : lv.hatarozatlan && !lv.teljes);
  // ismeretlenek ↔ reakciók
  for (const r of e.reakciok) {
    const cs = r.csomopont;
    if (r.tipus === "csuklo" || r.tipus === "befogas") {
      const ux = lv.ismeretlenek.find((u) => u.jel === `${cs}_{x}`);
      const uy = lv.ismeretlenek.find((u) => u.jel === `${cs}_{y}`);
      igaz(`${nev}: van ${cs}_x/${cs}_y`, ux && uy);
      if (ux && uy) { kozel(`${nev}: ${cs}_x`, ux.ertek, r.Fx, 1e-6); kozel(`${nev}: ${cs}_y`, uy.ertek, r.Fy, 1e-6); }
      if (r.tipus === "befogas") {
        const um = lv.ismeretlenek.find((u) => u.jel === `M_{${cs}}`);
        igaz(`${nev}: van M_${cs}`, !!um);
        if (um) kozel(`${nev}: M_${cs}`, um.ertek, r.M, 1e-6);
      }
    } else if (r.tipus === "gorgo") {
      const u = lv.ismeretlenek.find((x) => x.jel === cs);
      igaz(`${nev}: van görgő ${cs}`, !!u);
      if (u) kozel(`${nev}: görgő ${cs}`, u.ertek, r.nagysag, 1e-6);
    } else if (r.tipus === "rud") {
      const u = lv.ismeretlenek.find((x) => x.jel === "S" || /^S_\{\d+\}$/.test(x.jel));
      igaz(`${nev}: van S`, !!u);
      if (u) kozel(`${nev}: S`, u.ertek, r.S, 1e-6);
    }
  }
  // KaTeX
  lv.lepesek.forEach((l, i) => (l.kepletek ?? []).forEach((k, j) => katexOk(`${nev} lépés ${i}/${j} (${l.cim})`, k)));
  lv.lepesek.forEach((l) => (l.felsorolas ?? []).forEach((f) => katexOk(`${nev} felsorolás ${f.jel}`, f.jel)));
  const sz = igenybevetelSzoveg(e.igenybevetelek, e.modell);
  for (const r of sz) for (const s of r.szakaszok) { katexOk(`${nev} ${r.rud} tartomány`, s.tartomany); katexOk(`${nev} ${r.rud} N`, s.N); katexOk(`${nev} ${r.rud} V`, s.V); katexOk(`${nev} ${r.rud} M`, s.M); }
  if (opts.kiir) console.log(JSON.stringify(lv.lepesek.map((l) => ({ cim: l.cim, szoveg: l.szoveg, kepletek: l.kepletek })), null, 1));
  return lv;
}

/* ---- sablonok: alapértékek + 4 véletlen paraméterkészlet ---- */
let mag = 7;
const rnd = () => { mag = (mag * 9301 + 49297) % 233280; return mag / 233280; };
for (const sab of SABLONOK) {
  ellenoriz(`${sab.id} alap`, sab.keszit(alapParameterek(sab)));
  for (let k = 0; k < 4; k++) {
    const p = {};
    for (const par of sab.parameterek) {
      const n = Math.round((par.max - par.min) / par.lepes);
      p[par.id] = par.min + par.lepes * Math.floor(rnd() * (n + 1));
    }
    const m = sab.keszit(p);
    const e = elemez(m);
    if (!e.ok) continue; // pl. nulla hosszúságú konzol – nem a levezetés hibája
    ellenoriz(`${sab.id} #${k} ${JSON.stringify(p)}`, m);
  }
}

/* ---- a modul 5 GYF esetei ---- */
ellenoriz("GYF-3 rúd+csukló", {
  csomopontok: [{ id: "V", x: 0, y: 0 }, { id: "C", x: 2.4, y: 0 }, { id: "B", x: 4.8, y: 0 }],
  rudak: [{ id: "1", a: "V", b: "C" }, { id: "2", a: "C", b: "B" }],
  tamaszok: [{ csomopont: "B", tipus: "csuklo" }, { csomopont: "C", tipus: "rud", irany: [-2.4, -1.2] }],
  terhek: [{ fajta: "megoszlo", rud: "1", p1: -5, irany: "y" }],
});
ellenoriz("GYF-5 keret ferde görgő", {
  csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "D", x: 0, y: 3 }, { id: "E", x: 4.5, y: 3 }, { id: "B", x: 4.5, y: 1.5 }],
  rudak: [{ id: "o1", a: "A", b: "D" }, { id: "g", a: "D", b: "E" }, { id: "o2", a: "E", b: "B" }],
  tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 120 }],
  terhek: [{ fajta: "pontNyomatek", rud: "g", a: 1.5, M: -12 }],
});
ellenoriz("háromcsuklós", {
  csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "C", x: 4, y: 3 }, { id: "B", x: 8, y: 0 }],
  rudak: [{ id: "1", a: "A", b: "C" }, { id: "2", a: "C", b: "B", csukloA: true }],
  tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "csuklo" }],
  terhek: [{ fajta: "csomopontiEro", csomopont: "C", Fy: -20 }],
});
ellenoriz("ferde rúd, ferde teher", {
  csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 4, y: 3 }],
  rudak: [{ id: "1", a: "A", b: "B" }],
  tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo", szog: 90 }],
  terhek: [{ fajta: "megoszlo", rud: "1", p1: -6, irany: "y", vetuletre: true }, { fajta: "pontTeher", rud: "1", a: 2, F: 10, irany: "szog", szog: 200 }],
});
ellenoriz("két rúd támasz", {
  csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
  rudak: [{ id: "1", a: "A", b: "B" }],
  tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "rud", irany: [1, -1] }],
  terhek: [{ fajta: "pontTeher", rud: "1", a: 4, F: -12, irany: "y" }],
});
// tiszta erőpár megoszló teher (előjelet váltó): eredője nulla, csak nyomatéka van
ellenoriz("előjelváltó megoszló", {
  csomopontok: [{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }],
  rudak: [{ id: "1", a: "A", b: "B" }],
  tamaszok: [{ csomopont: "A", tipus: "csuklo" }, { csomopont: "B", tipus: "gorgo" }],
  terhek: [{ fajta: "megoszlo", rud: "1", p1: -4, p2: 4, irany: "y" }],
});

console.log(`levezetés: ${jo} rendben, ${rossz} hibás`);
if (hibak.length) { console.log(hibak.slice(0, 40).join("\n")); process.exitCode = 1; }
