import React from "react";

const Textarea = ({ text, setText, onTextChange, resetTranscriptOnClick, onButtonClick, onKeyPress }) => {
    return (
      <div>
        <textarea
          placeholder="Write something.."
          value={text}
          onChange={onTextChange}
          rows={5}
          onKeyPress={onKeyPress}
        />
        <button
          id="send"
          onClick={() => {
            onButtonClick();
            resetTranscriptOnClick();
          }}
        ></button>
      </div>
    );
  };
  
  export default Textarea;