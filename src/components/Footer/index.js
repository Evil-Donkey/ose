import Logo from "../Icons/Logo";
import Button from "../Button";
import { LinkedIn, X, YouTube } from "../Icons/Social";

const Footer = () => {
    return (
        <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white py-16">
            <div className="container mx-auto px-4 md:px-10">

                <div className="flex flex-col md:flex-row gap-x-5 justify-between items-center mb-12">
                    <div className="w-full md:w-1/2">
                        <div className="w-60">
                            <Logo />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 justify-end flex gap-x-4">
                        <div className="flex gap-x-4 items-center">
                            <YouTube />
                            <LinkedIn />
                            <X />
                        </div>
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

                {/* Copyright */}
                <div className="mt-20 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>© 2025 Oxford Science Enterprises</div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-2">
                        <a href="/sustainability" className="hover:text-lightblue">Sustainability</a>
                        <span>|</span>
                        <a href="/terms" className="hover:text-lightblue">Terms & Conditions</a>
                        <span>|</span>
                        <a href="/privacy" className="hover:text-lightblue">Privacy policy</a>
                        <span>|</span>
                        <a href="/modern-slavery" className="hover:text-lightblue">Modern Slavery Statement</a>
                        <span>|</span>
                        <a href="/cookie-policy" className="hover:text-lightblue">Cookie policy</a>
                    </div>
                </div>
                <div className="mt-4 text-xs text-center">
                    OSE Manager Limited, a wholly owned subsidiary of Oxford Science Enterprises plc, is authorised and regulated by the Financial Conduct Authority.
                </div>
            </div>
        </div>
    );
};

export default Footer;