import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { IconName } from "@/components/ui/icon";
import type { DemoRequest } from "@/lib/types/domain";

type RequestStatus = DemoRequest["status"];

const STATUS: Record<
  RequestStatus,
  { label: string; tone: BadgeTone; icon: IconName; description: string }
> = {
  awaiting_payment: {
    label: "Awaiting payment",
    tone: "warning",
    icon: "clock",
    description: "The request exists but no payment has been confirmed. Contact details stay private.",
  },
  payment_pending: {
    label: "Payment pending",
    tone: "info",
    icon: "clock",
    description: "Payment is processing. The server has not confirmed it yet.",
  },
  payment_failed: {
    label: "Payment failed",
    tone: "danger",
    icon: "warning",
    description: "Payment did not succeed. Nothing is unlocked and the request can be retried.",
  },
  contact_unlocked: {
    label: "Contact unlocked",
    tone: "success",
    icon: "check",
    description: "The server confirmed payment. Contact details and messaging are available.",
  },
  declined: {
    label: "Declined",
    tone: "neutral",
    icon: "close",
    description: "The stud owner declined. Refund handling is still an open policy decision.",
  },
};

/** Status badge for request/reservation states. Text always carries the meaning. */
export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const config = STATUS[status];
  return (
    <Badge tone={config.tone} icon={config.icon} description={config.description}>
      {config.label}
    </Badge>
  );
}
