/**
 * capture-prototype-pages.mts — capture static prototype pages at desktop & mobile viewports.
 *
 * Usage:
 *   npx tsx capture-prototype-pages.mts
 *
 * Captures 6 pages at two viewports each (12 PNGs total):
 *   - Desktop: 1440x900
 *   - Mobile: 390x844 (iPhone 12-ish)
 *
 * Waits for all images to load before capturing.
 * Saves to reference-screenshots/ with naming: <page>-desktop.png, <page>-mobile.png
 *
 * Failure contract: fail fast on any uncaught exception, print traceback and offending record.
 */
import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const baseUrl = 'https://dpm-autobody-proto.vercel.app'
const pages = [
  { path: '/', name: 'home' },
  { path: '/workshop.html', name: 'workshop' },
  { path: '/contact.html', name: 'contact' },
  { path: '/library.html', name: 'library' },
  { path: '/volvo-p1800.html', name: 'volvo-p1800' },
  { path: '/etype-941pvo.html', name: 'etype-941pvo' },
]

const outDir = './output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/reference-screenshots'
const results: Array<{ file: string; bytes: number }> = []
let errorCount = 0
let successCount = 0

async function capturePageAtViewport(url: string, pageName: string, viewportLabel: string, width: number, height: number) {
  const browser = await chromium.launch()
  try {
    const ctx = await browser.newContext({
      viewport: { width, height },
      // dsf:1, not 2 — see capture-actual-pages.mts for why (raster-tile corruption on
      // tall fullPage captures at 2x).
      deviceScaleFactor: 1,
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
    })
    const page = await ctx.newPage()

    // Navigate with extended timeout for prototype site
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })

    // Wait for all images to load
    await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {
      // networkidle timeout is acceptable; proceed with capture
    })

    // Scroll incrementally through the full page height BEFORE capturing, to trigger
    // lazy-loaded <img>s and the prototype's own scroll-driven reveal effects (opacity/
    // transform transitions tied to IntersectionObserver or scroll position) that never fire
    // during a static fullPage screenshot, which never scrolls the real viewport.
    await page.evaluate(async () => {
      const step = Math.max(200, Math.floor(window.innerHeight * 0.8))
      const total = document.documentElement.scrollHeight
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y)
        await new Promise((res) => setTimeout(res, 150))
      }
      window.scrollTo(0, 0)
    })

    // Wait an additional beat to let images render
    await page.waitForTimeout(2000)

    // Dismiss cookie/consent dialogs if present
    for (const name of ['Accept', 'Accept all', 'Accept All', 'I agree', 'Got it', 'Allow all', 'OK']) {
      const btn = page.getByRole('button', { name, exact: false }).first()
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {})
        await page.waitForTimeout(500)
        break
      }
    }

    // Capture screenshot
    const filename = `${pageName}-${viewportLabel}.png`
    const filepath = join(outDir, filename)
    await page.screenshot({ path: filepath, fullPage: true })

    // Get file size
    const fs = await import('fs')
    const stats = fs.statSync(filepath)
    results.push({ file: filename, bytes: stats.size })
    successCount++
  } catch (err) {
    errorCount++
    console.error(`FAIL — ${pageName}-${viewportLabel}: ${err instanceof Error ? err.message : String(err)}`)
    if (err instanceof Error) console.error(err.stack)
    throw err
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log(`Capturing 6 pages × 2 viewports = 12 screenshots...`)

  for (const { path, name } of pages) {
    const url = `${baseUrl}${path}`
    console.log(`\n→ ${name} (${path})`)

    // Desktop 1440x900
    process.stdout.write(`  Desktop (1440x900)... `)
    await capturePageAtViewport(url, name, 'desktop', 1440, 900)
    console.log('✓')

    // Mobile 390x844
    process.stdout.write(`  Mobile (390x844)... `)
    await capturePageAtViewport(url, name, 'mobile', 390, 844)
    console.log('✓')
  }

  // Report results
  console.log('\n' + '='.repeat(60))
  console.log('Captured files:')
  for (const { file, bytes } of results) {
    console.log(`  ${file} — ${bytes} bytes`)
  }

  const total = pages.length * 2
  if (errorCount === 0) {
    console.log(`\nPASS — ${successCount}/${total} records, 0 errors`)
  } else {
    console.log(
      `\nFAIL — ${successCount}/${total} records, ${errorCount} errors: see above for details`
    )
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
