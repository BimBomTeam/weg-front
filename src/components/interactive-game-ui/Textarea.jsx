import React from "react";

const Textarea = ({
  text,
  setText,
  onTextChange,
  resetTranscriptOnClick,
  onButtonClick,
  onKeyPress,
  disabled,
}) => {
  return (
    <div id="textarea-container">
      <textarea
        placeholder="Write something.."
        value={text}
        onChange={onTextChange}
        rows={5}
        onKeyPress={onKeyPress}
        disabled={disabled}
      />
      <button
        disabled={disabled}
        id="send"
        onClick={(event) => {
          onButtonClick(event);
          resetTranscriptOnClick();
        }}
      ></button>
    </div>
  );
};

export default Textarea;
