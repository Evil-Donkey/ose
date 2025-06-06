import React from 'react';
import Link from 'next/link';
const Button = React.forwardRef(({ children, href, className, ...props }, ref) => {
    return href ? (
        <Link href={href} className={`bg-lightblue text-white font-normal px-6 py-3 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase ${className}`} {...props}>{children}</Link>
    ) : (
        <button 
            ref={ref} 
            className={`bg-lightblue text-white font-normal px-6 py-3 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase ${className}`}
            {...props}
        >{children}</button>
    )
});

Button.displayName = 'Button';

export default Button;