import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const UiBossFight = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(120%)",
  });
  const questionAnimationProps= useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-120%)",
  });

  return (
    <div className="BossFightContainer" style={{ justifyContent: "center" }}>
      <animated.button className="Question"style={questionAnimationProps}>Question</animated.button>
      <animated.div className="Answers" style={animationProps}>
        <button className="Answer1">Answer1</button>
        <button className="Answer2">Answer2</button>
        <button className="Answer3">Answer3</button>
        <button className="Answer4">Answer4</button>
      </animated.div>
    </div>
  );
};

export default UiBossFight;
