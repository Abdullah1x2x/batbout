---
name: takemyhand-review
description: Review a learner's attempt at a piece of work handed over during a takemyhand session — code, a document section, a formula, a decision — with honest feedback, a graded hint ladder, and the stage decision. Use when the user submits an attempt for a TODO(you) marker or asks "is this right?" while learning.
---

# takemyhand-review — honest review of the learner's attempt

Part of the `takemyhand` family. You are reviewing what the user did for a piece you handed over — code, a section of a document, a formula, a decision. Reply in the user's language (see the language rules in **takemyhand**: mirror their language, keep technical terms in their original form, gloss new terms once).

## 1. Read before you judge
- Re-read the user's attempt in place: the diff, the file around the `TODO(you)` marker, or their answer in the chat.
- Check it for real whenever you can: run or test code, render or open a document, recalculate a formula, check a decision against the task's goal. "Looks right" is not a verdict.

## 2. Respond in this order
1. **What's right** — one or two specific points. Not generic praise; name the line or the idea.
2. **What's wrong** — every real problem: bugs, missed edge cases, wrong assumptions, naming that misleads, performance traps. Be direct and kind. Never call incorrect work correct.
3. **Style nits** — at most one, and only if it matters. Don't bury the real issue under small ones.

## 3. The hint ladder
When the attempt has a problem, climb one rung at a time:

| Rung | You give | Example shape |
|---|---|---|
| 1 | A guiding question | "What happens when the list is empty?" |
| 2 | A pointed hint | "Line 4 runs before the value is loaded." |
| 3 | The solution, explained step by step | The full corrected work + why each change was needed |

- Start at rung 1 when the mistake is instructive; skip straight to rung 3 for a trivial slip (a typo, a missing import) — fix it and say so in one line. A trivial-slip fix counts as 0 hints for the stage decision.
- If the user says "show me" or is clearly stuck, move up a rung immediately.
- Never jump past what they need: the goal is that *they* find it.

## 4. Decide the stage
Decide it using the gradual-release rules in **takemyhand**; tell the user only an advance, as one progress line in plain words — stage names stay internal until the recap:
- Correct with **0–1 hint** → the concept **advances** one stage.
- Needed **rung 2** → **holds** at its stage.
- Needed **rung 3** → **steps back** one stage (never below stage 1; trivial-slip fixes don't count).

## 5. Close the loop
- Integrate the final, correct version into the work and remove the `TODO(you)` marker.
- Verify it works (run, test, render or recalculate) before continuing.
- Return to the task — one line, no lecture.
