import {useState, useEffect, useRef} from "react";
import eventsPart1 from "./assets/1-events.excalidraw.png";
import biggerFlowPart2 from "./assets/7-bigger-flow.excalidraw.png";

const DEEL1_PHASES = [
  {
    label: "Chaotic Exploration",
    duration: 10 * 60,
    color: "#0000D2",
    description: "Schrijf alle events op die je kunt bedenken. Geen volgorde, geen discussie, alles mag."
  },
  {
    label: "Enforcing the Timeline",
    duration: 10 * 60,
    color: "#6B46DB",
    description: "Breng de events in chronologische volgorde. Identificeer gaps, duplicaten en conflicten."
  },
  {
    label: "Hotspots",
    duration: 5 * 60,
    color: "#D44000",
    description: "Wijs hotspots toe aan events, waar gaat het momenteel mis?"
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
    color: "#6B46DB",
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
  EVENT: {label: "Domain Event", color: "#FFD8A8", border: "#F08C01", textColor: "#000"},
  HOTSPOT: {label: "Hotspot / Question", color: "#E8494A", textColor: "#fff", border: "#B03030"},
  COMMAND: {label: "Command", color: "#A5D8FF", border: "#1A71C2", textColor: "#000"},
  POLICY: {label: "Policy", color: "#D0BFFF", border: "#6B46DB", textColor: "#000"},
  EXTERNAL_SYSTEM: {label: "(External) System", color: "#EEBEFA", border: "#9E37B6", textColor: "#000", isLarge: true},
  ACTOR: {label: "Actor", color: "#FFEC9A", textColor: "#000", border: "#000", isSmall: true},
  CONSTRAINT: {label: "Constraint", color: "#FFEC9A", textColor: "#000", border: "#000"},
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
              De bezoeker heeft <strong>15 minuten</strong> om de reservering te bevestigen, daarna vervallen de
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
          }}>Voorbeeld
          </div>

          {activeTab === 1 ? (
              <div style={{padding: "5px"}}>
                <img src={eventsPart1} alt="Events Voorbeeld" style={{maxWidth: "1000px", width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}} />
              </div>
          ) : (
              <div style={{padding: "5px"}}>
                <img src={biggerFlowPart2} alt="Bigger Flow Voorbeeld" style={{maxWidth: "1000px", width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}} />
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
