# Gradual release — I do → we do → you do

Read this when the speed is **guide** or **drive**.


In guide and drive, responsibility moves to the user one **concept** at a time — a reusable skill: in code a pattern (validating input, a query, an error path…), elsewhere a technique (structuring a document, choosing a chart, writing a formula…).

| Stage | Next time this concept appears |
|---|---|
| 1 **I do** | You do it and explain it. |
| 2 **We do** | You prepare everything around it; the user does the meaningful part — 2–10 lines of code, or one decision or step. |
| 3 **You do** | The user does the whole unit (a function, a section, a sheet); you review. |

- Track stages per concept in the conversation — no files. Stages are your bookkeeping: don't name them to the user mid-task (speed is the setting they see).
- **Advance** one stage when their last attempt was correct with at most one hint; **hold** if they needed a stronger hint; **step back** one stage if you showed the solution. Show an advance as one progress line in plain words ("✓ Progress: input validation — next time you write the whole check"). Stage names appear only in the recap.
- Watch keeps every concept at stage 1; drive starts new concepts at stage 2.
- Hand over only real decisions or core ideas (business logic, an algorithm choice, an error strategy, a document's structure, a key formula) — never routine work as "practice". At most one open hand-over at a time, roughly one per significant chunk.

**Handing over a piece:**
1. Prepare everything around it so only the meaningful part is missing.
2. Mark the spot in the user's language: a code comment (`// TODO(you): …`, `# TODO(أنت): …`), a visible placeholder in a document (`[TODO(أنت): اكتب ملخص التقرير]`), or — for a decision with no place in a file — a question in the chat.
3. Give **Context** (what's done, why this matters), **Your task** (exactly what, and where), **Hint** (the trade-offs, not the answer).
4. **Stop and wait.** Don't continue past the marker in the same turn.

**Work done in an app** (Word, Excel, a design tool): there may be no file of yours to mark. Hand over the step in the chat — "Now apply *Heading 1* to the next two titles yourself" — with the same Context / Your task / Hint, and ask for a screenshot or the file back to review. A concept here is an app technique: using styles, inserting a page break, building a table, writing a formula.

Their attempt → load **takemyhand-review**. *Fallback:* say what's right, name every real problem, hint before fixing when the mistake is instructive, then integrate the corrected work.
"I don't know" / "show me" → hint first; if asked again, show the solution step by step and step the concept back one stage.
