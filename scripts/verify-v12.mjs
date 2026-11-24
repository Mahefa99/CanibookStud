import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const base=process.env.BASE_URL??"http://127.0.0.1:3000";
const out="artifacts/v12"; await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH??"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const errors=[]; page.on("pageerror",e=>errors.push(e.message));
let checks=0;
function check(name,condition){assert.ok(condition,name);checks++;console.log(`ok ${name}`);}
try {
 await page.goto(`${base}/dashboard/billing`);
 let text=await page.locator("main").innerText();
 check("V12 breeder plans",["Free","Starter","Pro","Unlimited","$29","$59","$99"].every(x=>text.includes(x))&&!text.includes("$55"));
 await page.goto(`${base}/dashboard/import`);
 check("publication disabled before KYC and evidence",await page.getByRole("button",{name:"Preview eligible publication"}).isDisabled());
 await page.getByLabel("CSV (max 5 MB)").setInputFiles({name:"dogs.csv",mimeType:"text/csv",buffer:Buffer.from("Name,Breed,DOB,Sex,Microchip\nTest A,French Bulldog,2024-01-01,female,123\nTest B,French Bulldog,2024-01-01,male,123\n")});
 await page.getByText("2 local drafts imported",{exact:false}).waitFor();
 text=await page.locator("main").innerText();check("CSV drafts flag invalid and duplicate chips",text.includes("Microchip must contain 15 digits")&&text.includes("Duplicate microchip"));
 check("incomplete imported dogs cannot publish",await page.getByRole("button",{name:"Preview eligible publication"}).isDisabled());
 await page.screenshot({path:`${out}/import-desktop.png`,fullPage:true});
 for(const route of ["/dashboard/import","/sponsors","/blog","/dashboard/club/events/sample","/dashboard/services/new"]){await page.goto(base+route);const a=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();if(a.violations.length) console.log(JSON.stringify(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),null,2));check(`axe ${route}: ${a.violations.map(x=>x.id).join(",")}`,a.violations.length===0);}
 await page.goto(`${base}/sponsors`);
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 check("sponsor defined placement",await page.getByLabel("Sample placement calendar").isVisible());
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 check("sponsor missing company blocks progress",(await page.locator("main").innerText()).includes("Enter a company"));
 await page.getByLabel("Company",{exact:true}).fill("Sample company");await page.getByLabel("Contact email",{exact:true}).fill("sample@example.com");
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByLabel("Creative image",{exact:false}).setInputFiles({name:"sample.png",mimeType:"image/png",buffer:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=","base64")});
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 check("sponsor payment is an explicit preview",(await page.locator("main").innerText()).includes("payment not connected"));
 await page.getByRole("button",{name:"Continue",exact:true}).click();await page.getByRole("button",{name:"Create local campaign draft"}).click();
 check("sponsor draft never claims campaign submission",(await page.locator("main").innerText()).includes("Draft campaign ready"));
 await page.screenshot({path:`${out}/sponsor-workspace.png`,fullPage:true});
 await page.goto(`${base}/blog/german-shepherd-stubborn`);check("article has six editorial sections",await page.locator("article h2").count()>=6);
 await page.goto(`${base}/godpet`);check("photo not requested at beginning",await page.locator('input[type="file"]').count()===0);
 await page.goto(`${base}/pet-services/blue-ridge-emergency-veterinary`);text=await page.locator("main").innerText();check("professional street and ZIP hidden",!text.includes("410 Riverbend Road")&&!text.includes("28805"));
 await page.goto(`${base}/checkout/litter/cedar-stone-fall-litter`);check("approved delivery remains disabled",await page.locator('option[value="approved-transporter"]').evaluate(option=>option.disabled));
 for(const route of ["/dashboard/import","/sponsors","/blog","/godpet","/studs?view=map"]){await page.setViewportSize({width:390,height:844});await page.goto(base+route);await page.waitForTimeout(400);check(`mobile width ${route}`,await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));await page.screenshot({path:`${out}/${route.split("/").filter(Boolean).join("-").replace(/[^a-z-]/g,"")}-mobile.png`,fullPage:true});}
 check("no runtime errors",errors.length===0);
 await fs.writeFile(`${out}/verification.json`,JSON.stringify({checks,failures:0,errors},null,2));
 console.log(JSON.stringify({checks,failures:0}));
} finally {await browser.close();}
