import { useEffect, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import GameScene from "./threejs/main";
import UserInterface from "./components/user-interface/user-interface/UserInterface";
import UiBossFight from "./components/interactive-game-ui/BossFightUI";
import PressE from "./components/user-interface/user-interface/hints/pressE";
import { ToastContainer } from "react-toastify";

const Game = () => {
  useEffect(() => {
    const game = new GameScene(changeUiVisibility);
  }, []);

  const [isUi, setUi] = useState(false);
  const [isEVisible, setIsEVisible] = useState(true);

  const changeUiVisibility = (isVis) => {
    if (!isVis) {
      setTimeout(() => {
        console.log("YES");
        setUi(false);
        setIsEVisible(true);
      }, 500);
    } else {
      setUi(isVis);
      setIsEVisible(false);
    }
  };

  return (  
    <>
      <canvas id="webgl"></canvas>
      {isEVisible && <PressE/>}
      {isUi && <UiMenu/>}
      {isUi || <UserInterface />}
      <ToastContainer position="top-center" closeOnClick={true} />
    </>
  );
};

export default Game;
