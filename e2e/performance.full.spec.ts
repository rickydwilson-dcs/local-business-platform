import { test, expect } from "@playwright/test";
import {
  savePerformanceResult,
  compareWithBaseline,
  generatePerformanceReport,
  type PerformanceResult,
} from "../lib/performance-tracker";

/**
 * Performance Testing Suite
 * Tests Core Web Vitals and PageSpeed metrics to ensure changes don't degrade performance
 * Results are automatically saved to test-results/performance/ for historical tracking
 */

// Type for Web Vitals measurement
interface WebVitals {
  lcp: number;
  fcp: number;
  cls: number;
  ttfb: number;
  domContentLoaded: number;
  loadComplete: number;
}

// Performance thresholds - stricter than Google defaults for high-quality site
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals (stricter thresholds)
  LCP: 1200, // Largest Contentful Paint - should be < 1.2s (Good)
  LCP_WARNING: 2000, // Warning threshold
  LCP_CRITICAL: 3000, // Critical threshold
  FID: 100, // First Input Delay - should be < 100ms (Good)
  CLS: 0.1, // Cumulative Layout Shift - should be < 0.1 (Good)
  CLS_WARNING: 0.15, // Warning threshold
  CLS_CRITICAL: 0.2, // Critical threshold

  // Other metrics
  FCP: 1800, // First Contentful Paint - should be < 1.8s (Good)
  TTFB: 600, // Time to First Byte - should be < 600ms (Good)
  TBT: 200, // Total Blocking Time - should be < 200ms (Good)

  // Resource metrics
  totalRequestSize: 2 * 1024 * 1024, // 2MB max total resources
  imageSize: 500 * 1024, // 500KB max per image
  jsSize: 300 * 1024, // 300KB max per JS file
  cssSize: 100 * 1024, // 100KB max per CSS file

  // Timing metrics
  domContentLoaded: 2000, // 2 seconds
  loadComplete: 3000, // 3 seconds
};

test.describe("Performance Tests", () => {
  // Generate and display performance report after all tests complete
  test.afterAll(async () => {
    console.log("\n" + "=".repeat(80));
    console.log("📊 PERFORMANCE TEST REPORT");
    console.log("=".repeat(80) + "\n");

    const report = await generatePerformanceReport();
    console.log(report);

    console.log("\n💾 Results saved to: test-results/performance/");
    console.log("   - performance-history.json (historical data)");
    console.log("   - latest-results.json (most recent run)");
  });

  test("homepage should meet Core Web Vitals thresholds", async ({ page }) => {
    // Navigate and wait for load
    await page.goto("/", { waitUntil: "networkidle" });

    // Measure Web Vitals using Performance API
    const webVitals = await page.evaluate((): Promise<WebVitals> => {
      return new Promise((resolve) => {
        const vitals: Partial<WebVitals> = {};

        // LCP - Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number;
            loadTime?: number;
          };
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        // FCP - First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          vitals.fcp = entries[0].startTime;
        }).observe({ type: "paint", buffered: true });

        // CLS - Cumulative Layout Shift
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const e = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!e.hadRecentInput) {
              clsScore += e.value || 0;
            }
          }
          vitals.cls = clsScore;
        }).observe({ type: "layout-shift", buffered: true });

        // Wait for metrics to be collected
        setTimeout(() => {
          // Get navigation timing
          const navigation = performance.getEntriesByType(
            "navigation"
          )[0] as PerformanceNavigationTiming;
          vitals.ttfb = navigation.responseStart - navigation.requestStart;
          vitals.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          vitals.loadComplete = navigation.loadEventEnd - navigation.fetchStart;

          resolve(vitals as WebVitals);
        }, 3000);
      });
    });

    // Log metrics for debugging
    console.log("Web Vitals:", webVitals);

    // Determine status based on thresholds
    let status: "pass" | "warning" | "fail" = "pass";
    if (
      webVitals.lcp > PERFORMANCE_THRESHOLDS.LCP_WARNING ||
      webVitals.cls > PERFORMANCE_THRESHOLDS.CLS_WARNING
    ) {
      status = "warning";
    }
    if (
      webVitals.lcp > PERFORMANCE_THRESHOLDS.LCP_CRITICAL ||
      webVitals.cls > PERFORMANCE_THRESHOLDS.CLS_CRITICAL
    ) {
      status = "fail";
    }

    // Save results to tracking system
    const result: PerformanceResult = {
      timestamp: new Date().toISOString(),
      testName: "homepage Core Web Vitals",
      page: "/",
      metrics: {
        lcp: webVitals.lcp,
        fcp: webVitals.fcp,
        cls: webVitals.cls,
        ttfb: webVitals.ttfb,
        domContentLoaded: webVitals.domContentLoaded,
        loadComplete: webVitals.loadComplete,
      },
      status,
      thresholds: {
        lcp: {
          good: PERFORMANCE_THRESHOLDS.LCP,
          warning: PERFORMANCE_THRESHOLDS.LCP_WARNING,
          critical: PERFORMANCE_THRESHOLDS.LCP_CRITICAL,
        },
        cls: {
          good: PERFORMANCE_THRESHOLDS.CLS,
          warning: PERFORMANCE_THRESHOLDS.CLS_WARNING,
          critical: PERFORMANCE_THRESHOLDS.CLS_CRITICAL,
        },
      },
    };

    await savePerformanceResult(result);

    // Compare with baseline and check for degradations
    const comparison = await compareWithBaseline(result);
    if (comparison.alerts.length > 0) {
      console.log("\n⚠️ PERFORMANCE ALERTS:");
      comparison.alerts.forEach((alert) => console.log(alert));
    }

    // Assert Core Web Vitals
    expect(webVitals.lcp, `LCP should be under ${PERFORMANCE_THRESHOLDS.LCP}ms`).toBeLessThan(
      PERFORMANCE_THRESHOLDS.LCP
    );
    expect(webVitals.fcp, `FCP should be under ${PERFORMANCE_THRESHOLDS.FCP}ms`).toBeLessThan(
      PERFORMANCE_THRESHOLDS.FCP
    );
    expect(webVitals.cls, `CLS should be under ${PERFORMANCE_THRESHOLDS.CLS}`).toBeLessThan(
      PERFORMANCE_THRESHOLDS.CLS
    );
    expect(webVitals.ttfb, `TTFB should be under ${PERFORMANCE_THRESHOLDS.TTFB}ms`).toBeLessThan(
      PERFORMANCE_THRESHOLDS.TTFB
    );
  });

  test("service page should load quickly", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/services/access-scaffolding", { waitUntil: "domcontentloaded" });

    const loadTime = Date.now() - startTime;

    console.log("Service page load time:", loadTime, "ms");

    expect(loadTime, "Page should load in under 3 seconds").toBeLessThan(3000);
  });

  test("location page should load quickly", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/locations/brighton", { waitUntil: "domcontentloaded" });

    const loadTime = Date.now() - startTime;

    console.log("Location page load time:", loadTime, "ms");

    expect(loadTime, "Page should load in under 3 seconds").toBeLessThan(3000);
  });

  test("should not have excessive resource sizes", async ({ page }) => {
    const resources: Array<{ url: string; size: number; type: string }> = [];

    // Collect resource metrics
    page.on("response", async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentLength = headers["content-length"];
      const contentType = headers["content-type"] || "";

      if (contentLength) {
        resources.push({
          url,
          size: parseInt(contentLength, 10),
          type: contentType,
        });
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // Wait for all resources
    await page.waitForTimeout(2000);

    // Calculate totals
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    const imageResources = resources.filter((r) => r.type.startsWith("image/"));
    const jsResources = resources.filter((r) => r.type.includes("javascript"));
    const cssResources = resources.filter((r) => r.type.includes("css"));

    console.log("Total resources loaded:", resources.length);
    console.log("Total size:", (totalSize / 1024).toFixed(2), "KB");
    console.log("Images:", imageResources.length, "files");
    console.log("JS:", jsResources.length, "files");
    console.log("CSS:", cssResources.length, "files");

    // Assert total size
    expect(totalSize, "Total page weight should be under 2MB").toBeLessThan(
      PERFORMANCE_THRESHOLDS.totalRequestSize
    );

    // Check individual large resources
    const largeImages = imageResources.filter((r) => r.size > PERFORMANCE_THRESHOLDS.imageSize);
    expect(largeImages, "No images should exceed 500KB").toHaveLength(0);

    const largeJS = jsResources.filter((r) => r.size > PERFORMANCE_THRESHOLDS.jsSize);
    expect(
      largeJS.length,
      "No more than 1 JS file should exceed 300KB (main bundle)"
    ).toBeLessThanOrEqual(1);
  });

  test("images should have proper dimensions and be optimized", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Check all images on page
    const imageMetrics = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"));
      return images.map((img) => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayedWidth: img.width,
        displayedHeight: img.height,
        hasWidth: img.hasAttribute("width"),
        hasHeight: img.hasAttribute("height"),
        loading: img.loading,
      }));
    });

    console.log("Images found:", imageMetrics.length);

    // Assert images have dimensions (prevent CLS)
    const imagesWithoutDimensions = imageMetrics.filter((img) => !img.hasWidth || !img.hasHeight);
    expect(
      imagesWithoutDimensions,
      "All images should have width/height attributes to prevent layout shift"
    ).toHaveLength(0);

    // Check for lazy loading
    const imagesWithoutLazyLoading = imageMetrics.filter(
      (img) => img.loading !== "lazy" && !img.src.includes("priority")
    );
    console.log("Images without lazy loading:", imagesWithoutLazyLoading.length);
  });

  test("should not have render-blocking resources", async ({ page }) => {
    await page.goto("/");

    // Check for blocking scripts
    const blockingScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));
      return scripts
        .filter((script) => !script.async && !script.defer && !script.type?.includes("module"))
        .map((script) => script.src)
        .filter((src) => src); // Only external scripts
    });

    console.log("Blocking scripts found:", blockingScripts.length);

    // Should have minimal or no blocking scripts
    expect(
      blockingScripts.length,
      "Should have no more than 2 blocking scripts"
    ).toBeLessThanOrEqual(2);
  });

  test("should have efficient font loading", async ({ page }) => {
    await page.goto("/");

    // Check font loading strategy
    const fontMetrics = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="preload"][as="font"]'));
      const fontFaceRules = Array.from(document.styleSheets).flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules).filter(
            (rule) => rule.constructor.name === "CSSFontFaceRule"
          );
        } catch {
          return [];
        }
      });

      return {
        preloadedFonts: links.length,
        fontFaceRules: fontFaceRules.length,
      };
    });

    console.log("Font metrics:", fontMetrics);

    // Fonts should be preloaded for faster rendering
    expect(fontMetrics.preloadedFonts, "Critical fonts should be preloaded").toBeGreaterThan(0);
  });

  test("should have good mobile performance", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();
    await page.goto("/", { waitUntil: "networkidle" });
    const loadTime = Date.now() - startTime;

    console.log("Mobile load time:", loadTime, "ms");

    expect(loadTime, "Mobile page should load in under 3.5 seconds").toBeLessThan(3500);

    // Check for mobile-specific optimizations
    const mobileOptimizations = await page.evaluate(() => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const mobileImages = Array.from(document.querySelectorAll("img")).filter(
        (img) => img.srcset || img.sizes
      );

      return {
        hasViewportMeta: !!viewport,
        responsiveImages: mobileImages.length,
        totalImages: document.querySelectorAll("img").length,
      };
    });

    console.log("Mobile optimizations:", mobileOptimizations);

    expect(mobileOptimizations.hasViewportMeta, "Should have viewport meta tag").toBe(true);
  });

  test("should minimize main thread work", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Measure long tasks (> 50ms)
    const longTasks = await page.evaluate(() => {
      return new Promise((resolve) => {
        const tasks: number[] = [];

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              tasks.push(entry.duration);
            }
          }
        }).observe({ type: "longtask", buffered: true });

        setTimeout(() => resolve(tasks), 3000);
      });
    });

    const totalBlockingTime = (longTasks as number[]).reduce((sum, duration) => sum + duration, 0);

    console.log("Long tasks found:", (longTasks as number[]).length);
    console.log("Total blocking time:", totalBlockingTime, "ms");

    expect(totalBlockingTime, "Total blocking time should be under 200ms").toBeLessThan(
      PERFORMANCE_THRESHOLDS.TBT
    );
  });

  test("should generate performance baseline report", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Comprehensive performance report
    const performanceReport = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType("resource");

      return {
        navigation: {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          ttfb: Math.round(navigation.responseStart - navigation.requestStart),
          domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart),
        },
        resources: {
          total: resources.length,
          byType: resources.reduce((acc: Record<string, number>, r) => {
            const type = (r as PerformanceResourceTiming).initiatorType;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {}),
        },
        memory: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
          ? {
              usedJSHeapSize:
                Math.round(
                  ((performance as Performance & { memory: { usedJSHeapSize: number } }).memory
                    .usedJSHeapSize /
                    1024 /
                    1024) *
                    100
                ) / 100,
            }
          : null,
      };
    });

    console.log("📊 Performance Baseline Report:");
    console.log(JSON.stringify(performanceReport, null, 2));

    // Save baseline for comparison in future runs
    // This can be committed to repo and compared against
    expect(performanceReport.navigation.loadComplete).toBeLessThan(3000);
  });
});
