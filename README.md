# ⚡ Neon Breakers: Cyber Hero vs Villains 3D

A 3D endless action runner and shooter game built with **Three.js** and **Vite**. Control a Cyber Hero running down a futuristic neon cyber-highway, dodging, jumping over obstacles, and blasting Mecha-Goblin villain monsters with dual plasma lasers!

---

## 🎮 Features & Gameplay

- 🤖 **3D Volumetric Cyber Hero:** Fully articulated 3D character with running stride animations, glowing anime visor, golden chest power core, jetpack plasma flames, and dual arm cannons.
- 👾 **3D Mecha-Goblin & Drone Villains:** 3D animated villain monsters with glowing eyes, horns, and hovering drones charging down the highway.
- 💥 **Laser Combat & Explosions:** Fire dual high-speed plasma lasers to destroy villains with 3D spark explosion physics, screen shake, and bonus points (`+50`).
- ⭐ **Energy Crystals:** Collect floating golden crystals (`+20`) scattered across lanes.
- 📱 **Universal Device Support:**
  - **PC / Laptop:** Keyboard controls (`A`/`D`, `Space`, `F`) and mouse click to shoot.
  - **Mobile:** Dedicated on-screen `🦘 JUMP` and `🔥 BLAST` touch action buttons with swipe gestures.
  - **Dynamic Mobile Camera:** Automatically adjusts FOV and camera height on tall portrait phone screens so all 3 lanes are always 100% visible.
- 🔊 **Procedural Web Audio:** Real-time sound effects for laser blasting, explosions, jumping, coin pickups, and defeat with zero external asset latency.
- 🏆 **High Score Persistence:** Automatically saves your highest score to `localStorage`.

---

## 🕹️ Controls Guide

| Action | Desktop Keyboard | Mobile Touch |
|---|---|---|
| **Switch Lanes** | `A` / `D` or `←` / `→` | Swipe Left / Right |
| **Jump** | `Space` or `W` / `↑` | Tap `🦘 JUMP` Button or Swipe Up |
| **Fire Dual Lasers** | `F` or Left Click | Tap `🔥 BLAST` Button |
| **Start / Replay** | `Space` or Click Button | Tap Screen / Replay Button |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

To access on mobile, connect to the same Wi-Fi and open `http://<your-pc-ip>:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Project Structure

```text
├── index.html                  # HTML entry point with glassmorphism UI & mobile action bar
├── style.css                   # Cyberpunk styling, responsive layout, animations
├── vite.config.js              # Vite build configuration with Three.js chunking
├── package.json                # Dependencies & project metadata (v1.0.0)
├── public/
│   └── assets/
│       ├── hero.jpg            # 3D Cyber Hero character artwork
│       ├── villain.jpg         # 3D Mecha-Goblin villain artwork
│       └── banner.jpg          # 16:9 Action Battle banner
├── src/
│   ├── main.js                 # Core game loop, input listeners, state machine
│   ├── scene.js                # Three.js scene, dynamic aspect-ratio camera, track
│   ├── player.js               # 3D Cyber Hero model, running animations, jump physics
│   ├── obstacles.js            # 3D Villain monsters, drones, barriers, particle explosions
│   ├── weapons.js              # Dual plasma laser projectiles & collision logic
│   ├── collision.js            # AABB bounding box collision & crystal pickups
│   ├── storage.js              # LocalStorage persistent high scores
│   └── audio.js                # Web Audio API procedural sound synthesizer
└── docs/
    └── superpowers/
        ├── specs/              # Design specification document
        └── plans/              # Implementation plan document
```

---

## 📄 License
MIT License.
