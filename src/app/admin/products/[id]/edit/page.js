"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateProduct, getProductById } from '@/app/actions/product';
import {
  RefreshCw,
  ImagePlus,
  X,
  Loader2,
  ArrowLeft,
  DollarSign,
  Tag,
  AlignLeft,
  Star,
} from 'lucide-react';

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
}

function ImageUploadBox({ label, hint, multiple, onFiles, previews, onRemove }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length) onFiles(multiple ? files : [files[0]]);
  }, [multiple, onFiles]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onFiles(multiple ? files : [files[0]]);
    e.target.value = '';
  };

  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-1">{label}</p>
      {hint && <p className="text-[10px] text-slate-600 mb-3 uppercase tracking-wide">{hint}</p>}

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 border border-dashed p-6 cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-white/40 bg-white/5'
            : 'border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4'
        }`}
      >
        <input type="file" accept="image/*" multiple={multiple} onChange={handleChange} className="hidden" />
        <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/4">
          <ImagePlus size={16} className="text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Drop {multiple ? 'images' : 'image'} or <span className="text-white">browse</span>
          </p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mt-1">PNG · JPG · WEBP</p>
        </div>
      </label>

      {previews && previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previews.map((src, i) => (
            <div key={i} className="relative group w-20 h-20 overflow-hidden border border-white/10">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputCls =
  'w-full bg-white/3 border border-white/8 px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-white/25 focus:bg-white/5 transition text-sm font-medium tracking-wide';

function InputField({ label, required, children }) {
  return (
    <div>
      <label className="block text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">
        {label}{required && <span className="text-white ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price1: '',
    price2: '',
    price3: '',
    originalPrice: '',
    isMostWanted: false,
  });

  const [existingFront, setExistingFront] = useState('');
  const [existingBack, setExistingBack] = useState('');
  const [existingGallery, setExistingGallery] = useState([]);

  const [frontFile, setFrontFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState('');
  const [backFile, setBackFile] = useState(null);
  const [backPreview, setBackPreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getProductById(productId);
      if (data) {
        setForm({
          title: data.title || '',
          description: data.description || '',
          price1: data.price1 || '',
          price2: data.price2 || '',
          price3: data.price3 || '',
          originalPrice: data.originalPrice || '',
          isMostWanted: data.isMostWanted || false,
        });
        setExistingFront(data.frontImage || data.image || '');
        setExistingBack(data.backImage || '');
        setExistingGallery(data.galleryImages || []);
      }
      setFetchLoading(false);
    }
    load();
  }, [productId]);

  const setFileWithPreview = (file, setFile, setPreview) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const addGalleryFiles = (files) => {
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewGallery = (idx) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus('uploading');

    try {
      const [frontUrl, backUrl, ...newGalleryUrls] = await Promise.all([
        frontFile ? uploadToCloudinary(frontFile) : Promise.resolve(null),
        backFile ? uploadToCloudinary(backFile) : Promise.resolve(null),
        ...galleryFiles.map((f) => uploadToCloudinary(f)),
      ]);

      setUploadStatus('done');

      const res = await updateProduct(productId, {
        ...form,
        frontImage: frontUrl || existingFront,
        backImage: backUrl || existingBack,
        galleryImages: [
          ...existingGallery,
          ...newGalleryUrls.filter(Boolean),
        ],
      });

      if (res.success) {
        router.push('/admin/products');
      } else {
        alert('Error: ' + res.error);
        setLoading(false);
        setUploadStatus('');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
      setLoading(false);
      setUploadStatus('');
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-60 gap-3">
        <Loader2 size={16} className="animate-spin text-slate-500" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="border-b border-white/8 pb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">Products</p>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            Edit Product
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mt-2">
            Update product details and images
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 border border-white/15 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-white hover:text-[#050b14] hover:border-white transition-all duration-300"
        >
          <ArrowLeft size={12} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section: Product Info */}
        <div className="bg-[#07101f] border border-white/8 overflow-hidden">
          <div className="border-b border-white/8 px-7 py-4 flex items-center gap-3">
            <div className="w-6 h-6 border border-white/10 flex items-center justify-center bg-white/3">
              <Tag size={11} className="text-slate-400" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Product Info</p>
          </div>

          <div className="p-7 space-y-6">
            <InputField label="Product Title" required>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </InputField>

            <InputField label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls + ' resize-none'}
              />
            </InputField>
          </div>
        </div>

        {/* Section: Pricing */}
        <div className="bg-[#07101f] border border-white/8 overflow-hidden">
          <div className="border-b border-white/8 px-7 py-4 flex items-center gap-3">
            <div className="w-6 h-6 border border-white/10 flex items-center justify-center bg-white/3">
              <DollarSign size={11} className="text-slate-400" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Pricing (TND)</p>
          </div>

          <div className="p-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Price × 1 (TND)" required>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price1}
                  onChange={(e) => setForm({ ...form, price1: e.target.value })}
                  className={inputCls}
                />
              </InputField>
              <InputField label="Price × 2 — Bundle (TND)" required>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price2}
                  onChange={(e) => setForm({ ...form, price2: e.target.value })}
                  className={inputCls}
                />
              </InputField>
              <InputField label="Price × 3+ — Added Value (TND)" required>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price3}
                  onChange={(e) => setForm({ ...form, price3: e.target.value })}
                  className={inputCls}
                />
              </InputField>
              <InputField label="Original Price — Strikethrough (TND)">
                <input
                  type="number"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  className={inputCls}
                />
              </InputField>
            </div>

            {/* Most Wanted toggle */}
            <div className="border border-white/8 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star size={13} className="text-slate-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Most Wanted</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">Featured badge shown in the shop</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, isMostWanted: !form.isMostWanted })}
                className={`relative w-11 h-6 transition-all duration-300 border ${
                  form.isMostWanted ? 'bg-white border-white' : 'bg-white/5 border-white/15'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 transition-all duration-300 ${
                    form.isMostWanted ? 'bg-[#050b14] left-6' : 'bg-slate-500 left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section: Images */}
        <div className="bg-[#07101f] border border-white/8 overflow-hidden">
          <div className="border-b border-white/8 px-7 py-4 flex items-center gap-3">
            <div className="w-6 h-6 border border-white/10 flex items-center justify-center bg-white/3">
              <ImagePlus size={11} className="text-slate-400" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Images</p>
          </div>

          <div className="p-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Front image */}
              <div className="space-y-3">
                {existingFront && !frontPreview && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Current Front</p>
                    <div className="relative w-24 h-24 overflow-hidden border border-white/10">
                      <img src={existingFront} alt="front" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-center py-1 text-slate-400 uppercase tracking-wider font-bold">Current</span>
                    </div>
                  </div>
                )}
                <ImageUploadBox
                  label={existingFront ? 'Replace Front Image' : 'Front Image'}
                  hint={existingFront ? 'Upload to replace the current front photo' : 'Primary product photo (front of t-shirt)'}
                  onFiles={([f]) => setFileWithPreview(f, setFrontFile, setFrontPreview)}
                  previews={frontPreview ? [frontPreview] : []}
                  onRemove={() => { setFrontFile(null); setFrontPreview(''); }}
                />
              </div>

              {/* Back image */}
              <div className="space-y-3">
                {existingBack && !backPreview && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Current Back</p>
                    <div className="relative w-24 h-24 overflow-hidden border border-white/10">
                      <img src={existingBack} alt="back" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-center py-1 text-slate-400 uppercase tracking-wider font-bold">Current</span>
                    </div>
                  </div>
                )}
                <ImageUploadBox
                  label={existingBack ? 'Replace Back Image' : 'Back Image'}
                  hint={existingBack ? 'Upload to replace the hover image' : 'Back of t-shirt — shown on hover'}
                  onFiles={([f]) => setFileWithPreview(f, setBackFile, setBackPreview)}
                  previews={backPreview ? [backPreview] : []}
                  onRemove={() => { setBackFile(null); setBackPreview(''); }}
                />
              </div>
            </div>

            {/* Existing gallery */}
            {existingGallery.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-3">Current Gallery</p>
                <div className="flex flex-wrap gap-3">
                  {existingGallery.map((src, i) => (
                    <div key={i} className="relative group w-20 h-20 overflow-hidden border border-white/10">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ImageUploadBox
              label="Add Gallery Images"
              hint="These will be appended to the existing gallery"
              multiple
              onFiles={addGalleryFiles}
              previews={galleryPreviews}
              onRemove={removeNewGallery}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">
            {loading
              ? uploadStatus === 'uploading'
                ? '⟳ Uploading images...'
                : '⟳ Saving changes...'
              : 'All fields marked * are required'}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-white text-[#050b14] text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                Update Product
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
