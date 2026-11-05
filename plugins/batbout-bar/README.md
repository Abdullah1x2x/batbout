# batbout-bar

A control panel above the prompt for the [batbout](../../README.md) skill, in Claude Code (desktop app and terminal).

It appears after `/batbout` and shows Batbout's settings as buttons: **Speed** (Watch, Guide, Drive), **Depth** (Brief, Normal, Detailed) and **Humor** (On, Off), with a line under each saying what the choice means, plus quick **Recap**, **Quiz** and **Debug** tools, and a **Learned** line listing the concepts you have taken over. Labels are always in English; the word a button sends still follows your session's language.

The bar fits the window: wide, it shows a meaning under each setting; narrower, it drops those lines and brings the sections closer, keeping the same shape. ▾ shrinks it to one row (▴ opens it again); × hides it, and `/batbout-bar` brings it back.

A setting button runs `/batbout-bar <setting>` (for example `/batbout-bar guide`): it prints one line with the new settings and leaves Batbout a hidden note, so the change costs no reply. You can type the same command yourself; the setting words are `watch`, `guide`, `drive`, `brief`, `normal`, `detailed`, `serious` and `jokes`. Recap, Quiz and Debug need an answer, so they send their word as a message, in the language of your session ("quiz me" in English, «اختبرني» in Arabic). Typing a control word yourself lights the matching button too.

The skill works without the panel; the panel only works in Claude Code.

## Install

From a clone of this repository:

```bash
claude plugin marketplace add /path/to/batbout
claude plugin install batbout-bar@batbout
```

Restart Claude Code, then run `/batbout`.

## Develop

```bash
claude plugin validate plugins/batbout-bar
claude plugin test plugins/batbout-bar
```
