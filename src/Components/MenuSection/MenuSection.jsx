import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { StoreContext } from "../../context/StoreContext";
import "./MenuSection.css";

function MenuSection() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [specialItems, setSpecialItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sizeErrors, setSizeErrors] = useState({});

  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "ReVerse", slug);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const restaurantData = docSnap.data();
        setData(restaurantData);

        // ✅ جلب العناصر المميزة من كولكشن خاص
        const specialItemsSnap = await getDocs(
          collection(db, "ReVerse", slug, "specialItems")
        );
        const specialList = specialItemsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpecialItems(specialList);

        // ✅ جلب المنتجات العادية
        const prodRef = collection(docRef, "products");
        const prodSnap = await getDocs(prodRef);
        const prodList = prodSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(prodList);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchData();
  }, [slug]);

  if (!data) return null;

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleSizeSelect = (productId, sizeKey) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: sizeKey }));
    setSizeErrors((prev) => ({ ...prev, [productId]: false }));
  };

  const handleAddToCart = (product, availableSizes, collectionName) => {
    const selectedSizeKey = selectedSizes[product.id];

    if (Object.keys(availableSizes).length && !selectedSizeKey) {
      setSizeErrors((prev) => ({ ...prev, [product.id]: true }));
      return;
    }

    const sizeData = availableSizes[selectedSizeKey];
    addToCart(product, {
      label: selectedSizeKey,
      price: sizeData?.price || product.price,
      collection: collectionName, // ✅ نحدد الكولكشن
    });
  };

  return (
    <section id="menu">
      <h2>{data.menuHeaderTitle}</h2>
      <p>{data.menuHeaderDesc}</p>

      {/* ✅ special items */}
      {specialItems.length > 0 && (
        <div style={{ margin: "30px 0" }}>
          <h3 style={{ fontSize: "22px", marginBottom: "15px" }}>
            {data.specialTitle || "Special Items"}
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "flex-start",
            }}
          >
            {specialItems.map((item, i) => {
              const selectedSize = selectedSizes[item.id];
              const showError = sizeErrors[item.id] || false;

              const availableSizes = (item.sizes || []).reduce((acc, sizeObj) => {
                if (sizeObj.label && sizeObj.price) {
                  acc[sizeObj.label] = { price: sizeObj.price };
                }
                return acc;
              }, {});

              const key = selectedSize ? `${item.id}_${selectedSize}` : null;
              const quantity =
                key && cartItems[key]?.quantity ? cartItems[key].quantity : 0;

              return (
                <div
                  key={i}
                  style={{
                    width: "260px",
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "10px",
                    background: "#fff",
                    textAlign: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                  <h4>{item.name}</h4>
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {item.description}
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    {item.oldPrice && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "10px",
                        }}
                      >
                        ${item.oldPrice}
                      </span>
                    )}
                    <span style={{ fontWeight: "bold" }}>${item.price}</span>
                  </div>

                  {Object.keys(availableSizes).length > 0 && (
                    <div className="choices" style={{ marginTop: "10px" }}>
                      {Object.entries(availableSizes).map(([sizeKey, sizeData]) => (
                        <button
                          key={sizeKey}
                          className={`choice-button ${
                            selectedSize === sizeKey ? "selected" : ""
                          } ${showError ? "error-border" : ""}`}
                          onClick={() => handleSizeSelect(item.id, sizeKey)}
                        >
                          {sizeKey} (${parseFloat(sizeData.price).toFixed(2)})
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    {quantity === 0 ? (
                      <button
                        onClick={() =>
                          handleAddToCart(item, availableSizes, "specialItems")
                        }
                      >
                        +
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, selectedSize, "specialItems")
                          }
                        >
                          -
                        </button>
                        <span style={{ margin: "0 8px" }}>{quantity}</span>
                        <button
                          onClick={() =>
                            addToCart(item, {
                              label: selectedSize,
                              price:
                                availableSizes[selectedSize]?.price || item.price,
                              collection: "specialItems",
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ عرض الفئات */}
      <div>
        {data.categories?.map((cat, index) => {
          const name = typeof cat === "string" ? cat : cat.name;
          const image = typeof cat === "object" && cat.image;

          return (
            <button key={index} onClick={() => setSelectedCategory(name)}>
              {image && <img src={image} alt={name} width="50" />}
              <p>{name}</p>
            </button>
          );
        })}
      </div>

      <hr />

      {data.topDishesTitle && <h3>{data.topDishesTitle}</h3>}

      {/* ✅ عرض المنتجات العادية */}
      <div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => {
            const selectedSize = selectedSizes[prod.id];
            const showError = sizeErrors[prod.id];

            const availableSizes = (prod.sizes || []).reduce((acc, sizeObj) => {
              if (sizeObj.label && sizeObj.price) {
                acc[sizeObj.label] = { price: sizeObj.price };
              }
              return acc;
            }, {});

            const key = selectedSize ? `${prod.id}_${selectedSize}` : null;
            const quantity =
              key && cartItems[key]?.quantity ? cartItems[key].quantity : 0;

            return (
              <div key={prod.id}>
                <img src={prod.image} alt={prod.name} width="200" />
                <h4>{prod.name}</h4>
                <p>{prod.description}</p>

                {prod.price && <p>${parseFloat(prod.price).toFixed(2)}</p>}

                {Object.keys(availableSizes).length > 0 && (
                  <div className="choices">
                    {Object.entries(availableSizes).map(
                      ([sizeKey, sizeData]) => (
                        <button
                          key={sizeKey}
                          className={`choice-button ${
                            selectedSize === sizeKey ? "selected" : ""
                          } ${showError ? "error-border" : ""}`}
                          onClick={() => handleSizeSelect(prod.id, sizeKey)}
                        >
                          {sizeKey} (${parseFloat(sizeData.price).toFixed(2)})
                        </button>
                      )
                    )}
                  </div>
                )}

                {quantity === 0 ? (
                  <button
                    onClick={() =>
                      handleAddToCart(prod, availableSizes, "products")
                    }
                  >
                    +
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() =>
                        removeFromCart(prod.id, selectedSize, "products")
                      }
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() =>
                        addToCart(prod, {
                          label: selectedSize,
                          price:
                            availableSizes[selectedSize]?.price || prod.price,
                          collection: "products",
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>There is no product</p>
        )}
      </div>
    </section>
  );
}

export default MenuSection;
