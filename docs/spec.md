# NORTH — EXPERIENCE & FRONTEND SPECIFICATION

## Overview

North is NOT a traditional SaaS product.

North is a cinematic operational intelligence system designed for engineers, infrastructure teams, and modern technical organizations.

The product should feel:
- calm
- intelligent
- precise
- directional
- deeply intentional
- futuristic but human
- premium without luxury aesthetics

This is NOT:
- a generic AI startup
- a Tailwind SaaS template
- a dashboard with cards
- a neon cyberpunk interface
- a glassmorphism clone

The design language should feel inspired by:
- Linear
- Apple
- Arc Browser
- Notion
- Stripe Press
- Vercel
- Teenage Engineering
- Dieter Rams
- Swiss editorial systems
- Japanese minimalism

But MUST NOT copy them directly.

The result should feel original.

---

# PRIMARY DESIGN PRINCIPLES

## 1. Intelligence Without Noise

Every visual element must earn its place.

Avoid:
- unnecessary decoration
- random gradients
- visual clutter
- loud animations
- fake AI aesthetics

Prefer:
- restraint
- whitespace
- typography
- alignment
- pacing
- subtle depth

---

## 2. Editorial + Operating System Hybrid

The website should feel like:
- a premium editorial experience
- mixed with a futuristic operating system

NOT:
- a landing page template

Layouts should feel:
- asymmetrical
- cinematic
- spacious
- directional

---

## 3. Motion Philosophy

Animation should feel:
- atmospheric
- smooth
- expensive
- intentional

Avoid:
- flashy animations
- excessive transforms
- gimmicks

Prefer:
- stagger reveals
- slow fades
- depth movement
- cursor lighting
- cinematic scrolling
- smooth transitions

Motion should support focus.

---

# COLOR SYSTEM

Use restrained tones.

Primary Palette:
- graphite black
- warm black
- off-white
- muted neutrals
- soft metallic tones

Avoid:
- purple gradients
- blue AI gradients
- neon colors
- oversaturated accents

Suggested Variables:

```css
:root {
  --bg: #060606;
  --surface: #0d0d0d;
  --surface-2: #111111;
  --border: rgba(255,255,255,0.08);
  --text: #f3f3f1;
  --muted: #9d9d98;
  --accent: #d6d2c4;
}
```

---

# TYPOGRAPHY SYSTEM

Typography carries the brand.

Use:
- oversized editorial headlines
- extremely disciplined spacing
- sharp hierarchy
- low line-height
- subtle tracking adjustments

Fonts:
- Manrope
- IBM Plex Mono

Avoid:
- generic startup typography
- excessive font weights
- noisy text layouts

Hero headlines should feel monumental.

---

# LANDING PAGE SPECIFICATION

The landing page should feel like:
- a cinematic product film
- a design publication
- a futuristic operational environment

NOT:
- a startup homepage

---

# LANDING PAGE STRUCTURE

## 1. Intro Loader

Create:
- black loading screen
- minimal animated coordinate system
- subtle orbital motion
- North symbol reveal
- atmospheric fade transitions

No flashy effects.

---

## 2. Navigation

Minimal floating navigation.

Requirements:
- transparent
- lightweight
- typography-led
- subtle blur on scroll

Structure:
- logo left
- navigation center
- CTA right

Avoid:
- boxed navbars
- heavy shadows
- large buttons

---

## 3. Hero Section

IMPORTANT:
DO NOT create:
- text left + image right layouts
- dashboard mockups
- generic SaaS hero sections

Instead:
Use:
- asymmetrical editorial composition
- massive typography
- intentional whitespace
- cinematic pacing

Hero should feel iconic.

Large typography example:

“Direction for intelligent systems.”

The hero should include:
- ambient lighting
- subtle motion
- mouse-reactive depth
- atmospheric backgrounds
- elegant CTA interactions

---

## 4. Scroll Experience

The website should unfold like chapters.

Each section should:
- breathe
- reveal slowly
- feel intentional

Use:
- viewport reveal animations
- layered transitions
- subtle parallax
- staggered typography

Avoid:
- repetitive sections
- generic feature grids

---

## 5. Feature Architecture

DO NOT use generic cards.

Instead:
Design features as:
- system modules
- operational layers
- intelligence blocks
- architectural structures

Features should feel:
- engineered
- modular
- spatial

---

## 6. Social Proof

Avoid:
- boring logo rows

Instead:
Use:
- metrics
- editorial quotes
- operational snapshots
- infrastructure numbers

Presentation should feel:
- Bloomberg Terminal minimalism
- premium editorial layouts

---

## 7. Final CTA

Massive breathing room.

Large statement typography.

Minimal CTA.

No aggressive sales language.

---

# LOGIN PAGE SPECIFICATION

The login page should feel like:
entering a precision operating environment.

Use:
- asymmetrical layouts
- ambient visuals
- subtle motion
- elegant focus states
- premium spacing

Avoid:
- generic auth cards
- centered boxes
- boring form layouts

The login experience should feel:
- calm
- secure
- intelligent
- futuristic

Inputs should have:
- animated focus states
- subtle glow
- understated borders
- smooth transitions

---

# DASHBOARD SPECIFICATION

IMPORTANT:
The dashboard must NOT look like:
- Bootstrap admin panels
- analytics dashboards
- generic sidebars
- generic cards

Instead:
Create:
- an immersive workspace
- layered information systems
- cinematic operational UI
- modular panels
- intelligent navigation

The dashboard should feel inspired by:
- Linear
- Arc Browser
- Superhuman
- modern operating systems
- Bloomberg Terminal minimalism

---

# DASHBOARD STRUCTURE

## Navigation Rail

Thin vertical navigation.

Minimal icons.

Soft hover interactions.

Avoid:
- bulky sidebars
- large labels
- enterprise dashboard aesthetics

---

## Workspace Layout

Use:
- editorial grids
- layered panels
- adaptive layouts
- modular zones

The interface should feel alive.

---

## Global Search

Create a large cinematic search layer.

Inspired by:
- Raycast
- Spotlight
- command systems

Search should feel central to the product.

---

## Operational Timeline

Avoid tables.

Instead:
Create:
- flowing event systems
- timeline-based operational UI
- contextual events
- animated infrastructure states

---

## AI Insight Layer

Large typography-driven insight modules.

Minimal chrome.

Example:

“North detected cascading latency anomalies across payment infrastructure.”

The AI layer should feel:
- calm
- authoritative
- intelligent

NOT:
- chatbot UI

---

# INTERACTION SYSTEM

Use:
- hover lighting
- cursor depth
- motion hierarchy
- subtle scaling
- directional transitions

Everything should feel tactile.

Avoid:
- exaggerated animations
- over-designed interactions

---

# TECHNICAL REQUIREMENTS

# TECH STACK

Use:
- Next.js 15 App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

Optional:
- Lenis for smooth scrolling
- shadcn/ui selectively

DO NOT:
- use generic component libraries heavily
- generate dashboard templates
- create Bootstrap-style layouts
- overuse shadcn blocks

The implementation should feel custom-built.

---

# FRONTEND ARCHITECTURE

The frontend should be structured like a design system and operating environment.

Suggested structure:

/app
/components
/features
/motion
/layouts
/lib
/styles
/hooks
/providers
/config

The system should prioritize:
- reusable motion primitives
- typography consistency
- layout rhythm
- composable interactions
- cinematic transitions

Code must be:
- modular
- reusable
- production quality
- easy to migrate later

---

# RESPONSIVE DESIGN

Mobile should preserve:
- cinematic pacing
- typography hierarchy
- spacing discipline

Do NOT collapse everything into generic mobile stacks.

Mobile should still feel premium.

---

# IMPORTANT IMPLEMENTATION RULES

DO NOT:
- generate generic SaaS layouts
- create random gradients
- use startup illustrations
- use generic cards
- create fake AI aesthetics
- create Dribbble-style UI
- generate typical Tailwind sections

DO:
- create intentional compositions
- use whitespace architecturally
- create premium motion systems
- emphasize typography
- design emotionally
- create cinematic transitions
- maintain visual restraint

---

# OUTPUT REQUIREMENTS

Generate:
- complete HTML
- Tailwind CSS
- reusable sections
- semantic structure
- clean code organization
- production-ready frontend

Include:
- comments
- interaction systems
- hover states
- transitions
- responsive behavior
- loading states
- empty states

All code should be directly runnable.

---

# FINAL CREATIVE DIRECTION

North should feel like:
“the company defining the future of operational intelligence.”

The experience should feel:
- iconic
- cinematic
- intelligent
- engineered
- deeply intentional
- premium
- unforgettable

NOT:
“another AI startup website.”
