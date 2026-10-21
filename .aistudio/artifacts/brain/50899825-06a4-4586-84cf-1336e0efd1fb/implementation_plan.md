# Implementation Plan: QUBOT Multi-Frame Mascot Animation & Deployment

This plan outlines the technical specifications for your sprite sheet, the architecture of the sprite animation engine, and the final deployment checklist.

---

## 1. Specifications for the Multi-Frame PNG Sprite Sheet

To ensure smooth animation across all bot contacts, here is what you can prepare:

### Recommended Formats (Choose Either One):
- **Option A: Horizontal Strip (Most Recommended)**:
  - All frames placed in a single row from left to right.
  - Transparent PNG background.
  - Example: 6 frames of 256×256px = 1536×256px total image dimension.
- **Option B: Grid Sprite Sheet**:
  - Arranged in rows and columns (e.g., 2 rows × 4 columns = 8 frames).
- **Option C: Separate Sequential PNG Files**:
  - `owl_idle_1.png`, `owl_idle_2.png`, `owl_idle_3.png`, `owl_idle_4.png`
  - `owl_talk_1.png`, `owl_talk_2.png`, `owl_talk_3.png`

### Recommended Animation States:
1. **Idle State** (Looping, ~4–8 frames):
   - Eye blink / glasses glow pulse.
   - Gentle breathing movement of head/feathers.
2. **Thinking / Processing State** (Looping, ~4–6 frames):
   - Glowing digital visor / ear antenna lights.
   - Head tilting or scanning motion while the AI generates responses or executes sandbox tasks.
3. **Speaking State** (Looping, ~4–6 frames):
   - Beak moving up and down when playing voice synthesis or streaming text.

---

## 2. Proposed Architecture for the Sprite Animation Engine

### Component: `SpriteMascotAvatar.tsx`
- **Dynamic CSS Steps Engine**:
  - Uses CSS `steps(N)` and `background-position` or `requestAnimationFrame` for 60 FPS performance without memory overhead.
- **State Integration**:
  - Hooks directly into active agent state:
    - Automatically plays `idle` when waiting.
    - Switches to `thinking` when the agent status is `executing`.
    - Switches to `speaking` when Text-to-Speech audio is playing.
- **Dynamic Color Tinting Preserved**:
  - The CSS `filter: hue-rotate(...)` engine will apply directly on the animated sprite sheet, meaning every bot will still have its custom signature color (Crimson, Royal Violet, Emerald, Sky Blue, Cyber Teal, etc.) and custom 360° color wheel adjustments!
- **Zero-Downtime Fallback**:
  - Until you upload the new sprite sheet file, the engine automatically falls back to your existing high-res single-frame mascot, with gentle CSS float/pulse motion so it never displays an empty image or broken link.

---

## 3. Deployment Checklist

Once you review and approve this plan, the application is already confirmed build-ready:
1. `npm run build` generates production bundle in `dist/`.
2. TypeScript compilation (`tsc --noEmit`) passes with 0 errors.
3. Vite asset serving configured for `/assets/aistudio/...`.
4. All local-first sandboxes, Composio tool hubs, and multi-model API vaults are self-contained.

---

## 4. Next Steps
1. Review this implementation plan and click **Proceed** to build the sprite animation engine.
2. Upload your sprite sheet file whenever ready (you can drag and drop it into chat).
3. The engine will instantly wire it up and we will trigger the final build and deployment!
