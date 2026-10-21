// TODO el texto que sale en pantalla y el momento en que aparece (segundos dentro de su escena).
// Los momentos se calculan con cueL(escena, "palabra", antes): cuando la voz dice esa palabra, menos `antes` s.
// Las cifras con contador empiezan CONTADOR+0,1 s antes de que la voz las diga, para estar completas al oírlas.
// scripts/check.ts revisa cifras contra la fuente, valores de contadores y frases de más de 12 palabras.
import { cueL, durOf } from "./timing";

export type Item = { text: string; at: number; until?: number; anim?: number; dicho?: number };
const it = (text: string, at: number, extra: Partial<Item> = {}): Item => ({ text, at, ...extra });

export const FADE = 0.25; // 0,25 s de salida + 0,25 s de entrada = fundido de 0,5 s
export const CONTADOR = 1.3;
/** Arranque de un contador para que termine justo antes de que la voz diga la cifra. */
const cnt = (n: number, palabra: string) => cueL(n, palabra, CONTADOR + 0.1);

export const S1 = {
  dur: durOf(1),
  tag: it("LA PLAZUELA | PROPUESTA DE DECISIÓN", 0),
  brand: it("La Plazuela", 0.05, { anim: 0.4 }),
  title: it("Decisión de gestión para 2025", 0.15, { anim: 0.8 }),
  sub: it("Priorizar contribución y liquidez con tres medidas sujetas a evidencia.", 1.2, { anim: 0.4 }),
  foot: it("Para Elena · Simulación preparada en enero de 2025.", cueL(1, "propuesta", 0.4), { anim: 0.4 }),
};

const s2kpi = cueL(2, "caso", 0.3);
export const S2 = {
  dur: durOf(2),
  tag: it("RECOMENDACIÓN", 0),
  title: it("La decisión prioriza contribución y caja.", 0.15, { anim: 0.5 }),
  text: it("Probar tres medidas por etapas.", cueL(2, "probamos", 0.3), { anim: 0.5 }),
  cards: [
    it("Precio M01: probar 14,50 € desde marzo.", cueL(2, "precio"), { anim: 0.6, until: s2kpi }),
    it("Franja de tarde: retirar 16:00–20:00 solo con ahorro real de nómina.", cueL(2, "franja"), { anim: 0.6, until: s2kpi }),
    it("Administración: reducir gastos y renegociar contratos.", cueL(2, "administracion"), { anim: 0.6, until: s2kpi }),
  ],
  kpis: [
    { label: it("EBITDA central simulado", s2kpi + 0.3, { anim: CONTADOR }), value: 39513, text: "39.513 €" },
    { label: it("Resultado antes de impuestos", s2kpi + 0.6, { anim: CONTADOR }), value: 16216, text: "16.216 €" },
    { label: it("Caja final central simulada", s2kpi + 0.9, { anim: CONTADOR }), value: 59354, text: "59.354 €" },
  ],
  bottom1: it("Mejora conjunta del EBITDA: +44.335 €.", cueL(2, "mejora", 0.4), { anim: 0.5, dicho: cueL(2, "44000", 0) }),
  bottom2: it("Ventas centrales 1.126.688 € frente a 1.164.724 € observadas.", cueL(2, "mejora", 0.4) + 0.5, { anim: 0.5 }),
  warn: it("Simulación, no garantía. El ahorro de tardes exige pagos de personal realmente evitados y documentados.", 1.0, { anim: 0.5 }),
};

export const S3 = {
  dur: durOf(3),
  tag: it("DIAGNÓSTICO | DATOS OBSERVADOS 2022–2024", 0),
  title: it("Las ventas crecieron mientras el EBITDA cayó.", 0.15, { anim: 0.5 }),
  salesTitle: it("Ventas netas", 0.4, { anim: 0.4 }),
  sales: [
    { year: "2022", value: 1019658, text: "1.019.658 €" },
    { year: "2023", value: 1069985, text: "1.069.985 €" },
    { year: "2024", value: 1164724, text: "1.164.724 €" },
  ],
  salesAts: [cueL(3, "2022", 0.3), cueL(3, "2022", 0.3) + 0.6, cueL(3, "2024", 0.3)],
  ebitdaTitle: it("EBITDA", cueL(3, "pero", 0.4), { anim: 0.4 }),
  ebitda: [
    { year: "2022", value: 102040, text: "102.040 €" },
    { year: "2023", value: 54604, text: "54.604 €" },
    { year: "2024", value: -4822, text: "−4.822 €" },
  ],
  ebitdaAts: [cueL(3, "102000", 0.8), cueL(3, "102000", 0.8) + 0.6, cueL(3, "perder", 0.5)],
  hl1: it("Ventas 2024: +8,9% frente a 2023.", cueL(3, "crecieron", 0.2), { anim: 0.5 }),
  hl2: it("EBITDA: 102.040 € en 2022 y −4.822 € en 2024.", cueL(3, "5000", 0.2), { anim: 0.5 }),
  final: it("En 2024, ingredientes + personal fueron el 80,4% de las ventas. Administración: 72.200 €.", cueL(3, "vendemos", 0.2), { anim: 0.5 }),
};

export const S4 = {
  dur: durOf(4),
  tag: it("OPERACIÓN | DATOS OBSERVADOS 2024", 0),
  title: it("La franja de tarde no cubrió ni el coste del equipo.", 0.15, { anim: 0.5 }),
  bars: [
    { label: "Ventas", value: 68576, text: "68.576 €" },
    { label: "Coste del equipo", value: 75360, text: "75.360 €" },
  ],
  barsAts: [cueL(4, "cubri", 0.4), cueL(4, "coste", 0.3)],
  gap: { value: -6784, text: "−6.784 €", at: cnt(4, "6784") },
  gapNote: it("Ventas menos coste del equipo, antes de ingredientes y otros costes", cueL(4, "euros", 0.1), { anim: 0.5 }),
  data: [
    { value: 17422, dec: 0, text: "17.422", unit: "visitas", sub: it("(3,94 € netos por visita)", cueL(4, "casi", 0.6), { anim: CONTADOR }) },
    { value: 2099.67, dec: 2, text: "2.099,67", unit: "h sin demanda", sub: it("de 4.285 h regulares", cueL(4, "casi", 0.3), { anim: CONTADOR }) },
    { value: 49.0, dec: 1, text: "49,0", unit: "%", sub: it("de las horas regulares de tarde", cnt(4, "mitad"), { anim: CONTADOR }) },
  ],
  final: it("Cerrar solo si se evita un pago real de personal. Reasignar horas no cuenta como ahorro.", cueL(4, "cerrar", 0.3), { anim: 0.5 }),
};

export const S5 = {
  dur: durOf(5),
  tag: it("REFERENCIA DE PRECIOS | ORIENTATIVA", 0),
  title: it("El precio de M01 puede probarse a 14,50 €.", 0.15, { anim: 0.5 }),
  chartTitle: it("Precio del menú del día", 0.3, { anim: 0.4 }),
  bars: [
    { label: "La Plazuela hoy", value: 13.0, text: "13,00 €", main: true },
    { label: "dNorte", value: 13.9, text: "13,90 €" },
    { label: "Ginger", value: 14.5, text: "14,50 €" },
    { label: "En Busca", value: 17.0, text: "17,00 €" },
    { label: "Media Madrid", value: 14.8, text: "14,80 €" },
  ],
  barsAt: 0.5,
  avg: { value: 15.13, text: "15,13 €", at: cnt(5, "15") },
  avgLabel: it("de media de la muestra de 3 restaurantes", cnt(5, "15"), { anim: CONTADOR }),
  proposal: it("Propuesta para M01: 14,50 €", cueL(5, "proponemos", 0.2), { anim: 0.5 }),
  warn: it("Referencia orientativa. Los menús, sus inclusiones y gramajes no son equivalentes. La muestra no es representativa.", cueL(5, "referencia", 0.6), { anim: 0.5 }),
  final: it("La prueba se limita a M01. Mantiene composición, cantidad y servicio.", cueL(5, "equivalentes", 0.3), { anim: 0.5 }),
};

export const S6 = {
  dur: durOf(6),
  tag: it("DECISIONES", 0),
  title: it("Acción 1 | probar el nuevo precio solo en M01.", 0.15, { anim: 0.5 }),
  from: { text: "13,00 €", at: cueL(6, "13", 0.5) },
  to: { text: "14,50 €", at: cueL(6, "1450", 0.6) },
  text: it("Desde marzo, misma composición, cantidad y servicio.", cueL(6, "desde", 0.3), { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", cnt(6, "12376"), { anim: CONTADOR }),
  impact: { value: 12376, text: "12.376 €" },
  controlTitle: it("Prueba y control", cueL(6, "si", 0.9), { anim: 0.5 }),
  control: [
    it("Preparar receta y TPV en enero–febrero.", cueL(6, "si", 0.9), { anim: 0.5 }),
    it("Revisar semanas comparables a las 4 y 8 semanas.", cueL(6, "si", 0.6), { anim: 0.5 }),
    it("Medir contribución M01, unidades y compras adicionales.", cueL(6, "si", 0.3), { anim: 0.5 }),
  ],
  alert: [
    it("Alerta si las unidades caen más de 10%.", cueL(6, "unidades", 0.5), { anim: 0.5 }),
    it("Ajustar si la contribución queda bajo la base durante 2 semanas comparables.", cueL(6, "unidades", 0.5), { anim: 0.5 }),
  ],
};

const s7b = cueL(7, "activa", 0.5); // cambio de fase: plan -> condición
export const S7 = {
  dur: durOf(7),
  tag: it("DECISIONES", 0),
  title: it("Acción 2 | tardes con ahorro de nómina verificable.", 0.15, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", cnt(7, "15891"), { anim: CONTADOR }),
  impact: { value: 15891, text: "15.891 €" },
  plan: it("Plan propuesto: cerrar venta 16:00–20:00 desde abril, preservando tareas necesarias para cenas.", cueL(7, "cerrar", 0.4), { anim: 0.5, until: s7b }),
  bars: [
    { label: it("Ahorro efectivo central supuesto", cueL(7, "ahorro", 0.3), { anim: 1.0, until: s7b }), value: 5652, text: "5.652 €/mes", green: true },
    { label: it("Coste mensual del equipo de tarde en 2024", cueL(7, "ahorro", 0.3) + 0.4, { anim: 1.0, until: s7b }), value: 6280, text: "6.280 €/mes" },
  ],
  assumption: it("Supuesto: evitar el 90% del coste del equipo nuevo entre abril y diciembre; retener el 10% de ventas.", cueL(7, "verificable", 0), { anim: 0.5, until: s7b }),
  condTitle: it("Condición para activar", s7b + 0.3, { anim: 0.5 }),
  checks: [
    it("Acuerdo escrito", cueL(7, "acuerdo", 0.3), { anim: 0.5 }),
    it("Pagos de personal realmente evitados", cueL(7, "pagos", 0.3), { anim: 0.5 }),
    it("Cobertura de cenas intacta", cueL(7, "evitados", 0) + 0.3, { anim: 0.5 }),
  ],
  reassigned: it("Las horas reasignadas no cuentan como ahorro.", cueL(7, "reasignar", 0.3), { anim: 0.5 }),
  note: it("Coste de transición central 3.000 € en abril. Si el coste real lo supera, recalcular.", s7b + 0.3, { anim: 0.5 }),
};

export const S8 = {
  dur: durOf(8),
  tag: it("DECISIONES", 0),
  title: it("Acción 3 | reducir administración y ordenar pagos.", 0.15, { anim: 0.5 }),
  text: it("Reducción central del 25% en administración desde marzo. Base 2024: 72.200 €.", cueL(8, "reducir", 0.3), { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", cnt(8, "15961"), { anim: CONTADOR }),
  impact: { value: 15961, text: "15.961 €" },
  cards: [
    it("Reservas B: cancelar desde febrero, 45 €/mes, 0 reservas en 2024.", cueL(8, "cancelamos", 0.3), { anim: 0.6 }),
    it("Tarjeta: oferta escrita, de 0,32% + 30 €/mes a 0,28% + 15 €/mes desde febrero.", cueL(8, "renegociamos", 0.3), { anim: 0.6 }),
    it("Equipamiento, pago de 20.000 €: de enero a marzo.", cueL(8, "pago", 0.4), { anim: 1.4 }),
  ],
  warn: it("Es un cambio de calendario. El pago sigue incluido en la caja anual.", cueL(8, "aplaza", 0.3), { anim: 0.5 }),
  foot: it("Implantación: 400 € en enero · 16 h internas iniciales.", cueL(8, "aplaza", 0.3) + 0.4, { anim: 0.5 }),
};

export const S9 = {
  dur: durOf(9),
  tag: it("ESCENARIOS 2025 | SIMULACIÓN", 0),
  title: it("El impacto por acción depende del escenario.", 0.15, { anim: 0.5 }),
  legend: ["Prudente", "Central", "Optimista"],
  legendAt: 0.5,
  groups: [
    { label: "Precio M01", values: [4679, 12376, 17874], texts: ["4.679 €", "12.376 €", "17.874 €"] },
    { label: "Tardes", values: [4686, 15891, 26596], texts: ["4.686 €", "15.891 €", "26.596 €"] },
    { label: "Administración", values: [6801, 15961, 20846], texts: ["6.801 €", "15.961 €", "20.846 €"] },
  ],
  // columnas por escenario, cuando la voz nombra cada uno; cada medida entra 0,2 s después de la anterior
  scenAts: [cueL(9, "prudente", 0.3), cueL(9, "central", 0.3), cueL(9, "optimista", 0.3)],
  note: it("Interacción de comisiones incluida una vez: 156 € prudente, 107 € central, 67 € optimista.", cueL(9, "central", 0.3) + 1.2, { anim: 0.5 }),
  warn: it("El optimista es una posibilidad, no el resultado esperado ni una garantía.", cueL(9, "posibilidad", 0.4), { anim: 0.5 }),
};

export const S10 = {
  dur: durOf(10),
  tag: it("CAJA | SIMULACIÓN 2025", 0),
  title: it("La caja final incluye el pago aplazado del equipamiento.", 0.15, { anim: 0.5 }),
  leftTitle: it("Caja final por escenario", 0.4, { anim: 0.4 }),
  scen: [
    { label: "Prudente", value: 31342, text: "31.342 €" },
    { label: "Central", value: 59354, text: "59.354 €" },
    { label: "Optimista", value: 80403, text: "80.403 €" },
  ],
  scenAt: 0.5,
  rightTitle: it("Puente de caja · caso central", 0.5, { anim: 0.4 }),
  steps: [
    { label: "Caja inicial", delta: 55007, text: "55.007 €", kind: "total" },
    { label: "Flujo operativo base", delta: -7988, text: "− 7.988 €", kind: "neg" },
    { label: "Mejora central simulada", delta: 44335, text: "+ 44.335 €", kind: "pos" },
    { label: "Equipamiento en marzo", delta: -20000, text: "− 20.000 €", kind: "neg" },
    { label: "Amortización de principal", delta: -12000, text: "− 12.000 €", kind: "neg" },
    { label: "Caja final central", delta: 59354, text: "= 59.354 €", kind: "final" },
  ],
  // en el orden en que la voz las nombra
  stepsAts: [
    cueL(10, "55000", 0.6),
    cueL(10, "euros", 0.1),
    cueL(10, "mejora", 0.3),
    cueL(10, "equipamiento", 0.3),
    cueL(10, "deuda", 0.3),
    cueL(10, "caja", 0.3),
  ],
  alert: it("Sin plan, el mínimo proyectado a 8 semanas es 16.544 €, por debajo del umbral interno de 25.000 €.", cueL(10, "sin", 0.3), { anim: 0.5 }),
  final: it("El aplazamiento cambia el calendario. Los 20.000 € siguen pagándose. Beneficio y caja son magnitudes distintas.", cueL(10, "60000", 0.2), { anim: 0.5 }),
};

export const S11 = {
  dur: durOf(11),
  tag: it("SEGUIMIENTO", 0),
  title: it("La ejecución avanza con controles y condiciones.", 0.15, { anim: 0.5 }),
  rows: [
    { icon: "price", head: "M01", body: it("M01: contribución semanal; conservar al menos 95% de unidades comparables. Ajustar tras 2 semanas bajo la base.", cueL(11, "menu", 0.4), { anim: 0.6 }) },
    { icon: "clock", head: "Tardes", body: it("Tardes: desde abril, verificar pagos evitados de 5.652 €/mes. Sin evidencia: ahorro cero.", cueL(11, "tardes", 0.4), { anim: 0.6 }) },
    { icon: "admin", head: "Administración", body: it("Administración: medir el recorte central del 25% desde marzo y comprobar que no reaparezcan gastos en otras partidas.", cueL(11, "cero", 0) + 0.2, { anim: 0.6 }) },
    { icon: "cash", head: "Caja", body: it("Caja: actualizar semanalmente la previsión móvil de 8 semanas. Si cae bajo 25.000 €, reprogramar compromisos no esenciales.", cueL(11, "caja", 0.4), { anim: 0.6 }) },
    { icon: "chart", head: "Resultado", body: it("Resultado: si el EBITDA móvil de 3 meses sigue negativo, reevaluar todas las medidas. Revisar mensualmente de junio a diciembre.", cueL(11, "sigue", 1.0), { anim: 0.6 }) },
  ],
  timeline: [
    it("Enero–febrero: negociar y preparar", cueL(11, "reprogramamos", 0.2), { anim: 0.5 }),
    it("Marzo: iniciar prueba M01", cueL(11, "reprogramamos", 0.2) + 0.5, { anim: 0.5 }),
    it("Abril–mayo: activar tardes solo con ahorro documentado", cueL(11, "reprogramamos", 0.2) + 1.0, { anim: 0.5 }),
  ],
};

export const S12 = {
  dur: durOf(12),
  tag: it("CIERRE", 0),
  text: it("Tres medidas, probadas por etapas y con condiciones claras, para recuperar rentabilidad y proteger la caja.", 0.2, { anim: 0.6 }),
  icons: [
    it("Precio M01", cueL(12, "probadas", 0.3), { anim: 0.5 }),
    it("Franja de tarde", cueL(12, "probadas", 0.3) + 0.3, { anim: 0.5 }),
    it("Administración", cueL(12, "probadas", 0.3) + 0.6, { anim: 0.5 }),
  ],
  foot: it("La Plazuela · Simulación de enero de 2025, no una previsión aprobada.", cueL(12, "recuperar", 0.3), { anim: 0.5 }),
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];
