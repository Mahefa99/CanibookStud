import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Verification for the CDC-compatibility adaptation:
 * legacy redirects, heat calendar, creation forms, checkout summaries,
 * advertising placements and sitemap.
 */

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const CHROME_PATH =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = path.resolve("artifacts/cdc");

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

  // CDC-compatible redirects
  await page.goto(`${BASE}/map`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  check("redirect: /map → /studs?view=map", page.url().includes("/studs?view=map"));
  await page.locator("[data-sponsor-pin]").waitFor({state:"attached"});
  check("map: sponsor pin", (await page.locator("[data-sponsor-pin]").count()) === 1);
  await shot(page, "map");

  await page.goto(`${BASE}/stud/marlo-northshore`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("redirect: /stud/[slug]", page.url().includes("/studs/marlo-northshore"));
  check("redirect target: profile", (await page.locator("h1").first().innerText()).includes("Marlo"));

  await page.goto(`${BASE}/pet-services-map`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  check("redirect: /pet-services-map", page.url().includes("/pet-services?view=map"));

  await page.goto(`${BASE}/vets`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  check("redirect: /vets", page.url().includes("category=vet"));

  await page.goto(`${BASE}/breed/french-bulldog`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("redirect: /breed/[breed]", page.url().includes("/breeds/french-bulldog"));

  await page.goto(`${BASE}/dashboard/reservations`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  check("redirect: reservations", page.url().includes("/dashboard/requests"));

  // Heat calendar
  await page.goto(`${BASE}/dashboard/animals/dam-sable/heat`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  check("heat: heading", (await page.locator("h1").innerText()).includes("Sable"));
  check("heat: private", (await page.locator("main").innerText()).includes("Private"));
  await page.getByRole("button", { name: /Add local heat/i }).click();
  await page.waitForTimeout(150);
  check("heat: log entry", (await page.locator("main").innerText()).includes("Heat recorded"));
  await page.getByRole("button", { name: /Add local mating/i }).click();
  await page.waitForTimeout(150);
  const heatText = await page.locator("main").innerText();
  check("heat: mating entry", heatText.includes("Mating recorded"));
  check("heat: due estimate", heatText.includes("Jan 6, 2027"));
  check("heat: no pregnancy claim", heatText.includes("does not confirm pregnancy"));
  await shot(page, "heat");
  await scan(page, "heat");

  // Litter creation
  await page.goto(`${BASE}/dashboard/litters/new`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: /Submit litter for review/i }).click();
  await page.waitForTimeout(150);
  check("litter form: validation", (await page.getByText("Please check the highlighted fields").count()) === 1);
  await page.locator("#title").fill("CDC Sample Litter");
  await page.locator("#sireSlug").selectOption("marlo-northshore");
  await page.locator("#description").fill("A sample litter created to verify the CDC creation form and its review state.");
  await page.locator("#accuracy").check();
  await page.locator("#delivery").check();
  await page.getByRole("button", { name: /Submit litter for review/i }).click();
  await page.waitForTimeout(200);
  check("litter form: review state", (await page.locator("main").innerText()).includes("is in the review queue"));
  await shot(page, "litter-create");

  // Professional creation
  await page.goto(`${BASE}/dashboard/services/new`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await page.locator("#name").fill("CDC Sample Veterinary");
  await page.locator("#category").selectOption("vet");
  await page.locator("#email").fill("sample@example.com");
  await page.locator("#zip").fill("28801");
  await page.locator("#street").fill("10 Sample Street");
  await page.locator("#city").fill("Asheville");
  await page.locator("#stateCode").selectOption("NC");
  await page.locator("#description").fill("A sample business used to verify the professional onboarding form and its manual review state.");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: /Submit for manual review/i }).click();
  await page.waitForTimeout(200);
  check("professional form: review state", (await page.locator("main").innerText()).includes("Manual review"));

  // Club creation
  await page.goto(`${BASE}/clubs/new`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await page.locator("#name").fill("CDC Sample Club");
  await page.locator("#website").fill("https://sampleclub.example.org");
  await page.locator("#email").fill("contact@sampleclub.example.org");
  await page.locator("#city").fill("Austin");
  await page.locator("#stateCode").selectOption("TX");
  await page.locator("#description").fill("A sample club created to verify the registration form and its manual review state.");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: /Submit club for review/i }).click();
  await page.waitForTimeout(200);
  check("club form: review state", (await page.locator("main").innerText()).includes("Manual review"));

  // Event creation
  await page.goto(`${BASE}/events/new`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  await page.locator("#title").fill("CDC Sample Meetup");
  await page.locator("#event-date").fill("2027-03-10");
  await page.locator("#locationName").fill("Sample Hall");
  await page.locator("#address").fill("20 Sample Avenue");
  await page.locator("#city").fill("Austin");
  await page.locator("#stateCode").selectOption("TX");
  await page.locator("#description").fill("A sample event created to verify the event form and its review state.");
  await page.locator("#consent").check();
  await page.getByRole("button", { name: /Submit event for review/i }).click();
  await page.waitForTimeout(200);
  check("event form: review state", (await page.locator("main").innerText()).includes("is in the review queue"));

  // Checkouts
  await page.goto(`${BASE}/checkout/stud/marlo-northshore`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  const studCheckout = await page.locator("main").innerText();
  check("checkout stud: $400 total", studCheckout.includes("$400"));
  check("checkout stud: disabled payment", studCheckout.includes("unavailable"));
  await shot(page, "checkout-stud");

  await page.goto(`${BASE}/checkout/litter/cedar-stone-fall-litter?puppy=poppy`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(200);
  const litterCheckout = await page.locator("main").innerText();
  check("checkout litter: $3,600 total", litterCheckout.includes("$3,600"));
  check("checkout litter: open collection rule", litterCheckout.includes("600") && litterCheckout.includes("3,600"));
  check("checkout litter: disabled payment", litterCheckout.includes("unavailable"));
  await shot(page, "checkout-litter");

  // Advertising placements and forbidden pages
  for (const [route, placement] of [
    ["/", "home_top_banner"],
    ["/studs", "stud_list_native"],
    ["/pet-services", "services_sidebar"],
    ["/compare/insurance", "compare_top"],
    ["/events/frenchie-meetup-austin", "event_page"],
    ["/breeds/french-bulldog", "breed_sidebar"],
  ]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(200);
    check(`ads: allowed ${placement}`, (await page.locator(`[data-ad-placement="${placement}"]`).count()) === 1);
  }
  for (const route of ["/studs/marlo-northshore", "/puppies/cedar-stone-fall-litter", "/checkout/stud/marlo-northshore", "/contracts/CB-2026-1042", "/dashboard"]) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
    check(`ads: forbidden ${route}`, (await page.locator("[data-ad-placement]").count()) === 0);
  }

  // Sitemap + mobile
  const sitemap = await page.goto(`${BASE}/sitemap.xml`);
  const sitemapText = await page.locator("body").innerText();
  check("sitemap: HTTP 200", sitemap?.status() === 200);
  check("sitemap: stud URL", sitemapText.includes("/studs/marlo-northshore"));
  check("sitemap: comparison URL", sitemapText.includes("/compare/insurance"));

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
    ["/dashboard/animals/dam-sable/heat", "heat-mobile"],
    ["/dashboard/litters/new", "litter-create-mobile"],
    ["/checkout/litter/cedar-stone-fall-litter", "checkout-mobile"],
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
