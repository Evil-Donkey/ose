import Stats from "@/components/Stats";

const StatsModule = ({ data }) => {

    const { stats } = data;

    return (
        <div className="container mx-auto px-4 lg:px-6 py-20 lg:py-40">
            <Stats data={stats} />
        </div>
    )
}

export default StatsModule;