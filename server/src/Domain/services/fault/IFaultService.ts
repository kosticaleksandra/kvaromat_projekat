import type { FaultStatus } from "../../types/FaultStatus";
import type { FaultDto } from "../../DTOs/fault/FaultDto";
import type { Fault } from "../../models/Fault";

export type ReactionKind = "like" | "dislike" | "love" | null;
export type ReactionSummary = {
  counts: { like: number; dislike: number; love: number };
  myReaction: ReactionKind;
};

export interface IFaultService {
  createFault(fault: Fault): Promise<FaultDto>;
  getFaultById(id: number): Promise<FaultDto>;
  getAllFaults(): Promise<FaultDto[]>;
  getFaultsByUser(userId: number): Promise<FaultDto[]>;
  getFaultsByStatus(status: FaultStatus): Promise<FaultDto[]>;
  updateFault(fault: Fault): Promise<FaultDto>;
  updateFaultStatus(faultId: number, status: FaultStatus): Promise<FaultDto>;
  resolveFault(faultId: number, status: FaultStatus, comment: string, price: number): Promise<FaultDto>;

  setReaction(
    faultId: number,
    userId: number,
    reaction: ReactionKind
  ): Promise<ReactionSummary>;

  getReactionSummary(
    faultId: number,
    userId?: number
  ): Promise<ReactionSummary>;
}
