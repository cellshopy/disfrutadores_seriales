/* =========================================================
   Disfrutadores Seriales de la Vida — Quiz Demo (Cellshop)
   - 10 preguntas
   - Captura de datos ANTES del resultado
   - Guarda leads en Google Sheets (Apps Script)
   - Resultado divertido + link a sección de cellshop.com.py

   IMPORTANTE:
   - Este JS evita CORS/preflight enviando el POST sin headers.
   ========================================================= */

// ===== CONFIG =====
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyEUMff0DqhP6HN_ryKPcO3XRngaCptaNqHcueYWyBa7zkCASYW2r_iwZhhWlMRLfDA/exec";

// Links a secciones (ajustables)
const redirectMap = {
  TECH: "https://cellshop.com.py/todos-los-departamentos/tecnologia",
  BEAUTY: "https://cellshop.com.py/todos-los-departamentos/belleza",
  GOURMET: "https://cellshop.com.py/todos-los-departamentos/bebidas-y-alimentos",
  OUTDOOR: "https://cellshop.com.py/todos-los-departamentos/pesca-y-aventura",
  HOME: "https://cellshop.com.py/todos-los-departamentos/mesa-y-cocina",
  HOBBY: "https://cellshop.com.py/todos-los-departamentos/hobby",
};

// Resultados divertidos
const archetypes = {
  TECH: {
    title: "Disfrutador Serial TECH",
    text:
      "Vivís en modo actualización. Te emocionan las novedades, los “unboxing” y el placer de que todo funcione mejor. No comprás tecnología: comprás posibilidades. Si existe una versión mejor… ya sabés lo que pasa.",
    interestLabel: "Tecnología (celus, audio, gadgets)",
  },
  BEAUTY: {
    title: "Disfrutador Serial BEAUTY",
    text:
      "Tu placer tiene aroma propio. Un perfume no es un producto: es presencia. Te gusta probar, elegir según el mood y salir al mundo como quien dice “acá estoy”. Spoiler: siempre te preguntan qué usás.",
    interestLabel: "Belleza (perfumes, makeup, skincare)",
  },
  GOURMET: {
    title: "Disfrutador Serial GOURMET",
    text:
      "Probás la vida a través del sabor. Tenés radar para lo rico, lo nuevo y lo que vale la pena compartir. No necesitás excusa para brindar: inventás la ocasión. La rutina te aburre, la curiosidad te guía.",
    interestLabel: "Gourmet (bebidas y alimentos)",
  },
  OUTDOOR: {
    title: "Disfrutador Serial OUTDOOR",
    text:
      "Si no hay aventura, no cuenta. Sos de los que dicen “vamos” y después vemos. Te encanta estar listo para el plan, moverte, salir, explorar. No acumulás cosas: acumulás historias (y anécdotas épicas).",
    interestLabel: "Outdoor (camping, pesca, deportes)",
  },
  HOME: {
    title: "Disfrutador Serial HOME",
    text:
      "El lujo para vos es cotidiano: una buena taza, una cocina que rinde, un ambiente lindo. No necesitás salir para disfrutar: sabés crear momentos. Si vas a estar en casa… que sea espectacular.",
    interestLabel: "Home (mesa, cocina, hogar)",
  },
  HOBBY: {
    title: "Disfrutador Serial HOBBY",
    text:
      "No tenés pasatiempos: tenés pasiones. Cuando algo te gusta, te obsesiona (en el buen sentido). Podés perder la noción del tiempo jugando, armando o mejorando. “Uno más y paro”… mentira, no parás.",
    interestLabel: "Hobby (juegos, drones, coleccionables)",
  },
};

// Preguntas (10)
const questions = [
  {
    q: "Un sábado ideal para vos es…",
    a: [
      { t: "Probar un gadget nuevo", s: "TECH", d: "Modo estreno: ON." },
      { t: "Ritual de perfume + skincare", s: "BEAUTY", d: "Tu mood empieza en el espejo." },
      { t: "Descubrir algo rico para tomar o picar", s: "GOURMET", d: "El paladar manda." },
      { t: "Salir a explorar / aire libre", s: "OUTDOOR", d: "Plan con movimiento." },
      { t: "Cocinar o hacer la casa más linda", s: "HOME", d: "Confort bien pensado." },
      { t: "Jugar / armar / coleccionar algo", s: "HOBBY", d: "Entrás en tu mundo." },
    ],
  },
  {
    q: "Te regalás algo y elegís…",
    a: [
      { t: "Auriculares / smartwatch / accesorio", s: "TECH", d: "Upgrade inmediato." },
      { t: "Perfume o maquillaje", s: "BEAUTY", d: "Un detalle que cambia todo." },
      { t: "Una bebida especial", s: "GOURMET", d: "La vida: edición limitada." },
      { t: "Equipo para salir", s: "OUTDOOR", d: "Listo para el plan." },
      { t: "Algo para cocina/hogar", s: "HOME", d: "Que rinda más el día." },
      { t: "Algo para tu hobby", s: "HOBBY", d: "Satisfacción garantizada." },
    ],
  },
  {
    q: "Tu frase interna más probable:",
    a: [
      { t: "“Si existe una versión mejor, la quiero.”", s: "TECH", d: "Cero dudas." },
      { t: "“Oler bien es presencia.”", s: "BEAUTY", d: "100% vos." },
      { t: "“La vida es para probar cosas nuevas.”", s: "GOURMET", d: "Curiosidad activa." },
      { t: "“Vamos. Después vemos.”", s: "OUTDOOR", d: "Energía pura." },
      { t: "“Si voy a estar acá, que sea espectacular.”", s: "HOME", d: "Confort con intención." },
      { t: "“Un nivel más y paro.” (mentira)", s: "HOBBY", d: "No parás." },
    ],
  },
  {
    q: "En un grupo de amigos, vos sos…",
    a: [
      { t: "El que recomienda tecnología", s: "TECH", d: "Tu opinión vale." },
      { t: "El que siempre está impecable", s: "BEAUTY", d: "Firma personal." },
      { t: "El que arma la previa/after", s: "GOURMET", d: "Siempre hay algo rico." },
      { t: "El que organiza planes", s: "OUTDOOR", d: "Motor del grupo." },
      { t: "El que invita a su casa", s: "HOME", d: "Anfitrión top." },
      { t: "El que propone juegos/hobbies", s: "HOBBY", d: "Diversión asegurada." },
    ],
  },
  {
    q: "Tu compra impulsiva típica:",
    a: [
      { t: "Accesorios / gadgets", s: "TECH", d: "Pequeño gran upgrade." },
      { t: "Un perfume “porque sí”", s: "BEAUTY", d: "Autopremio." },
      { t: "Algo nuevo para probar", s: "GOURMET", d: "Aventura de sabor." },
      { t: "Equipamiento para salida", s: "OUTDOOR", d: "Preparación total." },
      { t: "Algo útil para la casa", s: "HOME", d: "Confort inmediato." },
      { t: "Algo coleccionable/juego", s: "HOBBY", d: "Dopamina pura." },
    ],
  },
  {
    q: "¿Qué te da más satisfacción?",
    a: [
      { t: "Configurar y optimizar", s: "TECH", d: "Todo bajo control." },
      { t: "Tu “firma” (cómo olés/te ves)", s: "BEAUTY", d: "Expresión personal." },
      { t: "Encontrar el sabor perfecto", s: "GOURMET", d: "Bingo." },
      { t: "Llegar a un lugar nuevo", s: "OUTDOOR", d: "Historia nueva." },
      { t: "Que tu casa esté impecable", s: "HOME", d: "Paz mental." },
      { t: "Mejorar en tu pasión", s: "HOBBY", d: "Progreso real." },
    ],
  },
  {
    q: "Tu zona feliz en una tienda:",
    a: [
      { t: "Electrónica", s: "TECH", d: "Brillan los ojos." },
      { t: "Perfumería", s: "BEAUTY", d: "Probás todo." },
      { t: "Bebidas y alimentos", s: "GOURMET", d: "Descubrimiento." },
      { t: "Aventura / deportes", s: "OUTDOOR", d: "Modo plan." },
      { t: "Mesa y cocina", s: "HOME", d: "Detalles que suman." },
      { t: "Juegos / hobby", s: "HOBBY", d: "No querés salir." },
    ],
  },
  {
    q: "¿Qué te cuesta más resistir?",
    a: [
      { t: "Lanzamientos", s: "TECH", d: "Tentación total." },
      { t: "Fragancias nuevas", s: "BEAUTY", d: "Una más…”" },
      { t: "Ediciones especiales", s: "GOURMET", d: "Hay que probar." },
      { t: "Equiparte mejor", s: "OUTDOOR", d: "Siempre falta algo." },
      { t: "Mejorar la rutina en casa", s: "HOME", d: "Pequeños lujos." },
      { t: "Un hobby nuevo", s: "HOBBY", d: "Caés fácil." },
    ],
  },
  {
    q: "Elegí un disfrute chiquito:",
    a: [
      { t: "Música con buen sonido", s: "TECH", d: "Se siente." },
      { t: "Oler increíble todo el día", s: "BEAUTY", d: "Presencia." },
      { t: "Un brindis como premio", s: "GOURMET", d: "Salud." },
      { t: "Aire libre y movimiento", s: "OUTDOOR", d: "Vivo/a." },
      { t: "Café en casa bien hecho", s: "HOME", d: "Ritual." },
      { t: "Un rato de juego/armado", s: "HOBBY", d: "Flow." },
    ],
  },
  {
    q: "Tu estilo de disfrute es más…",
    a: [
      { t: "Eficiente y con accesorios correctos", s: "TECH", d: "Optimización." },
      { t: "Sensorial y con detalles", s: "BEAUTY", d: "Estética." },
      { t: "Curioso y explorador", s: "GOURMET", d: "Nuevos sabores." },
      { t: "Activo y espontáneo", s: "OUTDOOR", d: "Aventura." },
      { t: "Cálido y cómodo", s: "HOME", d: "Hogar." },
      { t: "Intenso y apasionado", s: "HOBBY", d: "Obsesión linda." },
    ],
  },
];

// ===== STATE =====
let idx = 0;
let selected = Array(questions.length).fill(null);
let scores = { TECH: 0, BEAUTY: 0, GOURMET: 0, OUTDOOR: 0, HOME: 0, HOBBY: 0 };
let finalPrimary = null;
let finalSecondary = null;
let finalScore = 0;

// ===== DOM =====
const screens = {
  intro: document.getElementById("screen-intro"),
  quiz: document.getElementById("screen-quiz"),
  lead: document.getElementById("screen-lead"),
  result: document.getElementById("screen-result"),
};

const btnStart = document.getElementById("btn-start");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const qTitle = document.getElementById("question-title");
const answersBox = document.getElementById("answers");
const progressFill = document.getElementById("progress-fill");
const qCurrent = document.getElementById("q-current");
const qTotal = document.getElementById("q-total");

const leadForm = document.getElementById("lead-form");
const leadStatus = document.getElementById("lead-status");
const interestBox = document.getElementById("interest-box");

const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const btnGoCategory = document.getElementById("btn-go-category");
const btnRestart = document.getElementById("btn-restart");
const shareText = document.getElementById("share-text");

// ===== HELPERS =====
function show(screenKey) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[screenKey].classList.add("active");
}

function resetAll() {
  idx = 0;
  selected = Array(questions.length).fill(null);
  scores = { TECH: 0, BEAUTY: 0, GOURMET: 0, OUTDOOR: 0, HOME: 0, HOBBY: 0 };
  finalPrimary = null;
  finalSecondary = null;
  finalScore = 0;

  if (leadForm) leadForm.reset();
  if (leadStatus) leadStatus.textContent = "";
}

function computeScores() {
  scores = { TECH: 0, BEAUTY: 0, GOURMET: 0, OUTDOOR: 0, HOME: 0, HOBBY: 0 };
  selected.forEach((choiceIndex, qIndex) => {
    if (choiceIndex === null) return;
    const bucket = questions[qIndex].a[choiceIndex].s;
    scores[bucket] += 1;
  });
}

function getTopTwo() {
  const pairs = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [p1, p2] = pairs;

  finalPrimary = p1[0];
  finalScore = p1[1];

  // híbrido si el 2do queda a 1 punto o menos
  finalSecondary = p2 && p1[1] - p2[1] <= 1 ? p2[0] : null;
}

function setProgress() {
  qTotal.textContent = String(questions.length);
  qCurrent.textContent = String(idx + 1);

  const denom = Math.max(1, questions.length - 1);
  const pct = Math.round((idx / denom) * 100);
  progressFill.style.width = `${pct}%`;
}

function renderQuestion() {
  setProgress();
  const item = questions[idx];

  qTitle.textContent = item.q;
  answersBox.innerHTML = "";

  item.a.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "answer" + (selected[idx] === i ? " selected" : "");
    btn.type = "button";
    btn.innerHTML = `${opt.t}<small>${opt.d}</small>`;

    btn.addEventListener("click", () => {
      selected[idx] = i;
      [...answersBox.children].forEach((c) => c.classList.remove("selected"));
      btn.classList.add("selected");
      btnNext.disabled = false;
    });

    answersBox.appendChild(btn);
  });

  btnBack.disabled = idx === 0;
  btnNext.disabled = selected[idx] === null;
  btnNext.textContent = idx === questions.length - 1 ? "Terminar" : "Siguiente";
}

function buildInterestChecks(primary, secondary) {
  const order = ["TECH", "BEAUTY", "GOURMET", "OUTDOOR", "HOME", "HOBBY"];
  const defaultChecked = new Set([primary, ...(secondary ? [secondary] : [])]);

  interestBox.innerHTML = "";
  order.forEach((key) => {
    const wrap = document.createElement("label");
    wrap.className = "check";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = key;
    input.checked = defaultChecked.has(key);

    const label = document.createElement("div");
    label.innerHTML = `<strong>${archetypes[key].interestLabel}</strong><br/><span>Personalizamos tu experiencia</span>`;

    wrap.appendChild(input);
    wrap.appendChild(label);
    interestBox.appendChild(wrap);
  });
}

function getUTM(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

function getSelectedInterests() {
  const checks = interestBox.querySelectorAll('input[type="checkbox"]');
  return [...checks].filter((c) => c.checked).map((c) => c.value);
}

function buildResultCopy(primary, secondary) {
  if (!secondary) return archetypes[primary].text;

  const combos = {
    "TECH+BEAUTY":
      "Tenés estética en alta definición: te gusta que funcione perfecto y que se vea/sienta mejor todavía.",
    "BEAUTY+TECH":
      "Tenés estética en alta definición: te gusta que funcione perfecto y que se vea/sienta mejor todavía.",
    "GOURMET+HOME":
      "Sos placer bien servido: rituales en casa y algo rico para convertir cualquier día en ocasión.",
    "HOME+GOURMET":
      "Sos placer bien servido: rituales en casa y algo rico para convertir cualquier día en ocasión.",
    "OUTDOOR+HOBBY":
      "Sos adrenalina con obsesión: salís a buscar historias y después te quedás horas perfeccionando tu pasión.",
    "HOBBY+OUTDOOR":
      "Sos adrenalina con obsesión: salís a buscar historias y después te quedás horas perfeccionando tu pasión.",
  };

  const key = `${primary}+${secondary}`;
  const extra = combos[key] || "Tenés doble motor: no te alcanza con un solo tipo de disfrute. Y eso… es un talento.";

  return `${archetypes[primary].text}\n\nBonus híbrido: ${extra}`;
}

// Envío a Apps Script SIN headers para evitar CORS preflight
async function sendLead(payload) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Apps Script a veces devuelve texto aunque sea JSON
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return { status: "error", message: text };
  }
}

// ===== EVENTS =====
btnStart.addEventListener("click", () => {
  show("quiz");
  renderQuestion();
});

btnBack.addEventListener("click", () => {
  if (idx === 0) return;
  idx -= 1;
  renderQuestion();
});

btnNext.addEventListener("click", () => {
  if (selected[idx] === null) return;

  if (idx === questions.length - 1) {
    computeScores();
    getTopTwo();
    buildInterestChecks(finalPrimary, finalSecondary);
    show("lead");
    return;
  }

  idx += 1;
  renderQuestion();
});

leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  leadStatus.textContent = "Guardando tu perfil…";

  const nombre = document.getElementById("inp-nombre").value.trim();
  const email = document.getElementById("inp-email").value.trim();
  const whatsapp = document.getElementById("inp-whatsapp").value.trim();
  const ciudad = document.getElementById("inp-ciudad").value.trim();
  const acepta = document.getElementById("inp-consent").checked;

  const intereses = getSelectedInterests().join(", ");

  const payload = {
    nombre,
    email,
    whatsapp,
    ciudad,
    perfil: finalPrimary,
    perfil_secundario: finalSecondary || "",
    puntaje: finalScore,
    intereses,
    acepta_marketing: acepta,
    utm_source: getUTM("utm_source"),
    utm_medium: getUTM("utm_medium"),
    utm_campaign: getUTM("utm_campaign"),
    utm_content: getUTM("utm_content"),
    utm_term: getUTM("utm_term"),
    page_url: window.location.href,
  };

  try {
    const out = await sendLead(payload);

    if (!out || out.status !== "success") {
      throw new Error(out?.message || "Error guardando datos");
    }

    // Pintar resultado
    const baseTitle = archetypes[finalPrimary].title;
    const finalTitle = finalSecondary ? `${baseTitle} (híbrido con ${finalSecondary})` : baseTitle;

    resultTitle.textContent = finalTitle;
    resultText.textContent = buildResultCopy(finalPrimary, finalSecondary);

    // Link a sección + tracking
    const target = new URL(redirectMap[finalPrimary]);
    target.searchParams.set("utm_source", payload.utm_source || "quiz");
    target.searchParams.set("utm_medium", payload.utm_medium || "landing");
    target.searchParams.set("utm_campaign", payload.utm_campaign || "disfrutadores_seriales");
    target.searchParams.set("perfil", finalPrimary.toLowerCase());

    btnGoCategory.href = target.toString();

    // Texto share (simple)
    shareText.value = `Soy ${archetypes[finalPrimary].title}. ¿Y vos? Hacé el test.`;

    leadStatus.textContent = "";
    show("result");
  } catch (err) {
    console.error(err);
    leadStatus.textContent = "Ups. No pudimos guardar tus datos. Probá de nuevo.";
  }
});

btnRestart.addEventListener("click", () => {
  resetAll();
  show("intro");
});

// ===== INIT =====
resetAll();
show("intro");
