import { expect, test } from 'claude-code/testing'
import { layoutOf, noteFor, progressIn, record, wordOf } from './register'

const BAND = {
  plugin: 'batbout-bar',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const

// A prompt as the person types it; a slash command carries its name and args
const typed = (text: string, command?: { name: string; args: string }) => ({
  text, wait: false, origin: { kind: 'composer' } as const, ...(command ? { command } : {}),
})

test('the bar stays hidden until /batbout runs', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

test('/batbout shows the bar with English labels, on every surface', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/batbout برنامج ألغاز', { name: 'batbout', args: 'برنامج ألغاز' }))

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Button', key: 'guide' }))?.props.label).toBe('Guide')
    expect((await ui.find({ type: 'Button', key: 'watch' }))?.props.dimColor).toBe(undefined)
    await ui.unmount()
  }
})

test('a typed control word lights its button', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/batbout make a game', { name: 'batbout', args: 'make a game' }))
  await $.prompt.submit(typed('Detailed!'))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await ui.find({ type: 'Button', key: 'detailed' }))?.props.dimColor).toBe(undefined)
  expect((await ui.find({ type: 'Button', key: 'normal' }))?.props.dimColor).toBe(true)
  await ui.unmount()
})

test('a setting lights at once and sends no message; a tool sends its word; close hides the bar', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })
  // Stands for the engine's own band, drawn once the bar steps aside
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })

  await $.prompt.submit(typed('/batbout drive: add a login form', { name: 'batbout', args: 'drive: add a login form' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Button', key: 'drive' }))?.props.dimColor).toBe(undefined)

  const before = sent.length
  await ui.press({ key: 'guide' })
  expect(sent.length).toBe(before)
  expect((await ui.find({ type: 'Button', key: 'guide' }))?.props.dimColor).toBe(undefined)
  await ui.press({ key: 'recap' })
  expect(sent.at(-1)).toBe('recap')

  await ui.press({ key: 'close' })
  expect(await ui.find({ type: 'Button', key: 'guide' })).toBe(undefined)
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

test('in an Arabic session a tool sends the Arabic word', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  await $.prompt.submit(typed('/batbout برنامج ألغاز', { name: 'batbout', args: 'برنامج ألغاز' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'quiz' })
  expect(sent.at(-1)).toBe('اختبرني')
  await ui.unmount()
})

test('humor Off lights without a message; the logo is an SVG on desktop', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  await $.prompt.submit(typed('/batbout make a game', { name: 'batbout', args: 'make a game' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ type: 'Svg' })).not.toBe(undefined)
  await ui.press({ key: 'humorOff' })
  expect(sent.at(-1)).toBe('/batbout make a game')
  expect((await ui.find({ type: 'Button', key: 'humorOff' }))?.props.dimColor).toBe(undefined)
  await ui.unmount()
})

test('collapse shrinks the bar to one row; open brings it back', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/batbout make a game', { name: 'batbout', args: 'make a game' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'collapse' })
  expect(await ui.find({ type: 'Button', key: 'guide' })).toBe(undefined)
  expect((await ui.find({ type: 'Text', text: /Watch · Normal/ }))).not.toBe(undefined)
  await ui.press({ key: 'expand' })
  expect(await ui.find({ type: 'Button', key: 'guide' })).not.toBe(undefined)
  await ui.unmount()
})

test('a narrow bar keeps its shape: tool names and dividers stay, meanings go', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/batbout make a game', { name: 'batbout', args: 'make a game' }))

  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns: 50 }, surface: 'terminal' })
  expect((await ui.find({ type: 'Button', key: 'recap' }))?.props.label).toBe('≡ Recap')
  expect(await ui.find({ type: 'Text', text: '│' })).not.toBe(undefined)
  expect(await ui.find({ type: 'Text', text: /what, why, how/ })).toBe(undefined)
  expect(await ui.find({ type: 'Button', key: 'guide' })).not.toBe(undefined)
  await ui.unmount()
})

test('layout follows the width and the height', () => {
  expect(layoutOf(120, 10, false)).toBe('wide')
  expect(layoutOf(80, 10, false)).toBe('medium')
  expect(layoutOf(40, 10, false)).toBe('narrow')
  expect(layoutOf(120, 3, false)).toBe('mini')
  expect(layoutOf(120, 10, true)).toBe('mini')
  expect(layoutOf(undefined, undefined, false)).toBe('wide')
})

test('progress lines are read in both languages and counted', () => {
  const answer = 'Done.\n\n✓ Progress: comparison logic — next time you write the whole function.\n'
    + '> ✓ تقدّم: التحقق من المدخلات — في المرة القادمة تكتب الشرط كله'
  expect(progressIn(answer)).toEqual(['comparison logic', 'التحقق من المدخلات'])
  expect(progressIn('✓ done, no colon here')).toEqual([])
  const once = record([], ['comparison logic'])
  expect(record(once, ['Comparison logic'])).toEqual([{ concept: 'Comparison logic', count: 2 }])
})

test('a wide bar draws dividers between the settings', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/batbout make a game', { name: 'batbout', args: 'make a game' }))

  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns: 120 }, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: '│' })).not.toBe(undefined)
  expect((await ui.find({ type: 'Button', key: 'collapse' }))?.props.label).toBe('▾ Minimize')
  await ui.unmount()
})

test('/batbout-bar words are read in any form; the note names the new settings', () => {
  expect(wordOf('jokes')).toBe('jokesOn')
  expect(wordOf('Guide')).toBe('guide')
  expect(wordOf('خذ بيدي')).toBe('guide')
  expect(wordOf('hello')).toBe(undefined)
  const note = noteFor({ isActive: true, isCollapsed: false, speed: 'guide', depth: 'brief', humor: false, lang: 'ar', progress: [] })
  expect(note.text).toBe('Speed: Guide · Depth: Brief · Humor: Off')
  expect(note.context[0]).toContain('speed guide')
})

// A slash command as the person types it
const ran = (command: string, args: string) => ({
  command, args, origin: { kind: 'composer' } as const, presentation: { isFullscreen: false, columns: 80 },
})

test('/batbout-bar guide answers with the new settings', async ($, on) => {
  on('command.register', () => ({ value: { command: 'batbout-bar' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  const out = await $.command.run(ran('batbout-bar', 'guide'))
  expect(out.text).toMatch(/Guide/)
  const prefixed = await $.command.run(ran('batbout-bar:batbout-bar', 'drive'))
  expect(prefixed.text).toMatch(/Drive/)
  // A host that puts the argument in the name, and one that sends no args at all
  const joined = await $.command.run({ ...ran('batbout-bar watch', ''), args: undefined as unknown as string })
  expect(joined.text).toMatch(/Watch/)
  const shown = await $.command.run(ran('batbout-bar', ''))
  expect(shown.text).toBe('Batbout bar shown.')
})

test('a setting press runs the visible /batbout:<mode> command, not its own', async ($, on) => {
  const notes: string[] = []
  const runs: string[] = []
  on('prompt.submit', (_, e) => ({ text: e.text }))
  on('session.append', (_, e, next) => {
    for (const b of e.message.content) if (b.type === 'text') notes.push(String(b.text))
    return next(e)
  })
  on('ui.toast', () => ({ value: undefined }))
  on('command.run', (_, e) => {
    runs.push(e.command)
    return { text: '' }
  })

  await $.prompt.submit(typed('/batbout make a game', { name: 'batbout', args: 'make a game' }))
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'guide' })
  expect(runs).toEqual(['batbout:guide'])
  expect(notes).toEqual([])
  await ui.unmount()
})

test('while Batbout runs, every prompt carries the current settings', async ($, on) => {
  const seen: (readonly string[] | undefined)[] = []
  on('prompt.submit', (_, e) => {
    seen.push(e.context)
    return { text: e.text }
  })

  await $.prompt.submit(typed('just chatting'))
  expect(seen.at(-1)).toBe(undefined)

  await $.prompt.submit(typed('/batbout drive: make a game', { name: 'batbout:batbout', args: 'drive: make a game' }))
  expect(seen.at(-1)?.at(-1)).toMatch(/speed drive/)

  await $.prompt.submit(typed('بالتفصيل'))
  expect(seen.at(-1)?.at(-1)).toMatch(/speed drive .*depth detailed/)
})
