/**
 * useAdminActor — simple hook that returns the plain anonymous actor
 * plus the adminPassword stored in sessionStorage after login.
 *
 * The new backend uses password-based auth: every admin mutation receives
 * adminPassword as its FIRST argument. No Ed25519 identity needed.
 */
import { useActor } from "./useActor";

export function useAdminActor() {
  const { actor, isFetching } = useActor();
  const adminPassword =
    typeof window !== "undefined"
      ? (sessionStorage.getItem("adminPassword") ?? "")
      : "";

  return {
    actor,
    adminPassword,
    isFetching,
    isReady: !!actor && !isFetching,
  };
}
