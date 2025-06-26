'use client';
import { useEffect, useState } from 'react';
import Header from './index';
import getMeganavLinks from '@/lib/getMeganavLinks';
import getMeganavData from '@/lib/getMeganavData';

export default function HeaderWithMeganavLinks(props) {
  const [meganavLinks, setMeganavLinks] = useState({});
  const [meganavData, setMeganavData] = useState({});

  useEffect(() => {
    getMeganavLinks().then(setMeganavLinks);
    getMeganavData().then(setMeganavData);
  }, []);

  return <Header {...props} meganavLinks={meganavLinks} meganavData={meganavData} />;
} 