import React from 'react';
import Container from '../Container';

const Meganav = ({ heading, anchorLinks = [], pagePath, pageLinks }) => {
  return (
    <Container className="flex">
        <div className="w-2/5 2xl:w-1/2 pr-18 flex items-start">
            <h2 className="text-[5rem]/23" dangerouslySetInnerHTML={{ __html: heading }} />
        </div>
    </Container>
  );
};

export default Meganav; 