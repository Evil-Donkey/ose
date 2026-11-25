"use client";

import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import FounderServicesHero from "@/components/FounderServicesHero";
import PageFlexibleContent from "@/components/FlexibleContent";
import PopOut from "@/components/PopOut/index";
import LazyLoadInitializer from "@/lib/lazyLoader";
import { CtaFormModalProvider } from "@/components/CtaFormModal";

export default function FounderServicesClient({
  title,
  content,
  videoData,
  flexibleContent,
  themeCta = null,
  popOutData,
  meganavLinks,
  meganavData,
  children,
}) {
  return (
    <CtaFormModalProvider showSectors formVariant="main">
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
          {flexibleContent?.length > 0 && (
            <PageFlexibleContent data={flexibleContent} themeCta={themeCta} />
          )}
        </div>
      </div>
      <PopOut data={popOutData} />
      {children}
    </CtaFormModalProvider>
  );
}
