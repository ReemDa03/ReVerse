import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } =
    useContext(StoreContext);

  const [productsData, setProductsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dineOption, setDineOption] = useState(null);
  const [tableNumber, setTableNumber] = useState(1);
  const [notes, setNotes] = useState("");
  const [showCashModal, setShowCashModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    country: "",
    address: "",
  });
  const [restaurantData, setRestaurantData] = useState(null);
  const { slug } = useParams();

  // ✅ تحميل بيانات المنتجات
  useEffect(() => {
  const fetchData = async () => {
    const productMap = {};

    for (const key in cartItems) {
      const item = cartItems[key];

      // ✅ تأكد من وجود item.id
      if (!item || !item.id) continue;

      // ✅ نحدد اسم الكوليكشن بشكل آمن
      const collectionName =
        typeof item.collection === "string" ? item.collection : "products";

      try {
        const docRef = doc(db, "ReVerse", slug, collectionName, item.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          productMap[item.id] = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }

    setProductsData(productMap);
    setLoading(false);
  };

  fetchData();
}, [cartItems, slug]);

  // ✅ تحميل بيانات المطعم
  useEffect(() => {
    const fetchRestaurant = async () => {
      const docRef = doc(db, "ReVerse", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRestaurantData(docSnap.data());
      }
    };
    fetchRestaurant();
  }, [slug]);

  // ✅ حساب Subtotal و Total
  const deliveryFee = 3.0;
  const subtotal = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + (dineOption === "outside" ? deliveryFee : 0);

  // ✅ الدفع النقدي
  const handleCashPayment = async () => {
    const orderData = {
      items: Object.values(cartItems).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      })),
      dineOption,
      ...(dineOption === "inside" ? { tableNumber } : { customerInfo }),
      notes,
      total,
      paymentMethod: "cash",
      paymentStatus: "pending",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "ReVerse", slug, "orders"), orderData);
      clearCart();
      setNotes("");
      setShowCashModal(false);
      toast.success("Your order has been received and is now being prepared!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "An error occurred while submitting your order. Please try again!"
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2>Your Cart</h2>

      {Object.keys(cartItems).length === 0 ? (
        <>
          <p>No items in your cart.</p>
          <hr />
        </>
      ) : (
        <>
          {Object.entries(cartItems).map(([key, item]) => {
            const product = productsData[item.id];
            if (!product) {
  return (
    <div key={key}>
      <h4>{item.name} (Missing data)</h4>
      <p>Size: {item.size}</p>
      <p>${item.price.toFixed(2)}</p>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
}


            return (
              <div key={key}>
                <img src={product.image} alt={item.name} width="100" />
                <h4>{item.name}</h4>
                <p>{product.description}</p>
                <p>${item.price.toFixed(2)}</p>
                <p>Size: {item.size}</p>

                <div>
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.size, item.collection)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      addToCart(
                        {
                          id: item.id,
                          name: item.name,
                          image: product.image,
                        },
                        {
                          label: item.size,
                          price: item.price,
                          collection: item.collection,
                        }
                      )
                    }
                  >
                    +
                  </button>
                  <span>
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <hr />
              </div>
            );
          })}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
            {/* ✅ الصورة والنص التعريفي */}
            <div>
              {restaurantData?.checkoutImage && (
                <img
                  src={restaurantData.checkoutImage}
                  alt="Checkout"
                  width="250"
                />
              )}
              {restaurantData?.CartText && <p>{restaurantData.CartText}</p>}
            </div>

            {/* ✅ معلومات الدفع */}
            <div>
              <h3>Cart Total</h3>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              {dineOption === "outside" && (
                <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
              )}
              <p>Total: ${total.toFixed(2)}</p>

              {!dineOption ? (
                <>
                  <button onClick={() => setDineOption("inside")}>
                    I'm dining inside
                  </button>
                  <button onClick={() => setDineOption("outside")}>
                    I want delivery
                  </button>
                </>
              ) : dineOption === "inside" ? (
                <div>
                  <label>
                    Select Table Number:
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    >
                      {Array.from({ length: 20 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Table {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>

                  <textarea
                    placeholder="Any notes or requests?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ display: "block", margin: "10px 0", width: "100%" }}
                  />

                  <button onClick={() => setShowCashModal(true)}>
                    Proceed to Checkout
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Any notes or requests?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ display: "block", margin: "10px 0", width: "100%" }}
                  />

                  <button onClick={() => setShowCashModal(true)}>
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ✅ مودال الدفع */}
          {showCashModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "8px",
                  minWidth: "300px",
                }}
              >
                <h3>Select Payment Method</h3>
                <button onClick={handleCashPayment}> 💵 Confirm Cash Payment</button>
                <button
                  onClick={() => setShowCashModal(false)}
                  style={{ marginTop: "10px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
