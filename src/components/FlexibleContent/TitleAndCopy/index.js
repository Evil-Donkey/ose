import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Container from "../../Container";
import formatSectionLabel from '@/lib/formatSectionLabel';

const TitleAndCopy = ({ data }) => {

    const { headings, copy, sectionLabel } = data;

    return (
        <Container id={sectionLabel ? formatSectionLabel(sectionLabel) : undefined} className="py-20 lg:py-40">
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