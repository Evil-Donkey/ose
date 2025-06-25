import React, { useState } from 'react';
import Button from '../Button';

const PopOut = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log(data);

  // Use WordPress data if available, otherwise fall back to default content
  const popoutLabel = data?.popoutLabel || 'WORK WITH US';
  const popoutContent = data?.popoutContent || [];

  return (
    <div className={`flex flex-col md:flex-row fixed bottom-0 md:bottom-auto right-1/2 translate-x-1/2 md:right-0 md:top-1/2 md:-translate-y-1/2 z-50 transition-transform duration-300 ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-82 md:translate-x-92.5'}`}>
      {/* Vertical Tab */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="items-center cursor-pointer justify-center bg-lightblue text-white p-2 md:p-4 rounded-l-2xl shadow-lg focus:outline-none transition-colors duration-300 hidden md:flex"
        style={{ writingMode: 'sideways-lr', textOrientation: 'mixed' }}
        aria-label="Toggle Work With Us Panel"
      >
        <span
          className={`mt-4 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
        >
          {/* Down or right arrow (SVG) */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className="tracking-widest font-medium mb-2 uppercase">{popoutLabel}</span>
      </button>

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center cursor-pointer justify-center bg-lightblue text-white p-2 md:p-4 rounded-t-2xl shadow-lg focus:outline-none transition-colors duration-300 md:hidden"
        aria-label="Toggle Work With Us Panel"
      >
        <span
          className={`me-2 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-270'}`}
        >
          {/* Down or right arrow (SVG) */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className="tracking-widest font-medium uppercase">{popoutLabel}</span>
      </button>
      {/* Sliding Panel */}
      <div className="bg-darkblue text-white shadow-lg w-[370px] max-w-full p-8 flex flex-col justify-center">
        <div className="space-y-8">
          {popoutContent.map((content, index) => (
            <div key={index}>
              <div className="font-medium text-lg">{content.heading}</div>
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: content.copy }} />
              <Button href={content.ctaUrl}>{content.ctaLabel}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopOut;
