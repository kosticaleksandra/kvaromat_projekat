import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [health, setHealth] = useState<string>("(loading)");

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL as string; // npr. http://localhost:4000/api/v1
    fetch(`${base}/health`)
      .then((r) => r.json())
      .then((d) => setHealth(JSON.stringify(d, null, 2)))
      .catch((e) => setHealth("error: " + String(e)));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>

      {/* === Health-check sa servera === */}
      <h2>API health</h2>
      <pre style={{ textAlign: "left", background: "#f6f8fa", padding: 12, borderRadius: 8 }}>
        {health}
      </pre>
    </>
  );
}

export default App;
