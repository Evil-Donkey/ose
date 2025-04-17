import HeroVideo from "./HeroVideo";
import TitleAndCopy from "./TitleAndCopy";

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
    })}

    return (
        <>
           {flexibleContentArray.map((component) => component)} 
        </>
    );
};

export default PageFlexibleContent;