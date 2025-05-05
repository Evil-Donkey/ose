import Headings from "@/components/Headings";
import Column from "@/components/Column";

const TitleAndCopy = ({ data }) => {

    const { headings, copy } = data;

    return (
        <div className="container mx-auto px-4 md:px-10 py-20 lg:py-40">
            <div className="flex flex-col">
                <Headings headings={headings} />
            </div>
            <div className="flex justify-end lg:me-20">
                <Column copy={copy} />
            </div>
        </div>
    )
}

export default TitleAndCopy;