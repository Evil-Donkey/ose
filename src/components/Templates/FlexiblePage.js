"use client";

import { useState } from "react";
import LazyLoadInitializer from "@/lib/lazyLoader";
import PageFlexibleContent from "@/components/FlexibleContent";
import PopOut from "@/components/PopOut/index";
import Popup from "@/components/FlexibleContent/InfographicEcosystem/Popup";
import VideoPopup from "@/components/FlexibleContent/HeroVideo/VideoPopup";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";

export default function FlexiblePage({ flexibleContent, className, popOutData, title, titleInHero, content, fixedHeader, hideHeader, isStoriesPage, meganavLinks = {}, meganavData = {}, foundersData = null, teamData = null }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [videoPopupData, setVideoPopupData] = useState(null);

  const handlePopupOpen = (data) => {
    setPopupData(data);
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupData(null);
  };

  const handleVideoPopupOpen = (data) => {
    setVideoPopupData(data);
    setIsVideoPopupOpen(true);
  };

  const handleVideoPopupClose = () => {
    setIsVideoPopupOpen(false);
    setVideoPopupData(null);
  };

  return (
    <div className={className}>
      <LazyLoadInitializer />
      {!hideHeader && <HeaderWithMeganavLinks fixed={fixedHeader} meganavLinks={meganavLinks} meganavData={meganavData} />}

      {!titleInHero && title && (
        <div className={`text-center flex flex-col items-center gap-5 2xl:pt-60 ${isStoriesPage ? 'mb-15 lg:mb-20 pt-45 lg:pt-50' : 'mb-20 pt-50'}`}>
          <h1 className={`${isStoriesPage ? 'text-6xl' : 'text-7xl/18 md:text-8xl/23'} text-darkblue text-center`}>{title}</h1>
          {content && <div className="w-full xl:px-17 lg:w-200 text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
      )}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <PageFlexibleContent 
            data={flexibleContent} 
            title={titleInHero ? title : null}
            onPopupOpen={handlePopupOpen}
            onVideoPopupOpen={handleVideoPopupOpen}
            foundersData={foundersData}
            teamData={teamData}
          />
        </div>
      </div>
      <PopOut data={popOutData} />
      <Popup 
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        spinoutDesktopImage={popupData?.spinoutDesktopImage}
        spinoutMobileImage={popupData?.spinoutMobileImage}
      />
      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={handleVideoPopupClose}
        fullMovie={videoPopupData}
      />
    </div>
  );
} 