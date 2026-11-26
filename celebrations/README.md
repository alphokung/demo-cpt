# Celebration themes (`fireworks.js`)

One folder per festival. The engine (`fireworks.js`) never changes for a new festival —
you copy a folder, swap the artwork and edit `theme.json`.

```
celebrations/
  newyear-2570/
    theme.json        ← texts, modes, levels, colours, card slots
    cards/lv1.webp    ← full score card per level, exported from Figma (card/lv1 … card/lv8) — the level's น้องดีเด่น is part of the background
    …
    cards/lv8.webp
    icons/button.gif  ← animated น้องดีเด่น (party hat) on the floating จุดพลุ button — 123×112, height 112 px is 2× the drawn size
    icons/button-still.webp ← first frame of button.gif, shown when the user prefers reduced motion
    icons/lv1.webp    ← level icon (น้องดีเด่น + level badge) for the score bar / level-up badge —
                        Figma component icon/lvN, also placed in the rank badge of card/lvN
```

Use it on a page:

```html
<script src="fireworks.js" data-theme="celebrations/newyear-2570/theme.json" defer></script>
```

`data-*` attributes on the script tag still win over the theme (e.g. `data-sound="false"`).
If the theme can't be loaded the script falls back to its built-in defaults.

## Who edits what

| Designer (Figma → files) | Content / dev (`theme.json`) | Dev (`fireworks.js`) |
|---|---|---|
| `cards/lvN.webp` — whole card: background with น้องดีเด่น, all text, rank badge, ทางรัฐ icon | greeting texts, modes, level titles & thresholds, colours | effects, layout of the floating UI, scoring |
| `icons/lvN.webp` — level icon, Figma component `icon/lvN` (export @2x+, ~12 KB) | `cardSlots` if the red slots in Figma move | new effect modes (e.g. Songkran water) |

Code draws only two things on top of a designer card, inside the red **CODE SLOTS** in Figma:
the score number and the player's best combo. น้องดีเด่น is designed into each card's background in Figma.

Figma template: “ทางรัฐ Celebration — Safe zone template” → page *Score cards — full design (8 levels)*.

## Exporting cards from Figma

1. Hide nothing — export the frame `card/lvN` itself (the red slots sit outside it).
2. Export PNG 1080×1350, then convert to WebP quality ~85 (≈ 30–200 KB each), e.g.
   `cwebp -q 85 lv1.png -o lv1.webp`
3. Save as `cards/lv1.webp` … `cards/lv8.webp`.

## `theme.json` fields

| Field | Example | Notes |
|---|---|---|
| `id`, `name` | `"newyear-2570"`, `"ปีใหม่ 2570"` | for humans / `thFireworks.theme()` |
| `label`, `labelHeart` | `"สวัสดีปีใหม่ 2570"` | greeting + procedural card title |
| `sub` | `"…"` or `{ "firework": "…", "lantern": "…", "heart": "…" }` | second line of the greeting |
| `modes`, `mode` | `["firework"]`, `"firework"` | which effects the page offers |
| `greeting`, `score`, `sound`, `haptic`, `autoplay` | `false` | same as the `data-*` switches |
| `active` | `{ "from": "2026-12-20", "to": "2027-01-10" }` | outside the window nothing shows; add `?fw-preview` to the URL to test |
| `buttonIcon` | `"icons/button.gif"` | image on the floating button (GIF / animated WebP OK); default is the built-in น้องดีเด่น head |
| `buttonIconStill` | `"icons/button-still.webp"` | still version of `buttonIcon` for users who prefer reduced motion |
| `buttonStyle` | `"light"` | white floating button instead of the default green |
| `buttonText` | `false` | round icon-only button, no "จุดพลุ" label (screen readers still hear it) |
| `particles`, `heartParticles` | `["#fdb022", "#5ed49a"]` | firework / heart colours |
| `levels[]` | `{ "at": 50, "title": "…", "emoji": "✨", "card": "cards/lv2.webp", "icon": "icons/lv2.webp", "colors": { "bg": [dark, light], "accent": [light, dark] } }` | `accent` colours the score number; `bg` is used when a level has no `card` |
| `cardSlots` | `{ "score": { "x": 60, "y": 745, "w": 960, "h": 190, "baseline": 920, "size": 220 } }` | must match the red slots in Figma |

Paths are relative to `theme.json`. Files must be served from the same origin as the page
(or with CORS) — otherwise the browser won't let the score card be saved as an image.

## New festival in 4 steps

1. Duplicate `newyear-2570/` → e.g. `songkran-2570/`.
2. Designer duplicates the 8 cards in Figma, redesigns them, exports to `cards/`.
3. Edit `theme.json` (texts, modes, titles, colours, optional `active` window).
4. Point the page at it: `data-theme="celebrations/songkran-2570/theme.json"`.
