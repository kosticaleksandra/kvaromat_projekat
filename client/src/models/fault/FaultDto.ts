export type FaultReaction = "like" | "dislike" | "love" | null;

export interface FaultDto {
  id: number;
  userId: number;
  name: string;
  description: string;
  imageUrl?: string;
  status: "Kreiran" | "Popravka u toku" | "Saniran" | "Problem nije rešen";
  createdAt: string | Date;
  comment?: string | null;
  price?: number | null;
  reaction?: FaultReaction;
}
