# TNT ALIEN RUMBLE: The Vengeance of Gleep-Glorp

> **A 100% Operational, Browser-Based Beat 'em Up Homage to the 1987 Commodore 64 Classic *Bop'n Rumble* (*Street Hassle* / *Bad Street Brawler* by Melbourne House / Beam Software).**

📖 **Documentation Links:**
- 📐 [Comprehensive Technical Documentation & Architecture](file:///e:/dev/tnt-alien-rumble/TECHNICAL_DOCUMENTATION.md)
- 🎮 [Game Walkthrough, Move Reference & Combat Manual](file:///e:/dev/tnt-alien-rumble/WALKTHROUGH.md)

---

## 📖 1. Lore & Storyline
Thirty-nine Earth years ago (1987), elite Gray Alien operative **GLEEP-GLORP** disguised himself as a frail, elderly grandfather with a wooden walking stick to observe Melbourne's sidewalk culture. Out of nowhere, pumped-up meathead **DUKE DAVIS** strutted down the street in his legendary mullet and sunglasses and clobbered him into a metal trash can for no reason.

After decades of bitter exile and intense martial training in Andromeda, Gleep-Glorp returns to Earth in his UFO. Armed with forbidden alien moves—the Stretchy Headbutt, the Bull Ram, the Flying Belly Flop, the Ear Twist, and Low Shin Grab—he bops through punks, handbag-swinging grannies, leaping poodles, towering basketballers, and bulldozing bouncers to deliver Duke Davis the extraterrestrial beating of a lifetime.

---

## 🕹️ 2. Controls & Moveset Matrix

### Standard Controls
| Action | Keyboard | Mobile / Touch | Gamepad Controller |
| :--- | :--- | :--- | :--- |
| **Movement / Depth** | `Arrow Keys` or `W, A, S, D` | Virtual D-Pad | Left Analog / D-Pad |
| **Jump (Vertical/Directional)** | `W` or `Z` | D-Pad Up | Button A |
| **Standard Jab / Punch** | `J` | PUNCH Button | Button X |
| **Stretchy Headbutt (Bop!)** | `K` | BOP Button | Button B |
| **Low Shin Grab / Duck Trip** | `L` | TRIP Button | Button Y |
| **Bull Ram / Bulldozer Rush** | `U` or `Double-Tap →/←` | RAM Button | Button LB |
| **Ear Twist / Cheek Pinch** | `I` | EAR Button | Button RB |
| **Donkey Back-Kick** | `O` | — | Button RT |
| **Alien Taunt / Wiggle** | `T` | TAUNT Button | Select |
| **Cosmic UFO Super Beam** | `Space` | UFO Button | Start / LT |
| **Pause Intro Crawl** | `P` | [P] PAUSE Button | Button Start |

### Advanced Moves & Directional Combos
| Move Name | Input Combination | Description & Tactical Advantage | Frame / Damage |
| :--- | :--- | :--- | :--- |
| **Aerial Dropkick** | `W + K + Direction` | Mid-air jumping dropkick with horizontal momentum. Great for clearing obstacles. | 22 DMG / High Knockback |
| **Flying Belly Flop** | `W + J` (Airborne) | Heavy body splash flattening enemies on landing with ground dust shockwave. | 26 DMG / Knockdown |
| **Shin Sweep Trip** | `L` (Close/Mid) | Reaches low to trip opponents flat on their back. Evades flying handbags & high jabs. | 14 DMG / Instant Trip |
| **Bulldozer Ram** | `U` or `→, →` | Lower head and sprint forward. Armored against basic jabs; bowls enemies over. | 24 DMG / Heavy Stumble |
| **Ear Twist** | `I` (Close Range) | Painful grab that spins the enemy around and leaves them dazed for 2 seconds. | 18 DMG / 2s Stun |
| **UFO Tractor Beam** | `Space` (Super meter full) | Summons mothership to abduct and zap all active enemies on screen simultaneously. | 75 DMG / Screen Wipe |

---

## 🏗️ 3. Software Architecture & Subsystems

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

### Core Modules:
1. **`js/engine/physics.js`**:
   - **3-Axis Coordinate Engine**: Calculates horizontal $X$, depth lane $Y$ ($330 \le y \le 490$), and vertical jump height $Z$.
   - **Ground Shadows**: Renders dynamic projected elliptical shadows with altitude attenuation ($scale = \max(0.4, 1 - z/120)$).
   - **Flight Exemption**: Flying entities (`isFlying = true`, e.g. Agnes helicopter escape) bypass gravity and boundary clamping.
2. **`js/engine/camera.js`**:
   - **Zoom Modes**: Supports `1X Classic` and `2X Double C64 Size` with persistent `localStorage` settings.
   - **Infinite Dojo Scrolling**: Implements toroidal/seamless modulo wrapping for infinite free-roam practice.
   - **Camera Shake**: Multi-intensity screen shake on impacts, belly flops, and ground smashes.
3. **`js/engine/high-scores.js`**:
   - **Top 100 Leaderboard**: Stores 100 records in `localStorage`.
   - **Default Seed**: Rank 1 begins at **50,000 points**, decrementing by **500 points** down to 500 points for Rank 100.
   - **Level Cleared Tracking**: Records stage reached/cleared (`STAGE 1`, `STAGE 2`, `STAGE 3`, `VICTORY`).
   - **6-Character Alias**: Strict 6-character name validation (`GLEEP!`, `DUKEDV`, `AGNES!`, etc.).
4. **`js/audio/sid-synth.js`**:
   - Web Audio API emulator for the MOS 6581/8580 SID chip with Pulse-Width Modulation (PWM), 50Hz arpeggios, resonant low-pass filters, and LFSR pseudo-random noise drums.
   - 5 multi-channel chiptune tracks: *Title Theme*, *Downtown Urban Beat*, *Park & Courts*, *Duke Davis Showdown*, and *Cosmic Victory Fanfare*.
5. **`js/audio/alien-voice.js`**:
   - Formant filter bank synthesizing authentic robotic 80s alien speech: *"BOP 'EM!"*, *"OUCHIE!"*, *"EARTH SCUM!"*, *"TAKE THAT DUKE!"*, *"MY PROBE IS READY!"*, and hysterical alien victory cackle.
6. **`js/audio/sound-effects.js`**:
   - Procedural 8-bit audio generation for punches, bops, whooshes, squeaks, barking, basketball bounces, coin-jingling handbag smashes, and rotor blade flutters.
7. **`js/entities/sprite-renderer.js`**:
   - High-performance Canvas 2D vector renderer drawing authentic Commodore 64 pixel sprites for Gleep-Glorp, Duke Davis, Mohawk Punks, Handbag Granny Agnes, Barnaby the Attack Poodle, Towering Basketballer Hoops, and Brutus the Bouncer.
   - Distinct 5-second flat knockdown sprites and unique despawn effects for every enemy type.

---

## 👥 4. Enemy Roster & AI Mechanics

| Enemy Archetype | Visual Design | Combat AI & Signature Moves | Counter Strategy |
| :--- | :--- | :--- | :--- |
| **Mohawk Street Punk** | Red mohawk, leather jacket, sunglasses. | Fast switchblade stabs & mid-air flying dropkicks. | Duck under or interrupt with **`[K]` Stretchy Headbutt**. |
| **Handbag Granny (Agnes)** | Pink floral dress, hair curlers, spectacles. | • Heavy overhead purse smash.<br>• Ranged flying handbag throw.<br>• **Helicopter Flight Escape**: Spins handbag overhead and ascends into the clouds when dodged $\ge 2$ times or at low HP. | Duck under bag with **`[L]` Low Shin Grab** or jump with **`[W]`**. |
| **Barnaby the Poodle** | White fluffy show-cut poodle with pink bow. | Low-altitude sprint and snapping mid-air ankle leap. | Jump over with **`[W]`** or trip with **`[L]` Low Shin Grab**. |
| **Hoopster Basketballer** | 84px tall (2X height), jersey #23, high fade afro. | • Active pavement dribbling.<br>• **Bouncing Basketball Throw**: Physical ball with 2.5D elastic hops.<br>• Towering overhand dunk. | Jump over bouncing ball with **`[W]`** and close in with **`[U]` Bull Ram**. |
| **Brutus the Bouncer** | Barrel-chested, blue/black checkered flannel shirt, shades. | • **Bulldozer Charging Tackle**: High-speed charging belly rush.<br>• Overhead double-fist hammer smash with screen shake. | Jump over charge with **`[W]`** or counter-ram with **`[U]` Bulldozer Headbutt**. |
| **Duke Davis (Final Boss)** | Golden tank top, mullet, shades, boxing gloves. | • **Phase 1**: Quick jabs, roundhouses, and flying dragon kicks.<br>• **Phase 2 (Enraged)**: Glowing red aura, belly suplex grabs, comic speech bubbles (*"I'M GONNA BOP YA!"*). | Dodge suplexes with vertical lane movement, soften with **`[W+J]` Belly Flop**, and finish with UFO Super. |

---

## 💾 5. High Score System & Persistence

- **Storage Key**: `localStorage['tnt_high_scores_top100_v1']`
- **Leaderboard Format**:
  ```json
  [
    { "rank": 1, "name": "GLEEP!", "score": 50000, "stage": "VICTORY", "date": "1987-08" },
    { "rank": 2, "name": "DUKEDV", "score": 49500, "stage": "STAGE 3", "date": "1987-08" },
    ...
    { "rank": 100, "name": "NOISE8", "score": 500, "stage": "STAGE 1", "date": "1987-08" }
  ]
  ```
- **Leaderboard Modal**: Interactive C64 Hall of Fame modal accessible from the Main Menu, Game Over screen, and Victory screen with view tabs for **`[TOP 10]`**, **`[TOP 50]`**, and **`[ALL 100]`**.

---

## 🚀 6. Roadmap for v2.0

1. **2-Player Local Co-Op**:
   - Player 2 as **Zorblax** (skinny green alien with eye stalks and unique moveset: Tentacle Whip, Slime Slide, and Plasma Sneeze).
2. **Additional Enemy Classes**:
   - Roller-Skating Disco Dude, Skateboarding Teen, and Construction Jackhammer Brawler.
3. **Interactive Sidewalk Hazards**:
   - Open manholes with steam, slippery banana peels, and speeding yellow taxi cabs.
4. **Weapon Pickups & Throwables**:
   - Broken bottle shards, wooden 2x4 planks, and throwable bowling balls.
5. **Enhanced CRT Post-Processing**:
   - Optional WebGL retro CRT shader with barrel distortion, phosphor glow, and color fringing.
