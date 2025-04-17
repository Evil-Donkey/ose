import React from 'react';

const Button = React.forwardRef(({ children, className, ...props }, ref) => {
    return (
        <button 
            ref={ref} 
            className={`bg-lightblue text-white font-normal px-6 py-2 rounded-full shadow hover:bg-darkblue transition-colors cursor-pointer w-max uppercase opacity-0 translate-y-5 ${className}`}
            {...props}
        >{children}</button>
    )
});

Button.displayName = 'Button';

export default Button;