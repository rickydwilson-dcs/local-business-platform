/**
 * capture-site.mts — visual + technical capture of a reference site.
 *
 * Usage:
 *   npx tsx capture-site.mts --url https://example.com --label halcyon [--out ../screenshots] [--frames 12]
 *
 * Produces, under <out>/<label>/:
 *   desktop-full.png        full-page screenshot at 1440x900
 *   desktop-00..N.png       one frame per viewport-height of scroll (catches scroll-triggered state)
 *   mobile-full.png         full-page screenshot at 390x844
 *   report.json             fonts, palette, heading hierarchy, media, animation libs, section rhythm
 *
 * Screenshots are gitignored by output/.gitignore — they are local reference, not committed.
 */
import { chromium, devices } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function arg(name: string, fallback?: string): string {
  const i = process.argv.indexOf(`--${name}`)
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1] as string
  if (fallback !== undefined) return fallback
  throw new Error(`Missing required --${name}`)
}

const url = arg('url')
const label = arg('label')
const outRoot = arg('out', new URL('../screenshots', import.meta.url).pathname)
const maxFrames = Number(arg('frames', '12'))
const outDir = join(outRoot, label)
mkdirSync(outDir, { recursive: true })

/** Runs in the page. Collects the design evidence we actually argue from. */
function collect() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('body *'))
  const tally = (arr: string[]) =>
    Object.entries(
      arr.reduce<Record<string, number>>((a, v) => ((a[v] = (a[v] ?? 0) + 1), a), {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map(([value, count]) => ({ value, count }))

  const fonts: string[] = []
  const textColors: string[] = []
  const bgColors: string[] = []
  const typeScale: string[] = []

  for (const el of els) {
    const cs = getComputedStyle(el)
    const text = (el.textContent ?? '').trim()
    if (text.length > 0 && el.children.length === 0) {
      fonts.push(cs.fontFamily)
      textColors.push(cs.color)
      typeScale.push(
        `${Math.round(parseFloat(cs.fontSize))}px / ${cs.fontWeight} / ls ${cs.letterSpacing} / lh ${cs.lineHeight}`
      )
    }
    const bg = cs.backgroundColor
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') bgColors.push(bg)
  }

  const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
    .map((h) => {
      const cs = getComputedStyle(h as HTMLElement)
      return {
        tag: h.tagName,
        text: (h.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 160),
        size: Math.round(parseFloat(cs.fontSize)),
        weight: cs.fontWeight,
        transform: cs.textTransform,
        letterSpacing: cs.letterSpacing,
        family: cs.fontFamily,
      }
    })
    .filter((h) => h.text.length > 0)
    .slice(0, 60)

  const videos = Array.from(document.querySelectorAll('video')).map((v) => ({
    src: v.currentSrc || v.getAttribute('src') || '',
    sources: Array.from(v.querySelectorAll('source')).map((s) => s.getAttribute('src') ?? ''),
    autoplay: v.autoplay,
    loop: v.loop,
    muted: v.muted,
    poster: v.getAttribute('poster') ?? '',
    w: v.videoWidth,
    h: v.videoHeight,
    rect: { w: Math.round(v.getBoundingClientRect().width), h: Math.round(v.getBoundingClientRect().height) },
  }))

  const iframes = Array.from(document.querySelectorAll('iframe'))
    .map((f) => f.getAttribute('src') ?? '')
    .filter(Boolean)

  const scripts = Array.from(document.querySelectorAll('script[src]'))
    .map((s) => s.getAttribute('src') ?? '')
    .filter(Boolean)

  const libs: string[] = []
  const w = window as unknown as Record<string, unknown>
  const probe: Record<string, boolean> = {
    gsap: !!w.gsap,
    ScrollTrigger: !!(w.ScrollTrigger || (w.gsap as { ScrollTrigger?: unknown })?.ScrollTrigger),
    lenis: !!(w.Lenis || w.lenis),
    locomotive: !!w.LocomotiveScroll,
    barba: !!w.barba,
    swiper: !!w.Swiper,
    three: !!w.THREE,
    jQuery: !!w.jQuery,
    React: !!w.React || !!document.querySelector('#__next, [data-reactroot]'),
    framerMotion: !!document.querySelector('[data-framer-name], [data-projection-id]'),
    webflow: !!w.Webflow || !!document.querySelector('html.w-mod-js'),
    squarespace: !!w.Static || !!document.querySelector('[data-block-type]'),
    wix: !!document.querySelector('[id^="comp-"], #SITE_CONTAINER'),
    aos: !!w.AOS,
  }
  for (const [k, v] of Object.entries(probe)) if (v) libs.push(k)

  // Elements that look animation-instrumented — the "subtle scroll animation" question.
  const animAttrs = [
    '[data-scroll]', '[data-aos]', '[data-animate]', '[data-gsap]',
    '[class*="reveal"]', '[class*="fade-"]', '[class*="parallax"]', '[data-framer-appear-id]',
  ]
  const animated = animAttrs
    .map((sel) => ({ sel, count: document.querySelectorAll(sel).length }))
    .filter((a) => a.count > 0)

  const sticky = Array.from(els).filter((el) => {
    const p = getComputedStyle(el).position
    return p === 'sticky' || p === 'fixed'
  }).length

  return {
    title: document.title,
    docHeight: document.documentElement.scrollHeight,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    fonts: tally(fonts),
    textColors: tally(textColors),
    bgColors: tally(bgColors),
    typeScale: tally(typeScale),
    headings,
    videos,
    iframes: iframes.slice(0, 20),
    scripts: scripts.slice(0, 40),
    libs,
    animated,
    stickyOrFixedCount: sticky,
    navText: Array.from(document.querySelectorAll('nav a, header a'))
      .map((a) => (a.textContent ?? '').trim())
      .filter(Boolean)
      .slice(0, 30),
  }
}

const browser = await chromium.launch()
const report: Record<string, unknown> = { url, label, capturedAt: new Date().toISOString() }

// --- Desktop -----------------------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  })
  const page = await ctx.newPage()
  const requests: string[] = []
  page.on('request', (r) => requests.push(`${r.resourceType()} ${r.url()}`))

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForTimeout(3500)

  // Dismiss the usual cookie furniture so it doesn't sit in every frame.
  for (const name of ['Accept', 'Accept all', 'Accept All', 'I agree', 'Got it', 'Allow all', 'OK']) {
    const btn = page.getByRole('button', { name, exact: false }).first()
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {})
      await page.waitForTimeout(800)
      break
    }
  }

  await page.screenshot({ path: join(outDir, 'desktop-hero.png') })

  // Scroll frame by frame — scroll-triggered reveals only exist after the scroll.
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = 900
  const frames = Math.min(maxFrames, Math.max(1, Math.ceil(h / vh)))
  for (let i = 0; i < frames; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), i * vh)
    await page.waitForTimeout(1600)
    await page.screenshot({ path: join(outDir, `desktop-${String(i).padStart(2, '0')}.png`) })
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1200)
  await page.screenshot({ path: join(outDir, 'desktop-full.png'), fullPage: true }).catch(() => {})

  // tsx/esbuild's keepNames wraps helpers in __name(); that identifier does not
  // exist in the page, so shim it before serialising collect() across.
  await page.evaluate(() => {
    ;(globalThis as unknown as Record<string, unknown>).__name = (f: unknown) => f
  })
  report.desktop = await page.evaluate(collect)
  report.frameCount = frames
  report.mediaRequests = requests
    .filter((r) => /media|video|\.mp4|\.webm|\.m3u8/i.test(r))
    .slice(0, 40)
  report.fontRequests = requests.filter((r) => /font|\.woff2?|\.otf|\.ttf/i.test(r)).slice(0, 40)
  await ctx.close()
}

// --- Mobile ------------------------------------------------------------------
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForTimeout(3000)
  await page.screenshot({ path: join(outDir, 'mobile-hero.png') })
  await page.screenshot({ path: join(outDir, 'mobile-full.png'), fullPage: true }).catch(() => {})
  await ctx.close()
}

await browser.close()
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2))
console.log(`Captured ${label} -> ${outDir}`)
