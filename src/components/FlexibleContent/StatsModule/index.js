import Stats from "@/components/Stats";
import Container from '../../Container';
import formatSectionLabel from '@/lib/formatSectionLabel';

const StatsModule = ({ data }) => {

    const { stats, sectionLabel } = data;

    return (
        <Container id={formatSectionLabel(sectionLabel)} className="py-20 lg:py-40">
            <Stats data={stats} />
        </Container>
    )
}

export default StatsModule;