import { cn } from '@/lib/cn'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Deterministic gradient from the name so avatars are stable + offline.
function gradientFor(name: string) {
  const palettes = [
    'from-primary to-orange-400',
    'from-secondary to-cyan-400',
    'from-success to-emerald-400',
    'from-fuchsia-500 to-purple-500',
    'from-rose-500 to-pink-500',
  ]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return palettes[h % palettes.length]
}

const sizes = { sm: 'h-9 w-9 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg', xl: 'h-24 w-24 text-2xl' }

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string
  src?: string
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid place-items-center overflow-hidden rounded-full font-bold text-white',
        !src && `bg-gradient-to-br ${gradientFor(name)}`,
        sizes[size],
        className,
      )}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
    </div>
  )
}
