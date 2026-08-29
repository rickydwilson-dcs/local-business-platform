/**
 * ig-carousel.mts — pull every slide of a public Instagram carousel post.
 * Usage (from monorepo root):
 *   npx tsx <path>/ig-carousel.mts <post-url> <out-dir>
 * Clicks the Next control until it disappears, collecting the largest rendition
 * of each carousel image. Public posts only — no login, no credentials.
 */
import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const url = process.argv[2]
const outDir = process.argv[3]
mkdirSync(outDir, { recursive: true })

const b = await chromium.launch()
const ctx = await b.newContext({
  viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  locale: 'en-GB',
})
const page = await ctx.newPage()

// Keyed by the CDN file id so repeat renditions collapse to one entry.
const slides = new Map<string, { src: string; w: number; h: number; alt: string }>()
const key = (u: string) => (u.match(/\/([0-9]+_[0-9]+_[0-9]+_n\.jpg)/)?.[1] ?? u.split('?')[0]) as string

async function harvest() {
  const found = await page.evaluate(() =>
    Array.from(document.querySelectorAll('img'))
      .map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt || '' }))
      .filter(i => i.w >= 1000 && /scontent|cdninstagram/.test(i.src))
  )
  for (const f of found) {
    const k = key(f.src)
    const prev = slides.get(k)
    if (!prev || f.w > prev.w) slides.set(k, f)
  }
}

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
await page.waitForTimeout(6000)
await harvest()

const caption = await page.evaluate(() => {
  const h1 = document.querySelector('h1')
  return h1 ? (h1.textContent ?? '').trim() : ''
})

// The Next control only materialises while the pointer is over the media, so
// hover the largest image before every attempt.
for (let i = 0; i < 40; i++) {
  const media = page.locator('img[srcset*="scontent"], img[src*="scontent"]').first()
  await media.hover({ timeout: 4000 }).catch(() => {})
  await page.waitForTimeout(350)
  const next = page.locator('[aria-label="Next"]').first()
  if (!(await next.isVisible().catch(() => false))) {
    // Fall back to keyboard paging.
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(1400)
    const before = slides.size
    await harvest()
    if (slides.size === before) break
    continue
  }
  await next.click({ timeout: 5000, force: true }).catch(() => {})
  await page.waitForTimeout(1500)
  await harvest()
  console.log(`  after step ${i + 1}: ${slides.size} unique`)
}

const list = [...slides.values()]
console.log(`slides found: ${list.length}`)
let n = 0
for (const s of list) {
  n++
  const name = `slide-${String(n).padStart(2, '0')}.jpg`
  const res = await page.request.get(s.src)
  if (res.ok()) {
    writeFileSync(join(outDir, name), await res.body())
    console.log(`${name}  ${s.w}x${s.h}  ${s.alt.slice(0, 70)}`)
  }
}
writeFileSync(join(outDir, 'caption.txt'), caption)
console.log('CAPTION:', caption.slice(0, 600))
await b.close()
