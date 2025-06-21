
// 📁 AddCategory.jsx
import React from "react";

function AddCategory({
  categoryImageURL,
  newCategoryName,
  setNewCategoryName,
  setCategoryImageURL,
  handleCategoryImageUpload,
  handleAddCategory,
  categorySectionRef
}) {
  return (
    <div
      ref={categorySectionRef}
      style={{
        marginTop: "40px",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Add Category</h3>
      <p style={{ fontSize: "14px", color: "#777" }}>
        Preferred image ratio is <strong>1:1</strong> (square).
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleCategoryImageUpload(file);
        }}
      />

      {categoryImageURL && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={categoryImageURL}
            alt="Category Preview"
            style={{ width: "150px", border: "1px solid #ccc" }}
          />
          <br />
          <button
            type="button"
            onClick={() => {
              setCategoryImageURL("");
            }}
          >
            Change Image
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Category Name"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        style={{ marginTop: "10px" }}
      />
      <br />

      <button
        type="button"
        style={{ marginTop: "10px" }}
        onClick={handleAddCategory}
      >
        Add Category
      </button>
    </div>
  );
}

export default AddCategory;


