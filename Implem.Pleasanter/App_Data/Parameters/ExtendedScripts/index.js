(async function () {
  await initJobSiteInfo();
  await initDrillHoleSiteInfo();
  await initDrillingDeepSiteInfo();

  moveSpecificDivFieldsIntoTable("#Results_JobInfo table", [
    "Results_NumAField",
    "Results_CheckAField",
    "Results_ClassDField",
    "Results_ClassEField",
    "Results_ClassFField",
    "Results_ClassGField",
    "Results_ClassHField",
    "Results_ClassIField",
    "Results_ClassJField",
    "Results_ClassKField",
    "Results_DescriptionAField",
  ]);
})();
