import { useEffect, useState } from "react";
import UiMenu from "./components/UI/UIiMenu";
import GameScene from "./threejs/ammoTest/main";

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
