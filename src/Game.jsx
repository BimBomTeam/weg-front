import { useEffect, useState } from "react";
import UiMenu from "./components/UI/UIiMenu";
import UserInterface from "./components/login/UserInterface";
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
      <UserInterface />
    </>
  );
};

export default Game;
