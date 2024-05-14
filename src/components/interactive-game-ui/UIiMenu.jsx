import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpring, animated } from "react-spring";
import { ToastContainer, toast } from "react-toastify";
import WordButton from "./WordButton";
import Textarea from "./Textarea";
import MessageContainer from "./MessageContainer";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import POST_startDialog from "../../logic/server/POST_startDialog";
import POST_continueDialog from "../../logic/server/POST_continueDialog";
import store from "../../store/store";

const UiMenu = () => {
  const [text, setText] = useState("");
  const [isWordCounterVisible, setIsWordCounterVisible] = useState(false);
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpandButtonClicked, setIsExpandButtonClicked] = useState(false);
  const [isButtonRotated, setIsButtonRotated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const getMessagesLS = localStorage.getItem("message_history");
  const [words, setWords] = useState([]); // Initialize as an empty array
  const msg = JSON.parse(getMessagesLS);
  const { transcript, resetTranscript } = useSpeechRecognition({
    continuous: true,
    language: "en-US",
  });
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [messages, setMessages] = useState([]);
  const [showAnimation] = useState(false);
  let checkWordsPayload = store.getState().words.words.words;
  const wordsArray = JSON.parse(checkWordsPayload);


  const [npcRole, setNpcRole] = useState("");

  useEffect(() => {
    setIsVisible(true);
    setIsButtonClicked(false);
    setWords(wordsArray);
  }, [checkWordsPayload]); // Add checkWordsPayload to the dependency array

  useEffect(() => {
    if (!text && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text]);

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

  const handleSendMessage = async () => {
    try {
      const data = await POST_continueDialog({
        messages: JSON.parse(localStorage.getItem("message_history")),
        messageStr: text,
      });
      localStorage.setItem("message_history", JSON.stringify(data));

      const newUserMessage = { text: "User: " + text, id: Date.now() };
      const npcMessage = {
        text: `${npcRole}: ${data[data.length - 1].message}`,
        animation: true,
        id: Date.now() + 1,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        newUserMessage,
        npcMessage,
      ]);

      setTimeout(() => {
        npcMessage.text = `${npcRole}: ${data[data.length - 1].message}`;
        npcMessage.animation = false;
        setMessages((prevMessages) => [...prevMessages]);
      }, 100);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sumOfWordLengths = wordsArray.reduce(
    (acc, curr) => acc + curr.name.length,
    0
  );
  const onButtonClick = async (event) => {
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
    const startDialog = async () => {
      try {
        const data = await POST_startDialog({
          role: "cookier",
          level: "B1",
          wordsStr: "first, second",
        });
        localStorage.setItem("message_history", JSON.stringify(data));
        const role = data[data.length - 1].role;
        setNpcRole(role);
        const npcMessage = {
          text: `${role}: ${data[data.length - 1].message}`,
          animation: false,
          id: Date.now() + 1,
        };
        setMessages([npcMessage, ...messages]);
      } catch (error) {
        console.error("Error starting dialog:", error);
      }
    };

    startDialog();
  }, []);

  useEffect(() => {
    const handleWordsHeightChange = () => {
      const wordsElement = document.querySelector(".words");
      const messageContainerElement =
        document.querySelector(".message-container");
      if (wordsElement && messageContainerElement) {
        const wordsHeight = wordsElement.getBoundingClientRect().height;
        const newMaxHeight = `${Math.max(0, 100 - wordsHeight * 0.4)}%`;
        messageContainerElement.style.maxHeight = newMaxHeight;
      }
    };

    handleWordsHeightChange();
    return () => {};
  });

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
        height: window.innerHeight,
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

  useEffect(() => {
    const sumOfWordLengths = wordsArray.reduce(
      (acc, curr) => acc + curr.name.length,
      0
    );
    console.log("Sum of lengths of all words:", sumOfWordLengths);
  }, [wordsArray]);

  useEffect(() => {}, [isExpandButtonClicked]);

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

  useEffect(() => {
    // Automatically open the chat with animation after the component mounts
    setTimeout(() => {
      setIsVisible(true);
      setIsButtonClicked(true);
    }, 100); // 100ms delay to allow the component to mount first
  }, []);

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
    //страшный костыль для отключения кнопки
    // setIsButtonRotated(!isButtonRotated);
    // setIsButtonClicked(!isButtonClicked);
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
    borderColor: isListening ? "red" : "transparent",
  });

  const animationProps = useSpring({
    height: isExpandButtonClicked
      ? isButtonClicked
        ? `${getStyles("--animationProps_height_expanded_clicked_true")}`
        : `${getStyles("--animationProps_height_expanded_unclicked_false")}`
      : isButtonClicked
      ? `${getStyles("--animationProps_height_unexpanded_clicked_false")}`
      : `${getStyles("--animationProps_height_unexpanded_unclicked_true")}`,
    width: isExpandButtonClicked
      ? `${getStyles("--animationProps_width_expanded_true")}`
      : isButtonClicked
      ? `${getStyles("--animationProps_width_unexpanded_clicked_false")}`
      : `${getStyles("--animationProps_width_unexpanded_unclicked_true")}`,
    opacity: isVisible ? 1 : 0,
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
          onTextChange={onTextChange}
          resetTranscriptOnClick={resetTranscriptOnClick}
          onButtonClick={(event) => {
            onButtonClick(event);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onButtonClick(event);
              resetTranscriptOnClick();
            }
          }}
          onSendClick={(event) => {
            onButtonClick(event);
            resetTranscriptOnClick();
          }}
        />

        <button className="voice_button" onClick={toggleListening}>
          {isListening ? "" : ""}
        </button>

        {isButtonClicked || isExpandButtonClicked ? (
          <MessageContainer
            messages={messages}
            showAnimation={showAnimation}
            npcRole={npcRole}
          />
        ) : null}

        {(isButtonClicked || isExpandButtonClicked) && (
          <animated.div className="words">
            {words.map((item) => (
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
