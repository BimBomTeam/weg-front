import React from 'react'


function InstructionModal({ closeModal }) {

    return (
        <div className="modal-background">
          <div className="modal">
            <h1>Instruction</h1>
            <button className="back-button" onClick={() => closeModal(false)} ></button>
          </div>
        </div>
    )
}  

export default InstructionModal