import { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
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
  const [isListening, setIsListening] = useState(false);
  const { transcript } = useSpeechRecognition({
    continuous: true,
    language: "en-US",
  });
  const [messages, setMessages] = useState([]);
  const [showAnimation] = useState(false);

  const handleSendMessage = async () => {
    try {
      const data = await Dialog(text);

      const newUserMessage = { text: "User: " + text, id: Date.now() };
      const npcMessage = { text: "NPC: ", animation: true, id: Date.now() + 1 };

      setMessages((prevMessages) => [
        ...prevMessages,
        newUserMessage,
        npcMessage,
      ]);

      setTimeout(() => {
        npcMessage.text = "NPC: " + data.text;
        npcMessage.animation = false;
        setMessages((prevMessages) => [...prevMessages]);
      }, 3000);

      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onButtonClick = async () => {
    if (!text) {
      toast.error("Please enter text to send a message")
      return;
    }
    setIsButtonClicked(true);
    setIsButtonRotated(true);

    await handleSendMessage();
    setText("");
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
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setIsVisible(false);
        setIsButtonClicked(false);
        setIsExpandButtonClicked(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!text && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  useEffect(() => {}, [isExpandButtonClicked]);

  useEffect(() => {
    const wordCount = transcript.trim().split(/\s+/).length;
    if (transcript && wordCount <= 100) {
      setText(transcript);
    } else if (transcript && wordCount > 100) {
      toast.error("Maximum word limit reached (100 words)");
    }
  }, [transcript]);

  const onTextChange = (event) => {
    const inputText = event.target.value;
    const wordCount = inputText.trim().split(/\s+/).length;
    if (wordCount <= 100) {
      setText(inputText);
    } else {
      toast.error("Maximum word limit reached (100 words)");
    }
  };

  const onButtonClickExpand = () => {
    setIsButtonRotated(!isButtonRotated);
    setIsButtonClicked(!isButtonClicked);
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
    height: isExpandButtonClicked
      ? isButtonClicked
        ? "250px"
        : "850px"
      : isButtonClicked
      ? "850px"
      : "250px",
    transform: isVisible
      ? isExpandButtonClicked
        ? "translateY(0%)"
        : "translateY(0%)"
      : "translateY(120%)",
    top: isExpandButtonClicked
      ? isButtonClicked
        ? "70%"
        : "8%"
      : isButtonClicked
      ? "8%"
      : "70%",
  });

  const textareaAnimationProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? "0px"
        : "410px",
  });

  const buttonAnimationProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? "0px"
        : "210px",
  });

  const buttonVoiceProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? "0px"
        : "350px",
  });

  const isListeningProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? "0px"
        : "133px",
    width: isListening
      ? isButtonClicked
        ? "45px"
        : "45px"
      : isListening
      ? "45px"
      : "0px",
  });

  const buttonExpandProps = useSpring({
    marginTop: isExpandButtonClicked
      ? isButtonClicked
        ? "150px"
        : "0px"
      : isButtonClicked
      ? "20px"
      : "0px",
    transform: `rotate(${isButtonRotated ? 180 : 0}deg)`,
    config: { duration: 200 },
  });

  const messageContainerAnimationProps = useSpring({
    opacity: isButtonClicked || isExpandButtonClicked ? 1 : 0,
    pointerEvents: isButtonClicked || isExpandButtonClicked ? "auto" : "none",
    config: { tension: 20, friction: 10 },
  });

  const messageScrollAnimationProps = useSpring({
    opacity: isButtonClicked || isExpandButtonClicked ? 1 : 0,
    pointerEvents: isButtonClicked || isExpandButtonClicked ? "auto" : "none",
    config: { tension: 40, friction: 10 },
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <animated.div className="main-ui" style={animationProps}>
        <animated.button
          id="expand_field_button"
          onClick={onButtonClickExpand}
          style={buttonExpandProps}
        ></animated.button>

        <animated.div className="isListening" style={isListeningProps} />

        <animated.textarea
          ref={textareaRef}
          placeholder="Write something.."
          value={text}
          onChange={onTextChange}
          rows={5}
          style={textareaAnimationProps}
        />

        <animated.button
          className="voice_button"
          style={buttonVoiceProps}
          onClick={toggleListening}
        >
          {isListening ? "" : ""}
        </animated.button>

        <animated.button
          id="send"
          onClick={onButtonClick}
          style={buttonAnimationProps}
        ></animated.button>

        {(isButtonClicked || isExpandButtonClicked) && (
          <animated.div
            className="message-container"
            style={messageContainerAnimationProps}
          >
            <animated.div
              className="message-scroll"
              style={messageScrollAnimationProps}
            >
              {messages.map((message, index) => (
                <div key={index} className="message">
                  {message.text.startsWith("User: ") ? (
                    <div>
                      <label className="user-label">User: </label>
                      <span className="user-message">
                        {message.text.substring(6)}
                      </span>
                    </div>
                  ) : message.text.startsWith("NPC: ") ? (
                    <div>
                      <label className="npc-label">NPC: </label>
                      <span className="npc-message">
                        {message.text.substring(5)}
                      </span>
                      {message.animation && <BouncingDotsAnimation />}
                    </div>
                  ) : (
                    <span>{message.text}</span>
                  )}
                </div>
              ))}

              {showAnimation && <BouncingDotsAnimation />}
            </animated.div>
          </animated.div>
        )}
      </animated.div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

const BouncingDotsAnimation = () => (
  <div className="bouncing-dots">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

export default UiMenu;