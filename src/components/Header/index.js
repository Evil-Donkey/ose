'use client'

import { useState, useEffect } from 'react'
import LottieLogo from '../LottieLogo';
import { IconHamburger, IconClose } from "../Icons/Hamburger";
import Container from '../Container';
import { usePathname } from 'next/navigation';
import Meganav from './Meganav';
import Link from 'next/link';
import formatSectionLabel from '@/lib/formatSectionLabel';

const Header = ({ portal, meganavLinks = {}, meganavData = {}, fixed }) => {
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [hideThreshold, setHideThreshold] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const delays = ['delay-150', 'delay-300', 'delay-450', 'delay-600'];
    const pathname = usePathname();
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    const [activeMeganav, setActiveMeganav] = useState(null);

    const topNavItems = [
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Stories', href: '/stories' },
        { label: 'News', href: '/news' },
        { label: 'Shareholder Portal', href: '/shareholder-portal' }
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
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // When scrolling down and past 200px, hide the nav and set the threshold
                    if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
                        setIsScrollingUp(false);
                        setHideThreshold(currentScrollTop);
                    } 
                    // When scrolling up, only show nav if we've scrolled up more than 300px from where it was hidden
                    else if (currentScrollTop < lastScrollTop) {
                        const scrollUpDistance = hideThreshold - currentScrollTop;
                        if (scrollUpDistance >= 300 || currentScrollTop <= 200) {
                            setIsScrollingUp(true);
                        }
                    }
                    
                    if (currentScrollTop > 0) {
                        setIsHeaderScrolled(true);
                    } else {
                        setIsHeaderScrolled(false);
                    }
                    setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        if (!isMobileMenuOpen) {
            window.addEventListener('scroll', handleScroll, { passive: true });
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
        <header className={`text-white fixed top-0 left-0 right-0 transition-transform transition-padding duration-300 z-99 w-full ${isScrollingUp ? '' : '-translate-y-full'} ${isHeaderScrolled ? 'pt-2 pb-3 2xl:py-5 bg-cover bg-center bg-[url("/gradient.png")]' : 'pt-7 pb-7 2xl:py-10'} ${fixed ? 'bg-[url("/gradient.png")]! bg-cover bg-center' : ''}`}>
            <Container>
                <div className="flex justify-between items-center">
                    <div className={`transition-all duration-500 ${isHeaderScrolled ? 'w-40 2xl:w-65' : 'w-50 2xl:w-75'}`}> 
                        <div className="text-xl font-bold">
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <Link href="/" aria-label="Oxford Science Enterprises - Go to homepage">
                                <LottieLogo />
                            </Link>
                        </div>
                    </div>
                    <div
                        className="flex-grow"
                        onMouseLeave={!isMobile ? () => setActiveMeganav(null) : undefined}
                    >
                        <div className={`transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col items-center lg:items-end justify-center lg:justify-start gap-5 lg:gap-0 absolute top-0 left-0 w-svw h-svh lg:h-auto lg:w-auto bg-blue-02 lg:bg-transparent lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-none'}`}>
                            <div className={`flex justify-end transition-all duration-500 order-last lg:order-first ${isHeaderScrolled ? 'mb-0 2xl:mb-3' : 'md:mb-2 2xl:mb-4'}`}>
                                <nav className={`space-x-4 ${isHeaderScrolled ? 'lg:space-x-6' : 'xl:space-x-9'} flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0`}>
                                    {topNavItems.map((item, index) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                href={item.href}
                                                key={index}
                                                className={`transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 pt-2 rounded-xl
                                                    ${isActive ? 'text-lightblue' : 'hover:text-lightblue text-white'}
                                                    ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}
                                                    ${isHeaderScrolled ? 'pb-1' : 'pb-2'}
                                                `}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div className="flex justify-end">
                                <nav className="lg:space-x-12 2xl:space-x-16 text-lg flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-start gap-3 lg:gap-0">
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
                                                    className={`transition duration-300 lg:opacity-100 lg:translate-x-0 lg:delay-0 rounded-xl pt-2
                                                        ${isActive ? 'text-lightblue' : 'hover:text-lightblue text-white'}
                                                        ${isMobileMenuOpen ? `translate-x-0 opacity-100 ${delays[index]}` : '-translate-x-full opacity-0'}
                                                        ${isHeaderScrolled ? 'pb-3 2xl:pb-7 text-2xl' : 'pb-9 2xl:pb-10 text-3xl 2xl:text-4xl'}
                                                    `}
                                                >
                                                    {item.label}
                                                </Link>
                                                {/* Meganav dropdown */}
                                                <div
                                                    className={`absolute left-0 top-0 px-8 2xl:pt-50 pb-20 w-full bg-darkblue text-white rounded-b-3xl -z-1 transition-opacity duration-300 
                                                    ${activeMeganav === item.label ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'}
                                                    ${isHeaderScrolled ? 'pt-30' : 'pt-40'}
                                                    `}
                                                >
                                                    <Meganav
                                                        heading={item.meganavHeading}
                                                        anchorLinks={item.meganavLinks}
                                                        isHeaderScrolled={isHeaderScrolled}
                                                        pagePath={item.href}
                                                        pageLinks={item.meganavPageLinks}
                                                    />
                                                </div>
                                                
                                                <div className={`flex gap-10 absolute pt-12 ps-0 w-full 2xl:w-auto
                                                    ${activeMeganav === item.label ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'}                                 
                                                `}>
                                                    <div className={`${item.meganavPageLinks && item.meganavPageLinks.links && item.meganavPageLinks.links.length > 0 ? 'w-auto 2xl:w-1/2' : 'w-auto'}`}>
                                                        <ul className="space-y-3">
                                                            {item.meganavLinks.map(({ sectionLabel }) => (
                                                                <li key={formatSectionLabel(sectionLabel)} className="flex gap-2 items-start">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 7.7 9.8"
                                                                        width={16}
                                                                        height={16}
                                                                        fill="none"
                                                                        className="mt-1 2xl:mt-2 flex-shrink-0 min-w-[16px] min-h-[16px]"
                                                                    >
                                                                        <g>
                                                                            <path
                                                                                d="M3.9 9.3V.5M3.9 9.3L.5 6M3.9 9.3l3.4-3.3"
                                                                                stroke="#fff"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </g>
                                                                    </svg>
                                                                    <Link
                                                                        href={`${item.href}#${formatSectionLabel(sectionLabel)}`}
                                                                        className="hover:text-lightblue transition-colors text-sm 2xl:text-lg font-medium"
                                                                    >
                                                                        {sectionLabel}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    
                                                    {item.label === 'What' && (
                                                        <div className="w-1/2">
                                                            <div>
                                                                <div className="text-lightblue text-sm 2xl:text-lg mb-4 font-medium">Our Sectors:</div>
                                                                <ul className="space-y-2">
                                                                    <li className="flex gap-2">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="13"
                                                                            viewBox="0 0 9.75 7.73"
                                                                            fill="none"
                                                                            className="mt-1 2xl:mt-2 flex-shrink-0 min-w-[16px] min-h-[16px]"
                                                                            >
                                                                            <g>
                                                                                <path
                                                                                d="M9.25 3.87H0.5M9.25 3.87l-3.28 3.37M9.25 3.87L5.97 0.5"
                                                                                stroke="#fff"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                />
                                                                            </g>
                                                                        </svg>
                                                                        <a
                                                                            href='/deep-tech'
                                                                            className="hover:text-lightblue transition-colors text-sm 2xl:text-lg font-medium"
                                                                            aria-label="Learn about our Deep Tech sector"
                                                                        >
                                                                            Deep Tech
                                                                        </a>
                                                                    </li>
                                                                    <li className="flex gap-2">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="13"
                                                                            viewBox="0 0 9.75 7.73"
                                                                            fill="none"
                                                                            className="mt-1 2xl:mt-2 flex-shrink-0 min-w-[16px] min-h-[16px]"
                                                                            >
                                                                            <g>
                                                                                <path
                                                                                d="M9.25 3.87H0.5M9.25 3.87l-3.28 3.37M9.25 3.87L5.97 0.5"
                                                                                stroke="#fff"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                />
                                                                            </g>
                                                                        </svg>
                                                                        <a
                                                                            href='/life-sciences'
                                                                            className="hover:text-lightblue transition-colors text-sm 2xl:text-lg font-medium"
                                                                            aria-label="Learn about our Life Sciences sector"
                                                                        >
                                                                            Life Sciences
                                                                        </a>
                                                                    </li>
                                                                    <li className="flex gap-2">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="13"
                                                                            viewBox="0 0 9.75 7.73"
                                                                            fill="none"
                                                                            className="mt-1 2xl:mt-2 flex-shrink-0 min-w-[16px] min-h-[16px]"
                                                                            >
                                                                            <g>
                                                                                <path
                                                                                d="M9.25 3.87H0.5M9.25 3.87l-3.28 3.37M9.25 3.87L5.97 0.5"
                                                                                stroke="#fff"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                />
                                                                            </g>
                                                                        </svg>
                                                                        <a
                                                                            href='/health-tech'
                                                                            className="hover:text-lightblue transition-colors text-sm 2xl:text-lg font-medium"
                                                                            aria-label="Learn about our HealthTech sector"
                                                                        >
                                                                            HealthTech
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
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