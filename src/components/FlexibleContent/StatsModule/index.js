import Stats from "@/components/Stats";
import Container from '../../Container';

const StatsModule = ({ data }) => {

    const { stats } = data;

    return (
        <Container className="py-20 lg:py-40">
            <Stats data={stats} />
        </Container>
    )
}

export default StatsModule;