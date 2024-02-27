import { useState } from "react";
import DialogForm from "../server/DialogForm";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const UiMenu = () => {
  const [text, setText] = useState("");

  const onTextChange = (event) => {
    setText(event.target.value);
  };

  //Send data to server
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
      <input type="text" value={text} onChange={onTextChange} />
      <button onClick={onButtonClick}>Fetch Data</button>
      <ToastContainer position="top-center" closeOnClick="true" />
    </div>
  );
};

export default UiMenu;
