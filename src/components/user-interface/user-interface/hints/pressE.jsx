import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const PressE = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(120%)",
  });

  return (
    <div className="container">
        <p id="paragraphLeft">Press</p>
        <p id="paragraphCenter">E</p>
        <p id="paragraphRight">to talk</p>
    </div>
  );
};

export default PressE;
