import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./AdminBookings.css";

const AdminBookings = () => {
  const { slug } = useParams();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!slug) {
        console.warn("🚫 slug غير موجود");
        return;
      }
      try {
        const docRef = doc(db, "ReVerse", slug);
        const bookingsRef = collection(docRef, "bookTable");
        const snapshot = await getDocs(bookingsRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
        console.log("✅ الحجوزات التي تم سحبها:", data);
      } catch (err) {
        console.error("❌ خطأ في سحب الحجوزات:", err);
      }
    };

    fetchBookings();
  }, [slug]);

  const handleStatusChange = async (id, status) => {
    const ref = doc(db, "ReVerse", slug, "bookTable", id);
    await updateDoc(ref, { status });
    setBookings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const confirmDelete = async () => {
    const ref = doc(db, "ReVerse", slug, "bookTable", deleteId);
    await deleteDoc(ref);
    setBookings((prev) => prev.filter((item) => item.id !== deleteId));
    setShowModal(false);
    setDeleteId(null);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchDate = !filterDate || b.date === filterDate;
    return matchStatus && matchDate;
  });

  return (
    <div className="admin-bookings">
      <h2>Reservations Management</h2>

      <div className="filters">
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {filteredBookings.length === 0 ? (
        <p className="no-bookings">There are no future bookings.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Seats</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.tableSize}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{b.paymentMethod}</td>
                  <td>
                    <span className={`status ${b.status}`}>{b.status}</span>
                  </td>
                  <td>
                    <button onClick={() => handleStatusChange(b.id, "confirmed")}>✅</button>
                    <button onClick={() => handleStatusChange(b.id, "rejected")}>❌</button>
                    <button onClick={() => {
                      setDeleteId(b.id);
                      setShowModal(true);
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ المودال - خارج الجدول */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to delete this booking?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="yes-btn">Yes</button>
              <button onClick={() => setShowModal(false)} className="no-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
