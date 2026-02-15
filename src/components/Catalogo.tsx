"use client";

import { useState, useMemo } from "react";
import type { Disco } from "@/lib/loadDiscos";
import SearchBar from "./SearchBar";
import DiscoCard from "./DiscoCard";
import RandomDisco from "./RandomDisco";
import DiscoDetail from "./DiscoDetail";

interface CatalogoProps {
  discos: Disco[];
}

export default function Catalogo({ discos }: CatalogoProps) {
  const [search, setSearch] = useState("");
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return discos;
    const term = search.toLowerCase();
    return discos.filter(
      (d) =>
        d.album.toLowerCase().includes(term) ||
        d.artista.toLowerCase().includes(term)
    );
  }, [discos, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
            Mis Vinilos
          </h1>
          <div className="flex-1 w-full sm:w-auto">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <RandomDisco discos={discos} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length} {filtered.length === 1 ? "disco" : "discos"}
          {search && ` encontrados`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No se encontraron discos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((disco, i) => (
              <DiscoCard
                key={`${disco.album}-${disco.artista}-${i}`}
                disco={disco}
                onClick={() => setSelectedDisco(disco)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedDisco && (
        <DiscoDetail
          disco={selectedDisco}
          onClose={() => setSelectedDisco(null)}
        />
      )}
    </div>
  );
}
