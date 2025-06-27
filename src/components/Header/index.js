'use client'

import { useState, useEffect } from 'react'
import LottieLogo from '../LottieLogo';
import { IconHamburger, IconClose } from "../Icons/Hamburger";
import Container from '../Container';
import { usePathname } from 'next/navigation';
import Meganav from './Meganav';
import Link from 'next/link';

const Header = ({ portal, meganavLinks = {}, meganavData = {} }) => {
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const delays = ['delay-150', 'delay-300', 'delay-450', 'delay-600'];
    const pathname = usePathname();
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    const [activeMeganav, setActiveMeganav] = useState(null);

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
            meganavHeading: 'Why<br/>We Exist',
            meganavLinks: meganavLinks?.Why || [],
            meganavPageLinks: meganavData?.Why?.pageLinks || null
        },
        { 
            label: 'What', 
            href: '/what',
            meganavHeading: 'What<br/>We Do',
            meganavLinks: meganavLinks?.What || [],
            meganavPageLinks: meganavData?.What?.pageLinks || null
        },
        { 
            label: 'How', 
            href: '/how',
            meganavHeading: 'How<br/>We Work',
            meganavLinks: meganavLinks?.How || [],
            meganavPageLinks: meganavData?.How?.pageLinks || null
        },
        { 
            label: 'Who', 
            href: '/who',
            meganavHeading: 'Who<br/>We Are',
            meganavLinks: meganavLinks?.Who || [],
            meganavPageLinks: meganavData?.Who?.pageLinks || null
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

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Wait for the page to render
        setTimeout(() => {
          if (window.location.hash) {
            const el = document.getElementById(window.location.hash.substring(1));
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 100); // Delay to ensure DOM is ready
      }, []);

    return (
        <header className={`text-white fixed top-0 left-0 right-0 transition-transform transition-padding duration-300 z-99 w-full ${isScrollingUp ? '' : '-translate-y-full'} ${isHeaderScrolled ? 'py-4 2xl:py-5 bg-cover bg-center bg-[url("/gradient.png")]' : 'py-7 2xl:py-10'}`}>
            <Container>
                <div className="flex justify-between items-center">
                    <div className={`transition-all duration-500 ${isHeaderScrolled ? 'w-40 2xl:w-65' : 'w-50 2xl:w-75'}`}> 
                        <div className="text-xl font-bold">
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <Link href="/">
                                <LottieLogo />
                            </Link>
                        </div>
                    </div>
                    <div
                        className="flex-grow"
                        onMouseLeave={!isMobile ? () => setActiveMeganav(null) : undefined}
                    >
                        <div className={`transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col items-center lg:items-end justify-center lg:justify-start gap-5 lg:gap-0 absolute top-0 left-0 w-svw h-svh lg:h-auto lg:w-auto bg-blue-02 lg:bg-transparent lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-none'}`}>
                            <div className={`flex justify-end transition-all duration-500 order-last lg:order-first ${isHeaderScrolled ? 'mb-1 2xl:mb-3' : 'md:mb-2 2xl:mb-4'}`}>
                                <nav className="lg:space-x-5 flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0">
                                    {topNavItems.map((item, index) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                href={item.href}
                                                key={index}
                                                className={`transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 px-4 py-2 rounded-xl
                                                    ${isActive ? 'text-lightblue' : 'hover:text-lightblue text-white'}
                                                    ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}`}
                                            >
                                                {item.label}
                                            </Link>
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
                                                <Link
                                                    href={item.href}
                                                    className={`text-3xl 2xl:text-4xl transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 px-4 rounded-xl pt-2
                                                        ${isActive ? 'text-lightblue' : 'hover:text-lightblue text-white'}
                                                        ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}
                                                        ${isHeaderScrolled ? 'pb-6 2xl:pb-7' : 'pb-9 2xl:pb-10'}
                                                        `}
                                                >
                                                    {item.label}
                                                </Link>
                                                {/* Meganav dropdown */}
                                                <div
                                                    className={`absolute left-0 top-0 px-8 pt-40 2xl:pt-50 pb-20 w-full bg-darkblue text-white rounded-b-3xl -z-1 transition-opacity duration-300 ${
                                                        activeMeganav === item.label ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'
                                                    }`}
                                                >
                                                    <Meganav
                                                        heading={item.meganavHeading}
                                                        anchorLinks={item.meganavLinks}
                                                        isHeaderScrolled={isHeaderScrolled}
                                                        pagePath={item.href}
                                                        pageLinks={item.meganavPageLinks}
                                                    />
                                                </div>
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