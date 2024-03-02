import React, { useState, useRef, useEffect } from "react";
import DialogForm from "../../server/DialogForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

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

  return (
    <div>
      <div className="main-ui">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            placeholder="Write something.."
            value={text}
            onChange={onTextChange}
            rows={5}
          />
          <p>{text.length}/255</p>
          <button onClick={onButtonClick}></button>
          
        </div>
      </div>
      <ToastContainer position="top-center" closeOnClick={true} />
    </div>
  );
};

export default UiMenu;
