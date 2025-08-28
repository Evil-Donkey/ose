import { Logo } from "../Icons/Logo";
import Button from "../Button";
import { LinkedIn, YouTube } from "../Icons/Social";
import Container from "../Container";
import Link from "next/link";

const Footer = ({ data }) => {
    const { copyright, address, investorsEmail, oxfordAcademicsEmail, mediaEmail, telephone } = data;

    return (
        <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16">
            <Container className="mb-10 lg:mb-20">

                <div className="flex flex-row gap-x-5 justify-between items-center mb-12">
                    <div className="w-1/2">
                        <div className="w-40 lg:w-60">
                            <Link href="/"><Logo /></Link>
                        </div>
                    </div>
                    <div className="flex-col lg:flex-row w-1/2 lg:mt-0 lg:justify-end flex gap-x-4">
                        <div className="gap-x-4 items-center mb-5 lg:mb-0 hidden lg:flex">
                            <YouTube />
                            <LinkedIn />
                        </div>
                        <Button href="/shareholder-portal" className="text-sm lg:text-base">Shareholder Portal</Button>
                    </div>
                </div>

                <div className="flex flex-row flex-wrap font-medium">
                    <div className="w-1/2 flex flex-col lg:flex-row lg:gap-5 lg:mb-0 pe-4 lg:pe-0">
                        {/* Submit an idea */}
                        <div className="w-full lg:w-1/2 lg:mb-0">
                            <h2 className="text-3xl mb-4">Get in touch</h2>
                            <div className="lg:space-y-4">
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Oxford Researchers &amp; Innovators</h3>
                                    <a href={`mailto:${oxfordAcademicsEmail}`} className="text-sm hover:text-lightblue hidden lg:block">
                                        {oxfordAcademicsEmail}
                                    </a>
                                    <a href={`mailto:${oxfordAcademicsEmail}`} className="text-sm hover:text-lightblue lg:hidden">
                                        Oxford Researchers &amp; Innovators
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Investors &amp; Co-Investors</h3>
                                    <a href={`mailto:${investorsEmail}`} className="text-sm hover:text-lightblue hidden lg:block">
                                        {investorsEmail}
                                    </a>
                                    <a href={`mailto:${investorsEmail}`} className="text-sm hover:text-lightblue lg:hidden">
                                        Investors &amp; Co-Investors
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Get in touch */}
                        <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4 hidden lg:block">&nbsp;</h2>
                            <div className="lg:space-y-4">
                                <div className="mb-5">
                                    <h3 className="text-lightblue hidden lg:block">Media</h3>
                                    <a href={`mailto:${mediaEmail}`} className="text-sm hover:text-lightblue hidden lg:block">
                                        {mediaEmail}
                                    </a>
                                    <a href={`mailto:${mediaEmail}`} className="text-sm hover:text-lightblue lg:hidden">
                                        Media
                                    </a>
                                </div>
                                <div className="mb-5">
                                    <h3 className="text-lightblue">Call</h3>
                                    <a href={`tel:${telephone}`} className="text-sm hover:text-lightblue">
                                        {telephone}
                                    </a>
                                </div>
                                <div className="mb-8 lg:mb-0">
                                    <h3 className="text-lightblue">Address</h3>
                                    <p className="text-sm">{address}</p>
                                </div>
                                <div>
                                    <div className="flex flex-row gap-x-2 items-center mb-5 lg:mb-0 lg:hidden">
                                        <YouTube />
                                        <LinkedIn />
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
                                <li><Link href="/why" className="hover:text-lightblue">Why we exist</Link></li>
                                <li><Link href="/what" className="hover:text-lightblue">What we do</Link></li>
                                <li><Link href="/how" className="hover:text-lightblue">How we work</Link></li>
                                <li><Link href="/who" className="hover:text-lightblue">Who we are</Link></li>
                            </ul>
                        </div>

                        {/* Sectors */}
                        <div className="w-full lg:w-1/3 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4">Sectors</h2>
                            <ul>
                                <li><Link href="/deep-tech" className="hover:text-lightblue">Deep Tech</Link></li>
                                <li><Link href="/life-sciences" className="hover:text-lightblue">Life Sciences</Link></li>
                                <li><Link href="/health-tech" className="hover:text-lightblue">Health Tech</Link></li>
                            </ul>
                        </div>

                        {/* OSE */}
                        <div className="w-full lg:w-1/3 mb-5 lg:mb-0">
                            <h2 className="text-3xl mb-4">More</h2>
                            <ul>
                                <li><Link href="/portfolio" className="hover:text-lightblue">Portfolio</Link></li>
                                <li><Link href="/stories" className="hover:text-lightblue">Stories</Link></li>
                                <li><Link href="/news" className="hover:text-lightblue">News</Link></li>
                                <li><Link href="/contact" className="hover:text-lightblue">Contact</Link></li>
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
                            <Link href="/sustainability" className="hover:text-lightblue">Sustainability</Link>
                            <span>|</span>
                            <Link href="/terms-conditions" className="hover:text-lightblue">Terms & Conditions</Link>
                            <span>|</span>
                            <Link href="/privacy-policy" className="hover:text-lightblue">Privacy policy</Link>
                            <span>|</span>
                            <Link href="/modern-slavery" className="hover:text-lightblue">Modern Slavery Statement</Link>
                            {/* <span>|</span>
                            <a href="/cookie-policy" className="hover:text-lightblue">Cookie policy</a> */}
                        </div>
                    </div>
                </Container>
            </div>

            {copyright && (
                <div className="py-4 px-4 lg:px-10 text-xs text-center bg-blue-02">
                    OSE Manager Limited, a wholly owned subsidiary of Oxford Science Enterprises plc, is authorised and regulated by the Financial Conduct Authority.
                </div>
            )}
        </div>
    );
};

export default Footer;