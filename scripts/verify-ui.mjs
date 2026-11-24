import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Local UI verification: screenshots, functional checks and axe scans.
 *
 * Usage: node scripts/verify-ui.mjs
 * Requires a running production server (`npm run build && npm start`) and a
 * local Chrome install. Set CHROME_PATH if Chrome is not in the default place.
 */

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const CHROME_PATH =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("artifacts");

const results = { checks: [], axe: [], consoleErrors: [], pageErrors: [] };
let failures = 0;

function check(name, passed, detail = "") {
  results.checks.push({ name, passed, detail });
  if (!passed) {
    failures += 1;
    console.error(`FAIL  ${name}${detail ? ` - ${detail}` : ""}`);
  } else {
    console.log(`ok    ${name}`);
  }
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(350);
}

async function screenshot(page, name, options = {}) {
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    animations: "disabled",
    ...options,
  });
}

async function scan(page, name) {
  console.log(`SCAN  ${name}`);
  const analysis = await Promise.race([
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("axe timeout")), 20000)),
  ]);
  results.axe.push({
    page: name,
    violations: analysis.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  });
  check(`${name}: axe (0 violations)`, analysis.violations.length === 0, `${analysis.violations.length} violations`);
}

async function main() {
  console.log("START verification");
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });

  context.on("page", (page) => {
    page.on("console", (message) => {
      if (message.type() === "error") {
        results.consoleErrors.push({ text: message.text(), url: message.location().url });
      }
    });
    page.on("pageerror", (error) => results.pageErrors.push(error.message));
  });

  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on("console", (message) => {
    if (message.type() === "error") {
      results.consoleErrors.push({ text: message.text(), url: message.location().url });
    }
  });
  page.on("pageerror", (error) => results.pageErrors.push(error.message));

  // Home
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await settle(page);
  check("home: h1 present", (await page.locator("h1").first().innerText()).includes("Elite genetics"));
  check("home: appears in English", (await page.locator("html").getAttribute("lang")) === "en-US");
  check("home: no horizontal overflow", await noHorizontalOverflow(page));
  await screenshot(page, "home-desktop", { fullPage: true });
  await scan(page, "home");

  // Keyboard skip link
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent ?? "");
  check("home: first Tab reaches skip link", firstFocus.includes("Skip to main content"), firstFocus);

  // Directory
  await page.goto(`${BASE_URL}/studs`, { waitUntil: "domcontentloaded" });
  await settle(page);
  const cardCount = await page.locator("main article").count();
  check("studs: 6 cards on first page", cardCount === 6, String(cardCount));
  check("studs: total is announced", (await page.locator("main").innerText()).includes("10 profiles"));
  await screenshot(page, "studs-list-desktop", { fullPage: true });
  await scan(page, "studs-list");

  await page.goto(`${BASE_URL}/studs?breed=French%20Bulldog`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check(
    "studs: breed filter returns 4 profiles",
    (await page.locator("main").innerText()).includes("4 profiles"),
  );

  await page.goto(`${BASE_URL}/studs?page=2`, { waitUntil: "domcontentloaded" });
  await settle(page);
  const pageTwoCards = await page.locator("main article").count();
  check("studs: page 2 shows remaining 4 cards", pageTwoCards === 4, String(pageTwoCards));

  await page.goto(`${BASE_URL}/studs?view=map`, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.locator("main .leaflet-marker-icon").first().waitFor();
  const pins = await page.locator("main .leaflet-marker-icon:not([data-sponsor-pin])").count();
  check("map: 10 pins rendered", pins === 10, String(pins));
  await screenshot(page, "studs-map-desktop", { fullPage: true });
  await scan(page, "studs-map");

  // Profile
  await page.goto(`${BASE_URL}/studs/marlo-northshore`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check("profile: name heading", (await page.locator("h1").innerText()).trim() === "Marlo");
  check(
    "profile: request CTA present",
    (await page.getByRole("link", { name: /Start request/i }).count()) === 1,
  );
  check("profile: three separate signals", await page.getByText("Documents reviewed", { exact: true }).count() > 0);
  await screenshot(page, "stud-detail-desktop", { fullPage: true });
  await scan(page, "stud-detail");

  // Favorite flow
  await page.getByRole("button", { name: /Save Marlo to favorites/i }).click();
  check("favorites: heart becomes pressed", (await page.getByRole("button", { name: /Remove Marlo from favorites/i }).count()) === 1);

  await page.getByRole("link", { name: /Start request/i }).click();
  await page.waitForURL("**/studs/marlo-northshore/request");
  await settle(page);
  check("request: route", page.url().endsWith("/request"));
  const payButton = page.getByRole("button", { name: /Pay \$400/i });
  await payButton.waitFor({ state: "visible" });
  check("request: payment is disabled", (await payButton.count()) === 1 && (await payButton.isDisabled()));
  await screenshot(page, "request-desktop", { fullPage: true });
  await scan(page, "request");

  await page.getByRole("button", { name: /Review request/i }).click();
  await page.waitForTimeout(200);
  check(
    "request: consent validation",
    (await page.getByText("Please check the highlighted fields").count()) === 1,
  );
  await page.locator("#shareConsent").check();
  await page.locator("#feeConsent").check();
  await page.waitForTimeout(150);
  await page.getByRole("button", { name: /Review request/i }).click();
  await page.waitForTimeout(250);
  const requestDraftText = await page.locator("main").innerText();
  check("request: draft is clearly not submitted", /not submitted/i.test(requestDraftText));

  // Paused profile state
  await page.goto(`${BASE_URL}/studs/romeo-sunshine`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check("paused profile: CTA blocked", (await page.getByRole("button", { name: /Requests paused/i }).count()) === 1);
  await page.goto(`${BASE_URL}/studs/romeo-sunshine/request`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check(
    "paused profile: request page explains the block",
    (await page.locator("main").innerText()).includes("Requests are paused for this profile"),
  );

  // Dashboard
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check("dashboard: greeting", (await page.locator("h1").first().innerText()).includes("Good day"));
  await screenshot(page, "dashboard-desktop", { fullPage: true });
  await scan(page, "dashboard");

  await page.goto(`${BASE_URL}/dashboard/favorites`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check(
    "favorites: saved stud appears in dashboard",
    (await page.locator("main").innerText()).includes("Marlo"),
  );

  await page.goto(`${BASE_URL}/dashboard/animals/new/stud`, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.getByRole("button", { name: /^Continue/i }).click();
  await page.waitForTimeout(150);
  check("form: validation summary shown", (await page.getByText("Please check the highlighted fields").count()) === 1);
  const errorLink = await page.locator('a[href="#name"]').count();
  check("form: error summary links to field", errorLink === 1);
  await screenshot(page, "form-errors-desktop", { fullPage: true });
  await scan(page, "form-errors");

  // Complete the stud form end-to-end (no file needed).
  console.log("STEP form fill identity");
  await page.locator("#name").fill("Juniper");
  await page.locator("#breed").selectOption("French Bulldog");
  await page.locator("#birthDate").fill("2023-05-10");
  await page.locator("#weight").fill("26");
  await page.locator("#color").fill("Fawn");
  await page.locator("#city").fill("Austin");
  await page.locator("#stateCode").selectOption("TX");
  await page.getByRole("button", { name: /^Continue/i }).click();
  await page.waitForTimeout(200);
  check("form: step 2 reached", (await page.locator("h2#registration-step-heading").innerText()).includes("Records"));
  check("form: draft was saved", (await page.getByText("Draft saved locally").count()) > 0);
  console.log("STEP form reload");
  await page.reload({ waitUntil: "domcontentloaded" });
  await settle(page);
  check("form: local draft restored", (await page.getByText("Local draft restored").count()) === 1);
  console.log("STEP form fill records");
  await page.locator("#akcNumber").fill("DN12345678");
  await page.locator("#brucellosisDate").fill("2026-10-28");
  await page.getByRole("button", { name: /^Continue/i }).click();
  await page.waitForTimeout(200);
  console.log("STEP form fill story");
  await page.locator("#description").fill(
    "Juniper is a calm, social French Bulldog who travels well and has completed two prior arrangements. Records are kept current.",
  );
  await page.getByRole("button", { name: /^Continue/i }).click();
  await page.waitForTimeout(200);
  check("form: review step reached", (await page.locator("h2#registration-step-heading").innerText()).includes("Plan & review"));
  console.log("STEP form review");
  await page.locator("#shareConsent").check();
  await page.locator("#termsConsent").check();
  await page.waitForTimeout(200);
  await screenshot(page, "form-review-desktop", { fullPage: true });
  await page.getByRole("button", { name: /Submit for review/i }).click();
  await page.waitForTimeout(250);
  const successText = await page.locator("main").innerText();
  check("form: demo submission state", /nothing was sent/i.test(successText));
  await screenshot(page, "form-success-desktop", { fullPage: true });
  await scan(page, "form-success");

  // Authentication previews and the disclosure page.
  for (const [path, heading] of [
    ["/login", "Log in to your workspace"],
    ["/signup", "Start with your activities"],
    ["/demo", "What is real in this preview"],
  ]) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
    await settle(page);
    check(`${path}: heading`, (await page.locator("h1").first().innerText()).includes(heading));
    await scan(page, path);
  }

  await page.goto(`${BASE_URL}/this-page-does-not-exist`, { waitUntil: "domcontentloaded" });
  await settle(page);
  check("404: recovery heading", (await page.locator("h1").first().innerText()).includes("This trail ends here"));

  // Mobile
  console.log("STEP mobile");
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await settle(mobilePage);
  check("mobile home: no horizontal overflow", await noHorizontalOverflow(mobilePage));
  await screenshot(mobilePage, "home-mobile", { fullPage: true });
  await mobilePage.getByRole("button", { name: /Open menu/i }).click();
  await mobilePage.waitForTimeout(150);
  check("mobile: menu expands", (await mobilePage.getByRole("button", { name: /Close menu/i }).getAttribute("aria-expanded")) === "true");
  await screenshot(mobilePage, "menu-mobile", { fullPage: false });
  await mobilePage.getByRole("link", { name: "Studs", exact: true }).click();
  await settle(mobilePage);
  check("mobile: navigation to studs", mobilePage.url().includes("/studs"));
  check("mobile studs: no horizontal overflow", await noHorizontalOverflow(mobilePage));
  await screenshot(mobilePage, "studs-mobile", { fullPage: true });

  await mobilePage.goto(`${BASE_URL}/studs/marlo-northshore`, { waitUntil: "domcontentloaded" });
  await settle(mobilePage);
  check("mobile profile: no horizontal overflow", await noHorizontalOverflow(mobilePage));
  await screenshot(mobilePage, "stud-detail-mobile", { fullPage: true });

  await mobilePage.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
  await settle(mobilePage);
  check("mobile dashboard: no horizontal overflow", await noHorizontalOverflow(mobilePage));
  await screenshot(mobilePage, "dashboard-mobile", { fullPage: true });

  await browser.close();

  // The intentional 404 navigation logs a browser resource error for the
  // document itself. Any other console error is a failure.
  const unexpectedConsoleErrors = results.consoleErrors.filter(
    (error) => !error.url.includes("/this-page-does-not-exist"),
  );
  check(
    "console: no unexpected errors",
    unexpectedConsoleErrors.length === 0,
    JSON.stringify(unexpectedConsoleErrors),
  );

  results.summary = {
    failures,
    checks: results.checks.length,
    axeViolations: results.axe.reduce((sum, entry) => sum + entry.violations.length, 0),
    consoleErrors: results.consoleErrors,
    pageErrors: results.pageErrors,
  };
  await fs.writeFile(path.join(OUT_DIR, "verification.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.summary, null, 2));
  if (failures > 0) process.exitCode = 1;
}

async function noHorizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth <= window.innerWidth + 1;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

