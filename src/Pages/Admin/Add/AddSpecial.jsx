// ✅ AddSpecial.jsx بعد التعديل الكامل 

import React, { useState, useEffect } from "react";
import { db } from "../../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function AddSpecial() {
  const { slug } = useParams();
  const [specialTitle, setSpecialTitle] = useState("");
  const [existingTitle, setExistingTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImageURL, setItemImageURL] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [price, setPrice] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [specialItems, setSpecialItems] = useState([]);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  useEffect(() => {
    const fetchSpecial = async () => {
      const docRef = doc(db, "ReVerse", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.specialTitle) {
          setExistingTitle(data.specialTitle);
          const itemsSnapshot = await getDocs(collection(db, "ReVerse", slug, "specialItems"));
          const items = itemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setSpecialItems(items);
        }
      }
    };
    fetchSpecial();
  }, [slug]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsImageUploading(true);
    toast.info("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_upload");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dwupyymoc/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const publicId = data.public_id;
      const version = data.version;
      const imageUrl = `https://res.cloudinary.com/dwupyymoc/image/upload/f_auto,q_auto,w_400,dpr_auto/v${version}/${publicId}.jpg`;
      setItemImageURL(imageUrl);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleAddTitle = async () => {
    if (existingTitle) {
      toast.error("Special title already exists. Delete it first.");
      return;
    }
    if (!specialTitle.trim()) {
      toast.error("Please enter special title");
      return;
    }
    try {
      await updateDoc(doc(db, "ReVerse", slug), {
        specialTitle: specialTitle,
      });
      setExistingTitle(specialTitle);
      toast.success("Special title added");
    } catch {
      toast.error("Failed to save title");
    }
  };

  const handleAddItem = async () => {
    if (!existingTitle) {
      toast.error("You must add a special title first");
      return;
    }
    if (!itemName || !itemDescription || !itemImageURL || !price) {
      toast.error("Fill all fields");
      return;
    }
    try {
      const newItem = {
        name: itemName,
        description: itemDescription,
        image: itemImageURL,
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        price: parseFloat(price),
        sizes: [{ label: "Standard", price: parseFloat(price) }],
      };
      const docRef = await addDoc(collection(db, "ReVerse", slug, "specialItems"), newItem);
      setSpecialItems((prev) => [...prev, { id: docRef.id, ...newItem }]);
      setItemName("");
      setItemDescription("");
      setItemImageURL("");
      setOldPrice("");
      setPrice("");
      toast.success("Special item added");
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      await deleteDoc(doc(db, "ReVerse", slug, "specialItems", item.id));
      setSpecialItems((prev) => prev.filter((i) => i.id !== item.id));
      setConfirmDeleteItem(null);
      toast.success("Item deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const itemsSnapshot = await getDocs(collection(db, "ReVerse", slug, "specialItems"));
      for (const docSnap of itemsSnapshot.docs) {
        await deleteDoc(doc(db, "ReVerse", slug, "specialItems", docSnap.id));
      }
      await updateDoc(doc(db, "ReVerse", slug), {
        specialTitle: "",
      });
      setSpecialItems([]);
      setExistingTitle("");
      setConfirmDeleteTitle(false);
      toast.success("Special section deleted");
    } catch {
      toast.error("Failed to delete section");
    }
  };

  return (
    // 🟢 JSX + التنسيقات والمودالات كلها تبقى كما هي بدون تغيير
    // انسخيها كما هي من الكود السابق
    
    <div>
      <h2>Add Special Items</h2>

      {!existingTitle ? (
        <div>
          <input
            placeholder="Special Section Title"
            value={specialTitle}
            onChange={(e) => setSpecialTitle(e.target.value)}
          />
          <button onClick={handleAddTitle}>Save Title</button>
        </div>
      ) : (
        <div>
          <h3>{existingTitle}</h3>
          <button onClick={() => setConfirmDeleteTitle(true)}>Delete</button>
        </div>
      )}

      {existingTitle && (
        <div>
          <input
            placeholder="Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
          <input
            placeholder="Old Price"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            type="number"
          />
          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
          />
          <input
            type="file"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
          {itemImageURL && <img src={itemImageURL} width="100" alt="Preview" />}
          <button onClick={handleAddItem} disabled={isImageUploading}>
            Add Item
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {specialItems.map((item, index) => (
              <div
                key={index}
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
                    gridTemplateColumns: "80px 1fr 120px 50px",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
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
                    <strong>{item.name}</strong>
                    <span style={{ fontSize: "13px", color: "gray" }}>
                      {item.description.length > 40
                        ? item.description.slice(0, 40) + "..."
                        : item.description}
                    </span>
                  </div>
                  <span>
                    {item.oldPrice && (
                      <s style={{ color: "red", marginRight: "8px" }}>
                        ${item.oldPrice}
                      </s>
                    )}
                    <b>${item.price}</b>
                  </span>
                  <div>
                    <button
                      onClick={() => setConfirmDeleteItem(item)}
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مودال حذف القسم كامل */}
      {confirmDeleteTitle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px 30px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "20px", fontSize: "16px" }}>
              Are you sure you want to delete the entire section{" "}
              <strong>"{existingTitle}"</strong>?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button
                onClick={handleDeleteAll}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDeleteTitle(false)}
                style={{
                  background: "gray",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال حذف عنصر واحد */}
      {confirmDeleteItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px 30px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "20px", fontSize: "16px" }}>
              Are you sure you want to delete{" "}
              <strong>"{confirmDeleteItem.name}"</strong>?
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <button
                onClick={() => handleDeleteItem(confirmDeleteItem)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDeleteItem(null)}
                style={{
                  background: "gray",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSpecial;