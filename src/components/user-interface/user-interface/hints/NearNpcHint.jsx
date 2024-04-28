import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const NearNpcHint = ({ isVisible }) => {
  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   setIsVisible(true);
  // }, []);

  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(120%)",
  });

  if (isVisible)
    return (
      <div className="container">
        <p id="paragraphLeft">Press</p>
        <img src="/images/pressE.png" className="pressE" />
        <p id="paragraphRight">to talk</p>
      </div>
    );
  // else return <></>;
};

export default NearNpcHint;
