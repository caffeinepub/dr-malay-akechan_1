import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
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

  // Access Control Integration
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  // Data Queries
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

  public query func getAllClinics() : async [Clinic] {
    clinics.values().toArray();
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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    getUserProfileInternal(caller, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    getUserProfileInternal(caller, user);
  };

  // Admin Functions
  public shared ({ caller }) func setHeader(header : HeaderContent) : async () {
    adminOnly(caller);
    headerContent := ?header;
  };

  public shared ({ caller }) func setAbout(about : AboutContent) : async () {
    adminOnly(caller);
    aboutContent := ?about;
  };

  public shared ({ caller }) func setFooter(footer : FooterContent) : async () {
    adminOnly(caller);
    footerContent := ?footer;
  };

  public shared ({ caller }) func addClinic(
    name : Text,
    address : Text,
    phone : Text,
    hours : Text,
    mapsUrl : Text,
    bookingUrl : Text,
  ) : async Nat {
    adminOnly(caller);
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
    id : Nat,
    name : Text,
    address : Text,
    phone : Text,
    hours : Text,
    mapsUrl : Text,
    bookingUrl : Text,
    isVisible : Bool,
  ) : async Bool {
    adminOnly(caller);
    switch (clinics.get(id)) {
      case (null) { false };
      case (_) {
        clinics.add(id, {
          id;
          name;
          address;
          phone;
          hours;
          mapsUrl;
          bookingUrl;
          isVisible;
        });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteClinic(id : Nat) : async Bool {
    adminOnly(caller);
    let existed = clinics.containsKey(id);
    clinics.remove(id);
    existed;
  };

  public shared ({ caller }) func addService(title : Text, description : Text, iconName : Text) : async Nat {
    adminOnly(caller);
    let id = nextServiceId;
    services.add(id, { id; title; description; iconName });
    nextServiceId += 1;
    id;
  };

  public shared ({ caller }) func updateService(id : Nat, title : Text, description : Text, iconName : Text) : async Bool {
    adminOnly(caller);
    switch (services.get(id)) {
      case (null) { false };
      case (_) {
        services.add(id, { id; title; description; iconName });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteService(id : Nat) : async Bool {
    adminOnly(caller);
    let existed = services.containsKey(id);
    services.remove(id);
    existed;
  };

  public shared ({ caller }) func addSocialLink(platform : Text, url : Text, iconName : Text) : async Nat {
    adminOnly(caller);
    let id = nextSocialLinkId;
    socialLinks.add(id, { id; platform; url; iconName });
    nextSocialLinkId += 1;
    id;
  };

  public shared ({ caller }) func updateSocialLink(id : Nat, platform : Text, url : Text, iconName : Text) : async Bool {
    adminOnly(caller);
    switch (socialLinks.get(id)) {
      case (null) { false };
      case (_) {
        socialLinks.add(id, { id; platform; url; iconName });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteSocialLink(id : Nat) : async Bool {
    adminOnly(caller);
    let existed = socialLinks.containsKey(id);
    socialLinks.remove(id);
    existed;
  };

  // User-specific Functions
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userOnly(caller);
    userProfiles.add(caller, profile);
  };

  // Internal Checks
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

  // TODO for future work:
  // - Implement additional features such as file upload support (for PDFs/images) if needed.
};
