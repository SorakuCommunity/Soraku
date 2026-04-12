export const SORAKU_COLORS = {
  primary:   '#4FA3D1',
  dark:      '#1C1E22',
  secondary: '#6E8FA6',
  light:     '#D9DDE3',
  accent:    '#E8C2A8',
} as const

export const ROLE_META: Record<string, { label:string; cls:string; emoji:string }> = {
  OWNER:   { label:'Owner',   cls:'text-yellow-300 bg-yellow-400/10 border-yellow-400/25',   emoji:'👑' },
  MANAGER: { label:'Manager', cls:'text-violet-300 bg-violet-500/10 border-violet-500/25',   emoji:'🛡️' },
  ADMIN:   { label:'Admin',   cls:'text-[#4FA3D1] bg-[#4FA3D1]/10 border-[#4FA3D1]/25',     emoji:'⚙️' },
  AGENSI:  { label:'Agensi',  cls:'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',emoji:'🎭' },
  KREATOR: { label:'Kreator', cls:'text-[#E8C2A8] bg-[#E8C2A8]/10 border-[#E8C2A8]/25',    emoji:'🎨' },
  USER:    { label:'Member',  cls:'text-[#6E8FA6] bg-white/5 border-white/10',               emoji:'👤' },
}
