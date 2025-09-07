import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthValidator";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import { jwtDecode } from "jwt-decode";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  interface LocationState {
    korisnickoIme?: string;
    lozinka?: string;
  }

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.korisnickoIme) setKorisnickoIme(state.korisnickoIme);
    if (state?.lozinka) setLozinka(state.lozinka);
  }, [location.state]);

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");

    const u = korisnickoIme.trim();
    const p = lozinka;

    if (!authApi || typeof authApi.prijava !== "function") {
      console.error("[LOGIN] authApi.prijava nije prosleđen!");
      setGreska("Greška u aplikaciji: API za prijavu nije povezan.");
      return;
    }
    if (!u || !p) {
      setGreska("Unesite korisničko ime i lozinku.");
      return;
    }

    setLoading(true);
    try {
      console.log("[LOGIN] šaljem zahtev…", { u });
      const odgovor = await authApi.prijava(u, p);
      console.log("[LOGIN] odgovor:", odgovor);

      if (odgovor?.success && odgovor.data) {
        const token = odgovor.data as string;

        let claims: JwtTokenClaims | null = null;
        try {
          claims = jwtDecode<JwtTokenClaims>(token);
        } catch (err) {
          console.error("[LOGIN] jwtDecode greška:", err);
          setGreska("Neispravan token sa servera.");
          return;
        }

        if (!claims?.uloga) {
          setGreska("Nedostaje uloga u tokenu.");
          return;
        }

        login(token);
        navigate(`/${claims.uloga}-dashboard`, { replace: true });
      } else {
        setGreska(odgovor?.message || "Neispravni podaci");
        setKorisnickoIme("");
        setLozinka("");
      }
    } catch (err: any) {
      console.error("[LOGIN] greška:", err);
      setGreska(err?.response?.data?.message || err?.message || "Greška pri prijavi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Prijava</h1>
      <form onSubmit={podnesiFormu} noValidate>
        <div className="input-group">
          <input
            type="text"
            placeholder="Korisničko ime"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Lozinka"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {greska && <p className="error">{greska}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Prijavljivanje…" : "Prijavi se"}
        </button>
      </form>

      <p className="form-footer">
        Nemate nalog? <Link to="/register">Registruj se</Link>
      </p>
    </div>
  );
}

export default PrijavaForma;
