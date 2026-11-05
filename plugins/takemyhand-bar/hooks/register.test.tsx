import { expect, test } from 'claude-code/testing'

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
