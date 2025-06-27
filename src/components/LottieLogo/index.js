"use client";

import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lottie from 'lottie-react';
import Logo from "../../../public/lottie/logo.json";

const LottieLogo = () => {
  const lottieRef = useRef();
  const pathname = usePathname();

  useEffect(() => {
    if (lottieRef.current) {
      // Restart the animation from the beginning
      lottieRef.current.playSegments([0, 60], true);
    }
  }, [pathname]); // This will trigger whenever the pathname changes

  return (
    <div>
      <Lottie 
        lottieRef={lottieRef}
        animationData={Logo} 
        loop={false} 
        autoplay={true}
        initialSegment={[0, 60]}
        height={400} 
        width={400} 
      />
    </div>
  );
};

export default LottieLogo;