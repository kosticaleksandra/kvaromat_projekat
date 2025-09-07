export type Reaction = "like" | "dislike" | "love" | null;

type Summary = {
  counts: { like: number; dislike: number; love: number };
  myReaction: Reaction;
};

const BASE = "/api/v1/faults";

export async function getReactionSummary(
  token: string | undefined,
  id: number,
  userId?: number
): Promise<Summary> {
  const q = userId ? `?userId=${userId}` : "";
  const r = await fetch(`${BASE}/${id}/reactions${q}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.message ?? "Greška pri čitanju reakcija.");
  return j.data as Summary;
}

export async function setReaction(
  token: string | undefined,
  id: number,
  userId: number | undefined,
  reaction: Reaction
): Promise<Summary> {
  const r = await fetch(`${BASE}/${id}/reaction`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ userId, reaction }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.message ?? "Greška pri postavljanju reakcije.");
  return j.data as Summary;
}
