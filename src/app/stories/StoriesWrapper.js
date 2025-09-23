"use client";

import { useState } from "react";
import StoriesClient from "./StoriesClient";
import CTA from "@/components/CTA";

export default function StoriesWrapper({ types, stories, sectors, ctaData }) {
  const [storiesData, setStoriesData] = useState(null);

  const handleStoriesUpdate = (updatedStories) => {
    setStoriesData(updatedStories);
  };

  return (
    <>
      <StoriesClient 
        types={types} 
        stories={stories} 
        sectors={sectors}
        onStoriesUpdate={handleStoriesUpdate}
      />
      <CTA data={ctaData} storiesData={storiesData} />
    </>
  );
} 