import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AboutContent,
  Clinic,
  FooterContent,
  HeaderContent,
  Service,
  SocialLink,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Public queries ───────────────────────────────────

export function useGetHeader() {
  const { actor, isFetching } = useActor();
  return useQuery<HeaderContent | null>({
    queryKey: ["header"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeader();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAbout() {
  const { actor, isFetching } = useActor();
  return useQuery<AboutContent | null>({
    queryKey: ["about"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAbout();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClinics() {
  const { actor, isFetching } = useActor();
  return useQuery<Clinic[]>({
    queryKey: ["clinics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClinics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllClinics() {
  const { actor, isFetching } = useActor();
  return useQuery<Clinic[]>({
    queryKey: ["allClinics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClinics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSocialLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialLink[]>({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSocialLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFooter() {
  const { actor, isFetching } = useActor();
  return useQuery<FooterContent | null>({
    queryKey: ["footer"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFooter();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Admin mutations ───────────────────────────────────

export function useSetHeader() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (header: HeaderContent) => {
      if (!actor) throw new Error("No actor");
      return actor.setHeader(header);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["header"] }),
  });
}

export function useSetAbout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (about: AboutContent) => {
      if (!actor) throw new Error("No actor");
      return actor.setAbout(about);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["about"] }),
  });
}

export function useSetFooter() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (footer: FooterContent) => {
      if (!actor) throw new Error("No actor");
      return actor.setFooter(footer);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["footer"] }),
  });
}

export function useAddClinic() {
  const { actor } = useActor();
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
      if (!actor) throw new Error("No actor");
      return actor.addClinic(
        data.name,
        data.address,
        data.phone,
        data.hours,
        data.mapsUrl,
        data.bookingUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clinics"] }),
  });
}

export function useUpdateClinic() {
  const { actor } = useActor();
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
      if (!actor) throw new Error("No actor");
      return actor.updateClinic(
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clinics"] }),
  });
}

export function useDeleteClinic() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteClinic(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clinics"] }),
  });
}

export function useAddService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addService(data.title, data.description, data.iconName);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateService(
        data.id,
        data.title,
        data.description,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAddSocialLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addSocialLink(data.platform, data.url, data.iconName);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useUpdateSocialLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateSocialLink(
        data.id,
        data.platform,
        data.url,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useDeleteSocialLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSocialLink(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}
