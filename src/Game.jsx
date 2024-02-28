import { useEffect, useState } from "react";
import UiMenu from "./components/UI/UIiMenu";
import * as gameScript from "./threejs/main";

const Game = () => {
  useEffect(() => {
    gameScript.mainGameFunc(changeUiVisibility);
  }, []);

  const [isUi, setUi] = useState(false);

  const changeUiVisibility = (isVis) => {
    setUi(isVis);
  };

  return (
    <>
      <canvas id="webgl"></canvas>
      {isUi && <UiMenu> </UiMenu>}
    </>
  );
};

export default Game;
