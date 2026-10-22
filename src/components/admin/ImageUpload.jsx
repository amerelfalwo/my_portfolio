import { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2, Link2, CheckCircle2, AlertCircle } from 'lucide-react';

const ImageUpload = ({ value, onUploadComplete, label = 'Image Asset' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setError(null);

    // Validate Cloudinary env variables
    if (!cloudName || !uploadPreset) {
      console.warn('Cloudinary env variables missing. Falling back to URL input.');
      setError('Cloudinary credentials missing in .env. Enter image URL manually below.');
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
        throw new Error(data.error?.message || 'Failed to upload image to Cloudinary.');
      }

      if (data.secure_url) {
        onUploadComplete(data.secure_url);
      } else {
        throw new Error('No secure URL returned from Cloudinary');
      }
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      setError(err.message || 'Upload failed. Try direct URL fallback.');
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
      onUploadComplete(manualUrl.trim());
      setManualUrl('');
      setError(null);
    }
  };

  const clearImage = () => {
    onUploadComplete('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase text-slate-400 font-mono tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
        >
          <Link2 size={12} />
          <span>{showUrlFallback ? 'Upload File' : 'Paste Direct URL'}</span>
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Preview Active State */}
      {value ? (
        <div className="relative group rounded-lg bg-slate-950 border border-slate-800 overflow-hidden p-2 flex items-center gap-4">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-lg border border-slate-800"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 size={14} />
              <span>Image Attached</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">{value}</p>
          </div>

          <button
            type="button"
            onClick={clearImage}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:border-red-500/40 text-slate-400 hover:text-red-400 border border-slate-700 transition-all cursor-pointer mr-1"
            title="Remove Image"
          >
            <X size={16} />
          </button>
        </div>
      ) : showUrlFallback ? (
        /* Manual URL Fallback Input */
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleManualUrlSubmit}
            disabled={!manualUrl.trim()}
            className="px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase disabled:opacity-40 transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : (
        /* Dropzone / Upload Area */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all p-6 flex flex-col items-center justify-center text-center ${
            dragActive
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-slate-300 font-mono">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <UploadCloud size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Click to upload or drag & drop image
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Direct unsigned upload (PNG, JPG, WEBP, GIF up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
