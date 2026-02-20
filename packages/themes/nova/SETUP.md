# Setup: Nova Theme

Manual steps required after scaffolding:

1. `pnpm install`
2. Add path alias to each site's tsconfig.json that uses this theme:
   `"@platform/themes/nova": ["../../packages/themes/nova/index.ts"]`
3. Add same alias to tools/tsconfig.json if needed
4. If sites/showcase exists: import nova theme in sites/showcase/lib/register-all-themes.ts
5. `pnpm type-check`
