import Container from '../../Container';
import Stats from "../../Stats";

const WhatWeDo = ({ data }) => {
    const { stats } = data;

    return (
        <div className="text-white bg-cover bg-center bg-[url('/gradient.png')]">
            <Container className="py-20 lg:py-40">
                <div className="flex flex-col">
                    {stats && <Stats data={stats} theme="dark" />}
                </div>
            </Container>
        </div>
    )
}

export default WhatWeDo;