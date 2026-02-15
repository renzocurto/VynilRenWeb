import { NextRequest, NextResponse } from "next/server";

interface SpotifyToken {
  access_token: string;
  expires_at: number;
}

let cachedToken: SpotifyToken | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!data.access_token) {
    throw new Error(`Spotify token error: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const album = searchParams.get("album");
  const artista = searchParams.get("artista");

  if (!album || !artista) {
    return NextResponse.json({ error: "Faltan parametros" }, { status: 400 });
  }

  try {
    const token = await getAccessToken();

    // Intentar busqueda con prefijos album: artist:
    let query = encodeURIComponent(`album:${album} artist:${artista}`);
    let searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=album&limit=5`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    let searchData = await searchRes.json();

    let albums = searchData.albums?.items;

    // Si no encuentra, intentar busqueda simple sin prefijos
    if (!albums || albums.length === 0) {
      query = encodeURIComponent(`${album} ${artista}`);
      searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=album&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      searchData = await searchRes.json();
      albums = searchData.albums?.items;
    }

    if (!albums || albums.length === 0) {
      return NextResponse.json({ found: false });
    }

    const spotifyAlbum = albums[0];

    // Obtener tracks del album
    const tracksRes = await fetch(
      `https://api.spotify.com/v1/albums/${spotifyAlbum.id}/tracks?limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    const tracksData = await tracksRes.json();

    const tracks = (tracksData.items || []).map(
      (t: { name: string; duration_ms: number; track_number: number }) => ({
        number: t.track_number,
        name: t.name,
        duration: formatDuration(t.duration_ms),
      })
    );

    return NextResponse.json({
      found: true,
      spotifyUrl: spotifyAlbum.external_urls?.spotify || null,
      image: spotifyAlbum.images?.[0]?.url || null,
      releaseDate: spotifyAlbum.release_date || null,
      tracks,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Error al buscar en Spotify", detail: message },
      { status: 500 }
    );
  }
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
