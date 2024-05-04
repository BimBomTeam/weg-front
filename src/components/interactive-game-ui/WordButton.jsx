import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const Words = ({ text, onClick }) => {

    const [toggle, setToggle] = useState(false);

    const onHandleClick = () => {
        onClick(text);
    };

    const { opacity } = useSpring({
        opacity: toggle ? 1 : 0,
        config: { duration: 500 }
      });

      useEffect(() => {
        const timeout = setTimeout(() => {
            setToggle(true);
        }, 200);
      
        return () => clearTimeout(timeout);
      }, []); 

    return (
        <animated.button style={{ opacity }} className="word" onClick={onHandleClick}>
            {text}
        </animated.button>
    );
}

export default Words;
