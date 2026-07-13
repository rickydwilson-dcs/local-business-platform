export interface KnownPattern {
  id: string;
  name: string;
  symptoms: string[];
  root_cause: string;
  fix_strategy: string;
  fix_old_string: string | null;
  fix_new_string: string | null;
  relevant_file_globs: string[];
  docs_ref: string;
}

export interface PatternMatch {
  pattern: KnownPattern;
  hitCount: number;
  matchedSymptoms: string[];
}

export interface LangfuseAnomaly {
  type: "error-rate" | "cost-spike" | "retry-storm";
  description: string;
  traceIds: string[];
}

export interface TriageResult {
  hypothesis: string;
  confidence: "high" | "medium" | "low";
  affected_file?: string;
  old_string?: string;
  new_string?: string;
  pr_title: string;
  pr_body: string;
  matched_pattern?: string;
}

export interface PlaywrightResult {
  status: "passed" | "failed" | "timedOut" | "interrupted";
  duration: number;
  error?: {
    message: string;
    stack?: string;
  };
}

// A "test" is one project/browser run of a spec; `status` is the aggregate
// outcome across its `results` (retries) — "unexpected" means it never passed.
export interface PlaywrightTestResult {
  status: "expected" | "unexpected" | "flaky" | "skipped";
  results: PlaywrightResult[];
}

export interface PlaywrightSpecResult {
  title: string;
  ok: boolean;
  tests: PlaywrightTestResult[];
}

export interface PlaywrightSuiteResult {
  suites: PlaywrightSuiteResult[];
  specs: PlaywrightSpecResult[];
  title: string;
}

export interface PlaywrightReport {
  suites: PlaywrightSuiteResult[];
  stats: {
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
    duration: number;
  };
}
