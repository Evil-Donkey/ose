'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Button = React.forwardRef(({ children, href, className, ...props }, ref) => {
    const router = useRouter();
    
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
            className={`bg-lightblue text-white text-sm lg:text-xs xl:text-base font-normal px-6 py-3 rounded-full shadow hover:bg-darkblue text-center transition-colors cursor-pointer w-max uppercase ${className}`} 
            {...props}
        >
            {children}
        </Link>
    ) : (
        <button 
            ref={ref} 
            className={`bg-lightblue text-white text-sm lg:text-xs xl:text-base font-normal px-6 py-3 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase ${className}`}
            {...props}
        >{children}</button>
    )
});

Button.displayName = 'Button';

export default Button;