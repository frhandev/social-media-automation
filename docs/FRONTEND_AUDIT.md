# SocialFlow AI — Frontend Audit

**Reviewed repository:** `frhandev/social-media-automation`  
**Reviewed ref:** `main` (`1fbf4319f11f`, as observed on 2026-11-11)  
**Refinement branch:** `feature/frontend-refinement` (same SHA when inspected)  
**Audit date:** 2026-11-11  
**Scope:** Read-only source inspection of Frontend modules; no edits were made to GitHub.  
**Verification:** Browser walkthroughs, TypeScript, ESLint and production build are **not run**. No issue is labelled `Fixed` until code changes and verification are completed.

## Findings and resolutions

| ID | Issue / Evidence | Severity | Proposed resolution | Status |
|---|---|---|---|---|
| FE-01 | `lib/mock-data.ts` exports hardcoded Dashboard `metrics` (25 total), but `posts` contains 11 posts; `dashboard/page.tsx` and `Landing/DashboardPreview.tsx` consume the hardcoded values | High | Derive *post* metrics from `posts`, with explicit status scopes; distinguish from counts of 13 *platform publications* | Open — source confirmed |
| FE-02 | `mock-data.ts` `upcoming` is a separate list with `Today`, `Tomorrow` and stale October dates, unrelated to actual posts | High | Derive future scheduled/queued posts from `posts`, filter `scheduledAt > now`, format explicitly in `Europe/Istanbul` and display an empty state when none exist | Open — source confirmed |
| FE-03 | Dashboard `activity` describes actions as '12 min ago', '1 h ago', etc., independently of dated publishing records | Medium | Use a publication-backed recent history with absolute timestamps, or identify the panel as illustrative mock activity and remove misleading relative time wording | Open — source confirmed |
| FE-04 | `AppSidebar.tsx` matches nav paths with equality only; `/posts/new` and `/posts/[id]` do not highlight Posts | Medium | Match exact segment boundaries: `pathname === to || pathname.startsWith(to + '/')` | Open — source confirmed |
| FE-05 | `AppSidebar.tsx` workspace dropdown shows selectable workspaces but has no switching behavior | Medium | Replace with read-only current workspace preview or disabled switching controls | Open — source confirmed |
| FE-06 | `Topbar.tsx` displays functional-looking Search and Notifications buttons without connected handlers; post details fallback title is Dashboard | Medium | Disable/remove unsupported controls; add nested-route title handling | Open — source confirmed |
| FE-07 | `Topbar.tsx` does not close mobile `Sheet` when a Sidebar link is clicked | Medium | Pass an `onNavigate` callback to `SidebarNav` and close Sheet on navigation | Open — source confirmed |
| FE-08 | `Media/media-library.tsx` and `Media/UploadArea.tsx` allow choosing files and dismiss the upload dialog without persisting media; retry processing is an inert button | High | Disable upload/retry with explicit backend-required language; do not call mock `onDone` or imply success | Open — source confirmed |
| FE-09 | Media Library exposes query-string-based fake loading/error/empty states (`?state=` and a timer) | Low | Remove artificial loading/error simulation from default functionality; keep genuine filter-derived empty state | Open — source confirmed |
| FE-10 | Published post `p3` refers to failed media `m3`, while failed-media sample is needed for Media UI | Medium | Add a distinct ready demo asset for `p3`, retain `m3` as failed fixture, and update `p3.mediaId` | Open — source confirmed |
| FE-11 | `types/post/Attemp.ts` filename is misspelled; `types/post/Publication.ts` and `types/publishing/PublishAttempt.ts` import it | Low | Rename to `Attempt.ts` and update all repository imports after searching for other consumers | Open — source confirmed |
| FE-12 | `Channel` is defined both in `types/Channel.ts` and inline in `lib/mock-data.ts` | Low | Import and re-export canonical `Channel` type from `types/Channel.ts` (or remove obsolete projection if unused) | Open — source confirmed |
| FE-13 | Post statuses, account connection statuses, and media statuses are mixed in `types/post/PostStatus.ts`/`StatusBadge.tsx` | Low | Remove truly redundant types only after repo-wide usage search. Avoid large lifecycle refactors | Open — review required |
| FE-14 | `lib/scheduling.ts`, `lib/publishing.ts`, `lib/calendar.ts`, `lib/helperFunctions.tsx` repeat the literal `Europe/Istanbul`; Posts date filter uses `en-CA` locale output | Medium | Reuse `CALENDAR_TIME_ZONE`; use explicit timezone parts/`istanbulDateKey` for canonical `YYYY-MM-DD` keys | Open — source confirmed |
| FE-15 | `analytics.ts` filters to `publication.status === 'published'`, requires publication timestamp, and groups by `publicationId` | Informational | Preserve filtering; test that failed/queued/scheduled publication IDs produce no analytics | Observed in source — tests pending |
| FE-16 | `CreatePostWizard.tsx` checks ready media and connected account status, and disables final publishing action | Informational | Preserve existing safeguards; test workflow across all five steps | Observed in source — browser test pending |
| FE-17 | `/posts/[id]` has a 'Post not found' state and Media missing fallback | Informational | Preserve current fallbacks; test direct invalid routes, failed media, and keyboard navigation | Observed in source — browser test pending |

## Source data snapshot

- `posts`: **11 unique posts** (not 25).
- `publishingRecords`: **13 platform-level publication records** (not 13 posts).
- Post statuses: draft 1, scheduled 1, queued 1, publishing 1, published 4, failed 1, partial 1, cancelled 1.
- Platform publication statuses: scheduled 1, queued 1, publishing 1, published 6, failed 3, cancelled 1.
- At audit date (2026-11-11), the existing `posts` data has **no future `scheduledAt`**. A correct Upcoming panel would therefore show an empty state unless fixture dates are intentionally revised.
- `p6` legitimately has a published YouTube publication and a failed Instagram publication, with overall `partial` status.
- Current Analytics fixtures are historical. An empty Last 7 Days view on 2026-11-11 is expected unless genuinely new mock records are added.

## User-flow test matrix — NOT YET EXECUTED

| Flow | Expected route sequence and behavior | Status |
|---|---|---|
| Public | `/` → `/register` → `/login` → `/forgot-password` → `/login` | Not run |
| Content | `/dashboard` → `/media` → `/posts/new` → Review → Publishing step; final publish disabled | Not run |
| Management | `/posts` → `/posts/p6` → `/calendar` → `/publishing` → `/analytics` | Not run |
| Navigation | `/posts/new` and `/posts/p6` highlight Posts, mobile Sheet closes on link | Not run |
| Unknown post | `/posts/not-found` renders an appropriate empty/error state | Not run |
| Data boundaries | Select `m3` (failed) and Instagram (not connected) in wizard | Not run |
| Date boundary | `2026-10-22T22:30:00Z` should map to `2026-10-23` in Istanbul | Not run |
| Analytics | Failed publication is excluded; 7/30/90 days filter; `shares: null` is not a measured zero | Not run |
| Responsive | 375px, 768px, 1440px: calendar, charts, table, forms, navigation | Not run |
| Accessibility | Tab/Shift+Tab/Enter/Space, focus styles, Escape closes Radix dialogs | Not run |

## Quality gate — NOT YET EXECUTED

From `frontend`:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

From repository root:

```bash
git diff --check
git status
```

All failed checks and screenshots of actual regressions should be logged here with paths and reproduction steps. After fixes and manual/browser tests, change each verified row from `Open` to `Fixed — verified`, include the commit SHA, and record the test outcome. Do **not** mark issues fixed based solely on proposed code.

## Out of scope

No API calls, actual OAuth, JWT, cookies/sessions, database persistence, actual upload, real publishing/retry, fabricated loading timers, or automation of social network accounts should be implemented in this Frontend refinement task.
