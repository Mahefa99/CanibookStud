// Schema contract for 001_initial_schema.sql. Regenerate after applying the migration.
type Activity = "breeder" | "buyer" | "professional" | "club" | "sponsor" | "transporter";
type Status = "pending" | "approved" | "rejected";
type Profile = { id: string; display_name: string; email: string | null; created_at: string };
type Membership = { profile_id: string; activity: Activity };
type Case = { id: string; profile_id: string; status: Status; face_match_score: number | null; created_at: string };
type ProfileReference<Name extends string> = [{
  foreignKeyName: Name; columns: ["profile_id"]; isOneToOne: false;
  referencedRelation: "profiles"; referencedColumns: ["id"];
}];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile; Insert: Pick<Profile,"id" | "display_name"> & Partial<Profile>;
        Update: Partial<Profile>; Relationships: [];
      };
      account_activities: {
        Row: Membership; Insert: Membership; Update: Partial<Membership>;
        Relationships: ProfileReference<"account_activities_profile_id_fkey">;
      };
      kyc_cases: {
        Row: Case; Insert: Pick<Case,"profile_id"> & Partial<Case>; Update: Partial<Case>;
        Relationships: ProfileReference<"kyc_cases_profile_id_fkey">;
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: { account_activity: Activity; kyc_status: Status };
    CompositeTypes: Record<never, never>;
  };
};
