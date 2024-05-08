import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import AccountModal from "./modals/AccountModal";
import DifficultyModal from "./modals/DifficultyModal";
import ShopModal from "./modals/ShopModal";
import InstructionModal from "./modals/InstructionModal";
import SettingsModal from "./modals/SettingsModal";

const UserInterface = () => {
  const [expanded, setExpanded] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openDifficultyModal, setOpenDifficultyModal] = useState(false);
  const [openShopModal, setOpenShopModal] = useState(false);
  const [openInstructionModal, setOpenInstructionModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function getStyles(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  }

  const animationProps = useSpring({
    height: expanded
      ? `${getStyles("--animationProps_height_true")}`
      : `${getStyles("--animationProps_height_false")}`,
    config: { duration: 400 },
  });

  const accountButtonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 700, friction: 30 },
    delay: expanded ? 300 : 0,
  });

  const difficultyButtonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 700, friction: 30 },
    delay: expanded ? 400 : 10,
  });

  const shopButtonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 700, friction: 30 },
    delay: expanded ? 500 : 20,
  });

  const instructionButtonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 700, friction: 30 },
    delay: expanded ? 600 : 50,
  });

  const settingsButtonAnimationProps = useSpring({
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? "auto" : "none",
    config: { tension: 700, friction: 30 },
    delay: expanded ? 700 : 40,
  });

  return (
    <div>
      <animated.div className="user-interface" style={animationProps}>
        <animated.button
          className="expandMenu"
          onClick={() => setExpanded(!expanded)}
        ></animated.button>

        <animated.button
          className="account"
          style={accountButtonAnimationProps}
          onClick={() => setOpenAccountModal(true)}
        ></animated.button>

        <animated.button
          className="difficulty"
          style={difficultyButtonAnimationProps}
          onClick={() => setOpenDifficultyModal(true)}
        ></animated.button>

        <animated.button
          className="shop"
          style={shopButtonAnimationProps}
          onClick={() => setOpenShopModal(true)}
        ></animated.button>

        <animated.button
          className="instruction"
          style={instructionButtonAnimationProps}
          onClick={() => setOpenInstructionModal(true)}
        ></animated.button>

        <animated.button
          className="settings"
          style={settingsButtonAnimationProps}
          onClick={() => setOpenSettingsModal(true)}
        ></animated.button>
      </animated.div>

      {openAccountModal && <AccountModal closeModal={setOpenAccountModal} />}
      {openDifficultyModal && (
        <DifficultyModal closeModal={setOpenDifficultyModal} />
      )}
      {openShopModal && <ShopModal closeModal={setOpenShopModal} />}
      {openInstructionModal && (
        <InstructionModal closeModal={setOpenInstructionModal} />
      )}
      {openSettingsModal && <SettingsModal closeModal={setOpenSettingsModal} />}
    </div>
  );
};

export default UserInterface;
