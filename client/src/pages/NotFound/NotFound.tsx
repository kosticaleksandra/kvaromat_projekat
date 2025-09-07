
import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function NotFound() {
  const { pathname } = useLocation();

  const wrapper: React.CSSProperties = {
    minHeight: "70vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background:
      "radial-gradient(1200px 600px at 50% -100px, rgba(236,72,153,0.18), transparent 70%)",
  };

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(225,119,150,0.35)",
    borderRadius: 20,
    boxShadow: "0 10px 30px rgba(225,119,150,0.18)",
    padding: 28,
    textAlign: "center",
    width: "min(720px, 92vw)",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 48,
    fontWeight: 900,
    color: "#7f1d2d",
    letterSpacing: 0.5,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
  };

  const info: React.CSSProperties = {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  };

  const btn: React.CSSProperties = {
    background: "#ec4899",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "12px 20px",
    fontWeight: 800,
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
    transition: "transform .12s ease, box-shadow .12s ease",
    display: "inline-block",
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={title}>404</h1>
        <p style={subtitle}>Stranica nije pronađena</p>
        <p style={info}>
          Tražena ruta: <code>{pathname}</code>
        </p>

        {/* jedno dugme, centrirano */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span
              style={btn}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.transform =
                  "translateY(-2px) scale(1.02)";
                (e.currentTarget as HTMLSpanElement).style.boxShadow =
                  "0 6px 14px rgba(236,72,153,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.transform = "";
                (e.currentTarget as HTMLSpanElement).style.boxShadow =
                  "0 1px 2px rgba(0,0,0,0.06)";
              }}
            >
              Vrati se na početnu
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
