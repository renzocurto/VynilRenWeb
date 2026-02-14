import type { Disco } from "@/lib/loadDiscos";

interface DiscoCardProps {
  disco: Disco;
}

export default function DiscoCard({ disco }: DiscoCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {disco.imagen ? (
          <img
            src={disco.imagen}
            alt={`${disco.album} - ${disco.artista}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
          {disco.album}
        </h3>
        <p className="text-gray-500 text-sm mt-1 truncate">{disco.artista}</p>
      </div>
    </div>
  );
}
