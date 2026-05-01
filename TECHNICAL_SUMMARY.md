# Technical Summary: UI (Atmospheric Interface)

This document outlines the React-based architecture and design systems for the Sapien Paradox platform.

## 🎨 Design Philosophy: "Ethereal Architect"
The UI is a functional paradox: high-precision grids wrapped in soft, organic animations.

## 🧠 State Architecture (`src/pages/landing/machine/`)
The platform uses **XState** for 100% of the core user flow, treating the UI as a state machine rather than a collection of components.
- **`landingMachine`**: Manages the transitions between:
    - `checkingUrl`: Detecting temporal shard tokens.
    - `viewingShard`: Managing the machine-driven PDF proxy viewer.
    - `form`: Handling multi-step lead intake.

## 🎭 Atmospheric Engine
Animations are synced to the **User's Selected Pace**.
- **Variable Velocity**: Custom cubic-bezier timing (`[0.16, 1, 0.3, 1]`) creates a signature "High-Speed Scan, Slow-Settle" feel.
- **Global Tempo Sync**: Components (Hero Shards, Pulse Rings) adjust their animation `duration` and `delay` dynamically based on the machine context.

## 🔐 Shard Viewer (Temporal Proxy)
A mobile-first, full-screen shell that reacts to the machine state:
- **States**: Manifesting (Loading) -> Valid (PDF Stream) -> Returned (Expired).
- **Security**: Accesses content via the backend proxy, preventing direct link exposure.

## 🛠️ Standards & Utilities
- **Zero-Hardcoding**: All text is managed via `labels.ts` and retrieved via `locale(path)`.
- **Typing**: Strict TypeScript interfaces for all component props and machine events.
- **Styling**: Vanilla CSS with variables for global theme management.
