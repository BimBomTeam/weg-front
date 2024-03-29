import React from 'react'


function AccountModal({ closeModal }) {

    return (
        <div className="modal-background">
          <div className="modal">
            <h1>Account</h1>
            <button className="back-button" onClick={() => closeModal(false)} ></button>
          </div>
        </div>
    )
}  

export default AccountModal