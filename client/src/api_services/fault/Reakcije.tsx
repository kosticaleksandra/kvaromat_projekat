import { useEffect, useState } from "react";
import type { Fault } from "../../models/fault/Fault";
import {
  getReactionSummary, 
  setReaction,        
  type Reaction,
} from "./reactions";

type Key = "like" | "dislike" | "love";
function isKey(r: Reaction): r is Key {
  return r === "like" || r === "dislike" || r === "love";
}

export default function Reakcije({
  fault,
  token,
  userId,                
}: {
  fault: Fault;
  token?: string;
  userId?: number;
}) {
  const [pending, setPending] = useState(false);
  const [myReaction, setMyReaction] = useState<Reaction>(null);
  const [counts, setCounts] = useState<Record<Key, number>>({
    like: 0,
    dislike: 0,
    love: 0,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getReactionSummary(token, fault.id, userId);
        if (!alive) return;
        setCounts(s.counts);
        setMyReaction(s.myReaction);
      } catch {
      }
    })();
    return () => {
      alive = false;
    };
  }, [fault.id, token, userId]);

  async function handle(kind: Key) {
    if (pending) return;
    setPending(true);

    const next: Reaction = myReaction === kind ? null : kind;

    const prevCounts = { ...counts };
    const prevMine = myReaction;

    const draft = { ...counts };
    if (isKey(prevMine)) draft[prevMine] = Math.max(0, draft[prevMine] - 1);
    if (isKey(next))     draft[next]     = draft[next] + 1;

    setCounts(draft);
    setMyReaction(next);

    try {
      const s = await setReaction(token, fault.id, userId, next);
      setCounts(s.counts);
      setMyReaction(s.myReaction);
    } catch {
      // rollback
      setCounts(prevCounts);
      setMyReaction(prevMine);
      alert("Greška pri čuvanju reakcije.");
    } finally {
      setPending(false);
    }
  }

  const btn = (active: boolean) => `reaction-btn ${active ? "is-active" : ""}`;

  return (
    <div className="reaction-bar">
      <button
        className={btn(myReaction === "like")}
        disabled={pending}
        onClick={() => handle("like")}
        title="sviđa mi se"
        aria-label="sviđa mi se"
      >
        👍 <span className="count">{counts.like}</span>
      </button>

      <button
        className={btn(myReaction === "dislike")}
        disabled={pending}
        onClick={() => handle("dislike")}
        title="ne sviđa mi se"
        aria-label="ne sviđa mi se"
      >
        👎 <span className="count">{counts.dislike}</span>
      </button>

      <button
        className={btn(myReaction === "love")}
        disabled={pending}
        onClick={() => handle("love")}
        title="bravo"
        aria-label="bravo"
      >
        👏🏻 <span className="count">{counts.love}</span>
      </button>
    </div>
  );
}
