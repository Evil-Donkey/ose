"use client";

import FlexiblePage from "./FlexiblePage";

export default function FlexiblePageClient({ children, meganavLinks, meganavData, foundersData, teamData, ...props }) {
  return (
    <>
      <FlexiblePage
        {...props}
        meganavLinks={meganavLinks}
        meganavData={meganavData}
        foundersData={foundersData}
        teamData={teamData}
      />
      {children}
    </>
  );
}
