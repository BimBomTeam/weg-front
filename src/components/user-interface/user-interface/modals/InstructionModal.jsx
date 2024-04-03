import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

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
        <div className="modal-background" onClick={handleBackgroundClick} onKeyDown={handleBackgroundKeyDown}>
            {children}
        </div>
    );
}

function InstructionModal({ closeModal }) {
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
                <h1>Instruction</h1>
                <button className="back-button" onClick={handleBackButtonClick}></button>
                <ul className='instruction_content'>
                    <strong>Instrukcja do gry "Lorem Ipsum: Przygoda w Nieznanych Krainach"</strong>
                    <li>Witaj, podróżniku!</li>
                    <li>W grze "Lorem Ipsum: Przygoda w Nieznanych Krainach" wcielisz się w rolę śmiałka poszukującego zaginionego skarbu w tajemniczych krainach pełnych niebezpieczeństw i niespodzianek</li>
                    <li>Twoim celem jest odnalezienie starożytnego artefaktu znanego jako "Księga Lorem Ipsum", która według legend zawiera tajemnicze moce i wiedzę o zapomnianym królestwie</li>
                    <li>Przed Tobą wiele wyzwań i testów, które będziesz musiał przejść, aby dotrzeć do celu</li>
                    <li>Czy jesteś gotowy na tę ekscytującą przygodę?</li>
                </ul>
            </animated.div>
        </ModalBackground>
    );
}

export default InstructionModal;
