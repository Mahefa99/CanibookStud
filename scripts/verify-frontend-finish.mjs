import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import ts from "typescript";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const out = "artifacts/frontend-finish";
await fs.mkdir(out, { recursive: true });
const checks = [];
function check(name, condition) {
  assert.ok(condition, name);
  checks.push(name);
  console.log(`PASS ${name}`);
}
const source = await fs.readFile("lib/search/studs.ts", "utf8");
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const search = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
check(
  "invalid geographic coordinates rejected",
  search.parseStudSearchParams({ origin: "91,181" }).origin === undefined,
);
check(
  "zero-year boundary preserved",
  search.parseStudSearchParams({ maxAge: "0" }).maxAge === 0 &&
    search.buildStudSearchHref({ maxAge: 0 }).includes("maxAge=0"),
);
check(
  "invalid ages rejected",
  search.parseStudSearchParams({ minAge: "-1", maxAge: "Infinity" }).minAge ===
    undefined &&
    search.parseStudSearchParams({ maxAge: "Infinity" }).maxAge === undefined,
);
check(
  "reversed age range normalized",
  search.parseStudSearchParams({ minAge: "8", maxAge: "2" }).minAge === 2,
);
check(
  "filter change resets pagination",
  !search.buildStudSearchHref({ page: 5 }, { color: "Blue" }).includes("page="),
);
const svg = await fs.readFile("public/brand/canibookstud-logo.svg", "utf8");
check(
  "logo is a genuine vector",
  svg.includes("<path") && !/<image|data:|<script/i.test(svg),
);

const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}/studs?color=Blue&minAge=0&akc=1&view=map`);
  check(
    "new filters have removable chips",
    (await page
      .getByRole("link", { name: "Color: Blue Remove filter" })
      .count()) === 1 &&
      (await page
        .getByRole("link", { name: "Min age: 0 Remove filter" })
        .count()) === 1,
  );
  check(
    "radius picker covers catalog cities",
    (await page.locator('select[name="origin"] option').count()) > 6,
  );
  await page.getByLabel("Sort", { exact: true }).selectOption("price_asc");
  await page.waitForURL((url) => url.searchParams.get("sort") === "price_asc");
  check(
    "sorting preserves new filters",
    new URL(page.url()).searchParams.get("color") === "Blue" &&
      new URL(page.url()).searchParams.get("minAge") === "0" &&
      new URL(page.url()).searchParams.get("akc") === "1",
  );
  await page.getByRole("link", { name: "Color: Blue Remove filter" }).click();
  await page.waitForURL((url) => !url.searchParams.has("color"));
  check(
    "removing one filter preserves others",
    new URL(page.url()).searchParams.get("akc") === "1",
  );
  await page.goto(`${base}/studs?q=Marlo`);
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await page.waitForURL((url) => !url.searchParams.has("q"));
  await page.waitForFunction(() => document.activeElement?.id === "filter-q");
  check(
    "clear search restores focus and all results",
    (await page.getByLabel("Search", { exact: true }).inputValue()) === "",
  );
  await page.route("**/maps/us-states.json", (route) => route.abort());
  await page.goto(`${base}/studs?view=map`);
  await page.getByRole("button", { name: "Retry map" }).waitFor();
  check(
    "map failure retains accessible listing",
    (await page
      .getByText("Accessible map listings", { exact: false })
      .count()) === 1,
  );
  await page.unroute("**/maps/us-states.json");
  await page.getByRole("button", { name: "Retry map" }).click();
  await page.locator(".leaflet-marker-icon").first().waitFor();
  await page.getByRole("button", { name: "Show all map listings" }).click();
  check(
    "map retry recovers markers",
    (await page.locator(".leaflet-marker-icon").count()) > 0,
  );
  await page.screenshot({ path: `${out}/map-desktop.png`, fullPage: true });
  await page.goto(`${base}/dashboard/import`);
  await page.getByLabel("Main breed DNA (%)", { exact: true }).fill("101");
  check(
    "out-of-range DNA is not eligible",
    await page
      .getByText("Enter a percentage between 0 and 100", { exact: false })
      .isVisible(),
  );
  await page
    .getByLabel("DNA report (PDF, max 10 MB)")
    .setInputFiles({
      name: "wrong.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("invalid"),
    });
  check(
    "wrong report format has visible error",
    await page
      .getByText("Choose a PDF file no larger than 10 MB", { exact: false })
      .isVisible(),
  );
  await page
    .getByLabel("CSV (max 5 MB)")
    .setInputFiles({
      name: "quoted.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(
        'Name,Breed,DOB,Sex,Microchip\n"Dog, A",Labrador Retriever,2024-01-01,male,123456789012345',
      ),
    });
  check(
    "unsupported CSV rows rejected without shifting fields",
    await page
      .getByText("Each CSV row must contain exactly five unquoted fields", {
        exact: false,
      })
      .isVisible(),
  );
  await page.getByRole("button", { name: "Add one dog manually" }).click();
  await page.getByLabel("Filter breeds", { exact: true }).fill("no-such-breed");
  check(
    "import filter has recoverable empty state",
    await page.getByRole("button", { name: "Clear breed filter" }).isVisible(),
  );
  await page.getByRole("button", { name: "Clear breed filter" }).click();
  check(
    "clearing import filter restores draft",
    (await page.getByRole("button", { name: "Remove draft" }).count()) === 1,
  );
  await page.goto(`${base}/sponsors`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Month", { exact: true }).fill("2028-02");
  check(
    "calendar includes leap day",
    (await page.locator('[title^="2028-02-"]').count()) === 29,
  );
  await page.getByLabel("Month", { exact: true }).fill("2028-04");
  check(
    "calendar has correct short month",
    (await page.locator('[title^="2028-04-"]').count()) === 30,
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  check(
    "sponsor validation focuses invalid company",
    await page
      .getByLabel("Company", { exact: true })
      .evaluate(
        (el) =>
          document.activeElement === el &&
          el.getAttribute("aria-invalid") === "true",
      ),
  );
  for (const route of [
    "/blog",
    "/blog/german-shepherd-stubborn",
    "/studs?view=map",
    "/dashboard/import",
    "/sponsors",
  ]) {
    await page.goto(base + route);
    if (route.includes("view=map"))
      await page.locator(".leaflet-marker-icon").first().waitFor();
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    check(
      `axe ${route}: ${axe.violations.map((v) => v.id).join(",")}`,
      axe.violations.length === 0,
    );
  }
  await page.goto(`${base}/blog/german-shepherd-stubborn`);
  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link")
    .first()
    .click();
  check(
    "article contents links to section",
    new URL(page.url()).hash === "#section-1",
  );
  await page.screenshot({ path: `${out}/article-desktop.png`, fullPage: true });
  await page.goto(`${base}/blog`);
  const articles = await page
    .locator("main article h2 a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  check(
    "exactly fifteen blog articles",
    articles.length === 15 && new Set(articles).size === 15,
  );
  const editorial = [];
  for (const route of articles) {
    await page.goto(base + route);
    const body = (
      await page.locator("article .prose-editorial p").allTextContents()
    ).join(" ");
    const words = body.trim().split(/\s+/).length;
    const sources = await page
      .locator('section[aria-labelledby="sources-title"] a')
      .count();
    const imageLoaded = await page
      .locator("article > img")
      .evaluate((img) => img.complete && img.naturalWidth > 0);
    check(
      `editorial ${route}: ${words} words, sources and cover`,
      words >= 800 && words <= 1200 && sources > 0 && imageLoaded,
    );
    editorial.push({ route, words, sources });
  }
  await fs.writeFile(
    `${out}/editorial.json`,
    JSON.stringify(editorial, null, 2),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/blog",
    "/blog/german-shepherd-stubborn",
    "/studs",
    "/sponsors",
  ]) {
    await page.goto(base + route);
    check(
      `mobile width ${route}`,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  await page.goto(`${base}/blog`);
  await page.screenshot({ path: `${out}/blog-mobile.png`, fullPage: true });
  await page.screenshot({ path: `${out}/blog-mobile-first-screen.png` });
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ["/blog", "/studs", "/sponsors"]) {
    await page.goto(base + route);
    await page.evaluate(() => {
      document.documentElement.style.zoom = "2";
    });
    check(
      `200% CSS zoom layout ${route}`,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
  }
  check("no browser runtime errors", errors.length === 0);
  await fs.writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        checks,
        errors,
        limits:
          "Chromium only; 200% CSS zoom checks layout, not native browser zoom or assistive technology.",
      },
      null,
      2,
    ),
  );
  console.log(`${checks.length} checks passed`);
} finally {
  await browser.close();
}
