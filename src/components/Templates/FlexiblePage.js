"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import LazyLoadInitializer from "@/lib/lazyLoader";
import Header from "@/components/Header/index";
import PageFlexibleContent from "@/components/FlexibleContent";
import Footer from "@/components/Footer/index";

gsap.registerPlugin(ScrollSmoother);

export default function FlexiblePage({ flexibleContent, className, hideNavigation }) {

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 2, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      smoothTouch: 0.1, 
    });
  }, []);

  return (
    <div className={className}>
      <LazyLoadInitializer />
      {!hideNavigation && <Header />}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <PageFlexibleContent data={flexibleContent} />
          <Footer />
        </div>
      </div>
    </div>
  );
} 