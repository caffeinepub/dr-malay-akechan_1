/**
 * useAdminActor — creates an actor authenticated with a stable Ed25519
 * identity when the admin is logged in via the simple username/password flow.
 *
 * Authentication flow:
 * 1. Get or create a stable Ed25519 identity (stored in sessionStorage)
 * 2. Create an actor with that identity
 * 3. Try _initializeAccessControlWithSecret with the Caffeine platform token
 *    (from URL or sessionStorage). This registers the identity as admin.
 * 4. If token not available, return actor anyway — saves will fail gracefully
 *    but we won't block the UI with an auth error banner.
 *
 * NOTE: _initializeAccessControlWithSecret is in the backend but not in the
 * generated backend.d.ts, so we access it via type casting.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createActorWithConfig } from "../config";
import { getOrCreateAdminIdentity } from "../utils/adminIdentity";
import { getPersistedUrlParameter } from "../utils/urlParams";

const ADMIN_ACTOR_QUERY_KEY = "adminActor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = any;

export function useAdminActor() {
  const queryClient = useQueryClient();

  const adminLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("adminLoggedIn") === "true";

  const actorQuery = useQuery<AnyActor>({
    queryKey: [ADMIN_ACTOR_QUERY_KEY, adminLoggedIn ? "admin" : "guest"],
    queryFn: async () => {
      if (!adminLoggedIn) return null;

      // Use a persistent Ed25519 identity so the same principal is used across
      // re-renders and the backend keeps it registered as admin.
      const adminIdentity = getOrCreateAdminIdentity();
      const actor = await createActorWithConfig({
        agentOptions: { identity: adminIdentity },
      });

      // Try to get the Caffeine platform token from URL or sessionStorage.
      // getPersistedUrlParameter checks URL query/hash first, then sessionStorage,
      // and stores the value in sessionStorage when found in the URL.
      const adminToken = getPersistedUrlParameter("caffeineAdminToken");

      if (adminToken) {
        try {
          // Register this identity as admin with the platform token.
          // This is idempotent — calling it again for an already-registered
          // principal is a no-op in the backend.
          await actor._initializeAccessControlWithSecret(adminToken);
        } catch (err) {
          // Registration failed — could be wrong token or already registered.
          // Continue anyway; we'll verify below.
          console.warn(
            "[useAdminActor] _initializeAccessControlWithSecret failed:",
            err,
          );
        }

        try {
          const isAdmin = await actor.isCallerAdmin();
          if (isAdmin) return actor;
        } catch (err) {
          // isCallerAdmin can throw if the user was never registered in the
          // access control map (Runtime.trap in Motoko). Treat as not-admin.
          console.warn("[useAdminActor] isCallerAdmin check failed:", err);
        }
      }

      // Return the actor regardless — the UI should not block with an auth
      // error. If saves fail, they'll show their own error toasts.
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: adminLoggedIn,
    retry: 2,
  });

  // When the actor is ready, refresh dependent data queries once
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes(ADMIN_ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
    isError: actorQuery.isError,
    isReady: !!actorQuery.data && !actorQuery.isFetching,
    error: actorQuery.error,
  };
}
