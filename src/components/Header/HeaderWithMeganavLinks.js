'use client';
import Header from './index';

/**
 * Client component wrapper for Header that accepts meganav data as props
 * This data should be fetched server-side using HeaderServer component
 */
export default function HeaderWithMeganavLinks({ meganavLinks = {}, meganavData = {}, ...props }) {
  return <Header {...props} meganavLinks={meganavLinks} meganavData={meganavData} />;
} 