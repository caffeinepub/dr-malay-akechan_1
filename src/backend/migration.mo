import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type HeaderContent = {
    heroText : Text;
    subText : Text;
    imageUrl : Text;
  };

  type AboutContent = {
    bio : Text;
    photoUrl : Text;
    qualifications : Text;
    experience : Text;
  };

  type Clinic = {
    id : Nat;
    name : Text;
    address : Text;
    phone : Text;
    hours : Text;
    mapsUrl : Text;
    bookingUrl : Text;
    isVisible : Bool;
  };

  type Service = {
    id : Nat;
    title : Text;
    description : Text;
    iconName : Text;
  };

  type SocialLink = {
    id : Nat;
    platform : Text;
    url : Text;
    iconName : Text;
  };

  type FooterContent = {
    contactEmail : Text;
    contactPhone : Text;
    address : Text;
    copyright : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    headerContent : ?HeaderContent;
    aboutContent : ?AboutContent;
    footerContent : ?FooterContent;
    nextClinicId : Nat;
    nextServiceId : Nat;
    nextSocialLinkId : Nat;
    clinics : Map.Map<Nat, Clinic>;
    services : Map.Map<Nat, Service>;
    socialLinks : Map.Map<Nat, SocialLink>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
