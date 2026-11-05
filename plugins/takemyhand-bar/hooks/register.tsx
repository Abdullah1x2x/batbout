import { atom, read, update } from 'claude-code'
import type { Register, RenderChildren } from 'claude-code'

import type { Depth, Lang, BarSettings, Speed } from '../types'

const INITIAL: BarSettings = { isActive: false, speed: 'watch', depth: 'normal', humor: true, lang: 'ar' }
const settings = atom({ plugin: 'takemyhand-bar', key: 'settings' } as const, INITIAL)

// The words the takemyhand skill already understands; a button sends the same word
const WORDS = {
  watch: { ar: 'تفرّج', en: 'watch' },
  guide: { ar: 'خذ بيدي', en: 'guide me' },
  drive: { ar: 'سوقني', en: "I'll drive" },
  brief: { ar: 'باختصار', en: 'brief' },
  normal: { ar: 'عادي', en: 'normal' },
  detailed: { ar: 'بالتفصيل', en: 'detailed' },
  serious: { ar: 'بجدية', en: 'serious' },
  jokesOn: { ar: 'رجّع المزح', en: 'jokes on' },
  recap: { ar: 'ملخص', en: 'recap' },
  quiz: { ar: 'اختبرني', en: 'quiz me' },
  glossary: { ar: 'المصطلحات', en: 'glossary' },
  debug: { ar: 'صحّح معي', en: 'debug with me' },
  commands: { ar: 'أوامر', en: 'commands' },
} as const
type Word = keyof typeof WORDS

const SPEEDS: readonly Speed[] = ['watch', 'guide', 'drive']
const DEPTHS: readonly Depth[] = ['brief', 'normal', 'detailed']
// Glossary and help stay reachable by typing; the bar keeps only the frequent ones
const ACTIONS: readonly Word[] = ['recap', 'quiz', 'debug']
// Labels stay English; the word a button sends follows the user's language,
// so a press doesn't switch the skill's reply language
const NAMES: Record<Word, string> = {
  watch: 'Watch', guide: 'Guide', drive: 'Drive',
  brief: 'Brief', normal: 'Normal', detailed: 'Detailed',
  serious: 'Humor on', jokesOn: 'Humor off',
  recap: 'Recap', quiz: 'Quiz', glossary: 'Glossary', debug: 'Debug', commands: 'Help',
}
// Only the tools carry a symbol (a Button takes text alone, so no SVG inside);
// the segmented options read as plain words
const ICONS: Partial<Record<Word, string>> = { recap: '≡', quiz: '?', debug: '⌕' }
// One line under each cell saying what the chosen setting means
const MEANING: Record<Speed | Depth, string> = {
  watch: 'Batbout builds, you watch', guide: 'You write the key pieces', drive: 'You build, Batbout reviews',
  brief: 'Key steps only', normal: 'Every step: what, why, how', detailed: 'Every decision and alternative',
}
const HUMOR_MEANING = { on: 'One duck joke per step', off: 'Serious, no jokes' }

// The logo for surfaces that draw SVG; the terminal shows the duck glyph instead
const DUCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
  + '<ellipse cx="10.5" cy="15.5" rx="8.5" ry="6" fill="#F5C542"/>'
  + '<circle cx="15" cy="8" r="5" fill="#F5C542"/>'
  + '<path d="M19.4 8.2 L23.5 9.4 L19.4 10.9 Z" fill="#F08A24"/>'
  + '<circle cx="16.4" cy="7" r="0.95" fill="#2B2B2B"/>'
  + '<path d="M5.5 14.5 Q10 18 14.5 14.5" stroke="#D9A21F" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
  + '</svg>'

const LABELS = Object.fromEntries(
  (Object.keys(NAMES) as Word[]).map(w => [w, ICONS[w] ? `${ICONS[w]} ${NAMES[w]}` : NAMES[w]]),
) as Record<Word, string>

// The duck's colour; a theme key, so it reads in light and dark themes
const ACCENT = 'warning'

// Diacritics and punctuation stripped, so "تفرج" and "Watch!" still match
export const normalize = (text: string): string =>
  text.toLowerCase().replace(/[ً-ْ]/g, '').replace(/[.!?؟،,:]+$/u, '').trim()

export const langOf = (text: string, fallback: Lang): Lang =>
  /[؀-ۿ]/.test(text) ? 'ar' : /[a-z]/i.test(text) ? 'en' : fallback

// The settings a typed message changes; an unrelated message changes nothing
export const apply = (s: BarSettings, text: string): BarSettings => {
  const said = normalize(text)
  // The setting's own name counts too: "/takemyhand drive: …"
  const is = (w: Word) => said === w.toLowerCase() || said === normalize(WORDS[w].ar) || said === normalize(WORDS[w].en)
  const speed = SPEEDS.find(is)
  const depth = DEPTHS.find(is)
  if (speed) return { ...s, speed }
  if (depth) return { ...s, depth }
  if (is('serious')) return { ...s, humor: false }
  if (is('jokesOn')) return { ...s, humor: true }
  return s
}

// "/takemyhand guide: task" or "/takemyhand detailed: task" starts with that setting
export const start = (s: BarSettings, args: string): BarSettings => {
  const head = args.split(':')[0] ?? ''
  const lang = langOf(args, s.lang)
  const fresh = { ...s, isActive: true, lang }
  return args.includes(':') ? apply(fresh, head) : fresh
}

const isSkill = (name: string) => /(^|:)takemyhand$/.test(name)

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    // The bar only follows along: its bookkeeping failing must never block a prompt
    const track = e.command && isSkill(e.command.name)
      ? update($, settings, s => start(s, e.command?.args ?? ''))
      : e.command
        ? Promise.resolve()
        : update($, settings, s => (s.isActive ? { ...apply(s, e.text), lang: langOf(e.text, s.lang) } : s))
    await track.catch(() => undefined)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = await read($, settings)
    if (!s.isActive || e.props.hasSurvey) {
      return next(e)
    }

    const elements = $.ui.resolve(e)
    const { Box, Button, Text } = elements

    // Update first: the mod's own submission doesn't pass through its own hook
    const send = async (w: Word, change: (s: BarSettings) => BarSettings = x => x) => {
      await update($, settings, change)
      void $.prompt.submit({ text: WORDS[w][s.lang] })
    }

    // A segmented control: the chosen option sits in a thin duck-coloured
    // outline hugging its word (the desktop ignores a Text background, and a
    // primary button is the app's full-size pill); the others are quiet text
    const option = (key: string, label: string, isOn: boolean, onPress: () => void) => isOn
      ? (
        <Box key={`on-${key}`} borderStyle="round" borderColor={ACCENT}>
          <Button key={key} label={label} plain onPress={onPress} />
        </Box>
      )
      : <Button key={key} label={label} plain dimColor onPress={onPress} />
    const tool = (key: Word) => (
      <Button key={key} label={LABELS[key]} plain dimColor onPress={() => send(key)} />
    )

    // A desktop button pads its label even when plain; indent the title and
    // the meaning by as much, so all three lines start on one edge
    const inset = e.surface === 'desktop' ? 'sm' : 0
    // A cell, as in Ponytail's stats row: title, control, what it means
    const cell = (title: string, control: RenderChildren[], meaning: string) => (
      <Box flexDirection="column" rowGap="xs">
        <Box paddingLeft={inset}>
          <Text dimColor size="caption" weight="semibold">{title}</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" columnGap={1}>{control}</Box>
        <Box paddingLeft={inset}>
          <Text dimColor size="footnote">{meaning}</Text>
        </Box>
      </Box>
    )
    // The terminal's table has no Svg
    const logo = 'Svg' in elements
      ? <elements.Svg source={DUCK_SVG} alt="Batbout duck" width={20} height={20} />
      : <Text>🦆</Text>
    const humor = s.humor ? 'on' : 'off'
    const setHumor = (isOn: boolean) => () => {
      if (isOn !== s.humor) void send(isOn ? 'jokesOn' : 'serious', x => ({ ...x, humor: isOn }))
    }

    // Header: the duck and its name on the left, the tools on the right;
    // below, three cells spread edge to edge, so the right margin equals the left
    return (
      // No frame of our own: the app's band is already a rounded box, and a
      // second frame inside it left an empty strip on both sides
      <Box flexDirection="column" rowGap={1}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box flexDirection="row" alignItems="center" columnGap={1}>
            {logo}
            <Text color={ACCENT} weight="bold" bold>Batbout</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" columnGap="sm">
            {ACTIONS.map(tool)}
            {/* × is in the app's font; ✕ fell back to a plain letter X */}
            <Button key="close" label="×" plain dimColor role="dismiss"
              onPress={() => update($, settings, x => ({ ...x, isActive: false }))} />
          </Box>
        </Box>
        <Box flexDirection="row" justifyContent="space-between" columnGap={3}>
          {cell('SPEED', SPEEDS.map(v => option(v, NAMES[v], s.speed === v,
            () => send(v, x => ({ ...x, speed: v })))), MEANING[s.speed])}
          {cell('DEPTH', DEPTHS.map(v => option(v, NAMES[v], s.depth === v,
            () => send(v, x => ({ ...x, depth: v })))), MEANING[s.depth])}
          {cell('HUMOR', [
            option('humorOn', 'On', s.humor, setHumor(true)),
            option('humorOff', 'Off', !s.humor, setHumor(false)),
          ], HUMOR_MEANING[humor])}
        </Box>
      </Box>
    )
  })
}
