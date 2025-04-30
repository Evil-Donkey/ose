import HeroVideo from "./HeroVideo";
import TitleAndCopy from "./TitleAndCopy";
import ScrollingPanels from "./ScrollingPanels";
import InfographicMap from "./InfographicMap";
import WhatWeDo from "./WhatWeDo";
import StatsModule from "./StatsModule";
import InfographicEcosystem from "./InfographicEcosystem";
import Expertise from "./Expertise";
import Sectors from "./Sectors";
import Portfolio from "./Portfolio";
import CTA from "./CTA";

const PageFlexibleContent = ({ data }) => {

    let flexibleContentArray = [];

    {data && data.forEach((data, i) => {

        const { fieldGroupName } = data;

        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_HeroVideo") {
            flexibleContentArray.push(<HeroVideo data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_TitleAndCopy") {
            flexibleContentArray.push(<TitleAndCopy data={data} index={i} key={i.toString()} />);
        }
        if (fieldGroupName === "Page_Flexiblecontent_FlexibleContent_ScrollingPanels") {
            flexibleContentArray.push(<ScrollingPanels data={data} index={i} key={i.toString()} />);
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
            flexibleContentArray.push(<InfographicEcosystem data={data} index={i} key={i.toString()} />);
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
    })}

    return (
        <>
           {flexibleContentArray.map((component) => component)} 
        </>
    );
};

export default PageFlexibleContent;