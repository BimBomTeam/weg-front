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
  const [isEVisible, setIsEVisible] = useState(false);

  const changeUiVisibility = (isVis) => {
    if (!isVis) {
      setTimeout(() => {
        setUi(false);
      }, 500);
    } else {
      setUi(isVis);
    }
  };

  useEffect(() => {
    setIsEVisible(true);
  }, []);

  return (
    <>
      <canvas id="webgl"></canvas>
      {isEVisible && <PressE/>}
      {isUi && <UiBossFight />} {/*Zmieniono z UiMenu na UiBossFight DLA TESTU DONT DELETE*/}
      {isUi || <UserInterface />}
    </>
  );
};

export default Game;