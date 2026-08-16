# TNT ALIEN RUMBLE - The Vengeance of Gleep-Glorp (C64 Homage)

**TNT Alien Rumble** is a 100% operational, browser-based beat 'em up inspired by the Commodore 64 classic *Bop'n Rumble* (*Street Hassle* / *Bad Street Brawler* by Melbourne House / Beam Software, 1987).

---

## 🕹️ Key Features & Authenticity Highlights

### 1. Retro Aesthetics & Homage
- **C64 Visual Style**: Faithfully renders the 16-color Commodore 64 palette, CRT scanline curvature, street facades, brick patterns, and neon signage.
- **Star Wars Style 3D Intro Text Crawl**:
  - Dramatic perspective-tilted escaping text crawl setting up the story:
    > *In 1987, Gray Alien operative **GLEEP-GLORP** disguised himself as a frail grandfather with a wooden cane to study Earth sidewalk culture. Duke Davis strutted by in his mullet and sunglasses and clobbered him into a trash can. After 39 cosmic years in Andromeda, Gleep-Glorp returns in his saucer for ultimate payback!*
  - **Pausable with `[P]`**: Press **`[P]`** or click the on-screen **`[P] PAUSE`** button / indicator at any time to pause the crawling text so you can read at your own pace, and press **`[P]`** again to resume.
  - **Skip**: Press **`[SPACE]`**, **`[ENTER]`**, **`[ESC]`**, or click **`[SKIP]`** to skip directly to the menu.
- **Game View Zoom / Scale Option (`1X` vs `2X`)**:
  - **`2X DOUBLE (C64)`**: Zooms the camera in for massive, authentic Commodore 64 character sprite dimensions where characters take up ~25-30% of screen height and street details are bold and chunky!
  - **`1X CLASSIC`**: Wide-angle street view.
  - Switchable at any time in the **Options** menu (saved persistently in `localStorage`).

### 2. Full C64 Moveset & Aerial Physics
- **Directional Arc Jumping & Mid-Air Steering**:
  - Jumping (`W` or `Z`) while holding directional arrow keys now launches Gleep-Glorp in a smooth physics arc across the sidewalk so you can jump over low attackers like Attack Poodles, fire hydrants, and fallen trash cans.
  - While airborne, directional arrows provide mid-air steering.
  - Airborne combat combinations (`W + K + ArrowRight` for directional Dropkick, `W + J + ArrowDown` for Flying Belly Flop, and `W + J` for Macho Elbow) carry directional momentum forward.
- **The Exact Bop 'N Rumble Moves List**:
  - **Standard Jab** (`J`)
  - **Stretchy Headbutt (The Bop)** (`K` or `→ + J`)
  - **Low Shin Grab / Trip** (`L` or `↓ + J`)
  - **Bull Ram / Bulldozer** (`U` or Double Tap `→`/`←`)
  - **Ear Twist / Cheek Pinch** (`I`)
  - **Flying Belly Flop** (`W + J + ↓`)
  - **Roundhouse Dropkick** (`W + K + →`)
  - **Macho Alien Elbow** (`W + J + ↑`)
  - **Donkey Back Kick** (`O` or `← + J`)
  - **Alien Taunt (Wiggle)** (`T`)
  - **Cosmic Tractor Beam Super** (`Space` with 100% UFO Meter)

### 3. Horizontal Defeated Sprites & 5-Second Unique Dissolve Effects
- **Horizontal Defeated Animations**: Every enemy type now drops flat horizontally upon defeat with unique comedic sprites:
  - **Mohawk Punk**: Flat on back with leather jacket, sunglasses askew, red mohawk touching the pavement.
  - **Handbag Granny (Agnes)**: Sprawled on back, floral dress splayed, curlers popping off, handbag open spilling coins/candies.

### 4. Authentic C64 Enemy Arsenal & Signature Attacks
- **Handbag Granny Agnes**:
  - **Ranged Handbag Throw**: From mid-range, Agnes winds up and hurls her heavy brown handbag with its golden clasp spinning horizontally across the street at chest height!
  - **Dodge Counters**: Duck under with **`[L]` Low Shin Grab** or leap over with **`[W]`** to see the purse sail harmlessly overhead with a green `"DUCKED!"` comic pop!
  - **Helicopter Handbag Flight Escape**: When dodged multiple times or at low health, Agnes grips her handbag straight up, spins it rapidly like helicopter rotor blades (with a clean, rhythmic 8-bit cartoon rotor flutter sound), and flies freely upward off the top of the screen into the clouds unobstructed by 2.5D street boundaries or gravity, with a cheeky `"TALLY HO, DEARIE!"`!
  - **Close Range**: Massive overhead leather handbag smash!
- **Hoopster Basketballer (#23 Jersey)**:
  - **Towering C64 Proportions**: Fully redesigned with tall gangly legs (84px height, twice normal character height), high-top sneakers, high-waisted shorts, and authentic side-profile face with high fade/afro matching the original Melbourne House C64 screenshot!
  - **Active Dribbling**: Walk animation realistically dribbles an orange basketball on the pavement with responsive arm motion.
  - **Bouncing Basketball Throw**: Launches an orange rubber basketball that bounces with 2.5D elastic gravity physics across the asphalt towards the player!
  - **Jump Counter**: Leap over the bouncing ball with **`[W]`** to clear it cleanly (`"JUMPED OVER!"`).
  - **Close Range**: Massive towering overhand dunk slam!
- **Brutus the Bouncer**:
  - **Checkered Flannel Street Brawler**: Redrawn with stout muscular build, blue/black checkered flannel shirt, and sunglasses matching the C64 reference screenshot.
  - **Bulldozer Charging Tackle (`charge_tackle`)**: At mid-range, Brutus lowers his head, tucks his arms, and charges forward at high speed in an unstoppable bulldoze rush that bowls over the player with `"BULLDOZED!"` and heavy screen shake!
  - **Overhead Double-Fist Ground Smash (`attack`)**: Raises two giant fists overhead and slams the asphalt with heavy camera screen shake and dust shockwaves!
- **Mohawk Street Punk**:
  - **Switchblade Stab**: Rapid knife lunge at close range.
  - **Flying Dropkick**: Mid-range aerial leap with both studded boots extended horizontally!
- **Attack Poodle**:
  - **Leaping Ankle Strike**: Fast sprint into a snapping mid-air ankle lunge with retro 8-bit yelps!
- **Active Combat & Dynamic Distance Switching**:
  - Enemies smoothly alternate between hanging back to throw projectiles and closing in for heavy melee attacks without getting locked at long distance.
  - In Dojo mode, all attacks connect with zero damage and show `"PRACTICE!"` / `"BLOCKED!"` so you can comfortably train dodge and counter timings!
- **Dojo Boss Defeat Protection**: Defeating the Duke Davis dummy in the Dojo no longer triggers the Victory ending cutscene. It allows continuous sparring and training without kicking you out.
- **Dedicated Volume Sliders & Instant Startup Persistence**:
  - 4 separate retro sliders for **Master Volume**, **Music (SID Chip)**, **Effects (8-Bit SFX)**, and **Voices (Alien Formant)**.
  - Automatically loads and applies user volume preferences directly to the Web Audio synthesis sub-buses on startup so even extreme low volumes (e.g. 2%) are respected immediately without needing to re-drag sliders.
- **Main Menu Audio Cutoff**: Stops all background music immediately upon returning to the Main Menu.
- **SID-Chip Multi-Channel Music Engine**: Web Audio API synthesizer emulating the MOS 6581/8580 SID chip (Pulse Wave PWM, 50Hz Arpeggiator, Resonant Filter Bass, and 8-bit Noise Drums). Includes 5 tracks: *Title Theme*, *Downtown Urban Beat*, *Park & Courts*, *Duke Davis Showdown*, and *Cosmic Victory Fanfare*.
- **Low-Poly Formant Alien Speech Synthesizer**: Formant filter bank synthesizing real-time 80s robotic voice lines:
  - *"BOP 'EM!"*
  - *"OUCHIE!"*
  - *"EARTH SCUM!"*
  - *"TAKE THAT DUKE!"*
  - *"MY PROBE IS READY!"*
  - *"KLAATU BARADA BOP!"*
  - *Hysterical alien victory cackle!*
- **Procedural 8-Bit Sound FX**: Bops, thuds, springy headbutts, dog yips, handbag whacks, trash can crashes, and UFO hums.

### 5. Commodore 64 Hall of Fame & Top 100 Leaderboard
- **Top 100 Persistent Records**:
  - Full **Top 100** high scores stored in `localStorage` (`tnt_high_scores_top100_v1`).
  - **Authentic Default Seed**: Rank 1 starts at **50,000 points**, with every subsequent rank descending by **500 points** down to 500 points for Rank 100.
  - **Level Cleared Tracking**: Every leaderboard entry displays the exact stage reached/cleared (`STAGE 1`, `STAGE 2`, `STAGE 3`, or `VICTORY`).
  - **6-Character Player Alias**: Names are strictly formatted to **6 characters or less** (e.g. `GLEEP!`, `DUKEDV`, `AGNES!`, `HOOPS!`, `BRUTUS`, `MELBRN`, `BEAMSF`, `C64BOB`).
- **Direct Main Menu Access**:
  - `[ TOP 100 HIGH SCORES ]` button on the main menu opens the **Commodore 64 Hall of Fame** modal.
  - Quick-switch view tabs for **`[ TOP 10 ]`**, **`[ TOP 50 ]`**, and **`[ ALL 100 ]`**.
  - Gold (`🥇 #1`), Silver (`🥈 #2`), and Bronze (`🥉 #3`) podium styling.
  - `[ RESET DEFAULTS ]` button to restore the initial 50,000-to-500 seed at any time.
- **Decisive Game Over & Name Entry**:
  - Once the player loses all their lives (`lives <= 0`), the game immediately transitions to **GAME OVER**.
  - If the player's score qualifies for the Top 100, an animated retro name entry box appears:
    - `"★ NEW HIGH SCORE RECORD! ★"`
    - 6-character uppercase input field with instant keyboard `Enter` submission.
    - Automatically opens the Leaderboard and highlights the player's newly achieved rank with glowing animation (`.highlight-row`).
  - Same high score recording workflow triggers upon completing Stage 3 and achieving **Cosmic Victory**.

### 6. Infinite Dojo / Practice Gym & Tactical Enemy Intel
- **Infinite Seamless Cityscape**: The Dojo street scene now loops infinitely in both directions (`camera.isInfinite = true`) with modular 2.5D building facades, neon signs, and continuous sidewalks so you can wander and train as far as you want without running into black voids.
- **"LET ME TRY" Free Play Mode**: Completely dismisses the guide overlay without screen dimming for an unobstructed view.
- **Tactical Enemy Defeat Hints (Excludes Boss)**:
  - When spawning standard enemies in the Dojo, an animated tactical intel pill appears giving exact counters for that enemy:
    - **1. Mohawk Punk**: *"COUNTER PUNK: Fast switchblades! Interrupt with [K] Stretchy Headbutt or [U] Bull Ram."*
    - **2. Handbag Granny**: *"COUNTER GRANNY: Agnes swings heavy handbags! Duck under with [L] Low Shin Grab or [W+K] Dropkick."*
    - **3. Attack Poodle**: *"COUNTER POODLE: Low-altitude ankle-biter! Jump over with [W] or trip flat using [L] Low Shin Grab."*
    - **4. Hoopster B-Baller**: *"COUNTER B-BALLER: Bounces ball projectiles! Close the gap with [U] Bulldozer Ram or [I] Ear Twist."*
    - **5. Brutus the Bouncer**: *"COUNTER BOUNCER: Heavy armored brawler! Soften him with [W+J] Belly Flop or baffle with [T] Taunt."*
    - *(Final Boss Duke Davis does not display hints).*
  - **Menu Option**: Toggle **"DOJO ENEMY COMBAT HINTS: [ENABLED / DISABLED]"** in the Options menu to control hint popups.
- **Live Enemy Spawner (Keys `1`–`0` & Toolbar)**:
  - `1`: Spawn Mohawk Punk
  - `2`: Spawn Handbag Granny (Agnes)
  - `3`: Spawn Attack Poodle (Barnaby)
  - `4`: Spawn Hoopster Basketballer
  - `5`: Spawn Brutus the Bouncer
  - `6`: Spawn Duke Davis (Boss Dummy)
  - `7`: Spawn Breakable Trash Can
  - `8`: Spawn Fire Hydrant
  - `9`: Clear All Spawned Training Enemies
  - `0`: Reset / Respawn Duke Punching Bag
  - `H`: Toggle Guide Overlay on/off at any time.
  - *Training dummies do 0 damage to Gleep-Glorp, while Gleep-Glorp deals real damage, knockbacks, aerial stumbles, and combos!*

### 7. Menu & Lifecycle Initialization Stability
- **Clean Method Structure**: Fixed method closure syntax in `GameEngine`'s `initUI()`, `initVolumeSliders()`, and `initHighScoresUI()` so all event listeners on the main menu, options, and modals attach cleanly and reliably upon `DOMContentLoaded`.
- **Dojo & Stage Data Initialization**: Explicitly ensures `window.game.currentStageData` and camera bounds are active upon entering the Dojo practice gym, allowing immediate practice without screen blackouts or navigation halts.
- **Top 100 Leaderboard**: Directly accessible from the main menu, with fully interactive tabs for Top 10, Top 50, and All 100, plus default 50k-to-500 seed restoration.

---

## 🎮 How to Play

Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Controls
| Action | Keyboard | Touch Gamepad | Gamepad Controller |
| :--- | :--- | :--- | :--- |
| **Move / Depth** | `Arrow Keys` or `WASD` | Virtual D-Pad | Left Analog Stick / D-Pad |
| **Jump** | `W` / `Z` | D-Pad Up | Button A |
| **Jab / Punch** | `J` | PUNCH Button | Button X |
| **Headbutt (Bop!)** | `K` | BOP Button | Button B |
| **Low Trip / Shin** | `L` | TRIP Button | Button Y |
| **Bull Ram / Dash** | `U` or `Double-Tap →` | RAM Button | Button LB |
| **Ear Twist** | `I` | EAR Button | Button RB |
| **Donkey Kick** | `O` | - | Button RT |
| **Taunt / Wiggle** | `T` | TAUNT Button | Select |
| **Cosmic Super** | `Space` | UFO Button | Start / LT |

---

## 📚 8. Technical Documentation & Codebase Architecture

Complete architectural and mathematical specifications are documented in:
- **Repository README**: [README.md](file:///e:/dev/tnt-alien-rumble/README.md)
- **Engine Technical Architecture**: [TECHNICAL_DOCUMENTATION.md](file:///e:/dev/tnt-alien-rumble/TECHNICAL_DOCUMENTATION.md)
- **Project Walkthrough & Reference**: [WALKTHROUGH.md](file:///e:/dev/tnt-alien-rumble/WALKTHROUGH.md)

### Key Architectural Systems Documented:
1. **2.5D Coordinate Engine**: Horizontal $X$, depth lane $Y$ ($330 \le y \le 490$), vertical jump height $Z$, and projected ground shadow scaling.
2. **Entity State Machines**: Player 11-move frame data matrix, recovery timers, and hitbox collision resolution.
3. **Specialized Enemy AI**: Granny Agnes helicopter evasion, towering Basketballer bouncing ball trajectory, and Brutus bulldozer tackle mechanics.
4. **SID Chip Emulation**: Multi-channel PWM pulse wave synthesis, 50Hz arpeggiator, resonant low-pass filtering, and noise generator.
5. **Formant Voice Synthesizer**: Glottal impulse oscillator through triple-bandpass vowel filters (/a/, /e/, /i/, /o/, /u/).
6. **Top 100 High Scores Leaderboard**: Persistent `localStorage` engine with default 50,000-to-500 seed, 6-character aliases, and level cleared tracking.

---

## 🚀 9. Version 2.0 Roadmap & Extension Hooks

The v1.0 architecture is designed with modular extension points for future v2.0 development:
1. **2-Player Local Co-Op**: Secondary player entity (`Zorblax` - green alien with eye stalks, Tentacle Whip, and Slime Slide) with dual-gamepad and keyboard splits.
2. **Throwable Street Weapon Subsystem**: Interactive props (broken glass bottles, 2x4 wooden planks, trash can lids, and throwable bowling balls).
3. **New Enemy Archetypes**: Roller-Skating Disco Dude, Skateboarding Teen, and Construction Jackhammer Brawler.
4. **Interactive Sidewalk Hazards**: Steaming manholes, slippery banana peels, and speeding yellow taxi cabs.
5. **WebGL CRT Shader Pipeline**: Full hardware-accelerated curved phosphor barrel distortion, bloom, and scanline beam decay.
