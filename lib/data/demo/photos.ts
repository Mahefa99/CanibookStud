import type { DemoPhoto } from "@/lib/types/domain";
import { hashString } from "@/lib/utils";

const tones: DemoPhoto["tone"][] = ["navy", "clay", "sage", "sand"];

/** Deterministic illustrative photo set for demo entities. */
export function demoPhotos(
  slug: string,
  variant: DemoPhoto["variant"],
  count: number,
  subject: string,
): DemoPhoto[] {
  const offset = hashString(slug) % tones.length;
  return Array.from({ length: count }, (_, index) => ({
    id: `${slug}-photo-${index + 1}`,
    tone: tones[(index + offset) % tones.length] ?? "navy",
    variant,
    alt: `Illustrative image ${index + 1} for ${subject}. Sample image, not a real photograph.`,
  }));
}
