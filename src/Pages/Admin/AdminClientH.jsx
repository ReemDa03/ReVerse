import React, { useState, useEffect } from "react";
import {  useParams, useNavigate } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminClientH.css";

const AdminClientH = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
  });

  const handleNavigate = (page) => {
    setActivePage(page);
    navigate(`/reverse/${slug}/adminClientH/${page}`);
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("slug");
      toast.success("You have been logged out.");
      navigate(`/reverse/${slug}`);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && slug) {
        try {
          const docRef = doc(db, "ReVerse", slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAdminInfo({
              name: data.adminName || "Admin",
              email: data.adminEmail || "admin@example.com",
            });
          }
        } catch (err) {
          console.error("Error fetching admin info:", err);
        }
      }
    });

    return () => unsubscribe();
  }, [slug]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Panel - {slug}</h2>
        <div className="admin-info">
          <p>👤 {adminInfo.name}</p>
          <p>📧 {adminInfo.email}</p>
          <button className="logout-btn" onClick={confirmLogout}>
            Logout
          </button>
        </div>
      </div>

      {!activePage && (
        <div className="button-grid">
          <button onClick={() => handleNavigate("add")}>➕ Add Product</button>
          <button onClick={() => handleNavigate("list")}>📦 Product List</button>
          <button onClick={() => handleNavigate("orders")}>🧾 Orders</button>
          <button onClick={() => handleNavigate("booking")}>📅 Bookings</button>
          <button onClick={() => handleNavigate("payMethod")}>💳 Payment Method</button>
        </div>
      )}

      {activePage && (
        <button
          className="back-btn"
          onClick={() => {
            setActivePage(null);
            navigate(`/reverse/${slug}/adminClientH`);
          }}
        >
          ← Back
        </button>
      )}

      {/* ✅ child routes داخل adminClientH/* */}
      

      {/* ✅ Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-buttons">
              <button onClick={handleLogout}>Yes, Logout</button>
              <button onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientH;
