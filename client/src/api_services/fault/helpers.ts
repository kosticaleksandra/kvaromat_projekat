// client/src/api_services/helpers.ts
export const API_URL = "http://localhost:4000/api/v1";
export const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });
