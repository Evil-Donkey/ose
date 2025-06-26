"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import LazyLoadInitializer from "@/lib/lazyLoader";
// import Header from "@/components/Header/index";
import PageFlexibleContent from "@/components/FlexibleContent";
import Footer from "@/components/Footer/index";
import PopOut from "@/components/PopOut/index";
import Popup from "@/components/FlexibleContent/InfographicEcosystem/Popup";
import VideoPopup from "@/components/FlexibleContent/HeroVideo/VideoPopup";

gsap.registerPlugin(ScrollSmoother);

export default function FlexiblePage({ flexibleContent, className, hideNavigation, popOutData, footerData, meganavHeading }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [videoPopupData, setVideoPopupData] = useState(null);

  // useEffect(() => {
  //   const smoother = ScrollSmoother.create({
  //     smooth: 1.2, // how long (in seconds) it takes to "catch up" to the native scroll position
  //     effects: true, // looks for data-speed and data-lag attributes on elements
  //     smoothTouch: 0.1, 
  //   });
  // }, []);

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

  // Extract anchor links from flexibleContent (only blocks with an id)
  const meganavLinks = Array.isArray(flexibleContent)
    ? flexibleContent.filter(block => block && block.id).map(block => ({ id: block.id }))
    : [];

  return (
    <div className={className}>
      <LazyLoadInitializer />
      {/* {!hideNavigation && <Header />} */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <PageFlexibleContent 
            data={flexibleContent} 
            onPopupOpen={handlePopupOpen}
            onVideoPopupOpen={handleVideoPopupOpen}
          />
          <Footer data={footerData} />
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