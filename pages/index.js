import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

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
        <h2>Praxis</h2>
        <nav>
          <p style={activeNav}>Heute</p>
          <p style={navItem}>Anrufliste</p>
          <p style={navItem}>Kontakte</p>
          <p style={navItem}>Einstellungen</p>
        </nav>
      </aside>

      <main style={main}>
        <h1>Dashboard – Praxis Dr. Tilse</h1>
        <p style={{ color: "#667085" }}>Heutige Anrufübersicht</p>

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

          {data.map((row, i) => (
            <div key={i} style={callCard} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div style={callTop}>
                <strong>{row.Uhrzeit || "-"}</strong>
                <span>{row.Name || "-"}</span>
                <span>{row.Telefonnummer || "-"}</span>
                <span>{row.Arzt || "-"}</span>
                <span style={badge}>{row.Anliegen || "-"}</span>
              </div>

              {openIndex === i && (
                <div style={details}>
                  <p><b>Bestandspatient:</b> {row.Bestandspatient || "-"}</p>
                  <p><b>Geburtsdatum:</b> {row.Geburtsdatum || "-"}</p>
                  <p><b>Zusammenfassung:</b> {row.Zusammenfassung || "-"}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const layout = { display: "flex", minHeight: "100vh", background: "#f5f7fb", fontFamily: "Arial" };
const sidebar = { width: 240, background: "#0f172a", color: "white", padding: 24 };
const main = { flex: 1, padding: 40 };
const navItem = { padding: 12, color: "#cbd5e1" };
const activeNav = { padding: 12, background: "#2563eb", borderRadius: 10 };
const cards = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, margin: "30px 0" };
const card = { background: "white", padding: 24, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" };
const box = { background: "white", padding: 24, borderRadius: 16 };
const callCard = { padding: 16, borderBottom: "1px solid #e5e7eb", cursor: "pointer" };
const callTop = { display: "grid", gridTemplateColumns: "90px 1fr 1fr 1fr 100px", gap: 12, alignItems: "center" };
const badge = { background: "#e0f2fe", color: "#0369a1", padding: "6px 10px", borderRadius: 999, textAlign: "center" };
const details = { marginTop: 14, background: "#f8fafc", padding: 16, borderRadius: 12 };
const highlightCard = {  background: "linear-gradient(135deg, #2563eb, #1e40af)",  color: "white",  padding: 24,  borderRadius: 16,  boxShadow: "0 12px 30px rgba(37,99,235,0.30)"};
