# Performance Test Result Tracking

## Overview

Automatic tracking and historical analysis of performance test results to catch regressions and monitor trends over time.

## Quick Start

```bash
# Run performance tests (results automatically saved)
npm run test:e2e:performance

# View comprehensive report with trends
npm run performance:report
```

## What Gets Tracked

Every time you run performance tests, the following metrics are automatically saved:

| Metric        | Description                                  | Your Threshold                                     |
| ------------- | -------------------------------------------- | -------------------------------------------------- |
| **LCP**       | Largest Contentful Paint - Main content load | Good: <1200ms, Warning: <2000ms, Critical: <3000ms |
| **CLS**       | Cumulative Layout Shift - Visual stability   | Good: <0.1, Warning: <0.15, Critical: <0.2         |
| **FCP**       | First Contentful Paint - First paint         | <1800ms                                            |
| **TTFB**      | Time to First Byte - Server response         | <600ms                                             |
| **DOM Load**  | DOM Content Loaded                           | <2000ms                                            |
| **Full Load** | Complete page load                           | <3000ms                                            |

## Where Results Are Stored

```
test-results/performance/
├── performance-history.json  # Last 100 test runs
├── latest-results.json       # Most recent run
└── README.md                 # Documentation
```

**Note**: These files are gitignored and only stored locally for development tracking.

## Example Report Output

```
================================================================================
📊 PERFORMANCE TEST REPORT
================================================================================

Last Run: 2025-10-09T20:30:00.000Z
Total Test Runs: 15

## Latest Results

Page: /
Status: ✅ PASS

### Core Web Vitals

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | 987ms | <1200ms | ✅ Good |
| CLS | 0.08 | <0.1 | ✅ Good |
| FCP | 654ms | - | - |

### Average Metrics (Last 100 Runs)

| Metric | Average |
|--------|---------|
| LCP | 1034 |
| CLS | 0.09 |
| FCP | 689 |
| TTFB | 267 |

### Trends

| Metric | Direction | Change |
|--------|-----------|--------|
| LCP | 📈 ↓ improving | -5.2% |
| CLS | → stable | 1.3% |
| FCP | 📈 ↓ improving | -3.7% |
| TTFB | 📉 ↑ degrading | 8.4% |

================================================================================
```

## Degradation Alerts

If performance degrades by more than **10%** compared to historical baseline, you'll see alerts:

```
⚠️ PERFORMANCE ALERTS:
⚠️ LCP degraded by 15% (950ms → 1092ms)
⚠️ CLS degraded by 12% (0.08 → 0.09)
```

## Features

### ✅ Automatic Persistence

Results saved after every test run - no manual work required.

### ✅ Historical Tracking

Keeps last 100 results to show trends over time.

### ✅ Trend Detection

Compares recent 10 runs vs previous 10 runs:

- **Improving** 📈 ↓: Metrics decreased by >5%
- **Degrading** 📉 ↑: Metrics increased by >5%
- **Stable** →: Changes within ±5%

### ✅ Degradation Alerts

Automatic warnings when metrics worsen by >10% vs baseline.

### ✅ Average Baselines

Running averages across all test runs for comparison.

### ✅ Status Classification

- **Pass** ✅: All metrics within "good" thresholds
- **Warning** ⚠️: Some metrics in warning zone
- **Fail** ❌: Metrics exceed critical thresholds

## Integration with Testing Workflow

### During Development

```bash
# Make code changes
npm run dev

# Run performance tests
npm run test:e2e:performance

# Check if performance degraded
npm run performance:report
```

### Before Commits

```bash
# Run full quality check
npm run pre-commit-check

# Optionally run performance tests
npm run test:e2e:performance
```

### Before Deployment

```bash
# Run all tests including performance
npm run test:all
npm run test:e2e:performance

# Review performance trends
npm run performance:report

# Only deploy if metrics are acceptable
```

## Viewing Historical Data

### Via CLI

```bash
npm run performance:report
```

### Via Files

```bash
# View full history
cat test-results/performance/performance-history.json | jq

# View latest result
cat test-results/performance/latest-results.json | jq
```

## Architecture

### Data Flow

```
Performance Test Run
        ↓
Measure Core Web Vitals
        ↓
Calculate Status (pass/warning/fail)
        ↓
Save to performance-history.json
        ↓
Load Historical Data
        ↓
Calculate Trends & Averages
        ↓
Compare with Baseline
        ↓
Generate Alerts (if degraded)
        ↓
Display Report
```

### Implementation

- **Tracking Library**: `lib/performance-tracker.ts`
- **Test Integration**: `e2e/performance.spec.ts`
- **Report Viewer**: `scripts/view-performance-report.ts`
- **Thresholds**: `performance-baseline.json`

## Configuration

### Adjusting Thresholds

Edit `performance-baseline.json`:

```json
{
  "thresholds": {
    "coreWebVitals": {
      "LCP": {
        "good": 1200,
        "warning": 2000,
        "critical": 3000
      }
    }
  }
}
```

Update `e2e/performance.spec.ts` constants to match:

```typescript
const PERFORMANCE_THRESHOLDS = {
  LCP: 1200,
  LCP_WARNING: 2000,
  LCP_CRITICAL: 3000,
  // ...
};
```

## Best Practices

### ✅ DO:

- Run performance tests regularly during development
- Review trends before major deployments
- Investigate degradation alerts immediately
- Keep thresholds realistic but ambitious

### ❌ DON'T:

- Ignore degradation alerts
- Relax thresholds without investigation
- Skip performance tests before deployment
- Commit performance result files to git

## Troubleshooting

### "No performance data available yet"

**Solution**: Run performance tests at least once:

```bash
npm run test:e2e:performance
```

### Inconsistent Results

**Solution**: Performance can vary. Run tests multiple times:

```bash
for i in {1..5}; do npm run test:e2e:performance; done
npm run performance:report  # View trends
```

### Results Files Missing

**Solution**: Files are in gitignored directory. They're created on first test run:

```bash
ls -la test-results/performance/
```

## Related Documentation

- [PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md) - Complete performance testing guide
- [E2E_TESTING.md](E2E_TESTING.md) - E2E testing setup and usage
- [performance-baseline.json](../../performance-baseline.json) - Threshold configuration
- [test-results/performance/README.md](../../test-results/performance/README.md) - Results directory docs

---

**Questions?** See documentation or check implementation in `lib/performance-tracker.ts`
