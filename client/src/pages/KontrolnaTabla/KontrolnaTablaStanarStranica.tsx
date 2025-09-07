import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";

import TabelaKvarova from "../../components/stanar/table/TabelaKvarova";

type Props = { faultApi: any };

export default function KontrolnaTablaStanarStranica({ faultApi }: Props) {
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
    <main className="page">
      <section className="dashboard">
        <header className="dashboard__header">
          <h1 className="dashboard__title">Stanar strana 🏡</h1>
          <p className="dashboard__subtitle">Pregled i prijava kvarova</p>
        </header>
        <TabelaKvarova api={faultApi} />
      </section>
    </main>
  );
}
