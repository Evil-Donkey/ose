// Helper to check if flexibleContent contains specific component types
export function hasTeamComponent(flexibleContent) {
  if (!flexibleContent || !Array.isArray(flexibleContent)) return false;
  return flexibleContent.some(
    item => item.fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Team"
  );
}

export function hasFoundersComponent(flexibleContent) {
  if (!flexibleContent || !Array.isArray(flexibleContent)) return false;
  return flexibleContent.some(
    item => item.fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Founders"
  );
}

