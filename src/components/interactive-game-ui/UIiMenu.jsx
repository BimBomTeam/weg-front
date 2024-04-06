import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpring, animated } from "react-spring";
import Dialog from "../../logic/Dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpandButtonClicked, setIsExpandButtonClicked] = useState(false);
  const [isButtonRotated, setIsButtonRotated] = useState(false);
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { transcript } = useSpeechRecognition({ continuous: true, language: 'en-US' });
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message, response) => {
    if (response && response.text) {
      const newMessages = [...messages, { text: "User: " + message, id: Date.now() }, { text: "NPC: " + response.text, id: Date.now() + 1 }];
      setMessages(newMessages);
    }
  };  

  useEffect(() => {
    setIsVisible(true);
    setIsButtonClicked(false);
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
    setIsGifVisible(false);
    setIsButtonRotated(!isButtonRotated);
    setIsButtonClicked(!isButtonClicked);

  };
  
  const onButtonClick = async () => {
    setIsButtonClicked(true);
    setTimeout(() => {
      setIsGifVisible(true);
      setIsButtonRotated(true);
      setTimeout(() => {
        setIsGifVisible(false);
      }, 3000);
    }, 300);
    try {
      const data = await Dialog(text);
      handleSendMessage(text, data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setText('');
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
    height: isExpandButtonClicked ? (isButtonClicked ? "250px" : "850px") : (isButtonClicked ? "850px" : "250px"),
    transform: isVisible ? (isExpandButtonClicked ? "translateY(0%)" : "translateY(0%)") : "translateY(100%)",
    top: isExpandButtonClicked ? (isButtonClicked ? "70%" : "8%") : (isButtonClicked ? "8%" : "70%"),
  });

  const textareaAnimationProps = useSpring({
    marginTop: (isExpandButtonClicked && isButtonClicked) || (!isExpandButtonClicked && !isButtonClicked) ? "0px" : "410px",
  });  

  const buttonAnimationProps = useSpring({
    marginTop: (isExpandButtonClicked && isButtonClicked) || (!isExpandButtonClicked && !isButtonClicked) ? "0px" : "210px",
  });  

  const buttonVoiceProps = useSpring({
    marginTop: (isExpandButtonClicked && isButtonClicked) || (!isExpandButtonClicked && !isButtonClicked) ? "0px" : "350px",
  });  

  const isListeningProps = useSpring({
    marginTop: (isExpandButtonClicked && isButtonClicked) || (!isExpandButtonClicked && !isButtonClicked) ? "0px" : "133px",
    width: isListening ? (isButtonClicked ? "45px" : "45px") : isListening ? "45px" : "0px",
  });

  const buttonExpandProps = useSpring({
    transform: `rotate(${isButtonRotated ? 180 : 0}deg)`,
    config: { duration: 200 },
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <animated.div className="main-ui" style={animationProps}>
        {isGifVisible && (
          <img src="/images/writing_dots.gif" alt="Animated GIF" className="animated-gif" />
        )}

          <animated.button
            id="expand_field_button"
            onClick={onButtonClickExpand}
            style={buttonExpandProps}
          ></animated.button>

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
        
        {(isButtonClicked || isExpandButtonClicked) && (
          <div className="message-container">
            <div className="message-scroll">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  {message.text.startsWith("User: ") ? (
                    <div>
                      <label className="user-label">User: </label>
                      <span className="user-message">{message.text.substring(6)}</span>
                    </div>
                  ) : message.text.startsWith("NPC: ") ? (
                    <div>
                      <label className="npc-label">NPC: </label>
                      <span className="npc-message">{message.text.substring(5)}</span>
                    </div>
                  ) : (
                    <span>{message.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </animated.div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;
