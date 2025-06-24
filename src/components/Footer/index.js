import { Logo } from "../Icons/Logo";
import Button from "../Button";
import { LinkedIn, X, YouTube } from "../Icons/Social";
// import GoogleMap from "../GoogleMap";
import Container from "../Container";

const Footer = () => {
    return (
        <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16">
            <Container className="mb-10 lg:mb-20">

                <div className="flex flex-row gap-x-5 justify-between items-center mb-12">
                    <div className="w-1/2">
                        <div className="w-40 lg:w-60">
                            <Logo />
                        </div>
                    </div>
                    <div className="flex-col lg:flex-row w-1/2 lg:mt-0 lg:justify-end flex gap-x-4">
                        <div className="gap-x-4 items-center mb-5 lg:mb-0 hidden lg:flex">
                            <YouTube />
                            <LinkedIn />
                            <X />
                        </div>
                        <Button href="/investor-portal" className="text-sm lg:text-base">Investor Portal</Button>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap font-medium">
                    <div className="w-1/2 flex flex-col lg:flex-row lg:gap-5 lg:mb-0 pe-4 lg:pe-0">
                        {/* Submit an idea */}
                        <div className="w-full lg:w-1/2 lg:mb-0">
                            <h2 className="text-3xl mb-4">Get in touch</h2>
                            <div className="lg:space-y-4">
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Life Sciences</h3>
                                    <a href="mailto:lifesciences@oxfordsciences.com" className="text-sm hover:text-lightblue hidden lg:block">
                                        lifesciences@oxfordsciences.com
                                    </a>
                                    <a href="mailto:lifesciences@oxfordsciences.com" className="text-sm hover:text-lightblue lg:hidden">
                                        Life Sciences
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Health Tech</h3>
                                    <a href="mailto:healthtech@oxfordsciences.com" className="text-sm hover:text-lightblue hidden lg:block">
                                        healthtech@oxfordsciences.com
                                    </a>
                                    <a href="mailto:healthtech@oxfordsciences.com" className="text-sm hover:text-lightblue lg:hidden">
                                        Health Tech
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Deep Tech</h3>
                                    <a href="mailto:deeptech@oxfordsciences.com" className="text-sm hover:text-lightblue hidden lg:block">
                                        deeptech@oxfordsciences.com
                                    </a>
                                    <a href="mailto:deeptech@oxfordsciences.com" className="text-sm hover:text-lightblue lg:hidden">
                                        Deep Tech
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Get in touch */}
                        <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4 hidden lg:block">&nbsp;</h2>
                            <div className="lg:space-y-4">
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Investors &amp; Co-Investors</h3>
                                    <a href="mailto:investors@oxfordsciences.com" className="text-sm hover:text-lightblue hidden lg:block">
                                        investors@oxfordsciences.com
                                    </a>
                                    <a href="mailto:investors@oxfordsciences.com" className="text-sm hover:text-lightblue lg:hidden">
                                        Investors &amp; Co-Investors
                                    </a>
                                </div>
                                <div className="mb-5">
                                    <h3 className="text-lightblue hidden lg:block">Media</h3>
                                    <a href="mailto:ose@weareevenhills.com" className="text-sm hover:text-lightblue hidden lg:block">
                                        ose@weareevenhills.com
                                    </a>
                                    <a href="mailto:ose@weareevenhills.com" className="text-sm hover:text-lightblue lg:hidden">
                                        Media
                                    </a>
                                </div>
                                <div className="mb-5">
                                    <h3 className="text-lightblue">Call</h3>
                                    <a href="tel:01865950000" className="text-sm hover:text-lightblue">
                                        01865 950 000
                                    </a>
                                </div>
                                <div className="mb-8 lg:mb-0">
                                    <h3 className="text-lightblue">Address</h3>
                                    <p className="text-sm">46 Woodstock Road, Oxford, OX2 6HT</p>
                                </div>
                                <div>
                                    <div className="flex flex-row gap-x-2 items-center mb-5 lg:mb-0 lg:hidden">
                                        <YouTube />
                                        <LinkedIn />
                                        <X />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 flex flex-col lg:flex-row gap-x-5 ps-4 lg:ps-0">
                        {/* Site map */}
                        <div className="w-full lg:w-1/3 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4">OSE</h2>
                            <ul>
                                <li><a href="/why" className="hover:text-lightblue">Why we exist</a></li>
                                <li><a href="/what" className="hover:text-lightblue">What we do</a></li>
                                <li><a href="/how" className="hover:text-lightblue">How we work</a></li>
                                <li><a href="/who" className="hover:text-lightblue">Who we are</a></li>
                            </ul>
                        </div>

                        {/* Sectors */}
                        <div className="w-full lg:w-1/3 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4">Sectors</h2>
                            <ul>
                                <li><a href="/sectors/deep-tech" className="hover:text-lightblue">Deep Tech</a></li>
                                <li><a href="/sectors/life-sciences" className="hover:text-lightblue">Life Sciences</a></li>
                                <li><a href="/sectors/health-tech" className="hover:text-lightblue">Health Tech</a></li>
                            </ul>
                        </div>

                        {/* OSE */}
                        <div className="w-full lg:w-1/3 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4">More</h2>
                            <ul>
                                <li><a href="/portfolio" className="hover:text-lightblue">Portfolio</a></li>
                                <li><a href="/stories" className="hover:text-lightblue">Stories</a></li>
                                <li><a href="/news" className="hover:text-lightblue">News</a></li>
                                <li><a href="/contact" className="hover:text-lightblue">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>

            {/* <GoogleMap /> */}

            <div className="bg-darkblue py-4">
                <Container>
                    {/* Copyright */}
                    <div className="text-xs flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div>© 2025 Oxford Science Enterprises</div>
                        <div className="flex flex-wrap justify-center lg:justify-end gap-x-1">
                            <a href="/sustainability" className="hover:text-lightblue">Sustainability</a>
                            <span>|</span>
                            <a href="/terms" className="hover:text-lightblue">Terms & Conditions</a>
                            <span>|</span>
                            <a href="/privacy" className="hover:text-lightblue">Privacy policy</a>
                            <span>|</span>
                            <a href="/modern-slavery" className="hover:text-lightblue">Modern Slavery Statement</a>
                            {/* <span>|</span>
                            <a href="/cookie-policy" className="hover:text-lightblue">Cookie policy</a> */}
                        </div>
                    </div>
                </Container>
            </div>

            <div className="py-4 px-4 lg:px-10 text-xs text-center bg-blue-02">
                OSE Manager Limited, a wholly owned subsidiary of Oxford Science Enterprises plc, is authorised and regulated by the Financial Conduct Authority.
            </div>
        </div>
    );
};

export default Footer;