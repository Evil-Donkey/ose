'use client';
import { useEffect, useState } from 'react';
import Header from './index';
import getMeganavLinks from '@/lib/getMeganavLinks';

export default function HeaderWithMeganavLinks(props) {
  const [meganavLinks, setMeganavLinks] = useState({});

  useEffect(() => {
    getMeganavLinks().then(setMeganavLinks);
  }, []);

  return <Header {...props} meganavLinks={meganavLinks} />;
} 