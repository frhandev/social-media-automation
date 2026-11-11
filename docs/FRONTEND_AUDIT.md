# SocialFlow AI — Frontend Audit (Post-Refinement Review)

**Repository:** `frhandev/social-media-automation`  
**Review date:** 2026-11-11 (Europe/Istanbul)  
**Base branch:** `main` — `1fbf4319f11f0d8fc592ef5351d7ac13d6c9a731`  
**Reviewed branch:** `feature/frontend-refinement` — `7cf1d382a8aef9b3cd9ee9156b4ab6dbdf05e2da`  
**Comparison:** **2 commits ahead, 0 behind** `main` at review time.  
**Source:** [Compare main...feature/frontend-refinement](https://github.com/frhandev/social-media-automation/compare/main...feature/frontend-refinement)  
**Audit scope:** Comparison of the original issues with the updated branch code. This document replaces the initial *pre-fix, read-only inspection* snapshot with a **post-refinement code review**. The repository was inspected without executing the application or modifying GitHub.

## Evidence and status definitions

- **Fixed in code — verification pending:** The corresponding change is present in source, but relevant local commands and/or browser behavior have **not** been verified.
- **Partially fixed in code — verification pending:** Only part of the proposed cleanup is implemented; the residual detail is documented below.
- **Open / deferred:** Still present in source and intentionally not changed during this limited refinement.
- **Observed safeguard — test pending:** Existing protective behavior was found in source. Its runtime behavior remains untested.
- **Not run:** No local or browser test outcome has been supplied or independently observed. Do **not** interpret this as passing.

The review is anchored to commit `7cf1d382a8aef9b3cd9ee9156b4ab6dbdf05e2da`. A subsequent commit (including a documentation-only commit) requires the reviewed-head field to be updated; do not silently reuse the old SHA for a newer revision.

## Findings and resolutions

| ID | Issue / original finding | Severity | Implemented resolution or remaining work | Status |
|---|---|---|---|---|
| FE-01 | Hardcoded Dashboard `metrics` did not match 11 `posts` | High | Added `lib/dashboard.ts#getDashboardMetrics(posts)`; Dashboard and Landing `DashboardPreview` now derive post counts from `posts`, while Dashboard explicitly distinguishes platform publication records | **Fixed in code — verification pending** |
| FE-02 | Independent `upcoming` records used `Today`/`Tomorrow` and stale fixed dates | High | `getUpcomingPosts()` filters `scheduled`/`queued` posts with valid `scheduledAt > now`; Dashboard formats timestamps and renders `No upcoming posts` when empty; route has `force-dynamic` | **Fixed in code — verification pending** |
| FE-03 | Relative 'Recent activity' text was unrelated to publication dates | Medium | `getRecentPublishingActivity()` now derives entries and absolute timestamps from successful/failed publishing records and related posts | **Fixed in code — verification pending** |
| FE-04 | Nested `/posts/new` and `/posts/[id]` did not activate Posts in Sidebar | Medium | `AppSidebar.tsx` uses `pathname === href || pathname.startsWith(href + '/')` and sets `aria-current` | **Fixed in code — manual verification pending** |
| FE-05 | Nonfunctional Switch Workspace dropdown appeared operational | Medium | `AppSidebar.tsx` replaces the dropdown with a read-only current workspace panel labelled `Switching unavailable` | **Fixed in code — verification pending** |
| FE-06 | Topbar Search/Notifications buttons had no behavior; post details title fell back to Dashboard | Medium | Unsupported buttons were removed; `getPageTitle()` handles `/posts/new` and `/posts/…` | **Fixed in code — verification pending** |
| FE-07 | Mobile Sheet did not close when its navigation link was selected | Medium | `SidebarNav` now accepts `onNavigate`; Topbar passes `() => setOpen(false)` to it | **Fixed in code — manual verification pending** |
| FE-08 | File selection appeared to upload, and Retry Processing was inert | High | Active `media-library.tsx` disables Upload and Retry and labels backend dependency; old `UploadArea.tsx` still exists in the repository, but is not used by the revised Media Library | **Fixed in active UI — manual verification pending** |
| FE-09 | Media Library simulated loading/errors via query params and timer | Low | Revised `media-library.tsx` removes `?state=` simulation and timer; retains real filter-derived empty state | **Fixed in code — verification pending** |
| FE-10 | Published `p3` referenced failed media fixture `m3` | Medium | Added ready demo media fixture `m7`, changed `p3.mediaId` to `m7`; retained failed `m3` for testing | **Fixed in code — verification pending** |
| FE-11 | `Attemp.ts` filename typo and imports | Low | File renamed to `Attempt.ts`; `Publication.ts` and `PublishAttempt.ts` imports point to corrected path | **Fixed in code — verification pending** |
| FE-12 | Duplicate inline and shared `Channel` types | Low | `mock-data.ts` now imports `Channel` from `types/Channel.ts` instead of redefining the type | **Fixed in code — verification pending** |
| FE-13 | Mixed Post/Media/Social Account statuses and overlapping lifecycle types | Low | `PostStatus.ts` still includes `connected`/`not_connected`; `PostLifecycle.ts` still includes `ready`/`processing`; `StatusBadge` joins multiple status unions. No broad refactor performed | **Open / deferred** |
| FE-14 | Repeated timezone constants and inconsistent date-key formatting | Medium | `helperFunctions.tsx` and `scheduling.ts` now reuse `CALENDAR_TIME_ZONE`; `dateKey()` explicitly builds `YYYY-MM-DD` from timezone parts. **Remaining:** `lib/publishing.ts` still declares its own `PUBLISHING_TIME_ZONE = "Europe/Istanbul"` and date-key helper | **Partially fixed in code — verification pending** |
| FE-15 | Analytics must exclude unsuccessful platform publications | Informational | `lib/analytics.ts#filterAnalyticsRecords()` requires `publication.status === "published"` and a valid publication timestamp. Preserve this rule | **Observed safeguard — test pending** |
| FE-16 | Wizard must reject unready media and unconnected platforms; publishing must be inert | Informational | Source checks `media.status === "ready"`, `isAccountConnected()` and disables final Publish button | **Observed safeguard — browser test pending** |
| FE-17 | Unknown post ID and missing media need safe fallbacks | Informational | `PostDetails.tsx` has `Post not found` with `Back to posts`, and a missing-media fallback | **Observed safeguard — browser test pending** |

### Residuals / non-blocking follow-up decisions

1. **FE-13:** Do not mark this fixed. Untangle PostLifecycle, MediaStatus, connection status, and shared badge types during a deliberately scoped types cleanup, not as an undocumented change to this branch.
2. **FE-14:** The user-requested timezone normalization is **partial**, not complete. `lib/publishing.ts` retains a literal timezone and its own date-key formatter. This is not itself evidence of an incorrect displayed time, but the duplication remains. Verify midnight-boundary cases before choosing to defer the cleanup.
3. **FE-08:** Legacy `UploadArea.tsx` remains in the branch. Its existence does not prove that active Media Library performs an upload; nevertheless, delete or clearly retire it in a subsequent scoped cleanup once all imports are checked.
4. **Historical publishing statuses:** Some fixture `scheduled`/`queued` timestamps are in the past; `Upcoming` correctly excludes them. Calendar may continue displaying historical recorded schedules. Any future refresh of fixtures should keep Post and Publication state aligned.

## Source data snapshot at reviewed commit

| Data source | Source-backed observation |
|---|---|
| `posts` | 11 unique Post records; draft 1, scheduled 1, queued 1, publishing 1, published 4, failed 1, partial 1, cancelled 1 |
| `publishingRecords` | 13 platform-specific publication records; scheduled 1, queued 1, publishing 1, published 6, failed 3, cancelled 1 |
| `platformAccounts` | 2 connected (`youtube`, `tiktok`), 1 not connected (`instagram`) |
| `p6` | `partial`: YouTube publication succeeded; Instagram publication failed |
| `p3` | `published` and now references ready media fixture `m7` |
| `upcoming` | As of **2026-11-11**, no future scheduled/queued `scheduledAt` exists in current fixtures; the Dashboard should show its empty state |
| Analytics | Illustrative historical daily records, not real social-media performance. With the current fixture dates, **Last 7 Days** on 2026-11-11 is expected to be empty; do not fabricate records merely to fill charts |
| Counts | Post counts and per-platform Publication counts are different measures and must never be treated as interchangeable |

All source observations above are **code-review findings**, not verified browser output.

## Quality gates — NOT RUN

No successful local test output was provided for the reviewed commit. GitHub's connected commit-status query returned **no statuses**, and the commit workflow-run query returned **no PR workflow runs**; absence of results is **not** a passing test.

Run these commands **locally** from `frontend/` and record their real outcomes:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Then, from the repository root:

```bash
git diff --check
git status
```

| Gate | Result | Evidence / executed at |
|---|---|---|
| `npx tsc --noEmit` | **Not run** | To be filled from local output |
| `npm run lint` | **Not run** | To be filled from local output |
| `npm run build` | **Not run** | To be filled from local output |
| `git diff --check` | **Not run** | To be filled from local output |
| Browser console / hydration | **Not run** | To be filled from browser inspection |

Only replace `Not run` with `Passed` or `Failed` when a real test is executed, and record the date, environment, command and any failure output.

## Manual user-flow and regression matrix — NOT RUN

| Test ID | Procedure / reproducible steps | Expected result | Actual result |
|---|---|---|---|
| UF-01 Public | Open `/`, select Get Started, go `/register` → `/login` → `/forgot-password` → `/login` | Links resolve; client-side validation only; no fabricated authentication | **Not run** |
| UF-02 Content | `/dashboard` → `/media` → `/posts/new`; select ready media and connected platform; complete content → Review → Publishing Step | Back/Next navigation works; final Publish disabled; no API calls | **Not run** |
| UF-03 Management | `/posts` → `/posts/p6`; follow links to `/calendar`, `/publishing`, `/analytics` | Post and platform publication states remain consistent | **Not run** |
| UF-04 Nested active nav | Directly open `/posts/new`, then `/posts/p6` | Posts highlighted and `aria-current=page` set in Sidebar | **Not run** |
| UF-05 Mobile Sheet | Use 375px viewport; open menu, choose Posts or Settings | Drawer closes and selected page is displayed | **Not run** |
| UF-06 Workspace | Open Sidebar workspace block | No actionable workspace-switching menu; clear demo-only message | **Not run** |
| UF-07 Media upload/retry | Visit `/media`; open a failed-media details modal | Upload and retry disabled; no 'upload succeeded' or 'processing succeeded' claim | **Not run** |
| UF-08 Upcoming | Visit `/dashboard` with 2026-11-11 reference; separately test a valid future scheduled fixture locally | No stale 'Today' entries; empty state by default; future items sorted | **Not run** |
| UF-09 Unknown/missing data | Visit `/posts/does-not-exist`, select no-result media/post filters | Appropriate fallback and clear/back links | **Not run** |
| UF-10 Wizard validation | Attempt to select failed `m3` and not-connected Instagram; then try ready media / connected platform | Invalid selections blocked; valid route reaches Review | **Not run** |
| UF-11 Analytics | Compare all/YouTube/TikTok/Instagram, 7/30/90 days; check a failed publication | No analytics for failed publication; zero views and null shares handled; historical-data empty states work | **Not run** |
| UF-12 Midnight boundary | Test `2026-10-22T22:30:00Z` in calendar, post-date filter and publishing filter | Date key `2026-10-23` in `Europe/Istanbul`, irrespective of browser device timezone | **Not run** |
| UF-13 Responsive | Check 375px, 768px, 1440px for forms, charts, calendar, tables and modal | No horizontal overflow; usable controls | **Not run** |
| UF-14 A11y | Use Tab, Shift+Tab, Enter, Space; close Radix dialogs with Escape | Keyboard focus visible and dialogs close predictably | **Not run** |

### How to log a genuine failure

Record **test ID**, full route, viewport and browser, steps, expected/actual outcome, console or terminal error, and the resulting follow-up commit. Example structure:

```text
Test ID: UF-05
Environment: [browser/version], 375px
Steps: [exact steps actually followed]
Expected: [expected navigation and Sheet behavior]
Actual: [observed result, not a guess]
Evidence: [console output or screenshot reference]
Status: Failed / Retest pending
```

Do not populate failure logs with imagined bugs or invented screenshots.

## Completion rule / merge gate

**Current decision: NOT READY TO CLAIM VERIFIED.** Most changes are present in source, but the audit is not equivalent to QA sign-off. Keep FE-13 deferred and FE-14 partial until separately resolved or explicitly accepted as follow-up. A clean local TypeScript, lint and build result plus the critical user-flow checks should be entered before declaring TASK #21 complete or merging it.

## Scope boundaries

This refinement does **not** implement real OAuth, authentication, database storage, media upload, automatic publishing, retries, platform analytics APIs, or AI functionality. Screens remain sample-data previews where backend integration is not yet available.
