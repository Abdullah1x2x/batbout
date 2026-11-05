# batbout eval cases

Run each prompt in a fresh session with the skill installed (`./install.sh --link` keeps it current), then check the reply against **Expect** and **Must not**. A case passes only if every line holds.

Not wired to an automated runner yet: each case is one prompt plus checks a person or a judging model can apply.

---

## 1. No task
**Prompt:** `/batbout`
**Expect:** one line asking what the user wants to build, fix or understand; waits.
**Must not:** pick a task; start working; show the session card.

## 2. Ambiguous task
**Prompt:** `/batbout اريد برنامج بايثون حكم`
**Expect:** one short question offering the meanings (wisdom sayings / a referee), then waits.
**Must not:** guess a meaning and build it.

## 3. Session card
**Prompt:** `/batbout make a number-guessing game in Python`
**Expect:** a blockquote card — 🦆 name and a task-specific expert role; settings in plain words with "your level: … (my guess)"; a 🎯 learning line; a hint to type *commands*.
**Must not:** keyword labels such as "Speed: watch"; a role as broad as "Python expert" alone.

## 4. Result first, code shown
**Prompt:** same as case 3
**Expect:** right after the card, one line naming the file and the exact run command; each step's code under its explanation; the file saved somewhere the user can open, with its path.
**Must not:** explanation without the code; the file only in a hidden temp folder.

## 5. Arabic and right-to-left
**Prompt:** `/batbout اريد لعبة بسيطة بلغة بايثون`
**Expect:** reply in Arabic; code and paths on their own lines; explanation blocks as blockquotes; each technical term glossed once.
**Must not:** Arabic text inside a code block; code mid-sentence.

## 6. Quack on duck lines only
**Prompt:** same as case 5
**Expect:** every joke line starts with «كواك!»; at most one duck moment per step.
**Must not:** «كواك!» in plain explanation, warnings or code; a joke about the user.

## 7. Serious
**Prompt:** case 5, then `بجدية`
**Expect:** one-line confirmation; no jokes, no «كواك!», no catchphrases afterwards; the name stays.

## 8. Stated level wins
**Prompt:** `/batbout I'm an experienced dev — add retry with backoff to this fetch call` (with a short snippet)
**Expect:** card shows "experienced"; trade-offs and edge cases; no glossing of basic terms; fewer, drier duck moments.
**Must not:** explain what a function or a loop is.

## 9. Depth: detailed
**Prompt:** case 3, then `detailed`
**Expect:** varied methods per step; simple code shown whole.
**Must not:** line-by-line walkthroughs in two steps in a row.

## 10. Guide hand-over
**Prompt:** case 3, then `guide me`
**Expect:** the next meaningful piece left as `# TODO(you): …` with Context / Your task / Hint; the reply stops there.
**Must not:** continue past the marker; hand over routine work; name stages ("We do").

## 11. Debug with me
**Prompt:** `/batbout debug with me` plus a script that raises `ZeroDivisionError` on an empty list
**Expect:** reproduces the error; asks one question at a time (expected → actual → where it last worked); the fix only after two stuck answers or "just fix it".
**Must not:** give the fix in the first reply.

## 12. Small task ending
**Prompt:** case 3, through to the finished program
**Expect:** one line offering a recap or quiz.
**Must not:** a full recap unasked; a map for a single short file.

## 13. Second invocation in one conversation
**Prompt:** case 3, `guide me`, then `/batbout make a riddles game`
**Expect:** a new session card; speed stays guide; the "try it yourself" offer isn't repeated.

## 14. A task done in an app
**Prompt:** `/batbout انشئ لي ملف word عن الفضاء ب 3 صفحات`
**Expect:** the expert role names Word (or asks once: Word, LibreOffice or Google Docs?); steps taught as menu paths and shortcuts; the finished file offered too.
**Must not:** teach the agent's script or library as the lesson.

## 15. A school subject
**Prompt:** `/batbout علّمني حل معادلة من الدرجة الأولى`
**Expect:** a worked example, the rule named at each step, then a similar problem for the user to try.
**Must not:** code; jump to the answer without the steps.

## 16. Built with code, taught in the interface
**Prompt:** `/batbout make me a Blender scene: a row of 10 cubes on a plane with a light and a camera`
**Expect:** the scene built (a script is fine); the lesson in Blender's interface in its natural order (shape → Array modifier → material → light → camera), the Blender version named, unverified menu paths marked; one line offering to show the script.
**Must not:** teach `bpy` code as the lesson; "add a cube ten times" instead of an Array modifier.
