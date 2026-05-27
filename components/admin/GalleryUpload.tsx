'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  url: string;
  alt: string;
  order: number;
}

interface Props {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export default function GalleryUpload({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList) {
    setError('');
    setUploading(true);
    const uploaded: GalleryImage[] = [];

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        uploaded.push({ url: data.url, alt: '', order: images.length + uploaded.length });
      } catch (err: any) {
        setError(err.message);
      }
    }

    setUploading(false);
    if (uploaded.length) onChange([...images, ...uploaded]);
  }

  function remove(index: number) {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
    onChange(next);
  }

  function updateAlt(index: number, alt: string) {
    const next = images.map((img, i) => i === index ? { ...img, alt } : img);
    onChange(next);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  return (
    <div className="space-y-4">
      {/* Uploaded grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={img.url} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || 'Gallery image'} className="w-full h-36 object-cover" />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded text-white text-xs disabled:opacity-30 flex items-center justify-center"
                      title="Move left"
                    >‹</button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === images.length - 1}
                      className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded text-white text-xs disabled:opacity-30 flex items-center justify-center"
                      title="Move right"
                    >›</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="w-6 h-6 bg-red-600/80 hover:bg-red-600 rounded text-white text-xs flex items-center justify-center"
                    title="Remove"
                  >✕</button>
                </div>
                <span className="text-white/60 text-xs text-center">{i + 1} / {images.length}</span>
              </div>

              {/* Alt text */}
              <input
                type="text"
                value={img.alt}
                onChange={e => updateAlt(i, e.target.value)}
                placeholder="Alt text…"
                className="w-full px-2 py-1.5 bg-slate-800 border-t border-slate-700 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:bg-slate-700 transition-colors"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-slate-400 hover:text-slate-200 text-sm transition-colors w-full justify-center',
          uploading && 'opacity-60 pointer-events-none'
        )}
      >
        {uploading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Images
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={e => e.target.files?.length && uploadFiles(e.target.files)}
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}
      {images.length > 0 && (
        <p className="text-slate-600 text-xs">{images.length} image{images.length !== 1 ? 's' : ''} · hover to reorder or remove · alt text helps with SEO</p>
      )}
    </div>
  );
}
