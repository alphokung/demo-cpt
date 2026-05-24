# DESIGN.md — CZP Web Design System

> Machine-readable design system specification for AI coding agents.
> Format: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

> **Platform**: Next.js 16 / TypeScript / Tailwind CSS v4 (Web)
> **App name**: CZP Web (Citizen Portal Web)
> **Shared Design System**: This app shares the same design tokens (color palette, typography scale, spacing, radius) with the mobile platform.
> 🔗 **Mobile implementation**: [`czp-mobile/DESIGN.md`](https://github.com/dga-devops/czp-mobile/blob/develop/DESIGN.md)
> ⚠️ **Important**: If you update a design token value, it **must** be synced in both repositories.

---

## 1. Token Source of Truth

| Layer | Source | Location |
|---|---|---|
| **Design tokens (values)** | Figma → shared across platforms | Identical in both repos |
| **Web implementation** | **This repo** ← you are here | `src/app/[locale]/globals.css` |
| **Mobile implementation** | czp-mobile | `lib/core/design_system/` |

---

## 2. Visual Theme & Atmosphere

| Property | Value |
|---|---|
| **App Name** | CZP Web (Citizen Portal) |
| **Primary Brand Color** | `#008858` (green) |
| **Font Family** | Anuphan (Google Fonts, loaded via `next/font/google`) |
| **Font Subsets** | Thai, Latin |
| **Font Weights** | 100, 200, 300, 400, 500, 600, 700 |
| **Theme** | Light (default) |
| **Border Radius Style** | Rounded (pill buttons, rounded cards) |
| **Tone** | Clean, professional, government portal |
| **Component Library** | shadcn/ui (style: new-york) + Radix UI primitives |
| **Icon Library** | lucide-react + custom SVG (`/public/icons/`) |
| **i18n** | next-intl (`useTranslations()`) — supports Thai (th) and English (en) |

---

## 3. Color Palette & Roles

All colors are defined in `src/app/[locale]/globals.css` under `:root`.

### 3.1 Primary Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| primary-0 | `--primary-0` | `#00291b` |
| primary-10 | `--primary-10` | `#003d28` |
| primary-20 | `--primary-20` | `#006643` |
| **primary-30-base** ⭐ | `--primary-30-base` | `#008858` |
| primary-40 | `--primary-40` | `#00b274` |
| primary-50 | `--primary-50` | `#34c57e` |
| primary-60 | `--primary-60` | `#5ed49a` |
| primary-70 | `--primary-70` | `#5ed49a` *(same value as primary-60 — as defined in source)* |
| primary-80 | `--primary-80` | `#8de3b8` |
| primary-90 | `--primary-90` | `#adebd2` |
| primary-95 | `--primary-95` | `#ebfaf4` |
| primary-99 | `--primary-99` | `#f6fffb` |
| primary-100 | `--primary-100` | `#ffffff` |

### 3.2 Secondary Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| secondary-0 | `--secondary-0` | `#0e1c34` |
| secondary-10 | `--secondary-10` | `#142748` |
| secondary-20 | `--secondary-20` | `#1f3c70` |
| secondary-30 | `--secondary-30` | `#274b8c` |
| **secondary-40-main** ⭐ | `--secondary-40-main` | `#325fb4` |
| secondary-50 | `--secondary-50` | `#396bc8` |
| secondary-60 | `--secondary-60` | `#5f88d3` |
| secondary-70 | `--secondary-70` | `#87a5de` |
| secondary-80 | `--secondary-80` | `#c3d2ee` |
| secondary-90 | `--secondary-90` | `#dfe7f6` |
| secondary-95 | `--secondary-95` | `#eff3fa` |
| secondary-99 | `--secondary-99` | `#f7f9fd` |
| secondary-100 | `--secondary-100` | `#ffffff` |

### 3.3 Neutral Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| neutral-0 | `--neutral-0` | `#000000` |
| neutral-5 | `--neutral-5` | `#0b0b0c` |
| neutral-10 | `--neutral-10` | `#151618` |
| neutral-15 | `--neutral-15` | `#1d1f21` |
| neutral-20 | `--neutral-20` | `#25272a` |
| neutral-25 | `--neutral-25` | `#2a2d31` |
| neutral-30 | `--neutral-30` | `#2f3337` |
| neutral-40 | `--neutral-40` | `#373c41` |
| neutral-50 | `--neutral-50` | `#3d4349` |
| neutral-60 | `--neutral-60` | `#62676c` |
| neutral-70 | `--neutral-70` | `#8b9094` |
| neutral-80 | `--neutral-80` | `#b4b8bb` |
| neutral-90 | `--neutral-90` | `#dde0e2` |
| neutral-92 | `--neutral-92` | `#e4e6e8` |
| neutral-94 | `--neutral-94` | `#ebecee` |
| neutral-96 | `--neutral-96` | `#f1f3f3` |
| neutral-98 | `--neutral-98` | `#f8f9f9` |
| neutral-100 | `--neutral-100` | `#ffffff` |

### 3.4 Danger / Negative Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| danger-0 | `--danger-0` | `#55160c` |
| danger-10 | `--danger-10` | `#7a271a` |
| danger-20 | `--danger-20` | `#912018` |
| danger-30 | `--danger-30` | `#b42318` |
| **danger-40** ⭐ | `--danger-40` | `#d92d20` |
| danger-50 | `--danger-50` | `#f04438` |
| danger-60 | `--danger-60` | `#f97066` |
| danger-70 | `--danger-70` | `#fda29b` |
| danger-80 | `--danger-80` | `#fecdca` |
| danger-90 | `--danger-90` | `#fee4e2` |
| danger-95 | `--danger-95` | `#fef3f2` |
| danger-99 | `--danger-99` | `#fffbfa` |
| danger-100 | `--danger-100` | `#ffffff` |

### 3.5 Positive / Success Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| positive-0 | `--positive-0` | `#053321` |
| positive-10 | `--positive-10` | `#074d31` |
| positive-20 | `--positive-20` | `#085d3a` |
| positive-30 | `--positive-30` | `#067647` |
| positive-40 | `--positive-40` | `#079455` |
| **positive-50** ⭐ | `--positive-50` | `#17b26a` |
| positive-60 | `--positive-60` | `#47cd89` |
| positive-70 | `--positive-70` | `#75e0a7` |
| positive-80 | `--positive-80` | `#a9efc5` |
| positive-90 | `--positive-90` | `#dcfae6` |
| positive-95 | `--positive-95` | `#ecfdf3` |
| positive-99 | `--positive-99` | `#f6fef9` |
| positive-100 | `--positive-100` | `#ffffff` |

### 3.6 Warning Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| warning-0 | `--warning-0` | `#4e1d09` |
| warning-10 | `--warning-10` | `#7a2e0e` |
| warning-20 | `--warning-20` | `#93370d` |
| warning-30 | `--warning-30` | `#b54708` |
| warning-40 | `--warning-40` | `#dc6803` |
| warning-50 | `--warning-50` | `#f79009` |
| **warning-60** ⭐ | `--warning-60` | `#fdb022` |
| warning-70 | `--warning-70` | `#fec84b` |
| warning-80 | `--warning-80` | `#fedf89` |
| warning-90 | `--warning-90` | `#fef0c7` |
| warning-95 | `--warning-95` | `#fffaeb` |
| warning-99 | `--warning-99` | `#fffcf5` |
| warning-100 | `--warning-100` | `#ffffff` |

### 3.7 Info Palette

| Token | CSS Variable | Hex Value |
|---|---|---|
| info-0 | `--info-0` | `#062c41` |
| info-10 | `--info-10` | `#0b4a6f` |
| info-20 | `--info-20` | `#003c66` |
| info-30 | `--info-30` | `#026aa2` |
| info-40 | `--info-40` | `#0086c9` |
| **info-50** ⭐ | `--info-50` | `#0ba5ec` |
| info-60 | `--info-60` | `#36bffa` |
| info-70 | `--info-70` | `#7cd4fd` |
| info-80 | `--info-80` | `#b9e6fe` |
| info-90 | `--info-90` | `#addfff` |
| info-95 | `--info-95` | `#f0f9ff` |
| info-99 | `--info-99` | `#f5fbff` |
| info-100 | `--info-100` | `#ffffff` |

### 3.8 Alpha / Overlay Palette

| Token | CSS Variable | Value |
|---|---|---|
| dark-a05 | `--a-dark-a05` | `#1516180d` |
| dark-a10 | `--a-dark-a10` | `#1516181a` |
| dark-a20 | `--a-dark-a20` | `#15161833` |
| dark-a40 | `--a-dark-a40` | `#15161866` |
| dark-a60 | `--a-dark-a60` | `#15161899` |
| dark-a80 | `--a-dark-a80` | `#303030cc` |
| light-a05 | `--a-light-a05` | `#ffffff0d` |
| light-a10 | `--a-light-a10` | `#ffffff1a` |
| light-a20 | `--a-light-a20` | `#ffffff33` |
| light-a40 | `--a-light-a40` | `#ffffff66` |
| light-a60 | `--a-light-a60` | `#ffffff99` |
| light-a80 | `--a-light-a80` | `#ffffffcc` |
| light-transparent | `--a-light-transparent` | `#ffffff00` |
| primary-a05 | `--a-primary-a05` | `#00b2740d` |
| primary-a10 | `--a-primary-a10` | `#00b2741a` |
| primary-a20 | `--a-primary-a20` | `#00b27433` |
| primary-a40 | `--a-primary-a40` | `#00b27466` |
| primary-a60 | `--a-primary-a60` | `#00b27499` |
| primary-a80 | `--a-primary-a80` | `#00b274cc` |
| negative-a05 | `--a-negative-a05` | `#f044380d` |
| negative-a10 | `--a-negative-a10` | `#f044381a` |
| negative-a20 | `--a-negative-a20` | `#f0443833` |
| negative-a40 | `--a-negative-a40` | `#f0443866` |
| negative-a60 | `--a-negative-a60` | `#f0443899` |
| negative-a80 | `--a-negative-a80` | `#f04438cc` |
| positive-a05 | `--a-positive-a05` | `#17b26a0d` |
| positive-a10 | `--a-positive-a10` | `#17b26a1a` |
| positive-a20 | `--a-positive-a20` | `#17b26a33` |
| positive-a40 | `--a-positive-a40` | `#17b26a66` |
| positive-a60 | `--a-positive-a60` | `#17b26a99` |
| positive-a80 | `--a-positive-a80` | `#12b76acc` *(base differs from a05–a60 — as defined in source)* |
| secondary-a05 | `--a-secondary-a05` | `#00669b0d` |
| secondary-a10 | `--a-secondary-a10` | `#00669b1a` |
| secondary-a20 | `--a-secondary-a20` | `#00669b33` |
| secondary-a40 | `--a-secondary-a40` | `#00669b66` |
| secondary-a60 | `--a-secondary-a60` | `#00669b99` |
| secondary-a80 | `--a-secondary-a80` | `#00669bcc` |
| warning-a05 | `--a-warning-a05` | `#fdb0220d` |
| warning-a10 | `--a-warning-a10` | `#fdb0221a` |
| warning-a20 | `--a-warning-a20` | `#fdb02233` |
| warning-a40 | `--a-warning-a40` | `#fdb02266` |
| warning-a60 | `--a-warning-a60` | `#fdb02299` |
| warning-a80 | `--a-warning-a80` | `#fdb022cc` |

### 3.9 Semantic Color Roles

Access pattern: `text-[var(--foreground-neutral-default)]` or `bg-[var(--background-primary-lighter)]`

#### Background Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--background-fixed-neutral-a-medium` | `--a-dark-a60` | `#15161899` | Fixed neutral overlay (dark semi-transparent) |
| `--background-fixed-primary-dark` | `--primary-20` | `#006643` | Fixed primary dark bg |
| `--background-fixed-primary-medium` | `--primary-50` | `#34c57e` | Fixed primary medium bg |
| `--background-primary-dark` | `--primary-30-base` | `#008858` | Primary dark bg |
| `--background-primary-darker` | `--primary-20` | `#006643` | Darker primary bg |
| `--background-primary-medium` | `--primary-40` | `#00b274` | Medium primary bg |
| `--background-primary-light` | `--primary-90` | `#adebd2` | Light primary bg |
| `--background-primary-lighter` | `--primary-95` | `#ebfaf4` | Lightest primary bg |
| `--background-secondary-dark` | `--secondary-30` | `#274b8c` | Secondary dark bg |
| `--background-secondary-darker` | `--secondary-20` | `#1f3c70` | Darker secondary bg |
| `--background-secondary-medium` | `--secondary-40-main` | `#325fb4` | Medium secondary bg |
| `--background-secondary-light` | `--secondary-90` | `#dfe7f6` | Light secondary bg |
| `--background-secondary-lighter` | `--secondary-95` | `#eff3fa` | Lightest secondary bg |
| `--background-neutral-lighter` | `--neutral-100` | `#ffffff` | White bg |
| `--background-neutral-light` | `--neutral-98` | `#f8f9f9` | Near-white bg |
| `--background-neutral-medium` | `--neutral-96` | `#f1f3f3` | Medium neutral bg |
| `--background-neutral-dark` | `--neutral-94` | `#ebecee` | Dark neutral bg |
| `--background-neutral-darkest` | `--neutral-92` | `#e4e6e8` | Darkest neutral bg |
| `--background-neutral-a-subtle` | `--a-dark-a05` | `#1516180d` | Very subtle dark overlay bg |
| `--background-neutral-transparent` | `--a-light-transparent` | `#ffffff00` | Fully transparent white bg |
| `--background-neutral-revert-dark` | `--neutral-15` | `#1d1f21` | Revert dark neutral bg (on dark surfaces) |
| `--background-neutral-revert-darkest` | `--neutral-10` | `#151618` | Revert darkest neutral bg |
| `--background-neutral-revert-light` | `--neutral-25` | `#2a2d31` | Revert light neutral bg |
| `--background-neutral-revert-lighter` | `--neutral-30` | `#2f3337` | Revert lighter neutral bg |
| `--background-neutral-revert-medium` | `--neutral-20` | `#25272a` | Revert medium neutral bg |
| `--background-neutral-revert-transparent` | `--a-light-transparent` | `#ffffff00` | Revert transparent bg |
| `--background-negative-dark` | `--danger-20` | `#912018` | Error/danger dark bg |
| `--background-negative-darker` | `--danger-10` | `#7a271a` | Error/danger darker bg |
| `--background-negative-medium` | `--danger-50` | `#f04438` | Error medium bg |
| `--background-negative-light` | `--danger-95` | `#fef3f2` | Error light bg |
| `--background-negative-lighter` | `--danger-99` | `#fffbfa` | Error lightest bg |
| `--background-positive-dark` | `--positive-20` | `#085d3a` | Success dark bg |
| `--background-positive-darker` | `--positive-10` | `#074d31` | Success darker bg |
| `--background-positive-medium` | `--positive-50` | `#17b26a` | Success medium bg |
| `--background-positive-light` | `--positive-95` | `#ecfdf3` | Success light bg |
| `--background-positive-lighter` | `--positive-99` | `#f6fef9` | Success lightest bg |
| `--background-warning-dark` | `--warning-20` | `#93370d` | Warning dark bg |
| `--background-warning-darker` | `--warning-10` | `#7a2e0e` | Warning darker bg |
| `--background-warning-medium` | `--warning-50` | `#f79009` | Warning medium bg |
| `--background-warning-light` | `--warning-95` | `#fffaeb` | Warning light bg |
| `--background-warning-lighter` | `--warning-99` | `#fffcf5` | Warning lightest bg |
| `--background-info-dark` | `--info-30` | `#026aa2` | Info dark bg |
| `--background-info-darker` | `--info-10` | `#0b4a6f` | Info darker bg |
| `--background-info-medium` | `--info-50` | `#0ba5ec` | Info medium bg |
| `--background-info-light` | `--info-95` | `#f0f9ff` | Info light bg |
| `--background-info-lighter` | `--info-99` | `#f5fbff` | Info lightest bg |

#### Foreground Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--foreground-fixed-brand-primary` | `--primary-40` | `#00b274` | Fixed brand primary text (on dark surfaces) |
| `--foreground-fixed-brand-secondary` | `--secondary-50` | `#396bc8` | Fixed brand secondary text (on dark surfaces) |
| `--foreground-fixed-neutral-base` | `--neutral-98` | `#f8f9f9` | Fixed neutral base text (on dark surfaces) |
| `--foreground-fixed-neutral-dark` | `--neutral-90` | `#dde0e2` | Fixed neutral dark text (on dark surfaces) |
| `--foreground-fixed-neutral-darker` | `--neutral-80` | `#b4b8bb` | Fixed neutral darker text (on dark surfaces) |
| `--foreground-neutral-default` | `--neutral-20` | `#25272a` | Primary text |
| `--foreground-neutral-light` | `--neutral-40` | `#373c41` | Secondary text |
| `--foreground-neutral-lighter` | `--neutral-60` | `#62676c` | Tertiary/hint text |
| `--foreground-neutral-lightest` | `--neutral-80` | `#b4b8bb` | Disabled text |
| `--foreground-neutral-revert-default` | `--neutral-98` | `#f8f9f9` | Revert neutral text (on dark surfaces) |
| `--foreground-neutral-revert-dark` | `--neutral-90` | `#dde0e2` | Revert neutral dark text |
| `--foreground-neutral-revert-darker` | `--neutral-80` | `#b4b8bb` | Revert neutral darker text |
| `--foreground-neutral-revert-lightest` | `--neutral-70` | `#8b9094` | Revert neutral lightest text |
| `--foreground-primary-default` | `--primary-30-base` | `#008858` | Primary brand text |
| `--foreground-primary-dark` | `--primary-20` | `#006643` | Dark primary text |
| `--foreground-primary-light` | `--primary-60` | `#5ed49a` | Light primary text |
| `--foreground-primary-lightest` | `--primary-80` | `#8de3b8` | Lightest primary text |
| `--foreground-primary-revert-default` | `--primary-100` | `#ffffff` | Revert primary text |
| `--foreground-primary-revert-dark` | `--primary-80` | `#8de3b8` | Revert primary dark text |
| `--foreground-primary-revert-lightest` | `--primary-60` | `#5ed49a` | Revert primary lightest text |
| `--foreground-negative-default` | `--danger-40` | `#d92d20` | Error/danger text |
| `--foreground-negative-dark` | `--danger-20` | `#912018` | Dark error text |
| `--foreground-negative-light` | `--danger-60` | `#f97066` | Light error text |
| `--foreground-negative-lightest` | `--danger-80` | `#fecdca` | Lightest error text |
| `--foreground-negative-revert-default` | `--danger-100` | `#ffffff` | Revert error text |
| `--foreground-negative-revert-dark` | `--danger-80` | `#fecdca` | Revert error dark text |
| `--foreground-negative-revert-lightest` | `--danger-60` | `#f97066` | Revert error lightest text |
| `--foreground-positive-default` | `--positive-40` | `#079455` | Success text |
| `--foreground-positive-dark` | `--positive-20` | `#085d3a` | Dark success text |
| `--foreground-positive-light` | `--positive-60` | `#47cd89` | Light success text |
| `--foreground-positive-lightest` | `--positive-80` | `#a9efc5` | Lightest success text |
| `--foreground-positive-revert-default` | `--positive-100` | `#ffffff` | Revert success text |
| `--foreground-positive-revert-dark` | `--positive-80` | `#a9efc5` | Revert success dark text |
| `--foreground-positive-revert-darker` | `--positive-60` | `#47cd89` | Revert success darker text |
| `--foreground-warning-default` | `--warning-40` | `#dc6803` | Warning text |
| `--foreground-warning-dark` | `--warning-20` | `#93370d` | Dark warning text |
| `--foreground-warning-light` | `--warning-60` | `#fdb022` | Light warning text |
| `--foreground-warning-lighter` | `--warning-80` | `#fedf89` | Lighter warning text |
| `--foreground-warning-revert-default` | `--warning-100` | `#ffffff` | Revert warning text |
| `--foreground-warning-revert-dark` | `--warning-80` | `#fedf89` | Revert warning dark text |
| `--foreground-warning-revert-lightest` | `--warning-60` | `#fdb022` | Revert warning lightest text |
| `--foreground-info-default` | `--info-50` | `#0ba5ec` | Info text |
| `--foreground-info-dark` | `--info-20` | `#003c66` | Dark info text |
| `--foreground-info-light` | `--info-90` | `#addfff` | Light info text |
| `--foreground-info-lightest` | `--info-95` | `#f0f9ff` | Lightest info text |
| `--foreground-secondary-default` | `--secondary-40-main` | `#325fb4` | Secondary brand text |
| `--foreground-secondary-dark` | `--secondary-30` | `#274b8c` | Dark secondary text |
| `--foreground-secondary-light` | `--secondary-60` | `#5f88d3` | Light secondary text |
| `--foreground-secondary-lightest` | `--secondary-80` | `#c3d2ee` | Lightest secondary text |
| `--foreground-secondary-revert-default` | `--secondary-100` | `#ffffff` | Revert secondary text |
| `--foreground-secondary-revert-dark` | `--secondary-80` | `#c3d2ee` | Revert secondary dark text |
| `--foreground-secondary-revert-lightest` | `--secondary-60` | `#5f88d3` | Revert secondary lightest text |

#### Stroke / Border Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--stroke-fixed-black` | `--neutral-0` | `#000000` | Fixed black border (always black regardless of theme) |
| `--stroke-fixed-white` | `--neutral-100` | `#ffffff` | Fixed white border (always white regardless of theme) |
| `--stroke-neutral-default` | `--neutral-90` | `#dde0e2` | Default border |
| `--stroke-neutral-lighter` | `--neutral-94` | `#ebecee` | Light border |
| `--stroke-neutral-lightest` | `--neutral-96` | `#f1f3f3` | Lightest border |
| `--stroke-primary-default` | `--primary-30-base` | `#008858` | Primary border |
| `--stroke-primary-lighter` | `--primary-60` | `#5ed49a` | Light primary border |
| `--stroke-primary-lightest` | `--primary-80` | `#8de3b8` | Lightest primary border |
| `--stroke-secondary-default` | `--secondary-60` | `#5f88d3` | Secondary border |
| `--stroke-secondary-lighter` | `--secondary-80` | `#c3d2ee` | Light secondary border |
| `--stroke-secondary-lightest` | `--secondary-90` | `#dfe7f6` | Lightest secondary border |

#### Button Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--button-background-primary-solid` | `--primary-30-base` | `#008858` | Primary button bg |
| `--button-background-primary-solid-revert` | `--primary-90` | `#adebd2` | Primary button bg (on dark surfaces) |
| `--button-background-primary-subtle` | `--primary-95` | `#ebfaf4` | Primary subtle button bg |
| `--button-background-primary-subtle-revert` | `--primary-10` | `#003d28` | Primary subtle button bg (revert) |
| `--button-background-primary-selected` | `--primary-95` | `#ebfaf4` | Primary selected button bg |
| `--button-foreground-primary-on-solid` | `--primary-100` | `#ffffff` | Text on primary button |
| `--button-foreground-primary-on-subtle` | `--primary-20` | `#006643` | Text on primary subtle button |
| `--button-foreground-primary-on-transparent` | `--primary-20` | `#006643` | Outline button text |
| `--button-foreground-primary-on-revert` | `--primary-10` | `#003d28` | Text on primary revert button |
| `--button-foreground-primary-on-revert-alt` | `--primary-80` | `#8de3b8` | Alt text on primary revert button |
| `--button-foreground-primary-selected` | `--primary-20` | `#006643` | Primary selected text |
| `--button-background-negative-solid` | `--danger-40` | `#d92d20` | Destructive button bg |
| `--button-background-negative-solid-revert` | `--danger-90` | `#fee4e2` | Destructive button bg (revert) |
| `--button-background-negative-subtle` | `--danger-95` | `#fef3f2` | Destructive subtle button bg |
| `--button-background-negative-subtle-revert` | `--danger-10` | `#7a271a` | Destructive subtle button bg (revert) |
| `--button-foreground-negative-on-solid` | `--danger-100` | `#ffffff` | Text on destructive button |
| `--button-foreground-negative-on-subtle` | `--danger-30` | `#b42318` | Text on destructive subtle button |
| `--button-foreground-negative-on-transparent` | `--danger-40` | `#d92d20` | Transparent destructive button text |
| `--button-foreground-negative-on-revert` | `--danger-30` | `#b42318` | Text on destructive revert button |
| `--button-foreground-negative-on-revert-alt` | `--danger-80` | `#fecdca` | Alt text on destructive revert button |
| `--button-background-secondary-solid` | `--secondary-40-main` | `#325fb4` | Secondary solid button bg |
| `--button-background-secondary-solid-revert` | `--secondary-90` | `#dfe7f6` | Secondary solid button bg (revert) |
| `--button-background-secondary-subtle` | `--secondary-90` | `#dfe7f6` | Secondary button bg |
| `--button-background-secondary-subtle-revert` | `--secondary-10` | `#142748` | Secondary subtle button bg (revert) |
| `--button-foreground-secondary-on-solid` | `--secondary-100` | `#ffffff` | Text on secondary solid button |
| `--button-foreground-secondary-on-subtle` | `--secondary-40-main` | `#325fb4` | Secondary button text |
| `--button-foreground-secondary-on-transparent` | `--secondary-40-main` | `#325fb4` | Transparent secondary button text |
| `--button-foreground-secondary-on-revert` | `--secondary-30` | `#274b8c` | Text on secondary revert button |
| `--button-foreground-secondary-on-revert-alt` | `--secondary-80` | `#c3d2ee` | Alt text on secondary revert button |
| `--button-background-neutral-solid` | `--neutral-30` | `#2f3337` | Neutral solid button bg |
| `--button-background-neutral-solid-revert` | `--neutral-100` | `#ffffff` | Neutral solid button bg (revert) |
| `--button-background-neutral-subtle` | `--neutral-96` | `#f1f3f3` | Neutral subtle button bg |
| `--button-background-neutral-subtle-revert` | `--neutral-25` | `#2a2d31` | Neutral subtle button bg (revert) |
| `--button-background-neutral-unselected` | `--neutral-96` | `#f1f3f3` | Neutral unselected button bg |
| `--button-foreground-neutral-fixed` | `--neutral-40` | `#373c41` | Tertiary outline text |
| `--button-foreground-neutral-fixed-revert` | `--neutral-98` | `#f8f9f9` | Tertiary outline text (revert) |
| `--button-foreground-neutral-on-solid` | `--neutral-98` | `#f8f9f9` | Text on neutral solid button |
| `--button-foreground-neutral-on-subtle` | `--neutral-40` | `#373c41` | Text on neutral subtle button |
| `--button-foreground-neutral-on-transparent` | `--neutral-40` | `#373c41` | Transparent neutral button text |
| `--button-foreground-neutral-on-revert` | `--neutral-40` | `#373c41` | Text on neutral revert button |
| `--button-foreground-neutral-on-revert-alt` | `--neutral-98` | `#f8f9f9` | Alt text on neutral revert button |
| `--button-background-disabled` | `--neutral-94` | `#ebecee` | Disabled button bg |
| `--button-foreground-disabled` | `--neutral-80` | `#b4b8bb` | Disabled button text |
| `--button-background-fixed-solid` | `--neutral-100` | `#ffffff` | White button bg |
| `--button-background-fixed-solid-revert` | `--neutral-30` | `#2f3337` | White button bg (revert) |
| `--button-background-fixed-subtle` | `--a-light-a20` | `#ffffff33` | Fixed subtle button bg (translucent white) |
| `--button-background-fixed-subtle-revert` | `--a-dark-a20` | `#15161833` | Fixed subtle button bg (revert, translucent dark) |
| `--button-stroke-primary` | `--primary-20` | `#006643` | Outline button border |
| `--button-stroke-secondary` | `--secondary-40-main` | `#325fb4` | Secondary outline border |
| `--button-stroke-negative` | `--danger-40` | `#d92d20` | Destructive outline border |
| `--button-stroke-fixed` | `--neutral-90` | `#dde0e2` | Tertiary outline border |
| `--button-stroke-fixed-revert` | `--neutral-98` | `#f8f9f9` | Tertiary outline border (revert) |
| `--button-stroke-revert` | `--neutral-98` | `#f8f9f9` | Revert outline border |
| `--button-stroke-disabled` | `--neutral-94` | `#ebecee` | Disabled button border |
| `--button-stroke-nuetral` ⚠️ | `--neutral-90` | `#dde0e2` | Neutral outline border *(note: "nuetral" is a typo in source CSS — do not "fix" this name)* |
| `--button-foreground-informative-on-subtle` | *(hardcoded)* | `#002a41` | Informative subtle button text |
| `--button-foreground-success-on-subtle` | `--positive-20` | `#085d3a` | Success subtle button text |
| `--button-foreground-warning-on-subtle` | `--warning-20` | `#93370d` | Warning subtle button text |

#### Badge Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--badge-stroke` | `--neutral-96` | `#f1f3f3` | Badge border |
| `--badge-background-default` | `--danger-40` | `#d92d20` | Default (destructive) badge bg |
| `--badge-background-primary` | `--primary-40` | `#00b274` | Primary badge bg |
| `--badge-background-secondary` | `--secondary-40-main` | `#325fb4` | Secondary badge bg |
| `--badge-foreground-default` | `--danger-100` | `#ffffff` | Default badge text |
| `--badge-foreground-primary` | `--danger-100` | `#ffffff` | Primary badge text *(uses --danger-100 in source — white)* |
| `--badge-foreground-secondary` | `--danger-100` | `#ffffff` | Secondary badge text *(uses --danger-100 in source — white)* |

#### Canvas Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--canvas-white` | `--neutral-100` | `#ffffff` | Pure white surface |
| `--canvas-bright` | `--neutral-98` | `#f8f9f9` | Bright surface |
| `--canvas-default` | `--neutral-98` | `#f8f9f9` | Default page bg |
| `--canvas-dim` | `--neutral-90` | `#dde0e2` | Dimmed surface |
| `--canvas-overlay` | `--a-dark-a60` | `#15161899` | Modal overlay |

#### Input Tokens

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--input-background-default` | `--neutral-100` | `#ffffff` | Input bg |
| `--input-background-focused` | `--primary-100` | `#ffffff` | Focused input bg |
| `--input-background-error-focused` | `--danger-95` | `#fef3f2` | Error input bg |
| `--input-background-disabled` | `--neutral-94` | `#ebecee` | Disabled input bg |
| `--input-input-default` | `--neutral-10` | `#151618` | Input text color |
| `--input-input-placeholder` | `--neutral-70` | `#8b9094` | Placeholder text |
| `--input-label-default` | `--neutral-25` | `#2a2d31` | Input label |
| `--input-label-focused` | `--primary-30-base` | `#008858` | Focused label |
| `--input-label-error` | `--danger-40` | `#d92d20` | Error label |
| `--input-stroke-default` | `--neutral-90` | `#dde0e2` | Input border |
| `--input-stroke-focused` | `--primary-30-base` | `#008858` | Focused input border |
| `--input-stroke-error` | `--danger-40` | `#d92d20` | Error input border |

#### Controller Tokens

Used for checkbox, switch, and radio button components.

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--controller-background-unselected` | `--neutral-98` | `#f8f9f9` | Unselected controller bg |
| `--controller-background-selected` | `--primary-30-base` | `#008858` | Selected controller bg |
| `--controller-background-selected-alt` | `--primary-95` | `#ebfaf4` | Selected controller bg (alt/subtle) |
| `--controller-background-disabled` | `--neutral-94` | `#ebecee` | Disabled controller bg |
| `--controller-background-error` | *(hardcoded)* | `#ffffff` | Error controller bg |
| `--controller-foreground-unselected` | `--neutral-50` | `#3d4349` | Unselected controller icon/indicator |
| `--controller-foreground-selected` | `--neutral-98` | `#f8f9f9` | Selected controller icon/indicator |
| `--controller-foreground-selected-alt` | `--primary-30-base` | `#008858` | Selected controller icon (alt) |
| `--controller-foreground-disabled` | `--neutral-80` | `#b4b8bb` | Disabled controller icon |
| `--controller-stroke-unselected` | `--neutral-90` | `#dde0e2` | Unselected controller border |
| `--controller-stroke-selected` | `--primary-40` | `#00b274` | Selected controller border |
| `--controller-stroke-default` | `--neutral-80` | `#b4b8bb` | Default controller border |
| `--controller-stroke-disabled` | `--neutral-94` | `#ebecee` | Disabled controller border |
| `--controller-stroke-error` | *(hardcoded)* | `#ffffff` | Error controller border |

#### Navigation Tokens

Used for sidebar and navigation bar components.

| CSS Variable | Resolves To | Hex | Usage |
|---|---|---|---|
| `--navigation-background-default` | `--neutral-100` | `#ffffff` | Navigation bg |
| `--navigation-background-selected` | `--primary-30-base` | `#008858` | Active nav item bg |
| `--navigation-background-selected-subtle` | `--primary-95` | `#ebfaf4` | Active nav item bg (subtle) |
| `--navigation-foreground-default` | `--neutral-60` | `#62676c` | Inactive nav item text/icon |
| `--navigation-foreground-selected` | `--primary-30-base` | `#008858` | Active nav item text/icon |
| `--navigation-foreground-selected-alt` | `--primary-100` | `#ffffff` | Active nav item text (on solid bg) |
| `--navigation-stroke-default` | `--neutral-90` | `#dde0e2` | Navigation border |
| `--navigation-stroke-selected` | `--primary-30-base` | `#008858` | Active nav item indicator |

#### State Tokens

Used for hover and press states.

| CSS Variable | Resolves To | Value | Usage |
|---|---|---|---|
| `--state-neutral-light` | `--a-dark-a05` | `#1516180d` | Neutral hover state overlay |
| `--state-neutral-dark` | `--a-dark-a10` | `#1516181a` | Neutral pressed state overlay |
| `--state-primary-light` | `--a-primary-a05` | `#00b2740d` | Primary hover state overlay |
| `--state-primary-dark` | `--a-primary-a10` | `#00b2741a` | Primary pressed state overlay |

#### System Nav Tokens

Used for system navigation bars (e.g., sticky header backdrop).

| CSS Variable | Resolves To | Value | Usage |
|---|---|---|---|
| `--system-nav` | `--a-dark-a60` | `#15161899` | System nav overlay (semi-transparent dark) |
| `--system-nav-darker` | `--a-dark-a80` | `#303030cc` | System nav overlay darker variant |
| `--system-nav-fixed` | `--a-light-a60` | `#ffffff99` | System nav overlay (fixed, semi-transparent light) |
| `--system-nav-fixed-darker` | `--a-light-a80` | `#ffffffcc` | System nav overlay (fixed, darker variant) |

#### Utility Token

| CSS Variable | Value | Usage |
|---|---|---|
| `--color` | `#ffffff` | General white color utility (defined in `:root`, used for various white text/icon contexts) |

---

### 3.10 shadcn/ui Theme Variables

These variables are defined in the `:root` block at the top of `globals.css` (lines 56–102) and are used internally by **shadcn/ui** component primitives. They form a separate "theme layer" from the design system semantic tokens above.

> **Two-layer system**: shadcn/ui components consume the `--background`, `--primary`, `--border`, etc. variables automatically. Custom code should prefer the **semantic design tokens** (e.g., `--background-primary-lighter`, `--stroke-neutral-default`) over these shadcn variables, unless directly styling shadcn components.

| Variable | Value | Notes |
|---|---|---|
| `--radius` | `0.65rem` | Base radius used by `@theme inline` calc() for Tailwind's `rounded-sm/md/lg/xl` |
| `--background` | `#ffffff` | shadcn page background base |
| `--foreground` | `#000000` | shadcn page foreground base |
| `--card` | `#ffffff` | shadcn card background |
| `--card-foreground` | `#000000` | shadcn card foreground |
| `--popover` | `#ffffff` | shadcn popover background — used by Toast normal/loading |
| `--popover-foreground` | `#000000` | shadcn popover foreground — used by Toast normal |
| `--primary` | `#008858` | shadcn primary — maps to `--primary-30-base` |
| `--primary-foreground` | `#ffffff` | shadcn primary foreground |
| `--secondary` | `#E0F2FE` | shadcn secondary ⚠️ **Different from `--secondary-*` palette** (which is blue) |
| `--secondary-foreground` | `#ffffff` | shadcn secondary foreground |
| `--tertiary` | `#F1F3F3` | shadcn tertiary — maps to `--neutral-96` |
| `--tertiary-foreground` | `#373C41` | shadcn tertiary foreground — maps to `--neutral-40` |
| `--muted` | `#f5f5f5` | shadcn muted background |
| `--muted-foreground` | `#6b7280` | shadcn muted foreground |
| `--accent` | `#F1F3F3` | shadcn accent — maps to `--neutral-96` |
| `--accent-foreground` | `#373C41` | shadcn accent foreground — maps to `--neutral-40` |
| `--destructive` | `#dc2626` | shadcn destructive ⚠️ **Different from `--danger-40` (`#d92d20`)** |
| `--border` | `#e5e7eb` | shadcn border ⚠️ **Different from `--stroke-neutral-default` (`#dde0e2`)** |
| `--input` | `#e5e7eb` | shadcn input border ⚠️ **Different from `--stroke-neutral-default` (`#dde0e2`)** |
| `--ring` | `transparent` | shadcn focus ring |
| `--chart-1` | `#00B274` | Chart color 1 |
| `--chart-2` | `#DF1278` | Chart color 2 |
| `--chart-3` | `#3b82f6` | Chart color 3 |
| `--chart-4` | `#f59e0b` | Chart color 4 |
| `--chart-5` | `#8b5cf6` | Chart color 5 |
| `--sidebar` | `#ffffff` | Sidebar background |
| `--sidebar-foreground` | `#000000` | Sidebar text |
| `--sidebar-primary` | `#00B274` | Sidebar primary accent |
| `--sidebar-primary-foreground` | `#ffffff` | Sidebar primary text |
| `--sidebar-accent` | `#e8f9f3` | Sidebar active item bg |
| `--sidebar-accent-foreground` | `#006644` | Sidebar active item text |
| `--sidebar-border` | `#e5e7eb` | Sidebar border |
| `--sidebar-ring` | `#00b274` | Sidebar focus ring |

> ⚠️ **Known inconsistencies in the shadcn theme layer:**
> - `--destructive` (`#dc2626`) differs from `--danger-40` (`#d92d20`) — use `--button-background-negative-solid` for design-system-compliant destructive actions
> - `--border` / `--input` (`#e5e7eb`) differs from `--stroke-neutral-default` (`#dde0e2`) — use `--stroke-neutral-default` in custom code
> - `--secondary` (shadcn, `#E0F2FE`) differs from the `--secondary-*` palette (blue tones) — use `--background-secondary-*` tokens in custom code

---

## 4. Typography Rules

### 4.1 Font Setup

```typescript
// src/app/[locale]/layout.tsx
import { Anuphan } from "next/font/google";

const AnuphanThai = Anuphan({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["thai"],
  display: "swap",
});

// Applied to <html> element
<html lang={locale} className={AnuphanThai.className}>
```

### 4.2 Type Scale

All font tokens are defined in `src/app/[locale]/globals.css`.

Access pattern:
- Size: `text-[length:var(--font-size-body-l)]`
- Line-height: `leading-[var(--line-height-body-l)]`

| Scale | CSS Variable (size) | Size | CSS Variable (line-height) | Line Height |
|---|---|---|---|---|
| label-s | `--font-size-label-s` | 11px | `--line-height-label-s` | 16px |
| body-s | `--font-size-body-s` | 12px | `--line-height-body-s` | 16px |
| label-m | `--font-size-label-m` | 12px | `--line-height-label-m` | 18px |
| title-s | `--font-size-title-s` | 14px | `--line-height-title-s` | 20px |
| body-m | `--font-size-body-m` | 14px | `--line-height-body-m` | 20px |
| label-l | `--font-size-label-l` | 14px | `--line-height-label-l` | 21px |
| title-m | `--font-size-title-m` | 16px | `--line-height-title-m` | 24px |
| body-l | `--font-size-body-l` | 16px | `--line-height-body-l` | 24px |
| label-xl | `--font-size-label-xl` | 16px | `--line-height-label-xl` | 24px |
| title-l | `--font-size-title-l` | 18px | `--line-height-title-l` | 26px |
| headline-s | `--font-size-headline-s` | 24px | `--line-height-headline-s` | 32px |
| headline-m | `--font-size-headline-m` | 28px | `--line-height-headline-m` | 36px |
| headline-l | `--font-size-headline-l` | 32px | `--line-height-headline-l` | 40px |
| display-s | `--font-size-display-s` | 36px | `--line-height-display-s` | 44px |
| display-m | `--font-size-display-m` | 46px | `--line-height-display-m` | 52px |
| display-l | `--font-size-display-l` | 57px | `--line-height-display-l` | 64px |

### 4.3 Font Weights

| CSS Variable | Value |
|---|---|
| `--font-weight-100` | 100 |
| `--font-weight-200` | 200 |
| `--font-weight-300` | 300 |
| `--font-weight-400` | 400 |
| `--font-weight-500` | 500 |
| `--font-weight-600` | 600 |
| `--font-weight-700` | 700 |
| `--font-weight-800` | 800 |
| `--font-weight-900` | 900 |
| `--font-weight-950` | 950 |
| `--font-weight-1000` | 1000 |

### 4.4 Typography Components

Defined in `src/components/ui/typography.tsx`.

| Component | Element | Mobile Size | Desktop (lg:) | Color Token | Font Weight |
|---|---|---|---|---|---|
| `TypographyHeader` | `<h1>` | headline-s (24px) | display-s (36px) | `--foreground-neutral-default` | semibold |
| `TypographySubHeader` | `<p>` | title-m (16px) | title-l (18px) | `--foreground-neutral-light` | normal |
| `TypographyTitle` | `<h2>` | title-m (16px) | title-l (18px) | `--foreground-neutral-default` | semibold |
| `TypographySubTitle` | `<p>` | body-m (14px) | body-l (16px) | `--foreground-neutral-light` | normal |
| `TypographyP` | `<p>` | label-l (14px) | — | `--foreground-neutral-light` | normal |
| `TypographyTitleP` | `<h2>` | label-l (14px) | — | `--foreground-neutral-default` | semibold |
| `TypographySubTitleP` | `<p>` | label-l (14px) | — | `--foreground-neutral-lighter` | normal |

#### Usage Examples

```tsx
import {
  TypographyHeader,
  TypographySubHeader,
  TypographyTitle,
  TypographySubTitle,
  TypographyP,
  TypographyTitleP,
  TypographySubTitleP,
} from "@/components/ui/typography";

// Page heading
<TypographyHeader>ยินดีต้อนรับ</TypographyHeader>

// Section title
<TypographyTitle>บริการออนไลน์</TypographyTitle>

// Body text
<TypographyP>รายละเอียดเพิ่มเติม</TypographyP>
```

---

## 5. Spacing Scale

All spacing tokens are defined in `src/app/[locale]/globals.css`.

Access patterns:
- CSS: `padding: var(--spacing-xl);`
- Tailwind: `p-[var(--spacing-xl)]` or `gap-[var(--spacing-md)]`

| Token | CSS Variable | Value |
|---|---|---|
| none | `--spacing-none` | 0px |
| xxs | `--spacing-xxs` | 2px |
| xs | `--spacing-xs` | 4px |
| sm | `--spacing-sm` | 6px |
| md | `--spacing-md` | 8px |
| lg | `--spacing-lg` | 12px |
| xl | `--spacing-xl` | 16px |
| 2xl | `--spacing-2xl` | 20px |
| 3xl | `--spacing-3xl` | 24px |
| 4xl | `--spacing-4xl` | 32px |
| 5xl | `--spacing-5xl` | 40px |
| 6xl | `--spacing-6xl` | 48px |
| 7xl | `--spacing-7xl` | 64px |
| 8xl | `--spacing-8xl` | 80px |
| 9xl | `--spacing-9xl` | 96px |
| 10xl | `--spacing-10xl` | 128px |
| 11xl | `--spacing-11xl` | 160px |

---

## 6. Border Radius Scale

All radius tokens are defined in `src/app/[locale]/globals.css`.

Access patterns:
- CSS: `border-radius: var(--radius-xl);`
- Tailwind: `rounded-[var(--radius-xl)]`

> ⚠️ **`@theme inline` radius note**: The `@theme inline` block (lines 41–44 of `globals.css`) also defines calculated radius values for Tailwind's built-in utility classes:
> - `rounded-sm` → `calc(var(--radius) - 4px)` ≈ 2.4px
> - `rounded-md` → `calc(var(--radius) - 2px)` ≈ 4.4px
> - `rounded-lg` → `var(--radius)` ≈ 10.4px
> - `rounded-xl` → `calc(var(--radius) + 4px)` ≈ 14.4px
>
> *(Approximations assume the default browser base font size of 16px. `--radius: 0.65rem` = 10.4px at 16px. Values will differ if users have changed their browser base font size.)*
>
> These `@theme`-calculated values differ from the explicit `:root` design system tokens (e.g., `--radius-sm: 6px`, `--radius-xl: 12px`). **Prefer the explicit `rounded-[var(--radius-xl)]` pattern** over bare Tailwind `rounded-xl` to ensure design system token values are used.

| Token | CSS Variable | Value |
|---|---|---|
| none | `--radius-none` | 0px |
| xxs | `--radius-xxs` | 2px |
| xs | `--radius-xs` | 4px |
| sm | `--radius-sm` | 6px |
| md | `--radius-md` | 8px |
| lg | `--radius-lg` | 10px |
| xl | `--radius-xl` | 12px |
| 2xl | `--radius-2xl` | 16px |
| 3xl | `--radius-3xl` | 20px |
| 4xl | `--radius-4xl` | 24px |
| full | `--radius-full` | 1000px |

---

## 7. Shadow Scale

Shadows are defined in `tailwind.config.ts` and mirrored as CSS custom properties in `globals.css`.

| Token | Value | Tailwind Class |
|---|---|---|
| custom | `0 4px 6px -1px rgba(62, 67, 76, 0.05)` | `shadow-custom` |
| custom-lg | `0 10px 15px -3px rgba(62, 67, 76, 0.1), 0 4px 6px -2px rgba(62, 67, 76, 0.05)` | `shadow-custom-lg` |
| custom-xl | `0 20px 25px -5px rgba(62, 67, 76, 0.1), 0 10px 10px -5px rgba(62, 67, 76, 0.04)` | `shadow-custom-xl` |

---

## 8. Button Styles

Defined in `src/components/ui/button.tsx` using CVA (class-variance-authority).

### 8.1 Base Styles (all buttons)

```
rounded-full
font-medium
text-[length:var(--font-size-body-l)]
!px-[var(--spacing-xl)]
min-h-[48px]
inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all
disabled:bg-[var(--button-background-disabled)]
disabled:text-[var(--button-foreground-disabled)]
```

### 8.2 Button Variants

| Variant | Background | Text Color | Hover | Use Case |
|---|---|---|---|---|
| `default` | `--button-background-primary-solid` (`#008858`) | `--button-foreground-primary-on-solid` (`#fff`) | 80% opacity | Primary CTA |
| `destructive` | `--button-background-negative-solid` (`#d92d20`) | white | 90% opacity | Delete / danger actions |
| `outline` | transparent | `--button-foreground-primary-on-transparent` | `--positive-90`/30 bg | Secondary action with border |
| `secondary` | `--button-background-secondary-subtle` (`#dfe7f6`) | `--button-foreground-secondary-on-subtle` (`#325fb4`) | `--background-secondary-lighter` | Secondary actions |
| `tertiary` | `--background-neutral-medium` (`#f1f3f3`) | `--foreground-neutral-light` (`#373c41`) | 80% opacity | Tertiary/ghost-ish |
| `tertiary_outline` | transparent | `--button-foreground-neutral-fixed` (`#373c41`) | neutral bg | Bordered neutral |
| `link` | transparent | primary | underline on hover | Text links |
| `ghost` | transparent | — | `--background-neutral-medium` bg | Icon-adjacent |
| `white` | `--button-background-fixed-solid` (`#ffffff`) | — | neutral bg | On dark backgrounds |

### 8.3 Button Sizes

| Size | Height | Notes |
|---|---|---|
| `sm` | h-8 | Compact |
| `default` | h-9 | Standard (overridden by `min-h-[48px]`) |
| `lg` | h-10 | Large (overridden by `min-h-[48px]`) |

> **Note**: All button variants have `min-h-[48px]` applied regardless of size variant for touch target compliance.

### 8.4 Loading State

```tsx
// Buttons have a built-in loading prop
<Button loading={isSubmitting}>Submit</Button>
// Shows: <Loader2 animate-spin /> + translated "loading" text
```

### 8.5 IconButton Variants

Defined in the same `button.tsx` file.

| Variant | Style | Size Options |
|---|---|---|
| `default` | Ghost with hover neutral bg | sm (32px), md (44px), lg (48px) |
| `defaultOutline` | Transparent with hover border | sm, md, lg |
| `primary` | On-hover shows primary fg | sm, md, lg |
| `ghost` | Ghost hover | sm, md, lg |
| `fill` | Neutral solid bg | sm, md, lg |
| `negative` | Danger solid bg | sm, md, lg |
| `secondary` | Secondary solid bg | sm, md, lg |

```tsx
import { Button, IconButton } from "@/components/ui/button";

<Button variant="default" size="lg">ยืนยัน</Button>
<Button variant="destructive" loading={isDeleting}>ลบ</Button>
<Button variant="outline">ยกเลิก</Button>
<IconButton variant="fill" size="md"><SearchIcon /></IconButton>
```

---

## 9. Badge Styles

Defined in `src/components/ui/badge.tsx`.

### Base Styles

```
rounded-full
border
py-[var(--spacing-xxs)]
px-[10px]
text-[length:var(--font-size-label-m)]
min-w-0 max-w-full shrink-0
```

### Badge Variants

| Variant | Background | Text | Border | Use Case |
|---|---|---|---|---|
| `default` | `--primary` (`#008858`) | `--primary-foreground` | transparent | Primary count/status |
| `secondary` | `--background-secondary-lighter` | `--foreground-secondary-default` | `--stroke-secondary-lighter` | Secondary status |
| `destructive` | `--badge-background-default` (`#d92d20`) | white | transparent | Error/danger indicator |
| `outline` | transparent | `--foreground` | current | Outlined label |
| `success` | `--background-positive-medium` (`#17b26a`) | white | transparent | Success status |

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">3</Badge>
<Badge variant="destructive">ด่วน</Badge>
<Badge variant="secondary">รอดำเนินการ</Badge>
```

---

## 10. Toast / Notification Styles

Defined in `src/components/ui/sonner.tsx` using the `sonner` library.

Toast styling uses CSS custom properties for semantic colors:

| Toast Type | Icon Container Background | Toast Background | Text Token | Icon Color | Icon |
|---|---|---|---|---|---|
| success | `--button-background-positive-subtle` | `--background-positive-subtle` ⚠️ | `--foreground-positive-dark` | `--foreground-positive-dark` | check_circle |
| info | `--button-background-primary-subtle` (`--primary-95`) | `--background-primary-subtle` ⚠️ | `--foreground-primary-dark` | `--foreground-primary-dark` | info_outline |
| warning | `--button-background-warning-subtle` | `--background-warning-subtle` ⚠️ | `--foreground-warning-dark` | `--foreground-warning-dark` | warning |
| error | *(none)* | `--background-negative-light` (`--danger-95`) | `--foreground-warning-dark` ⚠️ | `--foreground-negative-dark` | error_outline |
| loading | `--button-background-primary-subtle` (`--primary-95`) | `--popover` (`#ffffff`) | `--foreground-primary-dark` | `--foreground-primary-dark` | Loader2 (spin) |
| normal | *(none)* | `--popover` (`#ffffff`) | `--popover-foreground` (`#000000`) | — | — |

> ⚠️ **Known bug — non-existent tokens**: The toast `style` prop sets `--success-bg: var(--background-positive-subtle)`, `--warning-bg: var(--background-warning-subtle)`, and `--info-bg: var(--background-primary-subtle)`. These tokens (`--background-positive-subtle`, `--background-warning-subtle`, `--background-primary-subtle`) **do not exist** in `globals.css`. Only `--button-background-*-subtle` variants exist. As a result, the toast background for success/warning/info will fall back to the browser default (likely white). This is a known bug in `sonner.tsx`. The `--popover` token (`#ffffff`, documented in section 3.10) provides white for loading and normal toasts.

> ⚠️ The error toast title/description text uses `--foreground-warning-dark` (via `--error-text` CSS var in `sonner.tsx`) while the icon uses `--foreground-negative-dark`. This is an inconsistency in the current implementation — when creating new toast styles, prefer `--foreground-negative-dark` for error state text as well.

Toast base style: `border-radius: var(--radius-xl)`, `padding: var(--spacing-md)`, font-size: `var(--font-size-body-l)`, font-family: Anuphan.

```tsx
import { toast } from "sonner";

toast.success("บันทึกสำเร็จ");
toast.error("เกิดข้อผิดพลาด");
toast.warning("คำเตือน");
toast.info("ข้อมูลเพิ่มเติม");
```

---

## 11. Component Catalog

All components are in `src/components/ui/`. Built on shadcn/ui (style: new-york) + Radix UI.

| Component | File | Description |
|---|---|---|
| `Badge` | `badge.tsx` | Status labels with variants |
| `Button` / `IconButton` | `button.tsx` | CTA buttons with loading state; icon-only buttons |
| `Card` | `card.tsx` | Content container |
| `Carousel` | `carousel.tsx` | Horizontal scrolling carousel |
| `Checkbox` | `checkbox.tsx` | Form checkbox |
| `Collapsible` | `collapsible.tsx` | Expandable content sections |
| `CustomToast` | `custom-toast.tsx` | Custom toast notification wrapper |
| `Dialog` | `dialog.tsx` | Modal dialog |
| `DropdownMenu` | `dropdown-menu.tsx` | Dropdown action menu |
| `Icon` | `icon.tsx` | Material Symbols icon wrapper |
| `ImageLightbox` | `image-lightbox.tsx` | Full-screen image viewer |
| `Image` | `image.tsx` | Enhanced Next.js Image wrapper |
| `Input` | `input.tsx` | Text input field |
| `Label` | `label.tsx` | Form label |
| `OtpInput` | `otp-input.tsx` | OTP entry fields |
| `Popover` | `popover.tsx` | Floating popover |
| `ScrollArea` | `scroll-area.tsx` | Custom scrollable area |
| `Select` | `select.tsx` | Dropdown select |
| `Separator` | `separator.tsx` | Horizontal/vertical divider |
| `Sheet` | `sheet.tsx` | Slide-in drawer/panel |
| `Sidebar` | `sidebar.tsx` | Navigation sidebar |
| `Skeleton` | `skeleton.tsx` | Loading placeholder |
| `Sonner` / `Toaster` | `sonner.tsx` | Toast notification system |
| `Switch` | `switch.tsx` | Toggle switch |
| `Tabs` | `tabs.tsx` | Tab navigation |
| `Tooltip` | `tooltip.tsx` | Hover tooltip |
| `Typography` | `typography.tsx` | Semantic typography components |
| `ScrollToTopButton` | `ScrollToTopButton.tsx` | Floating scroll-to-top button |

---

## 12. Cross-Platform Token Mapping

These tokens have **identical values** in both platforms. Only the access pattern differs.

### Colors

| Token Name | Value | Mobile (Dart) | Web (CSS/Tailwind) |
|---|---|---|---|
| Primary Base | `#008858` | `context.theme.colors.background.primary.dark` | `var(--background-primary-dark)` |
| Primary Accent | `#00b274` | `context.theme.colors.background.primary.medium` | `var(--background-primary-medium)` |
| Primary Light | `#ebfaf4` | `context.theme.colors.background.primary.lighter` | `var(--background-primary-lighter)` |
| Neutral Text Dark | `#25272a` | `context.theme.colors.foreground.neutral.default` | `var(--foreground-neutral-default)` |
| Neutral Text | `#373c41` | `context.theme.colors.foreground.neutral.light` | `var(--foreground-neutral-light)` |
| Neutral Text Light | `#62676c` | `context.theme.colors.foreground.neutral.lighter` | `var(--foreground-neutral-lighter)` |
| Danger | `#d92d20` | `context.theme.colors.foreground.negative.default` | `var(--foreground-negative-default)` |
| Border Default | `#dde0e2` | `context.theme.colors.stroke.neutral.default` | `var(--stroke-neutral-default)` |
| Secondary Main | `#325fb4` | `context.theme.colors.foreground.secondary.default` | `var(--foreground-secondary-default)` |
| Success | `#17b26a` | `context.theme.colors.background.positive.medium` | `var(--background-positive-medium)` |
| Warning | `#fdb022` | `context.theme.colors.foreground.warning.light` | `var(--foreground-warning-light)` |
| Info | `#0ba5ec` | `context.theme.colors.foreground.info.default` | `var(--foreground-info-default)` |

### Typography

| Scale | Size / Line Height | Mobile (Dart) | Web (Tailwind) |
|---|---|---|---|
| display-l | 57px / 64px | `AppTypography.displayL` | `text-[length:var(--font-size-display-l)] leading-[var(--line-height-display-l)]` |
| display-m | 46px / 52px | `AppTypography.displayM` | `text-[length:var(--font-size-display-m)] leading-[var(--line-height-display-m)]` |
| display-s | 36px / 44px | `AppTypography.displayS` | `text-[length:var(--font-size-display-s)] leading-[var(--line-height-display-s)]` |
| headline-l | 32px / 40px | `AppTypography.headlineL` | `text-[length:var(--font-size-headline-l)] leading-[var(--line-height-headline-l)]` |
| headline-m | 28px / 36px | `AppTypography.headlineM` | `text-[length:var(--font-size-headline-m)] leading-[var(--line-height-headline-m)]` |
| headline-s | 24px / 32px | `AppTypography.headlineS` | `text-[length:var(--font-size-headline-s)] leading-[var(--line-height-headline-s)]` |
| title-l | 18px / 26px | `AppTypography.titleL` | `text-[length:var(--font-size-title-l)] leading-[var(--line-height-title-l)]` |
| title-m | 16px / 24px | `AppTypography.titleM` | `text-[length:var(--font-size-title-m)] leading-[var(--line-height-title-m)]` |
| title-s | 14px / 20px | `AppTypography.titleS` | `text-[length:var(--font-size-title-s)] leading-[var(--line-height-title-s)]` |
| body-l | 16px / 24px | `AppTypography.bodyL` | `text-[length:var(--font-size-body-l)] leading-[var(--line-height-body-l)]` |
| body-m | 14px / 20px | `AppTypography.bodyM` | `text-[length:var(--font-size-body-m)] leading-[var(--line-height-body-m)]` |
| body-s | 12px / 16px | `AppTypography.bodyS` | `text-[length:var(--font-size-body-s)] leading-[var(--line-height-body-s)]` |
| label-l | 14px / 21px | `AppTypography.labelL` | `text-[length:var(--font-size-label-l)] leading-[var(--line-height-label-l)]` |
| label-m | 12px / 18px | `AppTypography.labelM` | `text-[length:var(--font-size-label-m)] leading-[var(--line-height-label-m)]` |
| label-s | 11px / 16px | `AppTypography.labelS` | `text-[length:var(--font-size-label-s)] leading-[var(--line-height-label-s)]` |

### Spacing

| Token | Value | Mobile (Dart) | Web (CSS/Tailwind) |
|---|---|---|---|
| xxs | 2px | `AppSpacing.xxs` | `var(--spacing-xxs)` / `p-[var(--spacing-xxs)]` |
| xs | 4px | `AppSpacing.xs` | `var(--spacing-xs)` / `p-[var(--spacing-xs)]` |
| sm | 6px | `AppSpacing.sm` | `var(--spacing-sm)` / `p-[var(--spacing-sm)]` |
| md | 8px | `AppSpacing.md` | `var(--spacing-md)` / `p-[var(--spacing-md)]` |
| lg | 12px | `AppSpacing.lg` | `var(--spacing-lg)` / `p-[var(--spacing-lg)]` |
| xl | 16px | `AppSpacing.xl` | `var(--spacing-xl)` / `p-[var(--spacing-xl)]` |
| 2xl | 20px | `AppSpacing.x2l` | `var(--spacing-2xl)` / `p-[var(--spacing-2xl)]` |
| 3xl | 24px | `AppSpacing.x3l` | `var(--spacing-3xl)` / `p-[var(--spacing-3xl)]` |
| 4xl | 32px | `AppSpacing.x4l` | `var(--spacing-4xl)` / `p-[var(--spacing-4xl)]` |
| 5xl | 40px | `AppSpacing.x5l` | `var(--spacing-5xl)` / `p-[var(--spacing-5xl)]` |
| 6xl | 48px | `AppSpacing.x6l` | `var(--spacing-6xl)` / `p-[var(--spacing-6xl)]` |

### Border Radius

| Token | Value | Mobile (Dart) | Web (CSS/Tailwind) |
|---|---|---|---|
| xxs | 2px | `AppRadius.xxs` | `var(--radius-xxs)` / `rounded-[var(--radius-xxs)]` |
| xs | 4px | `AppRadius.xs` | `var(--radius-xs)` / `rounded-[var(--radius-xs)]` |
| sm | 6px | `AppRadius.sm` | `var(--radius-sm)` / `rounded-[var(--radius-sm)]` |
| md | 8px | `AppRadius.md` | `var(--radius-md)` / `rounded-[var(--radius-md)]` |
| lg | 10px | `AppRadius.lg` | `var(--radius-lg)` / `rounded-[var(--radius-lg)]` |
| xl | 12px | `AppRadius.xl` | `var(--radius-xl)` / `rounded-[var(--radius-xl)]` |
| 2xl | 16px | `AppRadius.x2l` | `var(--radius-2xl)` / `rounded-[var(--radius-2xl)]` |
| 3xl | 20px | `AppRadius.x3l` | `var(--radius-3xl)` / `rounded-[var(--radius-3xl)]` |
| 4xl | 24px | `AppRadius.x4l` | `var(--radius-4xl)` / `rounded-[var(--radius-4xl)]` |
| full | 1000px | `AppRadius.full` | `var(--radius-full)` / `rounded-[var(--radius-full)]` or `rounded-full` |

---

## 13. Layout Principles

### Responsive Strategy

- **Mobile-first** — base styles apply to mobile viewport
- **Desktop breakpoint** — `lg:` prefix (1024px and above) for desktop overrides
- Common pattern: `text-[length:var(--font-size-headline-s)] lg:text-[length:var(--font-size-display-s)]`

### Page Layout Structure

```tsx
// Typical page with max-width container
<div className="flex flex-col min-h-screen bg-[var(--canvas-default)]">
  {/* Header (sticky) */}
  <header className="sticky top-0 z-50 bg-[var(--background-neutral-lighter)] shadow-custom" />
  
  {/* Main content */}
  <main className="flex-1 px-[var(--spacing-xl)] lg:px-[var(--spacing-4xl)] py-[var(--spacing-3xl)]">
    <div className="max-w-screen-lg mx-auto">
      {/* content */}
    </div>
  </main>
</div>
```

### Common Spacing Patterns

| Context | Token |
|---|---|
| Page horizontal padding (mobile) | `px-[var(--spacing-xl)]` (16px) |
| Page horizontal padding (desktop) | `px-[var(--spacing-4xl)]` (32px) |
| Section vertical gap | `gap-[var(--spacing-3xl)]` (24px) |
| Card internal padding | `p-[var(--spacing-xl)]` (16px) |
| Button gap | `gap-[var(--spacing-md)]` (8px) |
| Form field gap | `gap-[var(--spacing-xl)]` (16px) |
| List item gap | `gap-[var(--spacing-md)]` (8px) |
| Modal padding | `p-[var(--spacing-3xl)]` (24px) |

### i18n

```typescript
// Server component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("common");
t("loading"); // → "กำลังโหลด..."

// Client component
import { useTranslations } from "next-intl";
const t = useTranslations("common");
t("loading");
```

Supported locales: `th` (Thai, default), `en` (English)

---

## 14. Do's and Don'ts

### ✅ DO — Use CSS Custom Property Tokens

```tsx
// Colors
className="text-[var(--foreground-neutral-default)]"
className="bg-[var(--background-primary-lighter)]"
className="border-[var(--stroke-neutral-default)]"

// Spacing
className="p-[var(--spacing-xl)]"
className="gap-[var(--spacing-md)]"
className="mt-[var(--spacing-3xl)]"

// Radius
className="rounded-[var(--radius-xl)]"
className="rounded-[var(--radius-full)]"   // or rounded-full

// Typography
className="text-[length:var(--font-size-body-l)]"
className="leading-[var(--line-height-body-l)]"

// Shadows
className="shadow-custom"
className="shadow-custom-lg"
```

### ✅ DO — Use Typography Components for Text

```tsx
import { TypographyHeader, TypographyP } from "@/components/ui/typography";

<TypographyHeader>หัวข้อหลัก</TypographyHeader>
<TypographyP>เนื้อหาเพิ่มเติม</TypographyP>
```

### ✅ DO — Use Semantic Button Variants

```tsx
<Button variant="default">ยืนยัน</Button>          // Primary CTA
<Button variant="outline">ยกเลิก</Button>           // Secondary action
<Button variant="destructive">ลบ</Button>           // Destructive action
```

### ✅ DO — Use `cn()` for Conditional Classes

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "rounded-[var(--radius-xl)] p-[var(--spacing-xl)]",
  isActive && "bg-[var(--background-primary-lighter)]"
)} />
```

### ❌ DON'T — Hardcode Values

```tsx
// ❌ Wrong
className="text-[#25272A]"
className="bg-[#ebfaf4]"
className="p-4"
className="rounded-xl"
className="text-sm"
className="text-base"
className="border-gray-200"
```

### ❌ DON'T — Skip Token Layers

```tsx
// ❌ Wrong — use semantic token, not palette token
className="bg-[var(--primary-95)]"    // Skip - use --background-primary-lighter instead
className="text-[var(--neutral-20)]"  // Skip - use --foreground-neutral-default instead

// ✅ Correct
className="bg-[var(--background-primary-lighter)]"
className="text-[var(--foreground-neutral-default)]"
```

### ❌ DON'T — Use Arbitrary Tailwind Spacing Values

```tsx
// ❌ Wrong
className="p-4 gap-3 mt-6"

// ✅ Correct
className="p-[var(--spacing-xl)] gap-[var(--spacing-lg)] mt-[var(--spacing-3xl)]"
```

---

## 15. Accessibility Standards

### Compliance Target

| Standard | Level |
|---|---|
| **WCAG** | 2.1 Level AA |
| **Color Contrast (normal text)** | Minimum 4.5:1 |
| **Color Contrast (large text / UI components)** | Minimum 3:1 |
| **Focus Visible** | Every interactive element must have a visible focus ring |
| **Keyboard Navigation** | Every action must be operable with keyboard only |
| **Screen Readers** | VoiceOver (macOS/iOS Safari), NVDA/JAWS (Windows) |

### Accessible Patterns — Do's ✅

```tsx
// ✅ DO — Decorative images must suppress alt text
<img aria-hidden="true" alt="" src="..." />

// ✅ DO — Screen-reader-only text for icon-only elements
<span className="sr-only">คำอธิบายสำหรับ screen reader</span>

// ✅ DO — Semantic HTML landmarks
<main>
  <nav aria-label="เมนูหลัก">...</nav>
  <header>...</header>
  <footer>...</footer>
</main>

// ✅ DO — Icon-only buttons must carry an accessible label
<button aria-label="ปิด">
  <X className="h-4 w-4" aria-hidden="true" />
</button>

// ✅ DO — Use Radix UI primitives (built-in a11y)
import { Dialog, Select, Tooltip, DropdownMenu } from "@/components/ui/...";

// ✅ DO — Associate form labels with inputs
<label htmlFor="search-input">ค้นหา</label>
<input id="search-input" type="search" />

// ✅ DO — Provide ARIA live region for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// ✅ DO — Indicate expanded/collapsed state
<button aria-expanded={isOpen} aria-controls="dropdown-content">
  เมนู
</button>
```

### Accessible Patterns — Don'ts ❌

```tsx
// ❌ DON'T — Interactive div without semantics
<div onClick={handleClick}>คลิกที่นี่</div>

// ❌ DON'T — Image without alt text
<img src="banner.png" />

// ❌ DON'T — Remove focus outline without visible alternative
// In CSS:  outline: none;  /* missing :focus-visible replacement */

// ❌ DON'T — Icon-only button with no label
<button><X /></button>

// ❌ DON'T — Positive/negative meaning conveyed by color alone
<span style={{ color: "red" }}>ข้อผิดพลาด</span>
// Must also include text or icon to convey meaning

// ❌ DON'T — Missing form labels
<input type="text" placeholder="ค้นหา..." />
```

### ARIA Attribute Cheatsheet

| Pattern | Attribute | Example |
|---|---|---|
| Decorative element | `aria-hidden="true"` | Icons, decorative images |
| Screen-reader text | `className="sr-only"` | Hidden labels for icon buttons |
| Expandable region | `aria-expanded` | Dropdowns, accordions |
| Controlled region | `aria-controls` | Button controlling a panel |
| Live region | `aria-live="polite"` | Status messages, toasts |
| Current page | `aria-current="page"` | Active navigation link |
| Required field | `aria-required="true"` | Form validation |
| Invalid field | `aria-invalid="true"` | Form error state |
| Labelled by | `aria-labelledby` | Complex UI labeled by another element |
| Described by | `aria-describedby` | Field paired with helper/error text |

### Component Accessibility Notes

| Component | Accessibility Requirement |
|---|---|
| `<Button>` | Min touch target 48×48px (enforced by `min-h-[48px]`); icon-only buttons need `aria-label` |
| `<Dialog>` (Radix) | Focus trapped inside; `aria-modal="true"`, `aria-labelledby` on title |
| `<Select>` (Radix) | Keyboard-navigable; ARIA `combobox` role built-in |
| `<Tooltip>` (Radix) | Triggered on both hover and focus; `role="tooltip"` built-in |
| `<DropdownMenu>` (Radix) | Arrow-key navigation; `aria-haspopup="menu"` built-in |
| `<Input>` | Must have `<label>` or `aria-label`; invalid state uses `aria-invalid` + `aria-describedby` |
| Navigation links | Active link uses `aria-current="page"` |
| Images | Informative images: descriptive `alt`; Decorative: `alt=""` + `aria-hidden="true"` |
| Toast/Notification | Wrapped in `aria-live="polite"` region |

### Testing Requirements

The project uses **jest-axe** for automated accessibility testing. Every component test must include an axe assertion:

```tsx
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

it("should have no accessibility violations", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Mandatory axe test categories (per existing test suite):

| Category | What to verify |
|---|---|
| Heading hierarchy | `h1` → `h2` → `h3` in order; no skipped levels |
| Landmark roles | `<main>`, `<nav>`, `<header>`, `<footer>` present |
| ARIA attributes | Valid attribute values; required attributes present |
| Focus management | Focus moves to modal on open; returns on close |
| Form labels | Every `<input>` has an associated label |
| Duplicate IDs | No duplicate `id` attributes on page |
| List structure | `<ul>`/`<ol>` contain only `<li>` children |
| tabindex | No `tabindex` value greater than 0 |
| Color contrast | Automated contrast check via axe |
| Image alt text | All `<img>` have `alt` attribute |

---

## 16. Agent Prompt Guide

When generating code for CZP Web, use these values:

```
Platform:       Next.js 16 / TypeScript / Tailwind CSS v4
Font:           Anuphan (loaded via next/font/google, subsets: ["thai"])
Primary color:  #008858 → var(--background-primary-dark) or var(--foreground-primary-default)
Primary accent: #00b274 → var(--background-primary-medium)
Text default:   #25272a → var(--foreground-neutral-default)
Text secondary: #373c41 → var(--foreground-neutral-light)
Text muted:     #62676c → var(--foreground-neutral-lighter)
Border:         #dde0e2 → var(--stroke-neutral-default)
Page bg:        #f8f9f9 → var(--canvas-default) or var(--background-neutral-light)
White surface:  #ffffff → var(--background-neutral-lighter) or var(--canvas-white)
Error:          #d92d20 → var(--foreground-negative-default) or var(--button-background-negative-solid)
Success:        #17b26a → var(--background-positive-medium) or var(--foreground-positive-default)

Spacing scale: xxs=2px xs=4px sm=6px md=8px lg=12px xl=16px 2xl=20px 3xl=24px 4xl=32px
Radius scale:  xs=4px sm=6px md=8px lg=10px xl=12px 2xl=16px full=1000px
Typography: Use specific scale like text-[length:var(--font-size-body-l)] leading-[var(--line-height-body-l)]
Responsive: mobile-first with lg: breakpoint (1024px)
Button CTA: <Button variant="default">text</Button>  (min-h-[48px], rounded-full)
Icons: lucide-react or Material Symbols via <Icon name="..." />
Components: shadcn/ui from @/components/ui/
Utils: cn() from @/lib/utils for className merging
i18n: useTranslations() from next-intl
```

---

## 17. Cross-Platform Sync Checklist

When a design token changes (e.g., from a Figma update), **update BOTH repositories**:

| What changed | Update in czp-mobile | Update in czp-web |
|---|---|---|
| Color palette value | `assets/color/colors.xml` + `colors_shades.dart` | `src/app/[locale]/globals.css` — palette `:root` section |
| Typography scale (size/line-height) | `app_typography.dart` | `src/app/[locale]/globals.css` — font-size/line-height section |
| Spacing value | `app_spacing.dart` | `src/app/[locale]/globals.css` — spacing section |
| Border radius | `app_radius.dart` | `src/app/[locale]/globals.css` — radius section |
| New semantic color token | `colors_group.dart` + `colors_category.dart` | `src/app/[locale]/globals.css` — semantic tokens section |
| New button variant | `app_button_styles.dart` | `src/components/ui/button.tsx` — CVA variants |
| New typography component | Custom Flutter widget | `src/components/ui/typography.tsx` |
| Font change | `pubspec.yaml` + `app_typography.dart` | `src/app/[locale]/layout.tsx` — next/font/google |

> **Tip for AI agents**: If asked to change a design token value, remind the developer that the same change should be applied to the other platform repository ([czp-mobile](https://github.com/dga-devops/czp-mobile/blob/develop/DESIGN.md)).

---

## 18. Known Issues & Inconsistencies

This section documents known bugs and value mismatches between the design system tokens, the shadcn/ui theme layer, and component implementations. These are tracked here for awareness — do **not** "fix" them by silently changing token values, as changes may have cross-platform implications.

| # | Issue | Details |
|---|---|---|
| 1 | **`--destructive` ≠ `--danger-40`** | shadcn `--destructive` = `#dc2626`; design system `--danger-40` = `#d92d20`. Use `--button-background-negative-solid` (→ `--danger-40`) for design-system-compliant destructive actions. |
| 2 | **`--border` / `--input` ≠ `--stroke-neutral-default`** | shadcn `--border` / `--input` = `#e5e7eb`; design system `--stroke-neutral-default` = `#dde0e2`. Use `--stroke-neutral-default` in custom code. |
| 3 | **`--secondary` (shadcn) ≠ secondary palette** | shadcn `--secondary` = `#E0F2FE` (light cyan-blue); design system `--secondary-*` palette is a blue tone (`#325fb4` base). Use `--background-secondary-*` tokens in custom code. |
| 4 | **`--button-stroke-nuetral` typo** | Token name has a typo ("nuetral" instead of "neutral") in `globals.css` line 515. Do **not** rename it — component code may reference this exact name. Document and use the typo'd name as-is. |
| 5 | **Toast references non-existent `--background-*-subtle` tokens** | `sonner.tsx` sets `--success-bg: var(--background-positive-subtle)`, `--warning-bg: var(--background-warning-subtle)`, `--info-bg: var(--background-primary-subtle)`. None of these tokens exist in `globals.css` — only `--button-background-*-subtle` variants exist. Toast backgrounds for success/warning/info will fall back to browser default (white). |
| 6 | **`--primary-70` has same value as `--primary-60`** | Both `--primary-60` and `--primary-70` are `#5ed49a`. This appears to be a design token definition issue. |
| 7 | **Error toast text uses wrong semantic token** | Error toast uses `--foreground-warning-dark` for text (via the `--error-text` CSS custom prop in `sonner.tsx`) while the icon uses `--foreground-negative-dark`. Should use `--foreground-negative-dark` for both. |
