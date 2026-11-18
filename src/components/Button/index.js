'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePageTheme, getButtonColourClasses } from '@/components/PageTheme';

const Button = React.forwardRef(({ children, href, className, variant, colour, ...props }, ref) => {
    const router = useRouter();
    const theme = usePageTheme();
    const colourClasses = getButtonColourClasses(colour ?? (variant === 'pink' ? 'pink' : theme));
    
    const handleClick = (e) => {
        if (href && href.includes('?')) {
            e.preventDefault();
            router.push(href);
            // Scroll to top after navigation
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
    };

    return href ? (
        <Link 
            href={href} 
            onClick={handleClick}
            className={`${colourClasses} text-white text-sm lg:text-xs xl:text-base font-normal px-6 py-3 rounded-full shadow text-center transition-colors cursor-pointer w-max uppercase ${className}`} 
            {...props}
        >
            {children}
        </Link>
    ) : (
        <button 
            ref={ref} 
            className={`${colourClasses} text-white text-sm lg:text-xs xl:text-base font-normal px-6 py-3 rounded-full shadow transition-colors cursor-pointer w-max uppercase ${className}`}
            {...props}
        >{children}</button>
    )
});

Button.displayName = 'Button';

export default Button;