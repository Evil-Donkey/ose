import React from 'react';

// function formatAnchorText(sectionLabel) {
//   if (!sectionLabel) return '';
//   return sectionLabel
//     .replace(/-/g, ' ')
//     .replace(/\b\w/g, l => l.toUpperCase());
// }

// add function to format sectionLabel to lowercase, remove spaces and symbols or dots or quote marks and replace with dashes
function formatSectionLabel(sectionLabel) {
  if (!sectionLabel) return '';
  return sectionLabel
    .replace(/\./g, '')
    .replace(/’/g, '')
    .replace(/“/g, '')
    .replace(/”/g, '')
    .replace(/’/g, '')
    .replace(/“/g, '')
    .replace(/”/g, '')
    .replace(/’/g, '')
    .replace(/“/g, '')
    .replace(/\s/g, '-')
    .toLowerCase();
}

const Meganav = ({ isHeaderScrolled, heading, anchorLinks = [] }) => {
  return (
    <div
      className={`fixed left-0 ${isHeaderScrolled ? 'top-[110px]' : 'top-[140px]'} w-full bg-darkblue text-white z-30 flex p-8 rounded-b-3xl`}
    >
      {/* Column 1: Heading */}
      <div className="w-1/3 pr-8 flex items-start">
        <h2 className="text-4xl font-bold whitespace-nowrap">{heading}</h2>
      </div>
      {/* Column 2: Anchor Links */}
      <div className="w-1/3">
        <ul className="space-y-4">
          {anchorLinks.map(({ sectionLabel }) => (
            <li key={formatSectionLabel(sectionLabel)}>
              <a href={`#${formatSectionLabel(sectionLabel)}`} className="hover:text-lightblue transition-colors text-2xl">
                {sectionLabel}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Column 3: (reserved for future content) */}
      <div className="w-1/3"></div>
    </div>
  );
};

export default Meganav; 