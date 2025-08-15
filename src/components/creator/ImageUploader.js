"use client";
import { useState, useEffect } from 'react';

export default function ImageUploader({ onImageSelected, initialPreview }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Set preview image when initialPreview is provided
    if (initialPreview) {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelected(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mt-1 flex items-center">
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <label
          htmlFor="image"
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
        >
          Choose image
        </label>
        <span className="ml-3 text-sm text-gray-500">
          {preview ? 'Image selected' : 'No file chosen'}
        </span>
      </div>
      
      {preview && (
        <div className="mt-3">
          <img src={preview} alt="Preview" className="h-40 rounded-md object-cover" />
        </div>
      )}
    </div>
  );
}
