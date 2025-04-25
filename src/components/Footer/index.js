import Logo from "../Icons/Logo";
import Button from "../Button";

const Footer = () => {
    return (
        <div className="bg-linear-(--bg-gradient) text-white py-16">
            <div className="container mx-auto px-4 lg:px-6">

                <div className="flex flex-col md:flex-row gap-x-5 justify-between items-center mb-12">
                    <div className="w-full md:w-1/2">
                        <div className="w-60">
                            <Logo />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 text-end">
                        <Button>Investor Portal</Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-x-5">
                    <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-x-5">
                        {/* Submit an idea */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl mb-4">Submit an idea</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lightblue mb-1">Life Sciences</h3>
                                    <a href="mailto:lifesciences@oxfordsciences.com" className="text-sm hover:text-lightblue">
                                        lifesciences@oxfordsciences.com
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue mb-1">Health Tech</h3>
                                    <a href="mailto:healthtech@oxfordsciences.com" className="text-sm hover:text-lightblue">
                                        healthtech@oxfordsciences.com
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue mb-1">Deep Tech</h3>
                                    <a href="mailto:deeptech@oxfordsciences.com" className="text-sm hover:text-lightblue">
                                        deeptech@oxfordsciences.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Get in touch */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl mb-4">Get in touch</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lightblue mb-1">Investors and co-investors</h3>
                                    <a href="mailto:investors@oxfordsciences.com" className="text-sm hover:text-lightblue">
                                        investors@oxfordsciences.com
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue mb-1">Media</h3>
                                    <a href="mailto:ose@weareevenhills.com" className="text-sm hover:text-lightblue">
                                        ose@weareevenhills.com
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue mb-1">Call</h3>
                                    <a href="tel:01865950000" className="text-sm hover:text-lightblue">
                                        01865 950 000
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue mb-1">Address</h3>
                                    <p className="text-sm">46 Woodstock Road, Oxford, OX2 6HT</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-x-5">
                        {/* Site map */}
                        <div className="w-full md:w-1/3">
                            <h2 className="text-3xl mb-4">Site map</h2>
                            <ul className="space-y-1">
                                <li><a href="/why" className="hover:text-lightblue">Why</a></li>
                                <li><a href="/what" className="hover:text-lightblue">What</a></li>
                                <li><a href="/how" className="hover:text-lightblue">How</a></li>
                                <li><a href="/who" className="hover:text-lightblue">Who</a></li>
                            </ul>
                        </div>

                        {/* Sectors */}
                        <div className="w-full md:w-1/3">
                            <h2 className="text-3xl mb-4">Sectors</h2>
                            <ul className="space-y-1">
                                <li><a href="/sectors/deep-tech" className="hover:text-lightblue">Deep Tech</a></li>
                                <li><a href="/sectors/health-tech" className="hover:text-lightblue">Health Tech</a></li>
                                <li><a href="/sectors/life-sciences" className="hover:text-lightblue">Life Sciences</a></li>
                            </ul>
                        </div>

                        {/* OSE */}
                        <div className="w-full md:w-1/3">
                            <h2 className="text-3xl mb-4">OSE</h2>
                            <ul className="space-y-1">
                                <li><a href="/portfolio" className="hover:text-lightblue">Portfolio</a></li>
                                <li><a href="/stories" className="hover:text-lightblue">Stories</a></li>
                                <li><a href="/news" className="hover:text-lightblue">News</a></li>
                                <li><a href="/contact" className="hover:text-lightblue">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;