"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Nyil3D, Vonal3D, Cimke3D, Pont3D } from "./Jelenet3D";

/*
 * Közös 3D építőelemek a 10. modul (térbeli tartók) jeleneteihez.
 * A statikai koordináta-rendszer a tankönyv 9. fejezete szerint: x jobbra, y FELFELÉ, z a néző felé.
 * A Jelenet3D-ben a z tengely mutat felfelé, ezért minden pontot átképezünk:
 *   statikai (x, y, z)  →  jelenet (x, −z, y)     (jobbkezes marad)
 * Minden itteni elem statikai koordinátákat vár.
 */

export const P = (v) => [v[0], -v[2], v[1]];
export const kam = P; // a kamera helye is statikai koordinátákkal adható meg

export const SZIN = {
  tarto: "#1d3c48",
  rud: "#475569",
  teher: "#e2590a",
  reakcio: "#7c3aed",
  nyomatek: "#be123c",
  huzott: "#dc2626",
  nyomott: "#2563eb",
  nulla: "#94a3b8",
  tengely: "#64748b",
  kek: "#0369a1",
  zold: "#0f766e",
};

const FEL = new THREE.Vector3(0, 1, 0);

/** Kvaternió és hossz két statikai pont között (a henger y tengelye a b−a irányba áll). */
function iranyitas(a, b) {
  const A = new THREE.Vector3(...P(a));
  const B = new THREE.Vector3(...P(b));
  const d = new THREE.Vector3().subVectors(B, A);
  const h = d.length();
  const q = new THREE.Quaternion();
  if (h > 1e-9) q.setFromUnitVectors(FEL, d.clone().normalize());
  return { pos: A, quat: q, hossz: h };
}

/** Nyíl statikai koordinátákkal. */
export function NyilT({ tol, ig, ...rest }) {
  return <Nyil3D tol={P(tol)} ig={P(ig)} {...rest} />;
}

/** Vékony vonal statikai koordinátákkal. */
export function VonalT({ tol, ig, ...rest }) {
  return <Vonal3D tol={P(tol)} ig={P(ig)} {...rest} />;
}

/** Felirat statikai koordinátákkal. */
export function CimkeT({ pozicio, ...rest }) {
  return <Cimke3D pozicio={P(pozicio)} {...rest} />;
}

/** Pont (gömb) statikai koordinátákkal. */
export function PontT({ pozicio, ...rest }) {
  return <Pont3D pozicio={P(pozicio)} {...rest} />;
}

/** Tömör rúd (henger) két statikai pont között. u: kihúzódás 0–1. */
export function RudT({ tol, ig, sugar = 0.09, szin = SZIN.rud, opacitas = 1, u = 1 }) {
  const { pos, quat, hossz } = useMemo(() => iranyitas(tol, ig), [tol[0], tol[1], tol[2], ig[0], ig[1], ig[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  const L = hossz * Math.max(0, Math.min(1, u));
  if (L < 0.02) return null;
  return (
    <group position={pos} quaternion={quat}>
      <mesh position={[0, L / 2, 0]}>
        <cylinderGeometry args={[sugar, sugar, L, 16]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Kettős nyíl (nyomatékvektor): henger + két kúp a hegyén. */
export function KettosNyilT({ tol, ig, szin = SZIN.nyomatek, vastag = 0.09, opacitas = 1, u = 1 }) {
  const { pos, quat, hossz } = useMemo(() => iranyitas(tol, ig), [tol[0], tol[1], tol[2], ig[0], ig[1], ig[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  const L = hossz * Math.max(0, Math.min(1, u));
  if (L < 0.05) return null;
  const fej = Math.min(vastag * 4, L * 0.35);
  const szar = Math.max(L - 2 * fej, 0.001);
  return (
    <group position={pos} quaternion={quat}>
      <mesh position={[0, szar / 2, 0]}>
        <cylinderGeometry args={[vastag, vastag, szar, 14]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
      <mesh position={[0, szar + fej / 2, 0]}>
        <coneGeometry args={[vastag * 2.4, fej, 18]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
      <mesh position={[0, szar + fej * 1.5, 0]}>
        <coneGeometry args={[vastag * 2.4, fej, 18]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Íves nyíl egy tengely körül (a forgatás szemléltetésére): a `kozep` pont körül, `tengely` irány, sugár r. Pozitív érték: jobbkézszabály szerint. */
export function IvNyilT({ kozep, tengely, r = 0.6, elojel = 1, szin = SZIN.nyomatek, opacitas = 1, vastag = 0.05 }) {
  const { pontok, vegT, vegE } = useMemo(() => {
    const t = new THREE.Vector3(...P(tengely)).normalize();
    // két, a tengelyre merőleges egységvektor
    const seged = Math.abs(t.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
    const a = new THREE.Vector3().crossVectors(t, seged).normalize();
    const b = new THREE.Vector3().crossVectors(t, a).normalize();
    const c = new THREE.Vector3(...P(kozep));
    const pts = [];
    const n = 28;
    const kezd = 0.15 * Math.PI;
    const veg = 1.65 * Math.PI;
    for (let i = 0; i <= n; i++) {
      const f = kezd + ((veg - kezd) * i) / n;
      const fi = elojel >= 0 ? f : -f;
      pts.push(new THREE.Vector3().copy(c).addScaledVector(a, r * Math.cos(fi)).addScaledVector(b, r * Math.sin(fi)));
    }
    return { pontok: pts, vegT: pts[pts.length - 1], vegE: new THREE.Vector3().subVectors(pts[pts.length - 1], pts[pts.length - 2]).normalize() };
  }, [kozep[0], kozep[1], kozep[2], tengely[0], tengely[1], tengely[2], r, elojel]); // eslint-disable-line react-hooks/exhaustive-deps
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(FEL, vegE), [vegE]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(pontok), 40, vastag, 8, false]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
      <mesh position={vegT} quaternion={q}>
        <coneGeometry args={[vastag * 2.8, vastag * 7, 12]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Koordinátatengelyek a statikai rendszerben (x jobbra, y felfelé, z a néző felé). */
export function TengelyekT({ hossz = 5, origo = [0, 0, 0], cimkek = ["x", "y", "z"], szin = SZIN.tengely }) {
  return (
    <group>
      <NyilT tol={origo} ig={[origo[0] + hossz, origo[1], origo[2]]} szin={szin} vastag={0.035} />
      <NyilT tol={origo} ig={[origo[0], origo[1] + hossz, origo[2]]} szin={szin} vastag={0.035} />
      <NyilT tol={origo} ig={[origo[0], origo[1], origo[2] + hossz]} szin={szin} vastag={0.035} />
      <CimkeT pozicio={[origo[0] + hossz + 0.5, origo[1], origo[2]]} szin={szin} meret={13}><i>{cimkek[0]}</i></CimkeT>
      <CimkeT pozicio={[origo[0], origo[1] + hossz + 0.5, origo[2]]} szin={szin} meret={13}><i>{cimkek[1]}</i></CimkeT>
      <CimkeT pozicio={[origo[0], origo[1], origo[2] + hossz + 0.5]} szin={szin} meret={13}><i>{cimkek[2]}</i></CimkeT>
    </group>
  );
}

/** Padlórács az y = magassag síkban (statikai), a jelenet x–z síkjában. */
export function PadloT({ meret = 20, osztas = 20, magassag = 0, szin = "#cbd5e1", kozep = [0, 0] }) {
  return <gridHelper args={[meret, osztas, "#94a3b8", szin]} rotation={[Math.PI / 2, 0, 0]} position={[kozep[0], -kozep[1], magassag]} />;
}

/** Gömbcsukló: gömb + kis talp. */
export function GombcsukloT({ pozicio, r = 0.22, szin = "#334155", opacitas = 1 }) {
  return (
    <group position={P(pozicio)}>
      <mesh>
        <sphereGeometry args={[r, 18, 18]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
      <mesh position={[0, 0, -r * 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 1.6, r * 1.6, r * 0.5, 18]} />
        <meshStandardMaterial color="#64748b" transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Rúd talppontja (csuklós rögzítés): kis kúp a földön (a kúp tengelye statikai y). */
export function TalpT({ pozicio, meret = 0.32, szin = "#64748b", opacitas = 1 }) {
  const p = P(pozicio);
  return (
    <group position={[p[0], p[1], p[2] - meret * 0.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[meret, meret, 16]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Merev befogás: vastag lap az adott ponton, normálisa a `normal` (statikai) irány. */
export function BefogasT({ pozicio, normal = [0, 1, 0], meret = 1.6, vastag = 0.18, szin = "#94a3b8", opacitas = 1 }) {
  const { pos, quat } = useMemo(() => iranyitas(pozicio, [pozicio[0] + normal[0], pozicio[1] + normal[1], pozicio[2] + normal[2]]), [pozicio[0], pozicio[1], pozicio[2], normal[0], normal[1], normal[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <group position={pos} quaternion={quat}>
      <mesh position={[0, -vastag / 2, 0]}>
        <boxGeometry args={[meret, vastag, meret]} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} />
      </mesh>
    </group>
  );
}

/** Téglatest: [x0,x1]×[y0,y1]×[z0,z1] statikai tartomány. */
export function TeglatestT({ x, y, z, szin = "#8ec3cd", opacitas = 0.35, drot = true }) {
  const kozep = P([(x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2]);
  const meretek = [x[1] - x[0], z[1] - z[0], y[1] - y[0]]; // jelenet: (x, −z, y)
  return (
    <group position={kozep}>
      <mesh>
        <boxGeometry args={meretek} />
        <meshStandardMaterial color={szin} transparent={opacitas < 1} opacity={opacitas} depthWrite={opacitas >= 1} />
      </mesh>
      {drot && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...meretek)]} />
          <lineBasicMaterial color="#1d3c48" />
        </lineSegments>
      )}
    </group>
  );
}

/** Keresztmetszet-lap (kis korong) egy ponton, normálisa a tartótengely. */
export function KorongT({ pozicio, normal, r = 0.3, szin = "#f59e0b", opacitas = 0.85 }) {
  const { pos, quat } = useMemo(() => iranyitas(pozicio, [pozicio[0] + normal[0], pozicio[1] + normal[1], pozicio[2] + normal[2]]), [pozicio[0], pozicio[1], pozicio[2], normal[0], normal[1], normal[2]]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <cylinderGeometry args={[r, r, 0.04, 28]} />
        <meshStandardMaterial color={szin} transparent opacity={opacitas} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Erő rajza: a nyíl hegye a támadáspontban (a tankönyv rajzai szerint), a farka a −F irányban. lepték: egység/kN. */
export function EroNyilT({ pont, F, leptek = 0.25, szin = SZIN.teher, u = 1, opacitas = 1, vastag = 0.09, cimke, cimkeEltolas = [0, 0.5, 0], cimkeSzin }) {
  const h = Math.hypot(F[0], F[1], F[2]);
  if (h < 1e-9) return null;
  const L = Math.max(0.9, h * leptek);
  const farok = [pont[0] - (F[0] / h) * L, pont[1] - (F[1] / h) * L, pont[2] - (F[2] / h) * L];
  const kezd = [pont[0] - (F[0] / h) * L * u, pont[1] - (F[1] / h) * L * u, pont[2] - (F[2] / h) * L * u];
  return (
    <group>
      <NyilT tol={kezd} ig={pont} szin={szin} vastag={vastag} opacitas={opacitas} />
      {cimke && u > 0.5 && (
        <CimkeT pozicio={[farok[0] + cimkeEltolas[0], farok[1] + cimkeEltolas[1], farok[2] + cimkeEltolas[2]]} szin={cimkeSzin ?? szin} opacitas={opacitas}>
          {cimke}
        </CimkeT>
      )}
    </group>
  );
}

/** Reakcióerő / rúderő nyila: a farka a pontban, a hegye a vektor irányában (kifelé mutat). */
export function VektorNyilT({ pont, F, leptek = 0.25, szin = SZIN.reakcio, u = 1, opacitas = 1, vastag = 0.09, cimke, cimkeEltolas = [0, 0.5, 0], kettos = false, minHossz = 0.9 }) {
  const h = Math.hypot(F[0], F[1], F[2]);
  if (h < 1e-9) return null;
  const L = Math.max(minHossz, h * leptek);
  const veg = [pont[0] + (F[0] / h) * L, pont[1] + (F[1] / h) * L, pont[2] + (F[2] / h) * L];
  return (
    <group>
      {kettos ? <KettosNyilT tol={pont} ig={veg} szin={szin} vastag={vastag} opacitas={opacitas} u={u} /> : <NyilT tol={pont} ig={veg} szin={szin} vastag={vastag} opacitas={opacitas} u={u} />}
      {cimke && u > 0.5 && (
        <CimkeT pozicio={[veg[0] + cimkeEltolas[0], veg[1] + cimkeEltolas[1], veg[2] + cimkeEltolas[2]]} szin={szin} opacitas={opacitas}>
          {cimke}
        </CimkeT>
      )}
    </group>
  );
}

/** Rúderő színe és vastagsága: piros húzott, kék nyomott, szürke ~0; vastagság ∝ |S|. */
export function rudStilus(S, Smax = 10) {
  const a = Math.abs(S);
  const szin = a < 1e-6 ? SZIN.nulla : S > 0 ? SZIN.huzott : SZIN.nyomott;
  const sugar = 0.06 + 0.12 * Math.min(1, a / Math.max(1e-9, Smax));
  return { szin, sugar };
}
