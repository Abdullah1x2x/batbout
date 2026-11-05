# takemyhand

**Mentor mode for AI agents, in any language.** The agent does your task *and* teaches you — then gradually hands the work over to you as you prove you understand it.

> I do → we do → you do

Most "learning mode" skills either explain everything or make you write fixed pieces. **takemyhand** adapts: it tracks each concept separately and moves you from watching, to co-writing, to writing it yourself — and it talks to you in your own language.

---

## What makes it different

| | takemyhand | Typical learning / mentor skills |
|---|---|---|
| **Gradual release, per concept** | Each concept moves I do → we do → you do based on your actual attempts; it can also step back | Fixed: you always write "the core", or isolated pieces at decision points |
| **Any language** | Mirrors your language, keeps technical terms in English with a one-time gloss, builds a bilingual glossary, handles right-to-left scripts | English only |
| **Three speeds, one word** | `watch` · `guide` · `drive` — recognised in any language | One mode, or a lock you turn on/off |
| **Zero setup** | No tracking files, no scripts, no dependencies; works in chat apps and coding agents | Often needs profile files, dashboards, or a CLI |
| **Honest reviews** | A 3-rung hint ladder; never praises wrong code | Varies |

## The skills

| Skill | Role |
|---|---|
| `takemyhand` | The session conductor: language, speeds, insights, gradual release, hand-overs. Start here. |
| `takemyhand-review` | Reviews your attempt at a handed-over piece: what's right, what's wrong, hint ladder, stage decision. |
| `takemyhand-recap` | Ends the session: lessons, stage per concept, bilingual glossary, optional teach-back, "quiz me", next exercise. |

Each sibling skill has a short fallback inside `takemyhand`, so the core skill also works on its own.

## How it works

The agent runs every part of a session for you; you only steer with plain words.

### 1. Speeds — who writes the code

| Word (any language) | Who writes | What the agent does |
|---|---|---|
| **watch** | The agent writes everything | Does the task and explains each meaningful step. No hand-overs. |
| **guide** *(default)* | The agent writes routine work; you write the pieces that matter | Explains, and hands you small strategic pieces as you're ready. |
| **drive** | You write most of it | Sets up, plans, reviews and hints. Writes only boilerplate and what you ask it to fix. |

The session starts in **guide**. The agent tells you the current speed in one line and how to switch. Switching takes effect immediately.

### 2. Insights — the "why" behind each step

At each meaningful step the agent adds a short block, in your language:

```
★ Why this way? ─────────────────────────────
• why this approach (vs. the obvious alternative)
• the concept or pattern behind it
• one pitfall to watch for
─────────────────────────────────────────────
```

Two or three points, specific to your code. Trivial steps (imports, renames, formatting) get none.

### 3. Gradual release — I do → we do → you do, per concept

A *concept* is a reusable pattern: input validation, a database query, a state update, a test, an error path… Each one moves through three stages on its own:

| Stage | Name | Next time this concept appears |
|---|---|---|
| 1 | **I do** | The agent writes it and explains it. |
| 2 | **We do** | The agent scaffolds it (file, signature, surrounding code); you write the meaningful 2–10 lines. |
| 3 | **You do** | You write the whole unit (function, component, test); the agent only reviews. |

How a concept moves:

| Your last attempt | Result |
|---|---|
| Correct with 0–1 hints (a fixed typo counts as 0) | **Advances** one stage |
| Needed a pointed hint | **Holds** at its stage |
| Needed the full solution | **Steps back** one stage (never below stage 1) |

**watch** keeps every concept at stage 1. **drive** starts every new concept at stage 2. So you can be at "you do" for validation and at "I do" for async code in the same session.

### 4. Hand-overs — your turn to write

When a piece is yours, the agent builds everything around it, leaves a marker in your language, and stops:

```js
// TODO(you): save the flag only after a successful login
```

```python
# TODO(أنت): احفظ القيمة فقط بعد نجاح تسجيل الدخول
```

It then gives you three short labels — **Context** (what's built and why this piece matters), **Your task** (exactly what to write, and where), **Hint** (the trade-offs, not the answer) — and waits. Only pieces with real decisions are handed over, never boilerplate, and only one at a time.

### 5. Review — the hint ladder

When you reply with your attempt, `takemyhand-review` reads (and runs, when it can) your code, then says what's right, names every real problem, and climbs one rung at a time:

| Rung | You get |
|---|---|
| 1 | A guiding question — "What happens when the list is empty?" |
| 2 | A pointed hint — "Line 4 runs before the value is loaded." |
| 3 | The solution, explained line by line |

A trivial slip (typo, missing import) is fixed straight away and doesn't count against you. Wrong code is never called correct. The agent then integrates the final version, removes the marker, verifies it, and carries on.

### 6. Recap — lock it in

When the task is done, `takemyhand-recap` gives you, in your language:

1. **What we built** — 1–2 lines.
2. **Key lessons** — 2–4 points tied to this session's real code.
3. **Where you are** — the stage of each concept you practiced.
4. **Glossary** — every technical term explained during the session, with its meaning in your language.
5. **Next exercise** — one small task for your weakest concept, if a natural one exists.

It then offers one optional **teach-back**: explain a concept in your own words and get honest feedback.

### Language

The agent answers in the language of your latest message and follows you if you switch. Code, commands, API names and error messages stay in their original form. Each important term is explained once, on first use — e.g. `state management (إدارة الحالة)` — and collected for the glossary. In right-to-left languages, code and paths go on their own lines so they don't get scrambled.

## Commands inside the agent

Everything is plain words, typed in any language. The agent recognises them by meaning, not spelling.

### Start

| Agent | How to start |
|---|---|
| Claude Code (installed with the script or `npx skills`) | `/takemyhand <your task>` |
| Claude Code (installed as a plugin) | `/takemyhand:takemyhand <your task>` |
| Any other agent or Claude app | "Use takemyhand to <your task>" |

Start in a specific speed by saying it up front: `/takemyhand drive: add pagination to the users list`.

### During a session

| Say | Examples in other languages | What happens |
|---|---|---|
| **watch** | تفرّج · mira · regarde · schau zu · 見てる · 看着 | Switch to watch speed |
| **guide me** | خذ بيدي · guíame · guide-moi · führ mich · 手伝って · 带我 | Switch to guide speed |
| **I'll drive** | سوقني · yo conduzco · je conduis · ich fahre · 私が書く · 我来写 | Switch to drive speed |
| **just do it** | سوّها أنت · hazlo tú · fais-le | The agent does this one step itself, then returns to your speed |
| **why?** | ليش؟ · ¿por qué? · pourquoi ? | A full answer at your level before moving on |
| *your code*, or **done** | خلصت · listo · fini | Your attempt is reviewed (`takemyhand-review`) |
| **is this right?** | صح كذا؟ · ¿está bien? | Same — review of your attempt |
| **I don't know** / **hint** | ما أعرف · تلميح · no sé · une piste | The next rung of the hint ladder |
| **show me** | ورني · muéstrame · montre-moi | The solution, explained line by line (the concept steps back one stage) |
| **speak English** / **تكلم عربي** | — | Switch the session language |

### End

| Say | What happens |
|---|---|
| **recap** · **ملخص** | The full recap (`takemyhand-recap`) |
| **glossary** · **المصطلحات** | Just the bilingual glossary |
| **quiz me** · **اختبرني** | 3–5 questions drawn from this session's code, one at a time, with feedback after each |

In Claude Code you can also call the sibling skills directly: `/takemyhand-review`, `/takemyhand-recap` (plugin: `/takemyhand:takemyhand-review`, `/takemyhand:takemyhand-recap`).

## Install

takemyhand follows the open **Agent Skills** standard (`SKILL.md`), so it works in Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode, Windsurf, Cline, Roo, Kiro, Goose and many more.

### One command for every agent

**Option A — `npx skills` (needs Node.js, 70+ agents):**

```bash
npx skills add Abdullah1x2x/takemyhand --all -g
```

**Option B — no Node needed** (installs for every agent it finds on your machine):

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/Abdullah1x2x/takemyhand/main/install.sh | bash
```

```powershell
# Windows (PowerShell)
irm https://raw.githubusercontent.com/Abdullah1x2x/takemyhand/main/install.ps1 | iex
```

### One agent only

| Agent | Command |
|---|---|
| Claude Code (plugin) | `/plugin marketplace add Abdullah1x2x/takemyhand` then `/plugin install takemyhand@takemyhand` |
| Claude Code | `npx skills add Abdullah1x2x/takemyhand -g -a claude-code` |
| Codex | `npx skills add Abdullah1x2x/takemyhand -g -a codex` |
| Cursor | `npx skills add Abdullah1x2x/takemyhand -g -a cursor` |
| Gemini CLI | `npx skills add Abdullah1x2x/takemyhand -g -a gemini-cli` |
| GitHub Copilot | `npx skills add Abdullah1x2x/takemyhand -g -a github-copilot` |
| OpenCode | `npx skills add Abdullah1x2x/takemyhand -g -a opencode` |
| Windsurf | `npx skills add Abdullah1x2x/takemyhand -g -a windsurf` |
| Any other | `npx skills add Abdullah1x2x/takemyhand -g -a <agent-id>` |

Without Node, use the script with `--agent` (`-Agent` on Windows):

```bash
curl -fsSL https://raw.githubusercontent.com/Abdullah1x2x/takemyhand/main/install.sh | bash -s -- --agent claude-code,cursor
```

### Script options

| Option | What it does |
|---|---|
| *(none)* | Install for every agent detected on this machine, plus the shared `~/.agents/skills` folder |
| `--agent a,b` | Install only for these agents |
| `--all` | Install for every supported agent, detected or not |
| `--project` | Install into the current project instead of your home folder |
| `--uninstall` | Remove takemyhand (combine with the options above) |
| `--list` | Show supported agents, their folders, and which are detected |

On Windows the same options are `-Agent`, `-All`, `-Project`, `-Uninstall`, `-List`. Running the script from a cloned copy of this repo installs from the local files instead of downloading.

### Claude apps (claude.ai, desktop, mobile)

Zip each folder in `skills/` and upload it as a skill, then ask Claude to use `takemyhand`.

### Start a session

Restart your agent, then start a session as shown in [Commands inside the agent](#commands-inside-the-agent).

## Example

```
You: /takemyhand add a "remember me" checkbox to the login form

Agent: Speed: guide — say "watch" or "drive" to change.
       [adds the checkbox UI itself, with a short ★ insight on form state]
       // TODO(you): save the flag only after a successful login
       Context … Your task … Hint …
       (waits for you)

You: [writes 4 lines]

Agent: Good: you saved it after the await. Problem: what if login fails? …
       Concept "persisting preferences": now at "we do" → next time you write the whole function.
```

---

## بالعربية

**takemyhand** مهارة تجعل الوكيل ينجز مهمتك ويعلّمك أثناءها، ثم يسلّمك العمل تدريجياً: **أنا أعمل ← نعمل معاً ← أنت تعمل**، لكل مفهوم على حدة.

- **تدعم كل اللغات**: تحدّثك بلغتك، وتُبقي المصطلحات التقنية بالإنجليزية مع شرح قصير مرة واحدة، وتبني لك مسرد مصطلحات ثنائي اللغة.
- **ثلاث سرعات بكلمة واحدة**: تفرّج · خذ بيدي · سوقني.
- **مراجعة صادقة** بسلّم تلميحات من ثلاث درجات، ولا تمدح كوداً خاطئاً.
- **بلا إعداد**: لا ملفات تتبّع ولا سكربتات أثناء العمل.
- **تعمل مع أغلب الوكلاء**: Claude Code وCodex وCursor وGemini CLI وCopilot وغيرها، وتُثبَّت بأمر واحد.

### كيف تعمل

- **السرعات**: تبدأ الجلسة على «خذ بيدي». في «تفرّج» يكتب الوكيل كل شيء ويشرح، وفي «سوقني» تكتب أنت أغلب الكود والوكيل يخطط ويراجع ويلمّح.
- **لماذا هكذا؟**: عند كل خطوة مهمة يضيف الوكيل نقطتين أو ثلاثاً: سبب اختيار الطريقة، والمفهوم وراءها، وخطأ شائع يجب تجنّبه.
- **التسليم التدريجي**: لكل مفهوم ثلاث مراحل: أنا أعمل ← نعمل معاً ← أنت تعمل. ينتقل المفهوم مرحلة للأمام إذا كانت محاولتك صحيحة بتلميح واحد على الأكثر، ويبقى مكانه إذا احتجت تلميحاً مباشراً، ويرجع مرحلة إذا احتجت الحل كاملاً. الخطأ الإملائي البسيط لا يُحسب عليك.
- **التسليم**: يبني الوكيل كل ما حول الجزء المهم، ويترك علامة مثل `TODO(أنت)` في الكود، ثم يكتب لك السياق والمطلوب وتلميحاً، وينتظر محاولتك.
- **المراجعة**: يقول ما هو صحيح وكل مشكلة حقيقية، ثم يصعد سلّم التلميحات درجة درجة: سؤال موجّه، ثم تلميح مباشر، ثم الحل مشروحاً سطراً سطراً.
- **الملخص**: في النهاية تحصل على ما بنيناه، والدروس، ومرحلة كل مفهوم، ومسرد المصطلحات، وتمرين تالٍ، مع شرح عكسي اختياري.

### الأوامر داخل الوكيل

| قل | ماذا يحدث |
|---|---|
| `/takemyhand <المهمة>` | بدء جلسة في Claude Code (أو `/takemyhand:takemyhand` إذا ثُبّتت كإضافة). في الوكلاء الآخرين: «استخدم takemyhand لـ…» |
| تفرّج · خذ بيدي · سوقني | تغيير السرعة |
| سوّها أنت | ينفّذ الوكيل هذه الخطوة بنفسه ثم يعود لسرعتك |
| ليش؟ | شرح كامل قبل المتابعة |
| خلصت · صح كذا؟ · أو الصق كودك | مراجعة محاولتك |
| ما أعرف · تلميح | الدرجة التالية من سلّم التلميحات |
| ورني | الحل مشروحاً، ويرجع المفهوم مرحلة |
| ملخص · المصطلحات · اختبرني | الملخص الكامل، أو المسرد فقط، أو 3–5 أسئلة من كود الجلسة |

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE). See [NOTICE](NOTICE).
