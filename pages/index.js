import { useEffect, useState } from "react";
import { BarChart, Phone, Users, CheckSquare, Calendar, User, CreditCard, Settings } from "lucide-react";

export default function Home() {
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const updateStatus = (i, value) => setStatusMap(prev => ({ ...prev, [i]: value }));

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1AFGmKqR2typaxKARBprS81ArcBUqXg1RX8sXwNyO1oY/Tabellenblatt1")
      .then((res) => res.json())
      .then((data) => setData([...data].reverse()));
  }, []);

  const termine = data.filter(r => r.Anliegen === "Termin").length;
  const rezepte = data.filter(r => r.Anliegen === "Rezept").length;
  const atteste = data.filter(r => r.Anliegen === "Attest").length;

  return (
    <div style={layout}>
        <aside style={sidebar}>
        <div>
        <h2>Praxis</h2>
        <nav>
        <p style={activeNav}><BarChart size={18} style={icon}/> Übersicht</p>
        <p style={navItem}><Phone size={18} style={icon}/> Anrufliste</p>
        <p style={navItem}><Users size={18} style={icon}/> Kontakte</p>
        <p style={navItem}><CheckSquare size={18} style={icon}/> Aufgaben</p>
        <p style={navItem}><Calendar size={18} style={icon}/> Kalender</p>
        </nav>
        </div>
        <div style={bottomNav}>
        <p style={bottomItem}><User size={18} style={icon}/> Profil</p>
        <p style={bottomItem}><CreditCard size={18} style={icon}/> Mitgliedschaft</p>
        <p style={bottomItem}><Settings size={18} style={icon}/> Einstellungen</p>
        </div>
        </aside><main style={main}><h1>Dashboard – Praxis Dr. Tilse</h1>
    
        <p style={{ color: "#667085" }}>
          Heutige Anrufübersicht – {new Date().toLocaleDateString("de-DE")}
        </p>

        <div style={cards}>
          <div style={highlightCard}>
            <p>Anrufe gesamt</p>
            <h2>{data.length}</h2>
          </div>
          <div style={card}><p>Termine</p><h2>{termine}</h2></div>
          <div style={card}><p>Rezepte</p><h2>{rezepte}</h2></div>
          <div style={card}><p>Atteste</p><h2>{atteste}</h2></div>
        </div>

        <div style={box}>
          <h2>Heutige Anrufe</h2>
          
          <div style={headerRow}><span>Uhrzeit</span><span>Name</span><span>Anliegen</span><span>Arzt</span><span>Status</span></div>

          {data.map((row, i) => (
           <div key={i} style={callCard} onClick={() => setOpenIndex(openIndex === i ? null : i)}><div style={callTop}><strong>{row.Uhrzeit || "-"}</strong><span>{row.Name || "-"}</span><span style={{ display: "flex", gap: 6 }}>{(row.Anliegen || "").split(",").map((item, i) => <span key={i} style={{ ...badge, background: item.trim() === "Termin" ? "#e0f2fe" : item.trim() === "Rezept" ? "#dcfce7" : item.trim() === "Attest" ? "#fef9c3" : "#e5e7eb", color: item.trim() === "Termin" ? "#0369a1" : item.trim() === "Rezept" ? "#166534" : item.trim() === "Attest" ? "#854d0e" : "#374151" }}>{item.trim()}</span>)}</span><span>{row.Arzt || "-"}</span><select value={statusMap[i] || "Neu / Ungelesen"} onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(i, e.target.value)} style={selectStyle}><option>Neu / Ungelesen</option><option>In Bearbeitung</option><option>Erledigt</option><option>Gelesen</option></select></div>{openIndex === i && (<div style={details}><div style={detailCard}><span style={detailLabel}>Bestandspatient</span><strong>{row.Bestandspatient || "-"}</strong></div><div style={detailCard}><span style={detailLabel}>Geburtsdatum</span><strong>{row.Geburtsdatum || "-"}</strong></div><div style={detailCardWide}><span style={detailLabel}>Zusammenfassung</span><p>{row.Zusammenfassung || "-"}</p></div></div>)}</div>
          ))}
        </div>
      </main>
    </div>
  );
}

const layout = { display: "flex", minHeight: "100vh", background: "#f5f7fb", fontFamily: "Arial" };
const main = { flex: 1, padding: 40 };
const sidebar = { width: 190, flexShrink: 0, background: "#0f172a", color: "white", padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" };const navItem = { padding: 12, color: "#cbd5e1" };
const activeNav = { padding: 12, background: "#2563eb", borderRadius: 10 };
const cards = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, margin: "30px 0" };
const card = { background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" };
const box = { background: "white", padding: 24, borderRadius: 16 };
const callCard = { padding: 16, borderBottom: "1px solid #e5e7eb", cursor: "pointer" };
const callTop = { display: "grid", gridTemplateColumns: "90px 1fr 220px 1fr 170px", gap: 12, alignItems: "center" };
const badge = { background: "#e0f2fe", color: "#0369a1", padding: "6px 10px", borderRadius: 999, textAlign: "center" };
const highlightCard = {  background: "linear-gradient(135deg, #2563eb, #1e40af)",  color: "white",  padding: 24,  borderRadius: 16,  boxShadow: "0 12px 30px rgba(37,99,235,0.30)"};
const headerRow = { display: "grid", gridTemplateColumns: "90px 1fr 220px 1fr 170px", gap: 12, fontSize: 13, color: "#667085", marginBottom: 10, padding: "0 16px" };
const details = { marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const detailCard = { background: "#f8fafc", padding: 16, borderRadius: 14, border: "1px solid #e5e7eb" };
const detailCardWide = { background: "#f8fafc", padding: 16, borderRadius: 14, border: "1px solid #e5e7eb", gridColumn: "1 / -1" };
const detailLabel = { display: "block", color: "#667085", fontSize: 13, marginBottom: 6 };
const selectStyle = { padding: "8px 10px", borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f4f6", cursor: "pointer", fontWeight: 400 };
const deleteStyle = { color: "#dc2626", fontWeight: 600, cursor: "pointer" };
const bottomNav = { borderTop: "1px solid #334155", paddingTop: 16 };
const bottomItem = { padding: 12, color: "#94a3b8", background: "#1e293b", borderRadius: 10, marginBottom: 8, cursor: "pointer" };
const icon = { marginRight: 10, verticalAlign: "middle" };
