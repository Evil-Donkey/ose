import { memo, Suspense } from "react";
import dynamic from "next/dynamic";

// Lightweight components - load immediately
import TitleAndCopy from "./TitleAndCopy";
import CTA from "@/components/CTA";
import Story from "./Story";
import OneColumnCopyAlternate from "./OneColumnCopyAlternate";
import News from "./News";
import FullScreenList from "./FullScreenList";
import Faqs from "./Faqs";
import StoryCopy from "./StoryCopy";
import StoryImage from "./StoryImage";
import StoryQuote from "./StoryQuote";
import LogosGrid from "./LogosGrid";
import TwoColumnsTitleCopy from "./TwoColumnsTitleCopy";
import FullWidthLargeHeading from "./FullWidthLargeHeading";

// Heavy components - load dynamically
import {
  DynamicHeroVideo,
  DynamicFullScreenPanel,
  DynamicInfographicMap,
  DynamicInfographicEcosystem,
  DynamicPortfolio,
  DynamicStories,
  DynamicFullPanelCarousel,
  DynamicTeam,
  DynamicCards,
  DynamicExampleProjects,
  DynamicExits,
  DynamicStatsModule,
  DynamicExpertise,
  DynamicSectors,
  DynamicWhatWeDo,
  DynamicInspirationalQuotes,
} from "@/lib/dynamicImports";

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const PageFlexibleContent = memo(({ data, onPopupOpen, onVideoPopupOpen, title }) => {

    let flexibleContentArray = [];

    {data && data.forEach((item, i) => {
        const { fieldGroupName } = item;

        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_HeroVideo") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicHeroVideo data={item} index={i} onVideoPopupOpen={onVideoPopupOpen} title={title} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_TitleAndCopy") {
            flexibleContentArray.push(<TitleAndCopy data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullScreenPanel") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicFullScreenPanel data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InfographicMap") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicInfographicMap data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_WhatWeDo") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicWhatWeDo data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Stats") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicStatsModule data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InfographicEcosystem") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicInfographicEcosystem data={item} index={i} onPopupOpen={() => onPopupOpen(item)} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Expertise") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicExpertise data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Sectors") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicSectors data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Portfolio") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicPortfolio data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Cta") {
          flexibleContentArray.push(<CTA data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Story") {
            flexibleContentArray.push(<Story data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_OneColumnCopyAlternate") {
            flexibleContentArray.push(<OneColumnCopyAlternate data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Stories") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicStories data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_News") {
            flexibleContentArray.push(<News data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InspirationalQuotes") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicInspirationalQuotes data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Cards") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicCards data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullPanelCarousel") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicFullPanelCarousel data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullScreenList") {
            flexibleContentArray.push(<FullScreenList data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Faqs") {
            flexibleContentArray.push(<Faqs data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Team") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicTeam data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Story_Story_FlexibleContent_CopyBlock") {
            flexibleContentArray.push(<StoryCopy data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Story_Story_FlexibleContent_ImageBlock") {
            flexibleContentArray.push(<StoryImage data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Story_Story_FlexibleContent_QuoteBlock") {
            flexibleContentArray.push(<StoryQuote data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_ExampleProjects") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicExampleProjects data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_LogosGrid") {
            flexibleContentArray.push(<LogosGrid data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Exits") {
            flexibleContentArray.push(
                <Suspense fallback={<LoadingSpinner />} key={i.toString()}>
                    <DynamicExits data={item} index={i} />
                </Suspense>
            );
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_TwoColumnsTitleCopy") {
            flexibleContentArray.push(<TwoColumnsTitleCopy data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullWidthLargeHeading") {
            flexibleContentArray.push(<FullWidthLargeHeading data={item} index={i} key={i.toString()} />);
        }
    })}

    return (
        <>
           {flexibleContentArray.map((component) => component)} 
        </>
    );
});

PageFlexibleContent.displayName = 'PageFlexibleContent';

export default PageFlexibleContent;