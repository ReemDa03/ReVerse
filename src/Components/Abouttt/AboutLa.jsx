// Components/About/AboutLa.jsx

import React from "react";


const AboutLa = ({ sectionTitle, sectionContent, onClose }) => {
  return (
    <div className="AboutLa" onClick={onClose}>
      <div className="about-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close About Section"
        >
          ×
        </button>
        <h2>{sectionTitle || "Info"}</h2>
        <p>
          {sectionContent ||
            "Sorry, we couldn't find the information you're looking for."}
        </p>
      </div>
    </div>
  );
};

export default AboutLa;
