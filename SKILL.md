---
name: bunk-o-meter-rules
description: Development, UI/UX, data persistence, and AI excuse guidelines for Bunk-o-Meter.
---

# Bunk-o-Meter Development Guidelines & Rules

This document outlines the mandatory rules, design language, validation logic, and AI guardrails for the **Bunk-o-Meter** application.

---

## 1. Look & Feel (Theme & UX)

### Visual Style
- **Aesthetic**: Light, fun, vibrant student/college theme (e.g., subtle notebook grid/doodle vibe, friendly rounded cards, playful student-centric accents).
- **Typography**: Clean, readable, and energetic sans-serif.

### Color Coding Matrix
| Zone | Status Condition | Color Palette | Purpose |
| :--- | :--- | :--- | :--- |
| **Safe Zone** | Attendance $\ge 75\%$ & Safe Bunks $> 0$ | **Green** (`emerald-500` / `green-500`) | Reassures student they are safely above the threshold. |
| **Warning / Limit** | Attendance $\ge 75\%$ but Safe Bunks $= 0$ (or near limit) | **Yellow** (`amber-500` / `yellow-500`) | Warns student that missing even 1 more class risks shortage. |
| **Danger Zone** | Attendance $< 75\%$ | **Red** (`rose-500` / `red-500`) | Urgent alert indicating attendance shortage and recovery quota. |

### Microcopy Guidelines
- Keep all explanations **simple, casual, and short**. Avoid dense academic text.
- **Approved Examples**:
  - *"You can safely skip 3 classes"*
  - *"Attend next 2 classes to reach 75%"*
  - *"On the edge! Don't miss your next class"*
  - *"All clear, keep chilling"*

---

## 2. Form & Validation Rules

1. **Mandatory Subject Name**:
   - The subject name field is required (must not be empty or whitespace only).
2. **Non-Negative Values**:
   - Both `Attended` and `Total Held` fields must be integers $\ge 0$. Negative numbers are strictly blocked.
3. **Logical Integrity ($A \le T$)**:
   - `Attended` cannot exceed `Total Held`. The form must reject or flag this with an immediate validation warning before saving.
4. **Target Threshold**:
   - Defaults to $75\%$, but can be configured per subject if desired (constrained between $1\%$ and $99\%$).

---

## 3. Data & Storage Rules

- **Persistence Layer**: All state must be saved to the browser's `localStorage` (key: `bunk_o_meter_subjects_v1`).
- **Reactive Synchronization**: Updates (adding subjects, deleting subjects, editing counts, or tapping quick `+1 Attended` / `+1 Missed` counters) must immediately sync to `localStorage`.
- **Fault Tolerance**: If `localStorage` data is missing or corrupted, fail gracefully by initializing with a clean empty list or student-friendly demo subjects.

---

## 4. AI Excuse Feature Rules & Guardrails

When generating excuses for bunking or missing a class:

1. **Format & Length**:
   - **Maximum 2 sentences**. Keep it witty, punchy, and quick to read.
2. **Tone**:
   - Lighthearted, humorous, exaggerated, and relatable to college/hostel life (e.g., existential debates with the alarm clock, hostel mess experiments, wifi disconnections, infinite compiler loops, sock-finding expeditions).
3. **Strict Content Guardrails (Zero Tolerance)**:
   - **NEVER** mention any sickness, illness, infection, fever, or medical condition.
   - **NEVER** mention death, funerals, or mourning.
   - **NEVER** mention genuine family emergencies, personal tragedies, or accidents.

