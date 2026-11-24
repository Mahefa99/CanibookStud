import type { Database } from "../../types/database";
export const activities = ["breeder", "buyer", "professional", "club", "sponsor", "transporter"] as const satisfies readonly Database["public"]["Enums"]["account_activity"][];
export type AuthState = { message: string };
