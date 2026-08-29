/**
 * probe-register.mts — craft-bar probe for the two Direction D prototypes.
 *
 * MUST be run from the monorepo root — @playwright/test only resolves there.
 * See capture-site README for the .mts / @playwright/test / __name gotchas.
 *
 *   npx tsx <session>/research/tools/probe-register.mts --file <abs .html>
 *
 * Reports, in order:
 *   1. hero light travel  — band centre as a % of frame width vs px scrolled
 *   2. scroll-driven accent — the root --accent/--accent-ink at each depth
 *   3. caption crossfade   — opacity of each stage caption line
 *   4. anchor navigation   — every in-page link, clicked from BELOW its target
 *   5. network             — request count and transferred bytes on first paint
 *   6. focus               — computed outline on every focusable element
 */
import { chromium } from '@playwright/test'
import { pathToFileURL } from 'node:url'

const file = process.argv[process.argv.indexOf('--file') + 1]
const fracs = (process.argv[process.argv.indexOf('--at') + 1] || '0,0.2,0.4,0.6,0.8')
  .split(',')
  .map(Number)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.addInitScript(() => {
  ;(globalThis as unknown as { __name: unknown }).__name = (f: unknown) => f
})

// --- 5. network, measured on the cold load ---------------------------------
const reqs: { url: string; bytes: number }[] = []
page.on('response', async (r) => {
  try {
    const b = (await r.body()).length
    reqs.push({ url: r.url(), bytes: b })
  } catch {
    /* redirects and aborted requests have no body */
  }
})

await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

const H = await page.evaluate(() => document.documentElement.scrollHeight)
console.log('pageHeight', H, '=', (H / 900).toFixed(1), 'viewports')

console.log('\n--- 1. hero light travel (px scrolled -> band centre, % of width) ---')
for (const y of [0, 100, 200, 300, 450, 600, 750, 900]) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(110)
  const c = await page.evaluate(() => {
    const s = document.querySelector('.stage') as HTMLElement
    return Math.round((parseFloat(s.style.getPropertyValue('--bc')) / s.offsetWidth) * 1000) / 10
  })
  console.log(`  ${String(y).padStart(5)}px -> ${c}%`)
}

console.log('\n--- 2 & 3. accent and caption crossfade by scroll depth ---')
for (const f of fracs) {
  const y = Math.round(f * (H - 900))
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(450)
  const r = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement)
    return {
      accent: cs.getPropertyValue('--accent').trim(),
      ink: cs.getPropertyValue('--accent-ink').trim(),
      stages: [...document.querySelectorAll('.stage')]
        .filter((s) => {
          const t = s.getBoundingClientRect().top
          return t > -900 && t < 900
        })
        .map((s) => ({
          rev: (s as HTMLElement).style.getPropertyValue('--reveal') || '-',
          rev2: (s as HTMLElement).style.getPropertyValue('--reveal2') || '-',
          caps: [...s.querySelectorAll('.stage__cap-line')].map(
            (c) => Math.round(parseFloat(getComputedStyle(c).opacity) * 100) / 100
          ),
        })),
    }
  })
  console.log(
    `  ${(f * 100).toFixed(0).padStart(3)}%  accent ${r.accent} / ${r.ink}` +
      r.stages.map((s) => `  [rev ${s.rev} rev2 ${s.rev2} caps ${JSON.stringify(s.caps)}]`).join('')
  )
}

console.log('\n--- 4. in-page anchors, each clicked from BELOW its target ---')
const anchors: string[] = await page.evaluate(() =>
  [...document.querySelectorAll('.masthead nav a[href^="#"]')].map((a) => a.getAttribute('href') as string)
)
for (const href of anchors) {
  await page.evaluate((v) => window.scrollTo(0, v), H - 900) // start at the very bottom
  await page.waitForTimeout(300)
  const before = await page.evaluate(() => window.scrollY)
  await page.evaluate((h) => {
    const a = document.querySelector(`.masthead nav a[href="${h}"]`) as HTMLElement
    a.click()
  }, href)
  await page.waitForTimeout(1200)
  const after = await page.evaluate(() => window.scrollY)
  const target = await page.evaluate((h) => {
    const el = document.getElementById(h.slice(1)) as HTMLElement
    const prev = el.style.position
    el.style.position = 'static'
    const y = el.getBoundingClientRect().top + window.scrollY
    el.style.position = prev
    return Math.round(y)
  }, href)
  const off = Math.abs(after - (target - 74))
  console.log(
    `  ${href.padEnd(14)} from ${before} -> ${after}  (layout top ${target}, off by ${off}px)  ${
      before !== after && off < 60 ? 'OK' : 'CHECK'
    }`
  )
}

console.log('\n--- 5. network on first paint ---')
const total = reqs.reduce((a, r) => a + r.bytes, 0)
console.log(`  ${reqs.length} requests, ${(total / 1024 / 1024).toFixed(2)} MB`)
reqs
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 8)
  .forEach((r) => console.log(`    ${(r.bytes / 1024).toFixed(0).padStart(6)} KB  ${r.url.split('/').slice(-2).join('/')}`))

console.log('\n--- 6. focus ring on every focusable element ---')
const focus = await page.evaluate(() => {
  const out: { tag: string; text: string; outline: string }[] = []
  const els = [...document.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')]
  els.forEach((el) => {
    ;(el as HTMLElement).focus()
    const cs = getComputedStyle(el)
    out.push({
      tag: el.tagName,
      text: (el.textContent ?? '').trim().slice(0, 26),
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
    })
  })
  return out
})
const noRing = focus.filter((f) => /none/.test(f.outline))
console.log(`  ${focus.length} focusable, ${noRing.length} with no visible ring`)
noRing.slice(0, 6).forEach((f) => console.log(`    MISSING: ${f.tag} "${f.text}"`))
if (focus.length) console.log(`  sample ring: ${focus[0].outline}`)

await browser.close()
