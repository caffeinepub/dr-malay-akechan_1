import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration after upgrade
(with migration = Migration.run)
actor {
  // Constants
  let ADMIN_PASSWORD : Text = "duke46";

  // Persistent Types
  public type HeaderContent = {
    heroText : Text;
    subText : Text;
    imageUrl : Text;
  };

  public type AboutContent = {
    bio : Text;
    photoUrl : Text;
    qualifications : Text;
    experience : Text;
  };

  public type Clinic = {
    id : Nat;
    name : Text;
    address : Text;
    phone : Text;
    hours : Text;
    mapsUrl : Text;
    bookingUrl : Text;
    isVisible : Bool;
  };

  public type Service = {
    id : Nat;
    title : Text;
    description : Text;
    iconName : Text;
  };

  public type SocialLink = {
    id : Nat;
    platform : Text;
    url : Text;
    iconName : Text;
  };

  public type FooterContent = {
    contactEmail : Text;
    contactPhone : Text;
    address : Text;
    copyright : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // State Declarations
  let clinics = Map.empty<Nat, Clinic>();
  let services = Map.empty<Nat, Service>();
  let socialLinks = Map.empty<Nat, SocialLink>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var headerContent : ?HeaderContent = null;
  var aboutContent : ?AboutContent = null;
  var footerContent : ?FooterContent = null;
  var nextClinicId = 1;
  var nextServiceId = 1;
  var nextSocialLinkId = 1;

  // Access Control Integration (needed for Caffeine compatibility)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ==================
  // Helper Functions
  // ==================

  func requireAdmin(secret : Text) {
    if (secret != ADMIN_PASSWORD) {
      Runtime.trap("Unauthorized: Invalid admin password");
    };
  };

  // ==================
  // Public Queries (No Auth)
  // ==================

  public query func getHeader() : async ?HeaderContent {
    headerContent;
  };

  public query func getAbout() : async ?AboutContent {
    aboutContent;
  };

  public query func getClinics() : async [Clinic] {
    let all = clinics.values().toArray();
    let visible = all.filter(func(c) { c.isVisible });
    visible;
  };

  public query func getServices() : async [Service] {
    services.values().toArray();
  };

  public query func getSocialLinks() : async [SocialLink] {
    socialLinks.values().toArray();
  };

  public query func getFooter() : async ?FooterContent {
    footerContent;
  };

  public query func verifyAdminPassword(secret : Text) : async Bool {
    secret == ADMIN_PASSWORD;
  };

  // ==================
  // Admin Query Functions
  // ==================

  public query func getAllClinics(adminSecret : Text) : async [Clinic] {
    requireAdmin(adminSecret);
    clinics.values().toArray();
  };

  // ===============
  // Admin Functions (All require adminSecret as FIRST param)
  // ===============

  public shared ({ caller }) func setHeader(adminSecret : Text, header : HeaderContent) : async () {
    requireAdmin(adminSecret);
    headerContent := ?header;
  };

  public shared ({ caller }) func setAbout(adminSecret : Text, about : AboutContent) : async () {
    requireAdmin(adminSecret);
    aboutContent := ?about;
  };

  public shared ({ caller }) func setFooter(adminSecret : Text, footer : FooterContent) : async () {
    requireAdmin(adminSecret);
    footerContent := ?footer;
  };

  public shared ({ caller }) func addClinic(
    adminSecret : Text,
    name : Text,
    address : Text,
    phone : Text,
    hours : Text,
    mapsUrl : Text,
    bookingUrl : Text,
  ) : async Nat {
    requireAdmin(adminSecret);
    let id = nextClinicId;
    let clinic : Clinic = {
      id;
      name;
      address;
      phone;
      hours;
      mapsUrl;
      bookingUrl;
      isVisible = true;
    };
    clinics.add(id, clinic);
    nextClinicId += 1;
    id;
  };

  public shared ({ caller }) func updateClinic(
    adminSecret : Text,
    id : Nat,
    name : Text,
    address : Text,
    phone : Text,
    hours : Text,
    mapsUrl : Text,
    bookingUrl : Text,
    isVisible : Bool,
  ) : async Bool {
    requireAdmin(adminSecret);
    switch (clinics.get(id)) {
      case (null) { false };
      case (_) {
        clinics.add(
          id,
          {
            id;
            name;
            address;
            phone;
            hours;
            mapsUrl;
            bookingUrl;
            isVisible;
          },
        );
        true;
      };
    };
  };

  public shared ({ caller }) func deleteClinic(adminSecret : Text, id : Nat) : async Bool {
    requireAdmin(adminSecret);
    let existed = clinics.containsKey(id);
    clinics.remove(id);
    existed;
  };

  public shared ({ caller }) func addService(adminSecret : Text, title : Text, description : Text, iconName : Text) : async Nat {
    requireAdmin(adminSecret);
    let id = nextServiceId;
    services.add(id, { id; title; description; iconName });
    nextServiceId += 1;
    id;
  };

  public shared ({ caller }) func updateService(adminSecret : Text, id : Nat, title : Text, description : Text, iconName : Text) : async Bool {
    requireAdmin(adminSecret);
    switch (services.get(id)) {
      case (null) { false };
      case (_) {
        services.add(id, { id; title; description; iconName });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteService(adminSecret : Text, id : Nat) : async Bool {
    requireAdmin(adminSecret);
    let existed = services.containsKey(id);
    services.remove(id);
    existed;
  };

  public shared ({ caller }) func addSocialLink(adminSecret : Text, platform : Text, url : Text, iconName : Text) : async Nat {
    requireAdmin(adminSecret);
    let id = nextSocialLinkId;
    socialLinks.add(id, { id; platform; url; iconName });
    nextSocialLinkId += 1;
    id;
  };

  public shared ({ caller }) func updateSocialLink(adminSecret : Text, id : Nat, platform : Text, url : Text, iconName : Text) : async Bool {
    requireAdmin(adminSecret);
    switch (socialLinks.get(id)) {
      case (null) { false };
      case (_) {
        socialLinks.add(id, { id; platform; url; iconName });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSocialLink(adminSecret : Text, id : Nat) : async Bool {
    requireAdmin(adminSecret);
    let existed = socialLinks.containsKey(id);
    socialLinks.remove(id);
    existed;
  };

  // ==================
  // User-specific Functions (keep for Caffeine)
  // ==================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    getUserProfileInternal(caller, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    getUserProfileInternal(caller, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userOnly(caller);
    userProfiles.add(caller, profile);
  };

  // ==================
  // Internal Checks (keep for Caffeine)
  // ==================
  func adminOnly(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func userOnly(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func getUserProfileInternal(requestor : Principal, user : Principal) : ?UserProfile {
    if (requestor != user and not AccessControl.isAdmin(accessControlState, requestor)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };
};
