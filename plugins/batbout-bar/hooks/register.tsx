import { atom, read, update } from 'claude-code'
import type { Register, RenderChildren } from 'claude-code'

import type { Depth, Lang, BarSettings, Progress, Speed } from '../types'

const INITIAL: BarSettings = {
  isActive: false, isCollapsed: false, speed: 'watch', depth: 'normal', humor: true, lang: 'ar', progress: [],
}
const settings = atom({ plugin: 'batbout-bar', key: 'settings' } as const, INITIAL)
// A value stored by 0.1.x lacks the newer fields; fill them from INITIAL
const fill = (s: Partial<BarSettings> | undefined): BarSettings => ({ ...INITIAL, ...s })
const edit = ($: Parameters<typeof read>[0], fn: (s: BarSettings) => BarSettings) =>
  update($, settings, s => fn(fill(s)))

// The words the batbout skill already understands; a button sends the same word
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
// The words that change a setting; the rest are tools that ask Batbout
const SETTINGS: readonly Word[] = [...SPEEDS, ...DEPTHS, 'serious', 'jokesOn']
// Glossary and help stay reachable by typing; the bar keeps only the frequent ones
const ACTIONS = ['recap', 'quiz', 'debug'] as const

// Everything the bar draws. Always English: the reply language follows the
// word a button sends, not these labels
const T = {
  name: 'Batbout', speed: 'SPEED', depth: 'DEPTH', humor: 'HUMOR', learned: 'Learned',
  watch: 'Watch', guide: 'Guide', drive: 'Drive', brief: 'Brief', normal: 'Normal', detailed: 'Detailed',
  on: 'On', off: 'Off', recap: 'Recap', quiz: 'Quiz', debug: 'Debug',
  minimize: 'Minimize', expand: 'Open', close: 'Hide',
  meaning: {
    watch: 'Batbout builds, you watch', guide: 'You write the key pieces', drive: 'You build, Batbout reviews',
    brief: 'Key steps only', normal: 'Every step: what, why, how', detailed: 'Every decision and alternative',
    on: 'One duck joke per step', off: 'Serious, no jokes',
  },
} as const

// A symbol before each tool name
const ICONS: Record<(typeof ACTIONS)[number], string> = { recap: '≡', quiz: '?', debug: '🐞' }

// The logo for surfaces that draw SVG; the terminal shows the duck glyph instead
const DUCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">'
  + '<ellipse cx="10.5" cy="15.5" rx="8.5" ry="6" fill="#F5C542"/>'
  + '<circle cx="15" cy="8" r="5" fill="#F5C542"/>'
  + '<path d="M19.4 8.2 L23.5 9.4 L19.4 10.9 Z" fill="#F08A24"/>'
  + '<circle cx="16.4" cy="7" r="0.95" fill="#2B2B2B"/>'
  + '<path d="M5.5 14.5 Q10 18 14.5 14.5" stroke="#D9A21F" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
  + '</svg>'

// The duck's colour; a theme key, so it reads in light and dark themes
const ACCENT = 'warning'
// The duck's colour at low strength, light enough for either theme
const SHADE = 'rgba(245, 197, 66, 0.16)'

// How tight the bar is, by the cells it is given: the shape stays the same,
// only the gaps (and, below wide, the meaning lines) shrink
export type Layout = 'wide' | 'medium' | 'narrow' | 'mini'
export const layoutOf = (columns: number | undefined, rows: number | undefined, isCollapsed: boolean): Layout =>
  isCollapsed || (rows !== undefined && rows < 4) ? 'mini'
    : columns === undefined || columns >= 84 ? 'wide'
      : columns >= 60 ? 'medium'
        : 'narrow'

// Diacritics and punctuation stripped, so "تفرج" and "Watch!" still match
export const normalize = (text: string): string =>
  text.toLowerCase().replace(/[ً-ْ]/g, '').replace(/[.!?؟،,:]+$/u, '').trim()

export const langOf = (text: string, fallback: Lang): Lang =>
  /[؀-ۿ]/.test(text) ? 'ar' : /[a-z]/i.test(text) ? 'en' : fallback

// The one-word argument of `/batbout-bar <word>`; the key itself where it reads well
const ARG: Partial<Record<Word, string>> = { jokesOn: 'jokes' }
const argOf = (w: Word) => ARG[w] ?? w

// Which control word a text is: its key, its /batbout-bar argument, or the word
// in either language ("/batbout drive: …", "Detailed!", "خذ بيدي")
export const wordOf = (text: string): Word | undefined => {
  const said = normalize(text)
  return (Object.keys(WORDS) as Word[]).find(w => said === w.toLowerCase() || said === argOf(w)
    || said === normalize(WORDS[w].ar) || said === normalize(WORDS[w].en))
}

// The settings a typed message changes; an unrelated message changes nothing
export const apply = (s: BarSettings, text: string): BarSettings => {
  const w = wordOf(text)
  if (w === undefined) return s
  if ((SPEEDS as readonly Word[]).includes(w)) return { ...s, speed: w as Speed }
  if ((DEPTHS as readonly Word[]).includes(w)) return { ...s, depth: w as Depth }
  if (w === 'serious') return { ...s, humor: false }
  if (w === 'jokesOn') return { ...s, humor: true }
  return s
}

// What `/batbout-bar <setting>` prints, and the hidden note that tells the skill,
// so a setting changes without starting a reply
export const noteFor = (s: BarSettings): { text: string; context: string[] } => {
  const humor = s.humor ? 'on' : 'off'
  return {
    text: `Speed: ${T[s.speed]} · Depth: ${T[s.depth]} · Humor: ${T[humor]}`,
    context: [`[batbout-bar] The user changed Batbout's settings with the bar. Now: speed ${s.speed} `
      + `("${WORDS[s.speed].en}"), depth ${s.depth}, humor ${humor}. Apply them from your next reply on; `
      + `no reply is needed now.`],
  }
}

// "/batbout guide: task" or "/batbout detailed: task" starts with that setting
export const start = (s: BarSettings, args: string): BarSettings => {
  const head = args.split(':')[0] ?? ''
  const lang = langOf(args, s.lang)
  const fresh = { ...s, isActive: true, isCollapsed: false, lang }
  return args.includes(':') ? apply(fresh, head) : fresh
}

// The skill marks an advance with one line, "✓ Progress: <concept> — <next>"
// (in the session's language); the concept is the part before the dash
const PROGRESS_LINE = /^[>\s*_]*✓\s*\**[^:：\n]{1,24}?\**\s*[:：]\s*\**(.+?)\**\s*$/gmu
export const progressIn = (answer: string): string[] =>
  [...answer.matchAll(PROGRESS_LINE)]
    .map(m => (m[1] ?? '').split(/\s+[—–-]\s+/)[0]?.trim() ?? '')
    .filter(c => c.length > 0)

export const record = (list: Progress[], concepts: string[]): Progress[] =>
  concepts.reduce((acc, concept) => {
    const old = acc.find(p => normalize(p.concept) === normalize(concept))
    const rest = acc.filter(p => p !== old)
    // The latest first; the bar shows a few, so keep a short list
    return [{ concept, count: (old?.count ?? 0) + 1 }, ...rest].slice(0, 8)
  }, list)

const isSkill = (name: string) => /(^|:)batbout$/.test(name)
const isBarCommand = (name: string) => /(^|:)batbout-bar$/.test(name)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // Brings the bar back after it was hidden, without starting a new task
    await $.command.register({
      name: 'batbout-bar', description: 'Show the batbout bar, or change a setting quietly',
      argumentHint: '[watch|guide|drive|brief|normal|detailed|serious|jokes]',
    }).catch(() => undefined)
    return next(e)
  })

  // `/batbout-bar` shows the bar; `/batbout-bar guide` (any setting word) changes a
  // setting quietly; `/batbout-bar recap` (a tool) asks Batbout for it
  // The registered name can come back prefixed (`<plugin>:batbout-bar`), so match
  // any form of it here rather than one exact name in the matcher
  on('command.run', async ($, e, next) => {
    if (!isBarCommand(e.command)) return next(e)
    const w = wordOf(e.args)
    if (e.args.trim() === '') {
      await edit($, s => ({ ...s, isActive: true, isCollapsed: false }))
      return { text: 'Batbout bar shown.' }
    }
    if (w === undefined) {
      return { text: `Unknown setting "${e.args.trim()}". Try: ${(Object.keys(WORDS) as Word[]).map(argOf).join(', ')}` }
    }
    const s = fill(await read($, settings))
    if (!SETTINGS.includes(w)) {
      void $.prompt.submit({ text: WORDS[w][s.lang] })
      return {}
    }
    await edit($, x => ({ ...apply(x, w), isActive: true }))
    return noteFor(apply(s, w))
  })

  on('prompt.submit', async ($, e, next) => {
    // The bar only follows along: its bookkeeping failing must never block a prompt
    const track = e.command && isSkill(e.command.name)
      ? edit($, s => start(s, e.command?.args ?? ''))
      : e.command
        ? Promise.resolve()
        : edit($, s => (s.isActive ? { ...apply(s, e.text), lang: langOf(e.text, s.lang) } : s))
    await track.catch(() => undefined)
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    const concepts = e.agentId === undefined ? progressIn(e.answer) : []
    if (concepts.length > 0) {
      await edit($, s => (s.isActive ? { ...s, progress: record(s.progress, concepts) } : s)).catch(() => undefined)
    }
    return done
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const s = fill(await read($, settings))
    if (!s.isActive || e.props.hasSurvey) {
      return next(e)
    }

    const elements = $.ui.resolve(e)
    const { Box, Button, Text } = elements
    const t = T
    const isDesktop = e.surface === 'desktop'
    const layout = layoutOf(e.props.bodyColumns, e.props.maxRows, s.isCollapsed)

    // A tool asks Batbout, so it sends the word as a message
    const send = (w: Word) => void $.prompt.submit({ text: WORDS[w][s.lang] })
    // A setting changes quietly through `/batbout-bar <word>`: lit at once here,
    // the command (queued until the turn ends) prints it and tells the skill
    const set = async (w: Word) => {
      await edit($, x => apply(x, w))
      // A refused run (a host limit) leaves the setting changed, only unannounced
      void $.command.run({ command: 'batbout-bar', args: argOf(w) }).catch(() => undefined)
    }

    // A segmented control: the chosen option sits on a light duck-coloured
    // shade, in the duck's colour and bold (colour is never the only sign);
    // the others are quiet text. No frame, so it is as tall as the rest.
    // The terminal has no translucent fill, so there the shade is left out
    const option = (key: string, label: string, isOn: boolean, onPress: () => void) => isOn
      ? (
        <Box key={`on-${key}`} backgroundColor={isDesktop ? SHADE : undefined}>
          <Button key={key} label={label} plain onPress={onPress}>
            <Text color={ACCENT} weight="bold" bold underline={!isDesktop}>{label}</Text>
          </Button>
        </Box>
      )
      : <Button key={key} label={label} plain dimColor onPress={onPress} />
    // Every tool keeps its name: a symbol alone told nobody what it does
    const tool = (key: (typeof ACTIONS)[number]) => (
      <Button key={key} label={`${ICONS[key]} ${t[key]}`} plain dimColor onPress={() => send(key)} />
    )

    const humor = s.humor ? 'on' : 'off'
    const setHumor = (isOn: boolean) => () => {
      if (isOn !== s.humor) void set(isOn ? 'jokesOn' : 'serious')
    }
    const speeds = SPEEDS.map(v => option(v, t[v], s.speed === v, () => set(v)))
    const depths = DEPTHS.map(v => option(v, t[v], s.depth === v, () => set(v)))
    const humors = [
      option('humorOn', t.on, s.humor, setHumor(true)),
      option('humorOff', t.off, !s.humor, setHumor(false)),
    ]

    // The terminal's table has no Svg
    const logo = 'Svg' in elements
      ? <elements.Svg source={DUCK_SVG} alt="Batbout duck" width={20} height={20} />
      : <Text>🦆</Text>
    const brand = (
      <Box flexDirection="row" alignItems="center" columnGap={1}>
        {logo}
        <Text color={ACCENT} weight="bold" bold>{t.name}</Text>
      </Box>
    )
    const hide = (
      // × is in the app's font; ✕ fell back to a plain letter X
      <Button key="close" label={`× ${t.close}`} plain dimColor
        onPress={() => edit($, x => ({ ...x, isActive: false }))} />
    )

    // Collapsed or squeezed: one row, the settings as words, a way back open
    if (layout === 'mini') {
      const summary = [t[s.speed], t[s.depth], `${t.humor.toLowerCase()} ${t[humor]}`].join(' · ')
      return (
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" columnGap={1}>
          <Box flexDirection="row" alignItems="center" columnGap={1} flexShrink={1}>
            {brand}
            <Text dimColor size="footnote" wrap="truncate-end">{summary}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" columnGap="sm">
            <Button key="expand" label={`▴ ${t.expand}`} plain dimColor
              onPress={() => edit($, x => ({ ...x, isCollapsed: false }))} />
            {hide}
          </Box>
        </Box>
      )
    }

    // A desktop button pads its label even when plain; indent the title and
    // the meaning by as much, so all three lines start on one edge
    const inset = isDesktop ? 'sm' : 0
    const isNarrow = layout === 'narrow'
    // Title, control, and (wide only) what it means
    const cell = (title: string, control: RenderChildren[], meaning: string) => (
      <Box flexDirection="column" rowGap="xs" flexShrink={1}>
        <Box paddingLeft={inset}>
          <Text dimColor size="caption" weight="semibold">{title}</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" columnGap={isNarrow ? 0 : 1}>{control}</Box>
        {layout === 'wide' && (
          <Box paddingLeft={inset}>
            <Text dimColor size="footnote" wrap="truncate-end">{meaning}</Text>
          </Box>
        )}
      </Box>
    )

    // A thin vertical line between two settings, as tall as a cell: one
    // glyph per row (no Box draws one side of a border)
    const divider = (key: string) => (
      <Box key={key} flexDirection="column" justifyContent="center">
        {Array.from({ length: (layout === 'wide' ? 3 : 2) + (isDesktop ? 1 : 0) }, (_, i) => (
          <Text key={`${key}-${i}`} dimColor>│</Text>
        ))}
      </Box>
    )

    // What the learner has taken over so far, latest first
    const learned = s.progress.length > 0 && (
      <Box paddingLeft={inset}>
        <Text dimColor size="footnote" wrap="truncate-end">
          {`✓ ${t.learned}: ${s.progress.slice(0, 4).map(p => (p.count > 1 ? `${p.concept} ×${p.count}` : p.concept)).join(' · ')}`}
        </Text>
      </Box>
    )

    // Header: the duck and its name on one side, the tools on the other;
    // below, the three settings side by side, closer together as the bar narrows
    return (
      // No frame of our own: the app's band is already a rounded box
      <Box flexDirection="column" rowGap={1}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          {brand}
          <Box flexDirection="row" alignItems="center" columnGap={isNarrow ? 'xs' : 'sm'}>
            {ACTIONS.map(tool)}
            <Button key="collapse" label={`▾ ${t.minimize}`} plain dimColor
              onPress={() => edit($, x => ({ ...x, isCollapsed: true }))} />
            {hide}
          </Box>
        </Box>
        <Box flexDirection="row" justifyContent="space-between"
          columnGap={layout === 'wide' ? 3 : layout === 'medium' ? 2 : 1}>
          {cell(t.speed, speeds, t.meaning[s.speed])}
          {divider('d1')}
          {cell(t.depth, depths, t.meaning[s.depth])}
          {divider('d2')}
          {cell(t.humor, humors, t.meaning[humor])}
        </Box>
        {learned}
      </Box>
    )
  })
}
