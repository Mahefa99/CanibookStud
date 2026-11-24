// Schema contract for migrations 001 through 004. Regenerate after applying the migration.
type Activity = "breeder" | "buyer" | "professional" | "club" | "sponsor" | "transporter";
type Status = "pending" | "approved" | "rejected";
type Profile = { id: string; display_name: string; email: string | null; created_at: string };
type Membership = { profile_id: string; activity: Activity };
type Case = { evidence_deleted_at:string|null; reviewed_by:string|null; reviewed_at:string|null; review_note:string|null; id: string; profile_id: string; status: Status; face_match_score: number | null; created_at: string };
type ProfileReference<Name extends string, Column extends string = "profile_id"> = [{
  foreignKeyName: Name; columns: [Column]; isOneToOne: false;
  referencedRelation: "profiles"; referencedColumns: ["id"];
}];

type ListingStatus = "draft" | "published";
type LitterPlan = "free" | "premium";
type Stud = {
  id: string; owner_id: string; name: string; breed: string; akc_number: string | null;
  brucellosis_date: string | null; ofa_url: string | null; photos: string[];
  price: number; status: ListingStatus; lat: number; lng: number;
};
type Litter = {
  id: string; breeder_id: string; breed: string; birth_date: string; puppy_count: number;
  puppy_price: number; listing_type: LitterPlan; photos: string[]; status: ListingStatus; expires_at: string | null;
};

type ConnectedAccount = {
  breeder_id: string; stripe_account_id: string | null; created_at: string; onboarding_complete: boolean;
};
type Reservation = {
  release_started_at: string | null; release_destination: string | null;
  transfer_id: string | null; completed_at: string | null;
  id: string; stud_id: string | null; litter_id: string | null; puppy_number: number | null; buyer_id: string; breeder_id: string;
  deposit_cents: number; platform_fee_cents: number; currency: string;
  payment_intent_id: string | null; status: "pending" | "paid"; paid_at: string | null;
};
type Subscription = {id:string;breeder_id:string;plan:string;cadence:string;price_id:string;created_at:string;
  checkout_id:string|null;subscription_id:string|null;status:string;revision:number};
export type Database = {
  public: {
    Tables: {
      breeder_subscriptions:{Row:Subscription;Insert:Pick<Subscription,"breeder_id"|"plan"|"cadence"|"price_id">;Update:Partial<Subscription>;Relationships:[]};
      reservation_contracts: {
        Row: {id:string; buyer_id:string; breeder_id:string; issued_at:string; terms:string[]; pdf:string};
        Insert:never; Update:never; Relationships:[];
      };
      contract_signatures: {
        Row:{contract_id:string; signer_id:string; signed_at:string; signer_ip:string};
        Insert:never; Update:never; Relationships:[];
      };
      conversations: {
        Row: {id:string;stud_id:string|null;litter_id:string|null;buyer_id:string;breeder_id:string;created_at:string};
        Insert: never; Update: never; Relationships: [];
      };
      messages: {
        Row: {id:string;conversation_id:string;sender_id:string;content:string;created_at:string};
        Insert: {conversation_id:string;content:string}; Update: never; Relationships: [];
      };
      stripe_connect_accounts: {
        Row: ConnectedAccount; Insert: Pick<ConnectedAccount,"breeder_id"> & Partial<ConnectedAccount>;
        Update: Partial<ConnectedAccount>; Relationships: [];
      };
      reservations: {
        Row: Reservation;
        Insert: Pick<Reservation,"stud_id"|"buyer_id"|"breeder_id"|"deposit_cents"|"platform_fee_cents"> & Partial<Reservation>;
        Update: Partial<Reservation>; Relationships: [];
      };
      studs: {
        Row: Stud;
        Insert: Pick<Stud, "owner_id" | "name" | "breed" | "price" | "lat" | "lng"> & Partial<Stud>;
        Update: Partial<Stud>; Relationships: ProfileReference<"studs_owner_id_fkey", "owner_id">;
      };
      litters: {
        Row: Litter;
        Insert: Pick<Litter, "breeder_id" | "breed" | "birth_date" | "puppy_count" | "puppy_price"> & Partial<Litter>;
        Update: Partial<Litter>; Relationships: ProfileReference<"litters_breeder_id_fkey", "breeder_id">;
      };
      profiles: {
        Row: Profile; Insert: Pick<Profile,"id" | "display_name"> & Partial<Profile>;
        Update: Partial<Profile>; Relationships: [];
      };
      account_activities: {
        Row: Membership; Insert: Membership; Update: Partial<Membership>;
        Relationships: ProfileReference<"account_activities_profile_id_fkey">;
      };
      breeder_licenses:{
        Row:{id:string;breeder_id:string;license_number:string;content:string;status:string;submitted_at:string;reviewed_at:string|null;reviewed_by:string|null;review_note:string|null};
        Insert:never;Update:never;Relationships:[]};
      stud_documents:{
        Row:{id:string;stud_id:string;kind:string;reference:string|null;content:string;status:string;submitted_at:string;reviewed_at:string|null;reviewed_by:string|null};
        Insert:never;Update:never;Relationships:[]};
      kyc_evidence: {
        Row:{case_id:string;kind:"selfie"|"identity";content:string}; Insert:never; Update:never;
        Relationships:[{foreignKeyName:"kyc_evidence_case_id_fkey";columns:["case_id"];isOneToOne:false;referencedRelation:"kyc_cases";referencedColumns:["id"]}];
      };
      kyc_cases: {
        Row: Case; Insert: Pick<Case,"profile_id"> & Partial<Case>; Update: Partial<Case>;
        Relationships: ProfileReference<"kyc_cases_profile_id_fkey">;
      };
    };
    Views: Record<never, never>;
    Functions: {
      my_stud_quota:{Args:Record<never,never>;Returns:{plan_name:string;maximum:number|null;used:number}[]};
      submit_breeder_license:{Args:{number_text:string;document:string};Returns:undefined};
      review_breeder_license:{Args:{document_id:string;decision:string;note:string};Returns:boolean};
      submit_stud_document:{Args:{listing:string;category:string;image:string;provider:string};Returns:undefined};
      review_stud_document:{Args:{document:string;decision:string};Returns:boolean};
      stud_document_signals:{Args:{listing:string};Returns:{kind:string;status:string}[]};
      erase_reviewed_evidence:{Args:{target:string};Returns:boolean};
      submit_identity_evidence:{Args:{selfie:string;identity_image:string};Returns:string};
      is_platform_admin:{Args:Record<never,never>; Returns:boolean};
      review_kyc:{Args:{case_id:string; decision:Status; note:string}; Returns:boolean};
      sign_contract:{Args:{contract:string; signer:string; address:string};Returns:undefined};
      claim_release: {Args:{reservation:string;breeder:string}; Returns:undefined};
      claim_puppy: {Args:{listing:string;puppy:number;buyer:string;fee:number}; Returns:string};
      breeder_contact: {Args:{thread:string}; Returns:{email:string|null;phone:string|null}[]};
      confirm_stud_deposit: { Args: { reservation_id: string; intent_id: string; received: number; paid_currency: string }; Returns: undefined } };
    Enums: { account_activity: Activity; kyc_status: Status; listing_status: ListingStatus; litter_listing_type: LitterPlan };
    CompositeTypes: Record<never, never>;
  };
};




