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
import CTA from "./CTA";
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

const PageFlexibleContent = ({ data, onPopupOpen, onVideoPopupOpen, title }) => {

    let flexibleContentArray = [];

    {data && data.forEach((data, i) => {

        const { fieldGroupName } = data;

        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_HeroVideo") {
            flexibleContentArray.push(<HeroVideo data={data} index={i} key={i.toString()} onVideoPopupOpen={onVideoPopupOpen} title={title} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_TitleAndCopy") {
            flexibleContentArray.push(<TitleAndCopy data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullScreenPanel") {
            flexibleContentArray.push(<FullScreenPanel data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InfographicMap") {
            flexibleContentArray.push(<InfographicMap data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_WhatWeDo") {
            flexibleContentArray.push(<WhatWeDo data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Stats") {
            flexibleContentArray.push(<StatsModule data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InfographicEcosystem") {
            flexibleContentArray.push(<InfographicEcosystem data={data} index={i} key={i.toString()} onPopupOpen={() => onPopupOpen(data)} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Expertise") {
            flexibleContentArray.push(<Expertise data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Sectors") {
            flexibleContentArray.push(<Sectors data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Portfolio") {
            flexibleContentArray.push(<Portfolio data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Cta") {
            flexibleContentArray.push(<CTA data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Story") {
            flexibleContentArray.push(<Story data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_OneColumnCopyAlternate") {
            flexibleContentArray.push(<OneColumnCopyAlternate data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Stories") {
            flexibleContentArray.push(<Stories data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_News") {
            flexibleContentArray.push(<News data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_InspirationalQuotes") {
            flexibleContentArray.push(<InspirationalQuotes data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Cards") {
            flexibleContentArray.push(<Cards data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullPanelCarousel") {
            flexibleContentArray.push(<FullPanelCarousel data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_FullScreenList") {
            flexibleContentArray.push(<FullScreenList data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Faqs") {
            flexibleContentArray.push(<Faqs data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_Team") {
            flexibleContentArray.push(<Team data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Story_Story_FlexibleContent_CopyBlock") {
            flexibleContentArray.push(<StoryCopy data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Story_Story_FlexibleContent_ImageBlock") {
            flexibleContentArray.push(<StoryImage data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Story_Story_FlexibleContent_QuoteBlock") {
            flexibleContentArray.push(<StoryQuote data={data} index={i} key={i.toString()} />);
        }
    })}

    return (
        <>
           {flexibleContentArray.map((component) => component)} 
        </>
    );
};

export default PageFlexibleContent;