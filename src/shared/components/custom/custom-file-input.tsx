'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, X, Eye } from 'lucide-react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

function truncateFileName(name: string, maxLength = 30) {
  if (name.length <= maxLength) return name;
  const start = name.slice(0, 20);
  const end = name.slice(-10);
  return `${start}...${end}`;
}

interface CustomFileInputProps {
  id: string;
  onChange: (file: File | null) => void;
  value?: File | null;
}

export default function CustomFileInput({
  id,
  onChange,
  value,
}: CustomFileInputProps) {
  const [fileName, setFileName] = useState<string | null>(
    value ? value.name : null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setFileName(value ? value.name : null);
    if (value && value.type.startsWith('image/')) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  return (
    <>
      <Input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFileName(file ? file.name : null);
          onChange(file);
        }}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <Label
          htmlFor={id}
          className="flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 flex-1"
        >
          {fileName ? (
            <>
              <FileText className="w-4 h-4 shrink-0 text-blue-500" />
              <span className="truncate">{truncateFileName(fileName)}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 shrink-0" />
              <span>Upload file</span>
            </>
          )}
        </Label>

        {fileName && previewUrl && (
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="p-2 rounded-md border hover:bg-gray-100 text-gray-500"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {fileName && (
          <button
            type="button"
            onClick={() => {
              setFileName(null);
              setPreviewUrl(null);
              setShowPreview(false);
              onChange(null);
              const fileInput = document.getElementById(id) as HTMLInputElement;
              if (fileInput) {
                fileInput.value = '';
              }
            }}
            className="p-2 rounded-md border hover:bg-gray-100 text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showPreview && previewUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs w-full relative">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
