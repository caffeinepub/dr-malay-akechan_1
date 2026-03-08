/**
 * Admin-specific mutations that pass adminPassword as the FIRST argument
 * to every backend function. The backend validates the password server-side.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AboutContent, FooterContent, HeaderContent } from "../backend.d";
import { useAdminActor } from "./useAdminActor";

// ── Header ─────────────────────────────────────────────

export function useAdminSetHeader() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (header: HeaderContent) => {
      if (!actor) throw new Error("Not connected");
      return await actor.setHeader(adminPassword, header);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["header"] }),
  });
}

// ── About ──────────────────────────────────────────────

export function useAdminSetAbout() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (about: AboutContent) => {
      if (!actor) throw new Error("Not connected");
      return await actor.setAbout(adminPassword, about);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["about"] }),
  });
}

// ── Footer ─────────────────────────────────────────────

export function useAdminSetFooter() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (footer: FooterContent) => {
      if (!actor) throw new Error("Not connected");
      return await actor.setFooter(adminPassword, footer);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["footer"] }),
  });
}

// ── Clinics ────────────────────────────────────────────

export function useAdminAddClinic() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      phone: string;
      hours: string;
      mapsUrl: string;
      bookingUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.addClinic(
        adminPassword,
        data.name,
        data.address,
        data.phone,
        data.hours,
        data.mapsUrl,
        data.bookingUrl,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

export function useAdminUpdateClinic() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      address: string;
      phone: string;
      hours: string;
      mapsUrl: string;
      bookingUrl: string;
      isVisible: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.updateClinic(
        adminPassword,
        data.id,
        data.name,
        data.address,
        data.phone,
        data.hours,
        data.mapsUrl,
        data.bookingUrl,
        data.isVisible,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

export function useAdminDeleteClinic() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return await actor.deleteClinic(adminPassword, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

// ── Services ───────────────────────────────────────────

export function useAdminAddService() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.addService(
        adminPassword,
        data.title,
        data.description,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAdminUpdateService() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.updateService(
        adminPassword,
        data.id,
        data.title,
        data.description,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAdminDeleteService() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return await actor.deleteService(adminPassword, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

// ── Social Links ───────────────────────────────────────

export function useAdminAddSocialLink() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.addSocialLink(
        adminPassword,
        data.platform,
        data.url,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAdminUpdateSocialLink() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return await actor.updateSocialLink(
        adminPassword,
        data.id,
        data.platform,
        data.url,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAdminDeleteSocialLink() {
  const { actor, adminPassword } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return await actor.deleteSocialLink(adminPassword, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}
