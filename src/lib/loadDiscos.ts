import { supabase } from "./supabase";

export interface Disco {
  id?: number;
  album: string;
  artista: string;
  imagen: string;
}

export async function loadDiscos(): Promise<Disco[]> {
  const { data, error } = await supabase
    .from("discos")
    .select("*")
    .order("artista", { ascending: true })
    .order("album", { ascending: true });

  if (error) {
    console.error("Error loading discos:", error);
    return [];
  }

  return data || [];
}
