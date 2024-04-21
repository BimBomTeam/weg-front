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
  const [isExpandButtonClicked] = useState(false);
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
    if (!text && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  useEffect(() => {}, [isExpandButtonClicked]);

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

  function getStyles(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  }

  const animationProps = useSpring({
    height: isExpandButtonClicked
      ? isButtonClicked
        ? `${getStyles("--animationProps_height_expanded_clicked_true")}`
        : `${getStyles("--animationProps_height_expanded_unclicked_false")}`
      : isButtonClicked
      ? `${getStyles("--animationProps_height_unexpanded_clicked_false")}`
      : `${getStyles("--animationProps_height_unexpanded_unclicked_true")}`,
    transform: isVisible
      ? isExpandButtonClicked
        ? `${getStyles(
            "--animationProps_transform_visible_expanded_clicked_true"
          )}`
        : `${getStyles(
            "--animationProps_transform_visible_expanded_unclicked_false"
          )}`
      : `${getStyles("--animationProps_transform_invisible_true")}`,
    top: isExpandButtonClicked
      ? isButtonClicked
        ? `${getStyles("--animationProps_top_expanded_clicked_true")}`
        : `${getStyles("--animationProps_top_expanded_unclicked_false")}`
      : isButtonClicked
      ? `${getStyles("--animationProps_top_unexpanded_clicked_false")}`
      : `${getStyles("--animationProps_top_unexpanded_unclicked_true")}`,
  });

  const textareaAnimationProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? `${getStyles("--textareaAnimationProps_marginTop_true")}`
        : `${getStyles("--textareaAnimationProps_marginTop_false")}`,
  });

  const buttonAnimationProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? `${getStyles("--buttonAnimationProps_marginTop_true")}`
        : `${getStyles("--buttonAnimationProps_marginTop_false")}`,
  });

  const buttonVoiceProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? `${getStyles("--buttonVoiceProps_marginTop_true")}`
        : `${getStyles("--buttonVoiceProps_marginTop_false")}`,
  });

  const isListeningProps = useSpring({
    marginTop:
      (isExpandButtonClicked && isButtonClicked) ||
      (!isExpandButtonClicked && !isButtonClicked)
        ? `${getStyles("--isListeningProps_marginTop_true")}`
        : `${getStyles("--isListeningProps_marginTop_false")}`,
    width: isListening
      ? isButtonClicked
        ? `${getStyles("--isListeningProps_width_true_true")}`
        : `${getStyles("--isListeningProps_width_true_false")}`
      : isListening
      ? `${getStyles("--isListeningProps_width_false_true")}`
      : `${getStyles("--isListeningProps_width_false_false")}`,
  });

  const buttonExpandProps = useSpring({
    marginTop: isExpandButtonClicked
      ? isButtonClicked
        ? `${getStyles("--buttonExpandProps_marginTop_true")}`
        : `${getStyles("--buttonExpandProps_marginTop_false")}`
      : isButtonClicked
        ? `${getStyles("--buttonExpandProps_marginTop_true")}`
        : `${getStyles("--buttonExpandProps_marginTop_false")}`,
    transform: `rotate(${isButtonRotated ? 180 : 0}deg)`,
    config: { duration: 100 },
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

        <p id="paragraph">{text.length}/255</p>
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
