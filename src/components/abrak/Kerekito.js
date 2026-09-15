"use client";

import { useState } from "react";

/*
 * Kerekítő – a tankönyv 2.3 szabálya: négy értékes jegy, az ötödik jegy 5–9 esetén felfelé.
 * A számot a beírt tizedes alakból (szövegként) kerekítjük, hogy a döntő jegy pontosan
 * az legyen, amit a felhasználó lát – nem a lebegőpontos ábrázolás.
 */

/** A beírt szöveg felbontása: előjel, jegysor és a tizedesvessző helye (hány jegy áll előtte). */
function felbont(szoveg) {
  const s = String(szoveg).trim().replace(/\s/g, "").replace(".", ",");
  const m = s.match(/^([+-]?)(\d*)(?:,(\d*))?$/);
  if (!m) return null;
  const egesz = m[2] || "";
  const tort = m[3] || "";
  if (egesz.length + tort.length === 0) return null;
  return { negativ: m[1] === "-", jegyek: egesz + tort, vesszo: egesz.length };
}

/**
 * Négy értékes jegyre kerekít (jegysor + vesszőhely alakban).
 * Visszaadja: az eredmény jegysorát, a vessző helyét, a döntő jegyet és annak indexét,
 * valamint hogy kellett-e egyáltalán kerekíteni.
 */
function kerekit4(fb, hely = 0) {
  // hely: hány jegyet tolunk a vesszőn (mértékegység-váltás: +3 = ezerszeres)
  let jegyek = fb.jegyek;
  let vesszo = fb.vesszo + hely;
  // a vesszőt a jegysoron belülre hozzuk nullákkal
  if (vesszo < 0) {
    jegyek = "0".repeat(-vesszo) + jegyek;
    vesszo = 0;
  }
  if (vesszo > jegyek.length) {
    jegyek = jegyek + "0".repeat(vesszo - jegyek.length);
  }
  const elso = [...jegyek].findIndex((c) => c !== "0");
  if (elso === -1) return { nulla: true, negativ: fb.negativ };
  const ertekesek = jegyek.length - elso; // ahány értékes jegy egyáltalán van
  const donto = elso + 4 < jegyek.length ? Number(jegyek[elso + 4]) : null; // ötödik jegy
  const elhagyott = jegyek.slice(elso + 4);
  const kellett = elhagyott.length > 0 && /[1-9]/.test(elhagyott);
  const felfele = donto !== null && donto >= 5;

  let mag = [...jegyek.slice(elso, elso + 4)].map(Number);
  let atvitelElore = false;
  if (felfele) {
    let i = mag.length - 1;
    mag[i] += 1;
    while (i >= 0 && mag[i] === 10) {
      mag[i] = 0;
      if (i === 0) atvitelElore = true;
      else mag[i - 1] += 1;
      i--;
    }
  }
  let eredmeny = mag.join("");
  let ujElso = elso;
  let vesszoU = vesszo;
  if (atvitelElore) {
    // 9999 → 10000: a négy értékes jegy „1000”, egy hellyel előrébb kezdődik
    eredmeny = "1000";
    ujElso = elso - 1;
    if (ujElso < 0) {
      ujElso = 0;
      vesszoU = vesszo + 1;
    }
  }
  // a kerekített jegysor a teljes számban: vezető nullák + eredmény + a vessző előtti nullák
  let teljes = "0".repeat(ujElso) + eredmeny;
  if (teljes.length < vesszoU) teljes = teljes + "0".repeat(vesszoU - teljes.length);
  const egeszResz = teljes.slice(0, vesszoU).replace(/^0+(?=\d)/, "") || "0";
  const tortResz = teljes.slice(vesszoU);
  const szoveg = (fb.negativ ? "−" : "") + egeszResz + (tortResz.length ? "," + tortResz : "");
  return {
    nulla: false,
    szoveg,
    donto,
    dontoIndex: elso + 4,
    elso,
    kellett,
    felfele,
    ertekesek,
    jegyek,
    vesszo,
    negativ: fb.negativ,
  };
}

/** A beírt szám jegyei színezve: megtartott (vastag), döntő (narancs), elhagyott (halvány). */
function Jegysor({ k }) {
  const elemek = [];
  for (let i = 0; i < k.jegyek.length; i++) {
    if (i === k.vesszo && i > 0) elemek.push(<span key={`v${i}`}>,</span>);
    if (i === k.vesszo && i === 0) elemek.push(<span key="v0">0,</span>);
    const c = k.jegyek[i];
    let stilus = "text-petrol-400 opacity-60"; // elhagyott jegyek
    if (i < k.elso) stilus = "text-petrol-400";
    else if (i < k.elso + 4) stilus = "font-bold text-petrol-900";
    else if (i === k.dontoIndex) stilus = "rounded bg-naracs-100 px-0.5 font-bold text-naracs-800";
    elemek.push(
      <span key={i} className={stilus}>
        {c}
      </span>,
    );
  }
  return (
    <span className="szamok text-[22px] tracking-wide">
      {k.negativ && <span className="text-petrol-900">−</span>}
      {elemek}
    </span>
  );
}

export default function Kerekito() {
  const [szoveg, setSzoveg] = useState("0,2345");
  const fb = felbont(szoveg);
  const k = fb ? kerekit4(fb) : null;
  const tulHosszu = fb && fb.jegyek.length > 24;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color:var(--keret)] bg-white">
      <div className="border-b border-[color:var(--keret)] bg-petrol-50/60 px-4 py-3">
        <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Kerekítő · négy értékes jegy</p>
        <label className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-petrol-700">
          <span>Írj be egy számot:</span>
          <input
            type="text"
            inputMode="decimal"
            value={szoveg}
            onChange={(e) => setSzoveg(e.target.value)}
            className="szamok w-44 rounded-lg border border-petrol-200 bg-white px-3 py-1.5 text-[15px] text-petrol-900 outline-none focus:border-naracs-400"
            aria-label="kerekítendő szám"
          />
          <span className="text-[12px] text-petrol-400">(tizedesvesszővel vagy ponttal)</span>
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["0,2345", "12345,678", "2,34", "3,14159265", "0,99995", "86,045", "1234500"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSzoveg(p)}
              className="szamok rounded-md bg-white px-2 py-0.5 text-[12px] text-petrol-600 ring-1 ring-petrol-200 transition hover:bg-petrol-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {!fb || tulHosszu ? (
          <p className="text-[13.5px] text-rose-700">
            {tulHosszu ? "Ennyi jegyet már nem érdemes leírni — próbálj rövidebbet." : "Ez nem szám. Csak számjegyeket, egy tizedesvesszőt és esetleg előjelet írj be."}
          </p>
        ) : k.nulla ? (
          <p className="text-[13.5px] text-petrol-700">A nulla nulla marad — értékes jegye nincs.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <div>
                <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">A beírt szám</p>
                <Jegysor k={k} />
                <p className="mt-1 text-[11.5px] text-petrol-500">
                  <span className="font-bold text-petrol-800">vastag</span>: a négy értékes jegy ·{" "}
                  <span className="rounded bg-naracs-100 px-0.5 font-bold text-naracs-800">narancs</span>: az ötödik, döntő jegy
                </p>
              </div>
              <div className="rounded-xl bg-naracs-50 px-4 py-2.5">
                <p className="text-[10.5px] font-bold tracking-[0.16em] text-naracs-700 uppercase">Négy értékes jegyre</p>
                <p className="szamok text-[24px] font-bold text-petrol-900">{k.szoveg}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-petrol-100 bg-petrol-50/60 px-4 py-3 text-[13.5px] leading-relaxed text-petrol-800">
              {k.donto === null ? (
                <p>
                  Ennek a számnak csak <strong>{k.ertekesek}</strong> értékes jegye van, ötödik nincs — nem kellett kerekíteni. Ilyenkor a
                  tankönyv szerint kevesebb jegyet írunk le: a <span className="szamok">2,34</span> kerekítés nélküli érték, míg a{" "}
                  <span className="szamok">2,340</span> azt jelenti, hogy a valódi szám 2,3395 és 2,3405 közé esik. A nullát a végére csak
                  akkor írd, ha tényleg kerekítettél.
                </p>
              ) : (
                <p>
                  Az ötödik jegy <strong className="szamok">{k.donto}</strong>, ez{" "}
                  {k.felfele ? (
                    <>
                      <strong>5–9</strong>, ezért a negyedik jegyet <strong>felfelé</strong> kerekítjük
                    </>
                  ) : (
                    <>
                      <strong>0–4</strong>, ezért a negyedik jegy <strong>marad</strong>
                    </>
                  )}
                  {k.kellett ? "" : " (az elhagyott rész csupa nulla, az érték nem változott)"}.
                  {k.szoveg.includes(",") && k.szoveg.endsWith("0") && (
                    <> A záró nulla itt nem fölösleges: jelzi, hogy negyedik jegyig pontos az érték.</>
                  )}
                </p>
              )}
            </div>

            <div className="mt-4">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-petrol-500 uppercase">Független a mértékegységtől</p>
              <p className="mt-1 text-[12.5px] text-petrol-600">
                Ha a beírt szám méterben van, ugyanez a hossz kilométerben és milliméterben — négy értékes jegyre kerekítve mindhárom
                ugyanazokat a jegyeket adja, tehát a pontosságuk is azonos:
              </p>
              <div className="szamok mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-petrol-900">
                <span>
                  {kerekit4(fb, -3).szoveg} <span className="text-petrol-500">km</span>
                </span>
                <span className="text-petrol-400">=</span>
                <span>
                  {k.szoveg} <span className="text-petrol-500">m</span>
                </span>
                <span className="text-petrol-400">=</span>
                <span>
                  {kerekit4(fb, 3).szoveg} <span className="text-petrol-500">mm</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
