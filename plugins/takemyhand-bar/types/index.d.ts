export type Speed = 'watch' | 'guide' | 'drive'
export type Depth = 'brief' | 'normal' | 'detailed'
export type Lang = 'ar' | 'en'
// A concept the skill reported progress on, and how many times
export type Progress = { concept: string; count: number }
export type BarSettings = {
  isActive: boolean
  isCollapsed: boolean
  speed: Speed
  depth: Depth
  humor: boolean
  lang: Lang
  progress: Progress[]
}

declare module 'claude-code' {
  interface PluginState {
    'takemyhand-bar': { settings: BarSettings }
  }
}
