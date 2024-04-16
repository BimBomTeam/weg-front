import { useEffect, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import GameScene from "./threejs/main";
import UserInterface from "./components/user-interface/user-interface/UserInterface";
import UiBossFight from "./components/interactive-game-ui/BossFightUI";

const Game = () => {
  useEffect(() => {
    const game = new GameScene(changeUiVisibility);
  }, []);

  const [isUi, setUi] = useState(false);

  const changeUiVisibility = (isVis) => {
    if (!isVis) {
      setTimeout(() => {
        setUi(false);
      }, 500);
    } else {
      setUi(isVis);
    }
  };

  return (
    <>
      <canvas id="webgl"></canvas>
      {isUi && <UiBossFight />}
      {isUi || <UserInterface />}
    </>
  );
};

export default Game;