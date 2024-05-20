import React, { useEffect } from "react";
import { animated } from "react-spring";

const MessageContainer = ({ messages, showAnimation, npcRole }) => {
  useEffect(() => {});
  return (
    <animated.div className="message-container">
      <animated.div className="message-scroll">
        {messages.slice(1).map((message, index) => (
          <div key={index} className="message">
            {message.role === "User" ? (
              <div>
                <label className="user-label">You: </label>
                <span className="user-message">{message.message}</span>
              </div>
            ) : message.role === "Assistant" ? (
              <div>
                <label className="npc-label">{npcRole}: </label>
                <span className="npc-message">{message.message}</span>
                {/* <BouncingDotsAnimation /> */}
                {/* {message.animation && <BouncingDotsAnimation />} */}
              </div>
            ) : (
              <span>{message.message}</span>
            )}
          </div>
        ))}
        {showAnimation === true && (
          <div className="message">
            <label className="npc-label">{npcRole}: </label>
            <BouncingDotsAnimation />
          </div>
        )}
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
