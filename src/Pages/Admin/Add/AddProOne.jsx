// 📁 AddProOne.jsx
import React from "react";

function AddProOne({
  name,
  description,
  sizes,
  useUnifiedSize,
  unifiedPrice,
  category,
  categoriesList,
  uploadedImageURL,
  imageFile,
  isImageUploading,
  setName,
  setDescription,
  setSizes,
  setUseUnifiedSize,
  setUnifiedPrice,
  setCategory,
  setImageFile,
  setUploadedImageURL,
  handleImageUpload,
  handleSubmit
}) {
  return (
    <form onSubmit={handleSubmit}>
      <p>Please upload main image:</p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImageFile(file);
          handleImageUpload(file);
        }}
      />

      {uploadedImageURL && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={uploadedImageURL}
            alt="Uploaded Preview"
            style={{ width: "200px", border: "1px solid #ccc" }}
          />
          <br />
          <button
            type="button"
            onClick={() => {
              setUploadedImageURL("");
              setImageFile(null);
            }}
          >
            Change Image
          </button>
        </div>
      )}

      <p>Product name:</p>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Product description:</p>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <p>Select sizes and prices:</p>

      <label>
        <input
          type="checkbox"
          checked={useUnifiedSize}
          onChange={() => {
            setUseUnifiedSize((prev) => !prev);
            setUnifiedPrice("");
          }}
        />
        Standard
      </label>
      {useUnifiedSize && (
        <input
          type="number"
          placeholder="Price"
          value={unifiedPrice}
          onChange={(e) => setUnifiedPrice(e.target.value)}
          style={{ marginLeft: "10px", marginBottom: "10px" }}
        />
      )}

      {["S", "M", "L"].map((sizeKey) => (
        <div key={sizeKey} style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={sizes[sizeKey].selected}
              disabled={useUnifiedSize}
              onChange={() =>
                setSizes((prev) => ({
                  ...prev,
                  [sizeKey]: {
                    ...prev[sizeKey],
                    selected: !prev[sizeKey].selected,
                    price: !prev[sizeKey].selected ? "" : prev[sizeKey].price,
                  },
                }))
              }
            />
            {sizeKey}
          </label>

          {sizes[sizeKey].selected && !useUnifiedSize && (
            <input
              type="number"
              placeholder={`Price for ${sizeKey}`}
              value={sizes[sizeKey].price}
              onChange={(e) =>
                setSizes((prev) => ({
                  ...prev,
                  [sizeKey]: {
                    ...prev[sizeKey],
                    price: e.target.value,
                  },
                }))
              }
              style={{ marginLeft: "10px" }}
            />
          )}
        </div>
      ))}

      <p>Product Category:</p>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categoriesList.map((cat, index) => (
          <option key={index} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProOne;

// 📁 AddProduct.jsx → سيتم توليده لاحقًا بناءً على الكومبوننتات دي
