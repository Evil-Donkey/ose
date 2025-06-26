'use client'

import { useState, useEffect } from 'react'
import LottieLogo from '../LottieLogo';
import { IconHamburger, IconClose } from "../Icons/Hamburger";
import Container from '../Container';
import { usePathname } from 'next/navigation';
import Meganav from './Meganav';
import { useIsMobile } from '@/hooks/isMobile';

const Header = ({ portal, meganavLinks = {} }) => {
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const delays = ['delay-150', 'delay-300', 'delay-450', 'delay-600'];
    const pathname = usePathname();
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    const [activeMeganav, setActiveMeganav] = useState(null);

    console.log('meganavLinks', meganavLinks);

    const topNavItems = [
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Stories', href: '/stories' },
        { label: 'News', href: '/news' },
        { label: 'Investor Portal', href: '/investor-portal' }
    ];

    const bottomNavItems = [
        { 
            label: 'Why', 
            href: '/why',
            meganavHeading: 'Why We Exist',
            meganavLinks: meganavLinks?.Why || []
        },
        { 
            label: 'What', 
            href: '/what',
            meganavHeading: 'What We Do',
            meganavLinks: meganavLinks?.What || []
        },
        { 
            label: 'How', 
            href: '/how',
            meganavHeading: 'How We Work',
            meganavLinks: meganavLinks?.How || []
        },
        { 
            label: 'Who', 
            href: '/who',
            meganavHeading: 'Who We Are',
            meganavLinks: meganavLinks?.Who || []
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
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    return (
        <header className={`text-white fixed top-0 left-0 right-0 transition-transform duration-500 z-10 w-full ${isScrollingUp ? '' : '-translate-y-full'} ${isHeaderScrolled ? 'py-4 2xl:py-5 bg-cover bg-center bg-[url("/gradient.png")]' : 'py-7 2xl:py-10'} ${activeMeganav ? '' : ''}`}>
            <Container>
                <div className="flex justify-between items-center">
                    <div className={`transition-all duration-500 ${isHeaderScrolled ? 'w-40 2xl:w-65' : 'w-50 2xl:w-75'}`}> 
                        <div className="text-xl font-bold">
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/">
                                <LottieLogo />
                            </a>
                        </div>
                    </div>
                    <div
                        className="flex-grow"
                        onMouseLeave={!isMobile ? () => setActiveMeganav(null) : undefined}
                    >
                        <div >
                            <div className={`flex justify-end transition-all duration-500 order-last lg:order-first ${isHeaderScrolled ? 'mb-1 2xl:mb-3' : 'md:mb-2 2xl:mb-4'}`}>
                                <nav className="lg:space-x-5 flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0">
                                    {topNavItems.map((item, index) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <a
                                                href={item.href}
                                                key={index}
                                                className={`transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 px-4 py-2 rounded-xl
                                                    ${isActive ? 'text-lightblue' : 'hover:text-lightblue text-white'}
                                                    ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}`}
                                            >
                                                {item.label}
                                            </a>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="flex justify-end">
                                <nav className="lg:space-x-8 2xl:space-x-12 text-lg flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0">
                                    {bottomNavItems.map((item, index) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <div
                                                key={index}
                                                onMouseEnter={!isMobile ? () => setActiveMeganav(item.label) : undefined}
                                                onMouseLeave={!isMobile ? () => setActiveMeganav(null) : undefined}
                                            >
                                                <a
                                                    href={item.href}
                                                    className={`text-3xl 2xl:text-4xl transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 px-4 rounded-xl pt-2
                                                        ${isActive ? 'text-lightblue' : 'hover:text-lightblue text-white'}
                                                        ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}
                                                        ${isHeaderScrolled ? 'pb-6 2xl:pb-7' : 'pb-9 2xl:pb-10'}
                                                        `}
                                                >
                                                    {item.label}
                                                </a>
                                                {/* Meganav dropdown */}
                                                {/* {activeMeganav === item.label && (
                                                    <Meganav
                                                        heading={item.meganavHeading}
                                                        anchorLinks={item.meganavLinks}
                                                        isHeaderScrolled={isHeaderScrolled}
                                                    />
                                                )} */}
                                            </div>
                                        );
                                    })}
                                </nav>
                            </div>
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