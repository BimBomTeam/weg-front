import { useEffect, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import UserInterface from "./components/user-interface/UserInterface";
import GameScene from "./threejs/main";

const Game = () => {
  useEffect(() => {
    const game = new GameScene(changeUiVisibility);
  }, []);

  const [isUi, setUi] = useState(false);

  const changeUiVisibility = (isVis) => {
    setUi(isVis);
  };

  return (
    <>
      <canvas id="webgl"></canvas>
      {isUi && <UiMenu/>}
    </>
  );
};

export default Game;
