import Headings from "@/components/Headings";
import Column from "@/components/Column";
import Stats from "../../Stats";

const WhatWeDo = ({ data }) => {
    const { title, columns, headings, stats } = data;
    return (
        <div className="bg-linear-(--bg-gradient) text-white">
            <div className="container mx-auto px-4 lg:px-6 py-20 lg:py-40">
                <div className="flex flex-col">
                    {title && <h3 className="uppercase tracking-widest text:lg md:text-xl mb-8 text-center font-medium text-white">{title}</h3>}
                    {headings && <Headings headings={headings} theme="dark" />}
                    {columns && 
                        <div className="flex w-full space-x-8 mt-10">
                            {columns.map((column, index) => {
                                return (
                                    <Column key={index} copy={column.copy} theme="dark" />
                                )
                            })}
                        </div>
                    }
                    {stats && 
                        <div className="mt-20">
                            <Stats data={stats} theme="dark" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default WhatWeDo;