import { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpring, animated } from "react-spring";
import Dialog from "../../logic/Dialog";
import { ToastContainer, toast } from "react-toastify";
import WordButton from "./WordButton";
import Textarea from "./Textarea";
import MessageContainer from "./MessageContainer";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const UiMenu = () => {
  const [text, setText] = useState("");
  const [isWordCounterVisible, setIsWordCounterVisible] = useState(false);
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpandButtonClicked, setIsExpandButtonClicked] = useState(false);
  const [isButtonRotated, setIsButtonRotated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition({
    continuous: true,
    language: "en-US",
  });
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [messages, setMessages] = useState([]);
  const [showAnimation] = useState(false);
  let checkWordsPayload = useSelector((state) => state.words);
  const wordsArray = JSON.parse(checkWordsPayload.words.words);
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

  const sumOfWordLengths = wordsArray.reduce((acc, curr) => acc + curr.name.length, 0);
  const onButtonClick = async () => {
    event.preventDefault();
    if (!text) {
      toast.error("Please enter text to send a message");
      return;
    }

    if (text.split(/\s+/).length > 100) {
      toast.error("Maximum word limit reached (100 words)");
      return;
    }
    setIsButtonClicked(true);
    setIsButtonRotated(true);

    await handleSendMessage();
    setText("");
    setIsWordCounterVisible(false);
  };

  const onWordClick = (text) => {
    console.log(text); // TODO: Logic -----------------------------------
  };

  const resetTranscriptOnClick = () => {
    resetTranscript();
  };

  useEffect(() => {
    const handleWordsHeightChange = () => {
      const wordsElement = document.querySelector(".words");
      const messageContainerElement = document.querySelector(".message-container");
      if (wordsElement && messageContainerElement) {
        const wordsHeight = wordsElement.getBoundingClientRect().height;
        const newMaxHeight = `${Math.max(0, 100 - wordsHeight * 0.1)}%`;
        messageContainerElement.style.maxHeight = newMaxHeight;
      }
    };

    handleWordsHeightChange();
    return () => {
    };
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    const sumOfWordLengths = wordsArray.reduce((acc, curr) => acc + curr.name.length, 0);
    console.log("Sum of lengths of all words:", sumOfWordLengths);
  }, [wordsArray]);

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
    const handleResize = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!text && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

  useEffect(() => { }, [isExpandButtonClicked]);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
      if (transcript.split(/\s+/).length >= 100) {
        setIsWordCounterVisible(true);
      } else {
        setIsWordCounterVisible(false);
      }
    }
  }, [transcript]);

  const onTextChange = (event) => {
    const inputText = event.target.value;
    setText(inputText);

    if (inputText.split(/\s+/).length >= 100) {
      setIsWordCounterVisible(true);
    } else {
      setIsWordCounterVisible(false);
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

  const borderAnimationProps = useSpring({
    borderColor: isListening ? 'red' : 'transparent',
  });

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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <animated.div
        className="main-ui"
        style={{
          ...animationProps,
          ...borderAnimationProps,
        }}
      >
        <animated.button
          id="expand_field_button"
          onClick={onButtonClickExpand}
          style={buttonExpandProps}
        ></animated.button>

        {isWordCounterVisible && (
          <p className="word-counter">{text.split(/\s+/).length}/100</p>
        )}
        <Textarea
          text={text}
          setText={setText}
          onTextChange={onTextChange}
          resetTranscriptOnClick={resetTranscriptOnClick}
          onButtonClick={onButtonClick}
          onKeyPress={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onButtonClick();
              resetTranscriptOnClick();
            }
          }}
          onSendClick={() => {
            onButtonClick();
            resetTranscriptOnClick();
          }}
        />
        
        <button className="voice_button" onClick={toggleListening}>
          {isListening ? "" : ""}
        </button>

        {isButtonClicked || isExpandButtonClicked ? (
          <MessageContainer messages={messages} showAnimation={showAnimation} />
        ) : null}

        {(isButtonClicked || isExpandButtonClicked) && (
          <animated.div className="words">
            {wordsArray.map((item) => (
              <WordButton
                text={item.name}
                learned={item.state}
                onClick={() => onWordClick(item.id)}
                sumOfWordLengths={sumOfWordLengths}
                key={item.id}
              />
            ))}

          </animated.div>
        )}
      </animated.div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;