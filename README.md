<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=2B3EEA&height=110&section=header&text=LINKED&fontSize=42&fontColor=FFFFFF&fontAlignY=55&desc=where%20student%20ideas%20find%20their%20team&descSize=14&descAlignY=80&descColor=D9D9D9" alt="Linked banner" width="100%" />

<a href="https://readme-typing-svg.demolab.com">
  <img src="https://readme-typing-svg.demolab.com?font=Press+Start+2P&size=13&duration=3000&pause=1200&color=2B3EEA&center=true&vCenter=true&width=560&height=40&lines=FIND+TEAMS+AND+SHARE+RESOURCES+ACROSS+CAMPUSSES;FIND%2C+YOUR+CO-FOUNDER;CLOSE+THE+ACCESS+GAP" alt="Typing SVG" />
</a>

<br/>

[![Status](https://img.shields.io/badge/STATUS-PROTOTYPE-FF5E3A?style=for-the-badge)](#roadmap--levels)
[![Next.js](https://img.shields.io/badge/NEXT.JS-14-2B3EEA?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Figma](https://img.shields.io/badge/DESIGN-FIGMA-2B3EEA?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/TIxkBM5aVrIXGgcGsaQJkD)
[![License](https://img.shields.io/badge/LICENSE-MIT-lightgrey?style=for-the-badge)](#license)

</div>

A collaboration platform connecting student builders across universities — find teammates, mentors, and projects, no matter which campus you're on.

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/camera.svg" width="22" /> Screenshots & demo

<div align="center">

<table>
<tr>
<td align="center"><img src="https://placehold.co/280x180/2B3EEA/FFFFFF?text=Home+Feed" width="260"/><br/><sub>Discovery feed — <b>coming soon</b></sub></td>
<td align="center"><img src="https://placehold.co/280x180/FF5E3A/FFFFFF?text=Auth+Flow" width="260"/><br/><sub>Sign up / sign in — <b>coming soon</b></sub></td>
</tr>
<tr>
<td align="center"><img src="https://placehold.co/280x180/2B3EEA/FFFFFF?text=Project+Workspace" width="260"/><br/><sub>Workspace — <b>coming soon</b></sub></td>
<td align="center"><img src="https://placehold.co/280x180/FF5E3A/FFFFFF?text=Mentor+Match" width="260"/><br/><sub>Mentorship — <b>coming soon</b></sub></td>
</tr>
</table>

*Click-through prototype available today → [`synapse_prototype.html`](synapse_prototype.html) (25 screens). Swap the tiles above for real captures once you export them.*

</div>

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/notification.svg" width="22" /> The problem

Talented student researchers are sorted by which campus they happen to attend, not by what they can do. A student building something ambitious at a smaller or less-resourced school has no reliable way to find collaborators, mentors, or opportunities outside their own hallway — while the same student at a handful of elite institutions has that network handed to them by default.

Linked exists to close that gap: a verified, cross-campus network built specifically for student researchers, piloting first at Grambling State University and expanding across HBCUs before going national.

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/home.svg" width="22" /> Getting started

The working piece of the product today is the auth layer in [`linked-auth/`](linked-auth), running against a real Postgres database rather than mocked up.

```
# Clone
git clone https://github.com/<your-username>/linked.git
cd linked/linked-auth

# Install
npm install

# Configure
cp .env.example .env.local   # add your Postgres + OAuth credentials

# Run
npm run dev
```

> [!TIP]
> Want the full click-through experience with zero setup? Open [`synapse_prototype.html`](synapse_prototype.html) straight in a browser.

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/archive.svg" width="22" /> What's built

| Deliverable | What it is |
| --- | --- |
| [`synapse_prototype.html`](synapse_prototype.html) | 25-screen interactive HTML prototype — the full app, click-through |
| [`synapse_blueprint.html`](synapse_blueprint.html) | Product blueprint — concept, features, AI layer, roadmap, revenue |
| [`synapse_sitemap.html`](synapse_sitemap.html) | 46-screen sitemap across MVP, V2, and V3 phases |
| [`synapse_project_document.docx`](synapse_project_document.docx) | Full project document — architecture, tech stack, algorithms, data model |
| [Figma — Linked prototype](https://www.figma.com/design/TIxkBM5aVrIXGgcGsaQJkD) | High-fidelity mobile screens: auth sequence, onboarding, home feed |
| [`linked-auth/`](linked-auth) | Working code — sign up, sign in, forgot password, OAuth, sessions |

The prototype and Figma files are the source of truth for design.

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/sliders-2.svg" width="22" /> Core features

- **🔍 Discover** — an AI-matched feed of projects, teammates, and mentors, weighted toward merit over proximity, using embedding similarity plus a diversity boost that corrects for the filter-bubble effect a pure-similarity recommender would create
- **✅ Verify** — a Student Verified badge tied to `.edu` confirmation, so trust doesn't depend on who you already know
- **🛠️ Build** — a full project workspace (tasks, chat, files, milestones) once a team forms
- **📈 Grow** — a living portfolio that fills itself in as the work happens, instead of a resume assembled after the fact

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/archive.svg" width="22" /> Architecture

*High-level, in-progress. Solid arrows are shipped; dashed arrows are planned.*

```mermaid
flowchart TD
    U["👤 Student"] -->|sign in| APP["Next.js 14 App"]
    APP --> AUTH{"Auth.js v5"}
    AUTH -->|JWT session| PG[("Postgres")]
    AUTH -->|revocation check| SESS[["app_session table"]]
    APP -.->|planned| FEED["Discovery Feed"]
    FEED -.-> VEC[["pgvector embeddings"]]
    VEC -.-> MATCH{"Matching Engine\n(similarity + diversity boost)"}
    MATCH -.-> FEED
    APP -.->|planned| WS["Project Workspace"]
    APP -.->|planned| MENTOR["Mentor Matching"]
```

---

## Tech stack

Next.js 14 + TypeScript, Auth.js, Postgres with `pgvector` for matching, Tailwind CSS.

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/alarm-clock.svg" width="22" /> Roadmap — levels

Think of the roadmap as levels in a game. Update the bars as each one clears.

**🟦 Level 1 — Grambling Pilot**
![](https://progress-bar.dev/40/?title=verified+profiles+·+discovery+·+workspaces&width=260&color=2B3EEA)
Target: 100 verified students, 15 projects.

**🟧 Level 2 — HBCU Network** `🔒 locked`
![](https://progress-bar.dev/0/?title=mentor+matching+·+mobile+·+diversity+weighting&width=260&color=FF5E3A)

**⬜ Level 3 — National** `🔒 locked`
![](https://progress-bar.dev/0/?title=open+to+any+school+·+faculty+endorsements&width=260&color=808080)

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/lock.svg" width="22" /> Security & privacy

What's actually implemented in [`linked-auth/`](linked-auth) today:

- **Password storage** — Argon2id hashing (not a reversible or fast hash)
- **Brute-force protection** — rate limiting at 3 failed sign-in attempts per hour
- **OAuth** — Google and GitHub sign-in supported alongside email/password
- **Forgot password** — 6-digit code, SHA-256 hashed at rest, 15-minute expiry, HMAC-signed reset token
- **Session revocation** — a custom `app_session` table backs JWT sessions so a revoked session is actually rejected, not just ignored client-side
- **Password reset** — invalidates every existing session, everywhere, immediately

> [!IMPORTANT]
> No `SECURITY.md` or responsible-disclosure process yet — **TBD**. Until then, flag anything sensitive privately rather than in a public issue.

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/chat.svg" width="22" /> FAQ

<details>
<summary><b>What is Linked?</b></summary><br/>
A cross-campus research collaboration platform for student researchers — think LinkedIn + GitHub + ResearchGate + Slack, but built for finding a team, not a job.
</details>

<details>
<summary><b>Can I sign up right now?</b></summary><br/>
Not yet — it's in active prototype/pilot-build phase, starting at Grambling State University.
</details>

<details>
<summary><b>What stops matching from just favoring students who already have connections?</b></summary><br/>
The matching algorithm applies a diversity boost on top of embedding similarity, specifically to correct the filter-bubble effect a pure-similarity recommender would otherwise create.
</details>

<details>
<summary><b>Is there a mobile app?</b></summary><br/>
Not yet — the product is web-first, though the Figma prototype is designed mobile-first.
</details>

<details>
<summary><b>Who's building this, and why?</b></summary><br/>
Jonathan Moonga, an Engineering Technology junior at Grambling State University, building it around fairness, access, and connection across borders.
</details>

---

## <img src="https://unpkg.com/pixelarticons@latest/svg/heart.svg" width="22" /> Team

<div align="center">

| | |
| :---: | --- |
| 🧑‍💻 | **Jonathan Moonga** — Founder, everything (concept → design → code) |
| 🎨 | **Design** — *open, TBD* |
| ⚙️ | **Backend** — *open, TBD* |
| 📱 | **Mobile** — *open, TBD* |

</div>

---

## Documentation

For architecture, the data model, and the full algorithm rationale, [**head over to the project document**](synapse_project_document.docx).

## Contributing

Linked isn't open for outside contributions yet — it's a solo build in active development. If you'd like to follow along or get involved early (as a pilot user, designer, or engineer), reach out — see Community below.

## <img src="https://unpkg.com/pixelarticons@latest/svg/bell.svg" width="22" /> Support & community

- 🐛 Bugs & ideas → [GitHub Issues](../../issues)
- 💬 Discord / chat → **coming soon**
- 📧 Direct contact → **TBD**

## <img src="https://unpkg.com/pixelarticons@latest/svg/calendar.svg" width="22" /> Changelog

**Unreleased**
- Renamed the product from *Synapse* to **Linked**
- `linked-auth`: Next.js 14 + Auth.js v5 auth system verified end-to-end (sign up, sign in, OAuth, forgot password, session revocation)
- Fixed two Auth.js v5 issues — Credentials-provider JWT sessions forced regardless of config, and stale/revoked sessions reconstructed from raw JWT claims
- Built the 25-screen HTML prototype
- Extended the "Linked prototype" Figma file with 6 new auth screens and 13 click-to-navigate reactions
- Wrote the 15-page project document (architecture, algorithms, data model, roadmap)

## <img src="https://unpkg.com/pixelarticons@latest/svg/gift.svg" width="22" /> Values

- **Merit over proximity** — the reason this exists
- **Verified, not vouched-for** — trust comes from `.edu` confirmation, not who you know
- **Small schools first** — a deliberate starting constraint, not a footnote
- **Mentorship is infrastructure** — not an occasional nice thing that happens

> [!NOTE]
> If you're building something related to Linked and using its name, please note in your README that it isn't built by or affiliated with this project.

## License

MIT

---

<div align="center">

**Built by** [Jonathan Moonga](#) · Computer Science, Software Engineering & Product

<img src="https://capsule-render.vercel.app/api?type=rect&color=2B3EEA&height=60&section=footer" alt="footer" width="100%" />

</div>
