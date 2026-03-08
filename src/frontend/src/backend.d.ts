import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Clinic {
    id: bigint;
    hours: string;
    mapsUrl: string;
    name: string;
    address: string;
    isVisible: boolean;
    phone: string;
    bookingUrl: string;
}
export interface HeaderContent {
    subText: string;
    heroText: string;
    imageUrl: string;
}
export interface FooterContent {
    address: string;
    contactEmail: string;
    copyright: string;
    contactPhone: string;
}
export interface AboutContent {
    bio: string;
    photoUrl: string;
    qualifications: string;
    experience: string;
}
export interface SocialLink {
    id: bigint;
    url: string;
    platform: string;
    iconName: string;
}
export interface Service {
    id: bigint;
    title: string;
    description: string;
    iconName: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClinic(adminSecret: string, name: string, address: string, phone: string, hours: string, mapsUrl: string, bookingUrl: string): Promise<bigint>;
    addService(adminSecret: string, title: string, description: string, iconName: string): Promise<bigint>;
    addSocialLink(adminSecret: string, platform: string, url: string, iconName: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteClinic(adminSecret: string, id: bigint): Promise<boolean>;
    deleteService(adminSecret: string, id: bigint): Promise<boolean>;
    deleteSocialLink(adminSecret: string, id: bigint): Promise<boolean>;
    getAbout(): Promise<AboutContent | null>;
    getAllClinics(adminSecret: string): Promise<Array<Clinic>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClinics(): Promise<Array<Clinic>>;
    getFooter(): Promise<FooterContent | null>;
    getHeader(): Promise<HeaderContent | null>;
    getServices(): Promise<Array<Service>>;
    getSocialLinks(): Promise<Array<SocialLink>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAbout(adminSecret: string, about: AboutContent): Promise<void>;
    setFooter(adminSecret: string, footer: FooterContent): Promise<void>;
    setHeader(adminSecret: string, header: HeaderContent): Promise<void>;
    updateClinic(adminSecret: string, id: bigint, name: string, address: string, phone: string, hours: string, mapsUrl: string, bookingUrl: string, isVisible: boolean): Promise<boolean>;
    updateService(adminSecret: string, id: bigint, title: string, description: string, iconName: string): Promise<boolean>;
    updateSocialLink(adminSecret: string, id: bigint, platform: string, url: string, iconName: string): Promise<boolean>;
    verifyAdminPassword(secret: string): Promise<boolean>;
}
