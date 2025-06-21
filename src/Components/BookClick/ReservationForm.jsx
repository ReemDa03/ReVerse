import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookClick from "./BookClick";

function ReservationForm({ slug }) {
  const [settings, setSettings] = useState(null);
  const [tableSize, setTableSize] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00 PM");
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reservationId, setReservationId] = useState(null); // نرسل ID للـ BookClick

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "ReVerse", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data().reservationSettings);
      }
    };
    fetchSettings();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !date || !time) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const ref = collection(doc(db, "ReVerse", slug), "bookTable");
      const newDoc = await addDoc(ref, {
        name,
        tableSize,
        date,
        time,
        depositAmount: settings.depositAmount,
        createdAt: Timestamp.now(),
        status: "pending",
      });

      setReservationId(newDoc.id);
      setShowModal(true);

      setTableSize("2");
      setDate("");
      setTime("08:00 PM");
      setName("");
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error("Something went wrong.");
    }
  };

  if (!settings) return null;

  return (
    <section id="book">
      <h2>—BOOK A TABLE—</h2>
      <div className="reservation-wrapper">
        <div className="left-side">
          <img src={settings.reservationImage} alt="Restaurant" />
          <p><strong>Opening Hours:</strong><br />{settings.openingHours}</p>
          <p><strong>Additional Info:</strong><br />{settings.additionalInfo}</p>
        </div>

        <div className="right-side">
          <form onSubmit={handleSubmit}>
            <label>Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Choose Table Size:</label>
            <select
              value={tableSize}
              onChange={(e) => setTableSize(e.target.value)}
            >
              {[2, 4, 6, 8, 10, 12].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label>Choose a Day:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <label>Choose a Time:</label>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              {[
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
                "05:00 PM", "06:00 PM", "06:30 PM", "07:00 PM",
                "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM",
              ].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <button type="submit">Place Order</button>
          </form>
        </div>
      </div>

      {showModal && (
        <BookClick
          onClose={() => setShowModal(false)}
          settings={settings}
          reservationId={reservationId}
          slug={slug}
        />
      )}

      <ToastContainer />
    </section>
  );
}

export default ReservationForm;
