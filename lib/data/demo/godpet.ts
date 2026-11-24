import { hashString } from "@/lib/utils";

/**
 * GODPET — mock, deterministic name generator (CDC V12 §8 / GODPET-DEV fiche).
 *
 * There is no GPT call and no backend. Names are picked from a curated pool and
 * every score/flag is derived deterministically from the form input, so the same
 * input always yields the same six names. Clearly labelled "demo" in the UI.
 */

export interface GodpetName {
  name: string;
  pronunciation: string;
  meaning: string;
  why: string;
  score: number; // 0-100
  phoneticScore: number;
  raceScore: number;
  personalityScore: number;
  confusionScore: number;
  uniquenessScore: number;
  instagramAvailable: boolean;
  domainAvailable: boolean;
}

export interface GodpetInput {
  breed: string;
  sex: "male" | "female";
  personality: string[];
  style: string;
  color?: string;
  origin?: string;
  length?: string;
  letterPref?: string;
}

export interface GodpetCertificate {
  id: string;
  name: GodpetName;
  breed: string;
  sex: "male" | "female";
  color?: string;
  generatedAt: string; // ISO date-time
}

export const GODPET_BREEDS = [
  "Labrador Retriever",
  "French Bulldog",
  "German Shepherd",
  "Golden Retriever",
  "English Bulldog",
  "Poodle",
  "Yorkshire Terrier",
  "Beagle",
  "Border Collie",
  "Australian Shepherd",
] as const;

export const GODPET_PERSONALITIES = [
  "Calm",
  "Wild",
  "Playful",
  "Royal",
  "Stubborn",
  "Affectionate",
  "Independent",
  "Food-motivated",
  "Fearful",
  "Curious",
] as const;

export const GODPET_STYLES = [
  "Chic",
  "Funny",
  "Pop Culture",
  "Nature",
  "Royal",
  "Cute",
  "Unique",
  "Vintage",
  "Classic",
] as const;

export const GODPET_ORIGINS = [
  "American",
  "French",
  "Italian",
  "Japanese",
  "Nordic",
  "Latin",
  "No preference",
] as const;

export const GODPET_LENGTHS = ["1 syllable", "2 syllables", "No preference"] as const;

/** Command-like sounds and over-used names that a good dog name should avoid. */
const FORBIDDEN = new Set([
  "sit", "stay", "come", "down", "no", "heel", "fetch", "leave",
  "sid", "kit", "bo", "beau", "moe", "joe", "flo",
]);

/** Top-10 dog names: only acceptable when the user picks the "Classic" style. */
const TOP_10 = new Set([
  "max", "bella", "charlie", "luna", "cooper", "bailey",
  "daisy", "lola", "sadie", "rocky",
]);

interface NameSeed {
  name: string;
  pronunciation: string;
  meaning: string;
  styles: string[];
}

const NAME_POOL: NameSeed[] = [
  { name: "Marlowe", pronunciation: "MAR-lo", meaning: "Driftwood hill — literary and calm.", styles: ["Chic", "Unique"] },
  { name: "Opal", pronunciation: "OH-pul", meaning: "A precious, softly coloured gemstone.", styles: ["Cute", "Unique"] },
  { name: "Roux", pronunciation: "ROO", meaning: "Reddish-brown; warm and quietly French.", styles: ["Chic", "Unique"] },
  { name: "Bijou", pronunciation: "BEE-zhoo", meaning: "Jewel in French — small and treasured.", styles: ["Chic", "Cute"] },
  { name: "Nimbus", pronunciation: "NIM-bus", meaning: "A soft, drifting rain cloud.", styles: ["Nature", "Unique"] },
  { name: "Fern", pronunciation: "FURN", meaning: "A shade-loving green plant.", styles: ["Nature", "Vintage"] },
  { name: "Juniper", pronunciation: "JOO-ni-per", meaning: "An evergreen shrub with blue berries.", styles: ["Nature", "Cute"] },
  { name: "Sage", pronunciation: "SAYJ", meaning: "Wise, and a fragrant herb.", styles: ["Nature", "Unique"] },
  { name: "Bodhi", pronunciation: "BO-dee", meaning: "Awakening, enlightenment.", styles: ["Unique", "Nature"] },
  { name: "Koda", pronunciation: "KO-duh", meaning: "Friend or ally.", styles: ["Cute", "Nature"] },
  { name: "Waffles", pronunciation: "WAH-fulz", meaning: "Sweet, golden and a little absurd.", styles: ["Funny"] },
  { name: "Pickle", pronunciation: "PIK-ul", meaning: "Small, tangy and full of character.", styles: ["Funny", "Unique"] },
  { name: "Meatball", pronunciation: "MEET-bawl", meaning: "Round and impossible not to love.", styles: ["Funny"] },
  { name: "Taco", pronunciation: "TAH-ko", meaning: "Compact, folded and universally loved.", styles: ["Funny", "Pop Culture"] },
  { name: "Biscuit", pronunciation: "BIS-kit", meaning: "A crunchy little sweet.", styles: ["Funny", "Cute"] },
  { name: "Puddles", pronunciation: "PUD-ulz", meaning: "Small, splashy and cheerful.", styles: ["Funny"] },
  { name: "Yoda", pronunciation: "YO-duh", meaning: "Tiny but wise.", styles: ["Pop Culture"] },
  { name: "Gatsby", pronunciation: "GATS-bee", meaning: "Great, and a little glamorous.", styles: ["Pop Culture", "Chic"] },
  { name: "Arya", pronunciation: "AR-yah", meaning: "Noble and fierce.", styles: ["Pop Culture", "Unique"] },
  { name: "Loki", pronunciation: "LO-kee", meaning: "A charming trickster.", styles: ["Pop Culture"] },
  { name: "Pixel", pronunciation: "PIK-sul", meaning: "A small digital spark.", styles: ["Pop Culture", "Unique"] },
  { name: "Zelda", pronunciation: "ZEL-duh", meaning: "Legendary and bright.", styles: ["Pop Culture", "Vintage"] },
  { name: "Rex", pronunciation: "REKS", meaning: "King.", styles: ["Royal", "Classic"] },
  { name: "Duke", pronunciation: "DOOK", meaning: "A noble rank.", styles: ["Royal", "Classic"] },
  { name: "Czar", pronunciation: "ZAHR", meaning: "Emperor.", styles: ["Royal", "Unique"] },
  { name: "Monarch", pronunciation: "MON-ark", meaning: "Sovereign butterfly and ruler.", styles: ["Royal", "Unique"] },
  { name: "Baron", pronunciation: "BAIR-un", meaning: "A title of nobility.", styles: ["Royal"] },
  { name: "Lady", pronunciation: "LAY-dee", meaning: "Graceful and proper.", styles: ["Royal", "Classic"] },
  { name: "Nova", pronunciation: "NO-vuh", meaning: "A new star.", styles: ["Cute", "Unique"] },
  { name: "Pebble", pronunciation: "PEB-ul", meaning: "Small, smooth and steady.", styles: ["Cute", "Nature"] },
  { name: "Clementine", pronunciation: "KLEM-en-teen", meaning: "Sweet citrus with retro charm.", styles: ["Vintage", "Cute"] },
  { name: "Hazel", pronunciation: "HAY-zul", meaning: "A warm brown tone.", styles: ["Vintage", "Classic"] },
  { name: "Olive", pronunciation: "AH-liv", meaning: "A peaceful green fruit.", styles: ["Vintage", "Nature"] },
  { name: "Gus", pronunciation: "GUS", meaning: "Short, sturdy and classic.", styles: ["Classic", "Vintage"] },
  { name: "Rosie", pronunciation: "RO-zee", meaning: "Rose — gentle and classic.", styles: ["Classic", "Cute"] },
  { name: "Hank", pronunciation: "HANK", meaning: "Solid, friendly, all-American.", styles: ["Classic"] },
  { name: "June", pronunciation: "JOON", meaning: "A soft summer month.", styles: ["Vintage", "Classic"] },
  { name: "Otis", pronunciation: "OH-tis", meaning: "Prosperous, with retro cool.", styles: ["Vintage", "Unique"] },
  { name: "Pearl", pronunciation: "PURL", meaning: "Round and precious.", styles: ["Vintage", "Cute"] },
  { name: "Fable", pronunciation: "FAY-bul", meaning: "A story worth telling.", styles: ["Unique", "Chic"] },
  { name: "Echo", pronunciation: "EK-oh", meaning: "A repeating sound.", styles: ["Unique", "Nature"] },
  { name: "Nyx", pronunciation: "NIKS", meaning: "Night — dark and elegant.", styles: ["Unique"] },
  { name: "Aura", pronunciation: "AWR-uh", meaning: "A surrounding glow.", styles: ["Unique", "Chic"] },
  { name: "Solstice", pronunciation: "SOL-stis", meaning: "The turning of the sun.", styles: ["Unique", "Nature"] },
  { name: "Cricket", pronunciation: "KRIK-it", meaning: "Small, chirpy and lively.", styles: ["Nature", "Funny"] },
  { name: "Maple", pronunciation: "MAY-pul", meaning: "A sweet North American tree.", styles: ["Nature", "Classic"] },
  { name: "Aspen", pronunciation: "AS-pen", meaning: "A quaking mountain tree.", styles: ["Nature", "Unique"] },
  { name: "Clover", pronunciation: "KLO-ver", meaning: "A lucky green sprig.", styles: ["Nature", "Cute"] },
  { name: "Coco", pronunciation: "KO-ko", meaning: "Cocoa — warm brown.", styles: ["Chic", "Cute"] },
  { name: "Vogue", pronunciation: "VOHG", meaning: "In style.", styles: ["Chic"] },
  { name: "Chanel", pronunciation: "shuh-NEL", meaning: "Timeless luxury.", styles: ["Chic", "Unique"] },
  { name: "Cosmo", pronunciation: "KOZ-mo", meaning: "The universe.", styles: ["Unique", "Pop Culture"] },
];

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const j = s % (i + 1);
    const a = arr[i] as T;
    const b = arr[j] as T;
    arr[i] = b;
    arr[j] = a;
  }
  return arr;
}

function scoreFor(seed: string, name: string, salt: string, min: number, span: number): number {
  return min + (hashString(`${seed}:${name}:${salt}`) % span);
}

/** Deterministic mock generation. No network, no GPT, no randomness beyond the seed. */
export function generateGodpetNames(input: GodpetInput, regeneration: number): GodpetName[] {
  const style = input.style;
  const seed = [
    input.breed,
    input.sex,
    style,
    [...input.personality].sort().join("|"),
    input.letterPref ?? "",
    String(regeneration),
  ].join("::");

  // Prefer names matching the chosen style, then fill with the rest.
  const styleScored = NAME_POOL.map((entry) => ({
    entry,
    styleHit: entry.styles.includes(style) ? 1 : 0,
  }));
  const preferred = styleScored.filter((n) => n.styleHit).map((n) => n.entry);
  const rest = styleScored.filter((n) => !n.styleHit).map((n) => n.entry);
  const ordered = [...seededShuffle(preferred, hashString(seed)), ...seededShuffle(rest, hashString(`${seed}:rest`))].filter(entry => !FORBIDDEN.has(entry.name.toLowerCase()) && (style === "Classic" || !TOP_10.has(entry.name.toLowerCase())) && [...FORBIDDEN].every(command => nameDistance(entry.name.toLowerCase(), command) >= 2));

  const personalityWord = input.personality[0]?.toLowerCase() ?? "balanced";
  const styleReason =
    style === "Classic"
      ? "a familiar, time-tested feel"
      : style === "Funny"
        ? "a playful, slightly silly edge"
        : style === "Royal"
          ? "a dignified, titled feel"
          : `a ${style.toLowerCase()} feel`;

  return ordered.slice(0, 6).map((entry) => {
    const normalized = entry.name.toLowerCase();
    const inTop10 = TOP_10.has(normalized);
    const phoneticScore = scoreFor(seed, entry.name, "phonetic", 70, 30);
    const raceScore = scoreFor(seed, entry.name, "race", 60, 36);
    const personalityScore = scoreFor(seed, entry.name, "personality", 62, 34);
    const uniquenessScore = scoreFor(seed, entry.name, "uniqueness", 55, 41);
    let confusionScore = scoreFor(seed, entry.name, "confusion", 78, 22);
    if (inTop10 && style !== "Classic") confusionScore = Math.max(40, confusionScore - 20);
    if (FORBIDDEN.has(normalized)) confusionScore = Math.min(confusionScore, 30);

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (phoneticScore + raceScore + personalityScore + confusionScore + uniquenessScore) / 5,
        ),
      ),
    );

    return {
      name: entry.name,
      pronunciation: entry.pronunciation,
      meaning: entry.meaning,
      why: `A ${entry.name.length <= 5 ? "short, clear" : "balanced two-syllable"} rhythm that fits a ${personalityWord} ${input.breed}, chosen for ${styleReason} while staying clear of common obedience commands.`,
      score,
      phoneticScore,
      raceScore,
      personalityScore,
      confusionScore,
      uniquenessScore,
      instagramAvailable: hashString(`${seed}:${entry.name}:ig`) % 2 === 0,
      domainAvailable: hashString(`${seed}:${entry.name}:dom`) % 3 === 0,
    };
  });
}

export function newCertificateId(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return `godpet-${suffix}`;
}

/** URL-safe base64 of the certificate payload, so the public page is self-contained. */
export function encodeGodpetCertificate(cert: GodpetCertificate): string {
  return btoa(encodeURIComponent(JSON.stringify(cert)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeGodpetCertificate(token: string): GodpetCertificate | null {
  try {
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(decodeURIComponent(atob(base64))) as GodpetCertificate;
    if (!parsed || typeof parsed.name !== "object" || !parsed.name.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

function nameDistance(a: string, b: string): number { const row = Array.from({length:b.length+1}, (_,i)=>i); for(let i=1;i<=a.length;i++){let previous=row[0]!;row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j]!;row[j]=Math.min(row[j]!+1,row[j-1]!+1,previous+(a[i-1]===b[j-1]?0:1));previous=old;}}return row[b.length]!;}
