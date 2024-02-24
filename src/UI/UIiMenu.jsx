import { useState } from "react";
import DialogForm from "../server/DialogForm";

const UiMenu = () => {
  const [text, setText] = useState("");

  const onTextChange = (event) => {
    setText(event.target.value);
  };

  //Send data to server
  const onButtonClick = async () => {
    try {
      const data = await DialogForm(text);
      console.log("success", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="main-ui">
      <input type="text" value={text} onChange={onTextChange} />
      <button onClick={onButtonClick}>Fetch Data</button>
    </div>
  );
};

export default UiMenu;
