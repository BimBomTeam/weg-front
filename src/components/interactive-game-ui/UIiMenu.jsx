import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import DialogForm from "../../server/DialogForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isGifVisible, setIsGifVisible] = useState(false);

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

  const onTextChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= 255) {
      setText(inputText);
    } else {
      toast.error("Maximum character limit reached (255 characters)");
    }
  };

  const onButtonClick = async () => {
    setIsButtonClicked(true);
    setTimeout(() => {
      setIsGifVisible(true);
    }, 300);
    try {
      const data = await DialogForm(text);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const animationProps = useSpring({
    height: isButtonClicked ? "350px" : "200px",
    transform: isVisible ? "translateY(0%)" : "translateY(100%)",
    top: isButtonClicked ? "60%" : "76%",
  });

  const textareaAnimationProps = useSpring({
    marginTop: isButtonClicked ? "130px" : "0px",
  });

  const buttonAnimationProps = useSpring({
    marginTop: isButtonClicked ? "70px" : "0px",
  });

  const buttonVoiceProps = useSpring({
    marginTop: isButtonClicked ? "90px" : "0px",
  });

  return (
    <div>
      <animated.div className="main-ui" style={animationProps}>
        {isGifVisible && (
          <img src="writing_dots.gif" alt="Animated GIF" className="animated-gif" />
        )}
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
        style={buttonVoiceProps}>
        </animated.button>
        <animated.button
          id="send"
          onClick={onButtonClick}
          style={buttonAnimationProps}
        ></animated.button>
      </animated.div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;
