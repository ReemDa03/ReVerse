import React, { useEffect, useRef, useState } from "react";
import "./Cart.css";
import { useTranslation } from "react-i18next";

const DeliveryForm = ({
  customerInfo,
  setCustomerInfo,
  notes,
  setNotes,
  setShowCashModal,
  setDineOption,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);


  useEffect(() => {
  
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setDineOption(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setDineOption]);

  const handleProceed = () => {
    const { name, phone, address } = customerInfo;
    if (!name || !phone || !address) {
      setError(true);
      return;
    }
    setError(false);
    setShowCashModal(true);
  };

  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className="modal-content delivery-modal fade-in-modal"
      >
        <h3 className="modal-title">{t("delivery.title")}</h3>

        <p className="para" style={{ color: "#666" }}>
          {t("delivery.instruction")}
        </p>

        <input
          type="text"
          placeholder={t("delivery.namePlaceholder")}
          value={customerInfo.name}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
          className={error && !customerInfo.name ? "error-border" : ""}
        />

        <input
          type="tel"
          placeholder={t("delivery.phonePlaceholder")}
          value={customerInfo.phone}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, phone: e.target.value })
          }
          className={error && !customerInfo.phone ? "error-border" : ""}
        />

        <input
          type="text"
          placeholder={t("delivery.addressPlaceholder")}
          value={customerInfo.address}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, address: e.target.value })
          }
          className={error && !customerInfo.address ? "error-border" : ""}
        />

        <textarea
          placeholder={t("delivery.notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="order-notes-input"
        />

        {error && <p className="error-text">{t("delivery.errorMsg")}</p>}

        <button className="confirm-btn" onClick={handleProceed}>
          {t("delivery.proceedBtn")}
        </button>
      </div>
    </div>
  );
};

export default DeliveryForm;
