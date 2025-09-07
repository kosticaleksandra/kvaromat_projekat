import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../../hooks/auth/useAuthHook";
import { ObrišiVrednostPoKljuču } from "../../../helpers/local_storage";
import type { IFaultService } from "../../../api_services/fault/IFaultService";
import { faultApi } from "../../../api_services/fault/FaultService";
import type { Fault } from "../../../models/fault/Fault";
import type { FaultStatus } from "../../../models/fault/FaultStatus";
import ZakljuciRadDialog from "../form/ZakljuciRadDialog";

const pageShell: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  alignContent: "start",
  paddingTop: 24,
  paddingBottom: 64,
};
const pageContainer: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "0 16px" };
const headerRow: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between" };

const makeGridStyle = (cols: number): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
  gap: 20,
  marginBottom: 24,
});

const btn: React.CSSProperties = {
  background: "#ec4899",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  lineHeight: 1,
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  transition: "transform .12s ease, box-shadow .12s ease",
};

const btnDanger: React.CSSProperties = { ...btn, background: "#e11d48" };

const btnDangerCompact: React.CSSProperties = {
  ...btnDanger,
  padding: "10px 14px",
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  width: "auto",
  flex: "0 0 auto",
  whiteSpace: "nowrap",
};


const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(225,119,150,0.35)",
  borderRadius: 16,
  boxShadow: "0 6px 14px rgba(225,119,150,0.18)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  transition: "transform .14s ease, box-shadow .14s ease", 
};
const cardHover: React.CSSProperties = {
  transform: "translateY(-6px) scale(1.01)",
  boxShadow: "0 12px 26px rgba(225,119,150,0.32)",
};

const imgBox: React.CSSProperties = {
  width: 64, height: 64, borderRadius: 12,
  background: "rgba(244,114,182,0.12)",
  border: "1px solid rgba(225,119,150,0.35)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  overflow: "hidden",
  display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
};
const imgInner: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, display: "block" };

const badge = (bg: string, fg: string): React.CSSProperties => ({
  padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
  border: "1px solid rgba(0,0,0,0.06)", background: bg, color: fg,
});
const statusStyle = (s: string): React.CSSProperties => {
  if (s === "Kreiran") return badge("rgba(244,114,182,0.25)", "#7a2946");
  if (s === "Popravka u toku") return badge("rgba(244,114,182,0.18)", "#5b264b");
  if (s === "Saniran") return badge("rgba(16,185,129,0.18)", "#065f46");
  if (s === "Problem nije rešen") return badge("rgba(239,68,68,0.18)", "#7f1d1d");
  return badge("rgba(226,232,240,0.6)", "#1f2937");
};

const pill: React.CSSProperties = {
  padding: "6px 10px", borderRadius: 12, fontWeight: 700, fontSize: 12,
  background: "rgba(255,240,246,0.9)", border: "1px solid rgba(225,119,150,0.35)",
  color: "#7a2946", display: "inline-flex",
};


const actionRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "nowrap",
};
const smallPinkBtn: React.CSSProperties = {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1 1 0",
  minWidth: 0,
  height: 36,
  padding: "0 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
  userSelect: "none",
  color: "#fff",
  background: "#ec4899",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
};

type StatusFilter = FaultStatus | "svi";
type Props = { api?: IFaultService; token?: string };

export default function TabelaKvarova({ api: injectedApi, token: injectedToken }: Props) {
  const api = useMemo(() => injectedApi ?? faultApi, [injectedApi]);
  const { token: authToken, logout } = useAuth();
  const effectiveToken = injectedToken ?? authToken;

  const [kvarovi, setKvarovi] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Kreiran");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);


  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [targetStatus, setTargetStatus] = useState<FaultStatus | null>(null);

  const [cols, setCols] = useState<number>(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w >= 1280 ? 3 : w >= 960 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toDate = (v?: string | Date) => {
    if (!v) return 0;
    const d = typeof v === "string" ? new Date(v) : v;
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };
  const formatDate = (v?: string | Date) =>
    v ? new Intl.DateTimeFormat("sr-RS", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)) : "—";
  const formatPrice = (v?: number) =>
    typeof v === "number" && Number.isFinite(v)
      ? new Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD" }).format(v)
      : "0.00 RSD";
  const imgSrc = (raw?: string | null) => {
    const name = (raw ?? "default.jpg").trim();
    if (!name) return "/images/default.jpg";
    return name.startsWith("/") ? name : `/images/${name}`;
  };


  const load = useCallback(async () => {
    if (!effectiveToken) {
      setError("Nedostaje token za autorizaciju.");
      setLoading(false);
      return;
    }
    setLoading(true); setError(null);
    try {
      let data: Fault[] = [];
      if (statusFilter === "svi") data = await api.getAllFaults(effectiveToken);
      else {
        try { data = await api.getFaultsByStatus(effectiveToken, statusFilter); }
        catch {
          const all = await api.getAllFaults(effectiveToken);
          data = all.filter((f) => f.status === statusFilter);
        }
      }
      data.sort((a, b) => toDate(b.createdAt as any) - toDate(a.createdAt as any));
      setKvarovi(data);
    } catch (e: any) {
      setError(e?.message ?? "Greška pri učitavanju kvarova.");
      setKvarovi([]);
    } finally { setLoading(false); }
  }, [effectiveToken, statusFilter, api]);
  useEffect(() => { (async () => { await load(); })(); }, [load]);

  const runUpdate = async (id: number, next: FaultStatus) => {
    if (!effectiveToken) return;
    setUpdatingId(id);
    try {
      await api.updateFaultStatus(effectiveToken, id, next);
      setKvarovi((prev) => prev.map((k) => (k.id === id ? { ...k, status: next } : k)));
    } catch (e: any) {
      alert(e?.message ?? "Greška pri promeni statusa.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAccept    = (id: number) => { if (!confirm("Prihvatiti rad na ovom kvaru?")) return; runUpdate(id, "Popravka u toku"); };
  const handleSaniran   = (id: number) => { setActiveId(id); setTargetStatus("Saniran");            setDialogOpen(true); };
  const handleNijeResen = (id: number) => { setActiveId(id); setTargetStatus("Problem nije rešen"); setDialogOpen(true); };

  const submitZakljuci = async ({ comment, price }: { comment: string; price: number }) => {
    if (!effectiveToken || !activeId || !targetStatus) return;
    setUpdatingId(activeId);
    try {
      const updated = await api.resolveFault(effectiveToken, activeId, { status: targetStatus, comment, price });
      const updatedPrice = Number((updated as any).price);
      setKvarovi((prev) =>
        prev.map((k) =>
          k.id === activeId
            ? {
                ...k,
                status: targetStatus,
                comment: (updated as any).comment,
                price: Number.isFinite(updatedPrice) ? updatedPrice : (updated as any).price,
              }
            : k
        )
      );
    } catch (e: any) {
      alert(e?.message ?? "Greška pri zaključivanju kvara.");
    } finally {
      setUpdatingId(null);
      setDialogOpen(false);
      setActiveId(null);
      setTargetStatus(null);
    }
  };

  const { logout: doLogout } = useAuth();
  const handleLogout = () => {
    try { ObrišiVrednostPoKljuču("authToken"); } catch {}
    localStorage.removeItem("token"); localStorage.removeItem("jwt");
    doLogout();
  };

  const prikazani = useMemo(
    () => (statusFilter === "svi" ? kvarovi : kvarovi.filter((k) => k.status === statusFilter)),
    [kvarovi, statusFilter]
  );

  return (
    <div style={pageShell}>
      <div style={pageContainer}>
        {/* Header */}
        <div style={{ ...headerRow, marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontWeight: 800, color: "#7f1d2d", fontSize: 22 }}>KVAROVI</h2>

          {/* Odjavi se — malo veće, ali kompaktno */}
          <button onClick={handleLogout} style={btnDangerCompact}>Odjavi se</button>
        </div>

        {/* Filter */}
        <div style={{ ...headerRow, marginBottom: 16 }}>
          <label style={{ color: "#7a2946", fontSize: 14 }}>
            Status:&nbsp;
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(225,119,150,0.35)" }}
            >
              <option value="Kreiran">Kreiran</option>
              <option value="Popravka u toku">Popravka u toku</option>
              <option value="Saniran">Saniran</option>
              <option value="Problem nije rešen">Problem nije rešen</option>
              <option value="svi">Svi</option>
            </select>
          </label>
        </div>

        {loading && <div>Učitavam…</div>}
        {error   && <div style={{ color: "#b91c1c" }}>{error}</div>}

        {!loading && (
          <div style={makeGridStyle(cols)}>
            {prikazani.length ? (
              prikazani.map((k) => {
                const price = (k as any).price ?? (k as any).comment?.price ?? 0;
                const commentText =
                  (k as any).comment?.comment ??
                  (typeof (k as any).comment === "string" ? (k as any).comment : "—");

                const isSaniran   = k.status === "Saniran";
                const showAccept  = k.status === "Kreiran";
                const showResolve = k.status === "Kreiran" || k.status === "Popravka u toku";
                const isHovered   = hoveredId === k.id;

                return (
                  <article
                    key={k.id}
                    style={{ ...card, ...(isHovered ? cardHover : {}) }}
                    onMouseEnter={() => setHoveredId(k.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                  
                    <div style={headerRow}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, color: "#111827", fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {k.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{formatDate(k.createdAt as any)}</div>
                      </div>
                      <span style={statusStyle(k.status)}>{k.status.toUpperCase()}</span>
                    </div>

    
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={imgBox}>
                        <img src={imgSrc(k.imageUrl as any)} alt={k.name} style={imgInner} />
                      </div>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "#3f3f46" }}>{k.description}</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, textTransform: "uppercase", color: "#7a2946", fontWeight: 700 }}>Cena</div>
                        <div style={{ marginTop: 6 }}><span style={pill}>{formatPrice(price)}</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, textTransform: "uppercase", color: "#7a2946", fontWeight: 700 }}>Komentar majstora</div>
                        <div style={{ marginTop: 6, fontSize: 13, color: "#111827" }}>{commentText}</div>
                      </div>
                    </div>

            
                    {!isSaniran && (
                      <div style={actionRow}>
                        {showAccept && (
                          <button
                            onClick={() => k.id && (updatingId !== k.id) && (handleAccept(k.id))}
                            disabled={updatingId === k.id}
                            style={smallPinkBtn}
                          >
                            {updatingId === k.id ? "..." : "Prihvati"}
                          </button>
                        )}

                        {showResolve && (
                          <>
                            <button
                              onClick={() => handleSaniran(k.id)}
                              disabled={updatingId === k.id}
                              style={smallPinkBtn}
                            >
                              Saniran
                            </button>
                            <button
                              onClick={() => handleNijeResen(k.id)}
                              disabled={updatingId === k.id}
                              style={smallPinkBtn}
                            >
                              Problem nije rešen
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 16, color: "#7a2946" }}>
                Nema zapisa za izabrani filter.
              </div>
            )}
          </div>
        )}

        <ZakljuciRadDialog
          open={dialogOpen}
          title={targetStatus === "Saniran" ? "Označi kao saniran" : "Problem nije rešen"}
          onClose={() => { setDialogOpen(false); setActiveId(null); setTargetStatus(null); }}
          onSubmit={submitZakljuci}
        />
      </div>
    </div>
  );
}
