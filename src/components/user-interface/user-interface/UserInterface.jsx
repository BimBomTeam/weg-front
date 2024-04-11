import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import AccountModal from './modals/AccountModal';
import DifficultyModal from './modals/DifficultyModal';
import ShopModal from './modals/ShopModal';
import InstructionModal from './modals/InstructionModal';
import SettingsModal from './modals/SettingsModal';


const UserInterface = () => {
  const [expanded, setExpanded] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openDifficultyModal, setOpenDifficultyModal] = useState(false);
  const [openShopModal, setOpenShopModal] = useState(false);
  const [openInstructionModal, setOpenInstructionModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);


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
          onClick={() => setExpanded(!expanded)}>
        </animated.button>

        <animated.button
          className="account"
          style={buttonAnimationProps}
          onClick={() => setOpenAccountModal(true)} >
        </animated.button>

        <animated.button
          className="difficulty"
          style={buttonAnimationProps}
          onClick={() => setOpenDifficultyModal(true)} >
        </animated.button>

        <animated.button
          className="shop"
          style={buttonAnimationProps}
          onClick={() => setOpenShopModal(true)} >
        </animated.button>

        <animated.button
          className="instruction"
          style={buttonAnimationProps}
          onClick={() => setOpenInstructionModal(true)} >
        </animated.button>

        <animated.button
          className="settings"
          style={buttonAnimationProps}
          onClick={() => setOpenSettingsModal(true)} >
        </animated.button>
      </animated.div>

      {openAccountModal && <AccountModal closeModal={setOpenAccountModal} />}
      {openDifficultyModal && <DifficultyModal closeModal={setOpenDifficultyModal} />}
      {openShopModal && <ShopModal closeModal={setOpenShopModal} />}
      {openInstructionModal && <InstructionModal closeModal={setOpenInstructionModal} />}
      {openSettingsModal && <SettingsModal closeModal={setOpenSettingsModal} />}


    </div>
  );
};

export default UserInterface;