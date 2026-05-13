import { useEffect, useState } from "react";
import { Phone, Users, CheckSquare, Calendar, User, CreditCard, Settings, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CountUp({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200; 
    const steps = 60;      
    const increment = end / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const next = Math.round(increment * currentStep);

      if (currentStep >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(next);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return count;
}

export default function Home() {
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [activePage, setActivePage] = useState("Anrufe");
  const [activeCalendar, setActiveCalendar] = useState("Frau Dr. Tilse");
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Alle");
  const [search, setSearch] = useState("");  
  const [anliegenFilter, setAnliegenFilter] = useState("Alle");
  const [arztFilter, setArztFilter] = useState("Alle");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;  
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [appointmentPatient, setAppointmentPatient] = useState("");
  const [appointmentExisting, setAppointmentExisting] = useState("Ja");
  const [appointmentBirthdate, setAppointmentBirthdate] = useState("");
  const [appointmentExtras, setAppointmentExtras] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDoctor, setAppointmentDoctor] = useState(activeCalendar);
  const [appointmentNote, setAppointmentNote] = useState("");
  const parseGermanDate = (dateString) => { if (!dateString) return null; const [day, month, year] = dateString.split("."); return new Date(Number(year), Number(month) - 1, Number(day)); };
  const setQuickRange = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    const end = new Date(today);
  
    if (type === "Heute") setDateRange([today, today]);
    if (type === "Gestern") { start.setDate(today.getDate() - 1); setDateRange([start, start]); }
    if (type === "Letzte 7 Tage") { start.setDate(today.getDate() - 6); setDateRange([start, end]); }
    if (type === "Letzte 30 Tage") { start.setDate(today.getDate() - 29); setDateRange([start, end]); }
    if (type === "Diese Woche") { start.setDate(today.getDate() - ((today.getDay() + 6) % 7)); setDateRange([start, end]); }
    if (type === "Letzte Woche") { start.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7); end.setDate(start.getDate() + 6); setDateRange([start, end]); }
    if (type === "Dieser Monat") { start.setDate(1); setDateRange([start, end]); }
    if (type === "Letzter Monat") { start.setMonth(today.getMonth() - 1, 1); end.setMonth(today.getMonth(), 0); setDateRange([start, end]); }
    if (type === "Zurücksetzen") setDateRange([null, null]);
  };
  const updateStatus = (i, value) => setStatusMap(prev => ({ ...prev, [i]: value }));

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1AFGmKqR2typaxKARBprS81ArcBUqXg1RX8sXwNyO1oY/Tabellenblatt1")
      .then((res) => res.json())
      .then((data) => setData([...data].reverse()));
  }, []);
  
  useEffect(() => {
    setAppointmentDoctor(activeCalendar);
  }, [activeCalendar]);  
  
  const termine = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Termin")).length;
  const rezepte = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Rezept")).length;
  const atteste = data.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Attest")).length;

  const filteredData = data.filter((row) => {
    const dateMatch =
      (!startDate && !endDate) ||
      (() => {
        const rowDate = parseGermanDate(row.Datum);
        return (
          rowDate &&
          (!startDate || rowDate >= startDate) &&
          (!endDate || rowDate <= endDate)
        );
      })();
  
    return dateMatch;
  });
  
  const kpiTermine = filteredData.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Termin")).length;
  const kpiRezepte = filteredData.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Rezept")).length;
  const kpiAtteste = filteredData.filter(r => (r.Anliegen || "").split(",").map(x => x.trim()).includes("Attest")).length;

  const appointmentTimes = [
    "07:00", "07:15", "07:30", "07:45",
    "08:00", "08:15", "08:30", "08:45",
    "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45"
  ];

  const toggleExtra = (value) => {
    setAppointmentExtras(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  };
  
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

        {activePage === "Kalender" && (
          <p style={{ color: "#667085" }}>
            Verwalten Sie die Kalender Ihrer Ärzte.
          </p>
        )}

        {activePage === "Anrufe" && (
          <>
            <p style={{ color: "#667085" }}>Übersicht Ihrer von Anna geführten Anrufe.</p>
        
            <div style={cards}>
              <div style={highlightCard}><p>Anrufe gesamt</p><h2><CountUp value={filteredData.length} /></h2></div>
              <div style={card}><p>Termine</p><h2><CountUp value={kpiTermine} /></h2></div>
              <div style={card}><p>Rezepte</p><h2><CountUp value={kpiRezepte} /></h2></div>
              <div style={card}><p>Atteste</p><h2><CountUp value={kpiAtteste} /></h2></div>
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
            
              <div style={anliegenWrapper}>
                <Filter size={16} style={filterIcon} />
                
                <select
                  value={anliegenFilter === "Alle" ? "" : anliegenFilter}
                  onChange={(e) => setAnliegenFilter(e.target.value || "Alle")}
                  style={anliegenFilter !== "Alle" ? filterActive : filterSelect}
                >
                  <option value="" disabled hidden>Anliegen filtern</option>
                  <option value="Alle">Alle</option>
                  <option value="Termin">Termin</option>
                  <option value="Rezept">Rezept</option>
                  <option value="Attest">Attest</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>
            
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={16} style={{ position: "absolute", left: 10, color: arztFilter !== "Alle" ? "#2563eb" : "#64748b" }} />
                
                <select
                  value={arztFilter === "Alle" ? "" : arztFilter}
                  onChange={(e) => setArztFilter(e.target.value || "Alle")}
                  style={arztFilter !== "Alle" ? { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #2563eb", background: "#eff6ff", cursor: "pointer", color: "#1d4ed8", fontWeight: 600 } : { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer" }}
                >
                  <option value="" disabled hidden>Arzt filtern</option>
                  <option value="Alle">Alle</option>
                  <option value="Herr Dr. Tilse">Herr Dr. Tilse</option>
                  <option value="Frau Dr. Tilse">Frau Dr. Tilse</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>

            <div style={{ position: "relative" }}>
              <button onClick={() => setShowDateMenu(!showDateMenu)} style={datePicker}>Zeitraum</button>
            
              {showDateMenu && (
                <div style={dateMenu}>
                  <div style={dateShortcuts}>
                    {["Heute", "Gestern", "Letzte 7 Tage", "Letzte 30 Tage", "Diese Woche", "Letzte Woche", "Dieser Monat", "Letzter Monat", "Zurücksetzen"].map(item => (
                      <button key={item} onClick={() => setQuickRange(item)} style={quickDateButton}>{item}</button>
                    ))}
                  </div>
            
                  <DatePicker
                    inline
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                  />
                </div>
              )}
            </div>
            </div>   
                
            <div style={box}>
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
                
                  const anliegenList = (row.Anliegen || "").split(",").map(x => x.trim());
                
                  const anliegenMatch =
                    anliegenFilter === "Alle" ||
                    (anliegenFilter === "Sonstige" && (!row.Anliegen || row.Anliegen === "-")) ||
                    (row.Anliegen || "").split(",").map(x => x.trim()).includes(anliegenFilter);
                
                  const arztMatch =
                    arztFilter === "Alle" ||
                    (arztFilter === "Sonstige" && (!row.Arzt || row.Arzt === "-")) ||
                    (row.Arzt || "") === arztFilter;
                
                  const dateMatch =
                    (!startDate && !endDate) ||
                    (() => {
                      const rowDate = parseGermanDate(row.Datum);
                      return (
                        (!startDate || rowDate >= startDate) &&
                        (!endDate || rowDate <= endDate)
                      );
                    })();
                
                  return statusMatch && searchMatch && anliegenMatch && arztMatch && dateMatch;
                })
                .map((row, i) => (
                  <div key={i} style={openIndex === i ? callCardOpen : callCard} onMouseEnter={(e) => { if (openIndex !== i) e.currentTarget.style.background = "#f8fafc"; }} onMouseLeave={(e) => { if (openIndex !== i) { e.currentTarget.style.background = "white"; e.currentTarget.style.borderBottom = "1px solid #e5e7eb"; } }} onClick={() => setOpenIndex(openIndex === i ? null : i)}>                  <div style={callTop}>
                    <div>
                      <strong>{row.Uhrzeit || "-"}</strong>
                      <div style={dateText}>{row.Datum || "-"}</div>
                    </div>
                    <span>{row.Name || "-"}</span>
              
                    <span style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
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
          <div style={box}>
                
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              
              <div style={tabBar}>
                {["Frau Dr. Tilse", "Herr Dr. Tilse"].map(item => (
                  <button
                    key={item}
                    onClick={() => setActiveCalendar(item)}
                    style={activeCalendar === item ? activeTab : tabItem}
                  >
                    {item}
                  </button>
                ))}
              </div>
            
              <button
                style={addButton}
                onClick={() => setShowAddAppointment(true)}
              >
                + Termin hinzufügen
              </button>
            
            </div>
        
            <iframe
              src={activeCalendar === "Frau Dr. Tilse" ? "https://calendar.google.com/calendar/embed?src=a97f878565c5dac9bd5b57532837c0cc811565a1b452232db18de9f294d2dbc8%40group.calendar.google.com&ctz=Europe%2FBerlin" : "https://calendar.google.com/calendar/embed?src=ee8c28099ea055a6a6d06eb21cd9038cd860247aabacc309edd6283b1dd9f30b%40group.calendar.google.com&ctz=Europe%2FBerlin"}
              style={{ border: 0, width: "100%", height: 900, borderRadius: 14 }}
              frameBorder="0"
              scrolling="no"
            />
          </div>
        )}

        {showAddAppointment && (
          <div style={modalOverlay}>
            <div style={modal}>
              <div style={modalHeader}>
                <div>
                  <h2 style={{ margin: 0 }}>Termin hinzufügen</h2>
                </div>
                <button onClick={() => setShowAddAppointment(false)} style={closeButton}>×</button>
              </div>
        
              <div style={formSection}>
                <p style={sectionTitle}>Patientendaten</p>
              
                <div style={formGrid}>
                  <div>
                    <label style={formLabel}>Name des Patienten</label>
                    <input placeholder="z. B. Max Mustermann" value={appointmentPatient} onChange={(e) => setAppointmentPatient(e.target.value)} style={input} />
                  </div>
              
                  <div>
                    <label style={formLabel}>Bestandspatient</label>
                    <select value={appointmentExisting} onChange={(e) => setAppointmentExisting(e.target.value)} style={input}>
                      <option>Ja</option>
                      <option>Nein</option>
                    </select>
                  </div>
              
                  <div>
                    <label style={formLabel}>Geburtsdatum</label>
                    <input type="date" value={appointmentBirthdate} onChange={(e) => setAppointmentBirthdate(e.target.value)} style={input} />
                  </div>
                  
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={formLabel}>Zusätzlich gewünscht</label>
                  
                    <div style={{ display: "flex", gap: 10 }}>
                      <label style={checkOption}>
                        <input type="checkbox" checked={appointmentExtras.includes("Rezept")} onChange={() => toggleExtra("Rezept")} />
                        Rezept
                      </label>
                  
                      <label style={checkOption}>
                        <input type="checkbox" checked={appointmentExtras.includes("Attest")} onChange={() => toggleExtra("Attest")} />
                        Attest
                      </label>
                    </div>
                  </div>
          
                </div>
              </div>
              
              <div style={formSection}>
                <p style={sectionTitle}>Termindaten</p>
              
                <div style={formGrid}>
                  <div>
                    <label style={formLabel}>Datum</label>
                    <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={input} />
                  </div>
              
                  <div>
                    <label style={formLabel}>Uhrzeit</label>
                    <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} style={input}>
                      <option value="">Uhrzeit auswählen</option>
                      {appointmentTimes.map(time => (
                        <option key={time} value={time}>{time} Uhr</option>
                      ))}
                    </select>
                  </div>
              
                  <div>
                    <label style={formLabel}>Arzt</label>
                    <select value={appointmentDoctor} onChange={(e) => setAppointmentDoctor(e.target.value)} style={input}>
                      <option>Frau Dr. Tilse</option>
                      <option>Herr Dr. Tilse</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={formSection}>
                <p style={sectionTitle}>Notiz</p>
                <textarea placeholder="Notiz / Beschreibung" value={appointmentNote} onChange={(e) => setAppointmentNote(e.target.value)} style={textareaFull} />
              </div>

              <div style={modalActions}>
                <button onClick={() => setShowAddAppointment(false)} style={cancelButton}>Abbrechen</button>
                <button style={addButton}>Termin speichern</button>
              </div>
            </div>
          </div>
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
const callTop = { display: "grid", gridTemplateColumns: "90px 220px 360px 1fr 140px", gap: 12, alignItems: "center" };
const badge = { width: 90, minWidth: 90, height: 28, flexShrink: 0, display: "inline-flex", justifyContent: "center", alignItems: "center", borderRadius: 999, fontSize: 13, fontWeight: 500 };
const highlightCard = {  background: "linear-gradient(135deg, #2563eb, #1e40af)",  color: "white",  padding: 24,  borderRadius: 16,  boxShadow: "0 12px 30px rgba(37,99,235,0.30)"};
const headerRow = { display: "grid", gridTemplateColumns: "90px 220px 360px 1fr 140px", gap: 12, fontSize: 13, color: "#667085", marginBottom: 10, padding: "0 16px" };
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
const datePicker = {  padding: "10px 12px",  borderRadius: 10,  border: "1px solid #dbe1ea",  cursor: "pointer",  width: 180};
const anliegenWrapper = { position: "relative", display: "flex", alignItems: "center" };
const filterIcon = { position: "absolute", left: 10, color: "#64748b" };
const filterSelect = { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer" };
const filterActive = { padding: "10px 12px 10px 32px", borderRadius: 10, border: "1px solid #2563eb", background: "#eff6ff", cursor: "pointer", color: "#1d4ed8", fontWeight: 600 };
const quickDateButton = { padding: "10px 12px", borderRadius: 10, border: "1px solid #dbe1ea", background: "white", cursor: "pointer", fontSize: 13 };
const dateMenu = { position: "absolute", top: 48, right: 0, zIndex: 20, display: "flex", gap: 16, background: "white", padding: 12, borderRadius: 14, boxShadow: "0 12px 30px rgba(15,23,42,0.18)", border: "1px solid #e5e7eb" };
const dateShortcuts = { display: "flex", flexDirection: "column", gap: 8, minWidth: 140 };
const addButton = {  padding: "10px 14px",  borderRadius: 10,  border: "none",  background: "#2563eb",  color: "white",  cursor: "pointer",  fontWeight: 700};
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 };
const modal = { background: "white", padding: 24, borderRadius: 20, width: 560, display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 24px 70px rgba(15,23,42,0.25)", animation: "fadeIn 0.2s ease" };
const modalHeader = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 };
const modalSubtext = { margin: "6px 0 0", color: "#667085", fontSize: 14 };
const closeButton = { border: "none", background: "#f1f5f9", width: 34, height: 34, borderRadius: 10, cursor: "pointer", fontSize: 20, color: "#334155", display: "flex", alignItems: "center", justifyContent: "center" };
const input = { padding: "12px 14px", borderRadius: 12, border: "1px solid #dbe1ea", background: "#f8fafc", fontSize: 14, outline: "none" };
const textarea = { ...input, height: 90, resize: "none", fontFamily: "Arial" };
const modalActions = { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 };
const cancelButton = { padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontWeight: 600 };
const formLabel = { display: "block", marginBottom: 6, color: "#475569", fontSize: 13, fontWeight: 400 };
const formSection = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 };
const sectionTitle = { margin: "0 0 12px", fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: 0.3 };
const formGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const textareaFull = { ...input, width: "100%", height: 100, resize: "none", fontFamily: "Arial", boxSizing: "border-box" };
const checkOption = { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, border: "1px solid #dbe1ea", background: "white", cursor: "pointer", fontSize: 14, color: "#334155" };
