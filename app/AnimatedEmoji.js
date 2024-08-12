import React from 'react';
import Lottie from 'lottie-react';
import animationData from './lottie (1).json'; // Replace with the path to your JSON file

const AnimatedEmoji = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%', // or adjust as needed
      height: '100%' // or adjust as needed
    }}>
      <Lottie
        animationData={animationData}
        loop={true}  // Set to false if you want it to play only once
        style={{ width: 60, height: 60}} // Adjust size as needed
      />
    </div>
  );
};

export { AnimatedEmoji }; 