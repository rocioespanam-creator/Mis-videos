// TODO el texto que sale en pantalla, con el segundo (dentro de la escena) en que aparece.
// `until`: si desaparece antes de que acabe la escena. `anim`: segundos hasta quedar completo.
// `lastAnim`: segundo en que termina la última animación de la escena (debe quedar quieta >= 2 s).
// scripts/check.ts usa este archivo para comprobar cifras, tiempos de lectura y palabras por frase.

export type Item = { text: string; at: number; until?: number; anim?: number };
const it = (text: string, at: number, extra: Partial<Item> = {}): Item => ({ text, at, ...extra });

export const FADE = 0.25; // 0,25 s de salida + 0,25 s de entrada = fundido de 0,5 s

export const S1 = {
  dur: 6,
  lastAnim: 2.4,
  tag: it("LA PLAZUELA | PROPUESTA DE DECISIÓN", 0),
  brand: it("La Plazuela", 0.1, { anim: 0.5 }),
  title: it("Decisión de gestión para 2025", 0.3, { anim: 1.0 }),
  sub: it("Priorizar contribución y liquidez con tres medidas sujetas a evidencia.", 1.4, { anim: 0.5 }),
  foot: it("Para Elena · Simulación preparada en enero de 2025.", 1.9, { anim: 0.5 }),
};

export const S2 = {
  dur: 12,
  lastAnim: 6.5,
  tag: it("DIAGNÓSTICO | DATOS OBSERVADOS 2022–2024", 0),
  title: it("Las ventas crecieron mientras el EBITDA cayó.", 0.2, { anim: 0.5 }),
  sales: { label: it("Ventas netas 2024", 1.0, { anim: 1.9 }), value: 1164724, text: "1.164.724 €", from: it("desde 1.019.658 € en 2022", 2.0, { anim: 0.5 }) },
  ebitda: { label: it("EBITDA 2024", 2.8, { anim: 1.9 }), value: -4822, text: "−4.822 €", from: it("desde 102.040 € en 2022", 3.8, { anim: 0.5 }) },
  hl: it("Ventas 2024: +8,9% frente a 2023.", 5.0, { anim: 0.5 }),
  final: it("En 2024, ingredientes + personal fueron el 80,4% de las ventas.", 6.0, { anim: 0.5 }),
};

export const S3 = {
  dur: 10,
  lastAnim: 4.5,
  tag: it("OPERACIÓN | DATOS OBSERVADOS 2024", 0),
  title: it("La franja de tarde no cubrió ni el coste del equipo.", 0.2, { anim: 0.5 }),
  clockAt: 0.8,
  clockLabel: it("16:00–20:00", 0.8, { anim: 1.4 }),
  gap: { value: -6784, text: "−6.784 €", at: 1.5 },
  gapNote: it("Ventas menos coste del equipo, antes de ingredientes y otros costes", 2.3, { anim: 0.5 }),
  chips: [it("Ventas 68.576 €", 3.0, { anim: 0.5 }), it("Coste del equipo 75.360 €", 3.3, { anim: 0.5 })],
  hours: it("49,0% de las horas regulares de tarde, sin demanda", 4.0, { anim: 0.5 }),
};

export const S4 = {
  dur: 8,
  lastAnim: 3.8,
  tag: it("RECOMENDACIÓN", 0),
  title: it("La decisión prioriza contribución y caja.", 0.2, { anim: 0.5 }),
  text: it("Probar tres medidas por etapas.", 0.8, { anim: 0.5 }),
  dishes: [it("Precio M01", 1.6, { anim: 1.3 }), it("Franja de tarde", 2.0, { anim: 1.3 }), it("Administración", 2.4, { anim: 1.3 })],
};

export const S5 = {
  dur: 9,
  lastAnim: 4.5,
  tag: it("DECISIONES", 0),
  title: it("Acción 1 | probar el nuevo precio solo en M01.", 0.2, { anim: 0.5 }),
  tagAt: 0.6,
  flipAt: 1.6,
  from: "13,00 €",
  to: "14,50 €",
  text: it("Desde marzo, misma composición, cantidad y servicio.", 2.3, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", 2.9, { anim: 1.3 }),
  impact: { value: 12376, text: "12.376 €" },
  alert: it("Alerta si las unidades caen más de 10%.", 4.0, { anim: 0.5 }),
};

export const S6 = {
  dur: 9,
  lastAnim: 4.9,
  tag: it("DECISIONES", 0),
  title: it("Acción 2 | tardes con ahorro de nómina verificable.", 0.2, { anim: 0.5 }),
  signAt: 0.6,
  plan: it("Plan propuesto: cerrar venta 16:00–20:00 desde abril, preservando tareas necesarias para cenas.", 1.6, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", 2.4, { anim: 1.3 }),
  impact: { value: 15891, text: "15.891 €" },
  condTitle: it("Condición para activar", 3.4, { anim: 0.5 }),
  checks: [it("Acuerdo escrito", 3.6, { anim: 0.6 }), it("Pagos de personal realmente evitados", 4.0, { anim: 0.6 }), it("Cobertura de cenas intacta", 4.3, { anim: 0.6 })],
};

export const S7 = {
  dur: 9,
  lastAnim: 4.2,
  tag: it("DECISIONES", 0),
  title: it("Acción 3 | reducir administración y ordenar pagos.", 0.2, { anim: 0.5 }),
  cutAt: 0.7,
  text: it("Reducción central del 25% en administración desde marzo.", 1.2, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", 2.0, { anim: 1.3 }),
  impact: { value: 15961, text: "15.961 €" },
  equip: it("Equipamiento, pago de 20.000 €: de enero a marzo.", 3.7, { anim: 0.5 }),
};

export const S8 = {
  dur: 12,
  lastAnim: 6.1,
  tag: it("CAJA | SIMULACIÓN 2025", 0),
  title: it("La caja final incluye el pago aplazado del equipamiento.", 0.2, { anim: 0.5 }),
  ebitdaLabel: it("EBITDA central simulado", 0.8, { anim: 1.3 }),
  ebitda: { value: 39513, text: "39.513 €" },
  mejora: it("Mejora conjunta del EBITDA: +44.335 €.", 1.8, { anim: 0.5 }),
  ticketAt: 2.2,
  ticketStep: 0.5,
  rows: [
    { label: "Caja inicial", text: "55.007 €", kind: "total", delta: 55007 },
    { label: "Flujo operativo base", text: "− 7.988 €", kind: "neg", delta: -7988 },
    { label: "Mejora central simulada", text: "+ 44.335 €", kind: "pos", delta: 44335 },
    { label: "Equipamiento en marzo", text: "− 20.000 €", kind: "neg", delta: -20000 },
    { label: "Amortización de principal", text: "− 12.000 €", kind: "neg", delta: -12000 },
    { label: "Caja final central", text: "= 59.354 €", kind: "final", delta: 59354 },
  ],
  alert: it("Sin plan, el mínimo proyectado a 8 semanas es 16.544 €, por debajo del umbral interno de 25.000 €.", 5.4, { anim: 0.5 }),
  warn: it("Simulación, no garantía.", 5.6, { anim: 0.5 }),
};

export const S9 = {
  dur: 8,
  lastAnim: 2.9,
  tag: it("CIERRE", 0),
  text: it("Tres medidas, probadas por etapas y con condiciones claras, para recuperar rentabilidad y proteger la caja.", 0.3, { anim: 0.6 }),
  icons: [it("Precio M01", 1.4, { anim: 0.5 }), it("Franja de tarde", 1.7, { anim: 0.5 }), it("Administración", 2.0, { anim: 0.5 })],
  foot: it("La Plazuela · Simulación de enero de 2025, no una previsión aprobada.", 2.4, { anim: 0.5 }),
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);
