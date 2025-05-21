'use client'

import { useState, useEffect } from 'react'
import Link from "next/link";
import { Logo } from "../Icons/Logo";
import { IconHamburger, IconClose } from "../Icons/Hamburger";
import Container from '../Container';

const Header = ({ portal }) => {

    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const delays = ['delay-150', 'delay-300', 'delay-450', 'delay-600'];

    const topNavItems = [
        {
            label: 'Portfolio',
            href: '/portfolio'
        },
        {
            label: 'Stories',
            href: '/stories'
        },
        {
            label: 'News',
            href: '/news'
        },
        {
            label: 'Investor Portal',
            href: '/investor-portal'
        }
    ];

    const bottomNavItems = [
        {
            label: 'Why',
            href: '/why'
        },
        {
            label: 'What',
            href: '/what'
        },
        {
            label: 'How',
            href: '/how'
        },
        {
            label: 'Who',
            href: '/who'
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            
            if (currentScrollTop >= maxScroll) {
                // setIsScrollingUp(true);
            } else if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
                setIsScrollingUp(false);
            } else {
                setIsScrollingUp(true);
            }

            if (currentScrollTop > 0) {
                setIsHeaderScrolled(true);
            } else {
                setIsHeaderScrolled(false);
            }

            setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };

        if (!isMobileMenuOpen) {
            window.addEventListener('scroll', handleScroll);
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollTop, isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        console.log('toggleMobileMenu');
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    return (
        <header className={`text-white fixed top-0 left-0 right-0 transition-all duration-500 z-10 w-full ${isScrollingUp ? '' : '-translate-y-full'} ${isHeaderScrolled ? 'py-4 2xl:py-5 bg-cover bg-center bg-[url("/gradient.png")]' : 'py-7 2xl:py-10'}`}>
            {/* <div className={`${styles.mobileMenuBackground} ${isMobileMenuOpen ? styles.mobileMenuBackgroundActive : ''}`} /> */}
            <Container>
                <div className="flex justify-between items-center">
                    <div className={`transition-all duration-500 ${isHeaderScrolled ? 'w-40 2xl:w-65' : 'w-50 2xl:w-75'}`}>
                        <div className="text-xl font-bold">
                            <Link href="/">
                                <Logo />
                            </Link>
                        </div>
                    </div>

                    <div className={`transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col items-center lg:items-end justify-center lg:justify-start gap-5 lg:gap-0 absolute top-0 left-0 w-svw h-svh lg:h-auto lg:w-auto bg-blue-02 lg:bg-transparent lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        <div className={`flex justify-end transition-all duration-500 ${isHeaderScrolled ? 'mb-1 2xl:mb-3' : 'md:mb-2 2xl:mb-4'}`}>
                            <nav className="lg:space-x-5 flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0">
                                {topNavItems.map((item, index) => (
                                    <Link href={item.href} key={index} className={`hover:text-lightblue transition duration-300 lg:opacity-100 lg:translate-x-0 * 150} lg:delay-0 ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}`}>{item.label}</Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex justify-end">
                            <nav className="lg:space-x-8 2xl:space-x-12 text-lg flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0">
                                {bottomNavItems.map((item, index) => (
                                    <Link href={item.href} key={index} className={`text-3xl 2xl:text-4xl hover:text-lightblue transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}`}>{item.label}</Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="lg:hidden cursor-pointer z-10" onClick={toggleMobileMenu}>
                        {!isMobileMenuOpen ? <IconHamburger /> : <IconClose />}
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header; 