import type { DemoPhoto } from "@/lib/types/domain";
import { hashString } from "@/lib/utils";

/**
 * Art-directed placeholder used until licensed animal photography is supplied.
 *
 * It is intentionally illustrative (not a stock photo pretending to be the
 * animal) and is labelled as an illustration in the surrounding UI. The tone
 * and head shape vary deterministically with the record so cards do not all
 * look identical.
 */
export function DemoPortrait({
  photo,
  alt,
  className,
}: {
  photo: DemoPhoto;
  alt?: string;
  className?: string;
}) {
  const seed = hashString(photo.id);
  const tilt = (seed % 7) - 3;
  const shift = ((seed >> 3) % 9) - 4;

  const palettes = {
    navy: {
      background: "#E7EEF7",
      haze: "#D6E2F1",
      body: "#0B3A6B",
      detail: "#062B52",
      muzzle: "#F6EDDF",
      accent: "#FF6E01",
    },
    clay: {
      background: "#F6E9DE",
      haze: "#EFDACA",
      body: "#7C3F22",
      detail: "#5C2D16",
      muzzle: "#FBF3E7",
      accent: "#002B58",
    },
    sage: {
      background: "#E8EEE5",
      haze: "#D9E4D4",
      body: "#355A4A",
      detail: "#264538",
      muzzle: "#F7F2E9",
      accent: "#FF6E01",
    },
    sand: {
      background: "#F3EBDD",
      haze: "#EADFCB",
      body: "#6D5630",
      detail: "#4E3D20",
      muzzle: "#FFF9EF",
      accent: "#002B58",
    },
  } as const;

  const palette = palettes[photo.tone];

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role={alt ? "img" : "presentation"}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill={palette.background} />
      <circle cx="64" cy="54" r="96" fill={palette.haze} opacity="0.75" />
      <circle cx="352" cy="250" r="120" fill={palette.haze} opacity="0.55" />
      <path
        d="M0 236C68 210 118 258 188 238s130-44 212-8v70H0z"
        fill={palette.haze}
        opacity="0.6"
      />

      <g transform={`translate(${200 + shift} 168) rotate(${tilt})`}>
        {photo.variant === "upright" ? (
          <>
            <path d="M-82-46c-20-42-12-72 10-78 20-5 35 18 39 52z" fill={palette.body} />
            <path d="M82-46c20-42 12-72-10-78-20-5-35 18-39 52z" fill={palette.body} />
            <path d="M-68-58c-11-25-7-43 4-47 11-3 20 11 23 33z" fill={palette.muzzle} opacity="0.55" />
            <path d="M68-58c11-25 7-43-4-47-11-3-20 11-23 33z" fill={palette.muzzle} opacity="0.55" />
          </>
        ) : null}

        {photo.variant === "floppy" ? (
          <>
            <ellipse cx="-84" cy="4" rx="26" ry="58" transform="rotate(16 -84 4)" fill={palette.body} />
            <ellipse cx="84" cy="4" rx="26" ry="58" transform="rotate(-16 84 4)" fill={palette.body} />
            <ellipse cx="-84" cy="8" rx="13" ry="38" transform="rotate(16 -84 8)" fill={palette.detail} opacity="0.35" />
            <ellipse cx="84" cy="8" rx="13" ry="38" transform="rotate(-16 84 8)" fill={palette.detail} opacity="0.35" />
          </>
        ) : null}

        {photo.variant === "pointed" ? (
          <>
            <path d="M-74-34-58-96l40 42z" fill={palette.body} />
            <path d="M74-34 58-96l-40 42z" fill={palette.body} />
            <path d="M-64-42-57-78l24 25z" fill={palette.muzzle} opacity="0.4" />
            <path d="M64-42 57-78l-24 25z" fill={palette.muzzle} opacity="0.4" />
          </>
        ) : null}

        <ellipse cx="0" cy="6" rx="76" ry="72" fill={palette.body} />
        <path d="M-58-24c14-27 35-41 58-41s44 14 58 41c-22-11-78-11-116 0z" fill={palette.detail} opacity="0.25" />
        <ellipse cx="0" cy="38" rx="44" ry="33" fill={palette.muzzle} />
        <ellipse cx="-27" cy="-12" rx="6" ry="7" fill={palette.detail} />
        <ellipse cx="27" cy="-12" rx="6" ry="7" fill={palette.detail} />
        <circle cx="-25" cy="-14" r="1.8" fill={palette.muzzle} />
        <circle cx="29" cy="-14" r="1.8" fill={palette.muzzle} />
        <path d="M-8 18h16c5 0 8 4 8 8 0 6-7 9-16 9s-16-3-16-9c0-4 3-8 8-8z" fill={palette.detail} />
        <path d="M0 34v9M-14 47c5 5 9 6 14 6s9-1 14-6" stroke={palette.detail} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M-76 68c18 23 98 23 116 0" stroke={palette.accent} strokeWidth="10" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="84" r="7" fill={palette.accent} />
      </g>
    </svg>
  );
}
