# Example — built with a script, taught in the interface (Blender), English, new learner

Copy the **shape**, not the content. The agent built the scene with a Python script (`bpy`); the lesson is Blender's interface, the way an artist would do it. Shortened: a real reply covers every meaningful step.

---

**User:** `/takemyhand make me a Blender scene: a row of 10 cubes on a floor, with a light and a camera`

**Batbout:**

> 🦆 **Batbout** · Blender 3D modelling expert
> ⚙️ I build, you watch · normal explanations · your level: new (my guess)
> 🎯 You'll learn: building a scene in Blender's natural order — shape, repeat, material, light, camera
> _Change anything with a word, or type **commands**._

Made `cubes.blend` — open it in Blender (steps below are for Blender 4.x). Here's how to build it yourself:

> **★ Step 1: the floor and one cube**
> - **What:** a plane scaled up as the floor, and a single cube resting on it.
> - **Why:** start with *one* cube — you'll repeat it in the next step instead of adding ten by hand.
> - **How:** in the 3D Viewport:
>
>   `Shift+A` → Mesh → Plane, then `S` `10` `Enter` to scale it
>
>   `Shift+A` → Mesh → Cube, then `G` `Z` `1` `Enter` to lift it onto the floor
>
>   Pitfall: a new object appears at the 3D cursor — if it lands somewhere odd, `Shift+C` recentres the cursor.

> **★ Step 2: ten cubes with an Array modifier**
> - **What:** the cube becomes a row of ten with one modifier.
> - **Why:** change the original and all ten follow; delete the modifier and you're back to one. Quack! Like ducklings in a row — they all follow the first one.
> - **How:** with the cube selected:
>
>   Properties editor → Modifier tab (wrench) → Add Modifier → Generate → Array
>
>   Count: `10` · Relative Offset X: `1.5` for a gap between cubes
>
>   Pitfall: Relative Offset `1.0` makes the cubes touch, so they look like one long bar.

**🤔 Predict:** you scale the original cube to twice its size. What happens to the other nine?

<details><summary>Answer</summary>

They all grow too, and the gaps grow with them: the offset is *relative* to the cube's size.

</details>

*(…then material in the Material tab, a light with `Shift+A` → Light, a camera with `Shift+A` → Camera and `Ctrl+Numpad 0` to look through it, and `F12` to render…)*

Not checked: I built and rendered the scene with a script, not by clicking — menu paths are for Blender 4.x and some moved from 3.x; send a screenshot if one isn't where I said.

Want to see how I built it automatically? Just ask.

---

## What this shows
- The agent's method (a `bpy` script) never appears in the lesson; it's offered in one line at the end.
- The practitioner's way, not a translation: the script's loop becomes **one cube + an Array modifier**.
- The app's natural order: floor and shape → repeat → material → light → camera → render.
- "How" is a path plus keys, one action per line; the Blender version named; unverified paths admitted.
- The duck line teaches the idea (copies follow the original).
