import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

const UserInterface = () => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const animationProps = useSpring({
    height: expanded ? "520px" : "120px",
    config: { duration: 150 },
  });

  const buttonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 400, friction: 20 },
  });

  const toggleModal = (title) => {
    setShowModal(!showModal);
    setModalTitle(title);
  };

  return (
    <div>
      <animated.div className="user-interface" style={animationProps}>
        <animated.button
          className="expandMenu"
          onClick={() => setExpanded(!expanded)}>
        </animated.button>

        <animated.button
          className="account"
          style={buttonAnimationProps}
          onClick={() => toggleModal("Account")} >
        </animated.button>

        <animated.button
          className="difficulty"
          style={buttonAnimationProps}
          onClick={() => toggleModal("Difficulty")} >
        </animated.button>

        <animated.button
          className="shop"
          style={buttonAnimationProps}
          onClick={() => toggleModal("Shop")}>
        </animated.button>

        <animated.button
          className="instruction"
          style={buttonAnimationProps}
          onClick={() => toggleModal("Instruction")}>
        </animated.button>

        <animated.button
          className="settings"
          style={buttonAnimationProps}
          onClick={() => toggleModal("Settings")} >
        </animated.button>
      </animated.div>

      {showModal && (
        <div className="modal-background">
          <animated.div className="modal">
            <h1>{modalTitle}</h1>
            <button className="back-button" onClick={toggleModal}></button>
          </animated.div>
        </div>
      )}
    </div>
  );
};

export default UserInterface;