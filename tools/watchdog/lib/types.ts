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

export interface PlaywrightTestResult {
  status: "passed" | "failed" | "timedOut" | "interrupted";
  title: string;
  titlePath: string[];
  error?: {
    message: string;
    stack?: string;
  };
  location?: {
    file: string;
    line: number;
  };
}

export interface PlaywrightSuiteResult {
  suites: PlaywrightSuiteResult[];
  tests: PlaywrightTestResult[];
  title: string;
}

export interface PlaywrightReport {
  suites: PlaywrightSuiteResult[];
  stats: {
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
    ok: boolean;
    duration: number;
  };
}
