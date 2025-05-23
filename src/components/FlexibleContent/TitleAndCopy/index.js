import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Container from "../../Container";

const TitleAndCopy = ({ data }) => {

    const { headings, copy } = data;

    return (
        <Container className="py-20 lg:py-40">
            {headings &&
                <div className="flex flex-col">
                    <Headings headings={headings} />
                </div>
            }
            <div className="flex justify-end lg:me-20">
                <Column copy={copy} />
            </div>
        </Container>
    )
}

export default TitleAndCopy;