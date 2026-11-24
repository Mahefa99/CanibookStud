import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Focused verification for the marketplace sections added after the stud
 * slice. Screenshots and axe results are written under artifacts/marketplace.
 */

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const CHROME_PATH =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = path.resolve("artifacts/marketplace");

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

  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  check("home: new nav links", await page.getByRole("navigation", { name: "Primary" }).getByText("Puppies", { exact: true }).count() === 1);
  check("home: litters section", await page.getByText("Puppies, one by one").count() === 1);
  await shot(page, "home");
  await scan(page, "home");

  await page.goto(`${BASE}/puppies`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("puppies: four sample litters", (await page.locator("main article").count()) === 4);
  check("puppies: no $600 debit wording", !(await page.locator("main").innerText()).includes("Pay $600"));
  await shot(page, "puppies");
  await scan(page, "puppies");

  await page.goto(`${BASE}/puppies?breed=Labrador%20Retriever`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("puppies: breed filter", (await page.locator("main article").count()) === 1);

  await page.goto(`${BASE}/puppies/cedar-stone-fall-litter`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("puppy detail: individual puppy", (await page.locator("main").innerText()).includes("Poppy"));
  check("puppy detail: total 3,600", (await page.locator("main").innerText()).includes("$3,600"));
  await shot(page, "puppy-detail");
  await scan(page, "puppy-detail");

  await page.goto(`${BASE}/puppies/cedar-stone-fall-litter/reserve?puppy=poppy`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const reserveText = await page.locator("main").innerText();
  check("reservation: disabled payment", reserveText.includes("Pay $3,600 — unavailable"));
  check("reservation: does not create a request", reserveText.includes("does not create a reservation"));
  await shot(page, "puppy-reserve");
  await scan(page, "puppy-reserve");

  await page.goto(`${BASE}/pet-services`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("services: eight businesses", (await page.locator("main article").count()) === 8);
  check("services: V12 plans disclosed", (await page.locator("main").innerText()).includes("V12 plans / demo"));
  await shot(page, "services");
  await scan(page, "services");

  await page.goto(`${BASE}/pet-services?category=vet`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("services: category filter", (await page.locator("main article").count()) === 2);

  await page.goto(`${BASE}/pet-services?view=map`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await page.locator("main .leaflet-marker-icon").first().waitFor();
  const proPins = await page.locator("main .leaflet-marker-icon").count();
  check("services: 8 map pins", proPins === 8, String(proPins));
  await shot(page, "services-map");
  await scan(page, "services-map");

  await page.goto(`${BASE}/pet-services/blue-ridge-emergency-veterinary`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const proText = await page.locator("main").innerText();
  check("service detail: emergency declared", proText.includes("Accepts emergencies"));
  check("service detail: no 24/7 promise", !proText.includes("Open 24/7"));
  check("service detail: no phone", !proText.includes("+1 "));
  await shot(page, "service-detail");
  await scan(page, "service-detail");

  await page.goto(`${BASE}/clubs`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("clubs: three sample clubs", (await page.locator("main article").count()) === 3);
  await shot(page, "clubs");
  await scan(page, "clubs");

  await page.goto(`${BASE}/clubs/lone-star-french-bulldog-club`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("club detail: recommendation", (await page.locator("main").innerText()).includes("Recommended studs"));
  await shot(page, "club-detail");
  await scan(page, "club-detail");

  await page.goto(`${BASE}/events`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("events: three sample events", (await page.locator("main article").count()) === 3);
  await shot(page, "events");
  await scan(page, "events");

  await page.goto(`${BASE}/events/frenchie-meetup-austin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const eventText = await page.locator("main").innerText();
  check("event detail: $27 total", eventText.includes("$27"));
  check("event detail: ticket disabled", eventText.includes("Buy ticket — unavailable"));
  check("event detail: ticket states", eventText.includes("Already used"));
  await shot(page, "event-detail");
  await scan(page, "event-detail");

  await page.goto(`${BASE}/compare/insurance`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("compare: five rows", (await page.locator("main tbody tr").count()) === 5);
  check("compare: affiliate labelled", (await page.locator("main").innerText()).includes("Affiliate link · sample"));
  await shot(page, "compare-insurance");
  await scan(page, "compare-insurance");

  await page.goto(`${BASE}/compare/insurance?filter=Accident%20only`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check("compare: filter", (await page.locator("main tbody tr").count()) === 1);

  await page.goto(`${BASE}/compare/dog-food`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await shot(page, "compare-dog-food");
  await scan(page, "compare-dog-food");

  await page.goto(`${BASE}/sponsors`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const sponsorsText = await page.locator("main").innerText();
  check("sponsors: sample inventory", sponsorsText.includes("Inventory preview"));
  check("sponsors: no campaign metrics claimed", !/impressions|clicks/i.test(sponsorsText));
  await shot(page, "sponsors");
  await scan(page, "sponsors");

  // Forbidden ad pages must not contain a sponsor slot.
  for (const path of ["/studs/marlo-northshore", "/puppies/cedar-stone-fall-litter"]) {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
    await page.waitForTimeout(150);
    const text = await page.locator("body").innerText();
    check(`ads: none on ${path}`, !text.includes("Sponsored placement"));
  }

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
    ["/puppies", "puppies-mobile"],
    ["/pet-services", "services-mobile"],
    ["/clubs", "clubs-mobile"],
    ["/events", "events-mobile"],
    ["/compare/insurance", "compare-mobile"],
    ["/sponsors", "sponsors-mobile"],
  ]) {
    await mp.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await mp.waitForTimeout(250);
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
