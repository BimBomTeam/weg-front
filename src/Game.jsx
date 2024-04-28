import { useEffect, useRef, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import GameScene from "./threejs/main";
import UserInterface from "./components/user-interface/user-interface/UserInterface";
import UiBossFight from "./components/interactive-game-ui/BossFightUI";
import NearNpcHint from "./components/user-interface/user-interface/hints/NearNpcHint";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkRoles } from "./actions/roles";
import store from "./store/store";
import { useSelector } from "react-redux";

const Game = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const game = useRef();

  const [isDialog, setDialogUiVisibility] = useState(true);
  // const [isBossConfirmationDialog, setBossDialogVisibility] = useState(false);
  const [isBossFight, setBossFightVisibility] = useState(false);
  const [isNearNpc, setNearNpc] = useState(false);
  const [isLoadedScene, setIsLoadedScene] = useState(false);
  const tmp = useSelector((store) => store.interact.isHintVisible);

  useEffect(() => {
    // navigator(0);
    dispatch(checkRoles());

    game.current = new GameScene(
      sceneLoaded,
      changeUiVisibility,
      changeNearNpcVisibility,
      changeBossFightVisibility
    );
  }, []);

  // useEffect(() => {}, [isLoadedScene]);

  const sceneLoaded = () => {
    setIsLoadedScene(true);
  };
  const changeUiVisibility = (isVis) => {
    if (!isVis) {
      setTimeout(() => {
        setDialogUiVisibility(false);
        setNearNpc(false);
      }, 500);
    } else {
      setDialogUiVisibility(isVis);
      setNearNpc(false);
    }
  };
  const changeNearNpcVisibility = (isVis) => {
    setNearNpc(isVis);
  };
  const changeBossFightVisibility = (isVis) => {
    setBossFightVisibility(isVis);
  };

  console.log("is", tmp);

  return (
    <>
      <canvas id="webgl"></canvas>
      {isLoadedScene ? (
        <>
          {tmp === false && <NearNpcHint />}
          {isBossFight && <UiBossFight />}
          {isDialog && <UiMenu />}
          {isDialog || <UserInterface />}
          <ToastContainer position="top-center" closeOnClick={true} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Game;