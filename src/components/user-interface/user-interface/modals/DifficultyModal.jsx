import React from 'react'


function DifficultyModal({ closeModal }) {

    return (
        <div className="modal-background">
          <div className="modal">
            <h1>Difficulty</h1>
            <button className="back-button" onClick={() => closeModal(false)} ></button>
          </div>
        </div>
    )
}  

export default DifficultyModal