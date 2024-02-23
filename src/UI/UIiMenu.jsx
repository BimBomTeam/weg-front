import { useState } from "react";

const UiMenu = () => {
  const [text, setText] = useState("");

  const onTextChange = (event) => {
    setText(event.target.value);
  };
  const onButtonClick = () => {
    console.log(text);
  };

  return (
    <>
      <div className="main-ui">
        <input type="text" value={text} onChange={onTextChange} />
        <button onClick={onButtonClick}></button>
      </div>
    </>
  );
};

export default UiMenu;
