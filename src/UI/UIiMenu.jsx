import React, { useState, useRef } from "react";
import DialogForm from "../server/DialogForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UiMenu = () => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const onTextChange = (event) => {
    const inputText = event.target.value;
    if (inputText.length <= 255) {
      setText(inputText);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
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
    <div className="main-ui">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          placeholder="Write something.."
          value={text}
          onChange={onTextChange}
          rows={5}
        />
        <button onClick={onButtonClick}>Send</button>
        <ToastContainer position="top-center" closeOnClick={true} />
      </div>
    </div>
  );
};

export default UiMenu;
