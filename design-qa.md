# Design QA — Linked authentication redesign

- Source visual truth: `C:\Users\jonat\.codex\generated_images\01a01035-1ce7-7e71-85a2-89f64c8d57fa\exec-d544d168-322b-4fd2-8856-c7781c4f8d42.png`
- Implementation screenshot: `.audit/redesign/login-desktop-final.png`
- Combined comparison: `.audit/redesign/comparison-final.png`
- Viewport/state: 1536 × 1024 CSS pixels, desktop, signed-out login
- Source pixels: 1536 × 1024
- Implementation pixels: 1536 × 1024
- Density normalization: 1:1 pixel dimensions; Chromium default device scale factor

## Full-view comparison evidence

The final combined comparison confirms the selected 50/50 editorial composition, pale blue image panel, three-line brand statement, white form surface, top navigation, full-width primary action, two visible OAuth actions, and legal copy. The form and brand panel preserve the source hierarchy and fit within the viewport without clipping.

## Focused and responsive evidence

Important form details were inspected separately because they are more legible than in the combined canvas:

- `.audit/redesign/login-mobile.png` — 390 × 844 mobile login
- `.audit/redesign/signup-tablet.png` — 834 × 1194 tablet signup
- `.audit/redesign/forgot-mobile.png` — 390 × 844 mobile recovery
- `.audit/redesign/confirm-desktop.png` — 1440 × 1024 confirmation state

Controls, labels, focus affordances, OAuth visibility, wrapping, and responsive stacking were readable in these captures. The browser suite also verified that mobile has no horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: Inter/system grotesk closely matches the source's bold neo-grotesk direction. Display weight, tight tracking, readable 14–16px UI copy, and heading wrapping are consistent.
- Spacing and layout rhythm: Desktop split, form width, header placement, field rhythm, 48px controls, and responsive single/two-column transitions match the design intent.
- Colors and visual tokens: Warm white, slate ink, pale powder blue, sky link/focus color, and semantic red/green states are consistently tokenized with accessible contrast.
- Image quality and asset fidelity: `public/images/linked-network-bg.png` is a purpose-made raster asset matching the selected abstract research-network art direction. It is sharp at desktop scale and cropped safely.
- Copy and content: Product-specific copy is coherent across login, signup, recovery, verification, reset, confirmation, and success states. Google and GitHub actions remain visible as explicitly required.
- Icons: Standard `react-icons` glyphs provide consistent stroke/brand icon treatment; no placeholder glyphs or hand-drawn SVG approximations remain in the redesigned auth surfaces.

## Interaction and accessibility verification

- Playwright: 2 tests passed.
- Primary interactions tested: login-to-signup navigation, password requirement feedback, live mismatch state, show/hide password, mobile overflow.
- Console errors checked: none emitted during the interaction test.
- Labels are programmatically associated with inputs.
- Error banners use `role="alert"` and `aria-live`.
- Controls meet or exceed 44px touch targets.
- Focus rings and invalid states are visible.

## Comparison history

### Iteration 1

- P2: desktop brand statement wrapped to four lines, while the source uses three.
- Fix: reduced the responsive display maximum and adjusted line height/tracking in `AuthShell`.
- Post-fix evidence: `.audit/redesign/login-desktop-final.png` and `.audit/redesign/comparison-final.png` show the intended three-line statement.

### Final pass

No actionable P0, P1, or P2 findings remain.

## Follow-up polish

- P3: the generated mock includes longer descriptions beneath the three brand benefits; the implementation intentionally keeps those labels concise to preserve clarity across shorter laptop heights.
- P3: exact font rendering varies slightly from the raster mock because the implementation uses production-safe Inter/system fallbacks.

final result: passed
