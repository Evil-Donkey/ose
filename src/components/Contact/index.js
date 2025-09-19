import Container from "../Container";

const Contact = ({ title, featuredImage, footerData }) => {

    const { oxfordAcademicsEmail, investorsEmail, mediaEmail, telephone, address } = footerData;

    return (
        <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 relative">
            {featuredImage && <div className="absolute inset-0 left-auto right
            -0 top-1/2 -translate-y-1/2 w-[60%] h-full bg-contain bg-center bg-no-repeat mix-blend-screen" style={{ backgroundImage: `url(${featuredImage})` }} />}
            <Container className="py-40 2xl:pt-50 relative z-10">
                {title && <h1 className="text-4xl md:text-6xl/13 mb-10" dangerouslySetInnerHTML={{ __html: title }} />}
                <div className="flex flex-row flex-wrap font-medium">
                    <div className="w-1/2 flex flex-col lg:flex-row lg:gap-10 lg:mb-0 pe-4 lg:pe-0">
                        {/* Submit an idea */}
                        <div className="w-full lg:w-1/2 lg:mb-0">
                            <div className="lg:space-y-4">
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Oxford researchers &amp; innovators</h3>
                                    <a href={`mailto:${oxfordAcademicsEmail}`} className="text-sm hover:text-lightblue">
                                        {oxfordAcademicsEmail}
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Investors &amp; co-investors</h3>
                                    <a href={`mailto:${investorsEmail}`} className="text-sm hover:text-lightblue">
                                        {investorsEmail}
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-lightblue hidden lg:block">Media</h3>
                                    <a href={`mailto:${mediaEmail}`} className="text-sm hover:text-lightblue">
                                        {mediaEmail}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Get in touch */}
                        <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
                            <div className="lg:space-y-4">
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
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Contact;