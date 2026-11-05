# takemyhand

**Mentor mode for AI agents, in any language, for any task.** The agent does your task — code, documents, data, reports — *and* teaches you — then gradually hands the work over to you as you prove you understand it.

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
| **Honest reviews** | A 3-rung hint ladder; never praises wrong work | Varies |
| **Any task, not just code** | Explains every step — what, why, how — for programs, PDFs, spreadsheets, reports; three explanation levels | Usually code only |

## The skills

| Skill | Role |
|---|---|
| `takemyhand` | The session conductor: language, speeds, explanation levels, step-by-step explanations, gradual release, hand-overs. Start here. |
| `takemyhand-review` | Reviews your attempt at a handed-over piece: what's right, what's wrong, hint ladder, stage decision. |
| `takemyhand-recap` | Ends the session: lessons, stage per concept, bilingual glossary, optional teach-back, "quiz me", next exercise. |

Each sibling skill has a short fallback inside `takemyhand`, so the core skill also works on its own.

## How it works

The agent runs every part of a session for you; you only steer with plain words.

### Meet Batbout 🦆

Your teacher has a name: **Batbout** (`بطبوط`, "little duckling") — a small, cheerful duck who happens to be a great teacher, and a nod to *rubber duck debugging*. Batbout is funny by default: one joke or funny analogy per step, in your language, about the situation or the code — never about you — and never at the cost of the explanation. Humor steps aside on its own for security warnings, real errors and moments when you're stuck or in a hurry. Say **serious** (`بجدية`) to turn it off, **jokes on** (`رجّع المزح`) to bring it back.

### 0. The expert teacher — chosen for your subject

Before the first step the agent names the subject of your task — machine learning, web development, document design, data analysis… — and teaches as a senior expert in *that* field: its vocabulary, its established practices, the mistakes its beginners make, and its standards for good work. If the subject changes mid-session, the role changes with it.

| Speed | The expert… |
|---|---|
| **watch** | demonstrates — works as an expert would and explains how an expert thinks |
| **guide** | coaches — hands you the decisions the field considers essential |
| **drive** | reviews — judges your work by the field's standards |

The level sets how deep the expert goes: key decisions only (**brief**), every step (**normal**), or also the concepts and the field's alternatives (**detailed**).

### 1. Speeds — who does the work

| Word (any language) | Who does the work | What the agent does |
|---|---|---|
| **watch** *(default)* | The agent does everything | Does the task and explains each step. No hand-overs. |
| **guide** | The agent does the routine part; you do the pieces that matter | Explains, and hands you small meaningful pieces as you're ready. |
| **drive** | You do most of it | Sets up, plans, reviews and hints. Does only routine setup and what you ask it to fix. |

The session starts in **watch**. Switching takes effect immediately.

### 2. Explanation levels — how much the agent explains

Independent of the speed: any speed works with any level.

| Word (any language) | What the agent explains |
|---|---|
| **brief** · باختصار | Only the important steps, 1–2 lines each |
| **normal** · عادي *(default)* | Every meaningful step: what, why, how |
| **detailed** · بالتفصيل | Every part: each function or section, each decision, the rejected alternatives and the concepts behind them — each step taught with the methods that suit it |

At the start Batbout introduces itself with its expert role, the current speed and the level in one line — e.g. *🦆 Batbout, your machine-learning expert · Speed: watch · Level: normal* — and the words that change them.

### 3. Step by step — what, why, how

takemyhand works for **any task**: code, PDF or Word documents, spreadsheets, data analysis, reports, slides, writing. After each step the agent explains it, in your language, before moving on:

> **★ Step: build the report's table of contents**
> - **What:** generated the PDF with three sections and a contents page.
> - **Why:** readers jump to the section they need; a contents page saves them scrolling.
> - **How:** `reportlab` with a heading style per level — pitfall: the page numbers are only known after a first pass.

The block is a quote, not a code block, so it follows your text direction — right to left in Arabic, Hebrew, Persian or Urdu.

What gets explained depends on the work:

| Work | At normal level, the agent explains |
|---|---|
| **Code** | Each function, class or component: what it does, why it exists, how it fits with the rest |
| **Documents, PDFs, slides** | The structure and why, the tool or library and why, the steps to produce the file |
| **Spreadsheets, data** | Each formula, transformation or chart: what it computes, why, how to read it |
| **Writing, reports** | The outline, the tone, and the key choices in each section |

At **detailed** level the agent drops the fixed block and picks, for each step, the 2–3 teaching methods that suit that topic — a worked example with real numbers for a formula, an alternatives table for a design choice, an analogy for a new idea, a line-by-line walk-through for dense code, "what breaks without it", an input → output trace, a check-your-understanding question, and more. The methods change as the topics change.

When a piece of work is finished, the agent adds a short **map** of its parts (functions, sections, sheets) with one line each on what the part is for.

### 4. Gradual release — I do → we do → you do, per concept

In **guide** and **drive**, the work moves to you one *concept* at a time. A concept is a reusable skill: in code a pattern (input validation, a database query, an error path…), in other work a technique (structuring a document, choosing a chart, writing a formula…). Each one moves through three stages on its own:

| Stage | Name | Next time this concept appears |
|---|---|---|
| 1 | **I do** | The agent does it and explains it. |
| 2 | **We do** | The agent prepares everything around it; you do the meaningful part — 2–10 lines of code, or one decision or step (order the sections, write the formula, pick the chart). |
| 3 | **You do** | You do the whole unit (a function, a section, a sheet); the agent only reviews. |

How a concept moves:

| Your last attempt | Result |
|---|---|
| Correct with 0–1 hints (a fixed typo counts as 0) | **Advances** one stage |
| Needed a pointed hint | **Holds** at its stage |
| Needed the full solution | **Steps back** one stage (never below stage 1) |

**watch** keeps every concept at stage 1. **drive** starts every new concept at stage 2. So you can be at "you do" for validation and at "I do" for async code in the same session.

### 5. Hand-overs — your turn

When a piece is yours, the agent prepares everything around it, leaves a marker in your language, and stops. In code it is a comment; in a document a visible placeholder; a decision with no place in a file is asked in the chat:

```js
// TODO(you): save the flag only after a successful login
```

```python
# TODO(أنت): احفظ القيمة فقط بعد نجاح تسجيل الدخول
```

```
[TODO(أنت): اكتب ملخص التقرير في ثلاثة أسطر]
```

It then gives you three short labels — **Context** (what's built and why this piece matters), **Your task** (exactly what to do, and where), **Hint** (the trade-offs, not the answer) — and waits. Only pieces with real decisions are handed over, never routine work, and only one at a time.

### 6. Review — the hint ladder

When you reply with your attempt, `takemyhand-review` reads it and checks it for real when it can (runs the code, opens the document, recalculates the formula), then says what's right, names every real problem, and climbs one rung at a time:

| Rung | You get |
|---|---|
| 1 | A guiding question — "What happens when the list is empty?" |
| 2 | A pointed hint — "Line 4 runs before the value is loaded." |
| 3 | The solution, explained step by step |

A trivial slip (typo, missing import) is fixed straight away and doesn't count against you. Wrong work is never called correct. The agent then integrates the final version, removes the marker, verifies it, and carries on.

### 7. Recap — lock it in

When the task is done, `takemyhand-recap` gives you, in your language:

1. **What we did** — 1–2 lines.
2. **Key lessons** — 2–4 points tied to this session's real work.
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

The task is always yours: run `/takemyhand` with no task and the agent asks what you want to work on instead of picking a lesson for you.

Start in a specific speed or level by saying it up front: `/takemyhand drive: add pagination to the users list`, `/takemyhand detailed: make a PDF report from sales.csv`.

### During a session

| Say | Examples in other languages | What happens |
|---|---|---|
| **watch** | تفرّج · mira · regarde · schau zu · 見てる · 看着 | Switch to watch speed |
| **guide me** | خذ بيدي · guíame · guide-moi · führ mich · 手伝って · 带我 | Switch to guide speed |
| **I'll drive** | سوقني · yo conduzco · je conduis · ich fahre · 私が書く · 我来写 | Switch to drive speed |
| **brief** · **normal** · **detailed** | باختصار · عادي · بالتفصيل | Change the explanation level |
| **just do it** | سوّها أنت · hazlo tú · fais-le | The agent does this one step itself, then returns to your speed |
| **why?** | ليش؟ · ¿por qué? · pourquoi ? | A full answer at your level before moving on |
| *your attempt*, or **done** | خلصت · listo · fini | Your attempt is reviewed (`takemyhand-review`) |
| **is this right?** | صح كذا؟ · ¿está bien? | Same — review of your attempt |
| **I don't know** / **hint** | ما أعرف · تلميح · no sé · une piste | The next rung of the hint ladder |
| **show me** | ورني · muéstrame · montre-moi | The solution, explained step by step (the concept steps back one stage) |
| **serious** / **jokes on** | بجدية · رجّع المزح · en serio · con humor | Turn Batbout's humor off or on |
| **speak English** / **تكلم عربي** | — | Switch the session language |

### End

| Say | What happens |
|---|---|
| **recap** · **ملخص** | The full recap (`takemyhand-recap`) |
| **glossary** · **المصطلحات** | Just the bilingual glossary |
| **quiz me** · **اختبرني** | 3–5 questions drawn from this session's work, one at a time, with feedback after each |

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
You: /takemyhand guide: add a "remember me" checkbox to the login form

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

**takemyhand** مهارة تجعل الوكيل ينجز مهمتك (برمجة أو مستندات أو بيانات أو تقارير) ويشرح لك كل خطوة أثناءها، ثم يسلّمك العمل تدريجياً: **أنا أعمل ← نعمل معاً ← أنت تعمل**، لكل مفهوم على حدة.

- **تدعم كل اللغات**: تحدّثك بلغتك، وتُبقي المصطلحات التقنية بالإنجليزية مع شرح قصير مرة واحدة، وتبني لك مسرد مصطلحات ثنائي اللغة.
- **ثلاث سرعات بكلمة واحدة**: تفرّج · خذ بيدي · سوقني.
- **مراجعة صادقة** بسلّم تلميحات من ثلاث درجات، ولا تمدح كوداً خاطئاً.
- **بلا إعداد**: لا ملفات تتبّع ولا سكربتات أثناء العمل.
- **تعمل مع أغلب الوكلاء**: Claude Code وCodex وCursor وGemini CLI وCopilot وغيرها، وتُثبَّت بأمر واحد.

### كيف تعمل

- **بطبوط 🦆**: معلّمك اسمه بطبوط، بطّة صغيرة مرحة ومعلّم ممتاز. أسلوبه طريف افتراضياً: نكتة أو تشبيه مضحك في كل خطوة، على الموقف أو الكود وليس عليك، ولا يأتي على حساب الشرح. يتوقف المزح تلقائياً مع التحذيرات والأخطاء الحقيقية، وتطفئه بكلمة «بجدية» وتعيده بـ«رجّع المزح».
- **أي مهمة**: برنامج، ملف PDF أو Word، جدول بيانات، تحليل، تقرير، عرض تقديمي، أو كتابة.
- **معلّم خبير في موضوعك**: يحدد الوكيل موضوع المهمة (تعلّم الآلة، تطوير الويب، تصميم المستندات…) ويعلّمك كخبير في هذا المجال: مصطلحاته، وممارساته المعتمدة، وأخطاء المبتدئين فيه. في «تفرّج» يعرض كيف يعمل الخبير، وفي «خذ بيدي» يدرّبك على قرارات المجال الأساسية، وفي «سوقني» يراجع عملك بمعايير المجال. ويتغيّر الدور إذا تغيّر الموضوع.
- **السرعات**: تبدأ الجلسة على «تفرّج»: ينفّذ الوكيل كل شيء ويشرح. في «خذ بيدي» ينفّذ جزءاً وتنفّذ أنت الأجزاء المهمة، وفي «سوقني» تنفّذ أنت أغلب العمل والوكيل يخطط ويراجع ويلمّح.
- **مستويات الشرح**: «باختصار» للخطوات المهمة فقط، و«عادي» (الافتراضي) لكل خطوة مهمة، و«بالتفصيل» لكل جزء وكل قرار والبدائل، ويختار الوكيل لكل خطوة طريقة الشرح الأنسب لموضوعها: مثال بأرقام حقيقية للمعادلة، وجدول بدائل للقرار، وتشبيه للفكرة الجديدة، وشرح سطر سطر للكود الكثيف، وسؤال لاختبار الفهم، وغيرها. المستوى مستقل عن السرعة.
- **شرح خطوة بخطوة**: بعد كل خطوة يشرح الوكيل: ماذا فعل، ولماذا بهذه الطريقة، وكيف. في البرنامج يشرح كل دالة وفائدتها، وفي ملف PDF يشرح ترتيبه والأداة التي استخدمها وخطوات إنشائه. يظهر الشرح كاقتباس يتبع اتجاه النص، فيأتي من اليمين بالعربية.
- **خريطة العمل**: عند انتهاء جزء من العمل يعرض الوكيل أجزاءه (الدوال أو الأقسام) مع سطر عن فائدة كل جزء.
- **التسليم التدريجي**: في «خذ بيدي» و«سوقني» لكل مفهوم ثلاث مراحل: أنا أعمل ← نعمل معاً ← أنت تعمل. ينتقل المفهوم مرحلة للأمام إذا كانت محاولتك صحيحة بتلميح واحد على الأكثر، ويبقى مكانه إذا احتجت تلميحاً مباشراً، ويرجع مرحلة إذا احتجت الحل كاملاً. الخطأ الإملائي البسيط لا يُحسب عليك.
- **التسليم**: يجهّز الوكيل كل ما حول الجزء المهم، ويترك علامة مثل `TODO(أنت)` في الكود أو في المستند، أو يسألك القرار في المحادثة، ثم يكتب لك السياق والمطلوب وتلميحاً، وينتظر محاولتك.
- **المراجعة**: يقول ما هو صحيح وكل مشكلة حقيقية، ثم يصعد سلّم التلميحات درجة درجة: سؤال موجّه، ثم تلميح مباشر، ثم الحل مشروحاً خطوة خطوة.
- **الملخص**: في النهاية تحصل على ما أنجزناه، والدروس، ومرحلة كل مفهوم، ومسرد المصطلحات، وتمرين تالٍ، مع شرح عكسي اختياري.

### الأوامر داخل الوكيل

| قل | ماذا يحدث |
|---|---|
| `/takemyhand <المهمة>` | بدء جلسة في Claude Code (أو `/takemyhand:takemyhand` إذا ثُبّتت كإضافة). في الوكلاء الآخرين: «استخدم takemyhand لـ…». بدون مهمة يسألك الوكيل ماذا تريد أن تعمل |
| تفرّج · خذ بيدي · سوقني | تغيير السرعة |
| بجدية · رجّع المزح | إيقاف المزح أو إعادته |
| باختصار · عادي · بالتفصيل | تغيير مستوى الشرح |
| سوّها أنت | ينفّذ الوكيل هذه الخطوة بنفسه ثم يعود لسرعتك |
| ليش؟ | شرح كامل قبل المتابعة |
| خلصت · صح كذا؟ · أو الصق كودك | مراجعة محاولتك |
| ما أعرف · تلميح | الدرجة التالية من سلّم التلميحات |
| ورني | الحل مشروحاً، ويرجع المفهوم مرحلة |
| ملخص · المصطلحات · اختبرني | الملخص الكامل، أو المسرد فقط، أو 3–5 أسئلة من كود الجلسة |

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE). See [NOTICE](NOTICE).
