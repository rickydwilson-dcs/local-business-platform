import { createAnalyticsTrackHandler } from "@platform/core-components/lib/api/analytics-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { POST, GET } = createAnalyticsTrackHandler();
export { POST, GET };
