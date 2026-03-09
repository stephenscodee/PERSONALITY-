import React, { useState, useEffect, useRef } from "react";

const questions = [
  { id: 1, text: "Me siento cómodo siendo el centro de atención en reuniones sociales.", trait: "extraversion" },
  { id: 2, text: "Disfruto explorar ideas abstractas y filosóficas.", trait: "openness" },
  { id: 3, text: "Siempre mantengo mis compromisos, incluso cuando es difícil.", trait: "conscientiousness" },
  { id: 4, text: "Siento empatía fácilmente hacia las emociones de otras personas.", trait: "agreeableness" },
  { id: 5, text: "Con frecuencia me siento ansioso o preocupado sin razón aparente.", trait: "neuroticism" },
  { id: 6, text: "Prefiero trabajar en equipo antes que de forma independiente.", trait: "extraversion" },
  { id: 7, text: "Me atraen las experiencias artísticas y creativas.", trait: "openness" },
  { id: 8, text: "Organizo mi espacio de trabajo antes de comenzar cualquier tarea.", trait: "conscientiousness" },
  { id: 9, text: "Evito confrontaciones, prefiero la armonía sobre tener razón.", trait: "agreeableness" },
  { id: 10, text: "Mi estado de ánimo puede cambiar drásticamente en poco tiempo.", trait: "neuroticism" },
  { id: 11, text: "Gano energía al estar rodeado de muchas personas.", trait: "extraversion" },
  { id: 12, text: "Me gusta cuestionar las normas establecidas y pensar diferente.", trait: "openness" },
  { id: 13, text: "Creo listas y planes detallados para gestionar mi tiempo.", trait: "conscientiousness" },
  { id: 14, text: "Pongo las necesidades de otros antes que las mías propias.", trait: "agreeableness" },
  { id: 15, text: "Me cuesta recuperarme emocionalmente de situaciones difíciles.", trait: "neuroticism" },
];

const traitConfig = {
  openness: {
    label: "Apertura",
    sublabel: "Creatividad & Curiosidad",
    color: "#C8A86B",
    glow: "rgba(200, 168, 107, 0.4)",
    description: "Tu mente explora territorios inexplorados con voracidad intelectual.",
    icon: "◈",
  },
  conscientiousness: {
    label: "Escrupulosidad",
    sublabel: "Disciplina & Organización",
    color: "#8BA7C4",
    glow: "rgba(139, 167, 196, 0.4)",
    description: "Tu rigor y determinación construyen la arquitectura de tus metas.",
    icon: "◆",
  },
  extraversion: {
    label: "Extraversión",
    sublabel: "Sociabilidad & Energía",
    color: "#C47E8B",
    glow: "rgba(196, 126, 139, 0.4)",
    description: "El mundo social es tu escenario natural de expresión y vitalidad.",
    icon: "◉",
  },
  agreeableness: {
    label: "Amabilidad",
    sublabel: "Empatía & Cooperación",
    color: "#8BAF8B",
    glow: "rgba(139, 175, 139, 0.4)",
    description: "Tu capacidad empática teje conexiones profundas y genuinas.",
    icon: "◎",
  },
  neuroticism: {
    label: "Neuroticismo",
    sublabel: "Sensibilidad Emocional",
    color: "#A68BAF",
    glow: "rgba(166, 139, 175, 0.4)",
    description: "Tu profundidad emocional refleja una vida interior rica e intensa.",
    icon: "◐",
  },
};

const archetypes = [
  {
    name: "El Visionario",
    id: "visionary",
    description: "Ves el mundo no como es, sino como podría ser. Tu mente es un laboratorio de posibilidades infinitas.",
    traits: { openness: 70, extraversion: 60 }
  },
  {
    name: "El Arquitecto",
    id: "architect",
    description: "Construyes puentes entre la imaginación y la realidad con precisión y disciplina quirúrgica.",
    traits: { conscientiousness: 75, openness: 60 }
  },
  {
    name: "El Protector",
    id: "protector",
    description: "Tu fuerza reside en tu capacidad para sostener y cuidar los vínculos que dan sentido a la vida.",
    traits: { agreeableness: 75, conscientiousness: 60 }
  },
  {
    name: "El Explorador",
    id: "explorer",
    description: "Tu brújula interna siempre apunta hacia lo desconocido, buscando la belleza en lo efímero.",
    traits: { openness: 80, conscientiousness: 40 }
  },
  {
    name: "El Líder",
    id: "leader",
    description: "Posees la rara habilidad de inspirar acción a través de tu energía y visión estructurada.",
    traits: { extraversion: 75, conscientiousness: 70 }
  },
  {
    name: "El Mediador",
    id: "mediator",
    description: "Tejes armonía en el caos, escuchando las notas que otros pasan por alto en la sinfonía social.",
    traits: { agreeableness: 80, extraversion: 40 }
  },
  {
    name: "El Pensador Profundo",
    id: "thinker",
    description: "Tu silencio no es vacío, sino una rica biblioteca de reflexiones y análisis meticulosos.",
    traits: { openness: 70, extraversion: 30, conscientiousness: 60 }
  }
];

function getArchetype(scores) {
  let bestMatch = archetypes[0];
  let minDiff = Infinity;

  archetypes.forEach(arc => {
    let diff = 0;
    Object.entries(arc.traits).forEach(([trait, target]) => {
      diff += Math.pow(scores[trait] - target, 2);
    });
    if (diff < minDiff) {
      minDiff = diff;
      bestMatch = arc;
    }
  });

  return bestMatch;
}


function AnimatedNumber({ value, duration = 1800 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{display}</>;
}

function RadarChart({ scores }) {
  const cx = 140, cy = 140, r = 100;
  const traits = Object.keys(traitConfig);
  const angleStep = (2 * Math.PI) / traits.length;

  const getPoint = (index, radius) => {
    const angle = index * angleStep - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const scorePath = traits
    .map((t, i) => {
      const p = getPoint(i, (scores[t] / 100) * r);
      return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
    })
    .join(" ") + " Z";

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width="280" height="280" viewBox="0 0 280 280" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8A86B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C47E8B" stopOpacity="0.1" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {gridLevels.map((level, li) => (
        <polygon
          key={li}
          points={traits.map((_, i) => { const p = getPoint(i, level * r); return `${p.x},${p.y}`; }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {traits.map((_, i) => {
        const p = getPoint(i, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      <path d={scorePath} fill="url(#radarFill)" stroke="#C8A86B" strokeWidth="1.5" filter="url(#glow)" />

      {traits.map((t, i) => {
        const p = getPoint(i, (scores[t] / 100) * r);
        const cfg = traitConfig[t];
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill={cfg.color} filter="url(#glow)" />;
      })}

      {traits.map((t, i) => {
        const p = getPoint(i, r + 22);
        const cfg = traitConfig[t];
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={cfg.color} fontSize="9" fontFamily="'DM Serif Display', serif" letterSpacing="1">
            {cfg.label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

export default function App() {
  const [phase, setPhase] = useState("landing"); // landing | test | analyzing | result
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState(null);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [visibleScores, setVisibleScores] = useState({});
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const handleAnswer = (val) => {
    setSelected(val);
    setTimeout(() => {
      const newAnswers = { ...answers, [current]: val };
      setAnswers(newAnswers);
      setFadeIn(false);
      setTimeout(() => {
        if (current < questions.length - 1) {
          setCurrent(current + 1);
          setSelected(null);
          setFadeIn(true);
        } else {
          setPhase("analyzing");
          handlePredict(newAnswers);
        }
      }, 250);
    }, 350);
  };

  const handlePredict = async (finalAnswers) => {
    // Progress simulation
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 8 + 2;
      if (prog >= 100) { 
        prog = 100; 
        clearInterval(iv); 
      }
      setAnalyzeProgress(Math.round(prog));
    }, 80);

    const fallback = { openness: 70, conscientiousness: 60, extraversion: 50, agreeableness: 80, neuroticism: 30 };
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(finalAnswers) }),
      });
      const data = await res.json();
      setScores(data);
      const arc = getArchetype(data);
      setTimeout(() => {
        setPhase("result");
        setAiInsight(`${arc.name}: ${arc.description}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      // Fallback
      setScores(fallback);
      const arc = getArchetype(fallback);
      setTimeout(() => {
        setPhase("result");
        setAiInsight(`${arc.name}: ${arc.description}`);
      }, 1000);
    }
  };

  useEffect(() => {
    if (phase === "result" && scores) {
      const keys = Object.keys(scores);
      keys.forEach((k, i) => {
        setTimeout(() => setVisibleScores(prev => ({ ...prev, [k]: scores[k] })), i * 200 + 400);
      });
    }
  }, [phase, scores]);

  const restart = () => {
    setPhase("landing"); setCurrent(0); setAnswers({}); setSelected(null);
    setScores(null); setAnalyzeProgress(0); setVisibleScores({}); setAiInsight(""); setFadeIn(true);
  };

  const labels = ["Muy en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Muy de acuerdo"];

  return (
    <div className="container" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      {[
        { top: "10%", left: "5%", size: 400, color: "rgba(200,168,107,0.03)" },
        { top: "60%", right: "5%", size: 350, color: "rgba(196,126,139,0.03)" },
        { top: "40%", left: "40%", size: 500, color: "rgba(166,139,175,0.02)" },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", width: orb.size, height: orb.size,
          background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
          top: orb.top, left: orb.left, right: orb.right,
          animation: `breathe ${6 + i * 2}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* LANDING */}
      {phase === "landing" && (
        <div className="fade-up" style={{ textAlign: "center", maxWidth: 600 }}>
          <div style={{ fontSize: 11, letterSpacing: 8, color: "#C8A86B", marginBottom: "2.5rem", opacity: 0.8 }}>
            PSICOMETRÍA · BIG FIVE · MACHINE LEARNING
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 1.05, margin: 0, letterSpacing: "-1px" }}>
            Descubre tu
            <span style={{ display: "block", fontStyle: "italic", background: "linear-gradient(135deg, #C8A86B, #E8D5A3, #C8A86B)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
              arquitectura interior
            </span>
          </h1>
          <p style={{ fontSize: "1.2rem", fontWeight: 300, fontStyle: "italic", color: "rgba(232,224,208,0.6)", margin: "2rem auto", maxWidth: 420, lineHeight: 1.7 }}>
            Quince preguntas. Cinco dimensiones. Un modelo de Machine Learning que transforma tus respuestas en un retrato psicológico único.
          </p>
          <button onClick={() => setPhase("test")} style={{
            background: "transparent", border: "1px solid rgba(200,168,107,0.4)", color: "#C8A86B",
            padding: "1rem 3rem", fontSize: 11, letterSpacing: 5, cursor: "pointer", marginTop: "1rem",
          }}>
            COMENZAR ANÁLISIS
          </button>
        </div>
      )}

      {/* TEST */}
      {phase === "test" && (
        <div style={{ width: "100%", maxWidth: 620 }}>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.85rem", color: "rgba(232,224,208,0.4)" }}>
              <span style={{ letterSpacing: 3, fontSize: 10 }}>PREGUNTA {current + 1} DE {questions.length}</span>
              <span style={{ color: traitConfig[questions[current].trait].color, letterSpacing: 2, fontSize: 10 }}>
                {traitConfig[questions[current].trait].label.toUpperCase()}
              </span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", position: "relative" }}>
              <div style={{
                height: "100%", background: `linear-gradient(90deg, #C8A86B, ${traitConfig[questions[current].trait].color})`,
                width: `${((current) / questions.length) * 100}%`, transition: "width 0.5s ease",
                boxShadow: `0 0 8px ${traitConfig[questions[current].trait].glow}`,
              }} />
            </div>
          </div>

          <div className={fadeIn ? "fade-up" : "fade-out"} style={{ marginBottom: "3rem" }}>
            <div style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.3, marginBottom: "0.5rem" }}>
              {questions[current].text}
            </div>
          </div>

          <div className={fadeIn ? "fade-up" : ""} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <button key={val} onClick={() => handleAnswer(val)} style={{
                background: selected === val ? `rgba(200,168,107,0.12)` : "rgba(255,255,255,0.02)",
                border: `1px solid ${selected === val ? "rgba(200,168,107,0.6)" : "rgba(255,255,255,0.07)"}`,
                borderLeft: selected === val ? "3px solid #C8A86B" : "3px solid transparent",
                color: selected === val ? "#C8A86B" : "rgba(232,224,208,0.7)",
                padding: "1rem 1.5rem", textAlign: "left", fontSize: "1rem", fontStyle: "italic",
                display: "flex", alignItems: "center", gap: "1rem",
              }}>
                <span style={{ fontSize: 10, letterSpacing: 2, minWidth: 16, opacity: 0.5 }}>{val}</span>
                {labels[val - 1]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ANALYZING */}
      {phase === "analyzing" && (
        <div className="fade-up" style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "pulse 2s ease-in-out infinite" }}>◈</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Analizando tu perfil</h2>
            <p style={{ fontStyle: "italic", color: "rgba(232,224,208,0.5)", fontSize: "1rem" }}>
              Procesando patrones psicométricos con ML
            </p>
          </div>
          <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, marginBottom: "1.5rem" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #C8A86B, #C47E8B)", width: `${analyzeProgress}%`, transition: "width 0.1s ease" }} />
          </div>
          <div style={{ fontSize: 11, letterSpacing: 5, color: "rgba(200,168,107,0.6)" }}>
            {analyzeProgress}% COMPLETADO
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && scores && (
        <div className="fade-up" style={{ width: "100%", maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: 10, letterSpacing: 8, color: "#C8A86B", marginBottom: "1rem", opacity: 0.7 }}>
              ANÁLISIS DE PERSONALIDAD · BIG FIVE
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: 0 }}>Tu Perfil Psicológico</h2>
            <div style={{ 
              marginTop: "1.5rem", 
              fontSize: "1.2rem", 
              color: traitConfig[Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0]].color,
              fontStyle: "italic",
              letterSpacing: 2
            }}>
              {getArchetype(scores).name.toUpperCase()}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <RadarChart scores={scores} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {Object.entries(traitConfig).map(([key, cfg]) => (
                <div key={key} style={{ opacity: visibleScores[key] !== undefined ? 1 : 0, transition: "opacity 0.5s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.9rem" }}>{cfg.label}</span>
                    <span style={{ color: cfg.color }}>
                      {visibleScores[key] !== undefined ? <AnimatedNumber value={visibleScores[key]} /> : 0}%
                    </span>
                  </div>
                  <div style={{ height: 2, background: "rgba(255,255,255,0.04)" }}>
                    <div style={{
                      height: "100%", background: cfg.color,
                      width: visibleScores[key] !== undefined ? `${visibleScores[key]}%` : "0%",
                      transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <button onClick={restart} style={{
              background: "transparent", border: "1px solid rgba(200,168,107,0.3)", color: "rgba(200,168,107,0.7)",
              padding: "0.8rem 2.5rem", fontSize: 10, letterSpacing: 5,
            }}>
              NUEVO ANÁLISIS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
