import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1AFGmKqR2typaxKARBprS81ArcBUqXg1RX8sXwNyO1oY/Tabellenblatt1")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f7fb",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dr. Tilse Dashboard</h1>
      <p style={{ color: "#667085", marginBottom: 30 }}>
        Übersicht aller eingegangenen KI-Telefonate
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
        marginBottom: 30
      }}>
        <div style={cardStyle}>
          <p style={labelStyle}>Anrufe gesamt</p>
          <h2>{data.length}</h2>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Termine</p>
          <h2>{data.filter(r => r.Anliegen === "Termin").length}</h2>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Rezepte</p>
          <h2>{data.filter(r => r.Anliegen === "Rezept").length}</h2>
        </div>
      </div>

      <div style={tableBoxStyle}>
        <h2 style={{ marginBottom: 20 }}>Letzte Anrufe</h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Datum", "Uhrzeit", "Name", "Anliegen", "Arzt", "Zusammenfassung"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td style={tdStyle}>{row.Datum || "-"}</td>
                <td style={tdStyle}>{row.Uhrzeit || "-"}</td>
                <td style={tdStyle}>{row.Name || "-"}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle}>{row.Anliegen || "-"}</span>
                </td>
                <td style={tdStyle}>{row.Arzt || "-"}</td>
                <td style={tdStyle}>{row.Zusammenfassung || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
};

const labelStyle = {
  color: "#667085",
  margin: 0
};

const tableBoxStyle = {
  background: "white",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
};

const thStyle = {
  textAlign: "left",
  padding: 14,
  borderBottom: "1px solid #e5e7eb",
  color: "#475467"
};

const tdStyle = {
  padding: 14,
  borderBottom: "1px solid #eef0f3",
  verticalAlign: "top"
};

const badgeStyle = {
  background: "#e0f2fe",
  color: "#0369a1",
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13
};
