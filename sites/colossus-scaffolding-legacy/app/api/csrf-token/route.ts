import { createCsrfTokenHandler } from "@platform/core-components/lib/api/csrf-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = createCsrfTokenHandler();
