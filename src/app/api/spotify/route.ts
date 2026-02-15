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

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
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

    // Buscar album en Spotify
    const query = encodeURIComponent(`album:${album} artist:${artista}`);
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const searchData = await searchRes.json();

    const albums = searchData.albums?.items;
    if (!albums || albums.length === 0) {
      return NextResponse.json({ found: false });
    }

    const spotifyAlbum = albums[0];

    // Obtener tracks del album
    const tracksRes = await fetch(
      `https://api.spotify.com/v1/albums/${spotifyAlbum.id}/tracks?limit=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const tracksData = await tracksRes.json();

    const tracks = tracksData.items.map(
      (t: { name: string; duration_ms: number; track_number: number }) => ({
        number: t.track_number,
        name: t.name,
        duration: formatDuration(t.duration_ms),
      })
    );

    return NextResponse.json({
      found: true,
      spotifyUrl: spotifyAlbum.external_urls.spotify,
      image: spotifyAlbum.images?.[0]?.url || null,
      releaseDate: spotifyAlbum.release_date,
      tracks,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al buscar en Spotify" },
      { status: 500 }
    );
  }
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
