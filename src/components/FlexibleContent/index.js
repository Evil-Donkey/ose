import { memo } from "react";
import HeroVideo from "./HeroVideo";
import TitleAndCopy from "./TitleAndCopy";
import FullScreenPanel from "./FullScreenPanel";
import InfographicMap from "./InfographicMap";
import WhatWeDo from "./WhatWeDo";
import StatsModule from "./StatsModule";
import InfographicEcosystem from "./InfographicEcosystem";
import Expertise from "./Expertise";
import Sectors from "./Sectors";
import Portfolio from "./Portfolio";
import CTA from "@/components/CTA";
import Story from "./Story";
import OneColumnCopyAlternate from "./OneColumnCopyAlternate";
import Stories from "./Stories";
import News from "./News";
import InspirationalQuotes from "./InspirationalQuotes";
import Cards from "./Cards";
import FullPanelCarousel from "./FullPanelCarousel";
import FullScreenList from "./FullScreenList";
import Faqs from "./Faqs";
import Team from "./Team";
import StoryCopy from "./StoryCopy";
import StoryImage from "./StoryImage";
import StoryQuote from "./StoryQuote";
import ExampleProjects from "./ExampleProjects";
import LogosGrid from "./LogosGrid";
import Exits from "./Exits";
import TwoColumnsTitleCopy from "./TwoColumnsTitleCopy";
import FullWidthLargeHeading from "./FullWidthLargeHeading";
import Founders from "./Founders";
import Advantages from "./Advantages";

const PageFlexibleContent = memo(({ data, onPopupOpen, onVideoPopupOpen, title, foundersData = null, teamData = null }) => {

    let flexibleContentArray = [];

    {data && data.forEach((item, i) => {
        const { fieldGroupName } = item;

        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_HeroVideo") {
            flexibleContentArray.push(<HeroVideo data={item} index={i} key={i.toString()} onVideoPopupOpen={onVideoPopupOpen} title={title} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_TitleAndCopy") {
            flexibleContentArray.push(<TitleAndCopy data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullScreenPanel") {
            flexibleContentArray.push(<FullScreenPanel data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InfographicMap") {
            flexibleContentArray.push(<InfographicMap data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_WhatWeDo") {
            flexibleContentArray.push(<WhatWeDo data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Stats") {
            flexibleContentArray.push(<StatsModule data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InfographicEcosystem") {
            flexibleContentArray.push(<InfographicEcosystem data={item} index={i} key={i.toString()} onPopupOpen={() => onPopupOpen(item)} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Expertise") {
            flexibleContentArray.push(<Expertise data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Sectors") {
            flexibleContentArray.push(<Sectors data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Portfolio") {
            flexibleContentArray.push(<Portfolio data={item} index={i} key={i.toString()} />);
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
            flexibleContentArray.push(<Stories data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_News") {
            flexibleContentArray.push(<News data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InspirationalQuotes") {
            flexibleContentArray.push(<InspirationalQuotes data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Cards") {
            flexibleContentArray.push(<Cards data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullPanelCarousel") {
            flexibleContentArray.push(<FullPanelCarousel data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullScreenList") {
            flexibleContentArray.push(<FullScreenList data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Faqs") {
            flexibleContentArray.push(<Faqs data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Team") {
            flexibleContentArray.push(<Team data={item} index={i} key={i.toString()} teamData={teamData} />);
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
            flexibleContentArray.push(<ExampleProjects data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_LogosGrid") {
            flexibleContentArray.push(<LogosGrid data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Exits") {
            flexibleContentArray.push(<Exits data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_TwoColumnsTitleCopy") {
            flexibleContentArray.push(<TwoColumnsTitleCopy data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullWidthLargeHeading") {
            flexibleContentArray.push(<FullWidthLargeHeading data={item} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Founders") {
            flexibleContentArray.push(<Founders data={item} index={i} key={i.toString()} foundersData={foundersData} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Advantages") {
            flexibleContentArray.push(<Advantages data={item} index={i} key={i.toString()} />);
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