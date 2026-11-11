# SocialFlow AI — Authentication, Authorization & Security Design

**Task:** #22 design only · **Baseline:** `main` `a89903237de5` · **Status:** security decisions proposed, not implemented/tested.  
**Related:** [Architecture](BACKEND_ARCHITECTURE.md) · [Database](DATABASE_DESIGN.md) · [API](API_CONTRACTS.md)

## 1. Threat model and security objectives

**Assets:** Identity sessions, users and workspace membership, private videos, approved content, OAuth refresh/access tokens, YouTube channel permissions, publication schedules and statuses, API/worker credentials, logs, analytics.

**Attackers/failure modes:** anonymous bot (credential stuffing), authenticated member of wrong workspace (IDOR/BOLA), malicious website (CSRF), frontend XSS, stolen OAuth token, replayed OAuth callback, malicious media file, duplicate jobs, lost Google responses, overly verbose logs, compromised admin interface, inadvertent public video publication.

Security objectives: deny cross-workspace reads/writes; make credential theft harder; prevent unauthorized/premature publishing; distinguish transient, permanent and ambiguous external failures; never overstate what a job achieved; recover safely from process restarts.

| Priority | Threat | Mitigation and test |
|---|---|---|
| Critical | Workspace ID swap exposes other tenants | Validate membership server-side on **every** route and nested resource; composite tenant FKs; two-workspace IDOR suite |
| Critical | OAuth token leakage | Encrypted at rest / KMS, no secrets in JSON/logs/queue args, least-privilege scopes, rotate keys |
| Critical | Unapproved or duplicate upload | Explicit approval, owner role, idempotency key, DB unique/lease, resumable reconciliation; injected crash tests |
| High | Session hijack or CSRF | HttpOnly Secure cookie, anti-forgery header, SameSite, session invalidation, Origin/Fetch Metadata checks |
| High | OAuth login/link CSRF and replay | High-entropy one-time state, PKCE where supported, bind to user+workspace+short expiry, atomic consume |
| High | Malicious upload | Stream limits, MIME inspection, random object keys, isolated transcoding, antivirus if required |
| High | Credential stuffing / brute force | Rate limits, Identity lockout, generic auth error, email confirmation, alerting |
| Medium | User sees false success | Distinct scheduled/queued/publishing/published/needs_review; confirmed remote ID needed |

## 2. Authentication decision: cookies, not browser-stored JWTs

### Chosen production topology

```text
https://app.example.test/          -> Next.js
https://app.example.test/api/v1/*   -> trusted proxy -> ASP.NET Core
```

`app.example.test` is an **illustrative hostname**, not a deployed domain. Route `/api` through a trusted reverse proxy or verified Next.js rewrite that forwards cookies and anti-forgery headers safely. Browser fetches same-origin `/api/v1/...`; cross-origin credential configuration is unnecessary for production.

- **ASP.NET Core Identity** backed by EF Core/PostgreSQL. Configure `IdentityUser<Guid>` for UUID IDs; Identity's PasswordHasher, security stamp, failed-attempt lockout and reset-token providers. Do not implement raw SHA or manually store passwords.
- **Session cookie:** `__Host-socialflow=<opaque server-protected ticket>`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, **no Domain**. Use a short sliding expiration window (proposed 8h idle, max 7d absolute via additional server-side session tracking/revocation); enforce rotation/revalidation after password reset, role removal and sensitive actions. Actual deployment policy reviewed before coding.
- Avoid access/refresh JWT in `localStorage`, `sessionStorage` or Next.js public runtime config. Access to Identity session is via protected cookie only.
- Backend must have a durable ASP.NET Core **Data Protection key ring** shared across instances and survive restarts. Keys at rest protected. Invalidation/revocation policy must be proven, not assumed from deleting the browser cookie alone.
- Login and registration contracts are JSON; register does **not** implicitly login. Use `POST /auth/login`; unauthenticated browsing remains possible for landing/auth screens; authenticated pages eventually enforce `/auth/me` and redirect on `401`.
- **Public deployment email verification:** do not permit connection/publishing until verified email. This requires a real email sender and confirmation endpoints; no simulated successful verification. Local controlled tests may use explicitly confirmed fixture accounts.

### Why not bearer JWT as the browser authentication primitive?

JWT in JavaScript-accessible storage increases token theft impact from XSS and complicates logout/revocation. Cookies are practical for a browser-only graduation MVP with a same-origin proxy; however, cookie authentication **requires actual CSRF protection** and careful reverse-proxy/domain configuration. The choice is not a universal security claim that cookies are safer in every architecture.

## 3. CSRF, CORS, HTTP and endpoint policies

- Antiforgery token bootstrapped via `GET /api/v1/auth/csrf`; bind it to an anti-forgery cookie/session; Next.js submits opaque token as `X-CSRF-TOKEN` on every unsafe request, including anonymous register/login (login CSRF matters). Use built-in ASP.NET Core antiforgery facilities with integration tests.
- Authenticate first as appropriate, then validate CSRF and authorization; unsafe GET endpoints are forbidden. Standard OAuth callback GET is a narrow exception: it must validate the one-time state and intended actor/workspace, and should redirect via `303` without exposing code/tokens in page content/logging.
- Enforce `Origin` / Fetch Metadata as defense in depth where feasible; `SameSite=Lax` is not a complete CSRF solution. Never rely on CORS to prevent CSRF.
- Production browser calls stay same-origin; if cross-origin is needed for local development, configure **specific** origin(s) and `AllowCredentials` deliberately; never `AllowAnyOrigin` + credentials. Prefer local `/api` proxy to match production.
- HTTPS and HSTS; secure forwarded headers only from known proxies; CORS and cookie settings must be tested behind actual deployment topology. Avoid broad shared-domain cookies.
- Set `Cache-Control: no-store` for session, user profile, connection status, token workflows and other sensitive responses; use security headers (CSP with tested Next.js compatibility, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, frame restrictions) and input/output encoding.
- Do not expose Hangfire dashboard publicly. Restrict it to internal ops or disable in MVP; audit privileged access.

References: [Microsoft CSRF guidance](https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-10.0), [Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-10.0), [ProblemDetails](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0).

## 4. Workspace authorization and access matrix

**Server-resolved identity:** verify authenticated `user_id`, then lookup active `WorkspaceMembers(user_id, X-Workspace-Id)` before controller/service accesses data. There is **no** implicit trust in a workspace supplied by a client, a claim that has gone stale, or a post/media ID. Query and mutate with `(workspace_id,id)`; ensure child FKs preserve workspace consistency. On membership revocation, invalidate affected sessions/claims/caches or resolve membership fresh for sensitive operations.

| Action | Anonymous | Member | Admin | Owner |
|---|---|---|---|---|
| Register / login | Yes | Yes | Yes | Yes |
| List own workspaces | No | Yes | Yes | Yes |
| View workspace posts/media/status | No | Yes | Yes | Yes |
| Create/edit drafts | No | Later (permissioned) | Later | Yes (MVP) |
| Upload media | No | Later (permissioned) | Later | Yes (MVP) |
| Connect/disconnect YouTube OAuth | No | No | Later | Yes (MVP) |
| Approve/schedule/retry/cancel publication | No | No | Later | Yes (MVP) |
| Change workspace role/members | No | No | Later | Owner (later feature) |
| Read token ciphertext / worker secrets | No | No | No | **No** (backend worker only) |

Owners are not allowed to access another owner's workspace by guessing IDs. Forbidden workspace selection returns `403`; missing/foreign resource within authorized workspace returns `404`. Service-to-service worker contexts use explicit tenant and scoped service permissions; never impersonate a frontend user without traceability.

## 5. Google OAuth / YouTube security

### Authorization-code connection flow

1. Authenticated **owner** with confirmed email calls `POST /social-accounts/youtube/connect` (CSRF protected), with allowlisted `returnPath` such as `/social-accounts`.
2. Server generates >=128 bits of unpredictable `state`, stores **hash only** in `OAuthStates` plus actor user, workspace, provider, expiry (~10 min), redirect path, and an **encrypted** PKCE code verifier if supported. Bind OAuth request to the initiating Identity session; do not permit reuse from another user/session.
3. Server responds with Google authorization URL for exact registered HTTPS redirect URI. Request minimal YouTube upload scopes, offline access when scheduled jobs require unattended refresh; use PKCE when supported by selected Google client/flow.
4. Google redirects to `/api/v1/integrations/youtube/callback?code=...&state=...`; server verifies state hash, actor/session, workspace membership and expiry; marks consumed **atomically** before token use; rejects replay, wrong user or changed workspace.
5. Exchange code server-to-server; inspect granted scopes/account/channel identity (request an additional read scope only if the verified channel-lookup endpoint actually requires it); securely persist or rotate credentials. Create/update SocialAccount without exposing refresh tokens. Redirect `303` to the allowlisted app route with only a brief success/opaque failure indicator. Remove query code/state from logs and referrers.
6. Refresh before a background job as needed; serialize refresh per credential/account so parallel workers do not overwrite rotated refresh tokens. On `invalid_grant`, mark account `expired`, stop publishing and request reconnection. Revoke at Google where possible on disconnect, then delete/protect local secret material while preserving non-sensitive history.

Official Google references: [OAuth server app](https://developers.google.com/identity/protocols/oauth2/web-server), [OAuth best practices](https://developers.google.com/identity/protocols/oauth2/resources/best-practices), [YouTube videos.insert](https://developers.google.com/youtube/data/reference/rest/v3/videos/insert).

**Publishing visibility is sensitive:** require user approval of explicit `private/unlisted/public` setting; never trust YouTube defaults, which may be public. Store approval actor/time + immutable content snapshot. OAuth scopes authorize an API action but do **not** authorize an unrelated member of the workspace to invoke it.

## 6. Token, key, and secret storage

- TokenCredentials holds encrypted token bytes or a vault/KMS reference; encrypt at rest with authenticated encryption (e.g. managed envelope encryption AES-GCM through a vetted provider), use randomly generated nonce and recorded key version. Key material lives **outside** PostgreSQL and source control.
- Access/refresh tokens, OAuth codes, PKCE verifiers, resumable YouTube session URLs and private object presigned URLs are **secrets or capabilities**: avoid logging, exposing in analytics or storing in Hangfire job arguments. Preserve resumable upload state only in protected persistence.
- Limit who/what can decrypt: API authorization service to manage connection, background worker to refresh/upload, not normal query projections or administrators through HTTP API.
- Rotate keys with migration plan, revoke compromised credentials, establish backups and restore tests for encrypted data. Encrypted database backups alone do not replace key-management review.
- `.env`, connection strings, Google client secret, object-storage credentials and ASP.NET Data Protection keys must never enter Git history. Use user secrets locally and managed secrets in deployment; use secret scanning in CI before production.

## 7. Rate limiting, abuse controls and session policy

| Surface | Initial policy proposal | Response and logging |
|---|---|---|
| `/auth/login` | 5 failed attempts/15 min per normalized account + conservative IP bucket; use Identity lockout | `429` with `Retry-After`, **generic** login error and no account enumeration |
| `/auth/register` | 5/1h per IP, spam checks as necessary | `429`, no password logging |
| `/auth/forgot-password` and resend confirmation | 3/1h per account and IP, generic response regardless of account existence | `202` generic and throttling, avoid enumeration via timing/details |
| YouTube OAuth connect/callback | 10 connects/hour per user/workspace; tight callback expiry and replay detection | Denied/expired state logged as hashed identifier only |
| Media upload | Per-user concurrent upload limit, per-workspace byte quota; configurable 1 GiB max per file | `413`/`429`, clean abandoned bytes |
| Schedule/publish/retry | Per-workspace/user limits and YouTube quota-aware admission | `429`/`409`, idempotent acceptance; no blind retries on quota failure |

These numbers are **initial proposals**, not proven production-safe constants. Apply limits behind trusted forwarding headers (do not accept spoofed arbitrary `X-Forwarded-For`), with sensible backoff and monitoring. A distributed limiter needs shared state if multiple API instances are deployed.

Sessions and security stamps: log out by invalidating server-side session where supported; revoke on password reset/role removal; rotate session identifier after login/elevation; guard against session fixation. Report sign-in failures without echoing the submitted password/email in raw logs.

## 8. Publishing authorization, retry and uncertainty

**Trust boundary:** a Hangfire job is not authorized merely because it was enqueued. Worker loads Publication with `workspace_id`, confirms the approved immutable snapshot, SocialAccount state/required scope, media readiness and current cancellation policy; job arguments carry only IDs/lease tokens.

- `schedule` or `publish now` requires an explicit final user confirmation; selected YouTube privacy status is saved in the snapshot; post/user approval actor + timestamp are recorded.
- Use database uniqueness `(workspace_id,post_id,social_account_id)` and `Idempotency-Key` on user commands to prevent repeated scheduling; queue may still deliver at least once.
- Atomic claim/lease with token fencing prevents competing workers updating one Publication; **external calls cannot be rolled back**. Keep remote operation context and resumable upload session encrypted.
- Retry only confirmed transient failures, bounded with backoff and provider quota guidance; never retry permanent permission or content validation failures without correction.
- If response was lost after upload, recover by querying resumable session or known provider ID. When uncertain, `needs_review` and stop; **do not issue another upload** based on an assumption.
- An attempted cancellation while uploading is best-effort. The API must not claim that a completed public YouTube video was automatically removed.

## 9. Media and object-storage security

- Stream uploads; enforce real content-length/byte counters plus MIME signature checking, type allowlist and safe filenames; reject polyglots/untrusted files when validation fails. Do not trust the browser's `Content-Type` or file extension.
- Generate opaque random object keys scoped to workspace but not directly guessable; private bucket, least-privilege server role, no public listing and encryption at rest.
- Validate authorization before returning presigned download URLs; short expiration; never put permanent capability URLs in persisted analytics or logs. Cross-workspace object retrieval must be impossible through guessed keys.
- Run `ffprobe` / `FFmpeg` with low-privilege sandbox, resource/time limits, no arbitrary shell interpolation or remote URL protocols; document antivirus/content scanning policy before public file intake.
- Delete orphaned multipart or failed uploads via safe cleanup jobs; do not delete a media object still referenced by a Post/Publication. Scan file properties only in trusted worker environment.

## 10. Error responses, logging and operational safety

Use `ProblemDetails` for `400/401/403/404/409/412/413/415/422/428/429/5xx`, with stable `code` and `traceId`, but omit confidential internal `detail`. Avoid leaking whether a foreign tenant record exists (`404`). `500` errors expose only a generic description. Collect structured audit events for login success/failure, workspace membership changes, OAuth connection/revocation, approval/scheduling, attempt state transitions, manual retry and uncertain outcomes.

**Redaction checklist:** passwords, security stamps, session cookies, CSRF token, OAuth code/state/verifier, access/refresh token, Google client secret, YouTube resumable session URI, presigned object URLs, raw third-party authorization responses, private video bytes. Whitelist known-safe structured logging fields; do not rely on ad-hoc regex alone.

Hangfire dashboard and `/health/ready` must be protected or internal-only; public `/health/live` exposes no DB details. Use backups, encrypted storage, restricted DB credentials, key rotation and restore drills. Production readiness requires tests for privacy visibility and upload quotas on a permitted YouTube test account.

## 11. Security acceptance test matrix (future implementation)

| ID | Test scenario | Expected result |
|---|---|---|
| SEC-01 | User A sets `X-Workspace-Id` to B's workspace | `403` and no data, including nested resources |
| SEC-02 | Authenticated user in W1 requests W2 post/media/publication ID | `404`, no existence leak |
| SEC-03 | Missing/invalid CSRF token on authenticated POST/PATCH/DELETE | Rejected; no state change |
| SEC-04 | Cookie present but invalid/expired Identity session | `401`; no protected data |
| SEC-05 | Repeated bad password attempts | Lockout/rate limit, generic error |
| SEC-06 | OAuth callback without/expired/reused state | Rejected; no connection created |
| SEC-07 | OAuth callback from different user/session/workspace | Rejected; bind state to initiator |
| SEC-08 | Revoked refresh token at worker execution | Account `expired`; fail safely without posting |
| SEC-09 | Try to publish unready video, disconnected account or unapproved content | `422`/`409`; no queue job |
| SEC-10 | Two simultaneous schedule requests with same idempotency key | One Publication, same accepted response |
| SEC-11 | Reuse key with different payload | `409`, original operation unchanged |
| SEC-12 | Worker dies after provider accepts upload but before DB update | Reconcile / `needs_review`; no blind second upload |
| SEC-13 | Upload malicious type, oversized file, cross-tenant media ID | Rejected and private storage cleaned safely |
| SEC-14 | Read public API, Hangfire args and structured logs | No password, OAuth token, presigned URL, upload session URI |
| SEC-15 | Logout, password reset, membership revocation | Sessions/permissions become invalid according to documented TTL/refresh rule |
| SEC-16 | Provider defaults to public, while user selected private | Explicit `privacyStatus=private` used; no unexpected public upload |

All tests remain **Not run** in TASK #22; documentation is **not** evidence of a hardened or operational system.

## 12. Residual risks and decisions needing explicit sign-off

1. A same-origin proxy must be deployed correctly; separate-domain local development without same-origin routing changes cookie, CSRF and CORS assumptions.
2. A database lease does **not** give exactly-once guarantees across YouTube; `needs_review` and safe reconciliation are mandatory controls.
3. Workspace isolation must be checked in application queries and composite FKs; future RLS may add defense in depth but is not assumed.
4. Email confirmation and password recovery require a real mail delivery configuration; do not treat mock UI as completed security workflows.
5. YouTube requested scopes, quotas, privacy defaults and Google OAuth verification rules must be revalidated at implementation/deployment time. Current official docs (November 2026) differ from many older tutorials.
6. No browser test, penetration test, database migration or secret-scanning CI was executed during this documentation-only task.

**Implementation may start only after reviewing the four #22 documents together, including the named outstanding decisions.**
