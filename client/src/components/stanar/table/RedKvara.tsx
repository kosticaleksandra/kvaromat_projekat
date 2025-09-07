import type { Fault } from "../../../models/fault/Fault";
import type { FaultStatus } from "../../../models/fault/FaultStatus";
import type { IFaultService } from "../../../api_services/fault/IFaultService";
import Reakcije from "../../../api_services/fault/Reakcije"; 
import { useAuth } from "../../../hooks/auth/useAuthHook";

interface Props {
  kvar: Fault;
  faultService: IFaultService;   
  onUpdated?: () => void | Promise<void>;
}

const STATUS_CLASS: Record<FaultStatus, string> = {
  Kreiran: "kreiran",
  "Popravka u toku": "u-toku",
  Saniran: "saniran",
  "Problem nije rešen": "problem",
};

function formatDate(v?: string | Date) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : v;
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("sr-RS");
}

function formatPrice(v?: number | null) {
  if (typeof v !== "number") return "—";
  return Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function RedUTabeliKvara({ kvar /*, faultService, onUpdated*/ }: Props) {
  const { token: authToken, user } = useAuth();
  const token = authToken ?? undefined; 
  const userId =
    (user as any)?.id ??
    ((): number | undefined => {
      const raw = localStorage.getItem("userId");
      const n = raw ? Number(raw) : NaN;
      return Number.isFinite(n) && n > 0 ? n : undefined;
    })();

  const badgeCls = `badge badge--${STATUS_CLASS[kvar.status as FaultStatus]}`;
  const hasComment = Boolean(kvar.comment);
  const canReact = Boolean(token && userId && hasComment);

  return (
    <tr>
      <td>{kvar.name}</td>

      <td className="col-desc">{kvar.description}</td>

      <td>
        <span className={badgeCls}>{kvar.status}</span>
      </td>

      <td className="col-img">
        <img
          src={`/images/${kvar.imageUrl || "default.jpg"}`}
          alt=""
          width={40}
          height={40}
          style={{ objectFit: "cover", borderRadius: 6, display: "block" }}
        />
      </td>

      <td>{formatDate(kvar.createdAt)}</td>

      <td>{formatPrice(kvar.price)}</td>

      <td className="col-desc">{kvar.comment ?? "—"}</td>

      <td className="col-reaction">
        {canReact ? (
          <Reakcije fault={kvar} token={token} userId={userId} />
        ) : (
          <span className="muted">—</span>
        )}
      </td>
    </tr>
  );
}
