import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1AFGmKqR2typaxKARBprS81ArcBUqXg1RX8sXwNyO1oY/Tabellenblatt1")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dr. Tilse Dashboard</h1>

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Uhrzeit</th>
            <th>Name</th>
            <th>Anliegen</th>
            <th>Arzt</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.Datum}</td>
              <td>{row.Uhrzeit}</td>
              <td>{row.Name}</td>
              <td>{row.Anliegen}</td>
              <td>{row.Arzt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
