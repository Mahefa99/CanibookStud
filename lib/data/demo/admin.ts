/**
 * Fictional administration data. No real user, document, payment or report is
 * represented. Emails use example.com and no identity document is stored.
 */

export interface AdminVerification {
  id: string;
  subject: string;
  kind: "Stud" | "Professional" | "Club";
  submitted: string;
  status: "pending" | "requires_action" | "approved";
  note: string;
}

export const ADMIN_VERIFICATIONS: AdminVerification[] = [
  {
    id: "ver-201",
    subject: "Cedar — Golden Retriever",
    kind: "Stud",
    submitted: "2026-10-29",
    status: "pending",
    note: "Brucellosis test and OFA eye certificate uploaded; eye certificate is being checked.",
  },
  {
    id: "ver-202",
    subject: "Second Chance Rescue",
    kind: "Professional",
    submitted: "2026-10-30",
    status: "pending",
    note: "501(c)(3) document and business licence need a manual match.",
  },
  {
    id: "ver-203",
    subject: "Sunshine Frenchie Club",
    kind: "Club",
    submitted: "2026-10-28",
    status: "requires_action",
    note: "Domain and email checks are sample-only; a clearer logo file is needed.",
  },
  {
    id: "ver-204",
    subject: "Winston — English Bulldog",
    kind: "Stud",
    submitted: "2026-10-25",
    status: "requires_action",
    note: "One OFA certificate is unreadable. Owner was asked for a new copy.",
  },
  {
    id: "ver-205",
    subject: "Harborview Veterinary Clinic",
    kind: "Professional",
    submitted: "2026-10-20",
    status: "approved",
    note: "Documents reviewed under the sample checklist.",
  },
];

export interface AdminContentItem {
  id: string;
  title: string;
  type: "Stud listing" | "Litter" | "Club" | "Event";
  owner: string;
  status: "in_review" | "published" | "changes_requested";
  submitted: string;
  note: string;
}

export const ADMIN_CONTENT: AdminContentItem[] = [
  {
    id: "cnt-301",
    title: "Cedar & Stone Fall Litter",
    type: "Litter",
    owner: "Cedar & Stone Frenchies",
    status: "in_review",
    submitted: "2026-10-26",
    note: "Readiness date and individual puppy statuses need a final check.",
  },
  {
    id: "cnt-302",
    title: "Rocky Mountain Handling Workshop",
    type: "Event",
    owner: "Rocky Mountain Shepherd Club",
    status: "in_review",
    submitted: "2026-10-30",
    note: "Time zone and capacity are set; sponsor creative is empty.",
  },
  {
    id: "cnt-303",
    title: "The Grooming Room",
    type: "Club",
    owner: "The Grooming Room",
    status: "changes_requested",
    submitted: "2026-10-19",
    note: "Sample profile text is short; no service pricing is confirmed.",
  },
  {
    id: "cnt-304",
    title: "Marlo — Northshore",
    type: "Stud listing",
    owner: "Jordan Ellis",
    status: "published",
    submitted: "2026-02-11",
    note: "Premium listing. Documents reviewed separately.",
  },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  activities: string[];
  status: "active" | "review" | "restricted";
  joined: string;
}

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-401",
    name: "Jordan Ellis",
    email: "jordan.ellis@example.com",
    activities: ["Stud owner", "Dam owner", "Buyer"],
    status: "active",
    joined: "2025-11-18",
  },
  {
    id: "usr-402",
    name: "Morgan Lee",
    email: "morgan.lee@example.com",
    activities: ["Dam owner", "Buyer"],
    status: "active",
    joined: "2026-01-04",
  },
  {
    id: "usr-403",
    name: "Riley Chen",
    email: "riley.chen@example.com",
    activities: ["Professional"],
    status: "review",
    joined: "2026-09-12",
  },
  {
    id: "usr-404",
    name: "Avery Brooks",
    email: "avery.brooks@example.com",
    activities: ["Club manager"],
    status: "restricted",
    joined: "2026-07-22",
  },
];

export interface AdminReport {
  id: string;
  subject: string;
  reason: string;
  reportedBy: string;
  status: "open" | "reviewing" | "closed";
  date: string;
}

export const ADMIN_REPORTS: AdminReport[] = [
  {
    id: "rep-501",
    subject: "Sample litter listing",
    reason: "Puppies may be listed before the readiness window.",
    reportedBy: "Club manager · sample",
    status: "open",
    date: "2026-11-01",
  },
  {
    id: "rep-502",
    subject: "Sample stud profile",
    reason: "Description contains a health claim that is not documented.",
    reportedBy: "Dam owner · sample",
    status: "reviewing",
    date: "2026-10-30",
  },
  {
    id: "rep-503",
    subject: "Sample professional profile",
    reason: "Category appears to be incorrect.",
    reportedBy: "Visitor · sample",
    status: "closed",
    date: "2026-10-21",
  },
];

export interface AdminTransaction {
  id: string;
  kind: "Request" | "Litter" | "Ticket" | "Sponsor";
  reference: string;
  amountUsd: number;
  feeUsd: number;
  status: "awaiting_payment" | "paid" | "failed" | "refund_pending";
  date: string;
}

export const ADMIN_TRANSACTIONS: AdminTransaction[] = [
  { id: "txn-601", kind: "Request", reference: "REQ-DEMO-1042", amountUsd: 400, feeUsd: 80, status: "paid", date: "2026-10-29" },
  { id: "txn-602", kind: "Request", reference: "REQ-DEMO-1041", amountUsd: 400, feeUsd: 80, status: "awaiting_payment", date: "2026-10-28" },
  { id: "txn-603", kind: "Ticket", reference: "EVT-DEMO-201", amountUsd: 27, feeUsd: 2, status: "paid", date: "2026-10-27" },
  { id: "txn-604", kind: "Sponsor", reference: "SPN-DEMO-301", amountUsd: 400, feeUsd: 0, status: "refund_pending", date: "2026-10-22" },
  { id: "txn-605", kind: "Litter", reference: "LIT-DEMO-101", amountUsd: 3600, feeUsd: 600, status: "failed", date: "2026-10-20" },
];

export interface AdminSponsor {
  id: string;
  company: string;
  plan: string;
  status: "creative_review" | "pending_payment" | "active";
  period: string;
  metrics: "none" | "sample";
}

export const ADMIN_SPONSORS: AdminSponsor[] = [
  {
    id: "spn-701",
    company: "Sample sponsor (demo)",
    plan: "Premium event",
    status: "creative_review",
    period: "2026-12-12",
    metrics: "none",
  },
  {
    id: "spn-702",
    company: "Second sample sponsor",
    plan: "Site Official",
    status: "pending_payment",
    period: "2026-12",
    metrics: "none",
  },
];

export const ADMIN_COUNTS = {
  pendingVerification: ADMIN_VERIFICATIONS.filter((item) => item.status !== "approved").length,
  contentReview: ADMIN_CONTENT.filter((item) => item.status !== "published").length,
  openReports: ADMIN_REPORTS.filter((item) => item.status !== "closed").length,
  transactions: ADMIN_TRANSACTIONS.length,
};
