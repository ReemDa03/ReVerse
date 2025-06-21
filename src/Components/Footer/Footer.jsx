// Components/Footer/Footer.jsx

import React, { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import AboutLa from "../Abouttt/AboutLa";

const Footer = ({ slug }) => {
  const [footerSettings, setFooterSettings] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      const docRef = doc(db, "ReVerse", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFooterSettings(docSnap.data().footerSettings);
      }
    };
    fetchFooter();
  }, [slug]);

  if (!footerSettings) return null;

  const { logoText, aboutText, socialLinks, infoSections, copyright } =
    footerSettings;

  return (
    <>
      <div className="footer" id="footer">
        <div className="footer-content">
          {/* القسم الأيسر */}
          <div className="footer-left">
            {/* Logo Text or Image */}
            {logoText?.startsWith("http") ? (
              <img src={logoText} alt="Logo" style={{ width: "120px" }} />
            ) : (
              <h2>{logoText}</h2>
            )}

            <p>{aboutText}</p>
            <p>Contact Us</p>
            <div className="footer-icons">
              {socialLinks?.email && (
                <a href={`mailto:${socialLinks.email}`} aria-label="Email">
                  <FaEnvelope />
                </a>
              )}
              {socialLinks?.whatsapp && (
                <a
                  href={`https://wa.me/${socialLinks.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>

          {/* القسم الأيمن */}
          <div className="footer-right">
            <h4>Details</h4>
            <ul className="footer-lists">
              {Object.keys(infoSections).map((key) => (
                <li key={key} onClick={() => setSelectedSection(key)}>
                  {key} &gt;
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <p className="footer-copyright">{copyright}</p>
      </div>

      {/* المودال عند الضغط على قسم */}
      {selectedSection && (
        <AboutLa
          sectionTitle={selectedSection}
          sectionContent={infoSections[selectedSection]}
          onClose={() => setSelectedSection(null)}
        />
      )}
    </>
  );
};

export default Footer;
