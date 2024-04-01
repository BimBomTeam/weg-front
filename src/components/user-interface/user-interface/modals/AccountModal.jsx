import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

function ModalBackground({ children }) {
    return (
        <div className="modal-background">
            {children}
        </div>
    );
}

function AccountModal({ closeModal }) {
    const [showModal, setShowModal] = useState(false);

    React.useEffect(() => {
        setShowModal(true);
    }, []);

    const modalAnimation = useSpring({
        transform: showModal ? 'translateY(0%)' : 'translateY(150%)',
    });

    const handleBackButtonClick = () => {
        setShowModal(false);
        setTimeout(() => {
            closeModal(false);
        }, 300);
    };

    return (
        <ModalBackground>
            <animated.div className="modal" style={modalAnimation}>
                <h1>Account</h1>
                <button className="back-button" onClick={handleBackButtonClick}></button>
            </animated.div>
        </ModalBackground>
    );
}

export default AccountModal;
