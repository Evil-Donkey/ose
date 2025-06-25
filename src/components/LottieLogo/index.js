import Lottie from 'lottie-react';
import Logo from "../../../public/lottie/logo.json";

const LottieLogo = () => {

  return (
    <div>
      <Lottie 
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