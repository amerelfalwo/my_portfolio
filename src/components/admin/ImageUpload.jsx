import { useState, useRef } from 'react';
import { UploadCloud, X, Link2, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input } from './ui';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ImageUpload = ({
  value,
  currentImage,
  onUploadComplete,
  onImageChange,
  label = 'Image asset',
}) => {
  const activeValue = value !== undefined ? value : (currentImage || '');
  const handleComplete = onUploadComplete || onImageChange || (() => {});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Unsupported file type. Please upload a PNG, JPEG, WebP, or SVG.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File exceeds 5MB limit. Please upload a smaller image.');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setError(null);

    try {
      validateFile(file);
    } catch (valErr) {
      setError(valErr.message);
      return;
    }

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary upload keys not configured. Please paste a direct image URL below.');
      setShowUrlFallback(true);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error?.message || 'Failed to upload image.');
      }

      if (data.secure_url) {
        handleComplete(data.secure_url);
      } else {
        throw new Error('No secure URL returned from upload provider.');
      }
    } catch (err) {
      console.error('Image Upload Error:', err);
      setError(err.message || 'Upload failed. Try entering a direct image URL.');
      setShowUrlFallback(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      handleComplete(manualUrl.trim());
      setManualUrl('');
      setError(null);
    }
  };

  return (
    <div className="space-y-2 text-start">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Link2 size={12} />
          <span>{showUrlFallback ? 'Upload file' : 'Direct URL'}</span>
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Card */}
      {activeValue ? (
        <div className="rounded-lg bg-surface border border-border p-3 flex items-center gap-4">
          <img
            src={activeValue}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-lg border border-border bg-surface-muted"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Attached image</p>
            <p className="text-xs text-muted truncate mt-0.5">{activeValue}</p>
          </div>
          <button
            type="button"
            onClick={() => handleComplete('')}
            className="p-1.5 rounded-lg border border-border text-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            title="Remove image"
          >
            <X size={15} />
          </button>
        </div>
      ) : showUrlFallback ? (
        /* Manual URL input */
        <div className="flex gap-2">
          <Input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.webp"
            className="flex-1"
          />
          <Button variant="secondary" onClick={handleManualUrlSubmit}>
            Set URL
          </Button>
        </div>
      ) : (
        /* Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-foreground bg-surface-muted'
              : 'border-border hover:border-foreground/40 bg-surface'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-foreground" />
              <p className="text-xs text-muted">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <UploadCloud className="w-6 h-6 text-muted" />
              <p className="text-xs font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-[11px] text-muted">
                PNG, JPEG, WebP or SVG up to 5MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
