import type { Fault } from "../../models/Fault";
import type { FaultDto } from "../../DTOs/fault/FaultDto";
import type { FaultStatus } from "../../types/FaultStatus";

export interface IFaultRepository {
  create(fault: Fault): Promise<FaultDto>;
  getById(id: number): Promise<FaultDto>;
  getAllFaultsWithComments(): Promise<FaultDto[]>;
  getFaultsByUser(userId: number): Promise<FaultDto[]>;
  getByStatus(status: FaultStatus): Promise<FaultDto[]>;
  update(fault: Fault): Promise<FaultDto>;
  updateFaultStatus(faultId: number, status: FaultStatus): Promise<FaultDto>;
  resolveFault(
    faultId: number,
    status: FaultStatus,
    comment: string,
    price: number
  ): Promise<FaultDto>;

  setReaction(
    faultId: number,
    userId: number,
    reaction: "like" | "dislike" | "love"
  ): Promise<void>;

  deleteReaction(faultId: number, userId: number): Promise<void>;

  getReactionCounts(
    faultId: number
  ): Promise<{ like: number; dislike: number; love: number }>;

  getUserReaction(
    faultId: number,
    userId: number
  ): Promise<"like" | "dislike" | "love" | null>;
}
