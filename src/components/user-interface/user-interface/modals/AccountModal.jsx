import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import LogOut from '../../../../logic/LogOut';

function ModalBackground({ children, onClick, onKeyDown }) {
    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) { 
            onClick();
        }
    };

    const handleBackgroundKeyDown = (event) => {
        onKeyDown(event);
    };

    return (
        <animated.div className="modal-background" onClick={handleBackgroundClick} onKeyDown={handleBackgroundKeyDown}>
            {children}
        </animated.div>
    );
}

function AccountModal({ closeModal }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(true);
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
                setTimeout(() => {
                    closeModal(false);
                }, 300);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    const modalAnimation = useSpring({
        transform: showModal ? 'translateY(0%)' : 'translateY(150%)',
        opacity: showModal ? 1 : 0,
        onRest: () => {
            if (!showModal) {
                closeModal(false);
            }
        },
    });

    const handleBackButtonClick = () => {
        setShowModal(false);
        setTimeout(() => {
            closeModal(false);
        }, 300);
    };

    const handleModalBackgroundClick = () => {
        setShowModal(false);
        setTimeout(() => {
            closeModal(false);
        }, 300);
    };

    const handleModalKeyDown = (event) => {
        if (event.key === 'Escape') {
            setShowModal(false);
            setTimeout(() => {
                closeModal(false);
            }, 300);
        }
    };

    return (
        <ModalBackground onClick={handleModalBackgroundClick} onKeyDown={handleModalKeyDown}>
            <animated.div className="modal" style={modalAnimation}>
                <h1>Account</h1>
                <button className="back-button" onClick={handleBackButtonClick}></button>
                <button className="logout" onClick={() => LogOut()}>Wyloguj</button>
            </animated.div>
        </ModalBackground>
    );
}

export default AccountModal;
