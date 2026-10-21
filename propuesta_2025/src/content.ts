// TODO el texto que sale en pantalla, con el segundo (dentro de la escena) en que aparece.
// `until`: si el texto desaparece antes de que acabe la escena.
// `anim`: segundos que tarda en quedar completo (contador, escritura letra a letra...).
// scripts/check.ts usa este archivo para comprobar cifras, tiempos de lectura y palabras por frase.

export type Item = { text: string; at: number; until?: number; anim?: number };

const it = (text: string, at: number, extra: Partial<Item> = {}): Item => ({ text, at, ...extra });

export const FADE = 0.25; // fundido de salida + fundido de entrada = 0,5 s entre escenas

export const S1 = {
  dur: 6,
  tag: it("LA PLAZUELA | PROPUESTA DE DECISIÓN", 0),
  brand: it("La Plazuela", 0.1, { anim: 0.5 }),
  title: it("Decisión de gestión para 2025", 0.3, { anim: 1.0 }),
  sub: it("Priorizar contribución y liquidez con tres medidas sujetas a evidencia.", 1.4, { anim: 0.5 }),
  foot: it("Para Elena · Simulación preparada en enero de 2025.", 1.9, { anim: 0.5 }),
};

export const S2 = {
  dur: 14,
  tag: it("RECOMENDACIÓN", 0),
  title: it("La decisión prioriza contribución y caja.", 0.2, { anim: 0.5 }),
  text: it("Probar tres medidas por etapas.", 0.8, { anim: 0.5 }),
  cards: [
    it("Precio M01: probar 14,50 € desde marzo.", 1.4, { anim: 0.6, until: 7.4 }),
    it("Franja de tarde: retirar 16:00–20:00 solo con ahorro real de nómina.", 2.0, { anim: 0.6, until: 7.4 }),
    it("Administración: reducir gastos y renegociar contratos.", 2.6, { anim: 0.6, until: 7.4 }),
  ],
  kpis: [
    { label: it("EBITDA central simulado", 7.7, { anim: 1.3 }), value: 39513, text: "39.513 €" },
    { label: it("Resultado antes de impuestos", 8.0, { anim: 1.3 }), value: 16216, text: "16.216 €" },
    { label: it("Caja final central simulada", 8.3, { anim: 1.3 }), value: 59354, text: "59.354 €" },
  ],
  bottom1: it("Mejora conjunta del EBITDA: +44.335 €.", 9.4, { anim: 0.5 }),
  bottom2: it("Ventas centrales 1.126.688 € frente a 1.164.724 € observadas.", 9.6, { anim: 0.5 }),
  warn: it("Simulación, no garantía. El ahorro de tardes exige pagos de personal realmente evitados y documentados.", 1.0, { anim: 0.5 }),
};

export const S3 = {
  dur: 16,
  tag: it("DIAGNÓSTICO | DATOS OBSERVADOS 2022–2024", 0),
  title: it("Las ventas crecieron mientras el EBITDA cayó.", 0.2, { anim: 0.5 }),
  salesTitle: it("Ventas netas", 0.8, { anim: 0.4 }),
  sales: [
    { year: "2022", value: 1019658, text: "1.019.658 €" },
    { year: "2023", value: 1069985, text: "1.069.985 €" },
    { year: "2024", value: 1164724, text: "1.164.724 €" },
  ],
  salesAt: 1.0, // cada columna tarda 0,6 s y empieza 0,4 s después de la anterior
  ebitdaTitle: it("EBITDA", 0.8, { anim: 0.4 }),
  ebitda: [
    { year: "2022", value: 102040, text: "102.040 €" },
    { year: "2023", value: 54604, text: "54.604 €" },
    { year: "2024", value: -4822, text: "−4.822 €" },
  ],
  ebitdaAt: 2.4,
  hl1: it("Ventas 2024: +8,9% frente a 2023.", 4.4, { anim: 0.5 }),
  hl2: it("EBITDA: 102.040 € en 2022 y −4.822 € en 2024.", 4.9, { anim: 0.5 }),
  final: it("En 2024, ingredientes + personal fueron el 80,4% de las ventas. Administración: 72.200 €.", 6.2, { anim: 0.5 }),
};

export const S4 = {
  dur: 16,
  tag: it("OPERACIÓN | DATOS OBSERVADOS 2024", 0),
  title: it("La franja de tarde no cubrió ni el coste del equipo.", 0.2, { anim: 0.5 }),
  bars: [
    { label: "Ventas", value: 68576, text: "68.576 €" },
    { label: "Coste del equipo", value: 75360, text: "75.360 €" },
  ],
  barsAt: 0.9,
  gap: { value: -6784, text: "−6.784 €", at: 2.4 },
  gapNote: it("Ventas menos coste del equipo, antes de ingredientes y otros costes", 2.8, { anim: 0.5 }),
  data: [
    { value: 17422, dec: 0, text: "17.422", unit: "visitas", sub: it("(3,94 € netos por visita)", 4.4, { anim: 1.3 }) },
    { value: 2099.67, dec: 2, text: "2.099,67", unit: "h sin demanda", sub: it("de 4.285 h regulares", 4.9, { anim: 1.3 }) },
    { value: 49.0, dec: 1, text: "49,0", unit: "%", sub: it("de las horas regulares de tarde", 5.4, { anim: 1.3 }) },
  ],
  final: it("Cerrar solo si se evita un pago real de personal. Reasignar horas no cuenta como ahorro.", 7.2, { anim: 0.5 }),
};

export const S5 = {
  dur: 14,
  tag: it("REFERENCIA DE PRECIOS | ORIENTATIVA", 0),
  title: it("El precio de M01 puede probarse a 14,50 €.", 0.2, { anim: 0.5 }),
  chartTitle: it("Precio del menú del día", 0.6, { anim: 0.4 }),
  bars: [
    { label: "La Plazuela hoy", value: 13.0, text: "13,00 €", main: true },
    { label: "dNorte", value: 13.9, text: "13,90 €" },
    { label: "Ginger", value: 14.5, text: "14,50 €" },
    { label: "En Busca", value: 17.0, text: "17,00 €" },
    { label: "Media Madrid", value: 14.8, text: "14,80 €" },
  ],
  barsAt: 0.8,
  avg: { value: 15.13, text: "15,13 €", at: 3.2 },
  avgLabel: it("de media de la muestra de 3 restaurantes", 3.2, { anim: 1.3 }),
  proposal: it("Propuesta para M01: 14,50 €", 3.9, { anim: 0.5 }),
  warn: it("Referencia orientativa. Los menús, sus inclusiones y gramajes no son equivalentes. La muestra no es representativa.", 4.4, { anim: 0.5 }),
  final: it("La prueba se limita a M01. Mantiene composición, cantidad y servicio.", 6.0, { anim: 0.5 }),
};

export const S6 = {
  dur: 14,
  tag: it("DECISIONES", 0),
  title: it("Acción 1 | probar el nuevo precio solo en M01.", 0.2, { anim: 0.5 }),
  from: { text: "13,00 €", at: 0.8 },
  to: { text: "14,50 €", at: 1.5 },
  text: it("Desde marzo, misma composición, cantidad y servicio.", 2.2, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", 2.8, { anim: 1.3 }),
  impact: { value: 12376, text: "12.376 €" },
  controlTitle: it("Prueba y control", 4.4, { anim: 0.5 }),
  control: [
    it("Preparar receta y TPV en enero–febrero.", 4.4, { anim: 0.5 }),
    it("Revisar semanas comparables a las 4 y 8 semanas.", 4.7, { anim: 0.5 }),
    it("Medir contribución M01, unidades y compras adicionales.", 5.0, { anim: 0.5 }),
  ],
  alert: [
    it("Alerta si las unidades caen más de 10%.", 5.4, { anim: 0.5 }),
    it("Ajustar si la contribución queda bajo la base durante 2 semanas comparables.", 5.4, { anim: 0.5 }),
  ],
};

export const S7 = {
  dur: 16,
  tag: it("DECISIONES", 0),
  title: it("Acción 2 | tardes con ahorro de nómina verificable.", 0.2, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", 0.8, { anim: 1.3 }),
  impact: { value: 15891, text: "15.891 €" },
  plan: it("Plan propuesto: cerrar venta 16:00–20:00 desde abril, preservando tareas necesarias para cenas.", 1.0, { anim: 0.5, until: 9.4 }),
  bars: [
    { label: it("Ahorro efectivo central supuesto", 1.6, { anim: 1.0, until: 9.4 }), value: 5652, text: "5.652 €/mes", green: true },
    { label: it("Coste mensual del equipo de tarde en 2024", 2.0, { anim: 1.0, until: 9.4 }), value: 6280, text: "6.280 €/mes" },
  ],
  assumption: it("Supuesto: evitar el 90% del coste del equipo nuevo entre abril y diciembre; retener el 10% de ventas.", 2.6, { anim: 0.5, until: 9.4 }),
  condTitle: it("Condición para activar", 9.7, { anim: 0.5 }),
  checks: [
    it("Acuerdo escrito", 10.0, { anim: 0.5 }),
    it("Pagos de personal realmente evitados", 10.5, { anim: 0.5 }),
    it("Cobertura de cenas intacta", 11.0, { anim: 0.5 }),
  ],
  reassigned: it("Las horas reasignadas no cuentan como ahorro.", 11.5, { anim: 0.5 }),
  note: it("Coste de transición central 3.000 € en abril. Si el coste real lo supera, recalcular.", 9.7, { anim: 0.5 }),
};

export const S8 = {
  dur: 16,
  tag: it("DECISIONES", 0),
  title: it("Acción 3 | reducir administración y ordenar pagos.", 0.2, { anim: 0.5 }),
  text: it("Reducción central del 25% en administración desde marzo. Base 2024: 72.200 €.", 0.8, { anim: 0.5 }),
  impactLabel: it("Impacto EBITDA central simulado", 1.4, { anim: 1.3 }),
  impact: { value: 15961, text: "15.961 €" },
  cards: [
    it("Reservas B: cancelar desde febrero, 45 €/mes, 0 reservas en 2024.", 3.2, { anim: 0.6 }),
    it("Tarjeta: oferta escrita, de 0,32% + 30 €/mes a 0,28% + 15 €/mes desde febrero.", 3.8, { anim: 0.6 }),
    it("Equipamiento, pago de 20.000 €: de enero a marzo.", 4.4, { anim: 1.4 }),
  ],
  warn: it("Es un cambio de calendario. El pago sigue incluido en la caja anual.", 6.2, { anim: 0.5 }),
  foot: it("Implantación: 400 € en enero · 16 h internas iniciales.", 6.6, { anim: 0.5 }),
};

export const S9 = {
  dur: 14,
  tag: it("ESCENARIOS 2025 | SIMULACIÓN", 0),
  title: it("El impacto por acción depende del escenario.", 0.2, { anim: 0.5 }),
  legend: ["Prudente", "Central", "Optimista"],
  groups: [
    { label: "Precio M01", values: [4679, 12376, 17874], texts: ["4.679 €", "12.376 €", "17.874 €"] },
    { label: "Tardes", values: [4686, 15891, 26596], texts: ["4.686 €", "15.891 €", "26.596 €"] },
    { label: "Administración", values: [6801, 15961, 20846], texts: ["6.801 €", "15.961 €", "20.846 €"] },
  ],
  groupsAt: 0.9, // cada grupo empieza 0,7 s después del anterior y tarda 0,9 s
  note: it("Interacción de comisiones incluida una vez: 156 € prudente, 107 € central, 67 € optimista.", 4.2, { anim: 0.5 }),
  warn: it("El optimista es una posibilidad, no el resultado esperado ni una garantía.", 4.8, { anim: 0.5 }),
};

export const S10 = {
  dur: 20,
  tag: it("CAJA | SIMULACIÓN 2025", 0),
  title: it("La caja final incluye el pago aplazado del equipamiento.", 0.2, { anim: 0.5 }),
  leftTitle: it("Caja final por escenario", 0.8, { anim: 0.4 }),
  scen: [
    { label: "Prudente", value: 31342, text: "31.342 €" },
    { label: "Central", value: 59354, text: "59.354 €" },
    { label: "Optimista", value: 80403, text: "80.403 €" },
  ],
  scenAt: 1.0,
  rightTitle: it("Puente de caja · caso central", 2.6, { anim: 0.4 }),
  steps: [
    { label: "Caja inicial", delta: 55007, text: "55.007 €", kind: "total" },
    { label: "Flujo operativo base", delta: -7988, text: "− 7.988 €", kind: "neg" },
    { label: "Mejora central simulada", delta: 44335, text: "+ 44.335 €", kind: "pos" },
    { label: "Equipamiento en marzo", delta: -20000, text: "− 20.000 €", kind: "neg" },
    { label: "Amortización de principal", delta: -12000, text: "− 12.000 €", kind: "neg" },
    { label: "Caja final central", delta: 59354, text: "= 59.354 €", kind: "final" },
  ],
  stepsAt: 2.8, // un paso cada 0,8 s, cada uno tarda 0,6 s
  alert: it("Sin plan, el mínimo proyectado a 8 semanas es 16.544 €, por debajo del umbral interno de 25.000 €.", 7.8, { anim: 0.5 }),
  final: it("El aplazamiento cambia el calendario. Los 20.000 € siguen pagándose. Beneficio y caja son magnitudes distintas.", 9.4, { anim: 0.5 }),
};

export const S11 = {
  dur: 20,
  tag: it("SEGUIMIENTO", 0),
  title: it("La ejecución avanza con controles y condiciones.", 0.2, { anim: 0.5 }),
  rows: [
    { icon: "price", head: "M01", body: it("M01: contribución semanal; conservar al menos 95% de unidades comparables. Ajustar tras 2 semanas bajo la base.", 1.0, { anim: 0.6 }) },
    { icon: "clock", head: "Tardes", body: it("Tardes: desde abril, verificar pagos evitados de 5.652 €/mes. Sin evidencia: ahorro cero.", 1.7, { anim: 0.6 }) },
    { icon: "admin", head: "Administración", body: it("Administración: medir el recorte central del 25% desde marzo y comprobar que no reaparezcan gastos en otras partidas.", 2.4, { anim: 0.6 }) },
    { icon: "cash", head: "Caja", body: it("Caja: actualizar semanalmente la previsión móvil de 8 semanas. Si cae bajo 25.000 €, reprogramar compromisos no esenciales.", 3.1, { anim: 0.6 }) },
    { icon: "chart", head: "Resultado", body: it("Resultado: si el EBITDA móvil de 3 meses sigue negativo, reevaluar todas las medidas. Revisar mensualmente de junio a diciembre.", 3.8, { anim: 0.6 }) },
  ],
  timeline: [
    it("Enero–febrero: negociar y preparar", 5.0, { anim: 0.5 }),
    it("Marzo: iniciar prueba M01", 5.6, { anim: 0.5 }),
    it("Abril–mayo: activar tardes solo con ahorro documentado", 6.2, { anim: 0.5 }),
  ],
};

export const S12 = {
  dur: 8,
  tag: it("CIERRE", 0),
  text: it("Tres medidas, probadas por etapas y con condiciones claras, para recuperar rentabilidad y proteger la caja.", 0.3, { anim: 0.6 }),
  icons: [it("Precio M01", 1.4, { anim: 0.5 }), it("Franja de tarde", 1.7, { anim: 0.5 }), it("Administración", 2.0, { anim: 0.5 })],
  foot: it("La Plazuela · Simulación de enero de 2025, no una previsión aprobada.", 2.4, { anim: 0.5 }),
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];
export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);
