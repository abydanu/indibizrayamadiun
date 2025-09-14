'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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

export default function CustomFileInput({ id, onChange, value }: CustomFileInputProps) {
  const [fileName, setFileName] = useState<string | null>(value ? value.name : null);

  useEffect(() => {
    setFileName(value ? value.name : null);
  }, [value]);

  return (
    <>
      <Input
        id={id}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFileName(file ? file.name : null);
          onChange(file);
        }}
      />

      <div className="flex items-center gap-2">
        <Label
          htmlFor={id}
          className="flex items-center gap-2 border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 w-full"
        >
          {fileName ? (
            <>
              <FileText className="w-4 h-4 shrink-0 text-blue-500" />
              <span>{truncateFileName(fileName)}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 shrink-0" />
              <span>Upload file</span>
            </>
          )}
        </Label>

        {fileName && (
          <button
            type="button"
            onClick={() => {
              setFileName(null);
              onChange(null);
              // Reset file input
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
    </>
  );
}
