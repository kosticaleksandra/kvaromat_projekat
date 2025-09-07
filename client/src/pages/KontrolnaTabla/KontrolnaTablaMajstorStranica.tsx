import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { KontrolnaTablaMajstorProp } from "../../types/props/fault/KontrolnaTablaMajstorStranica";
import TabelaKvarova from "../../components/majstor/table/TabelaKvarova";

export default function KontrolnaTablaMajstorStranica({ faultApi }: KontrolnaTablaMajstorProp) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const token = PročitajVrednostPoKljuču("authToken");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, logout, navigate, token]);

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-rose-900">
            Majstor strana <span className="align-super">👨🏻‍🔧</span>
          </h1>
          <p className="text-rose-700/80">Pregled i izmena statusa kvarova</p>
        </header>

        <section className="rounded-2xl bg-white/70 backdrop-blur shadow-xl ring-1 ring-rose-200/40 p-3 sm:p-4">
          <TabelaKvarova api={faultApi} token={token ?? undefined} />
        </section>
      </div>
    </main>
  );
}
