import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./BookClick.css";

const BookClick = ({ onClose, settings, reservationId, slug }) => {
  const [paymentMethod, setPaymentMethod] = useState("");

  const getPaymentInstructions = () => {
    const instructions = {
      "Vodafone Cash": settings.vodafoneNumber
        ? `Send the deposit to: ${settings.vodafoneNumber}`
        : null,
      PayPal: settings.paypalAccount
        ? `Send the deposit to: ${settings.paypalAccount}`
        : null,
      Stripe: settings.stripeLink
        ? `Pay via Stripe: ${settings.stripeLink}`
        : null,
      Fawry: settings.fawryCode
        ? `Fawry Code: ${settings.fawryCode}`
        : null,
    };

    return instructions[paymentMethod] || null;
  };

  const handleConfirm = async () => {
    if (!paymentMethod) return;

    const ref = doc(db, "ReVerse", slug, "bookTable", reservationId);
    await updateDoc(ref, { paymentMethod });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Complete Your Payment</h3>

        <p>
          A deposit of <strong>{settings.depositAmount}$</strong> is required to confirm your reservation.
        </p>

        <label>Select Payment Method:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Choose Method</option>
          {settings.paymentOptions?.map((method, i) => (
            <option key={i} value={method}>{method}</option>
          ))}
        </select>

        {paymentMethod && getPaymentInstructions() && (
          <p style={{ marginTop: "1rem", color: "green" }}>
            {getPaymentInstructions()}
          </p>
        )}

        <div className="modal-buttons">
          <button onClick={handleConfirm} disabled={!paymentMethod}>
            Confirm Payment Method
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BookClick;
