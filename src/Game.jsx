import { useEffect, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import GameScene from "./threejs/main";
import UserInterface from "./components/user-interface/user-interface/UserInterface";
import UiBossFight from "./components/interactive-game-ui/BossFightUI";
import NearNpcHint from "./components/user-interface/user-interface/hints/NearNpcHint";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const navigator = useNavigate();

  useEffect(() => {
    // navigator(0);
    console.log("render game");
    const game = new GameScene(changeUiVisibility, changeNearNpcVisibility);
    console.log("after render game");

    // setTimeout(() => {
    //   console.log("game", game.test.scenes.get("MainScene"));
    //   game.test.scenes.get("MainScene").foo();
    // }, 3000);
  }, []);

  const [isUi, setUi] = useState(false);
  const [isNearNpc, setNearNpc] = useState(false);

  const changeUiVisibility = (isVis) => {
    if (!isVis) {
      setTimeout(() => {
        setUi(false);
        setNearNpc(false);
      }, 500);
    } else {
      setUi(isVis);
      setNearNpc(false);
    }
  };
  const changeNearNpcVisibility = (isVis) => {
    setNearNpc(isVis);
  };

  return (
    <>
      <canvas id="webgl"></canvas>
      {isNearNpc && <NearNpcHint />}
      {isUi && <UiBossFight />}
      {isUi || <UserInterface />}
      <ToastContainer position="top-center" closeOnClick={true} />
    </>
  );
};

export default Game;
