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

## Speeds

| Word (any language) | Who writes |
|---|---|
| **watch** | The agent writes everything and explains |
| **guide** *(default)* | The agent writes routine work; you write the pieces that matter |
| **drive** | You write most of it; the agent plans, reviews and hints |

Say "just do it" at any time and the agent does that step itself, then returns to your speed.

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

Restart your agent, then ask it to *use takemyhand* for your task — in Claude Code: `/takemyhand <your task>`.

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

---

## License

Licensed under the [Apache License, Version 2.0](LICENSE). See [NOTICE](NOTICE).
