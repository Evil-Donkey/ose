'use client'

import { useState, useEffect } from 'react'
import Link from "next/link";
import Logo from "../Icons/Logo";

const Header = ({ portal }) => {

    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <header className={`text-white fixed top-0 left-0 right-0 transition-all duration-500 z-10 w-full ${isScrollingUp ? '' : '-translate-y-full'} ${isHeaderScrolled ? 'py-5 bg-cover bg-center bg-[url("/gradient.png")]' : 'py-10'}`}>
            {/* <div className={`${styles.mobileMenuBackground} ${isMobileMenuOpen ? styles.mobileMenuBackgroundActive : ''}`} /> */}
            <div className="container mx-auto px-4 md:px-10">
                <div className="flex justify-between items-center">
                    <div className="w-75">
                        <div className="text-xl font-bold">
                            <Link href="/">
                                <Logo />
                            </Link>
                        </div>
                    </div>

                    <div className="w-auto">
                        <div className="flex justify-end mb-4">
                            <nav className="hidden md:flex space-x-5">
                                <Link href="/portfolio" className="hover:underline transition">Portfolio</Link>
                                <Link href="/stories" className="hover:underline transition">Stories</Link>
                                <Link href="/news" className="hover:underline transition">News</Link>
                                <Link href="/investor-portal" className="hover:underline transition">Investor Portal</Link>
                            </nav>
                        </div>

                        <div className="flex justify-end">
                            <nav className="md:space-x-6 lg:space-x-12 text-lg hidden md:flex">
                                <Link href="/why" className="text-4xl hover:text-lightblue transition-colors">Why</Link>
                                <Link href="/what" className="text-4xl hover:text-lightblue transition-colors">What</Link>
                                <Link href="/how" className="text-4xl hover:text-lightblue transition-colors">How</Link>
                                <Link href="/who" className="text-4xl hover:text-lightblue transition-colors">Who</Link>
                            </nav>

                            <button className="md:hidden cursor-pointer" aria-label="Open Menu">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header; 