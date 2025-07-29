export function Spinner({ className = "", size = 20 }) {
    return (
        <svg 
            className={`animate-spin ${className}`}
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeDasharray="31.416" 
                strokeDashoffset="31.416"
                className="animate-spin"
                style={{
                    animation: 'spin 1s linear infinite',
                }}
            />
        </svg>
    );
} 