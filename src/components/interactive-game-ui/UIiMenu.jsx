import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import DialogForm from "../../server/DialogForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Jeśli kontener jest niewidoczny, zresetuj tekst
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
    try {
      const data = await DialogForm(text);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const animationProps = useSpring({
    transform: isVisible ? "translateY(0%)" : "translateY(100%)",
  });

  return (
    <div>
      <div className="main-ui">
        <animated.div className="input-container" style={animationProps}>
          <textarea
            ref={textareaRef}
            placeholder="Write something.."
            value={text}
            onChange={onTextChange}
            rows={5}
          />
          <p>{text.length}/255</p>
          <button id="send" onClick={onButtonClick}></button>
        </animated.div>
      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;
