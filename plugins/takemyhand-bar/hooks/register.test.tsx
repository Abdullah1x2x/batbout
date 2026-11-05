import { expect, test } from 'claude-code/testing'
import { layoutOf, progressIn, record } from './register'

const BAND = {
  plugin: 'takemyhand-bar',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
} as const

// A prompt as the person types it; a slash command carries its name and args
const typed = (text: string, command?: { name: string; args: string }) => ({
  text, wait: false, origin: { kind: 'composer' } as const, ...(command ? { command } : {}),
})

test('the bar stays hidden until /takemyhand runs', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

test('/takemyhand shows the bar with English labels, on every surface', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/takemyhand برنامج ألغاز', { name: 'takemyhand', args: 'برنامج ألغاز' }))

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect((await ui.find({ type: 'Button', key: 'guide' }))?.props.label).toBe('Guide')
    expect((await ui.find({ type: 'Button', key: 'watch' }))?.props.dimColor).toBe(undefined)
    await ui.unmount()
  }
})

test('a typed control word lights its button', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/takemyhand make a game', { name: 'takemyhand', args: 'make a game' }))
  await $.prompt.submit(typed('Detailed!'))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await ui.find({ type: 'Button', key: 'detailed' }))?.props.dimColor).toBe(undefined)
  expect((await ui.find({ type: 'Button', key: 'normal' }))?.props.dimColor).toBe(true)
  await ui.unmount()
})

test('a button sends its word and lights itself; close hides the bar', async ($, on) => {
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

  await $.prompt.submit(typed('/takemyhand drive: add a login form', { name: 'takemyhand', args: 'drive: add a login form' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Button', key: 'drive' }))?.props.dimColor).toBe(undefined)

  await ui.press({ key: 'guide' })
  expect(sent.at(-1)).toBe('guide me')
  expect((await ui.find({ type: 'Button', key: 'guide' }))?.props.dimColor).toBe(undefined)

  await ui.press({ key: 'close' })
  expect(await ui.find({ type: 'Button', key: 'guide' })).toBe(undefined)
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

test('in an Arabic session a press sends the Arabic word', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  await $.prompt.submit(typed('/takemyhand برنامج ألغاز', { name: 'takemyhand', args: 'برنامج ألغاز' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'detailed' })
  expect(sent.at(-1)).toBe('بالتفصيل')
  await ui.unmount()
})

test('humor Off sends the serious word; the logo is an SVG on desktop', async ($, on) => {
  const sent: string[] = []
  on('prompt.submit', (_, e) => {
    sent.push(e.text)
    return { text: e.text }
  })

  await $.prompt.submit(typed('/takemyhand make a game', { name: 'takemyhand', args: 'make a game' }))

  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ type: 'Svg' })).not.toBe(undefined)
  await ui.press({ key: 'humorOff' })
  expect(sent.at(-1)).toBe('serious')
  expect((await ui.find({ type: 'Button', key: 'humorOff' }))?.props.dimColor).toBe(undefined)
  await ui.unmount()
})

test('collapse shrinks the bar to one row; open brings it back', async ($, on) => {
  on('prompt.submit', (_, e) => ({ text: e.text }))

  await $.prompt.submit(typed('/takemyhand make a game', { name: 'takemyhand', args: 'make a game' }))

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

  await $.prompt.submit(typed('/takemyhand make a game', { name: 'takemyhand', args: 'make a game' }))

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

  await $.prompt.submit(typed('/takemyhand make a game', { name: 'takemyhand', args: 'make a game' }))

  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns: 120 }, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: '│' })).not.toBe(undefined)
  expect((await ui.find({ type: 'Button', key: 'collapse' }))?.props.label).toBe('▾ Minimize')
  await ui.unmount()
})
