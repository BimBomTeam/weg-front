import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const Words = () => {
    const [toggle, setToggle] = useState(false);

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
        <div>
            <animated.div style={{ opacity }} className="words">
                <div id="word1" className="word">elephant</div>
                <div id="word2" className="word">true</div>
                <div id="word3" className="word">comfortable</div>
                <div id="word4" className="word">voltage</div>
                <div id="word5" className="word">framework</div>
            </animated.div>
        </div>
    );
}

export default Words;
