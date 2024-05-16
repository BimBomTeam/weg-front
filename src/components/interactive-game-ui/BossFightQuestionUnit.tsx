import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import BossFightButton from "./BossFightButton";
import store from "../../store/store";

const QuestionUnit = ({
  quizUnit,
  onAnswerClick,
  isVisible,
  onTimeFinish,
  loading,
}) => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    setKey(key + 1);
  }, [quizUnit]);

  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(150%)",
  });

  const questionAnimationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(-150%)",
  });
  const capitalizeFirstLetter = (str) => {
    if (loading) return "";
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="BossFightContainer" style={{ justifyContent: "center" }}>
      <animated.button className="Question" style={questionAnimationProps}>
        {capitalizeFirstLetter(quizUnit.word)}
      </animated.button>
      <animated.div className="Answers" style={animationProps}>
        {quizUnit.answers.map((answer, idx) => {
          return (
            <BossFightButton
              text={capitalizeFirstLetter(answer.answer)}
              onClick={() => (loading ? () => {} : onAnswerClick(answer))}
              key={idx}
            />
          );
        })}
      </animated.div>
      <div className="clock-container">
        <animated.div className="clock-bg" style={questionAnimationProps}>
          <CountdownCircleTimer
            isPlaying
            duration={10}
            colors={`#004777`} //{["#004777"]}
            onComplete={onTimeFinish}
            key={key}
          >
            {({ remainingTime }) => <div className="time">{remainingTime}</div>}
          </CountdownCircleTimer>
        </animated.div>
      </div>
    </div>
  );
};

export default QuestionUnit;
