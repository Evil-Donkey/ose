const MailIcon = ({ email, className = "" }) => {
  return (
    <a 
      href={`mailto:${email}`} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`inline-flex items-center justify-center w-6.5 h-6.5 rounded-full bg-lightblue transition-colors duration-200 ${className}`}
      aria-label={`Send email to ${email}`}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="text-white"
      >
        <path 
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <polyline 
          points="22,6 12,13 2,6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export default MailIcon;
