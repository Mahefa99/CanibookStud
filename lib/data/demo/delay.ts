/**
 * Tiny artificial delay for the in-memory demo catalog.
 *
 * It exists so loading skeletons can be reviewed locally. Keep it at 0 for
 * screenshot and accessibility runs; the value is not a product decision.
 */
const DEMO_DELAY_MS = Number(process.env.NEXT_PUBLIC_DEMO_DELAY_MS ?? "0");

export async function studySearchDelay(): Promise<void> {
  if (!Number.isFinite(DEMO_DELAY_MS) || DEMO_DELAY_MS <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, Math.min(DEMO_DELAY_MS, 800)));
}
