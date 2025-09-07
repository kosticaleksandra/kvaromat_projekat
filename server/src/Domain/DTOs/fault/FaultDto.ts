import type { FaultStatus } from "../../types/FaultStatus";

export type FaultReaction = "like" | "dislike" | "love";

export class FaultDto {
  public constructor(
    public id: number = 0,
    public userId: number = 0,
    public name: string = "",
    public description: string = "",
    public imageUrl?: string,
    public status: FaultStatus = "Kreiran",
    public createdAt: Date | string = new Date(),
    public comment?: string | null,
    public price?: number | null,
    public reaction: FaultReaction | null = null
  ) {}
}
