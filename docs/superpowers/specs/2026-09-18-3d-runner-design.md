# 3D Runner - Design Specification

**Date:** 2026-09-18
**Status:** Approved

## 1. Overview

A minimalist 3D endless runner mini-game built with Three.js and Vanilla JS. Players control a cube that jumps and switches lanes to dodge obstacles while speed increases over time.

## 2. Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Vite + Vanilla JS | Fast dev server, minimal bundling |
| 3D Engine | Three.js | ~60kb minified+gzipped |
| Styling | CSS3 | Flexbox/Grid for UI overlays |
| Build Tool | Vite | `npm run dev` / `npm run build` |
| Hosting | Any static host | Netlify, Vercel, GitHub Pages |

## 3. Core Gameplay

### Movement System
- **Camera:** Follows player at fixed offset (player stays at world position 0,0,0)
- **World Movement:** Everything moves in -Z direction (simulates forward motion)
- **Speed:** Starts at 10 units/sec, increases by 1 unit every 30 seconds

### Controls

| Input | Action | Device |
|-------|--------|--------|
| `Space` / `Up Arrow` | Jump | Desktop |
| `Left` / `Right` Arrow | Switch lanes | Desktop |
| Tap | Jump | Mobile |
| Swipe Left/Right | Switch lanes | Mobile |

### Scoring
- Score increments based on distance traveled
- 1 point every 10 units moved
- Displayed in top-right corner

### Game Over
- Triggered by AABB collision between player and obstacle
- Shows final score and high score (localStorage)
- Restart button resets game state

## 4. Visual Design

### Objects
| Element | Shape | Color | Animation |
|---------|-------|-------|-----------|
| Player | Cube | #3498db (Blue) | Rotates when jumping |
| Obstacle | Rectangular Prism | #e74c3c (Red) | None |
| Ground | Plane with grid | #95a5a6 (Gray) | Moves with world |
| Background | Solid | #ffffff (White) | Static |

### Lighting
- Directional light at 45° angle
- No shadows (performance optimization for mobile)
- Ambient light for base illumination

### Procedural Generation
- Random spacing between obstacles (5-15 units)
- Random lane assignment (0, 1, or 2)
- Fixed obstacle width, randomized height (2-5 units)

## 5. UI Structure

### Start Screen
- Title: "3D Runner"
- Subtitle: "Tap or Space to start"
- Fades out on first interaction

### HUD
- Score counter (top-right)
- High score (smaller text below)

### Game Over Overlay
- Semi-transparent dark background
- Final score (large)
- High score (small)
- "Play Again" button

## 6. File Structure

```
root/
├── index.html
├── style.css
├── vite.config.js
├── package.json
├── src/
│   ├── main.js          # Entry point, game loop
│   ├── scene.js         # Three.js scene setup
│   ├── player.js        # Jump + lane logic
│   ├── obstacles.js     # Spawning + movement
│   ├── collision.js     # AABB detection
│   └── storage.js       # localStorage high scores
└── README.md
```

## 7. Technical Specifications

### Physics (Simplified)
- Jump force: 15 units/sec
- Gravity: 30 units/sec²
- Lane width: 3 units
- Lane positions: -3, 0, 3

### Collision Detection
- Axis-Aligned Bounding Box (AABB)
- Player bounds: 1x1x1 cube
- Obstacle bounds: Variable (1x2-5x1)

### Performance Targets
- 60 FPS on modern desktop
- 30 FPS on mid-range mobile
- Bundle size < 100kb

## 8. Testing Checklist

- [ ] Jump height and duration feel right
- [ ] Lane switching is responsive
- [ ] Obstacles spawn consistently
- [ ] Collision detection is fair (no false positives)
- [ ] Mobile touch controls work
- [ ] High score persists after refresh

## 9. Future Enhancements (Not in Scope)

- Particle effects on jump
- Sound effects
- Power-ups
- Multiplayer leaderboard
- Different game modes
