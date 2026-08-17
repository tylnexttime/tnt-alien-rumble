# TNT ALIEN RUMBLE v2.0: The Vengeance of Gleep-Glorp

> **A 100% Operational Browser Beat 'Em Up Homage to the 1987 Classic *Bop'n Rumble* (*Street Hassle* / *Bad Street Brawler* by Melbourne House / Beam Software), elevated to Commodore Amiga 500 (OCS 32-Color / Deluxe Paint IV) Graphical Fidelity.**

📖 **Documentation Links:**
- 📐 [Comprehensive Technical Documentation & Architecture](file:///e:/dev/tnt-alien-rumble/TECHNICAL_DOCUMENTATION.md)
- 🎮 [Game Walkthrough, Move Reference & Combat Manual](file:///e:/dev/tnt-alien-rumble/WALKTHROUGH.md)

---

## 📖 1. Lore & Storyline
Thirty-nine Earth years ago (1987), elite Gray Alien operative **GLEEP-GLORP** disguised himself as a frail, elderly grandfather with a wooden walking stick to observe Melbourne's sidewalk culture. Out of nowhere, pumped-up meathead **DUKE DAVIS** strutted down the street in his legendary mullet and sunglasses and clobbered him into a metal trash can for no reason.

After decades of bitter exile and intense martial training in Andromeda, Gleep-Glorp returns to Earth in his UFO. Armed with forbidden alien moves—the Stretchy Headbutt, the Bull Ram, the Flying Belly Flop, the Ear Twist, and Low Shin Grab—he bops through punks, handbag-swinging grannies, leaping poodles, towering basketballers, bulldozing bouncers, roller-skaters, and barbell-wielding strongmen to deliver Duke Davis the extraterrestrial beating of a lifetime.

---

## 🎨 2. Amiga 500 Quality & Architectural Features
- **Copper Sky Gradients**: Multi-stop OCS copper raster gradient bars simulating atmospheric twilight, dusk, and starry night horizons.
- **Running-Bond Textured Brickwork**: Procedural individual brick mortar lines, masonry bevels, and base grime weathering.
- **Architectural Cornices & Dentil Moldings**: Multi-tiered Victorian stone cornices with dentil blocks and cast drop shadows.
- **Deluxe Windows**: Beveled frames, stone sills with cast drop shadows, half-drawn venetian/floral blinds, and warm interior silhouettes.
- **Wrought-Iron Fire Escapes**: Multi-story zigzag stairs, landing gratings, safety railings, and wall-cast drop shadows.
- **Window A/C Units with Water Drips**: Window-mounted cooling units with cooling louvers that drip water droplets onto the sidewalk.
- **3D Striped Storefront Awnings**: Scalloped canvas edges with alternating colors, realistic lighting, and fabric folds.
- **Glowing Neon Channel Signs**: Outer neon tube buzz and glow with backing channel mounts.
- **Atmospheric Street Details**: Cast-iron sewer grates with rising steam plumes, waffle-pattern manholes, and Victorian street lamps with warm radial light cones pooling on the pavement.

---

## 🕹️ 3. Controls & Moveset Matrix

### Standard Controls
| Action | Keyboard | Mobile / Touch | Gamepad Controller |
| :--- | :--- | :--- | :--- |
| **Movement / Depth** | `Arrow Keys` or `W, A, S, D` | Virtual D-Pad | Left Analog / D-Pad |
| **Jump (Vertical/Directional)** | `W` or `Z` | D-Pad Up | Button A |
| **Standard Jab / Punch** | `J` | PUNCH Button | Button X |
| **Stretchy Headbutt (The Bop!)** | `K` or `→ + J` | BOP Button | Button B |
| **Low Shin Grab / Duck Trip** | `L` or `↓ + J` | TRIP Button | Button Y |
| **Bull Ram / Bulldozer Rush** | `U` or `Double-Tap →/←` | RAM Button | Button LB |
| **Ear Twist / Cheek Pinch** | `I` | EAR Button | Button RB |
| **Donkey Back-Kick** | `O` or `← + J` | — | Button RT |
| **Alien Taunt / Wiggle** | `T` | TAUNT Button | Select |
| **Cosmic UFO Super Beam** | `Space` (at 100% Rage) | UFO Button | Start / LT |
| **Pause Intro Crawl** | `P` | [P] PAUSE Button | Button Start |

### Advanced Moves & Directional Combos
| Move Name | Input Combination | Description & Tactical Advantage | Frame / Damage |
| :--- | :--- | :--- | :--- |
| **Aerial Dropkick** | `W + K + Direction` | Mid-air jumping dropkick with horizontal momentum. Great for clearing obstacles. | 22 DMG / High Knockback |
| **Flying Belly Flop** | `W + J + ↓` (Airborne) | Heavy body splash flattening enemies on landing with ground dust shockwave. | 26 DMG / Knockdown |
| **Macho Alien Elbow** | `W + J + ↑` (Airborne) | Descending elbow smash from the top turnbuckle of space! | 30 DMG / Heavy Smash |
| **Shin Sweep Trip** | `L` (Close/Mid) | Reaches low to trip opponents flat on their back. Evades flying handbags & high jabs. | 14 DMG / Instant Trip |
| **Bulldozer Ram** | `U` or `→, →` | Lower head and sprint forward. Armored against basic jabs; bowls enemies over. | 28 DMG / Heavy Stumble |
| **Ear Twist** | `I` (Close Range) | Painful grab that spins the enemy around and leaves them dazed for 2 seconds. | 26 DMG / 2s Stun |
| **UFO Tractor Beam** | `Space` (Super meter full) | Summons mothership to abduct and zap all active enemies on screen simultaneously. | 75 DMG / Screen Wipe |

---

## 👥 4. Enemy Roster & AI Mechanics

| Enemy Archetype | Visual Design | Combat AI & Signature Moves | Counter Strategy |
| :--- | :--- | :--- | :--- |
| **Mohawk Street Punk (Spike)** | Red mohawk, studded leather biker jacket, sunglasses, ripped denim. | Fast switchblade stabs & mid-air flying dropkicks. | Duck under dropkicks or interrupt with **`[K]` Stretchy Headbutt**. |
| **Handbag Granny (Agnes)** | Floral print dress, pearl necklace, hair curlers, cat-eye spectacles. | • Heavy overhead purse smash (spills coins).<br>• Ranged flying handbag boomerang throw.<br>• **Umbrella Shield Block**: Deflects all frontal attacks (0 DMG!).<br>• **Helicopter Escape**: Spins purse like rotor blades and flies off the top of the screen! | Duck under purse with **`[L]` Shin Grab**; do not hit during umbrella block. |
| **Barnaby the Poodle / Bulldog** | Fluffy groomed poodle / muscular bulldog with spiked collar, pink bow. | • Fast low-profile sprint.<br>• **Sonic Bark Stun**: Emits shockwaves that stagger fighters.<br>• **Ankle Latch Bite**: Latches onto player's ankle. | Jump over with **`[W]`** or trip flat with **`[L]` Low Shin Grab**. |
| **Hoops Basketballer (#23)** | 84px tall athletic physique, jersey #23, high fade afro, high-top sneakers. | • Active pavement dribbling.<br>• **Bouncing Basketball Throw**: Physical ball with 2.5D elastic hops.<br>• **Monster Dunk Slam**: Leaping slam with ground shockwave. | Jump over bouncing balls with **`[W]`** and close in with **`[U]` Bull Ram**. |
| **Brutus the Bouncer** | Barrel-chested, blue/black checkered flannel shirt, brass knuckles, work boots. | • **Bulldozer Charging Tackle**: Armored belly rush.<br>• **Ground Pound**: Two-fist hammer smash with screen shake.<br>• **360° Airplane Spin**: Grapples Gleep-Glorp, spins him overhead, and hurls him across the lane! | Jump over charge with **`[W]`** or soften with **`[W+J]` Belly Flop**. |
| **[NEW] Axel the Roller-Skater** | Backwards neon cap, tinted visor, retro 80s roller skates with spinning wheels, boombox. | High-speed slalom skating, drive-by strikes, and 360° spin kicks. | Intercept with **`[K]` Stretchy Headbutt** or trip with **`[L]` Low Shin Grab**. |
| **[NEW] Bruno the Strongman** | Red-and-white striped circus singlet, huge handlebar mustache, 100KG barbell. | • **Whirling Barbell Spin**: 360° whirlwind spin (invulnerable during spin!).<br>• Overhead heavy iron barbell toss. | Keep distance during whirlwind spin; strike from behind with **`[O]` Donkey Kick**. |
| **Duke Davis (Final Boss)** | Golden tank top, feathered mullet, mirrored aviator shades, boxing wraps. | • **Phase 1**: Rapid jab-hook combos, dragon kicks, counter-suplex.<br>• **Phase 2 (Enraged)**: Glowing green/cyan aura, dialogue taunts (*"MY 1987 MULLET IS INVINCIBLE!"*), and earthquake stomps. | Dodge suplexes vertically, soften with combos, and finish with UFO Super! |

---

## 🏗️ 5. Software Architecture & Subsystems

```mermaid
graph TD
    GameEngine[GameEngine (game.js)] --> Input[InputHandler (input.js)]
    GameEngine --> Physics[PhysicsEngine (physics.js)]
    GameEngine --> Camera[Camera (camera.js)]
    GameEngine --> Particles[ParticleSystem (particle.js)]
    GameEngine --> HighScores[HighScoreManager (high-scores.js)]
    GameEngine --> Cutscenes[CutsceneManager (cutscenes.js)]
    GameEngine --> StageRenderer[StageRenderer (stage-data.js)]
    GameEngine --> SpriteRenderer[SpriteRenderer (sprite-renderer.js)]
    GameEngine --> SidSynth[SidSynthesizer (sid-synth.js)]
    GameEngine --> SoundFX[SoundEffects (sound-effects.js)]
    GameEngine --> AlienVoice[AlienVoiceSynth (alien-voice.js)]

    GameEngine --> Player[Player (player.js)]
    GameEngine --> Enemies[Enemy (enemies.js)]
    GameEngine --> Boss[DukeBoss (boss.js)]
    GameEngine --> Props[StreetProp & Projectiles (props.js)]
```

### Core Subsystems:
1. **`js/engine/physics.js`**: 3-Axis coordinate engine ($X, Y, Z$) with depth-lane collision sorting, projected elliptical ground shadows with altitude attenuation, and flight mode gravity exemption.
2. **`js/engine/camera.js`**: Dual zoom scaling (`1X Classic` vs `2X Double C64/Amiga Size`), infinite toroidal wrapping in Dojo mode, and camera screen shake.
3. **`js/engine/high-scores.js`**: Top 100 Leaderboard stored in `localStorage` with 50,000-to-500 default seed, level cleared tracking, and 6-character alias validation.
4. **`js/audio/sid-synth.js`**: MOS 6581/8580 SID emulation engine with PWM, 50Hz arpeggiation, resonant low-pass filters, and 5 chiptune tracks.
5. **`js/audio/alien-voice.js`**: Formant filter bank synthesizing robotic 80s alien speech lines.
6. **`js/audio/sound-effects.js`**: Web Audio API procedural synthesis for punches, bops, whooshes, skates, barbells, umbrella shield blocks, dog bites, and water drips.
7. **`js/entities/sprite-renderer.js`**: Canvas 2D Amiga 500 (OCS 32-color) vector sprite renderer with 4-tone shading ramps, micro-dithering, and articulated animations.
8. **`js/stages/stage-data.js`**: Copper sky raster bars, running-bond brickwork, 3D awnings, fire escapes, dripping A/C units, and neon channel signs.

---

## 💾 6. High Score System & Persistence

- **Storage Key**: `localStorage['tnt_high_scores_top100_v1']`
- **Leaderboard Modal**: Interactive Hall of Fame modal accessible from Main Menu, Game Over screen, and Victory screen with view tabs for **`[TOP 10]`**, **`[TOP 50]`**, and **`[ALL 100]`**.
