import CountUp from 'react-countup';

const Stats = ({ data, theme }) => {
    const { title, stats } = data;

    const textColor = theme === 'dark' ? 'text-white' : 'text-blue-02';

    return (
        <div className="flex flex-col">
            {title && <h3 className={`uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium ${textColor}`}>{title}</h3>}
            {stats && 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                    {stats.map((stat, index) => {
                        const { description, postStat, preStat, statValue } = stat;
                        let decimals = 0;

                        // check if the statValue is a decimal
                        if (statValue.toString().includes('.')) {
                            decimals = 1;
                        }
                        
                        return (
                            <div key={index} className="flex flex-col text-center items-center">
                                <div className="flex flex-nowrap">
                                    {preStat && <h4 className="text-9xl text-lightblue">{preStat}</h4>}
                                    {statValue && <h4 className="text-9xl text-lightblue"><CountUp end={statValue} enableScrollSpy scrollSpyOnce={true} scrollSpyDelay={500} decimals={decimals} /></h4>}
                                    {postStat && <h4 className="text-9xl text-lightblue">{postStat}</h4>}
                                </div>
                                <div className="text-lg" dangerouslySetInnerHTML={{ __html: description }} />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default Stats;