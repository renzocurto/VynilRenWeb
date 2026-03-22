"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface AddDiscoProps {
  onClose: () => void;
}

export default function AddDisco({ onClose }: AddDiscoProps) {
  const router = useRouter();
  const [step, setStep] = useState<"pin" | "form">("pin");
  const [pin, setPin] = useState("");
  const [album, setAlbum] = useState("");
  const [artista, setArtista] = useState("");
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        setError("Código incorrecto");
        setPin("");
        return;
      }

      setStep("form");
    } catch {
      setError("Error al verificar código");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/discos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album, artista, imagen, pin }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          setStep("pin");
          setPin("");
        }
        throw new Error(data.error || "Error al agregar");
      }

      router.refresh();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar disco");
    } finally {
      setLoading(false);
    }
  };

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
          className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-200 ${
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

          <div className="p-6">
            {step === "pin" ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Agregar disco
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Ingresá el código de acceso
                </p>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Código"
                    autoFocus
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-center text-lg tracking-widest"
                  />

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verificando...
                      </span>
                    ) : (
                      "Continuar"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-5">
                  Agregar disco
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Artista *
                    </label>
                    <input
                      type="text"
                      value={artista}
                      onChange={(e) => setArtista(e.target.value)}
                      placeholder="Ej: Pink Floyd"
                      required
                      autoFocus
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Album *
                    </label>
                    <input
                      type="text"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      placeholder="Ej: The Dark Side of the Moon"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de imagen
                      <span className="text-gray-400 font-normal">
                        {" "}
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="url"
                      value={imagen}
                      onChange={(e) => setImagen(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Si no la ponés, se usa la tapa de Spotify
                    </p>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Agregando...
                      </span>
                    ) : (
                      "Agregar disco"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modal, document.body)
    : null;
}
