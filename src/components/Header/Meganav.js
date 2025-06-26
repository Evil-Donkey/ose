import React from 'react';
import formatSectionLabel from '@/lib/formatSectionLabel';
import Container from '../Container';
import Link from 'next/link';

const Meganav = ({ heading, anchorLinks = [], pagePath, pageLinks }) => {
  return (
    <Container className="flex px-8 py-20">
        <div className="w-1/2 pr-18 flex items-start">
            <h2 className="text-7xl/18 md:text-8xl/23 2xl:text-8xl/27" dangerouslySetInnerHTML={{ __html: heading }} />
        </div>
        
        <div className="w-1/2 flex gap-10 justify-between">
            <div className="w-1/3">
                <ul className="space-y-4">
                    {anchorLinks.map(({ sectionLabel }) => (
                        <li key={formatSectionLabel(sectionLabel)} className="flex gap-2 items-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 7.7 9.8"
                                width={16}
                                height={16}
                                fill="none"
                                className="mt-1 flex-shrink-0 min-w-[16px] min-h-[16px]"
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
                                href={`${pagePath}#${formatSectionLabel(sectionLabel)}`}
                                className="hover:text-lightblue transition-colors text-xl font-medium"
                            >
                                {sectionLabel}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="w-1/3">
                {pageLinks && pageLinks.links && pageLinks.links.length > 0 && (
                    <div>
                        {pageLinks.heading && (
                            <div className="text-lightblue text-xl mb-4 font-medium">{pageLinks.heading}</div>
                        )}
                        <ul className="space-y-2">
                            {pageLinks.links.map((linkObj, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="13"
                                        viewBox="0 0 9.75 7.73"
                                        fill="none"
                                        className="mt-2"
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
                                        href={linkObj.link?.link || '#'}
                                        className="hover:text-lightblue transition-colors text-xl font-medium"
                                    >
                                        {linkObj.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </Container>
  );
};

export default Meganav; 