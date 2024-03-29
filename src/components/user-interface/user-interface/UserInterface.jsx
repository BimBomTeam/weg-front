import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

const UserInterface = () => {
  const [expanded, setExpanded] = useState(false);

  const animationProps = useSpring({
    height: expanded ? "520px" : "120px",
    config: { duration: 150 },
  });

  const buttonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 400, friction: 20 },
  });

  return (
    <div>
      <animated.div className="user-interface" style={animationProps}>
        <animated.button
          className="expandMenu"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded}
        </animated.button>

        <animated.button
          className="account"
          style={buttonAnimationProps}
        >
        </animated.button>

        <animated.button
          className="difficulty"
          style={buttonAnimationProps}
        >
        </animated.button>

        <animated.button
          className="shop"
          style={buttonAnimationProps}
        >
        </animated.button>

        <animated.button
          className="instruction"
          style={buttonAnimationProps}
        >
        </animated.button>

        <animated.button
          className="settings"
          style={buttonAnimationProps}
        >
        </animated.button>

      </animated.div>
    </div>
  );
};

export default UserInterface;