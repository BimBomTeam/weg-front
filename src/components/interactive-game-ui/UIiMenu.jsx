import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
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
import POST_startDialog from "../../logic/server/POST_startDialog";
import POST_continueDialog from "../../logic/server/POST_continueDialog";
import store from "../../store/store";
import api from "../../axiosConfig";
import { useDispatch } from "react-redux";
import { setWords } from "../../actions/words";
import axios from "axios";

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
  const dispatch = useDispatch();
  // const [words, setWords] = useState([]); // Initialize as an empty array
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
  const [waitForResponse, setWaitForResponse] = useState(true);

  const { words } = useSelector((state) => state.words);
  const { currentRole } = useSelector((state) => state.roles);

  useEffect(() => {
    setIsVisible(true);
    // setIsButtonClicked(false);

    const sumOfWordLengths = words.reduce(
      (acc, curr) => acc + curr.name.length,
      0
    );
  }, [words]); // Add checkWordsPayload to the dependency array

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
      // const sessionMessages = JSON.parse(sessionStorage.getItem("messageHistory"));
      setWaitForResponse(true);
      const usMess = { message: text, role: "User" };
      setMessages([...messages, usMess]);

      const response = await api.post("AiCommunication/continue-dialog", {
        messages,
        messageStr: text,
        words,
      });
      console.log(response);

      if (response.status === 200) {
        const { dialog, words } = response.data;
        // localStorage.setItem("messageHistory", JSON.stringify(dialog));
        if (localStorage.getItem("isVoice") !== null)
          await fetchAndPlayMp3(dialog.at(-1).message);
        dispatch(setWords(words));
        setMessages(dialog);
        setWaitForResponse(false);

        // const localMessages = dialog.map((x) => {
        //   return { ...x, animation: true };
        // });
        // console.log("localMessages", localMessages);

        // const newUserMessage = { text: "User: " + text, id: Date.now() };
        // const npcMessage = {
        //   text: `${currentRole.name}: ${dialog[dialog.length - 1].message}`,
        //   animation: true,
        //   id: Date.now() + 1,
        // };

        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   newUserMessage,
        //   npcMessage,
        // ]);

        // setTimeout(() => {
        //   npcMessage.text = `${currentRole.name}: ${
        //     dialog[dialog.length - 1].message
        //   }`;
        //   npcMessage.animation = false;
        //   setMessages((prevMessages) => [...prevMessages]);
        // }, 100);
      } else {
        toast.error("Error in dialog continue");
      }

      // const data = await POST_continueDialog({
      //   messages: JSON.parse(localStorage.getItem("message_history")),
      //   messageStr: text,
      // });
      // localStorage.setItem("message_history", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sumOfWordLengths = words.reduce(
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
    // setIsButtonClicked(true);
    // setIsButtonRotated(true);

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

  const fetchAndPlayMp3 = async (input) => {
    try {
      const response = await api.post(
        "AiCommunication/generate-audio",
        { input: input },
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error fetching MP3 file", error);
    }
  };

  const startDialog = async () => {
    try {
      const response = await api.post("/AiCommunication/start-dialog", {
        role: currentRole.name,
        wordsStr: words.map((x) => x.name).join(", "),
      });
      if (response.status === 200) {
        const { data } = response;
        await fetchAndPlayMp3(data[1].message);

        setWaitForResponse(false);
        setMessages(data);
      } else {
        toast.error("Error in dialog starting.");
      }
      // const messages = data.map((x) => {
      //   return { ...x, animation: true };
      // });
      // sessionStorage.setItem("messageHistory", JSON.stringify(data));
      // const npcMessage = {
      //   text: `${currentRole.name}: ${data[data.length - 1].message}`,
      //   animation: true,
      //   id: Date.now() + 1,
      // };

      // console.log(response);
      // const data = await POST_startDialog({
      //   role: "cookier",
      //   level: "B1",
      //   wordsStr: "first, second",
      // });
    } catch (error) {
      console.error("Error starting dialog:", error);
    }
  };

  useEffect(() => {
    startDialog();
  }, []);

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

  const saveWords = async (wordsToSave) => {
    const sessionWords = JSON.parse(sessionStorage.getItem("words"));
    sessionWords[currentRole.id] = wordsToSave;
    sessionStorage.setItem("words", JSON.stringify(sessionWords));
  };

  useEffect(() => {
    const handleEsc = async (event) => {
      if (event.keyCode === 27) {
        setIsVisible(false);

        console.log(words);

        const response = await api.post("Words/save-words", words);

        if (response.status === 200) {
          saveWords(words);
          console.log("Words successfully saved", words);
        } else {
          toast.error("Error in save words");
        }
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [words]);

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
      // setIsButtonClicked(true);
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


  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <animated.div
        className="main-ui"
        style={{
          ...borderAnimationProps,
        }}
      >
        <MessageContainer
          messages={messages}
          showAnimation={waitForResponse}
          npcRole={currentRole.name}
        />

        <animated.div className="words">
          {words.map((item) => (
            <WordButton
              text={item.name}
              learned={item.state}
              onClick={() => onWordClick(item.id)}
              key={item.id}
            />
          ))}
        </animated.div>

        {isWordCounterVisible && (
          <p className="word-counter">{text.split(/\s+/).length}/100</p>
        )}

        <div id="chat-container">
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
            disabled={waitForResponse}
          />

          <button className="voice_button" onClick={toggleListening}>
            {isListening ? "Stop" : "Start"}
          </button>
        </div>
      </animated.div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;