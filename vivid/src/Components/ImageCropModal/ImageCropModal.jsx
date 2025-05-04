import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import '../../../pages/editProfile/ImageCropModal.css';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to the desired output size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as a blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
};

const ImageCropModal = ({ image, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsUploading(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      // Convert Blob to File
      const croppedFile = new File([croppedImage], "profile.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', croppedFile);
      formData.append('upload_preset', 'vivid_unsigned');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/drvtmc9ps/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        onSave(data.secure_url);
        onClose();
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error saving cropped image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="crop-modal-overlay">
      <div className="crop-modal-content">
        <div className="crop-modal-header">
          <h2>Crop Profile Picture</h2>
          <button className="crop-modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={true}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        
        <div className="crop-controls">
          <div className="zoom-control">
            <label>Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="crop-modal-footer">
          <button onClick={onClose} disabled={isUploading}>Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={isUploading}
            className="save-btn"
          >
            {isUploading ? 'Uploading...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;