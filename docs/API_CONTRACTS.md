# SocialFlow AI — REST API Contracts v1

**Task:** #22 design only · **Base path:** `/api/v1` · **Baseline:** `main` `a89903237de5`  
**Status:** proposed contracts; **no endpoints are implemented** in this task.  
**Related:** [Architecture](BACKEND_ARCHITECTURE.md) · [Database](DATABASE_DESIGN.md) · [Security](SECURITY_DESIGN.md) · [Frontend flow](FRONTEND_FLOW.md)

## 1. Wire protocol and invariants

- All API calls from Next.js use same-origin `https://<app-host>/api/v1/*` routed by a trusted proxy to ASP.NET Core. JSON: `Content-Type: application/json`; media upload: `multipart/form-data` with streaming.
- **Identity**: server-backed ASP.NET Core Identity session cookie (`HttpOnly`, Secure), sent automatically via same origin. No JWT in browser local storage. `GET /auth/me` exposes the current user, not secrets.
- **CSRF**: obtain `GET /auth/csrf` and attach `X-CSRF-TOKEN` to unsafe methods (`POST`, `PATCH`, `PUT`, `DELETE`) including login/register/logout. OAuth callback uses one-time validated state.
- **Tenancy**: authenticated workspace-scoped endpoints require `X-Workspace-Id: <uuid>`. API validates an **active membership** and required role. No trust in a workspace ID merely because a user provided it. Auth and `GET /workspaces` do not require the header. For endpoints containing a workspace ID in the URL, it must equal the selected header workspace and pass membership authorization.
- **IDs**: UUID strings; times are UTC RFC 3339 with `Z`, e.g. `2026-11-12T17:00:00Z`; UI renders in workspace's IANA timezone (`Europe/Istanbul` default). Local day filters are `YYYY-MM-DD` with `timeZone` resolved by workspace.
- **Pagination**: `page` starts at 1, `pageSize` defaults to 20 and max 100; stable sort by `createdAtUtc DESC,id DESC`; return `{items,page,pageSize,totalItems,totalPages}`. Validate query enums, integer bounds, and date ordering.
- **Authorization roles**: Owner/Admin can manage workspace accounts and credentials, Member can create/update own or workspace content and schedule when granted **publisher** permission. For initial MVP, `owner` alone can connect/publish; advanced permission grants deferred. This avoids allowing every member to upload to the owner's channel by default.
- **Optimistic concurrency**: write endpoints that mutate posts, workspace or publication scheduling require `If-Match: "rev-N"` obtained from `ETag`/DTO `version`; missing precondition → `428`, stale version → `412`.
- **Idempotency**: schedule, publish-now and retry require `Idempotency-Key: <random opaque value>`; same key/payload returns previous result, key reused with different payload → `409`. It does not guarantee exactly-once remote upload.
- Every response containing a protected resource is filtered by authorized workspace, and all secret/session/token fields are **omitted**. Unauthenticated → `401`; not a member of requested workspace → `403`; a resource ID outside the authorized workspace → `404` to avoid revealing existence.
- **MVP column** in the catalog means the endpoint is planned for the first YouTube vertical slice; **later** means contract reserved, not offered until implemented.

## 2. Endpoint catalog

Legend: `Public` anonymous; `User` authenticated; `Owner` workspace owner (MVP); `Publisher` owner for MVP, potentially extended later; `WS` requires `X-Workspace-Id`; `{id}` UUID.

| HTTP | Endpoint (prefix `/api/v1`) | Auth | Request DTO / purpose | Success | Scope |
|---|---|---|---|---|---|
| GET | `/auth/csrf` | Public | Issue antiforgery token | 200 `CsrfResponse` | MVP |
| POST | `/auth/register` | Public + CSRF | `RegisterRequest` | 201 `UserResponse`; cookie behavior documented | MVP |
| POST | `/auth/login` | Public + CSRF | `LoginRequest` | 200 `UserResponse` + cookie | MVP |
| POST | `/auth/logout` | User + CSRF | none | 204 | MVP |
| GET | `/auth/me` | User | none | 200 `UserResponse` | MVP |
| POST | `/auth/forgot-password` | Public + CSRF | `ForgotPasswordRequest` | 202 generic acknowledgment | MVP if email delivery configured |
| POST | `/auth/reset-password` | Public + CSRF | `ResetPasswordRequest` | 204 | MVP if email delivery configured |
| POST | `/auth/confirm-email` | Public + CSRF | `ConfirmEmailRequest` | 204 | MVP if email delivery configured |
| POST | `/auth/resend-confirmation` | Public + CSRF | `{email}` | 202 generic acknowledgment | MVP if email delivery configured |
| GET | `/workspaces` | User | page/pageSize | 200 `Paged<WorkspaceResponse>` | MVP |
| POST | `/workspaces` | User + CSRF | `CreateWorkspaceRequest` | 201 `WorkspaceResponse` | MVP |
| GET | `/workspaces/{id}` | User, member | workspace ID | 200 `WorkspaceResponse` | MVP |
| PATCH | `/workspaces/{id}` | Owner + CSRF | `UpdateWorkspaceRequest`, If-Match | 200 `WorkspaceResponse` | Later |
| GET | `/workspaces/{id}/members` | Owner, WS | page/pageSize | 200 `Paged<MemberResponse>` | Later |
| POST | `/workspaces/{id}/members` | Owner + CSRF, WS | invitation/role DTO | 202 | Later |
| PATCH | `/workspaces/{id}/members/{userId}` | Owner + CSRF, WS | `ChangeRoleRequest`, If-Match | 200 | Later |
| GET | `/media` | User, WS | page, status, type, search, sort | 200 `Paged<MediaResponse>` | MVP |
| POST | `/media` | Publisher + CSRF, WS | streamed multipart `file` | 201/202 `MediaResponse` | MVP |
| GET | `/media/{id}` | User, WS | ID | 200 `MediaResponse` | MVP |
| GET | `/media/{id}/download-url` | User, WS | ID | 200 `{url,expiresAtUtc}` short-lived private URL | MVP |
| DELETE | `/media/{id}` | Owner + CSRF, WS | ID, If-Match | 204 (eligible only) | Later |
| GET | `/posts` | User, WS | page, search, status, platform, from/to | 200 `Paged<PostSummaryResponse>` | MVP |
| POST | `/posts` | Publisher + CSRF, WS | `CreatePostRequest` | 201 `PostDetailResponse` | MVP |
| GET | `/posts/{id}` | User, WS | ID | 200 `PostDetailResponse` | MVP |
| PATCH | `/posts/{id}` | Publisher + CSRF, WS | `UpdatePostRequest`, If-Match | 200 `PostDetailResponse` | MVP |
| DELETE | `/posts/{id}` | Owner + CSRF, WS | ID, If-Match | 204 for eligible unsubmitted draft | Later |
| GET | `/social-accounts` | User, WS | platform, status | 200 `SocialAccountResponse[]` | MVP |
| POST | `/social-accounts/youtube/connect` | Owner + CSRF, WS | `{returnPath}` allowlisted | 200 `AuthorizationUrlResponse` | MVP |
| GET | `/integrations/youtube/callback` | Signed OAuth state | Google `code,state` or `error,state` | 303 to allowlisted frontend route | MVP |
| DELETE | `/social-accounts/{id}` | Owner + CSRF, WS | disconnect/revoke | 204 | MVP |
| POST | `/posts/{id}/schedule` | Publisher + CSRF, WS | `SchedulePostRequest` + If-Match + Idempotency-Key | 202 `ScheduleResponse` | MVP |
| POST | `/posts/{id}/publish` | Publisher + CSRF, WS | `PublishPostRequest` + If-Match + Idempotency-Key | 202 `ScheduleResponse` | MVP |
| GET | `/publications` | User, WS | page, postId, platform, status, dateFrom/dateTo | 200 `Paged<PublicationResponse>` | MVP |
| GET | `/publications/{id}` | User, WS | ID | 200 `PublicationDetailResponse` incl. attempts | MVP |
| POST | `/publications/{id}/retry` | Publisher + CSRF, WS | `RetryPublicationRequest` + Idempotency-Key | 202 `PublicationResponse` | MVP |
| POST | `/publications/{id}/cancel` | Publisher + CSRF, WS | `{reason?}` + If-Match | 202 `PublicationResponse` | MVP |
| PATCH | `/publications/{id}/schedule` | Publisher + CSRF, WS | `{scheduledAtUtc}` + If-Match | 200 `PublicationResponse` | Later |
| GET | `/analytics/overview` | User, WS | from, to, platform | 200 `AnalyticsOverviewResponse` | Later |
| GET | `/analytics/daily` | User, WS | from, to, platform, postId | 200 `AnalyticsDailyResponse[]` | Later |
| GET | `/analytics/top-posts` | User, WS | from, to, platform, limit<=20 | 200 `TopPostResponse[]` | Later |
| GET | `/health/live` | Infrastructure | no private data | 200 | MVP |
| GET | `/health/ready` | Internal/ops only | DB, queue and storage checks | 200/503 | MVP |

**No unimplemented endpoints should falsely return demo success.** `Later` endpoints should not be mapped until that functionality exists; the frontend continues to show mock/demo state. For `/auth/register`, decide in implementation whether it issues a session immediately or requires verified email and separate login; the **contract here chooses no automatic login** and `201 UserResponse`, followed by explicit login. Email verification must be required before connecting/publishing in a public deployment; local test policy may use confirmed test users.

## 3. Core DTO shapes and validation

### Authentication & workspace

| DTO | Fields and validation |
|---|---|
| `CsrfResponse` | `csrfToken: string` opaque, non-secret session-bound anti-forgery token |
| `RegisterRequest` | `fullName` 1–120 chars; `email` syntactically valid, max 254, normalized/unique; `password` per Identity strength policy (initial min 12), `confirmPassword` checked only client-side/server DTO may ignore; never echo password |
| `LoginRequest` | `email`, `password` required; generic failure messages; rate-limit by IP/account |
| `UserResponse` | `id`, `fullName`, `email`, `emailConfirmed`; **no hash, tokens, security stamps** |
| `ForgotPasswordRequest` | `email`; always generic 202 to avoid enumeration |
| `ResetPasswordRequest` | `email`, `resetToken`, `newPassword`; short-lived single-use Identity reset token (bound to security stamp); never log token |
| `ConfirmEmailRequest` | `userId`, `confirmationToken`; validate short-lived token and user, prevent leaking it in logs; no automatic OAuth linkage |
| `CreateWorkspaceRequest` | `name` 1–120; optional `timeZone` valid IANA ID, defaults Europe/Istanbul |
| `WorkspaceResponse` | `id`, `name`, `timeZone`, `currentUserRole`, `version`, `createdAtUtc` |
| `UpdateWorkspaceRequest` | optional `name`, `timeZone`; at least one field; If-Match required |
| `MemberResponse` | `userId`, `displayName`, `role`, `joinedAtUtc`, `revokedAtUtc?` |

### Media, post and content

| DTO | Fields and validation |
|---|---|
| `MediaResponse` | `id`, `originalFilename`, `type`, `mimeType`, `sizeBytes`, `status`, `durationMs?`, `width?`, `height?`, `uploadedAtUtc`, `version`; **no storageKey** |
| `CreatePostRequest` | `title` 1–200; `description?` ≤5000; `mediaId?` UUID within workspace, `platformContents` array (can be empty for draft) |
| `UpdatePostRequest` | partial `title`,`description`,`mediaId`,`platformContents`; only draft/ready; `version` check; changing approved content requires explicit new approval in future |
| `PlatformContentDto` | `platform` enum youtube/tiktok/instagram, `title?`, `body`, `tags: string[]`, `callToAction?`; uniquely one entry/platform; on YouTube publish title 1–100, description ≤5000, tags provider limits enforced by YouTube adapter |
| `PostSummaryResponse` | `id`, `title`, `mediaId?`, `platforms`, `createdAtUtc`, `scheduledAtUtc?`, `displayStatus` derived, `version` |
| `PostDetailResponse` | summary + `description`, `workflowStatus`, `platformContents`, `publications: PublicationResponse[]`, `updatedAtUtc` |
| `SocialAccountResponse` | `id`, `platform`, `displayName`, `providerAccountId` (public channel id only), `status`, `scopes` non-secret, `lastVerifiedAtUtc?`; never credentials |
| `AuthorizationUrlResponse` | `authorizationUrl` limited to trusted Google origin and short-lived state; must not be persisted in logs |

### Schedule and publications

| DTO | Fields and validation |
|---|---|
| `SchedulePostRequest` | `scheduledAtUtc` future RFC3339 UTC, `targets: [{socialAccountId,platform}]` (MVP exactly one YouTube target), `privacyStatus: private/unlisted/public`, `approval: true`; server verifies media READY, account CONNECTED, YouTube content valid, membership and consent |
| `PublishPostRequest` | same target/approval/visibility fields, without scheduledAtUtc; immediate queue, not synchronous network upload |
| `ScheduleResponse` | `postId`, `publications: PublicationResponse[]`, `acceptedAtUtc`, `status: accepted` |
| `PublicationResponse` | `id`, `postId`, `socialAccountId`, `platform`, `status`, `scheduledAtUtc?`, `publishedAtUtc?`, `providerPostId?`, `providerProcessingStatus?`, `attemptCount`, `version`, `lastErrorCode?`, `canRetry`, `canCancel` |
| `PublicationDetailResponse` | `PublicationResponse` plus `attempts: AttemptResponse[]` (sanitized) and approved content summary; `needs_review` is a visible status |
| `AttemptResponse` | `id`, `attemptNo`, `status`, `startedAtUtc`, `endedAtUtc?`, `errorCode?`, `sanitizedMessage?`, `retryable?`; **no session URI/token** |
| `RetryPublicationRequest` | `acknowledgePreviousFailure: true`; only definitive retryable `failed` state, never `published/needs_review` without reconciliation |

### Analytics (deferred)

| DTO | Fields and validation |
|---|---|
| `AnalyticsOverviewResponse` | `period: {from,to,timeZone}`, `views`, `likes`, `comments`, `sharesAvailable`, `sharesMissingCount`, `engagementRate?` where no views→null |
| `AnalyticsDailyResponse` | `date: YYYY-MM-DD`, `platform`, `publicationId`, `views`, `likes`, `comments`, `shares: number|null` |
| `TopPostResponse` | `postId`, `title`, `platforms`, `views`, `engagements`, `engagementRate?` |

**Frontend auth compatibility note:** the current registration UI enforces a lower minimum password length than the proposed server-side 12-character policy. Align the UI validation with the finalized Identity policy before enabling real registration. Likewise, frontend `/reset-password` and `/confirm-email` views must be added or adapted when a real email sender is configured.

**Important frontend migration:** current Next.js `PostRow.status` is a demo aggregate; future API uses `displayStatus` derived from Publications. `mediaId`, IDs, publication IDs and platform content must remain consistent across Dashboard/Posts/Calendar/Publishing/Analytics. Replace mocked persistence and mocked auth only when server-backed endpoints exist.

## 4. Concrete request/response examples

### 4.1 Create workspace

```http
POST /api/v1/workspaces
Content-Type: application/json
X-CSRF-TOKEN: <antiforgery-token>
Cookie: __Host-socialflow=<opaque-cookie>

{"name":"Creator Studio","timeZone":"Europe/Istanbul"}
```

```json
{
  "id":"f1b10111-98af-4a30-8629-9ed99c2ea111",
  "name":"Creator Studio","timeZone":"Europe/Istanbul",
  "currentUserRole":"owner","version":1,
  "createdAtUtc":"2026-11-12T09:00:00Z"
}
```

Response `201 Created`, `Location: /api/v1/workspaces/{id}`. Use `X-Workspace-Id` on subsequent workspace-scoped API calls.

### 4.2 Media upload

```http
POST /api/v1/media
X-Workspace-Id: f1b10111-98af-4a30-8629-9ed99c2ea111
X-CSRF-TOKEN: <antiforgery-token>
Content-Type: multipart/form-data; boundary=...

file=<streamed binary video>
```

Response `201 Created` if metadata is ready; otherwise `202 Accepted` if processing is asynchronous. Example:

```json
{
  "id":"aa380989-30b3-44f1-b0bc-747350fa0001",
  "originalFilename":"tutorial.mp4","type":"video",
  "mimeType":"video/mp4","sizeBytes":104857600,
  "status":"ready","durationMs":92000,"width":1920,"height":1080,
  "uploadedAtUtc":"2026-11-12T09:01:00Z","version":1
}
```

Uploaded bytes are never returned inline. `413` if size limit exceeded, `415` unsupported MIME, `422` corrupt/failed inspection, `507/503` storage unavailable (appropriate operation-specific error mapping).

### 4.3 Create a draft (Step 1–3 frontend Wizard)

```http
POST /api/v1/posts
X-Workspace-Id: f1b10111-98af-4a30-8629-9ed99c2ea111
X-CSRF-TOKEN: <antiforgery-token>
Content-Type: application/json

{
  "title":"Dependency Injection Explained",
  "description":"Creator's internal draft note",
  "mediaId":"aa380989-30b3-44f1-b0bc-747350fa0001",
  "platformContents":[{
    "platform":"youtube",
    "title":"Dependency Injection Explained",
    "body":"A practical ASP.NET Core walkthrough",
    "tags":["dotnet","dependency injection"],
    "callToAction":null
  }]
}
```

Response `201 Created` `PostDetailResponse`: `id`, `version`, `workflowStatus: draft`, `platformContents`, `publications: []`. The draft may be incomplete; **scheduling** must enforce strict validation.

### 4.4 User-approved YouTube schedule (Wizard Step 4–5)

```http
POST /api/v1/posts/35f073ad-53f6-4f64-bbeb-1e10f9012001/schedule
Cookie: __Host-socialflow=<opaque-cookie>
X-Workspace-Id: f1b10111-98af-4a30-8629-9ed99c2ea111
X-CSRF-TOKEN: <antiforgery-token>
Idempotency-Key: 5a9c46ad-50a1-458d-af2a-531b35e71823
If-Match: "rev-1"
Content-Type: application/json

{
  "scheduledAtUtc":"2026-11-13T17:00:00Z",
  "targets":[{"socialAccountId":"feae0133-0b18-4227-91ec-133d23162004","platform":"youtube"}],
  "privacyStatus":"private",
  "approval":true
}
```

```json
{
  "postId":"35f073ad-53f6-4f64-bbeb-1e10f9012001",
  "status":"accepted","acceptedAtUtc":"2026-11-12T09:10:00Z",
  "publications":[{
    "id":"93f83e45-ff84-4e9d-9bf7-59f1f0982002",
    "postId":"35f073ad-53f6-4f64-bbeb-1e10f9012001",
    "socialAccountId":"feae0133-0b18-4227-91ec-133d23162004",
    "platform":"youtube","status":"scheduled",
    "scheduledAtUtc":"2026-11-13T17:00:00Z",
    "publishedAtUtc":null,"providerPostId":null,
    "attemptCount":0,"version":1,"canRetry":false,"canCancel":true
  }]
}
```

Response `202 Accepted`. This is **not** a claim that a video was published. Scheduling occurs only after user approval; no automatic publication from AI suggestions. When mode is publish-now, use `POST /posts/{id}/publish` with the same approved target/visibility and omit `scheduledAtUtc`.

### 4.5 Publication status and attempts

`GET /api/v1/publications/{id}` returns `PublicationDetailResponse`:

```json
{
  "id":"93f83e45-ff84-4e9d-9bf7-59f1f0982002",
  "postId":"35f073ad-53f6-4f64-bbeb-1e10f9012001",
  "socialAccountId":"feae0133-0b18-4227-91ec-133d23162004",
  "platform":"youtube","status":"failed",
  "scheduledAtUtc":"2026-11-13T17:00:00Z",
  "publishedAtUtc":null,"providerPostId":null,"providerProcessingStatus":null,
  "attemptCount":1,"version":3,"lastErrorCode":"YOUTUBE_TEMPORARY_UNAVAILABLE",
  "canRetry":true,"canCancel":false,
  "attempts":[{
    "id":"d8350e5b-2d98-4763-951e-b8161b2a3303",
    "attemptNo":1,"status":"failed",
    "startedAtUtc":"2026-11-13T17:00:03Z",
    "endedAtUtc":"2026-11-13T17:00:08Z",
    "errorCode":"YOUTUBE_TEMPORARY_UNAVAILABLE",
    "sanitizedMessage":"Provider temporarily unavailable",
    "retryable":true
  }]
}
```

For a `needs_review` status, `canRetry` MUST be false until provider reconciliation resolves the uncertain outcome.

## 5. Failure contract: RFC 9457-style ProblemDetails

All client-visible failures return `application/problem+json` with `type`, `title`, `status`, `detail` (sanitized), `instance`, plus extensions `code`, `traceId` and `errors` for field validation. Do not expose stack traces, provider access tokens, internal SQL or Google session URLs. Framework support: [ASP.NET Core error handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0).

Example `422 Unprocessable Content`:

```json
{
  "type":"https://socialflow.example/problems/validation",
  "title":"Validation failed",
  "status":422,
  "detail":"The request contains invalid fields.",
  "instance":"/api/v1/posts/35f073ad-53f6-4f64-bbeb-1e10f9012001/schedule",
  "code":"VALIDATION_FAILED",
  "traceId":"00-77be72aa3fae4d7b-14ed1f949e220a77-01",
  "errors":{"scheduledAtUtc":["Must be in the future."]}
}
```

`socialflow.example` is an **illustrative placeholder**, not a deployed domain; replace it when implementation has a stable documentation URL.

### Standard endpoint-specific errors

| Group | Validation / expected failure codes |
|---|---|
| Auth | 400 malformed, 401 invalid credentials/session, 403 unconfirmed account when needed, 409 duplicate email (registration policy), 429 login limits, 503 email delivery unavailable |
| Workspace | 400/422 invalid name/timezone, 401/403 unauthorized, 404 nonexistent, 409 policy conflict, 412 version conflict, 428 missing If-Match |
| Media | 400/422 malformed, 403 tenant denial, 404 unseen ID, 413 too large, 415 unsupported media, 409 referenced asset, 503 storage unavailable |
| Posts | 422 invalid fields/provider content, 404 foreign/missing ID, 409 invalid workflow transition, 412 stale version, 428 missing If-Match |
| YouTube OAuth | 400 invalid/consumed state, 401 absent/expired user session, 403 wrong workspace/actor, 409 duplicate connected account, 422 insufficient scope, 502 provider exchange error; callback redirects to safe UI with opaque error code |
| Schedule/publish | 422 unready media/unconnected channel/missing content/past time; 403 missing publisher role; 409 already scheduled or idempotency mismatch; 412/428 revision; 429 quota/rate policy; 503 queue unavailable |
| Retry/cancel | 409 wrong state, `needs_review` unresolved, or in-flight cancellation; 404 tenant isolation; 412/428 revision where specified |
| Analytics | 400 invalid dates, 404 foreign ID, 422 period too broad, 503 integration unavailable; unsupported/not-implemented endpoints are *not mapped* yet |

**Status conventions:** `400` malformed JSON/format; `401` missing auth; `403` denied workspace/role; `404` missing/foreign resource; `409` business/state/idempotency conflict; `412` stale ETag; `413` file too large; `415` unsupported media; `422` valid JSON but invalid business fields; `428` precondition required; `429` rate limited; `500` unexpected internal error; `502/503/504` upstream/service unavailable. `Retry-After` accompanies applicable 429/503 responses.

## 6. Filtering and Next.js screen mapping

| Current UI screen | Planned API resource | Notes |
|---|---|---|
| Landing / Register / Login / Forgot password | `/auth/*` | Existing frontend auth is **UI only**; reset-password route may need adding |
| Dashboard | `/posts` aggregate by **post**, `/publications` by publication, `/social-accounts` | Never display 13 publications as 13 posts; upcoming only scheduled future instants |
| Media | `/media` and `/media/{id}` | Wait for `ready`, disable selection otherwise |
| Posts & post details | `/posts`, `/posts/{id}` | Use derived display status, show nested publication history |
| Create Post wizard | `POST /posts`, `PATCH /posts/{id}`, `/schedule` or `/publish` | One final approval; idempotency required; no fake save success |
| Calendar | `/publications?dateFrom=...&dateTo=...&status=scheduled` or posts projection | Show past history accurately; timezone resolved server-side |
| Social Accounts | `/social-accounts`, YouTube connect/callback/disconnect | MVP only real YouTube, other platforms stay explicitly preview-only |
| Publishing | `/publications`, `/publications/{id}`, retry/cancel | Per-account publication and attempt states |
| Analytics | `/analytics/*` | Deferred; mock stays visibly illustrative until actual source data exists |
| Settings | `/auth/me`, `/workspaces`, `/workspaces/{id}` | Member management deferred |

**API contract integration tests (future):** schema validation, tenant ID swap, no-cookie/invalid-CSRF, two duplicate `Idempotency-Key` calls, If-Match conflicts, valid and invalid workspace timezone, upload size/type, approved vs unapproved schedule, provider revoked, failed/partial/needs_review status, and `Europe/Istanbul` midnight boundary (`2026-10-22T22:30:00Z` → `2026-10-23`).

**No controllers, OpenAPI generator, network requests or API runtime were created during TASK #22.**
