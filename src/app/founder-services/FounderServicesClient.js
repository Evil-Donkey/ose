"use client";

import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import FounderServicesHero from "@/components/FounderServicesHero";
import PopOut from "@/components/PopOut/index";
import LazyLoadInitializer from "@/lib/lazyLoader";

export default function FounderServicesClient({
  title,
  content,
  videoData,
  popOutData,
  meganavLinks,
  meganavData,
  children,
}) {
  return (
    <>
      <LazyLoadInitializer />
      <HeaderWithMeganavLinks
        fixed={true}
        meganavLinks={meganavLinks}
        meganavData={meganavData}
      />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <FounderServicesHero
            title={title}
            content={content}
            videoData={videoData}
          />
        </div>
      </div>
      <PopOut data={popOutData} />
      {children}
    </>
  );
}
