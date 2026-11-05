# takemyhand-bar

A control panel above the prompt for the [takemyhand](../../README.md) skill, in Claude Code (desktop app and terminal).

It appears after `/takemyhand` and shows Batbout's settings as buttons: **Speed** (Watch, Guide, Drive), **Depth** (Brief, Normal, Detailed) and **Humor** (On, Off), with a line under each saying what the choice means, plus quick **Recap**, **Quiz** and **Debug** tools. Close it with ×.

Each button sends the same control word you could type, in the language of your session ("guide me" in English, «خذ بيدي» in Arabic), so the skill needs nothing extra and keeps answering in your language. Typing a control word yourself lights the matching button too.

The skill works without the panel; the panel only works in Claude Code.

## Install

From a clone of this repository:

```bash
claude plugin marketplace add /path/to/takemyhand
claude plugin install takemyhand-bar@takemyhand
```

Restart Claude Code, then run `/takemyhand`.

## Develop

```bash
claude plugin validate plugins/takemyhand-bar
claude plugin test plugins/takemyhand-bar
```
