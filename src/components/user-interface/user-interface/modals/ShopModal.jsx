import React from 'react'


function ShopModal({ closeModal }) {

    return (
        <div className="modal-background">
          <div className="modal">
            <h1>Shop</h1>
            <button className="back-button" onClick={() => closeModal(false)} ></button>
          </div>
        </div>
    )
}  

export default ShopModal