import { useEffect, useState } from "react";
import { Phone, Users, CheckSquare, Calendar, User, CreditCard, Settings } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [activePage, setActivePage] = useState("Anrufe");
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [search, setSearch] = useState("");  
  const [anliegenFilter, setAnliegenFilter] = useState("Alle");
  const [arztFilter, setArztFilter] = useState("Alle");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;  
  const updateStatus = (i, value) => setStatusMap(prev => ({ ...prev, [i]: value }));

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1AFGmKqR2typaxKARBprS81ArcBUqXg1RX8sXwNyO1oY/Tabellenblatt1")
      .then((res) => res.json())
      .then((data) => setData([...data].reverse()));
  }, []);

  const termine = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Termin")).length;
  const rezepte = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Rezept")).length;
  const atteste = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Attest")).length;

  return (
    <div style={layout}>
        <aside style={sidebar}>
        <div>
        <h2>Praxis Dr. Tilse</h2>
        <nav>
          <p onClick={() => setActivePage("Anrufe")} onMouseEnter={(e) => activePage !== "Anrufe" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Anrufe" && (e.currentTarget.style.background = "transparent")} style={activePage === "Anrufe" ? activeNav : { ...navItem, cursor: "pointer" }}><Phone size={18} style={icon}/> Anrufe</p>
          <p onClick={() => setActivePage("Kontakte")} onMouseEnter={(e) => activePage !== "Kontakte" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Kontakte" && (e.currentTarget.style.background = "transparent")} style={activePage === "Kontakte" ? activeNav : { ...navItem, cursor: "pointer" }}><Users size={18} style={icon}/> Kontakte</p>
          <p onClick={() => setActivePage("Aufgaben")} onMouseEnter={(e) => activePage !== "Aufgaben" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Aufgaben" && (e.currentTarget.style.background = "transparent")} style={activePage === "Aufgaben" ? activeNav : { ...navItem, cursor: "pointer" }}><CheckSquare size={18} style={icon}/> Aufgaben</p>
          <p onClick={() => setActivePage("Kalender")} onMouseEnter={(e) => activePage !== "Kalender" && (e.currentTarget.style.background = "#1e293b")} onMouseLeave={(e) => activePage !== "Kalender" && (e.currentTarget.style.background = "transparent")} style={activePage === "Kalender" ? activeNav : { ...navItem, cursor: "pointer" }}><Calendar size={18} style={icon}/> Kalender</p>
        </nav>
        </div>
        <div style={bottomNav}>
        <p style={bottomItem}><User size={18} style={icon}/> Profil</p>
        <p style={bottomItem}><CreditCard size={18} style={icon}/> Mitgliedschaft</p>
        <p style={bottomItem}><Settings size={18} style={icon}/> Einstellungen</p>
        </div>
        </aside>
  
        <main style={main}>
    
        <h1>{activePage}</h1>

        {activePage === "Anrufe" && (
          <>
            <p style={{ color: "#667085" }}>Übersicht Ihrer von Anna geführten Anrufe.</p>
        
            <div style={cards}>
              <div style={highlightCard}><p>Anrufe gesamt</p><h2>{data.length}</h2></div>
              <div style={card}><p>Termine</p><h2>{termine}</h2></div>
              <div style={card}><p>Rezepte</p><h2>{rezepte}</h2></div>
              <div style={card}><p>Atteste</p><h2>{atteste}</h2></div>
            </div>

            <div style={tabBar}>
              {["Alle", "Neu / Ungelesen", "In Bearbeitung", "Erledigt", "Gelesen"].map(tab => (
                <button key={tab} onClick={() => setStatusFilter(tab)} style={statusFilter === tab ? activeTab : tabItem}>
                  {tab}
                </button>
              ))}
            </div>
            
            <div style={filterRow}>
              <input placeholder="Suche..." value={search} onChange={(e) => setSearch(e.target.value)} style={searchInput} />
            
              <select
                value={anliegenFilter === "Alle" ? "" : anliegenFilter}
                onChange={(e) => setAnliegenFilter(e.target.value || "Alle")}
                style={filterSelect}
              >
                <option value="" disabled hidden>Anliegen filtern</option>
                <option value="Alle">Alle</option>
                <option value="Termin">Termin</option>
                <option value="Rezept">Rezept</option>
                <option value="Attest">Attest</option>
                <option value="Sonstige">Sonstige</option>
              </select>
            
              <select value={arztFilter} onChange={(e) => setArztFilter(e.target.value)} style={filterSelect}>
                <option value="Alle">Arzt</option>
                <option>Herr Dr. Tilse</option>
                <option>Frau Dr. Tilse</option>
              </select>
            
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                placeholderText="Zeitraum"
                customInput={<input style={datePicker} />}
              />
            </div>
                      
            <div style={box}>
              <h2>Heutige Anrufe</h2>
              <div style={headerRow}>
                <span>Datum</span>
                <span>Name</span>
                <span>Anliegen</span>
                <span>Arzt</span>
                <span>Status</span>
              </div>
              
              {data
                .filter((row) => {
                  const statusMatch =
                    statusFilter === "Alle" ||
                    (statusMap[data.indexOf(row)] || "Neu / Ungelesen") === statusFilter;
              
                  const searchMatch =
                    (row.Name || "").toLowerCase().includes(search.toLowerCase()) ||
                    (row.Arzt || "").toLowerCase().includes(search.toLowerCase()) ||
                    (row.Anliegen || "").toLowerCase().includes(search.toLowerCase());
              
                  return statusMatch && searchMatch;
                })
                .map((row, i) => (
                  <div key={i} style={openIndex === i ? callCardOpen : callCard} onMouseEnter={(e) => { if (openIndex !== i) e.currentTarget.style.background = "#f8fafc"; }} onMouseLeave={(e) => { if (openIndex !== i) { e.currentTarget.style.background = "white"; e.currentTarget.style.borderBottom = "1px solid #e5e7eb"; } }} onClick={() => setOpenIndex(openIndex === i ? null : i)}>                  <div style={callTop}>
                    <div>
                      <strong>{row.Uhrzeit || "-"}</strong>
                      <div style={dateText}>{row.Datum || "-"}</div>
                    </div>
                    <span>{row.Name || "-"}</span>
              
                    <span style={{ display: "flex", gap: 6 }}>
                      {(row.Anliegen || "").split(",").map((item, i) => (
                        <span
                          key={i}
                          style={{
                            ...badge,
                            background:
                              item.trim() === "Termin" ? "#e0f2fe" :
                              item.trim() === "Rezept" ? "#dcfce7" :
                              item.trim() === "Attest" ? "#fef9c3" : "#e5e7eb",
                            color:
                              item.trim() === "Termin" ? "#0369a1" :
                              item.trim() === "Rezept" ? "#166534" :
                              item.trim() === "Attest" ? "#854d0e" : "#374151",
                          }}
                        >
                          {item.trim()}
                        </span>
                      ))}
                    </span>
              
                    <span>{row.Arzt || "-"}</span>
              
                    <select
                      value={statusMap[i] || "Neu / Ungelesen"}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(i, e.target.value)}
                      style={selectStyle}
                    >
                      <option>Neu / Ungelesen</option>
                      <option>In Bearbeitung</option>
                      <option>Erledigt</option>
                      <option>Gelesen</option>
                    </select>
                  </div>
              
                  {openIndex === i && (
                    <div style={details}>
                      <div style={detailCard}>
                        <span style={detailLabel}>Bestandspatient</span>
                        <strong>{row.Bestandspatient || "-"}</strong>
                      </div>
              
                      <div style={detailCard}>
                        <span style={detailLabel}>Geburtsdatum</span>
                        <strong>{row.Geburtsdatum || "-"}</strong>
                      </div>
              
                      <div style={detailCardWide}>
                        <span style={detailLabel}>Zusammenfassung</span>
                        <p>{row.Zusammenfassung || "-"}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        
        {activePage === "Kontakte" && (
          <div style={box}><h2>Kontakte</h2><p>Hier kommen später Patientenkontakte rein.</p></div>
        )}
        
        {activePage === "Aufgaben" && (
          <div style={box}><h2>Aufgaben</h2><p>Hier kommen offene Aufgaben rein.</p></div>
        )}
        
        {activePage === "Kalender" && (
          <div style={box}><h2>Kalender</h2><p>Hier kommt später der Kalender rein.</p></div>
        )}
      </main>
    </div>
  );
}


const layout = { display: "flex", height: "100vh", overflow: "hidden", background: "#f5f7fb", fontFamily: "Arial" };
const main = { flex: 1, padding: 32, overflow: "hidden", boxSizing: "border-box" };
const sidebar = { width: 190, flexShrink: 0, background: "#0f172a", color: "white", padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" };
const navItem = { padding: 12, color: "#cbd5e1", cursor: "pointer", borderRadius: 10, transition: "all 0.2s ease" };
const activeNav = { padding: 12, background: "#2563eb", borderRadius: 10, color: "white", cursor: "pointer", transition: "all 0.2s ease" };
const cards = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, margin: "30px 0" };
const card = { background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" };
const box = { background: "white", padding: 24, borderRadius: 16 };
const callCard = { padding: 16, border: "1px solid transparent", borderBottom: "1px solid #e5e7eb", cursor: "pointer", borderRadius: 14, transition: "all 0.2s ease", marginBottom: 8, background: "white" };
const callCardOpen = { ...callCard, background: "#f8fafc", boxShadow: "0 10px 28px rgba(15,23,42,0.08)", border: "1px solid #dbeafe" };
const callTop = { display: "grid", gridTemplateColumns: "90px 1fr 220px 1fr 170px", gap: 12, alignItems: "center" };
const badge = { background: "#e0f2fe", color: "#0369a1", padding: "6px 10px", borderRadius: 999, textAlign: "center" };
const highlightCard = {  background: "linear-gradient(135deg, #2563eb, #1e40af)",  color: "white",  padding: 24,  borderRadius: 16,  boxShadow: "0 12px 30px rgba(37,99,235,0.30)"};
const headerRow = { display: "grid", gridTemplateColumns: "90px 1fr 220px 1fr 170px", gap: 12, fontSize: 13, color: "#667085", marginBottom: 10, padding: "0 16px" };
const details = { marginTop: 16, padding: 16, background: "white", borderRadius: 14, border: "1px solid #e5e7eb", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const detailCard = { background: "#f8fafc", padding: 14, borderRadius: 12 };
const detailCardWide = { background: "#f8fafc", padding: 14, borderRadius: 12, gridColumn: "1 / -1" };
const detailLabel = { display: "block", color: "#64748b", fontSize: 12, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 };
const selectStyle = { padding: "8px 10px", borderRadius: 10, border: "1px solid #d1d5db", background: "#f3f4f6", cursor: "pointer", fontWeight: 400 };
const deleteStyle = { color: "#dc2626", fontWeight: 600, cursor: "pointer" };
const bottomNav = { borderTop: "1px solid #334155", paddingTop: 16 };
const bottomItem = { padding: 12, color: "#94a3b8", background: "#1e293b", borderRadius: 10, marginBottom: 8, cursor: "pointer" };
const icon = { marginRight: 10, verticalAlign: "middle" };
const dateText = { fontSize: 12, color: "#94a3b8", marginTop: 2 };
const tabs = { display: "flex", gap: 20, marginBottom: 16 };
const tabItem = { border: "none", background: "transparent", padding: "9px 14px", borderRadius: 10, cursor: "pointer", color: "#64748b", fontWeight: 500 };
const tabBar = { display: "flex", gap: 8, background: "#eef2f7", padding: 6, borderRadius: 14, marginBottom: 18, width: "fit-content" };
const activeTab = { border: "none", background: "white", padding: "9px 14px", borderRadius: 10, cursor: "pointer", color: "#0f172a", fontWeight: 700, boxShadow: "0 4px 12px rgba(15,23,42,0.08)" };
const searchInput = { width: "25%", padding: "10px 12px", borderRadius: 10, border: "1px solid #dbe1ea" };
const filterRow = { display: "flex", gap: 10, marginBottom: 18, alignItems: "center" };
const filterSelect = { padding: "10px 12px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer" };
const datePicker = {  padding: "10px 12px",  borderRadius: 10,  border: "1px solid #dbe1ea",  cursor: "pointer",  width: 180};
