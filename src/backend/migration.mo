module {
  // No data migration needed as all state persists unchanged.
  public func run(oldActor : { nextClinicId : Nat }) : { nextClinicId : Nat } {
    oldActor;
  };
};
