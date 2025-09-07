// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/auth/useAuthHook";

const pageShell: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  alignContent: "start",
  paddingTop: 24,
  paddingBottom: 64,
};

const pageContainer = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 16px",
} as const;

const makeGridStyle = (cols: number) =>
  ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
    gap: 20,
    marginBottom: 24,
  }) as const;

const headerRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

const btn = {
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
} as const;

const btnDanger = { ...btn, background: "#e11d48" } as const;

const btnGhost = {
  background: "transparent",
  color: "#ec4899",
  border: "1px solid rgba(236,72,153,0.6)",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  lineHeight: 1,
  cursor: "pointer",
} as const;

const btnLogoutTiny = {
  background: "#e11d48",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 10px",
  fontWeight: 700,
  fontSize: 12,
  lineHeight: 1,
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  width: "auto",
  flex: "0 0 auto",
} as const;

const card = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(225,119,150,0.35)",
  borderRadius: 16,
  boxShadow: "0 6px 14px rgba(225,119,150,0.18)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  transition: "transform .14s ease, box-shadow .14s ease",
} as const;

const cardHover = {
  transform: "translateY(-6px) scale(1.01)",
  boxShadow: "0 12px 26px rgba(225,119,150,0.32)",
} as const;

const imgBox = {
  width: 64,
  height: 64,
  borderRadius: 12,
  background: "rgba(244,114,182,0.12)",
  border: "1px solid rgba(225,119,150,0.35)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
} as const;

const imgInner = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 10,
  display: "block",
} as const;

const badge = (bg: string, fg: string) =>
  ({
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    border: "1px solid rgba(0,0,0,0.06)",
    background: bg,
    color: fg,
  }) as const;

const statusStyle = (s?: string) => {
  if (s === "Kreiran") return badge("rgba(244,114,182,0.25)", "#7a2946");
  if (s === "Popravka u toku") return badge("rgba(244,114,182,0.18)", "#5b264b");
  if (s === "Saniran") return badge("rgba(16,185,129,0.18)", "#065f46");
  if (s === "Problem nije rešen")
    return badge("rgba(239,68,68,0.18)", "#7f1d1d");
  return badge("rgba(226,232,240,0.6)", "#1f2937");
};

const pill = {
  padding: "6px 10px",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 12,
  background: "rgba(255,240,246,0.9)",
  border: "1px solid rgba(225,119,150,0.35)",
  color: "#7a2946",
  display: "inline-flex",
} as const;


const reactionsWrap: React.CSSProperties = { display: "grid", gap: 6 };
const reactionsRow = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginTop: 4,
  flexWrap: "wrap",
} as const;
const reactionLabel = {
  fontSize: 12,
  fontWeight: 800,
  color: "#be185d",
  letterSpacing: 0.2,
} as const;

const reactionBtnBase = {
  all: "unset" as const,
  width: 40,
  height: 40,
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 18,
  transition:
    "transform .08s ease, background .15s ease, border-color .15s ease, box-shadow .15s ease",
} as const;

const reactionStyle = (active: boolean): React.CSSProperties =>
  active
    ? {
        ...reactionBtnBase,
        background: "rgba(236,72,153,0.90)",
        border: "1px solid #db2777",
        boxShadow: "0 0 0 3px rgba(236,72,153,0.25)",
        transform: "translateY(-1px)",
        color: "#fff",
      }
    : {
        ...reactionBtnBase,
        background: "rgba(244,63,94,0.12)",
        border: "1px solid rgba(244,63,94,0.25)",
      };

const backdrop: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
  padding: 16,
  boxSizing: "border-box",
};

const modal: React.CSSProperties = {
  width: "min(640px, calc(100vw - 32px))",
  maxHeight: "calc(100vh - 32px)",
  overflowY: "auto",
  boxSizing: "border-box",

  background: "#fff",
  borderRadius: 16,
  border: "1px solid rgba(225,119,150,0.35)",
  boxShadow: "0 10px 30px rgba(0,0,0,.2)",
  padding: 16,
  display: "grid",
  gap: 12,
};

const input = {
  width: "100%",
  border: "1px solid rgba(225,119,150,0.35)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  boxSizing: "border-box" as const,
} as const;

const label = {
  fontSize: 12,
  fontWeight: 800,
  color: "#7a2946",
  textTransform: "uppercase",
} as const;


type Props = { api?: any; token?: string };


const normalize = (raw: any) => {
  if (!raw || typeof raw !== "object") return {} as any;
  const id =
    Number(raw.id ?? raw.ID ?? raw.faultId ?? raw.FaultId ?? 0) ||
    Math.floor(Math.random() * 1e9);
  return {
    id,
    name: raw.name ?? raw.title ?? raw.naziv ?? "",
    description: raw.description ?? raw.opis ?? "",
    createdAt: raw.createdAt ?? raw.created_at ?? raw.timestamp ?? "",
    status: raw.status ?? raw.stanje ?? "Kreiran",
    imageUrl: raw.imageUrl ?? raw.image ?? raw.photo ?? "",
    comment: raw.comment ?? raw.komentar ?? raw.note ?? undefined,
    price: raw.price ?? raw.cena ?? raw?.comment?.price,
  };
};


export default function TabelaKvarova({ api, token }: Props) {
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("jwt");
    } catch {}
    logout?.();
  };

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("svi");
  const [sortKey, setSortKey] = useState("date_desc");


  const [reactions, setReactions] = useState<Record<number, any>>({});
  const [sending, setSending] = useState<Record<number, boolean>>({});

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [hoverNewBtn, setHoverNewBtn] = useState(false);


  const [openNew, setOpenNew] = useState(false);
  const [fNaziv, setFNaziv] = useState("");
  const [fDatum, setFDatum] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [fOpis, setFOpis] = useState("");
  const [fFile, setFFile] = useState<File | null>(null);
  const [fPreview, setFPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [cols, setCols] = useState(1);
  useEffect(() => {
    const update = () =>
      setCols(window.innerWidth >= 1280 ? 3 : window.innerWidth >= 960 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);


  const toDate = (v?: any) => (v ? new Date(v).getTime() || 0 : 0);
  const formatDate = (v?: any) =>
    v
      ? new Intl.DateTimeFormat("sr-RS", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(v))
      : "—";
  const priceOf = (k: any) =>
    Number(((k?.price ?? k?.comment?.price ?? 0) as any)) || 0;
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
    }).format(n);
  const imgSrc = (raw?: string | null) => {
    const name = (raw ?? "default.jpg").trim();
    return name.startsWith("/") ? name : `/images/${name || "default.jpg"}`;
  };

  useEffect(() => {
    let dead = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let data: any[] = [];
        if (api?.getAllFaults) {
          data = await api.getAllFaults(token ?? "");
        } else {
          data = [];
        }
        const filtered =
          statusFilter === "svi"
            ? data
            : data.filter((f) => f?.status === statusFilter);

        filtered.sort((a, b) => {
          if (sortKey === "date_desc")
            return toDate(b?.createdAt) - toDate(a?.createdAt);
          if (sortKey === "date_asc")
            return toDate(a?.createdAt) - toDate(b?.createdAt);
          if (sortKey === "price_asc") return priceOf(a) - priceOf(b);
          return priceOf(b) - priceOf(a);
        });

        if (!dead) setItems(filtered);
      } catch (e: any) {
        if (!dead) {
          setError(e?.message ?? "Greška pri učitavanju.");
          setItems([]);
        }
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, [api, token, statusFilter, sortKey]);

  const handleReaction = async (
    id: number,
    kind: "like" | "dislike" | "heart"
  ) => {
    if (!id) return;
    const prev = reactions[id] ?? null;
    const next = prev === kind ? null : kind;

    setReactions((r) => ({ ...r, [id]: next }));
    setSending((s) => ({ ...s, [id]: true }));
    try {
      if (api?.sendReaction) {
        await api.sendReaction(token ?? "", id, next);
      }
    } catch {
      setReactions((r) => ({ ...r, [id]: prev }));
      alert("Nije uspelo slanje reakcije.");
    } finally {
      setSending((s) => ({ ...s, [id]: false }));
    }
  };

  const labelFor = (kind: "like" | "dislike" | "heart" | null) =>
    kind === "like"
      ? "svidja mi se"
      : kind === "dislike"
      ? "ne svidja mi se"
      : kind === "heart"
      ? "bravo"
      : "";

  const prikazani = useMemo(() => items, [items]);

  const resetForm = () => {
    setFNaziv("");
    setFOpis("");
    setFormError(null);
    setFFile(null);
    setFPreview(null);
    setFDatum(() => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    });
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFPreview(url);
    } else {
      setFPreview(null);
    }
  };

  const submitNewFault = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fNaziv.trim()) {
      setFormError("Naziv je obavezan.");
      return;
    }
    if (!fOpis.trim()) {
      setFormError("Opis je obavezan.");
      return;
    }

    setSubmitting(true);
    try {
      const createdAtISO = new Date(fDatum).toISOString();
      let created: any = null;

      if (fFile && api?.createFaultWithFile) {
        const fd = new FormData();
        fd.append("name", fNaziv.trim());
        fd.append("description", fOpis.trim());
        fd.append("createdAt", createdAtISO);
        fd.append("file", fFile);
        fd.append("status", "Kreiran");
        created = await api.createFaultWithFile(token ?? "", fd);
      } else if (api?.createFault) {
        created = await api.createFault(token ?? "", {
          name: fNaziv.trim(),
          description: fOpis.trim(),
          createdAt: createdAtISO,
          status: "Kreiran",
          imageUrl: fFile ? fFile.name : undefined,
        });
      } else {
        created = {
          id: Math.floor(Math.random() * 1e9),
          name: fNaziv.trim(),
          description: fOpis.trim(),
          createdAt: createdAtISO,
          status: "Kreiran",
          imageUrl: fFile ? fFile.name : "",
        };
      }

      let createdNormalized = normalize(created);
      createdNormalized = {
        ...createdNormalized,
        name: (createdNormalized.name || "").trim() || fNaziv.trim(),
        description:
          (createdNormalized.description || "").trim() || fOpis.trim(),
        createdAt: createdNormalized.createdAt || createdAtISO,
        status: createdNormalized.status || "Kreiran",
        imageUrl: createdNormalized.imageUrl || (fFile ? fFile.name : ""),
      };

      setItems((prev) => [createdNormalized, ...prev]);
      setOpenNew(false);
      resetForm();
    } catch (err: any) {
      setFormError(err?.message ?? "Prijava nije uspela.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={pageShell}>
      <div style={pageContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              color: "#7f1d2d",
              fontSize: 22,
            }}
          >
            Moji kvarovi
          </h2>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                ...btn,
                ...(hoverNewBtn
                  ? {
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 6px 14px rgba(236,72,153,0.35)",
                    }
                  : {}),
              }}
              onMouseEnter={() => setHoverNewBtn(true)}
              onMouseLeave={() => setHoverNewBtn(false)}
              onClick={() => setOpenNew(true)}
            >
              Prijavi kvar
            </button>

            <button style={btnDanger} onClick={handleLogout}>
              Odjavi se
            </button>
          </div>
        </div>

        <div
          style={{
            ...headerRow,
            marginBottom: 16,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <label style={{ color: "#7a2946", fontSize: 14 }}>
            Status:&nbsp;
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(225,119,150,0.35)",
              }}
            >
              <option value="svi">Svi</option>
              <option value="Kreiran">Kreiran</option>
              <option value="Popravka u toku">Popravka u toku</option>
              <option value="Saniran">Saniran</option>
              <option value="Problem nije rešen">Problem nije rešen</option>
            </select>
          </label>

          <label style={{ color: "#7a2946", fontSize: 14 }}>
            Sortiraj po:&nbsp;
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid rgba(225,119,150,0.35)",
              }}
            >
              <option value="date_desc">Datumu (noviji prvo)</option>
              <option value="date_asc">Datumu (stariji prvo)</option>
              <option value="price_asc">Ceni (rastuće)</option>
              <option value="price_desc">Ceni (opadajuće)</option>
            </select>
          </label>
        </div>

        {loading && <div>Učitavam…</div>}
        {error && <div style={{ color: "#b91c1c" }}>{error}</div>}

        {!loading && (
          <div style={makeGridStyle(cols)}>
            {prikazani.length ? (
              prikazani.map((k) => {
                const cena = priceOf(k);
                const komentarText =
                  k?.comment?.comment ??
                  (typeof k?.comment === "string" ? k?.comment : "—");

                const active = reactions[k?.id ?? -1] ?? null;
                const isSending = !!sending[k?.id ?? -1];
                const isHovered = hoveredId === (k?.id ?? -1);

                return (
                  <article
                    key={k?.id ?? Math.random()}
                    style={{ ...card, ...(isHovered ? cardHover : {}) }}
                    onMouseEnter={() => setHoveredId(k?.id ?? -1)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={headerRow}>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 800,
                            color: "#111827",
                            fontSize: 16,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {k?.name ?? "—"}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            marginTop: 2,
                          }}
                        >
                          {formatDate(k?.createdAt)}
                        </div>
                      </div>
                      <span style={statusStyle(k?.status ?? "")}>
                        {String(k?.status ?? "—").toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={imgBox}>
                        <img
                          src={imgSrc(k?.imageUrl)}
                          alt={k?.name ?? ""}
                          style={imgInner}
                        />
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          lineHeight: 1.45,
                          color: "#3f3f46",
                        }}
                      >
                        {k?.description ?? "—"}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            textTransform: "uppercase",
                            color: "#7a2946",
                            fontWeight: 700,
                          }}
                        >
                          Cena
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <span style={pill}>{formatPrice(cena)}</span>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            textTransform: "uppercase",
                            color: "#7a2946",
                            fontWeight: 700,
                          }}
                        >
                          Komentar majstora
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13, color: "#111827" }}>
                          {komentarText}
                        </div>
                      </div>
                    </div>

                    {k?.status === "Saniran" && (
                      <div style={reactionsWrap}>
                        <div style={reactionsRow}>
                          <button
                            type="button"
                            title="svidja mi se"
                            aria-pressed={active === "like"}
                            style={reactionStyle(active === "like")}
                            disabled={isSending}
                            onClick={() => handleReaction(k?.id, "like")}
                          >
                            👍
                          </button>
                          <button
                            type="button"
                            title="ne svidja mi se"
                            aria-pressed={active === "dislike"}
                            style={reactionStyle(active === "dislike")}
                            disabled={isSending}
                            onClick={() => handleReaction(k?.id, "dislike")}
                          >
                            👎
                          </button>
                          <button
                            type="button"
                            title="bravo"
                            aria-pressed={active === "heart"}
                            style={reactionStyle(active === "heart")}
                            disabled={isSending}
                            onClick={() => handleReaction(k?.id, "heart")}
                          >
                            ❤️
                          </button>
                        </div>
                        {active && <div style={reactionLabel}>{labelFor(active)}</div>}
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: 16,
                  color: "#7a2946",
                }}
              >
                Nema zapisa za izabrane filtere.
              </div>
            )}
          </div>
        )}
      </div>

      {openNew && (
        <div style={backdrop} onClick={() => !submitting && setOpenNew(false)}>
          <form
            style={modal}
            onSubmit={submitNewFault}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: "#7f1d2d" }}>Prijavi kvar</h3>

            <label style={label}>Naziv</label>
            <input
              style={input}
              type="text"
              placeholder="npr. Curi slavina u kupatilu"
              value={fNaziv}
              onChange={(e) => setFNaziv(e.target.value)}
            />

            <label style={label}>Datum</label>
            <input
              style={input}
              type="datetime-local"
              value={fDatum}
              onChange={(e) => setFDatum(e.target.value)}
            />

            <label style={label}>Opis</label>
            <textarea
              style={{ ...input, minHeight: 90, resize: "vertical" }}
              placeholder="Ukratko opišite problem…"
              value={fOpis}
              onChange={(e) => setFOpis(e.target.value)}
            />

            <label style={label}>Slika (opciono)</label>
            <input style={input} type="file" accept="image/*" onChange={onPickFile} />
            {fPreview && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <img
                  src={fPreview}
                  alt="preview"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: "1px solid rgba(225,119,150,0.35)",
                  }}
                />
                <button
                  type="button"
                  style={btnGhost}
                  onClick={() => {
                    setFFile(null);
                    setFPreview(null);
                  }}
                >
                  Ukloni sliku
                </button>
              </div>
            )}

            {formError && (
              <div style={{ color: "#b91c1c", fontWeight: 700 }}>{formError}</div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "end",
                gap: 8,
                marginTop: 6,
              }}
            >
              <button
                type="button"
                style={btnGhost}
                onClick={() => !submitting && (setOpenNew(false), resetForm())}
                disabled={submitting}
              >
                Otkaži
              </button>
              <button type="submit" style={btn} disabled={submitting}>
                {submitting ? "Šaljem…" : "Pošalji prijavu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
