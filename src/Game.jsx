import { useEffect, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import GameScene from "./threejs/main";
import UserInterface from "./components/user-interface/user-interface/UserInterface";
import UiBossFight from "./components/interactive-game-ui/BossFightUI";
import PressE from "./components/user-interface/user-interface/hints/pressE";

const Game = () => {
  useEffect(() => {
    const game = new GameScene(changeUiVisibility);
  }, []);

  const [isUi, setUi] = useState(false);
  const [isEVisible, setIsEVisible] = useState(true);

  const changeUiVisibility = (isVis) => {
    if (!isVis) {
      setTimeout(() => {
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
    </>
  );
};

export default Game;
