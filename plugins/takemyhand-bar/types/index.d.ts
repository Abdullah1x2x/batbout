export type Speed = 'watch' | 'guide' | 'drive'
export type Depth = 'brief' | 'normal' | 'detailed'
export type Lang = 'ar' | 'en'
export type BarSettings = {
  isActive: boolean
  speed: Speed
  depth: Depth
  humor: boolean
  lang: Lang
}

declare module 'claude-code' {
  interface PluginState {
    'takemyhand-bar': { settings: BarSettings }
  }
}
