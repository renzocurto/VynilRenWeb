"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Buscar por album o artista..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-3 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-base"
      />
    </div>
  );
}
