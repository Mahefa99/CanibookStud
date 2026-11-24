import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { IconName } from "@/components/ui/icon";
import { STUD_PLANS } from "@/lib/config/pricing";
import type {
  AkcRecord,
  BrucellosisRecord,
  ClubRecommendation,
  RecordReviewStatus,
  StudPlan,
  SubscriptionStatus,
} from "@/lib/types/domain";
import { daysSince } from "@/lib/utils";

/**
 * Signal badges are deliberately separate components with different icons and
 * colours. Subscription, document review and club recommendation are three
 * different notions and must never be collapsed into one "verified" badge.
 */

interface PlanBadgeProps {
  plan: StudPlan;
  status: SubscriptionStatus;
}

export function PlanBadge({ plan, status }: PlanBadgeProps) {
  if (status === "past_due") {
    return (
      <Badge
        tone="warning"
        icon="warning"
        description="The paid listing is past due. Billing status is not a verification signal."
      >
        Subscription past due
      </Badge>
    );
  }

  if (plan === "founder_trial") {
    return (
      <Badge tone="neutral" icon="sparkle" description="Founder terms are not confirmed.">
        Founder trial
      </Badge>
    );
  }

  const config = STUD_PLANS.find((entry) => entry.id === plan);
  return (
    <Badge
      tone={plan === "premium" ? "navy" : "neutral"}
      icon={plan === "premium" ? "star" : "paw"}
      description={`${config?.name ?? plan} plan. Paid visibility, not a verification or an endorsement.`}
    >
      {config?.name ?? plan} listing
    </Badge>
  );
}

interface AkcBadgeProps {
  akc: AkcRecord;
}

export function AkcBadge({ akc }: AkcBadgeProps) {
  if (akc.formatStatus === "format_checked") {
    return (
      <Badge
        tone="info"
        icon="file"
        description="The registration number's format was checked. This is not an AKC registration confirmation."
      >
        AKC format checked
      </Badge>
    );
  }
  if (akc.formatStatus === "invalid") {
    return (
      <Badge tone="danger" icon="warning" description="The registration number did not match the expected format.">
        AKC number invalid
      </Badge>
    );
  }
  return (
    <Badge tone="neutral" icon="file" description="The registration number has not been checked.">
      AKC number unchecked
    </Badge>
  );
}

interface BrucellosisBadgeProps {
  record: BrucellosisRecord;
  referenceDate: string;
}

export function BrucellosisBadge({ record, referenceDate }: BrucellosisBadgeProps) {
  if (record.status === "missing" || !record.testDate) {
    return (
      <Badge
        tone="warning"
        icon="warning"
        description="No test is on file. Requests should be paused until the record is added."
      >
        No brucellosis test on file
      </Badge>
    );
  }

  const age = daysSince(record.testDate, referenceDate);

  if (record.status === "expired") {
    return (
      <Badge
        tone="warning"
        icon="clock"
        description="The test is older than the 14-day listing window. A new test is required before a request is accepted."
      >
        Brucellosis test {age} days old
      </Badge>
    );
  }

  return (
    <Badge
      tone="success"
      icon="shield"
      description="A test date is on file within the listing's 14-day freshness window. This is a listing requirement, not a legal determination."
    >
      Brucellosis test · {age} days
    </Badge>
  );
}

interface DocumentationBadgeProps {
  status: RecordReviewStatus;
}

const DOCUMENTATION: Record<
  RecordReviewStatus,
  { label: string; tone: BadgeTone; icon: IconName; description: string }
> = {
  approved: {
    label: "Documents reviewed",
    tone: "info",
    icon: "file",
    description: "Uploaded documents were reviewed under the platform's current checklist.",
  },
  in_review: {
    label: "Documents in review",
    tone: "warning",
    icon: "clock",
    description: "Uploaded documents are waiting for a manual review.",
  },
  changes_requested: {
    label: "Documents need attention",
    tone: "warning",
    icon: "warning",
    description: "A document is missing, expired or unreadable. The owner was asked to update it.",
  },
  not_submitted: {
    label: "Documents not submitted",
    tone: "neutral",
    icon: "file",
    description: "No documents have been submitted yet.",
  },
  expired: {
    label: "Documents expired",
    tone: "danger",
    icon: "warning",
    description: "A document is past its validity window.",
  },
};

export function DocumentationBadge({ status }: DocumentationBadgeProps) {
  const config = DOCUMENTATION[status];
  return (
    <Badge tone={config.tone} icon={config.icon} description={config.description}>
      {config.label}
    </Badge>
  );
}

interface ClubRecommendationBadgeProps {
  recommendation: ClubRecommendation;
}

export function ClubRecommendationBadge({ recommendation }: ClubRecommendationBadgeProps) {
  return (
    <Badge
      tone="accent"
      icon="award"
      description="A recommendation from a listed club. It is not a subscription and not a verification."
    >
      Recommended by {recommendation.clubName}
    </Badge>
  );
}

/** Short legend used wherever the badges first appear. */
export function SignalLegend() {
  return (
    <div className="grid gap-3 text-xs text-muted sm:grid-cols-3">
      <div className="rounded-xl border border-line bg-cream-50 p-3">
        <p className="font-semibold text-ink">Subscription</p>
        <p className="mt-1 leading-relaxed">Paid visibility. It never means verified.</p>
      </div>
      <div className="rounded-xl border border-line bg-cream-50 p-3">
        <p className="font-semibold text-ink">Document review</p>
        <p className="mt-1 leading-relaxed">What was uploaded and checked, and when.</p>
      </div>
      <div className="rounded-xl border border-line bg-cream-50 p-3">
        <p className="font-semibold text-ink">Club recommendation</p>
        <p className="mt-1 leading-relaxed">A club&apos;s opinion, separate from both.</p>
      </div>
    </div>
  );
}
