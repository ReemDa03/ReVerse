import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { useParams } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import CategoryList from "./CategoryList";

function ProductList() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProducts = async () => {
    try {
      const colRef = collection(db, "ReVerse", slug, "products");
      const snap = await getDocs(colRef);
      const prodList = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(prodList);
    } catch (err) {
      toast.error("Failed to fetch products.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "ReVerse", slug, "products", id));
      toast.success("Item deleted.");
      fetchProducts();
      setConfirmDeleteId(null);
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const getShortDescription = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length <= 3 ? text : words.slice(0, 3).join(" ") + " ...";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Product List</h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filtered.map((prod) => (
            <div
              key={prod.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobileView
                    ? "1fr"
                    : "80px 1fr 80px 150px 120px 50px",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <strong>{prod.name}</strong>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                      color: "gray",
                      fontSize: "13px",
                    }}
                    onClick={() => setExpandedId(prod.id)}
                  >
                    {getShortDescription(prod.description)}
                  </span>
                </div>

                <span>-</span>

                <span>
                  {Array.isArray(prod.sizes)
                    ? prod.sizes.map((s) => `${s.label} ($${s.price})`).join(", ")
                    : "-"}
                </span>

                <span>{prod.category}</span>

                <div>
                  <button
                    onClick={() => setConfirmDeleteId(prod.id)}
                    style={{
                      background: "#eee",
                      border: "1px solid #ccc",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              </div>

              {confirmDeleteId === prod.id && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#fff4f4",
                    border: "1px solid #ffcccc",
                    borderRadius: "6px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12px" }}>
                    Are you sure you want to delete{" "}
                    <strong>"{prod.name}"</strong>?
                  </span>
                  <button
                    onClick={() => deleteProduct(prod.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    style={{
                      background: "gray",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    No
                  </button>
                </div>
              )}

              {expandedId === prod.id && (
                <div
                  style={{
                    marginTop: "10px",
                    background: "#f9f9f9",
                    padding: "10px",
                    borderRadius: "6px",
                    position: "relative",
                  }}
                >
                  <strong>Full Description:</strong> {prod.description}
                  <button
                    onClick={() => setExpandedId(null)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "10px",
                      border: "none",
                      background: "transparent",
                      fontWeight: "bold",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      )}
      {/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */}
      <hr style={{ margin: "40px 0", borderColor: "#ddd" }} />
      <CategoryList />
      {/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */}

    </div>
    
  );
}

export default ProductList;
