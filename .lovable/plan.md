
# Multi-part hardening & fixes

Built in one pass, grouped into five workstreams.

## 1. Fix manga chapters not loading (root cause)

Diagnosis: `/manga/$id` route is registered correctly, but chapters silently fail because (a) the chapter feed loop in `mangaChaptersFn` fires up to 10 sequential MangaDex requests and throws on the first non-OK response (e.g. 429 rate-limit), losing everything; (b) the detail route has no `loader`, so nothing is SSR-prefetched; (c) the UI never reads `isError`, so any failure renders as the misleading "No English chapters available."

Changes:
- `src/lib/api/manga.functions.ts`
  - Harden `getJson` with retry + exponential backoff on 429/5xx (respect `Retry-After`), and a short timeout via `AbortController`.
  - Make `mangaChaptersFn` resilient: on a failed page, return the chapters gathered so far (partial results) instead of throwing; add a small inter-request delay to avoid tripping rate limits. Same retry treatment for `chapterPagesFn`.
- `src/routes/manga.$id.tsx`
  - Add a `loader` that `ensureQueryData` for both detail + chapters queries (SSR prefetch), plus `errorComponent`/`notFoundComponent`.
  - Destructure `isError` for the chapters query and show a distinct "Couldn't load chapters — retry" state with a retry button (vs. genuinely empty).
- `src/routes/manga.index.tsx`: add a `loader` for the list query (consistency + faster first paint).
- Confirm `QueryClient` retry settings in `src/router.tsx` allow at least 1–2 retries for these queries.

## 2. Premium cyberpunk logo (icon + wordmark) across the site

- Generate a premium neon icon mark (yokai/moon glyph) + "YORUKAI.TV" wordmark, plus a standalone glyph for favicon/social.
- Add the wordmark to the header (`GlassNavbar` / `AppShell`).
- Wire favicon + apple-touch-icon and `og:image` / `twitter:image` defaults in `src/routes/__root.tsx`, and use the glyph as the PWA/manifest icon.
- Store images as Lovable CDN assets.

## 3. Server-side scraping defenses (account + device bans, no IP bans)

Per your choice — account + hashed device bans + ad-hoc rate limiting + short-lived signed stream tokens. No IP bans.

Note: the backend has no standard rate-limiting primitive, so rate limiting is implemented ad-hoc (DB counter table with a time window). This is a known tradeoff you've accepted.

- DB migration:
  - `banned_devices` table (hashed device fingerprint, optional `user_id`, reason, `created_at`, `expires_at`), RLS admin-managed + GRANTs; a `has_active_ban(_device_hash, _user_id)` security-definer function.
  - `endpoint_hits` table (key = hashed device + endpoint, window bucket, count) for ad-hoc rate limiting; admin-readable.
  - Harden `stream_tokens`: add INSERT/UPDATE policies (currently missing) so only the issuing flow writes them.
- Server functions (`createServerFn`, no client-side enforcement):
  - `issueStreamToken`: mints a short-lived HMAC-signed token (using `STREAM_SIGNING_SECRET`) bound to episode + user + device + expiry; stores `token_hash` in `stream_tokens`.
  - `getEpisodeServersGuarded`: validates the signed token, checks `has_active_ban`, applies ad-hoc rate limit, then returns servers via `get_episode_servers`. This becomes the path the player uses.
  - Admin server fns to list/create/revoke device bans, surfaced in the admin route.
- Update `src/routes/watch.$id.tsx` to request a token then call the guarded endpoint.

## 4. Playwright end-to-end tests

- Add Playwright + config + script in `package.json`.
- Tests: manga chapter list renders (and shows retry state on simulated failure), player iframe loads, server cycling switches sources, and "NO SERVERS" fallback renders when no playable servers exist. Mock network where needed so tests are deterministic and don't depend on live MangaDex/embeds.

## 5. Security / SEO / accessibility scans

- Run the security scan + Supabase linter; fix outstanding RLS/policy gaps (stream_tokens INSERT/UPDATE from §3, any flagged tables) and document via security memory.
- Run the SEO review; fix per-route titles/descriptions, structured data (JSON-LD) for media, page-specific social previews, and sitemap entries for manga routes.
- Fix accessibility heading structure (single H1 per page, ordered headings) on flagged routes.
- Note: "Leaked Password Protection" must be toggled by you in the Supabase Auth dashboard (cannot be set from code).

## Technical notes
- All server logic uses TanStack `createServerFn` / server routes — no Supabase Edge Functions.
- Bans rely on a hashed device fingerprint sent from the client; this deters casual scraping but, as previously noted, cannot stop a determined scraper (disabled JS, direct API calls). No IP bans, so shared-network users won't be wrongly locked out.
