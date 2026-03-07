# Dr. Malay Akechan

## Current State
- Full-stack doctor website with public pages (Home, About, Clinics, Services, Social, Footer) and an admin panel at `/admin`
- Admin login uses simple username/password check (`malay` / `duke46`)
- After login, `useAdminActor` creates an Ed25519 identity and calls `_initializeAccessControlWithSecret` with a Caffeine platform token to register as admin
- All admin mutations (setHeader, setAbout, addClinic, etc.) go through `useAdminActor` which returns the authenticated actor
- Content saving is failing — actor is returned but mutations are rejected by backend as "Unauthorized"
- Image fields in Header (heroText imageUrl) and About (photoUrl) use plain URL text inputs only
- Admin dashboard tabs are partially hidden on small screens (labels truncated to 3 chars)

## Requested Changes (Diff)

### Add
- File upload buttons in AdminHeaderTab for the hero/background image field
- File upload buttons in AdminAboutTab for the doctor photo field
- Remove/clear image button next to each image field in Header and About tabs
- Image preview after upload in both tabs
- Base64 data URL encoding for uploaded images (stored as imageUrl / photoUrl in backend)
- Mobile-responsive layout for AdminDashboard: full tab labels on mobile with scrollable tab list, stack layout for header row

### Modify
- AdminHeaderTab: replace URL-only input with upload + URL input combo; add clear/remove image button
- AdminAboutTab: replace URL-only input with upload + URL input combo; add clear/remove image button
- AdminDashboard: make tab list horizontally scrollable on mobile, show full tab labels at all sizes, improve header row stacking on small screens
- Fix admin content saving: ensure `useAdminActor` properly waits for actor initialization before mutations are fired; add retry/re-init logic if actor is ready but save fails with Unauthorized

### Remove
- Nothing removed

## Implementation Plan
1. **AdminHeaderTab** — add a hidden file input triggered by an "Upload Image" button; on file select, convert to base64 data URL and set as `imageUrl`; show image preview; add "Remove" button that clears `imageUrl`; keep URL text input as fallback
2. **AdminAboutTab** — same image upload/remove pattern for `photoUrl` (doctor photo)
3. **AdminDashboard** — make TabsList use `overflow-x-auto flex-nowrap` on mobile; remove truncated label logic (always show full label); improve header row with `flex-col sm:flex-row` 
4. **useAdminActor** — improve initialization: after getting the actor, verify admin status and if not admin, attempt re-initialization; log clearer errors; ensure mutations wait for actor to be fully ready
5. **useAdminQueries** — wrap each mutation with better error handling; if actor is present but save fails, invalidate adminActor cache and retry once
