import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function getSpotifyImage(album: string, artista: string): Promise<string> {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) return "";

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return "";

    let query = encodeURIComponent(`album:${album} artist:${artista}`);
    let searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=album&limit=5`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    let searchData = await searchRes.json();
    let albums = searchData.albums?.items;

    if (!albums || albums.length === 0) {
      query = encodeURIComponent(`${album} ${artista}`);
      searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=album&limit=5`,
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
      );
      searchData = await searchRes.json();
      albums = searchData.albums?.items;
    }

    return albums?.[0]?.images?.[0]?.url || "";
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { album, artista, imagen, pin } = body;

    // Verificar PIN
    const adminPin = process.env.ADMIN_PIN;
    if (!adminPin || pin !== adminPin) {
      return NextResponse.json(
        { error: "Código incorrecto" },
        { status: 401 }
      );
    }

    if (!album?.trim() || !artista?.trim()) {
      return NextResponse.json(
        { error: "Album y artista son requeridos" },
        { status: 400 }
      );
    }

    // Si no hay imagen, buscar la tapa en Spotify
    let finalImagen = (imagen || "").trim();
    if (!finalImagen) {
      finalImagen = await getSpotifyImage(album.trim(), artista.trim());
    }

    const { data, error } = await supabase
      .from("discos")
      .insert([
        {
          album: album.trim(),
          artista: artista.trim(),
          imagen: finalImagen,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al agregar disco" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const { error } = await supabase
      .from("discos")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar disco" },
      { status: 500 }
    );
  }
}
