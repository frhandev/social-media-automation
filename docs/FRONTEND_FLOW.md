# Frontend Sitemap & User Flow

## 1. Purpose

This document defines the initial frontend structure, application routes, navigation model, and primary user flows for the AI-Assisted Multi-Platform Social Media Content Management and Automation System.

The frontend will be developed before the backend using mock data and clearly defined data requirements.

The goal is to validate the user experience and application structure before integrating the real ASP.NET Core API.

---

## 2. Frontend Strategy

The project will follow a frontend-first development approach.

Initial development will use:

- Mock data
- Static JSON objects
- Local state where appropriate
- Simulated loading states
- Simulated success and failure states

The frontend should not depend on a working backend during the initial UI development phase.

However, frontend components and pages should be designed with future API integration in mind.

The general development flow will be:

Requirements  
→ User Flow  
→ Routes  
→ UI Components  
→ Mock Data  
→ API Contracts  
→ ASP.NET Core Backend  
→ Real API Integration

---

# 3. Application Areas

The frontend is divided into two main areas:

## 3.1 Public Area

Accessible without authentication.

Initial public routes:

- `/login`
- `/register`

A public landing page may be added later if needed, but it is not part of the initial application MVP.

---

## 3.2 Protected Application Area

Accessible only to authenticated users.

Initial protected routes:

- `/dashboard`
- `/media`
- `/posts`
- `/posts/new`
- `/posts/[id]`
- `/calendar`
- `/social-accounts`
- `/publishing`
- `/analytics`
- `/settings`

---

# 4. Route Definitions

## 4.1 `/login`

Purpose:

Allow existing users to authenticate.

Main interface elements:

- Email field
- Password field
- Login button
- Link to registration
- Validation messages
- Loading state
- Authentication error state

During initial frontend development, login behavior will be simulated.

---

## 4.2 `/register`

Purpose:

Allow a new user to create an account.

Main interface elements:

- Name
- Email
- Password
- Confirm password
- Register button
- Link to login
- Validation messages
- Loading state

Registration will initially use mock behavior.

---

# 5. `/dashboard`

Purpose:

Provide the user with a quick overview of the current workspace and publishing activity.

Possible dashboard information:

- Total posts
- Draft posts
- Scheduled posts
- Published posts
- Failed publications
- Connected social accounts
- Recent publishing activity
- Upcoming scheduled posts

Example dashboard structure:

```text
Dashboard

Overview
────────────────────────

Total Posts        25
Scheduled           5
Published          17
Failed              3


Connected Accounts
────────────────────────

YouTube      Connected
TikTok       Not Connected
Instagram    Connected


Upcoming Posts
────────────────────────

Post A       YouTube       Today 20:00
Post B       Instagram     Tomorrow 17:30


Recent Activity
────────────────────────

YouTube publication succeeded
Instagram publication failed
Post scheduled for tomorrow
```

The dashboard should provide summaries only.

Detailed management should remain in the appropriate pages.

---

# 6. `/media`

Purpose:

Provide a centralized Media Library.

Users should eventually be able to:

- Upload image files
- Upload video files
- Browse uploaded media
- Search media
- Filter media
- Select media when creating posts
- View media metadata
- View processing status

Possible media information:

- File name
- Thumbnail
- Media type
- File size
- Duration
- Resolution
- Upload date
- Processing status

Example statuses:

- UPLOADING
- PROCESSING
- READY
- FAILED

Initial frontend development will use mock media objects.

---

# 7. `/posts`

Purpose:

Display and manage the user's posts.

The page should support displaying posts with states such as:

- Draft
- Ready
- Scheduled
- Queued
- Publishing
- Processing
- Published
- Failed
- Cancelled

Users should eventually be able to:

- View posts
- Search posts
- Filter posts
- Open post details
- Create a new post

Possible filters:

- Status
- Platform
- Date
- Search term

Primary action:

**Create Post**

which navigates to:

`/posts/new`

---

# 8. `/posts/new`

Purpose:

Provide the primary workflow for creating content and preparing it for publication.

This is one of the most important pages in the application.

The frontend workflow should be approximately:

Select Media  
→ Select Platforms  
→ Configure Content  
→ Review  
→ Publish Now or Schedule

---

## 8.1 Step 1 — Select Media

Users select an existing Media Library item or upload new media.

Possible interface elements:

- Media grid
- Selected media preview
- Upload button
- Media information

---

## 8.2 Step 2 — Select Platforms

Users select one or multiple platforms:

- YouTube
- TikTok
- Instagram

Each platform must be visually independent.

For example:

```text
[x] YouTube
[x] TikTok
[ ] Instagram
```

The UI should also indicate whether an account is connected.

Example:

```text
YouTube       Connected
TikTok        Connected
Instagram     Not Connected
```

Platforms without a connected account should not be silently accepted.

---

## 8.3 Step 3 — Platform-Specific Content

Different platforms require different content.

### YouTube

Possible fields:

- Title
- Description
- Tags

### TikTok

Possible fields:

- Hook
- Caption
- Hashtags

### Instagram

Possible fields:

- Caption
- Call to Action
- Hashtags

The frontend should not assume that one caption is suitable for all platforms.

---

## 8.4 AI Assistance

Later, users will be able to request AI-generated suggestions.

The interface may include an action such as:

**Generate with AI**

AI-generated content must populate editable fields.

The user remains responsible for reviewing and approving the generated content before publication.

---

## 8.5 Step 4 — Review

Before publishing, the user should see a summary containing:

- Selected media
- Selected platforms
- Platform-specific content
- Publishing option
- Scheduled time if applicable

The user should be able to return and edit information before confirming.

---

## 8.6 Step 5 — Publishing Option

Users choose between:

### Publish Now

or

### Schedule

When scheduling, users select:

- Date
- Time

Timezone handling will be defined later as part of backend/API design.

---

# 9. `/posts/[id]`

Purpose:

Display detailed information about a specific post.

Possible sections:

## General Information

- Post ID
- Media
- Creation date
- Creator
- Current overall state
- Schedule information

## Platform Publications

Each platform should have independent publishing state.

Example:

```text
YouTube
Status: Published

TikTok
Status: Processing

Instagram
Status: Failed
```

One failed platform must not visually imply that all platform publications failed.

## Publish Attempts

For each platform, the interface may display:

- Attempt number
- Start time
- End time
- Result
- Error message when appropriate

Example:

```text
Instagram

Attempt #1
FAILED

Attempt #2
FAILED

Attempt #3
SUCCESS
```

This page will become particularly important when implementing retries and partial failures.

---

# 10. `/calendar`

Purpose:

Provide a calendar view of scheduled content.

The calendar should allow users to visualize upcoming publications.

Possible views:

- Month
- Week
- Day

Each calendar item may display:

- Post title
- Platform
- Scheduled time
- Status

Example:

```text
15 October

18:00
YouTube
C# Backend Tips

20:00
Instagram
C# Backend Tips
```

Selecting a calendar item should open its associated post.

---

# 11. `/social-accounts`

Purpose:

Allow users to view and manage connected social media accounts.

The initial platforms are:

- YouTube
- TikTok
- Instagram

Example:

```text
YouTube

Channel:
Ferhan Dev

Status:
Connected

[Disconnect]
```

```text
TikTok

Status:
Not Connected

[Connect TikTok]
```

```text
Instagram

Account:
Example Account

Status:
Token Expired

[Reconnect]
```

Possible connection states:

- CONNECTED
- NOT_CONNECTED
- EXPIRED
- ERROR

During frontend development these states will be simulated.

OAuth implementation belongs to the backend integration phase.

---

# 12. `/publishing`

Purpose:

Provide a centralized publishing history.

The page should help users understand what has been published, what is pending, and what failed.

Possible columns:

- Post
- Platform
- Scheduled At
- Published At
- Status
- Attempts

Example:

```text
Post                Platform     Status       Attempts

Backend Tips        YouTube      Published       1
Backend Tips        TikTok       Failed          3
Security Reel       Instagram    Scheduled       0
```

The page should support filters such as:

- Platform
- Status
- Date

A failed publication should link to additional details.

---

# 13. `/analytics`

Purpose:

Display basic performance information retrieved from supported social media platforms.

Possible metrics include:

- Views
- Likes
- Comments
- Shares
- Engagement rate
- Platform comparison

Example dashboard:

```text
Views
125,000

Likes
8,400

Comments
1,250

Engagement Rate
7.3%
```

Possible charts:

- Views over time
- Engagement over time
- Platform comparison
- Top-performing posts

During frontend development, analytics data will be mocked.

The backend will later be responsible for calculating and normalizing metrics.

AI may explain analytics but should not calculate the underlying metrics.

---

# 14. `/settings`

Purpose:

Provide basic account and workspace settings.

Initial sections may include:

## Profile

- Name
- Email

## Workspace

- Workspace name
- Basic workspace information

## Members

Possible future functionality:

- View members
- Invite members
- View role

## Preferences

Examples:

- Default timezone
- Basic application preferences

Settings should remain limited during the first version.

Complex enterprise administration is outside the current scope.

---

# 15. Main Application Navigation

The main authenticated application should use a persistent sidebar.

Initial navigation:

```text
Dashboard

Media

Posts

Calendar

Social Accounts

Publishing

Analytics

────────────

Settings
```

The active page should be visually identifiable.

The layout should also provide access to:

- Current workspace
- User profile
- Logout

---

# 16. Main User Flow

The complete intended user journey is:

```text
Register
   ↓
Login
   ↓
Create Workspace
   ↓
Dashboard
   ↓
Connect Social Account
   ↓
Upload Media
   ↓
Create Post
   ↓
Select Platform(s)
   ↓
Configure Platform-Specific Content
   ↓
Optional AI Assistance
   ↓
Review
   ↓
Publish Now
   OR
Schedule
   ↓
Publishing Process
   ↓
Platform-Specific Status
   ↓
Publishing History
   ↓
Analytics
```

---

# 17. First Frontend MVP Flow

The frontend must not attempt to implement every feature simultaneously.

The first usable frontend flow will focus on:

```text
Login
   ↓
Dashboard
   ↓
Media Library
   ↓
Upload / Select Video
   ↓
Create Post
   ↓
Select YouTube
   ↓
Configure YouTube Content
   ↓
Schedule Publication
   ↓
Publishing Status
```

TikTok, Instagram, AI, and Analytics interfaces can be added after this first vertical frontend workflow is stable.

---

# 18. Workspace Routing Strategy

The initial frontend will use the concept of a:

**Current Workspace**

The workspace identifier will not initially be included in every URL.

For example, prefer:

```text
/posts
/media
/calendar
```

instead of:

```text
/workspaces/{workspaceId}/posts
/workspaces/{workspaceId}/media
/workspaces/{workspaceId}/calendar
```

The current workspace will later be resolved through authenticated application state and backend authorization.

This keeps the initial routing structure simple.

This decision may be revisited before backend integration if multi-workspace navigation requirements indicate that workspace identifiers should become part of the URL.

---

# 19. Initial Mock Data Requirements

During frontend development, mock data should represent realistic backend objects.

Expected frontend mock entities include:

```text
User
Workspace
WorkspaceMember
SocialAccount
MediaAsset
Post
PlatformPublication
PublishAttempt
AnalyticsSummary
```

Mock objects should include realistic identifiers and states so they can later be replaced with API responses without rewriting the UI architecture.

---

# 20. Loading, Empty and Error States

Each major page must eventually account for at least:

### Loading State

Example:

```text
Loading posts...
```

### Empty State

Example:

```text
No posts yet.

Create your first post.
```

### Error State

Example:

```text
Unable to load posts.

Try Again
```

The UI should not be designed only for the successful data state.

This is particularly important for:

- Media uploads
- Social account connections
- Publishing
- Analytics
- Scheduled jobs

---

# 21. Responsive Design

The primary target is a desktop web dashboard.

However, the frontend should remain usable on:

- Desktop
- Laptop
- Tablet
- Mobile browser

This does not mean building a native mobile application.

The native mobile application remains outside the project scope.

---

# 22. Frontend Design Principles

The frontend should follow these principles:

1. Keep primary workflows simple.
2. Avoid unnecessary dashboard complexity.
3. Clearly distinguish platform-specific content.
4. Clearly show publishing status.
5. Display failures without hiding useful error information.
6. Require explicit user confirmation before publishing.
7. Keep AI-generated content editable.
8. Avoid designing UI features that have no planned backend capability.
9. Provide loading, empty, success, and error states.
10. Maintain visual consistency across the application.

---

# 23. Initial Route Map

```text
/
│
├── login
│
├── register
│
└── authenticated application
    │
    ├── dashboard
    │
    ├── media
    │
    ├── posts
    │   │
    │   ├── new
    │   │
    │   └── [id]
    │
    ├── calendar
    │
    ├── social-accounts
    │
    ├── publishing
    │
    ├── analytics
    │
    └── settings
```

---

# 24. Frontend-Backend Boundary

The frontend will be responsible for:

- User interface
- Form interactions
- Client-side interaction state
- Displaying backend data
- Displaying validation results
- Displaying publishing states
- Navigation
- User confirmation workflows

The frontend must not become responsible for critical business rules such as:

- Authorizing workspace access
- Validating resource ownership
- Storing OAuth secrets
- Refreshing social platform tokens securely
- Executing scheduled publications
- Publishing directly to social platforms
- Retry policies
- Duplicate publication prevention
- Calculating authoritative analytics

Those responsibilities belong to the future ASP.NET Core backend.

---

# 25. Definition of the Frontend Foundation

The frontend foundation will be considered correctly designed when:

- Public and protected routes are clearly separated.
- The main navigation is defined.
- The main post creation flow is understandable.
- Platform-specific content is represented separately.
- Publishing statuses are represented independently per platform.
- Mock data can represent the future backend entities.
- Loading, empty, and error states are considered.
- The first frontend MVP is clearly smaller than the final application.
- The design does not require the backend to exist before UI development begins.
- The UI structure can later be connected to ASP.NET Core without redesigning the entire application.