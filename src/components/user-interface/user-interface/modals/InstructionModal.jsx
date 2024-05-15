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
                    <strong>Instrukcja do gry "Aicademia"</strong>
                    <li>Witaj, podróżniku!</li>
                    <li><strong>Sterowanie:</strong> Poruszaj się po interfejsie za pomocą klawiszy <strong>WSAD</strong>.</li>
                    <li><strong>Rozpocznij rozmowę:</strong> Wciśnij klawisz <strong>E</strong> aby rozpocząć rozmowę z naszą sztuczną inteligencją.</li>
                    <li><strong>Zakończ rozmowę:</strong> Aby zakończyć rozmowę i wrócić do głównego menu, wciśnij klawisz <strong>ESC</strong>.</li>
                    <li>Gotowy do odkrywania tajemnic angielskiego ze wsparciem Aicademii? Powodzenia!</li>
                </ul>
            </animated.div>
        </ModalBackground>
    );
}

export default InstructionModal;
