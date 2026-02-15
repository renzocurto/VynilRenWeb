"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Disco } from "@/lib/loadDiscos";

interface Track {
  number: number;
  name: string;
  duration: string;
}

interface SpotifyData {
  found: boolean;
  spotifyUrl?: string;
  image?: string;
  releaseDate?: string;
  tracks?: Track[];
}

interface DiscoDetailProps {
  disco: Disco;
  onClose: () => void;
}

export default function DiscoDetail({ disco, onClose }: DiscoDetailProps) {
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const params = new URLSearchParams({
          album: disco.album,
          artista: disco.artista,
        });
        const res = await fetch(`/api/spotify?${params}`);
        const data = await res.json();
        setSpotify(data);
      } catch {
        setSpotify({ found: false });
      } finally {
        setLoading(false);
      }
    };
    fetchSpotify();
  }, [disco]);

  const close = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const coverImage = spotify?.image || disco.imagen;

  const modal = (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={close}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div
          className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden transition-all duration-200 ${
            isVisible ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-gray-600 hover:bg-white hover:text-gray-900 transition-colors text-lg"
          >
            &times;
          </button>

          <div className="shrink-0 aspect-square bg-gray-50 max-h-[40vh] overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={`${disco.album} - ${disco.artista}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-20"
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

          <div className="flex-1 overflow-y-auto p-5">
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {disco.album}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{disco.artista}</p>
              {spotify?.releaseDate && (
                <p className="text-gray-400 text-xs mt-1">
                  {spotify.releaseDate.substring(0, 4)}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              </div>
            ) : spotify?.found && spotify.tracks ? (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tracklist
                </h4>
                <ul className="space-y-1">
                  {spotify.tracks.map((track) => (
                    <li
                      key={track.number}
                      className="flex items-center gap-3 py-1.5 text-sm"
                    >
                      <span className="text-gray-300 w-5 text-right text-xs">
                        {track.number}
                      </span>
                      <span className="flex-1 text-gray-700 truncate">
                        {track.name}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {track.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">
                No se encontró en Spotify
              </p>
            )}

            {spotify?.spotifyUrl && (
              <a
                href={spotify.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-[#1DB954] text-white rounded-full text-sm font-medium hover:bg-[#1aa34a] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Escuchar en Spotify
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined" ? createPortal(modal, document.body) : null;
}
