import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const WordButton = ({ text, learned, onClick, sumOfWordLengths }) => {
  const [toggle, setToggle] = useState(false);
  const { opacity } = useSpring({
    opacity: toggle ? 1 : 0,
    config: { duration: 500 }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToggle(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const onHandleClick = () => {
    onClick(text);
  };

  const isLearned = learned === "InProgress" ? false : learned || false;

  const buttonStyle = {
    background: isLearned
      ? "linear-gradient(45deg, #F8F0F0 0%, #74FF8A 100%)"
      : "linear-gradient(45deg, #F8F0F0 0%, #C2E9EE 100%)",
    fontSize: sumOfWordLengths > 60 ? "15px" : sumOfWordLengths > 40 ? "18px" : "inherit"
  };

  return (
    <animated.button
      style={{ ...buttonStyle, opacity }}
      className="word"
      onClick={onHandleClick}
    >
      {text}
    </animated.button>
  );
};

export default WordButton;