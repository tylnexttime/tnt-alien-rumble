# TNT ALIEN RUMBLE - The Vengeance of Gleep-Glorp (C64 Edition)

**TNT Alien Rumble** is a 100% operational, browser-based beat 'em up inspired by Beam Software / Melbourne House's 1987 **Commodore 64** classic *Bop'n Rumble* (*Street Hassle* in Europe, *Bad Street Brawler* on the NES) — an homage to its feel and its moveset rather than an emulation of its hardware.

---

## 💀 Defeat Animations & Duke's Send-Off

Every fighter now has three distinct frames — **standing**, a **flinch** when hit, and a **floored**
pose when beaten — followed by a five-second lie-still, a one-second blink, and a comic despawn cry:

| Fighter | Despawn cry |
| :--- | :--- |
| Spike the Punk | POOF! |
| Agnes the Granny | NAP TIME! |
| Barnaby the Poodle | YIP! |
| Hoops #23 | AIRBALL! |
| Brutus the Bouncer | K.O.! |
| Axel the Skater | WIPEOUT! — skates aloft, wheels still spinning, boombox flung clear |
| Bruno the Strongman | TIMBER! — pinned flat under his own 100KG barbell |
| The Motorcyclist | STACKED IT! — bike on its side, front wheel still turning |

**Duke's send-off.** Beat him and he does not simply vanish. Over roughly five seconds he delivers
his last words in three beats before giving up on street brawling entirely:

1. *"UUGHH... MY PROPORTIONS... MELBOURNE HOUSE...!"*
2. *"OOOUUCH! I'VE HAD ENOUGH."*
3. *"I'M MOVING TO GOSFORD."*

…then a puff of dust, a golden **GOSFORD!** and he is gone — and only then does the victory card
appear.

---

## 🏍️ The Motorcyclist (restored from the 1987 original)

In *Bop'n Rumble* a speeding motorcyclist was a **stage boss**, and on the NES cut he came back
later as a mini-boss. He is the one enemy who never trades punches with you.

**How he fights.** He picks a lane, **revs on the spot** — that is your telegraph, and it lasts a
little over half a second — then makes a **flat-out pass** at speed 5.6, the fastest thing in the
game. Then he wheels around and lines up another.

**How you beat him.** Two answers, and the original taught both:

- **Jump.** Press `[W]` as he arrives and he goes underneath you — `CLEARED HIM!` and no damage.
- **Hit him out of the air.** While he is charging, light jabs **`CLANG`** off the bike and do
  nothing. You need an airborne or heavy move: `[W+K]` Aerial Dropkick, `[W+J]` Flying Belly Flop,
  `[W+J+↑]` Macho Elbow, or `[U]` Bull Ram.
- Between passes he is an ordinary target — hit him with anything.

**Where he shows up.** Stage 1 gives you him **alone**, after the last wave, so you can learn the
timing without pressure. Stage 2 pairs him with a poodle. Stage 3 sends **two at once**.

| | |
| :--- | :--- |
| HP | 55 |
| Speed | 5.6 — fastest in the game |
| Contact damage | 20 |
| Score | 700 |
| Despawn | STACKED IT! |

---

## 🎁 The Trench-Coat Dwarf (restored from the 1987 original)

A small figure in a khaki trench coat and a fedora with a **cyan hatband** wanders in from the side
of the screen, stops, lobs something underarm, and wanders off. He is **not an enemy** — he has no
attack and taking a swing at him gains you nothing.

In *Bop'n Rumble* he handed you a heart to top up your energy, and on the later levels he handed you
a bomb instead. Ours works the same way:

| Stage | What he lobs |
| :--- | :--- |
| 1 — Downtown Slums | Always a **heart** — walk into it for **+25 HP**. |
| 2 — City Park & Hoops | Always a **heart**. |
| 3 — Muscle Gym & Bad Street | **20%** chance of a **live bomb** instead of the heart. |
| 4 — Rooftop Showdown | **35%** chance of a bomb — including during the Duke fight. |

(The formula caps at 65%, but with four stages it never climbs past 35% — the cap is headroom
for stages that do not exist yet, not a number you will ever see.)

**Defusing the bomb.** The original had you stand in front of it, pull back on the joystick and hit
fire. Here it is the same gesture: **stand over the bomb and press `[L]` (Low Shin Grab / `↓ + J`)**.
A green ring pulses around the bomb when you are close enough. A successful defuse is worth
**750 points and a heart** — the nerve is rewarded.

Let the fuse run out and it detonates in a radius. It does not check ID: **it hurts you, and it
hurts every enemy standing in the blast**. Luring Brutus onto a live bomb is entirely legitimate.

---

## 🎨 What's New in the C64 Edition

### 1. Architectural Engine & Textured Buildings
- **Raster Sky Gradients**: Smooth multi-stop raster gradient bars simulating atmospheric dusk, twilight indigo, and fiery sunset horizons.
- **Multi-Layer Parallax Skyline**:
  - Distant skyscrapers with illuminated office windows, water towers, and blinking red aircraft warning lights on antenna spires.
  - Mid-distance architectural silhouettes and industrial chimneys with rising smoke puffs.
- **Running-Bond Textured Brickwork**:
  - Procedural brick texture with individual mortar grid lines, chipped masonry, and weathered plaster gradients.
  - Multi-tiered Victorian / Classical stone cornices and decorative dentil moldings.
- **Deluxe Window Architecture**:
  - Beveled stone frames, sills with drop-shadows, half-drawn venetian/floral blinds, and warm interior silhouettes (lamps, plants).
- **Wrought-Iron Fire Escapes**:
  - Multi-story zigzag stairs, handrails, landing gratings, and drop shadows on the brick facades.
- **Window Air Conditioners**:
  - Window units with metallic cooling louvers, fans, and dripping condensed water particles that plink on the sidewalk.
- **3D Striped Storefront Awnings**:
  - Scalloped fabric edges, alternating colored striped canvas with realistic lighting and shadow.
- **Neon Channel Signs**:
  - Glowing neon channel lettering with outer neon tube buzz, animated flicker, and mounting frames.
- **Atmospheric Street Elements**:
  - Cast-iron sewer grates with rising steam plumes, waffle-pattern manhole covers, and Victorian cast-iron street lamps casting warm radial pools of golden light onto the sidewalk and asphalt.

---

### 2. High-Detail Character Models & Expanded Enemy Roster

| Character | Visual Details | Signature Moves & Combat AI | Counter Strategy |
| :--- | :--- | :--- | :--- |
| **Gleep-Glorp (Player)** | Bioluminescent translucent cranium with pulsing brain veins, glossy multifaceted almond eyes with specular pips, articulated limbs, biomechanical plasma gauntlet. | Full 11-move Bop'n Rumble moveset: Stretchy Headbutt (Bop!), Low Shin Grab, Bull Ram, Flying Belly Flop, Macho Elbow, Donkey Kick, Ear Twist, Cosmic Super. | — |
| **Mohawk Street Punk (Spike)** | Studded leather biker jacket with zippers, skull belt, ripped jeans, metallic switchblade with glint, textured red mohawk and aviator shades. | Rapid switchblade stabs, feint retreats, and flying horizontal dropkicks. | Interrupt with **`[K]` Stretchy Headbutt** or duck under dropkicks. |
| **Handbag Granny (Agnes)** | Floral print dress, pearl necklace, cat-eye spectacles, pink hair curlers, leather clasp purse, polka-dot umbrella. | • Overhead purse wallop with coin spill.<br>• Boomerang handbag throw.<br>• **Umbrella Shield Block**: Deflects all frontal attacks (0 DMG!).<br>• **Helicopter Getaway**: Spins purse like rotor blades and ascends into the clouds! | Duck under purse with **`[L]` Low Trip**; do not hit during umbrella block. |
| **Barnaby the Attack Poodle / Bulldog** | Fluffy show-poodle puffs / muscular bulldog with spiked collar, snarling fangs, wagging tail, pink bow. | • Fast low-profile sprint.<br>• **Sonic Bark Stun**: Emits shockwave rings that stagger fighters.<br>• **Ankle Latch Bite**: Clamps onto player's ankle. | Jump over with **`[W]`** or trip flat with **`[L]` Low Shin Grab**. |
| **Hoops Basketballer (#23)** | 84px tall athletic physique, mesh jersey #23, striped tube socks, high-top sneakers, high-top afro fade. | • Pavement dribbling physics.<br>• Crossover feint.<br>• **Bouncing Basketball Throw**: Physical ball with 2.5D elastic hops.<br>• **Monster Dunk Slam**: Leaping slam with ground shockwave. | Jump over bouncing balls with **`[W]`** and bowl over with **`[U]` Bull Ram**. |
| **Brutus the Bouncer** | Barrel chest, blue/black checkered flannel shirt, brass knuckles, work boots, shaved head with 5 o'clock stubble. | • **Bulldozer Charging Tackle**: Armored belly rush.<br>• **Ground Pound**: Two-fist hammer smash with screen shake.<br>• **360° Airplane Spin**: Grapples Gleep-Glorp, spins him overhead, and hurls him across the lane! | Jump over charge with **`[W]`** or soften with **`[W+J]` Belly Flop**. |
| **Axel the Roller-Skater** | Backwards neon cap, tinted visor, retro 80s roller skates with spinning wheels, knee pads, boombox on shoulder. | High-speed slalom skating, drive-by strikes, and 360° spin kicks. | Intercept his slalom with **`[K]` Stretchy Headbutt** or trip with **`[L]`**. |
| **Bruno the Strongman** | Red-and-white striped circus singlet, huge waxed handlebar mustache, bald head, 100KG iron barbell. | • **Whirling Barbell Spin**: Spins 360° across screen like a whirlwind (invulnerable during spin!).<br>• Overhead heavy barbell toss. | Keep distance during whirlwind spin; strike from behind with **`[O]` Donkey Kick**. |
| **Duke Davis (Final Boss)** | Feathered golden mullet, mirrored aviator sunglasses, championship gold belt, yellow muscle tank with chest definition, boxing wraps. | • **Phase 1**: Rapid jab-hook combos, dragon kicks, counter-suplex.<br>• **Phase 2 (Enraged)**: Fiery green/cyan aura, dialogue taunts (*"MY 1987 MULLET IS INVINCIBLE!"*), and earthquake stomps. | Dodge suplexes vertically, soften with combos, and finish with UFO Super! |

---

## 🕹️ Controls & Moves Manual

| Action / Move | Keyboard | Gamepad | Move Effect |
| :--- | :--- | :--- | :--- |
| **Movement / Lane Shift** | `W / A / S / D` or Arrows | D-Pad / Left Stick | 8-way 2.5D lane movement |
| **Standard Jab / Punch** | `J` | Button X | Fast 1-2 skinny punch |
| **Stretchy Headbutt (The Bop!)** | `K` or `→ + J` | Button B | Elastic rubber-band head snap |
| **Low Shin Grab / Trip** | `L` or `↓ + J` | Button Y | Ducks low, trips charging foes |
| **Bull Ram / Bulldozer Rush** | `U` or Double Tap `→`/`←` | Button LB | Armored rocket dash, bowls foes over |
| **Ear Twist / Cheek Pinch** | `I` | Button RB | Grapples opponent's ears with 2s stun |
| **Donkey Back Kick** | `O` or `← + J` | Button RT | Back kick to punish flankers |
| **Flying Belly Flop** | `W + J + ↓` (Airborne) | Airborne + Down + X | Heavy splash flattening foes |
| **Roundhouse Dropkick** | `W + K + →` (Airborne) | Airborne + Right + B | Horizontal airborne dropkick |
| **Macho Alien Elbow** | `W + J + ↑` (Airborne) | Airborne + Up + X | Descending elbow smash |
| **Alien Taunt / Wiggle** | `T` | Select | Wiggles antenna, charges UFO meter |
| **Cosmic Tractor Beam Super** | `Space` (at 100% Rage) | Start / LT | Screen-wide UFO abduction & zap |

---

## 🥋 Dojo Practice Gym

The Dojo offers an infinite practice mode with live tactical hints and instant spawning:
- **`[1]` Spawn Mohawk Punk**
- **`[2]` Spawn Handbag Granny (Agnes)**
- **`[3]` Spawn Attack Poodle (Barnaby)**
- **`[4]` Spawn Hoopster Basketballer (#23)**
- **`[5]` Spawn Brutus the Bouncer**
- **`[6]` Spawn Axel the Roller-Skater**
- **`[7]` Spawn Bruno the Strongman**
- **`[8]` Spawn Duke Davis Boss**
- **`[9]` Clear All Training Entities**
- **`[0]` Reset Punching Bag Dummy**
- **`[H]` Toggle Tactical Guide**

All training dummies in the Dojo inflict 0 damage so you can comfortably master dodge, jump, and counter timings!
