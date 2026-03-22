import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { album, artista, imagen } = body;

    if (!album?.trim() || !artista?.trim()) {
      return NextResponse.json(
        { error: "Album y artista son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("discos")
      .insert([
        {
          album: album.trim(),
          artista: artista.trim(),
          imagen: (imagen || "").trim(),
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
