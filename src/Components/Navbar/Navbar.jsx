// ✅ src/Components/Navbar/Navbar.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import SideMenu from "../SideMenu/SideMenu";
import AdminLogin from "../Admin/AdminLogin"; // ✅ مكون تسجيل دخول الأدمن
import ContacttNav from "../ContacttNav/ContactNav"; // ✅ مكون التواصل

function Navbar() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); // ✅ لإظهار مكون الأدمن
  const [isContactOpen, setIsContactOpen] = useState(false); // ✅ لإظهار مكون التواصل

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "ReVerse", slug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.error("Restaurant not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);

  if (!data) return null;

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <img
          src={data.logo}
          alt="logo"
          width="100"
          style={{ objectFit: "contain" }}
        />
        <button onClick={() => navigate(`/reverse/${slug}/menu`)}>Menu</button>
        <button onClick={() => navigate(`/reverse/${slug}/cart`)}>Cart</button>
        <button onClick={() => setIsMenuOpen(true)}>≡</button>
      </nav>

      {/* ✅ القائمة الجانبية */}
      {isMenuOpen && (
        <SideMenu
          slug={slug}
          onClose={() => setIsMenuOpen(false)}
          onOpenContact={() => setIsContactOpen(true)} // ✅ فتح مكون التواصل
          onOpenAdmin={() => setIsAdminOpen(true)} // ✅ فتح مكون الأدمن
        />
      )}

      {/* ✅ مكون الأدمن يظهر بدون راوت */}
      {isAdminOpen && (
        <AdminLogin
          slug={slug}
          onClose={() => setIsAdminOpen(false)}
          adminEmail={data.adminEmail}
          onOpenAdmin={() => {
            console.log("📩 Open Admin Component");
          }}
        />
      )}

      {/* ✅ مكون التواصل يظهر بدون راوت */}
      {isContactOpen && (
        <ContacttNav
          slug={slug}
          onClose={() => setIsContactOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
