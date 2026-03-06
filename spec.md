# Dr. Malay Akechan

## Current State
Full doctor website with public pages (Home, About, Clinics, Services, Social, Footer) and an admin panel at `/admin`. The admin panel uses a complex Ed25519 identity + Caffeine platform token (`caffeineAdminToken`) approach to authenticate with the backend. This breaks because the Caffeine token is unavailable after navigation, resulting in "Admin authentication failed" errors on every content save attempt.

The backend uses an `AccessControl` mixin with principal-based role assignment. Admin functions are guarded by `adminOnly(caller)` which checks the caller's principal role — an approach that requires Internet Identity or Caffeine's token-based registration.

## Requested Changes (Diff)

### Add
- Backend: A hardcoded `ADMIN_SECRET` constant (`"malay:duke46"`) used to gate all admin mutations. Each admin function takes `secret: Text` as its first argument and calls `requireAdmin(secret)` which traps if the secret doesn't match.
- Frontend: A simple `ADMIN_SECRET` constant (`"malay:duke46"`) stored in the frontend. All admin mutation hooks pass this secret as the first argument to every backend call.

### Modify
- Backend `main.mo`: Remove all `AccessControl`/`MixinAuthorization` imports and usage. Replace `adminOnly(caller)` guards with `requireAdmin(secret)` pattern. Add `secret: Text` as first param to all admin mutation functions (`setHeader`, `setAbout`, `setFooter`, `addClinic`, `updateClinic`, `deleteClinic`, `addService`, `updateService`, `deleteService`, `addSocialLink`, `updateSocialLink`, `deleteSocialLink`). Remove `UserProfile`/`userProfiles` since they're unused by the frontend. Remove `saveCallerUserProfile`, `getUserProfile`, `getCallerUserProfile` functions.
- Frontend `useAdminActor.ts`: Completely rewrite — no more Ed25519 identity, no more `_initializeAccessControlWithSecret`, no more admin token lookup. The hook just returns the standard anonymous actor from `useActor` (read-only actor) plus the `ADMIN_SECRET` constant.
- Frontend `useAdminQueries.ts`: All mutation hooks updated to pass `ADMIN_SECRET` as the first argument to each backend call.
- Frontend `AdminDashboard.tsx`: Remove the "Authenticating admin session..." loading state and the actor error banner — they no longer apply. The actor is always available (anonymous).
- Frontend `AdminPage.tsx`: Simplify — remove `getOrCreateAdminIdentity`, `clearAdminIdentity`, QueryClient invalidation for adminActor. Login just sets `localStorage.adminLoggedIn = "true"`, logout removes it.
- Frontend `adminIdentity.ts`: Can be deleted or emptied — no longer needed.

### Remove
- Backend: `AccessControl` and `MixinAuthorization` usage, `UserProfile` type, `userProfiles` map, `saveCallerUserProfile`, `getUserProfile`, `getCallerUserProfile`, `assignCallerUserRole`, `getCallerUserRole`, `isCallerAdmin` functions.
- Frontend: All Ed25519 identity creation/storage logic, all Caffeine admin token lookups, all actor initialization error states in the dashboard.

## Implementation Plan
1. Regenerate backend with simple secret-based auth — each admin function takes `secret: Text` first, checks `secret == ADMIN_SECRET`, traps if not. No AccessControl mixin.
2. Rewrite `useAdminActor.ts` to export just the regular anonymous actor + `ADMIN_SECRET`.
3. Rewrite `useAdminQueries.ts` — pass `ADMIN_SECRET` as first arg to all mutations.
4. Simplify `AdminPage.tsx` and `AdminDashboard.tsx` — remove all identity/token complexity.
5. Validate and deploy.
