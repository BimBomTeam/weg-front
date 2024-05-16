import { useState, useEffect } from 'react';
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

function FinishQuizModal({ closeModal }) {
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
                <h1>Quiz Finished!</h1>
                <p>Congratulations! You've completed the quiz.</p>
            </animated.div>
        </ModalBackground>
    );
}

function YourComponent() {
    const finishQuiz = () => {
        // Podejście na potrzeby przykładu - tutaj możesz uruchomić modal po zakończeniu quizu
        setQuizFinished(true);
    };

    const [quizFinished, setQuizFinished] = useState(false);

    const closeModal = () => {
        setQuizFinished(false);
    };

    useEffect(() => {
        if (quizFinished) {
            setTimeout(() => {
                // Wywołaj funkcję finishQuiz, która uruchamia modal po zakończeniu quizu
                finishQuiz();
            }, 1000);
        }
    }, [quizFinished]);

    return (
        <div>
            {/* Dodaj warunek, aby wyświetlać FinishQuizModal tylko gdy quiz jest zakończony */}
            {quizFinished && <FinishQuizModal closeModal={closeModal} />}
        </div>
    );
}

export default FinishQuizModal;
