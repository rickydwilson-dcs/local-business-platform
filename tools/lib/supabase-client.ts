/**
 * Supabase Client for Site Registry
 *
 * Manages database operations for the site registry system:
 * - Sites: Core site data, configuration, and business info
 * - Deployments: Vercel deployment tracking
 * - Builds: GitHub Actions CI/CD builds
 * - Metrics: Performance and usage metrics (New Relic, Vercel)
 * - Alerts: Monitoring alerts and incidents
 * - Content Generations: AI content generation tracking and costs
 * - Rate Limits: API rate limiting data
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// ============================================================================
// TypeScript Types
// ============================================================================

/**
 * Site status enumeration
 */
export type SiteStatus = "active" | "paused" | "archived";

/**
 * Deployment status enumeration
 */
export type DeploymentStatus = "building" | "ready" | "error" | "canceled";

/**
 * Build status enumeration
 */
export type BuildStatus = "queued" | "in_progress" | "completed" | "failed" | "canceled";

/**
 * Alert type enumeration
 */
export type AlertType =
  | "deployment"
  | "build"
  | "performance"
  | "error_rate"
  | "downtime"
  | "security";

/**
 * Alert severity enumeration
 */
export type AlertSeverity = "critical" | "high" | "medium" | "low";

/**
 * Alert status enumeration
 */
export type AlertStatus = "active" | "acknowledged" | "resolved";

/**
 * Content generation type enumeration
 */
export type ContentType = "service" | "location" | "blog" | "image" | "meta";

/**
 * AI provider enumeration
 */
export type AIProvider = "claude" | "gemini" | "openai";

/**
 * Business information stored in JSONB
 */
export interface BusinessInfo {
  name: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  hours?: Record<string, string>;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Theme configuration stored in JSONB
 */
export interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  [key: string]: unknown;
}

/**
 * Site statistics stored in JSONB
 */
export interface SiteStats {
  last_deployed_at?: string;
  deploy_count?: number;
  build_count?: number;
  avg_build_time_ms?: number;
  avg_response_time_ms?: number;
  total_page_views?: number;
  [key: string]: unknown;
}

/**
 * Build checks result stored in JSONB
 */
export interface BuildChecks {
  lint?: boolean;
  type_check?: boolean;
  unit_tests?: boolean;
  e2e_tests?: boolean;
  [key: string]: unknown;
}

/**
 * Content quality scores stored in JSONB
 */
export interface QualityScores {
  readability?: number;
  seo?: number;
  uniqueness?: number;
  [key: string]: unknown;
}

/**
 * Alert metadata stored in JSONB
 */
export interface AlertMetadata {
  [key: string]: unknown;
}

// ============================================================================
// Database Record Types
// ============================================================================

/**
 * Site database record
 */
export interface Site {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  industry: string;
  status: SiteStatus;
  vercel_project_id: string | null;
  newrelic_app_id: string | null;
  business_info: BusinessInfo | null;
  theme_config: ThemeConfig | null;
  stats: SiteStats | null;
  created_at: string;
  updated_at: string;
}

/**
 * Deployment database record
 */
export interface Deployment {
  id: string;
  site_id: string;
  deployment_id: string;
  url: string;
  status: DeploymentStatus;
  build_time_ms: number | null;
  git_branch: string;
  git_commit_sha: string;
  environment: string;
  created_at: string;
  updated_at: string;
}

/**
 * Build database record
 */
export interface Build {
  id: string;
  site_id: string;
  run_id: string;
  workflow: string;
  status: BuildStatus;
  git_branch: string;
  git_commit_sha: string;
  checks_passed: BuildChecks | null;
  created_at: string;
  updated_at: string;
}

/**
 * Metrics database record
 */
export interface Metrics {
  id: string;
  site_id: string;
  date: string;
  response_time_avg_ms: number | null;
  response_time_p95_ms: number | null;
  error_rate_percent: number | null;
  throughput_rpm: number | null;
  apdex_score: number | null;
  page_views: number | null;
  unique_visitors: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Alert database record
 */
export interface Alert {
  id: string;
  site_id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  metadata: AlertMetadata | null;
  notified_at: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Content generation database record
 */
export interface ContentGeneration {
  id: string;
  site_id: string;
  content_type: ContentType;
  provider: AIProvider;
  model: string;
  tokens_used: number;
  cost_usd: number;
  quality_scores: QualityScores | null;
  created_at: string;
}

/**
 * Rate limit database record
 */
export interface RateLimit {
  id: string;
  identifier: string;
  endpoint: string;
  site_slug: string | null;
  request_count: number;
  window_start: string;
  window_end: string;
  created_at: string;
}

// ============================================================================
// Create/Update Input Types
// ============================================================================

/**
 * Data required to create a new site
 */
export interface SiteCreate {
  slug: string;
  name: string;
  domain?: string;
  industry: string;
  status?: SiteStatus;
  vercel_project_id?: string;
  newrelic_app_id?: string;
  business_info?: BusinessInfo;
  theme_config?: ThemeConfig;
  stats?: SiteStats;
}

/**
 * Data that can be updated on an existing site
 */
export interface SiteUpdate {
  name?: string;
  domain?: string;
  industry?: string;
  status?: SiteStatus;
  vercel_project_id?: string;
  newrelic_app_id?: string;
  business_info?: BusinessInfo;
  theme_config?: ThemeConfig;
  stats?: SiteStats;
}

/**
 * Data required to create a new deployment
 */
export interface DeploymentCreate {
  site_slug: string;
  deployment_id: string;
  url: string;
  status: DeploymentStatus;
  build_time_ms?: number;
  git_branch: string;
  git_commit_sha: string;
  environment: string;
}

/**
 * Data that can be updated on an existing deployment
 */
export interface DeploymentUpdate {
  status?: DeploymentStatus;
  build_time_ms?: number;
  url?: string;
}

/**
 * Data required to create a new build
 */
export interface BuildCreate {
  site_slug: string;
  run_id: string;
  workflow: string;
  status: BuildStatus;
  git_branch: string;
  git_commit_sha: string;
  checks_passed?: BuildChecks;
}

/**
 * Data that can be updated on an existing build
 */
export interface BuildUpdate {
  status?: BuildStatus;
  checks_passed?: BuildChecks;
}

/**
 * Data required to upsert metrics (insert or update)
 */
export interface MetricsUpsert {
  site_slug: string;
  date: string;
  response_time_avg_ms?: number;
  response_time_p95_ms?: number;
  error_rate_percent?: number;
  throughput_rpm?: number;
  apdex_score?: number;
  page_views?: number;
  unique_visitors?: number;
}

/**
 * Data required to create a new alert
 */
export interface AlertCreate {
  site_slug: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  metadata?: AlertMetadata;
  notified_at?: string;
}

/**
 * Data required to log content generation
 */
export interface ContentGenerationLog {
  site_slug: string;
  content_type: ContentType;
  provider: AIProvider;
  model: string;
  tokens_used: number;
  cost_usd: number;
  quality_scores?: QualityScores;
}

/**
 * Content generation statistics
 */
export interface ContentGenerationStats {
  total_cost_usd: number;
  total_tokens: number;
  generation_count: number;
  by_type: Record<ContentType, { count: number; cost_usd: number; tokens: number }>;
  by_provider: Record<AIProvider, { count: number; cost_usd: number; tokens: number }>;
}

/**
 * Site list filters
 */
export interface SiteFilters {
  status?: SiteStatus;
  industry?: string;
}

// ============================================================================
// Registry Client
// ============================================================================

/**
 * Supabase client for site registry operations
 */
export class RegistryClient {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL environment variable is required");
    }

    if (!supabaseKey) {
      throw new Error("SUPABASE_SERVICE_KEY environment variable is required");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  // ==========================================================================
  // Sites Methods
  // ==========================================================================

  /**
   * Get a single site by slug
   * @param slug - Site slug (unique identifier)
   * @returns Site record or null if not found
   */
  async getSite(slug: string): Promise<Site | null> {
    try {
      const { data, error } = await this.supabase
        .from("sites")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Not found
        }
        throw new Error(`Failed to get site ${slug}: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error(`Error getting site ${slug}:`, error);
      throw error;
    }
  }

  /**
   * List all sites with optional filters
   * @param filters - Optional filters (status, industry)
   * @returns Array of site records
   */
  async listSites(filters?: SiteFilters): Promise<Site[]> {
    try {
      let query = this.supabase.from("sites").select("*").order("name");

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.industry) {
        query = query.eq("industry", filters.industry);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to list sites: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error listing sites:", error);
      throw error;
    }
  }

  /**
   * Create a new site
   * @param data - Site creation data
   * @returns Created site record
   */
  async createSite(data: SiteCreate): Promise<Site> {
    try {
      const { data: site, error } = await this.supabase
        .from("sites")
        .insert({
          slug: data.slug,
          name: data.name,
          domain: data.domain || null,
          industry: data.industry,
          status: data.status || "active",
          vercel_project_id: data.vercel_project_id || null,
          newrelic_app_id: data.newrelic_app_id || null,
          business_info: data.business_info || null,
          theme_config: data.theme_config || null,
          stats: data.stats || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create site ${data.slug}: ${error.message}`);
      }

      return site;
    } catch (error) {
      console.error(`Error creating site ${data.slug}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing site
   * @param slug - Site slug
   * @param data - Partial site update data
   * @returns Updated site record
   */
  async updateSite(slug: string, data: Partial<SiteUpdate>): Promise<Site> {
    try {
      const { data: site, error } = await this.supabase
        .from("sites")
        .update(data)
        .eq("slug", slug)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update site ${slug}: ${error.message}`);
      }

      return site;
    } catch (error) {
      console.error(`Error updating site ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Delete a site (cascade deletes related records)
   * @param slug - Site slug
   * @returns True if successful
   */
  async deleteSite(slug: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("sites").delete().eq("slug", slug);

      if (error) {
        throw new Error(`Failed to delete site ${slug}: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting site ${slug}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // Deployments Methods
  // ==========================================================================

  /**
   * Get recent deployments for a site
   * @param siteSlug - Site slug
   * @param limit - Maximum number of deployments to return (default: 10)
   * @returns Array of deployment records
   */
  async getRecentDeployments(siteSlug: string, limit = 10): Promise<Deployment[]> {
    try {
      // Get site ID first
      const site = await this.getSite(siteSlug);
      if (!site) {
        throw new Error(`Site not found: ${siteSlug}`);
      }

      const { data, error } = await this.supabase
        .from("deployments")
        .select("*")
        .eq("site_id", site.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to get deployments for ${siteSlug}: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error(`Error getting deployments for ${siteSlug}:`, error);
      throw error;
    }
  }

  /**
   * Create a new deployment record
   * @param data - Deployment creation data
   * @returns Created deployment record
   */
  async createDeployment(data: DeploymentCreate): Promise<Deployment> {
    try {
      // Get site ID first
      const site = await this.getSite(data.site_slug);
      if (!site) {
        throw new Error(`Site not found: ${data.site_slug}`);
      }

      const { data: deployment, error } = await this.supabase
        .from("deployments")
        .insert({
          site_id: site.id,
          deployment_id: data.deployment_id,
          url: data.url,
          status: data.status,
          build_time_ms: data.build_time_ms || null,
          git_branch: data.git_branch,
          git_commit_sha: data.git_commit_sha,
          environment: data.environment,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create deployment for ${data.site_slug}: ${error.message}`);
      }

      return deployment;
    } catch (error) {
      console.error(`Error creating deployment for ${data.site_slug}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing deployment
   * @param deploymentId - Vercel deployment ID
   * @param data - Deployment update data
   * @returns Updated deployment record
   */
  async updateDeployment(deploymentId: string, data: DeploymentUpdate): Promise<Deployment> {
    try {
      const { data: deployment, error } = await this.supabase
        .from("deployments")
        .update(data)
        .eq("deployment_id", deploymentId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update deployment ${deploymentId}: ${error.message}`);
      }

      return deployment;
    } catch (error) {
      console.error(`Error updating deployment ${deploymentId}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // Builds Methods
  // ==========================================================================

  /**
   * Get recent builds for a site
   * @param siteSlug - Site slug
   * @param limit - Maximum number of builds to return (default: 10)
   * @returns Array of build records
   */
  async getRecentBuilds(siteSlug: string, limit = 10): Promise<Build[]> {
    try {
      // Get site ID first
      const site = await this.getSite(siteSlug);
      if (!site) {
        throw new Error(`Site not found: ${siteSlug}`);
      }

      const { data, error } = await this.supabase
        .from("builds")
        .select("*")
        .eq("site_id", site.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to get builds for ${siteSlug}: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error(`Error getting builds for ${siteSlug}:`, error);
      throw error;
    }
  }

  /**
   * Create a new build record
   * @param data - Build creation data
   * @returns Created build record
   */
  async createBuild(data: BuildCreate): Promise<Build> {
    try {
      // Get site ID first
      const site = await this.getSite(data.site_slug);
      if (!site) {
        throw new Error(`Site not found: ${data.site_slug}`);
      }

      const { data: build, error } = await this.supabase
        .from("builds")
        .insert({
          site_id: site.id,
          run_id: data.run_id,
          workflow: data.workflow,
          status: data.status,
          git_branch: data.git_branch,
          git_commit_sha: data.git_commit_sha,
          checks_passed: data.checks_passed || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create build for ${data.site_slug}: ${error.message}`);
      }

      return build;
    } catch (error) {
      console.error(`Error creating build for ${data.site_slug}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing build
   * @param runId - GitHub Actions run ID
   * @param data - Build update data
   * @returns Updated build record
   */
  async updateBuild(runId: string, data: BuildUpdate): Promise<Build> {
    try {
      const { data: build, error } = await this.supabase
        .from("builds")
        .update(data)
        .eq("run_id", runId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update build ${runId}: ${error.message}`);
      }

      return build;
    } catch (error) {
      console.error(`Error updating build ${runId}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // Metrics Methods
  // ==========================================================================

  /**
   * Get metrics for a site for the last N days
   * @param siteSlug - Site slug
   * @param days - Number of days to retrieve (default: 30)
   * @returns Array of metrics records
   */
  async getMetrics(siteSlug: string, days = 30): Promise<Metrics[]> {
    try {
      // Get site ID first
      const site = await this.getSite(siteSlug);
      if (!site) {
        throw new Error(`Site not found: ${siteSlug}`);
      }

      // Calculate date N days ago
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split("T")[0];

      const { data, error } = await this.supabase
        .from("metrics")
        .select("*")
        .eq("site_id", site.id)
        .gte("date", startDateStr)
        .order("date", { ascending: false });

      if (error) {
        throw new Error(`Failed to get metrics for ${siteSlug}: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error(`Error getting metrics for ${siteSlug}:`, error);
      throw error;
    }
  }

  /**
   * Insert or update daily metrics (upsert based on site_id + date)
   * @param data - Metrics upsert data
   * @returns Upserted metrics record
   */
  async upsertMetrics(data: MetricsUpsert): Promise<Metrics> {
    try {
      // Get site ID first
      const site = await this.getSite(data.site_slug);
      if (!site) {
        throw new Error(`Site not found: ${data.site_slug}`);
      }

      const { data: metrics, error } = await this.supabase
        .from("metrics")
        .upsert(
          {
            site_id: site.id,
            date: data.date,
            response_time_avg_ms: data.response_time_avg_ms || null,
            response_time_p95_ms: data.response_time_p95_ms || null,
            error_rate_percent: data.error_rate_percent || null,
            throughput_rpm: data.throughput_rpm || null,
            apdex_score: data.apdex_score || null,
            page_views: data.page_views || null,
            unique_visitors: data.unique_visitors || null,
          },
          {
            onConflict: "site_id,date",
          }
        )
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to upsert metrics for ${data.site_slug}: ${error.message}`);
      }

      return metrics;
    } catch (error) {
      console.error(`Error upserting metrics for ${data.site_slug}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // Alerts Methods
  // ==========================================================================

  /**
   * Get active/unresolved alerts (optionally filtered by site)
   * @param siteSlug - Optional site slug to filter by
   * @returns Array of alert records
   */
  async getActiveAlerts(siteSlug?: string): Promise<Alert[]> {
    try {
      let query = this.supabase
        .from("alerts")
        .select("*")
        .neq("status", "resolved")
        .order("created_at", { ascending: false });

      if (siteSlug) {
        const site = await this.getSite(siteSlug);
        if (!site) {
          throw new Error(`Site not found: ${siteSlug}`);
        }
        query = query.eq("site_id", site.id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to get active alerts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error getting active alerts:", error);
      throw error;
    }
  }

  /**
   * Create a new alert
   * @param data - Alert creation data
   * @returns Created alert record
   */
  async createAlert(data: AlertCreate): Promise<Alert> {
    try {
      // Get site ID first
      const site = await this.getSite(data.site_slug);
      if (!site) {
        throw new Error(`Site not found: ${data.site_slug}`);
      }

      const { data: alert, error } = await this.supabase
        .from("alerts")
        .insert({
          site_id: site.id,
          type: data.type,
          severity: data.severity,
          status: "active",
          message: data.message,
          metadata: data.metadata || null,
          notified_at: data.notified_at || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create alert for ${data.site_slug}: ${error.message}`);
      }

      return alert;
    } catch (error) {
      console.error(`Error creating alert for ${data.site_slug}:`, error);
      throw error;
    }
  }

  /**
   * Acknowledge an alert (set acknowledged_at timestamp)
   * @param alertId - Alert ID
   * @returns Updated alert record
   */
  async acknowledgeAlert(alertId: string): Promise<Alert> {
    try {
      const { data: alert, error } = await this.supabase
        .from("alerts")
        .update({
          status: "acknowledged",
          acknowledged_at: new Date().toISOString(),
        })
        .eq("id", alertId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to acknowledge alert ${alertId}: ${error.message}`);
      }

      return alert;
    } catch (error) {
      console.error(`Error acknowledging alert ${alertId}:`, error);
      throw error;
    }
  }

  /**
   * Resolve an alert (set resolved_at timestamp and status)
   * @param alertId - Alert ID
   * @returns Updated alert record
   */
  async resolveAlert(alertId: string): Promise<Alert> {
    try {
      const { data: alert, error } = await this.supabase
        .from("alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to resolve alert ${alertId}: ${error.message}`);
      }

      return alert;
    } catch (error) {
      console.error(`Error resolving alert ${alertId}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // Content Generations Methods
  // ==========================================================================

  /**
   * Log a content generation event
   * @param data - Content generation log data
   * @returns Created content generation record
   */
  async logContentGeneration(data: ContentGenerationLog): Promise<ContentGeneration> {
    try {
      // Get site ID first
      const site = await this.getSite(data.site_slug);
      if (!site) {
        throw new Error(`Site not found: ${data.site_slug}`);
      }

      const { data: generation, error } = await this.supabase
        .from("content_generations")
        .insert({
          site_id: site.id,
          content_type: data.content_type,
          provider: data.provider,
          model: data.model,
          tokens_used: data.tokens_used,
          cost_usd: data.cost_usd,
          quality_scores: data.quality_scores || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to log content generation for ${data.site_slug}: ${error.message}`);
      }

      return generation;
    } catch (error) {
      console.error(`Error logging content generation for ${data.site_slug}:`, error);
      throw error;
    }
  }

  /**
   * Get aggregated content generation statistics for a site
   * @param siteSlug - Site slug
   * @returns Content generation statistics
   */
  async getContentGenerationStats(siteSlug: string): Promise<ContentGenerationStats> {
    try {
      // Get site ID first
      const site = await this.getSite(siteSlug);
      if (!site) {
        throw new Error(`Site not found: ${siteSlug}`);
      }

      const { data, error } = await this.supabase
        .from("content_generations")
        .select("*")
        .eq("site_id", site.id);

      if (error) {
        throw new Error(`Failed to get content generation stats for ${siteSlug}: ${error.message}`);
      }

      // Aggregate statistics
      const generations = data || [];
      const totalCost = generations.reduce((sum, g) => sum + g.cost_usd, 0);
      const totalTokens = generations.reduce((sum, g) => sum + g.tokens_used, 0);

      // Group by type
      const byType: Record<string, { count: number; cost_usd: number; tokens: number }> = {};
      for (const gen of generations) {
        if (!byType[gen.content_type]) {
          byType[gen.content_type] = { count: 0, cost_usd: 0, tokens: 0 };
        }
        byType[gen.content_type].count++;
        byType[gen.content_type].cost_usd += gen.cost_usd;
        byType[gen.content_type].tokens += gen.tokens_used;
      }

      // Group by provider
      const byProvider: Record<string, { count: number; cost_usd: number; tokens: number }> = {};
      for (const gen of generations) {
        if (!byProvider[gen.provider]) {
          byProvider[gen.provider] = { count: 0, cost_usd: 0, tokens: 0 };
        }
        byProvider[gen.provider].count++;
        byProvider[gen.provider].cost_usd += gen.cost_usd;
        byProvider[gen.provider].tokens += gen.tokens_used;
      }

      return {
        total_cost_usd: totalCost,
        total_tokens: totalTokens,
        generation_count: generations.length,
        by_type: byType as Record<ContentType, { count: number; cost_usd: number; tokens: number }>,
        by_provider: byProvider as Record<
          AIProvider,
          { count: number; cost_usd: number; tokens: number }
        >,
      };
    } catch (error) {
      console.error(`Error getting content generation stats for ${siteSlug}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Test database connection
   * @returns True if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("sites").select("count").limit(1);
      if (error) {
        console.error("Connection test failed:", error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Connection test error:", error);
      return false;
    }
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/**
 * Singleton registry client instance
 */
export const registry = new RegistryClient();
