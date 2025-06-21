import React, { useEffect, useState } from "react";
import { FaFacebook ,FaInstagram, FaWhatsapp } from "react-icons/fa";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const ContacttNav = ({ onClose, slug }) => {
  const [socialLinks, setSocialLinks] = useState(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const docRef = doc(db, "ReVerse", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("🎯 Fetched data from Firestore:", data);

          // ✅ التعديل الأساسي هون 👇
          const links = data.footerSettings?.socialLinks || {};
          setSocialLinks(links);
        } else {
          console.warn("❌ Document not found");
        }
      } catch (error) {
        console.error("🔥 Error fetching contact info:", error);
      }
    };

    fetchSocialLinks();
  }, [slug]);

  if (!socialLinks) {
    return (
      <div >
        <button onClick={onClose}>X</button>
        <p>Uploading Data...</p>
      </div>
    );
  }

  const hasAnyLink =
    socialLinks.facebook || socialLinks.instagram || socialLinks.whatsapp;

  return (
    <div>
      <button onClick={onClose}>X</button>
      <p>
        Hi! <span>You can contact us via:</span>
      </p>

      {hasAnyLink ? (
        <div >
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer">
              <FaFacebook  />
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
          )}
          {socialLinks.whatsapp && (
            <a
              href={`https://wa.me/${socialLinks.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
            </a>
          )}
        </div>
      ) : (
        <p>There is No Data available</p>
      )}
    </div>
  );
};

export default ContacttNav;
