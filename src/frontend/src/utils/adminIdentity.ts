import { Ed25519KeyIdentity } from "@dfinity/identity";

const ADMIN_IDENTITY_KEY = "adminIdentityKey";

/**
 * Returns a persistent Ed25519 identity for the admin session.
 * Creates a new one if none exists in sessionStorage, otherwise
 * restores the previously generated key pair so the principal
 * stays stable across page navigations within the same browser tab.
 */
export function getOrCreateAdminIdentity(): Ed25519KeyIdentity {
  const stored = sessionStorage.getItem(ADMIN_IDENTITY_KEY);
  if (stored) {
    try {
      return Ed25519KeyIdentity.fromJSON(stored);
    } catch {
      // fall through and create a fresh identity
    }
  }
  const identity = Ed25519KeyIdentity.generate();
  sessionStorage.setItem(ADMIN_IDENTITY_KEY, JSON.stringify(identity.toJSON()));
  return identity;
}

/**
 * Removes the stored admin identity and token from sessionStorage.
 * Call this on logout so the next login generates a fresh key pair.
 */
export function clearAdminIdentity(): void {
  sessionStorage.removeItem(ADMIN_IDENTITY_KEY);
  sessionStorage.removeItem("caffeineAdminToken");
}

/**
 * Returns true when an admin identity key pair is present in
 * sessionStorage (i.e., the admin is currently logged in).
 */
export function isAdminIdentityStored(): boolean {
  return sessionStorage.getItem(ADMIN_IDENTITY_KEY) !== null;
}
