import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpring, animated } from "react-spring";
import Dialog from "../../logic/Dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const [responseData, setResponseData] = useState({ text: "" });
  const [promptData, setPromptData] = useState({ text: "" });
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpandButtonClicked, setIsExpandButtonClicked] = useState(false);
  const [isExpandButtonVisible, setIsExpandButtonVisible] = useState(false);
  const [isButtonRotated, setIsButtonRotated] = useState(false);
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLabelsVisible, setIsLabelsVisible] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const { transcript } = useSpeechRecognition({ continuous: true, language: 'en-US' });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setText("");
    }
  }, [isVisible]);

  useEffect(() => {
    if (!text && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  useEffect(() => {
    setIsPromptVisible(isExpandButtonClicked);
  }, [isExpandButtonClicked]);

  useEffect(() => {
    if (transcript && transcript.length <= 255) {
      setText(transcript);
    } else if (transcript && transcript.length > 255) {
      toast.error("Maximum character limit reached (255 characters)");
    }
  }, [transcript]);

  const onTextChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= 255) {
      setText(inputText);
    } else {
      toast.error("Maximum character limit reached (255 characters)");
    }
  };

  const onButtonClickExpand = () => {
    setIsExpandButtonClicked(!isExpandButtonClicked);
    setIsGifVisible(false);
    setIsButtonRotated(!isButtonRotated);
    setIsPromptVisible(true);
  };

  const onButtonClick = async () => {
    setIsButtonClicked(true);
    setIsLabelsVisible(false);
    setTimeout(() => {
      setIsGifVisible(true);
      setIsExpandButtonVisible(true);
      setTimeout(() => {
        setIsGifVisible(false);
        setIsLabelsVisible(true);
      }, 3000);
    }, 300);
    try {
      const data = await Dialog(text);
      setResponseData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setText('');
    setPromptData({ text }); // Zaktualizuj stan promptData
  };
  
  const toggleListening = () => {
    if (!isListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
    setIsListening(!isListening);
  };

  const animationProps = useSpring({
    height: isExpandButtonClicked ? (isButtonClicked ? "850px" : "50px") : (isButtonClicked ? "400px" : "200px"),
    transform: isVisible ? (isExpandButtonClicked ? "translateY(0%)" : "translateY(0%)") : "translateY(100%)",
    top: isExpandButtonClicked ? (isButtonClicked ? "8.5%" : "60%") : (isButtonClicked ? "55%" : "76%"),
  });

  const textareaAnimationProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "550px" : "0px") : (isButtonClicked ? "170px" : "0px"),
  });

  const buttonAnimationProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "290px" : "0px") : (isButtonClicked ? "90px" : "0px"),
  });

  const buttonVoiceProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "472px" : "0px") : (isButtonClicked ? "150px" : "0px"),
  });

  const isListeningProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "170px" : "0px") : (isButtonClicked ? "52px" : "0px"),
    width: isListening ? (isButtonClicked ? "45px" : "45px") : isListening ? "45px" : "0px",
  });

  const buttonExpandProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "150px" : "0px") : (isButtonClicked ? "70px" : "0px"),
    transform: `rotate(${isButtonRotated ? 180 : 0}deg)`,
    config: { duration: 50 },
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <animated.div className="main-ui" style={animationProps}>
        {isGifVisible && (
          <img src="/images/writing_dots.gif" alt="Animated GIF" className="animated-gif" />
        )}

        {isExpandButtonVisible && (
          <animated.button
            id="expand_field_button"
            onClick={onButtonClickExpand}
            style={buttonExpandProps}
          ></animated.button>
        )}

        <animated.div
          className="isListening"
          style={isListeningProps}
        />

        <animated.textarea
          ref={textareaRef}
          placeholder="Write something.."
          value={text}
          onChange={onTextChange}
          rows={5}
          style={textareaAnimationProps}
        />
        <p>{text.length}/255</p>
        <animated.button className="voice_button"
          style={buttonVoiceProps}
          onClick={toggleListening}>
          {isListening ? "" : ""}
        </animated.button>
        <animated.button
          id="send"
          onClick={onButtonClick}
          style={buttonAnimationProps}
        ></animated.button>
        {isLabelsVisible && (
          <animated.div className="response-container">
            <label className="NPCname">NPC:</label>
            <label className="response">{responseData.text}</label>
          </animated.div>
        )}
        {isPromptVisible && (
          <animated.div className="prompt-container">
            <label className="UserName">User:</label>
            <label className="prompt">{promptData.text}</label>
          </animated.div>
        )}
      </animated.div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;
