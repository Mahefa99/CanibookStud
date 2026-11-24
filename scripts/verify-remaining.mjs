import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Verification for the transaction states, legal pages, auth previews, admin
 * gate and editorial pages.
 */

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const CHROME_PATH =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = path.resolve("artifacts/remaining");

const results = { checks: [], axe: [], consoleErrors: [], pageErrors: [] };
let failures = 0;

function check(name, passed, detail = "") {
  results.checks.push({ name, passed, detail });
  if (passed) console.log(`ok    ${name}`);
  else {
    failures += 1;
    console.error(`FAIL  ${name} ${detail}`);
  }
}

async function shot(page, name, fullPage = true) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage, animations: "disabled" });
}

async function scan(page, name) {
  const analysis = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  results.axe.push({
    page: name,
    violations: analysis.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({ target: n.target, html: n.html, summary: n.failureSummary })),
    })),
  });
  check(`${name}: axe`, analysis.violations.length === 0, `${analysis.violations.length} violations`);
}

async function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on("console", (message) => {
    if (message.type() === "error") results.consoleErrors.push({ text: message.text(), url: message.location().url });
  });
  page.on("pageerror", (error) => results.pageErrors.push(error.message));

  // Admin gate
  await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  check("admin: locked by default", (await page.locator("h1").first().innerText()).includes("restricted"));
  check("admin: data not rendered before unlock", !(await page.locator("body").innerText()).includes("Verification queue"));
  await shot(page, "admin-locked");
  await scan(page, "admin-locked");

  await page.getByRole("button", { name: /Enter demo administration/i }).click();
  await page.waitForTimeout(700);
  check("admin: demo gate opens", (await page.locator("h1").first().innerText()).includes("Administration overview"));
  await shot(page, "admin-overview");
  await scan(page, "admin-overview");

  for (const [route, heading] of [
    ["/admin/verifications", "Verification queue"],
    ["/admin/content", "Content review"],
    ["/admin/users", "Users"],
    ["/admin/reports", "Reports"],
    ["/admin/transactions", "Transactions"],
    ["/admin/sponsors", "Sponsors"],
    ["/admin/events", "Events"],
  ]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(200);
    check(`${route}: heading`, (await page.locator("h1").first().innerText()).includes(heading));
  }
  await page.goto(`${BASE}/admin/verifications`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await shot(page, "admin-verifications");
  await scan(page, "admin-verifications");

  // Checkout and contract states
  await page.goto(`${BASE}/checkout`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("checkout: state hub", (await page.locator("main").innerText()).includes("Payment is possible") === false);
  check("checkout: 5 state cards", (await page.locator("main a").count()) >= 5);
  await shot(page, "checkout");

  for (const [state, heading] of [
    ["pending", "Payment pending"],
    ["failed", "Payment failed"],
    ["confirmed", "Confirmed state"],
  ]) {
    await page.goto(`${BASE}/checkout/${state}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(200);
    check(`checkout ${state}: heading`, (await page.locator("h1").first().innerText()).includes(heading));
  }
  const confirmedText = await page.locator("main").innerText();
  check("checkout confirmed: no real unlock claim", confirmedText.includes("No payment was made"));
  await shot(page, "checkout-confirmed");
  await scan(page, "checkout-confirmed");

  await page.goto(`${BASE}/access-denied`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("access denied: heading", (await page.locator("h1").first().innerText()).includes("not available"));

  await page.goto(`${BASE}/contracts/CB-2026-1042`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("contract: draft state", (await page.locator("main").innerText()).includes("Draft"));
  check("contract: signature disabled", (await page.locator("main").innerText()).includes("Not signed"));
  await shot(page, "contract");
  await scan(page, "contract");

  // Legal pages
  for (const [route, heading] of [
    ["/legal/terms", "Terms of use"],
    ["/legal/privacy", "Privacy notice"],
    ["/legal/no-delivery", "No-delivery policy"],
  ]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(200);
    check(`${route}: heading`, (await page.locator("h1").first().innerText()).includes(heading));
  }
  await shot(page, "legal-terms");
  await scan(page, "legal-terms");

  // Auth previews
  await page.goto(`${BASE}/verify-email`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("verify email: pending state", (await page.locator("main").innerText()).includes("Verification pending"));
  await scan(page, "verify-email");

  await page.goto(`${BASE}/forgot-password`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: /Request a reset link/i }).click();
  await page.waitForTimeout(150);
  check("forgot password: validation", (await page.getByText("Enter a valid email address.").count()) === 1);
  await page.locator("#reset-email").fill("sample@example.com");
  await page.getByRole("button", { name: /Request a reset link/i }).click();
  await page.waitForTimeout(150);
  check("forgot password: neutral response", (await page.locator("main").innerText()).includes("does not confirm that an account exists"));
  await shot(page, "forgot-password");
  await scan(page, "forgot-password");

  // Editorial
  await page.goto(`${BASE}/breeds`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("breeds: six samples", (await page.locator("main a[href^='/breeds/']").count()) >= 6);
  await shot(page, "breeds");
  await scan(page, "breeds");

  // Activity-specific dashboard previews (hidden from the demo account's nav).
  for (const [route, heading] of [
    ["/dashboard/business", "My business"],
    ["/dashboard/club", "Club workspace"],
    ["/dashboard/events", "Events workspace"],
    ["/dashboard/sponsorships", "Sponsorships"],
  ]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(200);
    check(`${route}: heading`, (await page.locator("h1").first().innerText()).includes(heading));
  }
  await page.goto(`${BASE}/dashboard/business`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await shot(page, "dashboard-business");
  await scan(page, "dashboard-business");

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("footer: no mojibake", !(await page.locator("footer").innerText()).includes("Â"));

  await page.goto(`${BASE}/breeds/french-bulldog`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("breed detail: editorial disclaimer", (await page.locator("main").innerText()).includes("not an AKC breed standard"));
  await shot(page, "breed-detail");
  await scan(page, "breed-detail");

  await page.goto(`${BASE}/articles`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("articles: three samples", (await page.locator("main article").count()) === 3);
  await scan(page, "articles");

  await page.goto(`${BASE}/articles/reading-a-test-date`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("article detail: content", (await page.locator("main").innerText()).includes("A test date is a fact"));

  // Mobile pass
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const mp = await mobile.newPage();
  mp.setDefaultTimeout(10000);
  for (const [route, name] of [
    ["/checkout", "checkout-mobile"],
    ["/legal/terms", "legal-mobile"],
    ["/breeds", "breeds-mobile"],
    ["/articles", "articles-mobile"],
  ]) {
    await mp.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await mp.waitForTimeout(200);
    check(`${route}: mobile no overflow`, await noOverflow(mp));
    await shot(mp, name);
  }

  await browser.close();
  results.summary = {
    failures,
    checks: results.checks.length,
    axeViolations: results.axe.reduce((sum, entry) => sum + entry.violations.length, 0),
    consoleErrors: results.consoleErrors,
    pageErrors: results.pageErrors,
  };
  await fs.writeFile(path.join(OUT, "verification.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.summary, null, 2));
  if (failures > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
