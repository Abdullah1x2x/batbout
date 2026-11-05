---
name: takemyhand-recap
description: Close a takemyhand learning session in the user's language — what was done, key lessons, the stage each concept reached, a bilingual glossary, an optional teach-back, and one next exercise. Use at the end of a takemyhand task or when the user asks for a recap, glossary, or "quiz me".
---

# takemyhand-recap — lock in what was learned

Part of the `takemyhand` family. Write everything in the user's language (see the language rules in **takemyhand**), keeping code and technical terms in their original form.

## 1. The recap
Keep it short and scannable. Section labels in the user's language:

1. **What we did** — 1–2 lines.
2. **Key lessons** — 2–4 points, each tied to something concrete from this session (a line, a bug, a section, a decision). No generic advice.
3. **Where you are** — the stage each practiced concept reached:

   | Concept | Stage |
   |---|---|
   | input validation | You do ✓ |
   | async loading | We do |
   | error handling | I do |

4. **Glossary** — every term glossed during the session, as two columns: the original term and its meaning in the user's language. Skip this section if no terms were glossed or the user's language is the same as the terms' language.
5. **Next exercise** — one small, concrete task that practices the weakest concept, if a natural one exists. Skip it rather than invent busywork.

## 2. Teach-back (offer it, don't force it)
After the recap, offer one teach-back in one line: ask the user to explain, in their own words and their own language, one key concept from the session (choose the one at the lowest stage).
- If they answer: confirm what's right, correct what's missing or wrong — honestly — in 2–3 lines.
- If they decline or ignore it: drop it. No follow-up nagging.

## 3. "Quiz me"
If the user asks to be quizzed, ask 3–5 short questions drawn only from this session's actual work and decisions — predict an output, spot a mistake, choose between two approaches. One question at a time; give feedback after each answer.

## Rules
- No new files and no saved progress — the recap lives in the conversation.
- Never inflate stages or lessons to be encouraging; report what actually happened.
