import Diagram from "@/components/igenybevetel/Diagram";
import { eredmeny } from "@/components/igenybevetel/Modellek";

/**
 * A kidolgozott feladatok ábrái: a feladat rajza (terhek, támaszok, méretek,
 * reakciók nélkül) és a megoldás ábrái (reakciók + N, V, M egzaktan a számítómagból).
 */

export function FeladatAbra({ kulcs, amp }) {
  return <Diagram eredmeny={eredmeny(kulcs)} abrak={[]} meretek reakciok={false} amp={amp} />;
}

export function MegoldasAbra({ kulcs, abrak = ["N", "V", "M"], amp = 40, kiemelSzelso = 0 }) {
  return <Diagram eredmeny={eredmeny(kulcs)} abrak={abrak} amp={amp} kiemelSzelso={kiemelSzelso} />;
}
