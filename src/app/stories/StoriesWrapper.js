"use client";

import { useState } from "react";
import StoriesClient from "./StoriesClient";
import CTA from "@/components/FlexibleContent/CTA";

export default function StoriesWrapper({ types, stories, ctaData }) {
  const [storiesData, setStoriesData] = useState(null);

  const handleStoriesUpdate = (updatedStories) => {
    setStoriesData(updatedStories);
  };

  return (
    <>
      <StoriesClient 
        types={types} 
        stories={stories} 
        onStoriesUpdate={handleStoriesUpdate}
      />
      <CTA data={ctaData} storiesData={storiesData} />
    </>
  );
} 