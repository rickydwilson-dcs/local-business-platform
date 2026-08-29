/** probe-prototype.mts — payload, anchor behaviour and sticky pinning checks. */
import { chromium } from '@playwright/test'
import { pathToFileURL } from 'node:url'

const file = process.argv[process.argv.indexOf('--file') + 1]
const url = pathToFileURL(file).href
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

let bytes = 0
let reqs = 0
const perType: Record<string, { n: number; kb: number }> = {}
page.on('response', async (r) => {
  reqs++
  const len = Number(r.headers()['content-length'] ?? 0)
  let size = len
  if (!size) {
    try { size = (await r.body()).length } catch { size = 0 }
  }
  bytes += size
  const t = r.request().resourceType()
  perType[t] = perType[t] ?? { n: 0, kb: 0 }
  perType[t].n++
  perType[t].kb += Math.round(size / 1024)
})

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
console.log('INITIAL (above the fold only):', reqs, 'requests,', Math.round(bytes / 1024), 'KB')
console.log('  by type:', JSON.stringify(perType))

// scroll the whole page so every lazy image lands
const h = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < h; y += 700) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(90)
}
await page.waitForTimeout(2500)
console.log('FULL PAGE (everything scrolled):', reqs, 'requests,', Math.round(bytes / 1024), 'KB')

// anchor navigation from BELOW the target — the documented sticky-anchor trap
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
await page.waitForTimeout(400)
const before = await page.evaluate(() => window.scrollY)
await page.click('a[href="#work"]')
await page.waitForTimeout(1500)
const after = await page.evaluate(() => window.scrollY)
const target = await page.evaluate(() => {
  const el = document.getElementById('work')!
  const prev = el.style.position
  el.style.position = 'static'
  const y = el.getBoundingClientRect().top + window.scrollY
  el.style.position = prev
  return Math.round(y)
})
console.log(`ANCHOR #work from below: ${before} -> ${after} (layout offset ${target}, delta ${after - target})`)

// sticky pinning: sample the last stage across its whole track
const pin = await page.evaluate(async () => {
  const stages = [...document.querySelectorAll('.stage')]
  const last = stages[stages.length - 1] as HTMLElement
  const track = last.parentElement as HTMLElement
  const prev = last.style.position
  last.style.position = 'static'
  const top = last.getBoundingClientRect().top + window.scrollY
  last.style.position = prev
  const out: number[] = []
  for (let i = 0; i <= 10; i++) {
    window.scrollTo(0, Math.round(top + (i / 10) * (track.offsetHeight - last.offsetHeight)))
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    out.push(Math.round(last.getBoundingClientRect().top))
  }
  return out
})
console.log('LAST sticky stage top across its track:', pin.join(', '))

await browser.close()
