import { useEffect, useState } from "react";
import type { IFaultService } from "../../../api_services/fault/IFaultService";
import type { Fault } from "../../../models/fault/Fault";

type Props = {
  faultApi: IFaultService;
  token: string;
  userId: number;
  onCreated: (created: Fault) => void;
  onCancel: () => void;
};

const IMAGES_MANIFEST_URL = "/images/_index.json";

export function DodajKvarForma({
  faultApi,
  token,
  userId,
  onCreated,
  onCancel,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [imageUrl, setImageUrl] = useState<string>("");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!pickerOpen) return;
    setImgError(null);
    setImgLoading(true);
    fetch(IMAGES_MANIFEST_URL)
      .then((r) => {
        if (!r.ok) throw new Error("Ne mogu da učitam listu slika.");
        return r.json() as Promise<string[]>;
      })
      .then((list) => setImageList(list))
      .catch((err) =>
        setImgError(err?.message || "Greška pri učitavanju slika.")
      )
      .finally(() => setImgLoading(false));
  }, [pickerOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim()) {
      setError("Naziv i opis su obavezni.");
      return;
    }

    let createdAtIso = "";
    try {
      const local = new Date(createdAt);
      if (!isNaN(local.getTime())) {
        createdAtIso = new Date(
          local.getTime() - local.getTimezoneOffset() * 60000
        ).toISOString();
      }
    } catch {
      createdAtIso = new Date().toISOString();
    }
    if (!createdAtIso) createdAtIso = new Date().toISOString();

    try {
      setSubmitting(true);

      const payload = {
        userId,
        name: name.trim(),
        description: description.trim(), 
        imageUrl: (imageUrl || "").trim() || undefined,
        createdAt: createdAtIso,
        status: "Kreiran" as const,
      };

      const created = await faultApi.createFault(token, payload);

    
      const normalized: Fault = {
        ...(created as any),
        name: (created as any)?.name ?? payload.name,
        description:
          (created as any)?.description ??
          (created as any)?.opis ??
          payload.description,
        imageUrl: (created as any)?.imageUrl ?? payload.imageUrl ?? null,
        status: (created as any)?.status ?? "Kreiran",
        createdAt: (created as any)?.createdAt ?? payload.createdAt,
      };

      onCreated(normalized);

      // reset forme
      setName("");
      setDescription("");
      setImageUrl("");
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setCreatedAt(now.toISOString().slice(0, 16));
    } catch (err: any) {
      setError(err?.message || "Greška pri prijavi kvara.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Prijava novog kvara</h1>
      <form onSubmit={submit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Naziv kvara *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            title="Datum i vreme"
          />
        </div>

        <div className="input-group">
          <textarea
            placeholder="Opis kvara *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="input-group image-field">
          <input type="text" placeholder="default.jpg" value={imageUrl} readOnly />
          <button
            type="button"
            className="choose-btn"
            onClick={() => setPickerOpen((v) => !v)}
            title="Odaberi sliku"
            aria-label="Odaberi sliku"
          >
            …
          </button>

          {imageUrl ? <img src={`/images/${imageUrl}`} alt="" /> : null}

          {pickerOpen && (
            <div className="image-picker">
              <div className="hd">
                <button type="button" onClick={() => setPickerOpen(false)}>
                  Zatvori
                </button>
              </div>

              {imgLoading && <div>Učitavam…</div>}
              {imgError && <div style={{ color: "crimson" }}>{imgError}</div>}

              {!imgLoading && !imgError && (
                <div className="grid">
                  {imageList.map((file) => (
                    <button
                      key={file}
                      type="button"
                      className={`thumb ${imageUrl === file ? "selected" : ""}`}
                      onClick={() => {
                        setImageUrl(file);
                        setPickerOpen(false);
                      }}
                      title={file}
                    >
                      <img src={`/images/${file}`} alt={file} />
                      <span>{file}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? "Slanje…" : "Sačuvaj"}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onCancel}
            disabled={submitting}
          >
            Otkaži
          </button>
        </div>
      </form>
    </div>
  );
}
