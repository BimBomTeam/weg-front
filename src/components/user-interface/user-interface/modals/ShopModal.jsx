import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

function ModalBackground({ children }) {
    return (
        <div className="modal-background">
            {children}
        </div>
    );
}

function ShopModal({ closeModal }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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
                <h1>Shop</h1>
                <button className="back-button" onClick={handleBackButtonClick}></button>
            </animated.div>
        </ModalBackground>
    );
}

export default ShopModal;
