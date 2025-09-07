import axios from "axios";
import type { FaultDto } from "../../models/fault/FaultDto";
import type { ApiEnvelope } from "../../types/ApiEnvelope";
import { API_URL, authHeader } from "../../api_services/fault/helpers";

export async function setReaction(
  token: string,
  id: number,
  userId: number,
  reaction: "like" | "dislike" | "love" | null
): Promise<ApiEnvelope<FaultDto>> {
  const res = await axios.put<ApiEnvelope<FaultDto>>(
    `${API_URL}/faults/${id}/reaction`,
    { userId, reaction },
    { headers: authHeader(token) }
  );
  return res.data;
}
