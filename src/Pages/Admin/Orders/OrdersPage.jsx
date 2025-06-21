import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";

const OrdersPage = () => {
  const { slug } = useParams();
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const fetchOrders = async () => {
    try {
      const q = query(
        collection(db, "ReVerse", slug, "orders"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);

      // 👇 حذف الطلبات الزائدة عن 80
      if (data.length > 80) {
        const extraOrders = data.slice(80); // الأقدم
        for (const order of extraOrders) {
          await deleteDoc(doc(db, "ReVerse", slug, "orders", order.id));
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "ReVerse", slug, "orders", id), {
      status: newStatus,
    });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "ReVerse", slug, "orders", id));
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [slug]);

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      filterStatus === "all" ||
      order.status?.toLowerCase().trim() === filterStatus;
    const matchType = filterType === "all" || order.dineOption === filterType;
    return matchStatus && matchType;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to Admin Panel for: {slug}</h2>
      <h3> Orders : {filteredOrders.length}</h3>

      {/* 🟡 بيان توضيحي */}
      <p style={{ marginBottom: "10px" }}>
        Note That The Orders older than the most recent 80 will be automatically deleted to
        maintain performance.
      </p>

      {/* فلترة الحالة */}
      <div style={{ marginBottom: "10px" }}>
        <b>Filter by Status:</b>{" "}
        <button onClick={() => setFilterStatus("all")}>All</button>
        <button onClick={() => setFilterStatus("pending")}>Pending</button>
        <button onClick={() => setFilterStatus("preparing")}>Preparing</button>
        <button onClick={() => setFilterStatus("ready")}>Ready</button>
        <button onClick={() => setFilterStatus("delivered")}>Delivered</button>
        <button onClick={() => setFilterStatus("cancelled")}>Cancelled</button>
      </div>

      {/* فلترة نوع الطلب */}
      <div style={{ marginBottom: "20px" }}>
        <b>Order Type:</b>{" "}
        <button onClick={() => setFilterType("all")}>All</button>
        <button onClick={() => setFilterType("inside")}>Inside</button>
        <button onClick={() => setFilterType("outside")}>Delivery</button>
      </div>

      {filteredOrders.map((order, index) => {
        const items = order.items || [];
        const total = order.total || 0;
        const customer = order.customerInfo || {};

        return (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              margin: "10px 0",
              padding: "15px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div
              onClick={() => toggleOpen(order.id)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {index + 1}. items {items.length} – Date :{" "}
              {order.createdAt?.seconds
                ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                : "—"}{" "}
              – {order.status || "*"}
            </div>

            {openId === order.id && (
              <div style={{ marginTop: "10px" }}>
                <hr />

                {items.map((p, i) => (
                  <p key={i}>
                    🍽 {p.name} | {p.size} | quantity : {p.quantity} | ${p.price}
                    {p.notes && <> – 📝 Notes: {p.notes}</>}
                  </p>
                ))}

                {order.notes && (
                  <p style={{ marginTop: "5px" }}> Notes: {order.notes}</p>
                )}

                <p>
                  <b> Total:</b> ${total.toFixed(2)}
                </p>

                {order.dineOption === "outside" && (
                  <>
                    <p> Name: {customer.name}</p>
                    <p> Address: {customer.address}</p>
                    <p> Phone: {customer.phone}</p>
                  </>
                )}

                {order.dineOption === "inside" && (
                  <p> Table Number : {order.tableNumber}</p>
                )}

                {order.note && <p>📝 Note: {order.note}</p>}

                <p>
                  💳 Payment:{" "}
                  {order.paymentMethod === "online" &&
                    (order.paymentStatus === "paid"
                      ? "✅ Paid Online"
                      : "❗ Unpaid - Online Selected")}
                  {order.paymentMethod === "cash" && "💵 Cash on Delivery"}
                  {!order.paymentMethod && "—"}
                </p>

                <div style={{ marginTop: "10px" }}>
                  <b> Order Status:</b>
                  <br />
                  <button
                    onClick={() => updateStatus(order.id, "preparing")}
                    style={{ marginRight: 5 }}
                  >
                    Preparing
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "pending")}
                    style={{ marginRight: 5 }}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "delivered")}
                    style={{ marginRight: 5 }}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "cancelled")}
                    style={{ marginRight: 5 }}
                  >
                    Cancel
                  </button>
                </div>

                {order.status === "cancelled" && (
                  <div style={{ marginTop: "10px" }}>
                    <p> This order is cancelled</p>
                    <button onClick={() => deleteOrder(order.id)}>
                      Delete Permanently
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPage;
