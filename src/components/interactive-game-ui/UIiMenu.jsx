import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import DialogForm from "../../server/DialogForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpandButtonClicked, setIsExpandButtonClicked] = useState(false);
  const [isExpandButtonVisible, setIsExpandButtonVisible] = useState(false);
  const [isButtonRotated, setIsButtonRotated] = useState(false);
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

  const onButtonClickExpand = () => {
    setIsExpandButtonClicked(!isExpandButtonClicked);
    setIsGifVisible(false); 
    setIsButtonRotated(!isButtonRotated);
  };

  const onButtonClick = async () => {
    setIsButtonClicked(true);
    setTimeout(() => {
      setIsGifVisible(true);
      setIsExpandButtonVisible(true);
    }, 300);
    try {
      const data = await DialogForm(text);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const animationProps = useSpring({
    height: isExpandButtonClicked ? (isButtonClicked ? "850px" : "50px") : (isButtonClicked ? "350px" : "200px"),
    transform: isVisible ? (isExpandButtonClicked ? "translateY(0%)" : "translateY(0%)") : "translateY(100%)",
    top: isExpandButtonClicked ? (isButtonClicked ? "8.5%" : "60%") : (isButtonClicked ? "60%" : "76%"),
  });

  const textareaAnimationProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "550px" : "0px") : (isButtonClicked ? "130px" : "0px"),
  });

  const buttonAnimationProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "300px" : "0px") : (isButtonClicked ? "70px" : "0px"),
  });

  const buttonVoiceProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "390px" : "0px") : (isButtonClicked ? "90px" : "0px"),
  });

  const buttonExpandProps = useSpring({
    marginTop: isExpandButtonClicked ? (isButtonClicked ? "150px" : "0px") : (isButtonClicked ? "70px" : "0px"),
    transform: `rotate(${isButtonRotated ? 180 : 0}deg)`,
    config: { duration: 50 },
  })

  return (
    <div>
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
