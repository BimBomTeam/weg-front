import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const UiBossFight = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(150%)",
  });

  const questionAnimationProps= useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-150%)",
  });

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.keyCode === 27) {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="BossFightContainer" style={{ justifyContent: "center" }}>
      <animated.button className="Question" style={questionAnimationProps}>Dokąd nocą tupta jeż, możesz wiedzieć jeśli chcesz</animated.button>
      <animated.div className="Answers" style={animationProps}>
        <button className="Answer1">Brzęczyszczykiewicz</button>
        <button className="Answer2">Brzęczyszczykiewicz</button>
        <button className="Answer3">Dokąd nocą tupta jeż, możesz wiedzieć jeśli chcesz</button>
        <button className="Answer4">Brzęczyszczykiewicz</button>
      </animated.div>
        <div className="clock-container">
        <animated.div className="clock-bg" style={questionAnimationProps}>
          <CountdownCircleTimer
            isPlaying
            duration={60}
            colors={[
              '#004777',
            ]}
          >
            {({ remainingTime }) => (
              <div className="time">
                {remainingTime}
              </div>
            )}
          </CountdownCircleTimer>
          </animated.div>
        </div>

    </div>
  );
};

export default UiBossFight;
