import { useEffect, useRef, useState } from "react";
import UiMenu from "./components/interactive-game-ui/UIiMenu";
import GameScene from "./threejs/main";
import UserInterface from "./components/user-interface/user-interface/UserInterface";
import UiBossFight from "./components/interactive-game-ui/BossFightUI";
import NearNpcHint from "./components/user-interface/user-interface/hints/NearNpcHint";
import store from "./store/store";
import WelcomeModal from "./components/user-interface/user-interface/modals/WelcomeModal";
import Loader from "./components/user-interface/user-interface/hints/Loader";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoles } from "./actions/roles";
import { useSelector } from "react-redux";
import { UiStates } from "./reducers/interactReducer";
import api from "./axiosConfig";

const Game = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const game = useRef();

  const [isDialog, setDialogUiVisibility] = useState(true);
  // const [isBossConfirmationDialog, setBossDialogVisibility] = useState(false);
  const [isBossFight, setBossFightVisibility] = useState(false);
  const [isNearNpc, setNearNpc] = useState(false);
  const [isLoadedScene, setIsLoadedScene] = useState(false);
  const isHintVisible = useSelector((store) => store.interact.isHintVisible);
  const uiState = useSelector((store) => store.interact.uiState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadScene() {
      setIsLoading(true);

      let roles = [];
      if (sessionStorage.getItem("roles") === null) {
        roles = await fetchRoles();
      } else {
        roles = JSON.parse(sessionStorage.getItem("roles"));
      }

      if (roles === null) {
        toast.error("Error in roles fetch");
      } else {
        dispatch(setRoles(roles));
      }

      game.current = new GameScene(
        sceneLoaded,
        changeUiVisibility,
        changeNearNpcVisibility,
        changeBossFightVisibility
      );
    }
    loadScene();
  }, []);

  const fetchRoles = async () => {
    const response = await api.get("Role/get-today-roles");
    console.log("response", response);
    if (response.status === 200) {
      const roles = response.data;
      console.log(roles);
      sessionStorage.setItem("roles", JSON.stringify(roles));
      return roles;
    } else {
      return null;
    }
  };

  // useEffect(() => {}, [isLoadedScene]);

  const sceneLoaded = () => {
    setIsLoadedScene(true);
    setIsLoading(false);
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

  const renderUi = () => {
    switch (uiState) {
      case UiStates.CHAT:
        return <UiMenu />;
      case UiStates.FIGHT:
        return <UiBossFight />;
      case UiStates.HINT:
        return (
          <>
            <UserInterface />
            <NearNpcHint />
          </>
        );
      default:
        return <UserInterface />;
    }
  };

  return (
    <>
      <canvas id="webgl"></canvas>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {renderUi()}
          <WelcomeModal />
          <ToastContainer position="top-center" closeOnClick={true} />
        </>
      )}
    </>
  );
};

export default Game;
