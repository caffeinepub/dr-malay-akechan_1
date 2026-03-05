/**
 * useAdminActor — creates an actor authenticated with a stable Ed25519
 * identity when the admin is logged in via the simple username/password flow.
 *
 * This is intentionally separate from useActor (which is read-only) so that
 * admin mutations can use a non-anonymous identity that the backend will accept
 * after _initializeAccessControlWithSecret registers it as the admin principal.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { getOrCreateAdminIdentity } from "../utils/adminIdentity";
import { getPersistedUrlParameter } from "../utils/urlParams";

const ADMIN_ACTOR_QUERY_KEY = "adminActor";

export function useAdminActor() {
  const queryClient = useQueryClient();

  const adminLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("adminLoggedIn") === "true";

  const actorQuery = useQuery<backendInterface | null>({
    queryKey: [ADMIN_ACTOR_QUERY_KEY, adminLoggedIn ? "admin" : "guest"],
    queryFn: async () => {
      if (!adminLoggedIn) return null;

      // Use a persistent Ed25519 identity so the same principal is used across
      // re-renders and the backend keeps it registered as admin.
      const adminIdentity = getOrCreateAdminIdentity();
      const actor = await createActorWithConfig({
        agentOptions: { identity: adminIdentity },
      });

      // Check if this principal is already registered as admin (e.g., same
      // session after a page navigation — the backend already knows us).
      const alreadyAdmin = await actor.isCallerAdmin();
      if (alreadyAdmin) return actor;

      // Try to initialize with the Caffeine admin token.
      // getPersistedUrlParameter checks both the URL query/hash AND
      // sessionStorage, so it survives page navigations within the session.
      const adminToken = getPersistedUrlParameter("caffeineAdminToken");
      if (!adminToken) {
        throw new Error(
          "Admin token not available. Please access the admin panel via the Caffeine dashboard link.",
        );
      }

      await actor._initializeAccessControlWithSecret(adminToken);

      // Verify the registration succeeded.
      const isAdmin = await actor.isCallerAdmin();
      if (!isAdmin) {
        throw new Error(
          "Failed to authenticate as admin. Please refresh the page and try again.",
        );
      }

      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: adminLoggedIn,
    retry: 1,
  });

  // When the actor changes, invalidate dependent data queries
  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ADMIN_ACTOR_QUERY_KEY);
        },
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
    isError: actorQuery.isError,
    error: actorQuery.error,
  };
}
