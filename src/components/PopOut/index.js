import React, { useState } from 'react';
import Button from '../Button';

const PopOut = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-92.5'}`}>
      {/* Vertical Tab */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center cursor-pointer justify-center bg-lightblue text-white p-2 md:p-4 rounded-l-2xl shadow-lg focus:outline-none transition-colors duration-300"
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
        <span className="tracking-widest font-medium mb-2">WORK WITH US</span>
      </button>
      {/* Sliding Panel */}
      <div className="bg-darkblue text-white shadow-lg w-[370px] max-w-full p-8 flex flex-col justify-center">
        <div className="space-y-8">
          <div>
            <div className="font-medium text-lg">Oxford Researchers</div>
            <div className="mb-4">Got breakthrough science?<br />Let's build your spinout.</div>
            <Button href="/contact">START THE CONVERSATION</Button>
          </div>
          <div>
            <div className="font-medium text-lg">Investors</div>
            <div className="mb-4">Ready to back Oxford's<br />most exciting spinouts?</div>
            <Button href="/contact">EMAIL US TODAY</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopOut;
