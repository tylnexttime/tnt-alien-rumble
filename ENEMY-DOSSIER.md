# TNT Alien Rumble — Enemy & Palette Dossier

**Compiled 2026-08-18.** Groundwork for the C64 re-framing and the sprite-legibility pass.
Everything below was **measured from the running game**, not read off the docs — where a measured
value contradicts `README.md` / `TECHNICAL_DOCUMENTATION.md` / `WALKTHROUGH.md`, this file is right
and those are the ones to correct.

Method: served the game locally, then rendered each `SpriteRenderer.drawX()` to an offscreen canvas
and histogrammed the non-transparent pixels. So "dominant colour" below means **largest pixel area**
— what actually reads at speed — not how often a token appears in the source. (An earlier pass used
source token counts and got two enemies wrong; area is the honest measure.)

---

## 1. Provenance — the game we are an homage to

| | |
|---|---|
| **Title (NA)** | *Bop'n Rumble* |
| **Title (EU)** | *Street Hassle* |
| **Title (NES/general)** | *Bad Street Brawler* |
| **Year** | 1987 |
| **Developer** | Beam Software (Melbourne, Australia) |
| **Publishers** | Melbourne House (EU) · Mindscape (NA) |
| **Credited** | Andrew Davie, David Pentecost (code) · Neil Brennan (music) |
| **Platforms** | **Commodore 64**, ZX Spectrum, MS-DOS, NES |

🔴 **There was never an Amiga version.** "Amiga 500 Edition" is therefore not a stylistic elevation
of the source — it is a lineage error, and it is the thing being corrected. The C64 is the machine.

The original's own graphics were described contemporaneously as having **limited palette diversity**
— which is not a flaw to be "fixed" but the aesthetic itself. The VIC-II offers **16 fixed colours**.

### The moveset lineage is real and worth protecting

The original's per-level special moves were *headbutts, head-turning, ground-ramming, ear-squeezing
and aerial spinning*. Ours are **Stretchy Headbutt, Ear Twist, Bull Ram, Flying Belly Flop, Aerial
Dropkick**. That is a faithful one-to-one homage and should be stated plainly in the docs — it is a
stronger claim to authenticity than any graphics adjective.

### Enemy lineage, original → ours

| Original (1987) | Ours |
|---|---|
| 4-metre basketball players | **Hoops #23** (84px — the tallest sprite, deliberately) |
| Beer-belly guys | **Brutus the Bouncer** |
| Dogs | **Barnaby** the poodle / bulldog |
| Crazy motorcyclists | **Axel the Roller-Skater** |
| People with bats, karate fighters | **Spike** the Mohawk Punk |
| Small gals / blind people (walking-stick gag) | **Agnes** the Handbag Granny |
| Gorillas, bomb-dropping dwarfs | *(not carried over)* |
| Trench-coat dwarf dispensing health **or bombs** | *(not carried over — see §7)* |

Sources: [C64-Wiki](https://www.c64-wiki.com/wiki/Bop'n_Rumble) · [Lemon64](https://www.lemon64.com/game/bop-n-rumble) · [Wikipedia — Bad Street Brawler](https://en.wikipedia.org/wiki/Bad_Street_Brawler)

---

## 2. Every "Amiga" reference, and where it lives

**23 occurrences across 5 files.** Full inventory so nothing is missed:

| File | Lines | What it says |
|---|---|---|
| `index.html` | 6 | `<title>… (Amiga 500 Edition)` |
| | 7 | meta description "inspired by C64 & Amiga 500 Bop'n Rumble" |
| | 119 | on-screen badge **`AMIGA 500 & C64 EDITION - v2.0`** |
| | 281 | `<h2>AMIGA 500 ENEMY FIELD ROSTER & COUNTERS</h2>` |
| `js/entities/sprite-renderer.js` | 2–3 | header: "AMIGA 500 RETRO SPRITE RENDERER … Deluxe Paint IV styled OCS (32-color / RGB444)" |
| | 10–11 | comment "Amiga 500 OCS 32-Color Palette (12-bit RGB444)" + **the object is literally named `this.amiga`** |
| | 83, 593, 641, 801, 986, 1083, 1201, 1311, 1366, 1456 | per-character section headers, all "AMIGA 500 EDITION" |
| `js/stages/stage-data.js` | 2–3 | header: "AMIGA 500 STAGE DEFINITIONS … Deluxe Paint IV quality" |
| | 170, 230, 296, 334–335 | "Copper Sky Gradient (OCS Raster Color Bars)", `drawAmigaBuilding()`, "Amiga asphalt grain" |
| `js/entities/enemies.js` | 2 | header "AMIGA 500 ENHANCED EDITION" |
| | 81 | `this.height = 84; // Towering Amiga proportion` |
| `js/engine/particle.js` | 2 | header "AMIGA 500 EDITION" |
| `README.md` | 3, 18, 100, 105–106 | the headline claim + "Amiga 500 Quality & Architectural Features" |
| `TECHNICAL_DOCUMENTATION.md` | 3, 36, 40, 90–94, 106–108 | §3 is titled "Amiga 500 Graphics Pipeline & OCS Palette Architecture" |
| `WALKTHROUGH.md` | 1, 3, 7, 9–10 | title + "What's New in the Amiga 500 Edition" |

**Two renames carry code risk, everything else is comments/prose:**
- `this.amiga` → referenced as `const pal = this.amiga` at **10 call sites**. Mechanical, but it is a
  real symbol rename, not a comment edit.
- `drawAmigaBuilding()` → **3 call sites** in `stage-data.js`.

**A note on "copper":** the copper sky gradient bars are genuinely Amiga terminology (the Copper
co-processor). The C64 equivalent effect is a **raster interrupt / raster bar** — same trick, right
name for the machine. That is a rename, not a feature removal.

---

## 3. Enemy roster — stats and behaviour (from `enemies.js`)

| Enemy | HP | W×H | Speed | Dmg | Range | Score | Signature behaviour |
|---|---|---|---|---|---|---|---|
| **Spike** (punk) | 35 | 30×54 | 2.2 | 10 | 44 | 300 | switchblade jabs, flying **dropkick** |
| **Agnes** (granny) | 45 | 32×50 | 1.4 | 16 | 46 | 400 | purse smash · **throw_purse** boomerang · **umbrella_block** (0 dmg frontal) · **helicopter** escape |
| **Barnaby** (dog) | 22 | 28×24 | **3.6** | 8 | 38 | 250 | low sprint, sonic bark stun, ankle latch |
| **Hoops #23** (basketballer) | 50 | 30×**84** | 2.2 | 14 | **140** | 500 | **throw_ball** (elastic hops) · **dunk_slam** shockwave |
| **Brutus** (bouncer) | **90** | 44×64 | 1.3 | **22** | 46 | 800 | **charge_tackle** (armoured) · ground pound · **airplane_spin** grapple |
| **Axel** (skater) | 38 | 32×56 | **3.2** | 12 | 48 | 450 | slalom, drive-by strikes, 360° spin kick |
| **Bruno** (strongman) | 75 | 40×62 | 1.5 | 20 | 54 | 650 | **barbell_spin** (armoured unless tripped) |

**Shared state machine:** `walk` · `attack` · `hurt` · `knockdown`, plus the per-enemy specials
above. Two states confer damage immunity — `umbrella_block` (all frontal) and `barbell_spin`
(everything except a trip) — which is why per-enemy *recognition* is a mechanical requirement, not a
polish item: the counter differs, and reading the wrong enemy costs the hit.

**Already-strong secondary encoding** (this is the game's saving grace, see §6): Hoops is 84px vs
everyone else's 50–64; Barnaby is 24px and low; Brutus is the widest at 44px; Axel and Barnaby are
the only fast movers. Silhouette and size already carry a lot of the identity load.

---

## 4. The palette — 48 named entries, 45 distinct

`sprite-renderer.js` defines `this.amiga` as **9 material ramps × 4 steps** (Highlight/Mid/Shadow/
Deep) plus metal at 3 and 9 singletons. This is disciplined, Deluxe-Paint-idiomatic work and should
be **kept structurally** through the C64 re-framing — only the naming and the step *values* are in
question, not the ramp architecture.

| Family | Highlight | Mid | Shadow | Deep |
|---|---|---|---|---|
| alien | `#e4edf2` | `#b2c2cc` | `#7d919e` | `#4c5d6a` |
| skin | `#ffe2cf` | `#f2b58d` | `#c47a4d` | `#7a3e20` |
| bronze | `#c68d63` | `#8e542e` | `#5c3116` | `#331607` |
| denim | `#8cb2ff` | `#4b75d6` | `#264599` | `#101e4a` |
| leather | `#686b7e` | `#383b4b` | `#1e202d` | `#0c0d14` |
| metal | `#ffffff` | `#a8b4c4` | `#586475` | — |
| red | `#ff7755` | `#e62211` | `#990000` | `#4d0000` |
| purple | `#ff99dd` | `#c6429f` | `#7a195e` | `#3d082c` |
| fur | `#ffffff` | `#e2ebf5` | `#adc2d6` | `#6e859b` |
| gold | `#fff480` | `#f5c200` | `#b38000` | `#5c3d00` |

**Singletons:** `alienVein #39ff14` · `alienGlow #00f0ff` · `alienEye #0a0d12` ·
`alienEyeGlint #ffffff` · `dressFloral #ffe6f2` · `neonGreen #39ff14` · `neonCyan #00f7ff` ·
`neonPink #ff007f` · `neonOrange #ff6600`

**Three aliases** (48 names → 45 distinct): `#ffffff` is `alienEyeGlint` + `metalHighlight` +
`furHighlight`; `#39ff14` is `alienVein` + `neonGreen`. Harmless today, but they mean any
"how many colours do we use" count taken from the *names* is wrong by three.

**Elsewhere in the project:** `css/style.css` defines a **separate** token set named `--c64-*`
(155 uses) which *is* the authentic VIC-II 16-colour palette — so the CSS was right about the machine
all along while the docs said Amiga. `js/stages/stage-data.js` carries **105 distinct hex values**
inline with no token system at all; that is where palette discipline is genuinely absent.

---

## 5. Colour per enemy — measured by pixel area

Rendered at idle, facing right. Percentages are share of the character's non-transparent pixels.

| Character | Dominant | 2nd | 3rd | Remaining top-7 |
|---|---|---|---|---|
| **Gleep-Glorp** (player) | `alienMid #b2c2cc` **29.9%** | `alienEye #0a0d12` 11.0% | `alienShadow #7d919e` 5.2% | alienDeep 4.8 · leatherMid 4.8 · alienHighlight 4.6 · alienGlow 3.1 |
| **Spike** (punk) | `leatherMid #383b4b` **45.8%** | `denimMid #4b75d6` 25.0% | `skinMid #f2b58d` 8.2% | redHighlight 6.9 · redMid 4.5 · skinHighlight 4.5 · leatherDeep 3.2 |
| **Agnes** (granny) | `purpleHighlight #ff99dd` **36.3%** | `purpleShadow #7a195e` 33.4% | `furShadow #adc2d6` 11.4% | skinMid 8.0 · neonCyan 5.0 · skinHighlight 3.4 · leatherDeep 2.1 |
| **Barnaby** (dog) | `furHighlight #ffffff` **63.3%** | `furShadow #adc2d6` 14.7% | `furMid #e2ebf5` 9.8% | neonPink 4.8 · leatherDeep 3.8 |
| **Hoops #23** | `bronzeMid #8e542e` **32.1%** | `redMid #e62211` 25.9% | `goldHighlight #fff480` 12.3% | leatherDeep 10.0 · neonOrange 8.3 · furHighlight 3.1 · bronzeHighlight 1.5 |
| **Brutus** (bouncer) | `leatherDeep #0c0d14` **27.0%** | `denimMid #4b75d6` 23.3% | `skinMid #f2b58d` 21.3% | denimHighlight 18.7 · leatherHighlight 3.5 · goldMid 1.7 · skinHighlight 1.6 |
| **Axel** (skater) | `neonGreen #39ff14` **31.0%** | `neonPink #ff007f` 26.4% | `skinMid #f2b58d` 12.0% | metalMid 11.6 · leatherDeep 7.8 · neonCyan 3.3 |
| **Bruno** (strongman) | `redMid #e62211` **52.3%** | `leatherDeep #0c0d14` 17.7% | `furHighlight #ffffff` 10.5% | skinMid 9.6 · metalMid 4.3 |
| **Duke Davis** (boss) | `goldMid #f5c200` **20.7%** | `goldShadow #b38000` 18.1% | `skinMid #f2b58d` 15.6% | denimHighlight 13.5 · redMid 10.0 · goldHighlight 7.8 · furHighlight 5.4 |

---

## 6. Legibility findings

Ran the identity colours (the dominant column above) through an OKLab/CVD validator, **all-pairs**
— because any two characters can share a screen, so adjacent-only would be the wrong test.

### 🔴 Finding 1 — the player is indistinguishable from Agnes under deuteranopia
`alienMid #b2c2cc` ↔ `purpleHighlight #ff99dd` = **ΔE 1.9 (deutan)**. Target ≥ 8, absolute floor 6.
These are 29.9% and 36.3% of their respective sprites — the largest area on each. **This is the
worst of the set** because it is the player's own body against an enemy, in a game where you must
track yourself in a crowd.

### 🔴 Finding 2 — Hoops and Bruno collapse together under protanopia
`bronzeMid #8e542e` ↔ `redMid #e62211` = **ΔE 2.6 (protan)**. Both are the dominant colour of their
sprite. Aggravated by `redMid` *also* being Hoops's second colour at 25.9% — so the two characters
share a hue family across their two largest areas. Visible in the simulation: both read olive.

### ⚠ Finding 3 — Spike and Brutus are a dark top over blue
Not a single-token collision (Spike's dominant is `leatherMid #383b4b`, Brutus's is
`leatherDeep #0c0d14`), but **both carry `denimMid #4b75d6` as their second colour** at 25.0% and
23.3%. The *composition* rhymes even where the tokens differ, and they are adjacent in the roster.

### ✅ What passes
Normal-vision separation passes across all pairs (worst 15.4). The lightness-band and chroma-floor
checks fail, but those are **chart conventions and should be ignored here** — white poodle fur and
near-black leather are correct choices for sprite art. The contrast-vs-surface warning is **not yet
evidence**: it ran against a generic dark surface, not the game's actual street, which has no single
ground token to test against (see §4 — `stage-data.js` has no token system).

### Mitigation already present
Per §3, size and silhouette already differentiate strongly. Under the validator's own rule a ΔE in
the 6–8 band is acceptable *with* secondary encoding — but 1.9 and 2.6 are below even that floor.

---

## 7. Rendering — the pixel grid is half there

Measured live:

| | Value |
|---|---|
| Backing canvas | **960 × 540** |
| CSS display size | 1248 × 688 |
| `image-rendering` | **`crisp-edges`** ✅ |
| `ctx.imageSmoothingEnabled` | **`true`** |

So the *upscale* is correctly nearest-neighbour, but the *drawing* is antialiased. Evidence: the
player sprite renders **248 distinct colours from a 45-colour palette** — 238 of them off-palette
edge blends like `#fcfdfe`, `#eaf0f7`, `#f2b48d`, each under 0.5% of area. Hoops shows 116 distinct
from the same palette.

Note `imageSmoothingEnabled = false` will **not** fix this — that flag governs `drawImage` scaling,
not path/fill antialiasing. Genuine hard-edged pixels means rendering to a backing canvas at
C64-ish resolution (320×200) and letting the existing `crisp-edges` upscale do the rest. That is a
real change with layout consequences, not a quick win — **it belongs in the plan as a decision, not
an action.**

---

## 8. Open questions for Chris

1. **How far does "C64" go?** Three levels, increasing cost:
   (a) rename only — docs, headers, badge, `this.amiga` → `this.c64` / `this.pal`;
   (b) rename + snap the 45 palette values onto the authentic VIC-II 16;
   (c) (b) + true 320×200 pixel grid per §7.
   Level (b) changes how the game *looks*; level (c) changes how it is *built*.
2. **Do the fixes in §6 survive level (b)?** If we snap to 16 fixed VIC-II colours, the CVD collisions
   must be re-solved *within that constraint* — the C64 palette is small and was never designed for
   colourblind separation. Worth measuring before committing, because it may force secondary
   encoding (outline, badge, pattern) rather than hue changes.
3. **Restore the trench-coat dwarf?** The original's health-or-bomb gamble is the one mechanic in the
   source we dropped, and `game.spawnPickup` already exists.
