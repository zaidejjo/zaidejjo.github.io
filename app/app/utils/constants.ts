export const ROUTE_INDICATORS: Record<string, string> = {
  home: 'home',
  about: 'about',
  skills: 'skills',
  projects: 'projects',
  contact: 'contact',
} as const

export const STATUS_COMMANDS: Record<string, string> = {
  home: '❯ cd ~',
  about: '❯ cat ~/about.md',
  skills: '❯ ls -la /skills/',
  projects: '❯ ./production --showcase',
  contact: '❯ ./connect.sh',
} as const

export const SECTION_LABELS: Record<string, string> = {
  home: '~/home',
  about: '~/about',
  skills: '~/skills',
  projects: '~/projects',
  contact: '~/contact',
} as const

export type RouteName = keyof typeof ROUTE_INDICATORS
