import { chromium } from '@playwright/test'
const url = process.argv[2]
const b = await chromium.launch()
const ctx = await b.newContext({
  viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  locale: 'en-GB',
})
const page = await ctx.newPage()
const seen = new Set<string>()
page.on('response', r => { const u = r.url(); if (/scontent|cdninstagram/.test(u) && /\.(jpg|jpeg|webp|mp4)/.test(u)) seen.add(u) })
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(6000)
console.log('TITLE:', await page.title())
console.log('URL:', page.url())
const imgs = await page.evaluate(() => Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: (i.alt||'').slice(0,200), w: i.naturalWidth, h: i.naturalHeight })).filter(i => i.w > 200))
console.log('IMGS_IN_DOM:', JSON.stringify(imgs, null, 1).slice(0, 3000))
console.log('NETWORK:', [...seen].slice(0, 40).join('\n'))
await page.screenshot({ path: '/tmp/ig-shot.png' })
await b.close()
