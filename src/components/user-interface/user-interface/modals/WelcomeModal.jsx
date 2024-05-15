import React, { useState, useEffect } from 'react';
import Slider from '../DifficultySlider';
import { useSpring, animated } from 'react-spring';

function ModalBackground({ children, onClick, onKeyDown, active }) {
    const backgroundAnimation = useSpring({
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
    });

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            onClick();
        }
    };

    const handleBackgroundKeyDown = (event) => {
        onKeyDown(event);
    };

    return (
        <animated.div
            className={`modal-background ${active ? 'active' : ''}`}
            style={backgroundAnimation}
            onClick={handleBackgroundClick}
            onKeyDown={handleBackgroundKeyDown}
        >
            {children}
        </animated.div>
    );
}

function WelcomeModal() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const isNewUser = localStorage.getItem("isNewUser");
        if (isNewUser === "true") {
            setShowModal(true);
            localStorage.removeItem("isNewUser");
        }
    }, []);

    const modalAnimation = useSpring({
        transform: showModal ? 'translateY(0%)' : 'translateY(150%)',
        opacity: showModal ? 1 : 0,
    });

    const handleBackButtonClick = () => {
        setShowModal(false);
    };

    const handleModalBackgroundClick = () => {
        setShowModal(false);
    };

    const handleModalKeyDown = (event) => {
        if (event.key === 'Escape') {
            setShowModal(false);
        }
    };

    const handleConfirmSlider = () => {
        setShowModal(false);
    };

    return (
        <ModalBackground onClick={handleModalBackgroundClick} onKeyDown={handleModalKeyDown} active={showModal}>
            <animated.div className="welcomeModal" style={modalAnimation}>
                <h1>Welcome</h1>
                <h2 id='welcomeText'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ante in nibh mauris cursus mattis molestie. Amet nisl purus in mollis nunc.</h2>
                <button className="back-button" onClick={handleBackButtonClick}></button>

                <div className='slider'>
                    <Slider onConfirm={handleConfirmSlider} />
                </div>
            </animated.div>
        </ModalBackground>
    );
}

export default WelcomeModal;