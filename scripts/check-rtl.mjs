// Fails the build if physical-direction Tailwind classes sneak in.
// Use logical properties instead (ps-/pe-, ms-/me-, start-/end-, text-start/text-end, rounded-s/e).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src'
// Match physical utilities as standalone class tokens, allowing variant prefixes (md:, hover:, etc.)
// Lookaheads stop false positives like `rounded-lg` / `border-l` inside larger tokens.
const BAD = /(^|[\s"'`:])(ml-|mr-|pl-|pr-|left-|right-|text-left|text-right|rounded-l(?![a-z])|rounded-r(?![a-z])|border-l(?![a-z])|border-r(?![a-z]))/g
// Allowed exceptions: intentional RTL/LTR escape hatches are written with explicit dir="ltr" wrappers.

const files = []
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx|ts)$/.test(p)) files.push(p)
  }
}
walk(ROOT)

let violations = 0
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    // only inspect className-ish lines to reduce false positives
    if (!/class(Name)?=|cn\(|clsx\(|tv\(/.test(line)) return
    const matches = [...line.matchAll(BAD)]
    if (matches.length) {
      violations++
      console.error(`${file}:${i + 1}  uses physical class "${matches.map((m) => m[2]).join(', ')}" → use logical equivalent`)
    }
  })
}

if (violations) {
  console.error(`\n✖ ${violations} physical-direction class usage(s). Use logical properties for RTL safety.`)
  process.exit(1)
}
console.log('✓ RTL check passed — no physical-direction classes found.')
