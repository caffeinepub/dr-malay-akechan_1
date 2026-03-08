# Dr. Malay Akechan - Admin Panel Rebuild

## Current State

- Full multi-page doctor website with public pages (Home, About, Clinics, Services, Social, Footer)
- Admin panel at `/admin` with username/password login (`malay` / `duke46`)
- Backend uses Caffeine's authorization module (`MixinAuthorization`) with `adminOnly(caller)` checks
- All admin mutations require Caffeine's `_initializeAccessControlWithSecret` + platform token to register the Ed25519 identity as admin
- The platform token is never available in a simple username/password login flow, so every save fails with "Unauthorized"
- Previous attempts to wrap the token flow have all failed because the backend rejects calls from unregistered principals

## Requested Changes (Diff)

### Add
- Backend: new `adminSecret` text field (hardcoded hash of "duke46") stored in actor state
- Backend: new `checkAdminSecret(secret: Text)` query to validate the password
- Backend: all admin mutating functions accept an extra `adminSecret: Text` parameter and check it directly instead of using `adminOnly(caller)`
- Frontend: `useAdminDirectActor` hook — creates a plain anonymous actor (no Ed25519 identity needed)
- Frontend: All admin mutations pass the admin password directly as an argument with each call
- Frontend: Admin session simply stores `adminLoggedIn=true` + the password in sessionStorage for use in mutations

### Modify
- Backend: Remove `adminOnly(caller)` calls from all mutating functions; replace with inline secret check
- Backend: Keep `MixinAuthorization` import for the Caffeine platform (public queries still work), but admin writes go through password check
- Frontend: `useAdminActor.ts` — replace complex Ed25519 + token flow with a simple anonymous actor
- Frontend: `useAdminQueries.ts` — pass admin password to every mutation call
- Frontend: Admin tabs — no change to UI layout/design, only the hook/mutation plumbing changes

### Remove
- Frontend: `adminIdentity.ts` utility (no longer needed)
- Frontend: All `getOrCreateAdminIdentity` / `clearAdminIdentity` usage
- Frontend: `sessionStorage.setItem(ADMIN_REGISTERED_KEY, ...)` flag logic
- Frontend: `getPersistedUrlParameter("caffeineAdminToken")` dependency in admin auth

## Implementation Plan

1. Update `main.mo`: add `adminSecret` constant, add `verifyAdminSecret(secret)` private function that traps on mismatch, update all 10 admin mutating functions to accept `adminSecret: Text` as first parameter and call `verifyAdminSecret`
2. Regenerate `backend.d.ts` to reflect the new function signatures
3. Rewrite `useAdminActor.ts`: return a plain anonymous actor (no identity, no token), expose the stored admin password
4. Rewrite `useAdminQueries.ts`: each mutation reads the stored password and passes it as first arg
5. Update `AdminPage.tsx` / `AdminLogin.tsx`: on login, store password in sessionStorage; on logout, clear it
6. Update all 6 admin tab components to use the updated hooks (no structural change, just re-import)
7. Validate build and deploy
