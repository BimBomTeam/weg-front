import React from "react";
import { animated } from "react-spring";

const MessageContainer = ({ messages, showAnimation }) => {
  return (
    <animated.div className="message-container">
      <animated.div className="message-scroll">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message.text.startsWith("User: ") ? (
              <div>
                <label className="user-label">User: </label>
                <span className="user-message">
                  {message.text.substring(6)}
                </span>
              </div>
            ) : message.text.startsWith("NPC: ") ? (
              <div>
                <label className="npc-label">NPC: </label>
                <span className="npc-message">
                  {message.text.substring(5)}
                </span>
                {message.animation && <BouncingDotsAnimation />}
              </div>
            ) : (
              <span>{message.text}</span>
            )}
          </div>
        ))}
        {showAnimation && <BouncingDotsAnimation />}
      </animated.div>
    </animated.div>
  );
};

const BouncingDotsAnimation = () => (
  <div className="bouncing-dots">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

export default MessageContainer;
