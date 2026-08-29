/**
 * verify-prototype.mts — screenshot a local prototype at several scroll depths
 * and measure the craft bar (cpl, contrast, sticky pinning, horizontal scroll).
 *
 * MUST be run from the monorepo root — @playwright/test only resolves there.
 *
 *   npx tsx <session>/research/tools/verify-prototype.mts \
 *     --file <absolute path to .html> --label wetcoat --out <absolute dir>
 *
 * Gotchas already paid for (see capture-site README): .mts not .ts, import from
 * @playwright/test, shim globalThis.__name before serialising helpers.
 */
import { chromium, devices } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1] as string
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required --${name}`)
}

const file = arg('file')
const label = arg('label')
const outDir = join(arg('out'), label)
const shots = Number(arg('shots', '7'))
mkdirSync(outDir, { recursive: true })
const url = pathToFileURL(file).href

function audit() {
  const rel = (hex: string) => {
    const m = hex.match(/\d+(\.\d+)?/g)!.map(Number)
    const f = (c: number) => {
      const s = c / 255
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2])
  }
  const contrast = (a: string, b: string) => {
    const [x, y] = [rel(a), rel(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }
  const effectiveBg = (el: Element): string => {
    let n: Element | null = el
    while (n) {
      const bg = getComputedStyle(n).backgroundColor
      if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg
      n = n.parentElement
    }
    return 'rgb(11, 11, 12)'
  }

  // characters per line — walks ALL text nodes in the block, so inline
  // <strong> does not fake a short final line into a full-length one.
  const cpl: { sel: string; size: number; lines: number[]; family: string }[] = []
  document.querySelectorAll('p.prose, p.lede, .identity dd, .note p').forEach((p) => {
    const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    let n: Node | null
    while ((n = w.nextNode())) if ((n.textContent ?? '').length) nodes.push(n as Text)
    if (!nodes.length) return
    const r = document.createRange()
    const lines: number[] = []
    let run = 0
    let lastTop: number | null = null
    for (const node of nodes) {
      const text = node.textContent ?? ''
      for (let i = 0; i < text.length; i++) {
        r.setStart(node, i)
        r.setEnd(node, i + 1)
        const rect = r.getBoundingClientRect()
        if (rect.width === 0 && rect.height === 0) { run++; continue }
        const top = Math.round(rect.top)
        if (lastTop === null) lastTop = top
        if (top !== lastTop) { lines.push(run); run = 0; lastTop = top }
        run++
      }
    }
    lines.push(run)
    const cs = getComputedStyle(p)
    cpl.push({
      sel: p.className || p.tagName,
      size: Math.round(parseFloat(cs.fontSize)),
      lines: lines.slice(0, -1).filter((l) => l > 12),   // drop the last, ragged line
      family: cs.fontFamily.split(',')[0],
    })
  })

  const contrasts: { text: string; color: string; bg: string; size: number; weight: string; ratio: number }[] = []
  document.querySelectorAll('body *').forEach((el) => {
    const t = (el.textContent ?? '').trim()
    if (!t || el.children.length) return
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.5) return
    const size = parseFloat(cs.fontSize)
    contrasts.push({
      text: t.slice(0, 44),
      color: cs.color,
      bg: effectiveBg(el),
      size: Math.round(size),
      weight: cs.fontWeight,
      ratio: Math.round(contrast(cs.color, effectiveBg(el)) * 100) / 100,
    })
  })

  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => {
    const cs = getComputedStyle(h as HTMLElement)
    return {
      tag: h.tagName,
      size: Math.round(parseFloat(cs.fontSize)),
      weight: cs.fontWeight,
      ls: cs.letterSpacing,
      text: (h.textContent ?? '').trim().slice(0, 60),
    }
  })

  const monoRisk = [...document.querySelectorAll('body *')]
    .filter((el) => {
      const t = el.textContent ?? ''
      if (!/\d,\d{3}/.test(t)) return false
      const cs = getComputedStyle(el)
      return /mono/i.test(cs.fontFamily) || /tabular/.test(cs.fontVariantNumeric)
    })
    .map((el) => (el.textContent ?? '').slice(0, 40))

  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    pageHeight: document.documentElement.scrollHeight,
    h1Count: document.querySelectorAll('h1').length,
    heads,
    cpl,
    monoRisk,
    imgsMissingAlt: [...document.querySelectorAll('img')].filter((i) => !i.alt).length,
    imgsMissingDims: [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width')).length,
    lowContrast: contrasts
      .filter((c) => (c.size >= 24 || (c.size >= 18.66 && +c.weight >= 700) ? c.ratio < 3 : c.ratio < 4.5))
      .slice(0, 30),
  }
}

const browser = await chromium.launch()

// ---------- desktop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    // esbuild keepNames shim — see README
    ;(globalThis as unknown as { __name: unknown }).__name = (f: unknown) => f
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)

  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = 900
  const forced = process.argv.indexOf('--stops')
  const stops =
    forced !== -1 && process.argv[forced + 1]
      ? process.argv[forced + 1].split(',').map((f) => Math.round(Number(f) * (h - vh)))
      : Array.from({ length: shots }, (_, i) => Math.round((i / (shots - 1)) * (h - vh)))
  const stickyProbe: { y: number; tops: number[] }[] = []

  for (let i = 0; i < stops.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), stops[i])
    await page.waitForTimeout(650)
    await page.screenshot({ path: join(outDir, `desktop-${String(i).padStart(2, '0')}.png`) })
    stickyProbe.push({
      y: stops[i],
      tops: await page.evaluate(() =>
        [...document.querySelectorAll('.stage')].map((s) => Math.round(s.getBoundingClientRect().top))
      ),
    })
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  const report = await page.evaluate(audit)
  writeFileSync(join(outDir, 'report.json'), JSON.stringify({ desktop: report, stickyProbe }, null, 2))
  await ctx.close()
}

// ---------- mobile ----------
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    ;(globalThis as unknown as { __name: unknown }).__name = (f: unknown) => f
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = 844
  for (let i = 0; i < 4; i++) {
    const y = Math.round((i / 3) * (h - vh))
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(outDir, `mobile-${i}.png`) })
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  const m = await page.evaluate(audit)
  writeFileSync(join(outDir, 'report-mobile.json'), JSON.stringify(m, null, 2))
  await ctx.close()
}

// ---------- reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    ;(globalThis as unknown as { __name: unknown }).__name = (f: unknown) => f
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: join(outDir, 'reduced-hero.png') })
  const rh = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(rh * 0.28))
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(outDir, 'reduced-mid.png') })
  writeFileSync(join(outDir, 'reduced.json'), JSON.stringify({ pageHeight: rh }, null, 2))
  await ctx.close()
}

await browser.close()
console.log('wrote', outDir)
