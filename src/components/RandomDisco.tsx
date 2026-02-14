"use client";

import { useState } from "react";
import type { Disco } from "@/lib/loadDiscos";

interface RandomDiscoProps {
  discos: Disco[];
}

export default function RandomDisco({ discos }: RandomDiscoProps) {
  const [selected, setSelected] = useState<Disco | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const pickRandom = () => {
    if (discos.length === 0) return;
    const random = discos[Math.floor(Math.random() * discos.length)];
    setSelected(random);
    setIsVisible(true);
  };

  const close = () => {
    setIsVisible(false);
    setTimeout(() => setSelected(null), 200);
  };

  return (
    <>
      <button
        onClick={pickRandom}
        className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-700 active:scale-95 transition-all duration-150 shadow-sm"
      >
        Disco Aleatorio
      </button>

      {selected && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-200 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={close}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div
              className={`relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transition-all duration-200 ${
                isVisible ? "scale-100" : "scale-95"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              >
                &times;
              </button>

              <div className="aspect-square bg-gray-50">
                {selected.imagen ? (
                  <img
                    src={selected.imagen}
                    alt={`${selected.album} - ${selected.artista}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-24 h-24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6 text-center">
                <h3 className="font-bold text-gray-900 text-xl">
                  {selected.album}
                </h3>
                <p className="text-gray-500 mt-1 text-base">
                  {selected.artista}
                </p>
                <button
                  onClick={pickRandom}
                  className="mt-5 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Otro disco
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
