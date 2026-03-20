import {useState, useEffect, useRef} from "react";

const DEEL1_PHASES = [
  {
    label: "Chaotic Exploration",
    duration: 5 * 60,
    color: "#0000D2",
    description: "Schrijf alle events op die je kunt bedenken. Geen volgorde, geen discussie, alles mag."
  },
  {
    label: "Enforcing the Timeline",
    duration: 17 * 60,
    color: "#7B2FBE",
    description: "Breng de events in chronologische volgorde. Identificeer gaps, duplicaten en conflicten."
  },
  {
    label: "Actors & Hotspots",
    duration: 7 * 60,
    color: "#D44000",
    description: "Wijs actoren toe aan events. Markeer hotspots, vragen en verbeterpunten."
  },
];

const DEEL2_PHASES = [
  {
    label: "Commands & Policies",
    duration: 10 * 60,
    color: "#0000D2",
    description: "Voeg commands en policies toe aan de tijdlijn om de processen te verduidelijken."
  },
  {
    label: "Actors & Systems",
    duration: 10 * 60,
    color: "#7B2FBE",
    description: "Koppel actoren en (externe) systemen aan commands om acties te duiden."
  },
  {
    label: "Constraints",
    duration: 5 * 60,
    color: "#D44000",
    description: "Markeer constraints en beperkingen in het proces waar regels gelden."
  },
];

const STICKY_TYPES = {
  EVENT: {label: "Domain Event", color: "#F5A623", textColor: "#000"},
  HOTSPOT: {label: "Hotspot / Question", color: "#E8494A", textColor: "#fff", border: "#B03030"},
  COMMAND: {label: "Command", color: "#A8D4F5", textColor: "#000"},
  POLICY: {label: "Policy", color: "#C9A8F5", textColor: "#000"},
  ACTOR: {label: "Actor", color: "#F5F0C0", textColor: "#000", border: "#C8B800", isSmall: true},
  READ_MODEL: {label: "Read Model / System", color: "#A8F5C0", textColor: "#000"},
  EXTERNAL_SYSTEM: {label: "(External) System", color: "#F5A8D4", textColor: "#000", isLarge: true},
  CONSTRAINT: {label: "Constraint", color: "#F5CBA7", textColor: "#000"},
};

const DEEL1_LEGEND = [STICKY_TYPES.EVENT, STICKY_TYPES.HOTSPOT];
const DEEL2_LEGEND = Object.values(STICKY_TYPES);

function pad(n) {
  return String(n).padStart(2, "0");
}

function Arrow() {
  return (
      <div style={{color: "#747474", fontSize: "20px", fontWeight: "bold"}}>→</div>
  );
}

function StickyNote({type, children, style = {}, isExample = false}) {
  const isHotspot = type.label.includes("Hotspot");
  const isActor = type.isSmall;
  const isSystem = type.isLarge;

  const baseWidth = isActor ? "auto" : isSystem ? "200px" : "180px";
  const baseHeight = isActor ? "auto" : isSystem ? "160px" : "180px";
  const baseFontSize = isActor ? "16px" : "20px";
  const basePadding = isActor ? "8px 14px" : "20px";

  // Scale down for examples
  const width = isExample && !isActor ? (isSystem ? "150px" : "135px") : baseWidth;
  const height = isExample && !isActor ? (isSystem ? "120px" : "135px") : baseHeight;
  const fontSize = isExample ? (isActor ? "12px" : "15px") : baseFontSize;
  const padding = isExample ? (isActor ? "6px 10px" : "12px") : basePadding;

  return (
      <div style={{
        background: type.color,
        color: type.textColor,
        padding: padding,
        borderRadius: "4px",
        fontSize: fontSize,
        fontWeight: 700,
        boxShadow: "3px 3px 7px rgba(0,0,0,0.2)",
        border: type.border ? `2.5px ${isHotspot ? "dashed" : "solid"} ${type.border}` : "none",
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        boxSizing: "border-box",
        ...style
      }}>
        {children || type.label}
      </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(1);

  // Deel 1 State
  const [phaseIndex1, setPhaseIndex1] = useState(0);
  const [timeLeft1, setTimeLeft1] = useState(DEEL1_PHASES[0].duration);
  const [running1, setRunning1] = useState(false);

  // Deel 2 State
  const [phaseIndex2, setPhaseIndex2] = useState(0);
  const [timeLeft2, setTimeLeft2] = useState(DEEL2_PHASES[0].duration);
  const [running2, setRunning2] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (activeTab === 1) {
      // Alleen reageren op fase verandering als de tab actief is om onbedoelde resets bij initialisatie te voorkomen
      // Maar we willen wel dat hij gereset wordt als de gebruiker een fase klikt.
    }
  }, [phaseIndex1]);

  const handlePhaseChange = (index) => {
    if (activeTab === 1) {
      setPhaseIndex1(index);
      setTimeLeft1(DEEL1_PHASES[index].duration);
      setRunning1(false);
    } else {
      setPhaseIndex2(index);
      setTimeLeft2(DEEL2_PHASES[index].duration);
      setRunning2(false);
    }
  };

  useEffect(() => {
    if (running1 || running2) {
      intervalRef.current = setInterval(() => {
        if (running1) {
          setTimeLeft1((t) => {
            if (t <= 1) {
              setRunning1(false);
              return 0;
            }
            return t - 1;
          });
        }
        if (running2) {
          setTimeLeft2((t) => {
            if (t <= 1) {
              setRunning2(false);
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running1, running2]);

  const currentPhases = activeTab === 1 ? DEEL1_PHASES : DEEL2_PHASES;
  const currentPhaseIndex = activeTab === 1 ? phaseIndex1 : phaseIndex2;
  const currentTimeLeft = activeTab === 1 ? timeLeft1 : timeLeft2;
  const currentRunning = activeTab === 1 ? running1 : running2;
  const setCurrentPhaseIndex = activeTab === 1 ? setPhaseIndex1 : setPhaseIndex2;
  const setCurrentTimeLeft = activeTab === 1 ? setTimeLeft1 : setTimeLeft2;
  const setCurrentRunning = activeTab === 1 ? setRunning1 : setRunning2;

  const minutes = Math.floor(currentTimeLeft / 60);
  const seconds = currentTimeLeft % 60;
  const phase = currentPhases[currentPhaseIndex];
  const progress = 1 - currentTimeLeft / phase.duration;
  const isUrgent = currentTimeLeft <= 60 && currentTimeLeft > 0;
  const isDone = currentTimeLeft === 0;

  return (
      <div style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#EBE8E3",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        boxSizing: "border-box",
        width: "100%"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1440px",
          aspectRatio: "16 / 9",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}>

        {/* Header */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
          <div>
            <div style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0000D2",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>Break-out Assignment
            </div>
            <h1 style={{margin: "4px 0 0", fontSize: "36px", fontWeight: 800, color: "#242424"}}>Bioscoop
              Kaartjesreservering</h1>
          </div>
          <div style={{fontSize: "14px", color: "#747474", fontWeight: 500}}>Event Storming</div>
        </div>

        {/* Tabs */}
        <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
          <button
              onClick={() => setActiveTab(1)}
              style={{
                padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeTab === 1 ? "#0000D2" : "#fff",
                color: activeTab === 1 ? "#fff" : "#242424",
                fontWeight: 700, fontSize: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
              }}
          >
            Deel 1 – Domain Events
          </button>
          <button
              onClick={() => setActiveTab(2)}
              style={{
                padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: activeTab === 2 ? "#0000D2" : "#fff",
                color: activeTab === 2 ? "#fff" : "#242424",
                fontWeight: 700, fontSize: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
              }}
          >
            Deel 2 – Process Modelling
          </button>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px"}}>

          {/* Casus */}
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
          }}>
            <div style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0000D2",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px"
            }}>📋 Casus
            </div>
            <p style={{fontSize: "18px", color: "#242424", lineHeight: "1.65", margin: "0 0 12px"}}>
              Een bioscoopbezoeker bekijkt het filmaanbod op de website en reserveert tickets. Het systeem wijst
              automatisch aaneengesloten stoelen toe op één rij (max. 8 per reservering).
            </p>
            <p style={{fontSize: "18px", color: "#242424", lineHeight: "1.65", margin: "0 0 12px"}}>
              De bezoeker heeft <strong>15 minuten</strong> om de reservering te bevestigen — daarna vervallen de
              plaatsen automatisch. Zolang de timer loopt kan de stoelkeuze worden aangepast.
            </p>
            <p style={{fontSize: "18px", color: "#242424", lineHeight: "1.65", margin: 0}}>
              Na bevestiging volgt betaling via een extern betaalsysteem. Bij succesvolle betaling worden tickets
              gegenereerd. Mislukt de betaling? Dan vervalt de reservering.
            </p>
          </div>

          {/* Timer + Fase */}
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0000D2",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px"
            }}>⏱ Timer
            </div>

            {/* Phase tabs */}
            <div style={{display: "flex", gap: "8px", marginBottom: "16px"}}>
              {currentPhases.map((p, i) => (
                  <button
                      key={i}
                      onClick={() => handlePhaseChange(i)}
                      style={{
                        flex: 1, padding: "8px 4px", borderRadius: "8px", border: "none", cursor: "pointer",
                        background: currentPhaseIndex === i ? p.color : "#F4F4F4",
                        color: currentPhaseIndex === i ? "#fff" : "#747474",
                        fontSize: "14px", fontWeight: 700, transition: "all 0.2s",
                      }}
                  >
                    {i + 1}. {p.label.split(" ")[0]}
                  </button>
              ))}
            </div>

            {/* Phase info */}
            <div style={{background: "#F4F4F4", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px"}}>
              <div style={{
                fontWeight: 700,
                fontSize: "18px",
                color: phase.color,
                marginBottom: "4px"
              }}>{phase.label}</div>
              <div style={{fontSize: "16px", color: "#747474", lineHeight: "1.5"}}>{phase.description}</div>
            </div>

            {/* Clock */}
            <div style={{
              textAlign: "center", fontSize: "82px", fontWeight: 900, letterSpacing: "-2px",
              color: isDone ? "#E8494A" : isUrgent ? "#E8494A" : "#242424",
              fontVariantNumeric: "tabular-nums", marginBottom: "16px", lineHeight: 1,
              animation: isUrgent && currentRunning ? "pulse 1s infinite" : "none",
            }}>
              {pad(minutes)}:{pad(seconds)}
            </div>

            {/* Progress bar */}
            <div style={{
              height: "6px",
              background: "#F4F4F4",
              borderRadius: "99px",
              marginBottom: "14px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%", borderRadius: "99px", transition: "width 1s linear, background 0.3s",
                width: `${progress * 100}%`,
                background: isDone ? "#E8494A" : isUrgent ? "#E8494A" : phase.color,
              }}/>
            </div>

            {/* Controls */}
            <div style={{display: "flex", gap: "8px"}}>
              <button
                  onClick={() => setCurrentRunning(!currentRunning)}
                  style={{
                    flex: 2, padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: currentRunning ? "#E8494A" : phase.color, color: "#fff",
                    fontWeight: 700, fontSize: "16px",
                  }}
              >
                {currentRunning ? "⏸ Pauzeer" : isDone ? "✅ Klaar" : "▶ Start"}
              </button>
              <button
                  onClick={() => {
                    setCurrentTimeLeft(phase.duration);
                    setCurrentRunning(false);
                  }}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid #DCCFC2",
                    background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "16px", color: "#747474",
                  }}
              >
                ↺ Reset
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#0000D2",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "16px"
          }}>🗂 Legenda
          </div>
          <div style={{display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "24px"}}>
            {(activeTab === 1 ? DEEL1_LEGEND : DEEL2_LEGEND).map((item) => (
                <div key={item.label} style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  <div style={{
                    width: item.isSmall ? "30px" : "40px",
                    height: item.isSmall ? "20px" : "30px",
                    borderRadius: "2px",
                    background: item.color,
                    border: item.border ? `2px ${item.label.includes("Hotspot") ? "dashed" : "solid"} ${item.border}` : "1.5px solid rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}/>
                  <span style={{
                    fontSize: "16px",
                    color: "#242424",
                    fontWeight: 500,
                    whiteSpace: "nowrap"
                  }}>{item.label}</span>
                </div>
            ))}
          </div>

          <div style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#0000D2",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "16px",
            borderTop: "1px solid #eee",
            paddingTop: "20px"
          }}>Voorbeeld: Food Delivery App
          </div>

          {activeTab === 1 ? (
              <div style={{display: "flex", gap: "15px", alignItems: "center", padding: "5px"}}>
                <StickyNote type={STICKY_TYPES.EVENT} isExample>Order geplaatst</StickyNote>
                <StickyNote type={STICKY_TYPES.HOTSPOT} isExample>⚡ Hotspot: Wat als restaurant gesloten is?</StickyNote>
              </div>
          ) : (
              <div style={{
                padding: "20px",
                position: "relative",
                minHeight: "260px",
                overflowX: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "50px"
              }}>
                {/* Hoofdrij */}
                <div style={{display: "flex", gap: "15px", alignItems: "center", position: "relative", zIndex: 1}}>
                  <StickyNote type={STICKY_TYPES.READ_MODEL} isExample>Menu overzicht</StickyNote>

                  <Arrow />

                  <div style={{position: "relative", marginRight: "10px"}}>
                    <StickyNote type={STICKY_TYPES.COMMAND} isExample>Plaats Order</StickyNote>
                    <StickyNote type={STICKY_TYPES.ACTOR} isExample
                                style={{
                                  position: "absolute",
                                  top: "-20px",
                                  left: "-20px",
                                  zIndex: 10,
                                  boxShadow: "1px 1px 3px rgba(0,0,0,0.2)"
                                }}>
                      Klant
                    </StickyNote>
                    <StickyNote type={STICKY_TYPES.CONSTRAINT} isExample
                                style={{
                                  position: "absolute",
                                  top: "110px",
                                  left: "20px",
                                  zIndex: 5,
                                  fontSize: "12px",
                                  height: "60px",
                                  width: "100px",
                                  boxShadow: "1px 1px 3px rgba(0,0,0,0.1)"
                                }}>
                      Min. €15,-
                    </StickyNote>
                  </div>

                  <Arrow />

                  <StickyNote type={STICKY_TYPES.EXTERNAL_SYSTEM} isExample>Betaalsysteem</StickyNote>

                  <Arrow />

                  <StickyNote type={STICKY_TYPES.EVENT} isExample>Betaling ontvangen</StickyNote>

                  <Arrow />

                  <div style={{position: "relative"}}>
                    <StickyNote type={STICKY_TYPES.POLICY} isExample>Zodra betaling ontvangen, bevestig restaurant</StickyNote>
                    {/* Vertakking SVG */}
                    <div style={{position: "absolute", left: "67px", top: "135px", zIndex: 0}}>
                      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                        <path d="M0 0 Q 0 40, 60 40" stroke="#747474" strokeWidth="2" fill="none"
                              markerEnd="url(#arrowhead)"/>
                      </svg>
                    </div>
                  </div>

                  <Arrow />

                  <StickyNote type={STICKY_TYPES.COMMAND} isExample>Bevestig Order</StickyNote>

                  <Arrow />

                  <StickyNote type={STICKY_TYPES.EVENT} isExample>Order bevestigd</StickyNote>
                </div>

                {/* Tweede rij */}
                <div style={{display: "flex", gap: "15px", alignItems: "center", marginLeft: "930px"}}>
                  <StickyNote type={STICKY_TYPES.COMMAND} isExample>Stuur notificatie</StickyNote>
                  <Arrow />
                  <StickyNote type={STICKY_TYPES.EXTERNAL_SYSTEM} isExample>Notificatiesysteem</StickyNote>
                  <Arrow />
                  <StickyNote type={STICKY_TYPES.EVENT} isExample>Klant genotificeerd</StickyNote>
                </div>

                <svg style={{position: "absolute", width: 0, height: 0}}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#747474"/>
                    </marker>
                  </defs>
                </svg>
              </div>
          )}
        </div>

        {/* Phases overview */}
        <div style={{display: "flex", gap: "12px", marginTop: "16px"}}>
          {currentPhases.map((p, i) => (
              <div
                  key={i}
                  onClick={() => handlePhaseChange(i)}
                  style={{
                    flex: 1, borderRadius: "10px", padding: "14px 16px", cursor: "pointer",
                    background: currentPhaseIndex === i ? p.color : "#fff",
                    color: currentPhaseIndex === i ? "#fff" : "#242424",
                    boxShadow: currentPhaseIndex === i ? `0 4px 16px ${p.color}55` : "0 1px 4px rgba(0,0,0,0.07)",
                    transition: "all 0.2s",
                    borderLeft: currentPhaseIndex !== i ? `4px solid ${p.color}` : "none",
                  }}
              >
                <div style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  opacity: 0.7,
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}>
                  Fase {i + 1} · {Math.round(p.duration / 60)} min
                </div>
                <div style={{fontSize: "18px", fontWeight: 800}}>{p.label}</div>
                <div style={{
                  fontSize: "14px",
                  marginTop: "6px",
                  opacity: 0.8,
                  lineHeight: "1.4"
                }}>{p.description.split(".")[0]}.
                </div>
              </div>
          ))}
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    </div>
  );
}
