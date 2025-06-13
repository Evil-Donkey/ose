import Stats from "@/components/Stats";
import Container from '../../Container';

const StatsModule = ({ data }) => {

    const { stats, investorsHeading, investorsDesktopImage, investorsMobileImage } = data;

    return (
        <Container className="py-20 lg:py-40">
            <Stats data={stats} />
            {investorsHeading && (
                <div className="flex flex-col items-center">
                    <h2 className="text-4xl">{investorsHeading}</h2>
                </div>
            )}
        </Container>
    )
}

export default StatsModule;