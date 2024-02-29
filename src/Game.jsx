import { useEffect, useState } from "react";
import UiMenu from "./components/UI/UIiMenu";
import GameScene from "./threejs/main";

const Game = () => {
  useEffect(() => {
    const game = new GameScene(changeUiVisibility);
  }, []);

  const [isUi, setUi] = useState(true);

  const changeUiVisibility = (isVis) => {
    setUi(isVis);
  };

  return (
    <>
      <canvas id="webgl"></canvas>
      <UiMenu> </UiMenu>
    </>
  );
};

export default Game;
