/**
 * Deterministic PRNG (mulberry32). Used by the seed so charts reproduce identical
 * series on every reload and across machines — Date.now()/Math.random() are avoided
 * in seed data on purpose.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random float in [min, max) from a generator. */
export function between(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min)
}

/** Random integer in [min, max] from a generator. */
export function intBetween(rng: () => number, min: number, max: number) {
  return Math.floor(between(rng, min, max + 1))
}
